# Plugin Contracts

**Project:** KnowledgeOS  
**Section:** Integration / Plugin SDK  
**Document:** Contracts  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define public service, command, query and event contracts exposed to plugins.

## 2. Scope

Applies to Plugin SDK callable APIs.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Plugin contracts are reduced, capability-checked façades over Platform contracts.

## 5. Conceptual Model

Contracts may expose metadata, annotation, search, export, provider and extension-registration operations.

## 6. Normative Requirements

**CONTRACTS-R001** — Contracts MUST use public DTOs.

**CONTRACTS-R002** — Every call MUST evaluate capability grants.

**CONTRACTS-R003** — Private Engine types MUST not be exposed.

**CONTRACTS-R004** — Retryable mutations MUST support idempotency.

**CONTRACTS-R005** — Errors MUST use stable categories.

**CONTRACTS-R006** — Events MUST minimize payloads.

**CONTRACTS-R007** — Version negotiation MUST be supported.

**CONTRACTS-R008** — Plugin calls MUST be observable.

## 7. Invariants

**CONTRACTS-I001** — Contracts are stable.

**CONTRACTS-I002** — Business logic remains in Platform.

**CONTRACTS-I003** — Capabilities gate access.

**CONTRACTS-I004** — Errors are explicit.

**CONTRACTS-I005** — Private data is minimized.

## 8. Failure, Recovery and Degradation

Contract incompatibility SHALL fail before plugin activation or call execution.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A plugin invokes `registerMetadataExtractor` with a namespaced type and declared schema.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `SDKArchitecture.md`
- `Capabilities.md`
- `ExtensionPoints.md`
- `Compatibility.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
