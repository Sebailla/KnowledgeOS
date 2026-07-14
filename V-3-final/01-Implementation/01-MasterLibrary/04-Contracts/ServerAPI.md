# ServerAPI

## Status

Draft — pending content.

## Purpose

This document specifies the server API exposed by the KnowledgeOS V-3 Master Library: the transport, the endpoints, the request and response shapes, and the conventions used uniformly across endpoints. It is the primary contract between the server and any client.

## Sections

- **Transport and versioning** — the protocol, base path, and versioning strategy.
- **Endpoint catalogue** — the full list of endpoints grouped by resource or capability.
- **Common request/response conventions** — pagination, filtering, sorting, and error envelopes.
- **Compatibility policy** — how the API evolves without breaking existing clients.

## Open Questions

- [ ] Is the API RPC-style, REST-style, or a hybrid?
- [ ] Which version of the API is the V-3 contract frozen against?
- [ ] Are synchronous responses sufficient, or are asynchronous patterns required?
