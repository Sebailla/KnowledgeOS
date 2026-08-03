# Public API Versioning

**Project:** KnowledgeOS  
**Section:** Integration / Public API  
**Document:** Versioning  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define API lifecycle, compatibility, deprecation and migration.

## 2. Scope

Applies to public request, response, event and capability schemas.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

API versioning is separate from Domain entity versioning.

## 5. Conceptual Model

Versions may be path-, header-, schema- or capability-negotiated depending on transport.

## 6. Normative Requirements

**VERSIONING-R001** — Breaking changes MUST use a new major API version.

**VERSIONING-R002** — Compatible additions MUST remain optional.

**VERSIONING-R003** — Deprecation MUST include replacement and timeline.

**VERSIONING-R004** — Clients MUST be able to negotiate or discover supported versions.

**VERSIONING-R005** — Events and webhooks MUST include schema version.

**VERSIONING-R006** — Unknown required semantics MUST fail.

**VERSIONING-R007** — Version mapping MUST not alter Domain authority.

**VERSIONING-R008** — Migration guidance MUST be published.

## 7. Invariants

**VERSIONING-I001** — API versions are explicit.

**VERSIONING-I002** — Domain versions remain distinct.

**VERSIONING-I003** — Deprecation is observable.

**VERSIONING-I004** — Compatibility claims are testable.

**VERSIONING-I005** — Old versions are not silently reinterpreted.

## 8. Failure, Recovery and Degradation

Unsupported versions SHALL return a stable incompatibility response.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A v2 API adds optional provenance fields while preserving v1 response meaning.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `APIConventions.md`
- `REST.md`
- `GraphQL.md`
- `LocalAPI.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
