# Export Protocols

**Project:** KnowledgeOS  
**Section:** Integration / Data Exchange  
**Document:** ExportProtocols  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define provider-neutral generation and delivery of exchange packages.

## 2. Scope

Applies to Knowledge Object, collection and Personal Knowledge export.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Export protocols transform approved Platform data into a versioned package without modifying authoritative state.

## 5. Conceptual Model

```text
Plan → Authorize Scope → Resolve Entities → Transform
→ Package Assets → Validate → Sign/Encrypt → Deliver
```

## 6. Normative Requirements

**EXPORTPROTOCOL-R001** — Export MUST identify source versions.

**EXPORTPROTOCOL-R002** — Personal Knowledge MUST be excluded unless explicitly selected.

**EXPORTPROTOCOL-R003** — Lossy transformations MUST produce a report.

**EXPORTPROTOCOL-R004** — Asset references MUST remain coherent.

**EXPORTPROTOCOL-R005** — Identity SHOULD be preserved when target format supports it.

**EXPORTPROTOCOL-R006** — Exports MUST be reproducible for fixed inputs and profile.

**EXPORTPROTOCOL-R007** — Temporary files MUST be protected and cleaned.

**EXPORTPROTOCOL-R008** — Delivery MUST not imply successful receipt unless acknowledged.

**EXPORTPROTOCOL-R009** — Retries MUST not silently overwrite unrelated outputs.

## 7. Invariants

**EXPORTPROTOCOL-I001** — Source state remains immutable.

**EXPORTPROTOCOL-I002** — Private data is opt-in.

**EXPORTPROTOCOL-I003** — Loss is explicit.

**EXPORTPROTOCOL-I004** — Packages remain traceable.

**EXPORTPROTOCOL-I005** — Delivery transport is separate from package semantics.

## 8. Failure, Recovery and Degradation

Failed delivery SHALL preserve the completed package when safe and expose a retryable delivery state.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

Exporting a collection to a portable archive includes a manifest, assets and optional annotations selected by the user.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `CanonicalExchange.md`
- `Serialization.md`
- `../../04-Platform/Export/README.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
