# Correlation Model

**Project:** KnowledgeOS  
**Section:** Implementation / Shared / 06-Observability  
**Document:** CorrelationModel  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** Server, macOS, iPhone, iPad, Web  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the correlation model for KnowledgeOS shared implementation, covering shared correlation, logging, metrics and tracing contracts.

## 2. Scope

This document applies to code and specifications shared across two or more KnowledgeOS implementations.

Shared modules may contain:

- immutable value types;
- public DTOs;
- command, query and event envelopes;
- serialization;
- validation;
- compatibility logic;
- generated client support;
- observability contracts;
- test utilities.

They SHALL NOT contain:

- UI state;
- database repositories;
- file-system ownership;
- CloudKit records;
- PostgreSQL entities;
- provider SDK types;
- business decision logic;
- Engine-private implementations.

## 3. Architectural Position

```text
Domain and Platform Contracts
            │
            ▼
Shared Implementation
├── Contracts
├── Domain Value Types
├── Serialization
├── Validation
├── Client SDK
├── Observability
└── Test Utilities
            │
            ▼
Server / Desktop / Mobile / Web
```

Shared code supports implementation consistency but does not become a new architecture layer with business authority.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- Shared modules SHALL remain independent of UI frameworks, databases and provider SDKs.
- Shared modules SHALL NOT own business policy or Domain authority.
- All public types SHALL be versioned or governed by an explicit compatibility policy.
- Stable Domain identity SHALL be represented without leaking storage-specific identifiers.
- Unknown optional extension data SHOULD be preserved.
- Personal Knowledge and publication content SHALL be excluded from logs and diagnostics by default.
- Shared APIs SHALL be deterministic where canonical processing requires it.
- Cross-platform behavior SHALL be testable on every supported runtime.
- Correlation SHALL propagate across supported boundaries.
- Telemetry contracts SHALL use bounded-cardinality metadata.
- Secrets, publication text and Personal Knowledge SHALL be redacted before export.

## 6. Design Guidance

Shared implementation SHOULD:

- favor small, immutable and dependency-light modules;
- expose protocols or interfaces rather than concrete platform services;
- use official Architecture vocabulary;
- preserve stable identity and authority categories;
- avoid hidden global mutable state;
- separate wire representation from Domain-facing value types when necessary;
- provide explicit conversion functions;
- surface validation findings rather than silently normalize invalid data;
- use deterministic encoding and comparison rules;
- keep generated code reproducible;
- maintain strict dependency direction;
- document supported language/runtime versions.

## 7. Dependency Rules

Allowed dependencies:

- language standard library;
- approved lightweight serialization or validation libraries;
- generated schema artifacts;
- shared foundational utilities.

Prohibited dependencies:

- application UI modules;
- concrete storage repositories;
- server framework internals;
- Apple UI frameworks in cross-platform contracts;
- browser runtime objects in shared contracts;
- provider-specific clients;
- Engine-private modules.

A narrower platform-specific shared package MAY exist, but its scope SHALL be explicit.

## 8. Error and Compatibility Model

Shared errors SHALL expose:

- stable code;
- category;
- safe message;
- retryability where relevant;
- field/path location where relevant;
- compatibility details;
- underlying protected diagnostic cause where permitted.

Compatibility outcomes SHALL distinguish:

- compatible;
- compatible with deprecation;
- migration required;
- unsupported optional feature;
- incompatible required semantics;
- malformed input.

## 9. Security and Privacy

- Secrets SHALL never be represented as ordinary DTO fields.
- Sensitive values SHALL use redacted descriptions.
- Test fixtures SHALL use synthetic data.
- Serialization SHALL reject executable payloads.
- Validation SHALL enforce resource limits.
- Personal Knowledge SHALL be represented only when the contract explicitly requires it.
- Public DTOs SHALL use minimum necessary data.
- Authentication credentials SHALL remain transport-security concerns.

## 10. Verification and Acceptance

- Public APIs compile on all supported targets.
- Round-trip tests pass.
- Compatibility tests pass across supported schema versions.
- Identity and authority remain unchanged across conversion.
- Unknown optional extensions are preserved where required.
- Invalid required data fails explicitly.
- No prohibited platform dependency exists.
- Telemetry redaction tests pass.
- Generated artifacts are reproducible.
- Architecture traceability is current.

## 11. Traceability

- `00-Architecture/02-Domain/Identity/README.md`
- `00-Architecture/02-Domain/KnowledgeObject/README.md`
- `00-Architecture/02-Domain/UDM/Serialization/Serialization.md`
- `00-Architecture/02-Domain/DPM/Serialization/Serialization.md`
- `00-Architecture/03-Kernel/README.md`
- `00-Architecture/05-Integration/DataExchange/Serialization.md`
- `00-Architecture/05-Integration/PublicAPI/APIConventions.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 12. Compatibility and Evolution

Breaking changes to shared public types require:

- a new major contract version;
- migration guidance;
- client compatibility analysis;
- cross-platform test updates;
- release notes.

Generated clients and fixtures SHALL identify their source schema version.

## 13. Status

This document is part of the KnowledgeOS Shared Implementation V4 baseline.
