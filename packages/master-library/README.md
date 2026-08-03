# @knowledgeos/master-library

Master Library domain/application package for the NAS-hosted authoritative library.

## Root model

`KnowledgeObject` remains the stable root identity.

A Master Publication contains:

- publication identity;
- current version;
- source items;
- assets;
- metadata;
- provenance references;
- snapshots;
- integrity state.

## Includes

- registration;
- version creation;
- deduplication by content fingerprint;
- integrity verification;
- snapshots;
- in-memory repositories for tests.

The package does not own PostgreSQL, source-file storage or HTTP.
