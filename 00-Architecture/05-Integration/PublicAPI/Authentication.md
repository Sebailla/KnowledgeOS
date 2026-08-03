# Public API Authentication

**Project:** KnowledgeOS  
**Section:** Integration / Public API  
**Document:** Authentication  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define authentication, authorization, scopes and local trust profiles for public APIs.

## 2. Scope

Applies to server, local and plugin-facing API access.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Authentication identifies callers; authorization evaluates approved capabilities and resource access.

## 5. Conceptual Model

Profiles include local-process trust, device authentication, user session, API token, OAuth and plugin capability token.

## 6. Normative Requirements

**AUTHENTICATION-R001** — Every non-public operation MUST require authentication.

**AUTHENTICATION-R002** — Authorization MUST be checked per operation and resource scope.

**AUTHENTICATION-R003** — Credentials MUST be stored securely.

**AUTHENTICATION-R004** — Tokens MUST have explicit lifetime and audience.

**AUTHENTICATION-R005** — Least privilege MUST apply.

**AUTHENTICATION-R006** — Revocation MUST be supported.

**AUTHENTICATION-R007** — Authentication logs MUST not expose secrets.

**AUTHENTICATION-R008** — Local trust MUST not imply unrestricted repository access.

## 7. Invariants

**AUTHENTICATION-I001** — Authentication does not define Domain identity.

**AUTHENTICATION-I002** — Authorization is explicit.

**AUTHENTICATION-I003** — Credentials are protected.

**AUTHENTICATION-I004** — Revocation is observable.

**AUTHENTICATION-I005** — Plugin capabilities remain scoped.

## 8. Failure, Recovery and Degradation

Expired or revoked credentials SHALL fail before business execution.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A local desktop process uses a local trust profile but still invokes Platform contracts with scoped capabilities.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `APIConventions.md`
- `../ExternalServices/OAuth.md`
- `../../04-Platform/Plugin/README.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
