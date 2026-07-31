# Public API Conventions

**Project:** KnowledgeOS  
**Section:** Integration / Public API  
**Document:** APIConventions  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define common naming, envelopes, errors, pagination, idempotency and compatibility across public APIs.

## 2. Scope

Applies to REST, GraphQL, Local API and future transports.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Public APIs expose approved Platform contracts, not private implementations.

## 5. Conceptual Model

Common envelope concepts include request identity, correlation, actor, version, result, error and pagination.

## 6. Normative Requirements

**APICONVENTIONS-R001** — API schemas MUST be versioned.

**APICONVENTIONS-R002** — Names MUST use official architecture vocabulary.

**APICONVENTIONS-R003** — Errors MUST use stable codes and categories.

**APICONVENTIONS-R004** — Retryable mutations MUST support idempotency.

**APICONVENTIONS-R005** — Pagination MUST be stable.

**APICONVENTIONS-R006** — Sensitive fields MUST be omitted by default.

**APICONVENTIONS-R007** — Transport models MUST be mapped to public contracts.

**APICONVENTIONS-R008** — Deprecated fields MUST follow a published lifecycle.

## 7. Invariants

**APICONVENTIONS-I001** — Transport does not redefine semantics.

**APICONVENTIONS-I002** — Errors are stable.

**APICONVENTIONS-I003** — Privacy is enforced.

**APICONVENTIONS-I004** — Idempotency is explicit.

**APICONVENTIONS-I005** — Compatibility is documented.

## 8. Failure, Recovery and Degradation

Unsupported versions SHALL fail clearly with supported-version information.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

REST and GraphQL expose the same `PublicationSummary` public contract with transport-specific encoding.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `Authentication.md`
- `Versioning.md`
- `REST.md`
- `GraphQL.md`
- `LocalAPI.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
