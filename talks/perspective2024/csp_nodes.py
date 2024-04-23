import csp
from csp import ts
from datetime import timedelta
from ipywidgets import HBox, VBox
from superstore import (
    machines,
    MACHINE_SCHEMA,
    usage,
    USAGE_SCHEMA,
    status,
    STATUS_SCHEMA,
    jobs,
    JOBS_SCHEMA,
)
from perspective import PerspectiveWidget, Table as PerspectiveTable
from random import random
from typing import List

__all__ = (
    "MACHINE_SCHEMA",
    "machines",
    "USAGE_SCHEMA",
    "usage",
    "STATUS_SCHEMA",
    "status",
    "JOBS_SCHEMA",
    "jobs",
    "machine_usage",
    "machine_status",
    "machine_jobs",
    "push_to_perspective",
    "push_to_perspective_table",
)

MACHINE_SCHEMA = dict(MACHINE_SCHEMA)
USAGE_SCHEMA = dict(USAGE_SCHEMA)
STATUS_SCHEMA = dict(STATUS_SCHEMA)
JOBS_SCHEMA = dict(JOBS_SCHEMA)


@csp.node
def machine_usage(
    machines: List[dict], interval: timedelta = timedelta(seconds=5)
) -> ts[List[dict]]:
    with csp.alarms():
        a_tick = csp.alarm(bool)

    with csp.state():
        s_machines = machines.copy()
        s_machine_usage = {}

    with csp.start():
        csp.schedule_alarm(a_tick, timedelta(), True)

    if csp.ticked(a_tick):
        for machine in s_machines:
            machine_id = machine["machine_id"]
            if machine_id not in s_machine_usage:
                s_machine_usage[machine_id] = machine.copy()
            s_machine_usage[machine_id].update(usage(s_machine_usage[machine_id]))
        csp.output(s_machine_usage.values())
        csp.schedule_alarm(a_tick, interval, True)


@csp.node
def machine_status(
    usage: ts[List[dict]], interval: timedelta = timedelta(seconds=5)
) -> ts[List[dict]]:
    with csp.alarms():
        a_tick = csp.alarm(bool)

    with csp.state():
        csp.make_passive(usage)

    with csp.start():
        csp.schedule_alarm(a_tick, timedelta(), True)

    if csp.ticked(a_tick) and csp.valid(usage):
        ret = []
        for machine in usage:
            ret.append(status(machine))
        csp.output(ret)
        csp.schedule_alarm(a_tick, interval, True)


@csp.node
def machine_jobs(
    machines: List[dict], interval: timedelta = timedelta(seconds=5)
) -> ts[List[dict]]:
    with csp.alarms():
        a_tick = csp.alarm(bool)

    with csp.start():
        csp.schedule_alarm(a_tick, timedelta(), True)

    if csp.ticked(a_tick):
        ret = []
        for machine in machines:
            job = jobs(machine)
            if job:
                ret.append(job)
        csp.output(ret)
        csp.schedule_alarm(a_tick, interval, True)


@csp.node
def push_to_perspective(data: ts[list], widget: PerspectiveWidget):
    if csp.ticked(data):
        widget.update(data)


@csp.node
def push_to_perspective_table(data: ts[list], table: PerspectiveTable):
    if csp.ticked(data):
        table.update(data)
