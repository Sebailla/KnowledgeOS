# Plugin Capabilities

**Project:** KnowledgeOS  
**Section:** Integration / Plugin SDK  
**Document:** Capabilities  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define capability identifiers, grants, revocation and least-privilege rules.

## 2. Scope

Applies to plugin access to storage, network, AI, metadata, annotations, export and UI extensions.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Capabilities are explicit permissions evaluated by Plugin Engine.

## 5. Conceptual Model

A capability definition includes ID, description, scope, risk, parameters, grant lifetime and audit policy.

## 6. Normative Requirements

**CAPABILITIES-R001** — Plugins MUST declare every privileged capability.

**CAPABILITIES-R002** — Undeclared capability use MUST fail.

**CAPABILITIES-R003** — Grants MUST be explicit and revocable.

**CAPABILITIES-R004** — Capabilities SHOULD be granular.

**CAPABILITIES-R005** — Personal Knowledge access MUST have separate read and write scopes.

**CAPABILITIES-R006** — Network destinations SHOULD be constrained.

**CAPABILITIES-R007** — AI access MUST respect platform privacy policy.

**CAPABILITIES-R008** — Capability use MUST be auditable.

## 7. Invariants

**CAPABILITIES-I001** — Least privilege applies.

**CAPABILITIES-I002** — Revocation is effective.

**CAPABILITIES-I003** — Capabilities do not transfer ownership.

**CAPABILITIES-I004** — Sensitive scopes remain explicit.

**CAPABILITIES-I005** — Plugin identity is bound to grants.

## 8. Failure, Recovery and Degradation

Revoked capabilities SHALL fail before privileged execution.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A citation plugin may receive outbound network access only to approved DOI resolver domains.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `SDKArchitecture.md`
- `Manifest.md`
- `Contracts.md`
- `../../04-Platform/Plugin/README.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
