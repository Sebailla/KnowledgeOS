# Authentication

## Status

Draft — pending content.

## Purpose

This document specifies how clients authenticate to the KnowledgeOS V-3 Master Library server. It defines the authentication mechanisms, the credentials lifecycle, the authorization model, and the integration with the rest of the server API.

## Sections

- **Identity providers** — the supported identity providers and how they are integrated.
- **Credentials and tokens** — the types of credentials, their lifecycle, and storage guidance.
- **Authorization model** — how roles, scopes, or permissions are enforced per endpoint.
- **Session and key rotation** — how sessions expire, refresh, and how signing keys are rotated.

## Open Questions

- [ ] Is there an existing identity provider from V-2 that must be reused?
- [ ] Will machine-to-machine authentication be supported alongside human authentication?
- [ ] How is revocation propagated to active sessions?
