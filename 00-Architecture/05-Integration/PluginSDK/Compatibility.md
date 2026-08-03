# Plugin Compatibility

**Project:** KnowledgeOS  
**Section:** Integration / Plugin SDK  
**Document:** Compatibility  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define SDK version compatibility, deprecation, feature detection and migration.

## 2. Scope

Applies to plugin manifests and runtime activation.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Compatibility is evaluated before execution using SDK range, required capabilities and extension versions.

## 5. Conceptual Model

Results are compatible, compatible-with-deprecation, incompatible, missing-capability or migration-required.

## 6. Normative Requirements

**COMPATIBILITY-R001** — Plugins MUST declare supported SDK range.

**COMPATIBILITY-R002** — Hosts MUST expose capability and extension versions.

**COMPATIBILITY-R003** — Breaking contract changes require a major SDK version.

**COMPATIBILITY-R004** — Deprecated contracts MUST have a migration path.

**COMPATIBILITY-R005** — Feature detection SHOULD be preferred over version guessing.

**COMPATIBILITY-R006** — Incompatible plugins MUST not activate.

**COMPATIBILITY-R007** — Compatibility results MUST be diagnosable.

**COMPATIBILITY-R008** — Migration MUST preserve plugin-owned data where possible.

## 7. Invariants

**COMPATIBILITY-I001** — Compatibility is explicit.

**COMPATIBILITY-I002** — Activation is safe.

**COMPATIBILITY-I003** — Deprecation is visible.

**COMPATIBILITY-I004** — Data migration is deliberate.

**COMPATIBILITY-I005** — Version numbers do not replace capability checks.

## 8. Failure, Recovery and Degradation

An incompatible plugin SHALL remain installed but disabled when policy allows, preserving configuration and data.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A plugin supporting SDK 4.x activates on 4.2 after capability checks; one requiring a removed v3 contract is disabled.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `SDKArchitecture.md`
- `Manifest.md`
- `Contracts.md`
- `ExtensionPoints.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
