# Import Protocols

**Project:** KnowledgeOS  
**Section:** Integration / Data Exchange  
**Document:** ImportProtocols  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define provider-neutral protocols for receiving and validating exchange packages and external source payloads.

## 2. Scope

Applies to Data Exchange imports, not raw device scanning.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Import protocols map external envelopes into validated internal contracts while preserving source evidence and compatibility findings.

## 5. Conceptual Model

```text
Receive → Authenticate → Validate Envelope → Resolve Version
→ Validate Integrity → Stage Entities → Resolve References
→ Commit or Reject → Emit Import Report
```

## 6. Normative Requirements

**IMPORTPROTOCOL-R001** — Import MUST validate package identity and schema version.

**IMPORTPROTOCOL-R002** — Integrity MUST be verified before commit.

**IMPORTPROTOCOL-R003** — Partial imports MUST be explicit.

**IMPORTPROTOCOL-R004** — Unknown required semantics MUST fail.

**IMPORTPROTOCOL-R005** — Identity collisions MUST not overwrite existing entities.

**IMPORTPROTOCOL-R006** — Import MUST preserve source and package provenance.

**IMPORTPROTOCOL-R007** — Personal Knowledge imports MUST require authorization.

**IMPORTPROTOCOL-R008** — Commit MUST be atomic per declared transaction scope.

**IMPORTPROTOCOL-R009** — Retries MUST be idempotent.

## 7. Invariants

**IMPORTPROTOCOL-I001** — Invalid input does not corrupt repositories.

**IMPORTPROTOCOL-I002** — Identity remains stable.

**IMPORTPROTOCOL-I003** — Import authority is explicit.

**IMPORTPROTOCOL-I004** — Staging is isolated.

**IMPORTPROTOCOL-I005** — Commit follows successful validation.

## 8. Failure, Recovery and Degradation

Failed imports SHALL preserve a diagnostic report and staged evidence according to retention policy.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

Importing a package with an existing KnowledgeObjectId creates a new compatible version or conflict report rather than a duplicate object.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `CanonicalExchange.md`
- `Serialization.md`
- `../../04-Platform/Import/README.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
