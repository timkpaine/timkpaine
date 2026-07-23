import asyncio
import logging
import socket
import pyarrow
import pyarrow.json
import threading
import uvicorn
from datetime import datetime, timedelta
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from perspective import (
    PerspectiveWidget,
    Table as PerspectiveTable,
    PerspectiveManager,
    PerspectiveStarletteHandler,
)
from starlette.staticfiles import StaticFiles
from typing import Dict, Union


def find_free_port():
    with socket.socket() as s:
        s.bind(("", 0))
        return s.getsockname()[1]

_psp_arrow_map = {
    int: pyarrow.int64(),
    float: pyarrow.float64(),
    bool: pyarrow.bool_(),
    str: pyarrow.string(),
    datetime: pyarrow.timestamp("us", tz="UTC"),
}
def psp_schema_to_pyarrow_schema(psp_schema):
    return pyarrow.schema([(k, _psp_arrow_map[v]) for k,v in psp_schema.items()])


def perspective_spark_bridge(
    tables: Dict[str, Union[PerspectiveTable, PerspectiveWidget]],
    fastapi_app: FastAPI = None,
):
    app = fastapi_app or FastAPI()
    for table_name in tables:
        @app.websocket(f"/tables/{table_name}")
        async def ws(websocket: WebSocket, table_name=table_name):
            await websocket.accept()
            data = await websocket.receive_json()

            if not data:
                return
            # If we use row-by-row, e.g. _push_to_psp_single in spark.py,
            # we can just do
            # tables[table_name].update([data])

            # But if we want to scale up, lets sacrifice some
            # ugliness for performance by parsing data
            # into arrow tables and loading those into perspective
            # in batches

            # pyarrow expects a file, so make a fake in-memory file
            # and write the data
            io = BytesIO()
            io.write(b"\n".join(d.encode() for d in data))
            io.seek(0)

            # Load in pyarrow using default threadpool
            table = pyarrow.json.read_json(io)

            # Now go from arrow table to bytes of record batch
            stream = pyarrow.BufferOutputStream()
            writer = pyarrow.RecordBatchStreamWriter(stream, table.schema)
            writer.write_table(table)
            writer.close()

            # And finally load this into perspective, GIL-free
            tables[table_name].update(stream.getvalue().to_pybytes())

    return app


def make_perspective_app(manager: PerspectiveManager, app: FastAPI = None):
    """Code to create a Perspective webserver. This code is adapted from
    https://github.com/finos/perspective/blob/master/examples/python-starlette/server.py
    """

    def perspective_thread(manager):
        # This thread runs the perspective processing callback
        psp_loop = asyncio.new_event_loop()
        manager.set_loop_callback(psp_loop.call_soon_threadsafe)
        psp_loop.run_forever()

    thread = threading.Thread(target=perspective_thread, args=(manager,), daemon=True)
    thread.start()

    async def websocket_handler(websocket: WebSocket):
        handler = PerspectiveStarletteHandler(manager=manager, websocket=websocket)
        try:
            await handler.run()
        except Exception:
            ...

    app = app or FastAPI()
    app.add_api_websocket_route("/data", websocket_handler)
    app.mount("/", StaticFiles(directory=".", html=True), name="static")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


def start_server(app: FastAPI, port: int = None, threaded: bool = True):
    port_to_use = port or find_free_port()
    logging.critical(f"Listening on http://localhost:{port_to_use}")
    if threaded:
        thread = threading.Thread(
            target=uvicorn.run,
            args=(app,),
            # kwargs=dict(host="0.0.0.0", port=port_to_use, log_level=50),
            kwargs=dict(host="0.0.0.0", port=port_to_use),
            daemon=True,
        )
        thread.start()
        if port is None:
            return port_to_use
        return thread
    uvicorn.run(app, host="0.0.0.0", port=port_to_use)
