# @knowledgeos/server

Composition root and HTTP boundary for the first KnowledgeOS vertical slice.

## Includes

- configuration validation;
- HTTP router abstraction;
- health and readiness checks;
- request execution context;
- Library API routes;
- in-memory composition for local validation.

## Next infrastructure adapter

A concrete Node.js HTTP server and PostgreSQL driver adapter will replace the in-memory transport and repositories without changing Platform or Domain packages.


## First vertical slice

The server now exposes:

- `POST /v1/library/local-sources`
- `GET /v1/library/local-library`
- `GET /v1/library/local-availability`
- `GET /v1/library/master-catalog`
- `POST /v1/library/acquisitions`

The integration fixture proves that a registered local source becomes a Local Library publication with offline-readable availability.
