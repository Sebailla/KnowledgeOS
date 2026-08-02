# @knowledgeos/infrastructure-postgres-node

Node.js PostgreSQL runtime adapters.

## Includes

- `pg` Pool adapter;
- transaction-scoped SQL execution using `AsyncLocalStorage`;
- migration runner with immutable checksums;
- PostgreSQL health check;
- runtime factory and graceful pool shutdown.

Domain and Platform packages remain independent from `pg`.
