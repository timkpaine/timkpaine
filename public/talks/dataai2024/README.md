# Databricks AI Summit 2024

## To build the docker image

```bash
docker-compose build
```

## To run the docker image

To start the server version 
```bash
docker-compose up server data
```

To start the jupyter version
```bash
docker-compose up jupyter data
```

## Notes

The Dockerfile can be massively simplified for non-aarch64 linux platforms since we provide wheels for most other platform triples.