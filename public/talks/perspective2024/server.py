import asyncio
import logging
import threading
from datetime import timedelta

import csp
import uvicorn
from fastapi import FastAPI, WebSocket
from perspective import Server, Table
from perspective.handlers.starlette import PerspectiveStarletteHandler
from starlette.staticfiles import StaticFiles

from csp_nodes import machine_usage, machine_status, machine_jobs, push_to_perspective_table, machines, MACHINE_SCHEMA, USAGE_SCHEMA, STATUS_SCHEMA, JOBS_SCHEMA


SPEED = 1

def make_perspective_app(server: Server):
    async def websocket_handler(websocket: WebSocket): await PerspectiveStarletteHandler(perspective_server=server, websocket=websocket).run()
    app = FastAPI()
    app.add_api_websocket_route("/websocket", websocket_handler)
    app.mount("/", StaticFiles(directory=".", html=True), name="static")
    return app


@csp.graph
def main_graph(machines_table: Table, usage_table: Table, status_table: Table, jobs_table: Table):
    # A randomly generated list of "machines"
    all_machines = machines()

    # construct three ticking nodes for usage, status, and jobs
    usage = machine_usage(all_machines, timedelta(seconds=SPEED))
    status = machine_status(usage, timedelta(seconds=SPEED*5))
    jobs = machine_jobs(all_machines, timedelta(seconds=SPEED*5))

    # push all of our data to 4 separate perspective tables
    push_to_perspective_table(csp.const(all_machines), machines_table)
    push_to_perspective_table(usage, usage_table)
    push_to_perspective_table(status, status_table)
    push_to_perspective_table(jobs, jobs_table)


def run_csp(server: Server):
    loop = asyncio.new_event_loop()
    threading.Thread(target=loop.run_forever, daemon=True).start()
    client = server.new_local_client(loop_callback=loop.call_soon_threadsafe)

    # construct 4 separate perspective tables
    machines_table = client.table(MACHINE_SCHEMA, index="machine_id", name="machines")
    usage_table = client.table(USAGE_SCHEMA, index="machine_id", name="usage")
    status_table = client.table(STATUS_SCHEMA, index="machine_id", name="status")
    jobs_table = client.table(JOBS_SCHEMA, name="jobs")

    # run csp
    logging.critical("running csp...")
    return csp.run_on_thread(main_graph, machines_table, usage_table, status_table, jobs_table, realtime=True, daemon=True)
    # csp.run(main_graph, machines_table, usage_table, status_table, jobs_table, realtime=True)


def main():
    perspective_server = Server()

    app = make_perspective_app(perspective_server)
    run_csp(perspective_server)
    logging.critical("Listening on http://localhost:8080")
    uvicorn.run(app, host="0.0.0.0", port=8080)

if __name__ == "__main__":
    main()
