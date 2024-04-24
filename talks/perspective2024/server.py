import asyncio
import csp
import logging
import threading
import uvicorn
from csp_nodes import machine_usage, machine_status, machine_jobs, push_to_perspective_table, machines, MACHINE_SCHEMA, USAGE_SCHEMA, STATUS_SCHEMA, JOBS_SCHEMA
from datetime import timedelta
from fastapi import FastAPI
from perspective import Table as PerspectiveTable, PerspectiveManager, PerspectiveStarletteHandler

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles


def make_perspective_app(manager: PerspectiveManager):
    '''Code to create a Perspective webserver. This code is adapted from
    https://github.com/finos/perspective/blob/master/examples/python-starlette/server.py

    Args:
        manager (PerspectiveManager): PerspectiveManager instance (hosts the tables)

    Returns:
        app: returns the FastAPI back
    '''
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

    app = FastAPI()
    app.add_api_websocket_route("/websocket", websocket_handler)
    print("mounting static files")
    app.mount("/", StaticFiles(directory=".", html=True), name="static")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app


@csp.graph
def main_graph(
    machines_table: PerspectiveTable,
    usage_table: PerspectiveTable,
    status_table: PerspectiveTable,
    jobs_table: PerspectiveTable,
):
    # A randomly generated list of "machines"
    all_machines = machines()

    # construct three ticking nodes for usage, status, and jobs
    usage = machine_usage(all_machines, timedelta(seconds=1))
    status = machine_status(usage, timedelta(seconds=5))
    jobs = machine_jobs(all_machines, timedelta(seconds=5))

    # push all of our data to 4 separate perspective tables
    push_to_perspective_table(csp.const(all_machines), machines_table)
    push_to_perspective_table(usage, usage_table)
    push_to_perspective_table(status, status_table)
    push_to_perspective_table(jobs, jobs_table)


def run_csp(manager: PerspectiveManager):
    '''Connect to csp to perspective and load data

    Args:
        manager (PerspectiveManager): PerspectiveManager instance (hosts the tables)
    '''
    # construct 4 separate perspective tables
    machines_table = PerspectiveTable(MACHINE_SCHEMA, index="machine_id")
    usage_table = PerspectiveTable(USAGE_SCHEMA, index="machine_id")
    status_table = PerspectiveTable(STATUS_SCHEMA, index="machine_id")
    jobs_table = PerspectiveTable(JOBS_SCHEMA)

    # host these tables
    manager.host_table("machines", machines_table)
    manager.host_table("usage", usage_table)
    manager.host_table("status", status_table)
    manager.host_table("jobs", jobs_table)

    # run csp
    logging.critical("running csp...")
    return csp.run_on_thread(main_graph, machines_table, usage_table, status_table, jobs_table, realtime=True, daemon=True)
    # csp.run(main_graph, machines_table, usage_table, status_table, jobs_table, realtime=True)


def main():
    perspective_manager = PerspectiveManager()

    app = make_perspective_app(perspective_manager)
    run_csp(perspective_manager)
    logging.critical("Listening on http://localhost:8080")
    uvicorn.run(app, host="0.0.0.0", port=8080)

if __name__ == "__main__":
    main()
