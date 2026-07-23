import logging
import socket
import threading
import socketserver
from orjson import dumps
from superstore import machines, usage, status, jobs
from time import sleep
import os


# Allows docker to override which HOST to connect to for data
HOST = os.environ.get("DATA_HOST", "localhost")
MACHINES_PORT = 8081
USAGE_PORT = 8082
STATUS_PORT = 8083
JOBS_PORT = 8084


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer): ...


def build_app():
    # Fake data update interval
    interval = 5

    # Create a fake list of machines
    s_machines = machines()

    # Create a fake list of machine usage
    s_machine_usage = {}

    class MachinesHandler(socketserver.BaseRequestHandler):
        def handle(self):
            for machine in s_machines:
                self.request.sendall(dumps(machine) + b"\n")

    class UsageHandler(socketserver.BaseRequestHandler):
        def handle(self):
            while True:
                for machine in s_machines:
                    machine_id = machine["machine_id"]
                    if machine_id not in s_machine_usage:
                        s_machine_usage[machine_id] = machine.copy()
                    s_machine_usage[machine_id].update(
                        usage(s_machine_usage[machine_id])
                    )
                    self.request.sendall(dumps(s_machine_usage[machine_id]) + b"\n")
                sleep(interval)

    class StatusHandler(socketserver.BaseRequestHandler):
        def handle(self):
            while True:
                machine_usage = list(s_machine_usage.values())
                for machine in machine_usage:
                    self.request.sendall(dumps(status(machine)) + b"\n")
                sleep(interval)

    class JobsHandler(socketserver.BaseRequestHandler):
        def handle(self):
            while True:
                for machine in s_machines:
                    job = jobs(machine)
                    if job:
                        self.request.sendall(dumps(job) + b"\n")
                sleep(interval)

    machine_server = ThreadedTCPServer(('0.0.0.0', MACHINES_PORT), MachinesHandler)
    usage_server = ThreadedTCPServer(('0.0.0.0', USAGE_PORT), UsageHandler)
    status_server = ThreadedTCPServer(('0.0.0.0', STATUS_PORT), StatusHandler)
    jobs_server = ThreadedTCPServer(('0.0.0.0', JOBS_PORT), JobsHandler)
    return machine_server, usage_server, status_server, jobs_server


if __name__ == "__main__":
    servers = []
    threads = []
    try:
        for server in build_app():
            ip, port = server.server_address
            logging.critical(f"Starting socket server on http://{ip}:{port}")
            server_thread = threading.Thread(target=server.serve_forever, daemon=True)
            # Exit the server thread when the main thread terminates
            server_thread.start()
            servers.append(server)
            threads.append(server_thread)
        while True:
            sleep(1000)
    except KeyboardInterrupt:
        logging.critical("Shutting down...")
    finally:
        for server, thread in zip(servers, threads):
            server.shutdown()
            thread.join()
