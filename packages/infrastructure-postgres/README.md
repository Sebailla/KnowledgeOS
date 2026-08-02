# @knowledgeos/infrastructure-postgres

PostgreSQL adapters for the first KnowledgeOS vertical slice.

## Includes

- SQL execution abstractions;
- Unit of Work;
- transactional outbox;
- JSON-state mappers;
- repositories for Knowledge Objects, sources, publication versions, Local Libraries, acquisitions and annotations;
- initial SQL migration.

## Boundary

This package implements Domain repository contracts. It does not own Domain invariants or Platform use cases.
