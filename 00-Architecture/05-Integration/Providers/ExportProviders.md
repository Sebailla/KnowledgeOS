# Export Provider Contracts

**Project:** KnowledgeOS  
**Section:** Integration / Providers  
**Document:** ExportProviders  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define adapters that encode or deliver exports in target formats.

## 2. Scope

Applies to Markdown, HTML, PDF, EPUB and future formats.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Export providers implement target-format mechanics while Export Engine owns policy, scope and loss handling.

## 5. Conceptual Model

Capabilities include target formats, assets, annotations, pagination, encryption and streaming.

## 6. Normative Requirements

**EXPORTPROVIDER-R001** — Providers MUST declare supported format versions.

**EXPORTPROVIDER-R002** — Lossy behavior MUST be reported.

**EXPORTPROVIDER-R003** — Provider-specific options MUST be mapped through versioned profiles.

**EXPORTPROVIDER-R004** — Providers MUST not mutate source state.

**EXPORTPROVIDER-R005** — Personal data inclusion remains controlled by Export Engine.

**EXPORTPROVIDER-R006** — Output integrity SHOULD be verifiable.

**EXPORTPROVIDER-R007** — Failures MUST map to common categories.

**EXPORTPROVIDER-R008** — Providers MUST be replaceable.

## 7. Invariants

**EXPORTPROVIDER-I001** — Export is non-mutating.

**EXPORTPROVIDER-I002** — Loss is explicit.

**EXPORTPROVIDER-I003** — Provider choice does not change authority.

**EXPORTPROVIDER-I004** — Outputs remain traceable.

**EXPORTPROVIDER-I005** — Private data is opt-in.

## 8. Failure, Recovery and Degradation

Partial output SHALL not be reported as complete.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A PDF provider renders DPM pages while an EPUB provider transforms UDM structure and packages assets.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `ProviderModel.md`
- `../../04-Platform/Export/README.md`
- `../DataExchange/ExportProtocols.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
