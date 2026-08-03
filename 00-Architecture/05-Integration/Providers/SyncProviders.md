# Synchronization Provider Contracts

**Project:** KnowledgeOS  
**Section:** Integration / Providers  
**Document:** SyncProviders  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define provider-neutral transport for Personal Knowledge synchronization.

## 2. Scope

Applies to CloudKit/iCloud and future approved providers.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Sync providers move opaque, versioned Personal Knowledge envelopes. They do not decide merge semantics or publication acquisition.

## 5. Conceptual Model

```text
PushChanges / PullChanges / Acknowledge / Tombstones / CapabilityDiscovery
```

## 6. Normative Requirements

**SYNCPROVIDERS-R001** — Providers MUST preserve stable entity and version identities.

**SYNCPROVIDERS-R002** — Providers MUST not become Domain authority.

**SYNCPROVIDERS-R003** — Publication payloads MUST not be carried by Personal sync contracts.

**SYNCPROVIDERS-R004** — Provider cursors and tokens MUST remain implementation details.

**SYNCPROVIDERS-R005** — Encryption and account scope MUST be explicit.

**SYNCPROVIDERS-R006** — Unknown schema versions MUST fail.

**SYNCPROVIDERS-R007** — Retries MUST be idempotent.

**SYNCPROVIDERS-R008** — Provider ordering guarantees MUST be documented.

**SYNCPROVIDERS-R009** — Conflict semantics remain owned by Sync Engine.

## 7. Invariants

**SYNCPROVIDERS-I001** — Personal Knowledge remains user-owned.

**SYNCPROVIDERS-I002** — Master Library is not a sync peer.

**SYNCPROVIDERS-I003** — Acquisition remains separate.

**SYNCPROVIDERS-I004** — Transport is replaceable.

**SYNCPROVIDERS-I005** — Identity survives providers.

## 8. Failure, Recovery and Degradation

Unknown commit status SHALL be reconciled by stable identity before retry.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

CloudKit stores Personal Knowledge records and tombstones; Sync Engine performs conflict detection and merge.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `ProviderModel.md`
- `../../04-Platform/Sync/README.md`
- `../Synchronization/README.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
