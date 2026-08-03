# @knowledgeos/contracts

Versioned serializable contracts shared by the server, web client, generated clients and Swift model generation.

## Owns

- request context;
- command, query and event envelopes;
- library and acquisition contracts;
- reading and annotation contracts;
- search and processing contracts;
- Personal Knowledge sync contracts;
- AI, plugin and export contracts.

## Dependency rule

`@knowledgeos/contracts` MAY depend on `@knowledgeos/domain-types` and MUST NOT depend on Platform or Infrastructure packages.
