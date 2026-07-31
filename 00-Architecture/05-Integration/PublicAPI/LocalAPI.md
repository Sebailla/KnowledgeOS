# Local API

**Project:** KnowledgeOS  
**Section:** Integration / Public API  
**Document:** LocalAPI  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define local-process and local-device API boundaries for desktop and mobile clients.

## 2. Scope

Applies to IPC, local HTTP, XPC or in-process public façades.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Local API exposes stable Platform contracts to UI and extensions without granting private repository access.

## 5. Conceptual Model

Profiles may use in-process calls, XPC, loopback HTTP or platform IPC under one logical contract.

## 6. Normative Requirements

**LOCALAPI-R001** — Local API MUST enforce capability boundaries.

**LOCALAPI-R002** — Transport choice MUST remain replaceable.

**LOCALAPI-R003** — UI components MUST not access repositories directly.

**LOCALAPI-R004** — Long-running operations MUST return observable workflow identities.

**LOCALAPI-R005** — Personal data access MUST be scoped.

**LOCALAPI-R006** — Local API schemas MUST be versioned.

**LOCALAPI-R007** — Errors MUST use common categories.

**LOCALAPI-R008** — IPC inputs MUST be validated as untrusted where process boundaries exist.

## 7. Invariants

**LOCALAPI-I001** — Local does not mean unrestricted.

**LOCALAPI-I002** — UI remains separate from Platform.

**LOCALAPI-I003** — Contracts are stable.

**LOCALAPI-I004** — Repositories remain private.

**LOCALAPI-I005** — Transport does not redefine semantics.

## 8. Failure, Recovery and Degradation

IPC failure SHALL preserve durable work and return reconnectable operation identity.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

The macOS UI requests `OpenLocalPublication` through Local API and receives a render session descriptor.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `APIConventions.md`
- `Authentication.md`
- `Versioning.md`
- `../../04-Platform/README.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
