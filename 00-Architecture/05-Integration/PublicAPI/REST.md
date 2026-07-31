# REST API

**Project:** KnowledgeOS  
**Section:** Integration / Public API  
**Document:** REST  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define REST transport conventions for KnowledgeOS public contracts.

## 2. Scope

Applies to NAS server and approved remote HTTP APIs.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

REST maps resources and commands to HTTP while preserving Platform ownership.

## 5. Conceptual Model

Uses HTTPS, versioned routes, JSON, standard status codes, idempotency keys, ETags and pagination links.

## 6. Normative Requirements

**REST-R001** — HTTPS MUST be required outside trusted local development.

**REST-R002** — Mutations MUST use appropriate idempotency and concurrency controls.

**REST-R003** — ETags SHOULD represent public resource versions.

**REST-R004** — Errors MUST use the common envelope.

**REST-R005** — Pagination MUST be stable.

**REST-R006** — Bulk operations MUST declare atomicity.

**REST-R007** — Private fields MUST be filtered.

**REST-R008** — Long-running operations SHOULD return workflow or job identities.

## 7. Invariants

**REST-I001** — HTTP is transport only.

**REST-I002** — Resource identity maps to Domain identity.

**REST-I003** — Concurrency conflicts are explicit.

**REST-I004** — Long-running work is durable.

**REST-I005** — Schemas are versioned.

## 8. Failure, Recovery and Degradation

Network interruption SHALL not imply mutation failure when commit status is unknown; clients reconcile using idempotency identity.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

`POST /v1/acquisitions` returns a workflow ID and status URL.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `APIConventions.md`
- `Authentication.md`
- `Versioning.md`
- `../../03-Kernel/WorkflowEngine.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
