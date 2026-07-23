import logging
import socket
import uvicorn
from asyncio import sleep
from datetime import datetime, timedelta
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from superstore import (
    MACHINE_SCHEMA,
    USAGE_SCHEMA,
    STATUS_SCHEMA,
    JOBS_SCHEMA,
)
from perspective import PerspectiveWidget, Table as PerspectiveTable
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    IntegerType,
    FloatType,
    DateType,
)

_type_map = {
    int: IntegerType,
    float: FloatType,
    str: StringType,
    datetime: DateType,
}


def perspective_schema_to_spark_schema(schema):
    return StructType(
        [StructField(name, _type_map[type]()) for name, type in schema.items()]
    )


MACHINE_SCHEMA = dict(MACHINE_SCHEMA)
USAGE_SCHEMA = dict(USAGE_SCHEMA)
STATUS_SCHEMA = dict(STATUS_SCHEMA)
JOBS_SCHEMA = dict(JOBS_SCHEMA)
MACHINE_SCHEMA_SPARK = perspective_schema_to_spark_schema(MACHINE_SCHEMA)
USAGE_SCHEMA_SPARK = perspective_schema_to_spark_schema(USAGE_SCHEMA)
STATUS_SCHEMA_SPARK = perspective_schema_to_spark_schema(STATUS_SCHEMA)
JOBS_SCHEMA_SPARK = perspective_schema_to_spark_schema(JOBS_SCHEMA)


def get_df_from_server(spark, schema, host, port):
    df = (
        spark.readStream.format("socket")
        .option("host", host)
        .option("port", port)
        .load()
        .select(from_json(col("value"), schema).alias("data"))
        .select("data.*")
    )
    return df


def push_to_perspective(df, table, host, port):
    # def _push_to_psp_single(row, table=table, host=host, port=port):
    #     from orjson import dumps
    #     from websocket import create_connection

    #     try:
    #         ws = create_connection(f"ws://{host}:{port}/tables/{table}")
    #         ws.send(dumps(row.asDict()))
    #     except:
    #         # Ignore
    #         ...

    def _push_to_psp(batch_df, batch_id, table=table, host=host, port=port):
        from orjson import dumps
        from websocket import create_connection

        try:
            ws = create_connection(f"ws://{host}:{port}/tables/{table}")
            ws.send(dumps(batch_df.toJSON().collect()))
        except:
            # Ignore
            ...

    # df.writeStream.foreach(_push_to_psp_single).start()
    df.writeStream.foreachBatch(_push_to_psp).start()
