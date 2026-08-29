import os
from pyspark.sql import SparkSession
from perspective import Table as PerspectiveTable, PerspectiveManager
from time import sleep

from helpers.data import (
    HOST,
    MACHINES_PORT,
    USAGE_PORT,
    STATUS_PORT,
    JOBS_PORT,
)
from helpers.spark import (
    MACHINE_SCHEMA,
    MACHINE_SCHEMA_SPARK,
    USAGE_SCHEMA,
    USAGE_SCHEMA_SPARK,
    STATUS_SCHEMA,
    STATUS_SCHEMA_SPARK,
    JOBS_SCHEMA,
    JOBS_SCHEMA_SPARK,
)

# Important imports
from helpers.spark import (
    get_df_from_server,
    push_to_perspective,
)
from helpers.fastapi import (
    make_perspective_app,
    perspective_spark_bridge,
    start_server,
)

def main():
    # Make a spark session
    spark = SparkSession.builder.appName("Perspective Demo").getOrCreate()

    # Construct a perspective manager
    manager = PerspectiveManager()

    # Get spark streaming dfs
    machines_df = get_df_from_server(spark, MACHINE_SCHEMA_SPARK, HOST, MACHINES_PORT)
    usage_df = get_df_from_server(spark, USAGE_SCHEMA_SPARK, HOST, USAGE_PORT)
    status_df = get_df_from_server(spark, STATUS_SCHEMA_SPARK, HOST, STATUS_PORT)
    jobs_df = get_df_from_server(spark, JOBS_SCHEMA_SPARK, HOST, JOBS_PORT)

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

    # Bridge Perspective to Spark
    app = perspective_spark_bridge(
        {
            "machines": machines_table,
            "usage": usage_table,
            "status": status_table,
            "jobs": jobs_table,
        }
    )

    # Wrap with FastAPI
    make_perspective_app(manager, app)

    # Start the server
    thread = start_server(app, 8080)

    # Sleep for a sec to let the server start
    sleep(2)

    # Now push from spark to perspective
    push_to_perspective(machines_df, "machines", "localhost", 8080)
    push_to_perspective(usage_df, "usage", "localhost", 8080)
    push_to_perspective(status_df, "status", "localhost", 8080)
    push_to_perspective(jobs_df, "jobs", "localhost", 8080)

    thread.join()

if __name__ == "__main__":
    main()
