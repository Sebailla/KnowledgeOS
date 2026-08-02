# @knowledgeos/server-postgres

Production-oriented PostgreSQL composition for the first KnowledgeOS Library vertical slice.

## Startup

1. Create PostgreSQL pool.
2. Run immutable migrations.
3. Compose transaction-scoped repositories.
4. Ensure the default Local Library.
5. Register Library handlers.
6. Register health and API routes.
7. Start the native Node HTTP runtime.

## Environment

- `DATABASE_URL`
- `SERVER_HOST`
- `SERVER_PORT`
- `REQUEST_BODY_LIMIT_BYTES`
- `NODE_ENV`
