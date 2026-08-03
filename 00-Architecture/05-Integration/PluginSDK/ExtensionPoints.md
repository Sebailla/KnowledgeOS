# Plugin Extension Points

**Project:** KnowledgeOS  
**Section:** Integration / Plugin SDK  
**Document:** ExtensionPoints  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define approved extension locations, registration, ownership and isolation.

## 2. Scope

Applies to metadata, import, export, providers, UI contributions and semantic extensions.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

An extension point is a named, versioned host contract. Plugins contribute implementations without replacing host ownership.

## 5. Conceptual Model

Examples include metadata extractor, import parser, export transformer, AI provider, OCR provider, ontology module and UI command contribution.

## 6. Normative Requirements

**EXTENSIONPOINT-R001** — Extension points MUST be versioned.

**EXTENSIONPOINT-R002** — Contributions MUST be namespaced.

**EXTENSIONPOINT-R003** — Registration MUST validate compatibility and capability.

**EXTENSIONPOINT-R004** — Extensions MUST not override core semantics.

**EXTENSIONPOINT-R005** — Host ownership MUST remain explicit.

**EXTENSIONPOINT-R006** — Multiple contributions MUST use deterministic selection policy.

**EXTENSIONPOINT-R007** — Extension failures MUST be isolated.

**EXTENSIONPOINT-R008** — Unregistering MUST release resources safely.

## 7. Invariants

**EXTENSIONPOINT-I001** — Core remains authoritative.

**EXTENSIONPOINT-I002** — Extensions are namespaced.

**EXTENSIONPOINT-I003** — Selection is deterministic.

**EXTENSIONPOINT-I004** — Failures are isolated.

**EXTENSIONPOINT-I005** — Capabilities remain enforced.

## 8. Failure, Recovery and Degradation

Invalid contributions SHALL be rejected without affecting other plugins.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

Two OCR plugins register providers; AI/Import policy selects one based on capability and privacy profile.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `SDKArchitecture.md`
- `Contracts.md`
- `Compatibility.md`
- `Manifest.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
