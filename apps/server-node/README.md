# @knowledgeos/server-node

Native Node.js HTTP runtime for the KnowledgeOS server application.

## Includes

- `node:http` transport adapter;
- request path and query parsing;
- JSON body parsing;
- configurable body-size limit;
- response serialization;
- ephemeral-port support;
- graceful stop;
- environment bootstrap;
- real HTTP integration test.

The package depends only on `@knowledgeos/server`. Business logic remains in Platform and Domain packages.
