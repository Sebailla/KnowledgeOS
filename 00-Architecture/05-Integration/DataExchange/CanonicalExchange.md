# Canonical Exchange Model

**Project:** KnowledgeOS  
**Section:** Integration / Data Exchange  
**Document:** CanonicalExchange  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the portable logical envelope for exchanging Knowledge Objects, UDM, DPM, assets, provenance and Personal Knowledge.

## 2. Scope

Applies to import/export packages and provider-neutral interchange.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Canonical Exchange is a transport-neutral package model. It preserves identities, versions, provenance, authority scopes and extension data while allowing selective inclusion.

## 5. Conceptual Model

```text
ExchangePackage
├── manifest
├── knowledgeObjects[]
├── udmDocuments[]
├── dpmDocuments[]
├── metadata[]
├── relationships[]
├── personalKnowledge[]?
├── assets[]
├── provenance[]
├── signatures[]
└── extensions{}
```

## 6. Normative Requirements

**CANONICALEXCHA-R001** — Every package MUST declare format and schema versions.

**CANONICALEXCHA-R002** — Every included entity MUST preserve identity and authority.

**CANONICALEXCHA-R003** — Personal Knowledge inclusion MUST be explicit.

**CANONICALEXCHA-R004** — Assets MUST carry integrity metadata.

**CANONICALEXCHA-R005** — References MUST resolve within the package or be explicitly external.

**CANONICALEXCHA-R006** — Packages MUST preserve provenance and version lineage.

**CANONICALEXCHA-R007** — Unknown optional extensions SHOULD be preserved.

**CANONICALEXCHA-R008** — Packages MUST support validation before import.

**CANONICALEXCHA-R009** — Signatures and encryption MAY be applied without changing logical meaning.

## 7. Invariants

**CANONICALEXCHA-I001** — Exchange does not change ownership.

**CANONICALEXCHA-I002** — Canonical identities survive round trips.

**CANONICALEXCHA-I003** — Loss is explicit.

**CANONICALEXCHA-I004** — Transport encoding does not redefine semantics.

**CANONICALEXCHA-I005** — Private data is opt-in.

## 8. Failure, Recovery and Degradation

Invalid packages SHALL be rejected without partial canonical import unless an explicit partial-import profile exists.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

An EPUB export package may contain one Knowledge Object, UDM, DPM, selected assets and no Personal Knowledge.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `ImportProtocols.md`
- `ExportProtocols.md`
- `Serialization.md`
- `../../02-Domain/KnowledgeObject/README.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
