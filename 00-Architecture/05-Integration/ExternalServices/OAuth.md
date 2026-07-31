# OAuth Integration

**Project:** KnowledgeOS  
**Section:** Integration / External Services  
**Document:** OAuth  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define OAuth client, token, consent and callback integration for external services.

## 2. Scope

Applies to providers requiring delegated authorization.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

OAuth handles external authorization credentials. It does not define KnowledgeOS user ownership or Domain identity.

## 5. Conceptual Model

```text
Authorization Request → Consent → Callback → Token Exchange
→ Secure Token Store → Provider Adapter
```

## 6. Normative Requirements

**OAUTH-R001** — PKCE MUST be used where applicable.

**OAUTH-R002** — State and nonce MUST be validated.

**OAUTH-R003** — Tokens MUST be stored securely.

**OAUTH-R004** — Scopes MUST follow least privilege.

**OAUTH-R005** — Refresh failures MUST be explicit.

**OAUTH-R006** — Tokens MUST not appear in logs.

**OAUTH-R007** — Revocation MUST be supported where provider allows.

**OAUTH-R008** — Provider account identity MUST remain an external identity.

## 7. Invariants

**OAUTH-I001** — Credentials remain protected.

**OAUTH-I002** — OAuth identity does not replace Domain identity.

**OAUTH-I003** — Scopes are explicit.

**OAUTH-I004** — Callbacks are validated.

**OAUTH-I005** — Revocation is observable.

## 8. Failure, Recovery and Degradation

Invalid callbacks SHALL fail without storing tokens. Expired credentials SHALL disable affected provider operations until reauthorization.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A Crossref integration uses OAuth credentials stored in secure storage while provider-specific account ID remains external metadata.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `../README.md`
- `../PublicAPI/Authentication.md`
- `../Providers/ProviderModel.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
