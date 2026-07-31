# Plugin Manifest

**Project:** KnowledgeOS  
**Section:** Integration / Plugin SDK  
**Document:** Manifest  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define plugin identity, version, entry points, capabilities, compatibility and provenance.

## 2. Scope

Applies to every installable plugin.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

The manifest is signed or otherwise trusted metadata describing the plugin before execution.

## 5. Conceptual Model

Fields include plugin ID, version, publisher, SDK range, entry points, requested capabilities, extension declarations, permissions, checksums and signature.

## 6. Normative Requirements

**MANIFEST-R001** — Plugin identity and version MUST be explicit.

**MANIFEST-R002** — Requested capabilities MUST be declared.

**MANIFEST-R003** — SDK compatibility range MUST be declared.

**MANIFEST-R004** — Checksums or signatures MUST be verifiable according to policy.

**MANIFEST-R005** — Unknown required manifest fields MUST fail.

**MANIFEST-R006** — Entry points MUST use approved types.

**MANIFEST-R007** — Publisher provenance SHOULD be preserved.

**MANIFEST-R008** — Manifest changes require a new plugin version.

## 7. Invariants

**MANIFEST-I001** — Manifest is immutable per version.

**MANIFEST-I002** — Capabilities are inspectable before execution.

**MANIFEST-I003** — Identity is stable.

**MANIFEST-I004** — Trust is explicit.

**MANIFEST-I005** — Entry points are bounded.

## 8. Failure, Recovery and Degradation

Invalid or untrusted manifests SHALL prevent installation or activation.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A plugin requests `metadata.read`, `metadata.write.personal` and one namespaced extension point.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `SDKArchitecture.md`
- `Capabilities.md`
- `Compatibility.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
