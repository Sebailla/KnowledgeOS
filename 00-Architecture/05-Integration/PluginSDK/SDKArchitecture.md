# Plugin SDK Architecture

**Project:** KnowledgeOS  
**Section:** Integration / Plugin SDK  
**Document:** SDKArchitecture  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the external SDK boundary used by third-party and first-party plugins.

## 2. Scope

Applies to plugin manifests, capabilities, contracts and extension points.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

The SDK exposes stable, capability-scoped public contracts. It does not expose Kernel internals or private Engine implementations.

## 5. Conceptual Model

```text
Plugin
├── Manifest
├── Requested Capabilities
├── Public Contracts
├── Extension Registrations
└── Runtime Adapter
```

## 6. Normative Requirements

**SDKARCHITECTUR-R001** — SDK contracts MUST be versioned.

**SDKARCHITECTUR-R002** — Plugins MUST use public contracts only.

**SDKARCHITECTUR-R003** — Capabilities MUST be explicit.

**SDKARCHITECTUR-R004** — Extensions MUST be namespaced.

**SDKARCHITECTUR-R005** — Runtime isolation MUST match risk profile.

**SDKARCHITECTUR-R006** — Compatibility MUST be checked before activation.

**SDKARCHITECTUR-R007** — Plugin state MUST remain distinguishable from host state.

**SDKARCHITECTUR-R008** — SDK evolution MUST preserve compatible plugins or provide migration.

## 7. Invariants

**SDKARCHITECTUR-I001** — Core semantics cannot be overridden.

**SDKARCHITECTUR-I002** — Least privilege applies.

**SDKARCHITECTUR-I003** — Private repositories remain inaccessible.

**SDKARCHITECTUR-I004** — Plugins are replaceable.

**SDKARCHITECTUR-I005** — Failures are isolated.

## 8. Failure, Recovery and Degradation

Incompatible plugins SHALL not activate. Crashes SHALL be isolated and observable.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A metadata plugin registers an extractor contract and storage capability without accessing Library repositories directly.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `Manifest.md`
- `Capabilities.md`
- `Contracts.md`
- `ExtensionPoints.md`
- `Compatibility.md`
- `../../04-Platform/Plugin/README.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
