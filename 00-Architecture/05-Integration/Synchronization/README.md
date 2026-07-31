# Synchronization Integration

**Project:** KnowledgeOS  
**Section:** Integration / Synchronization  
**Document:** Synchronization  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define Integration-layer transport and deployment profiles for Personal Knowledge synchronization.

## 2. Scope

Applies to CloudKit/iCloud profile and future providers. Excludes merge policy and publication acquisition.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Synchronization Integration adapts Sync Engine contracts to concrete providers.

The Apple profile uses iCloud/CloudKit to synchronize Personal Knowledge among macOS, iPhone and iPad Local Libraries.

The NAS Master Library is outside this topology.

## 5. Conceptual Model

```text
Local Sync Engine
      │
      ▼
Sync Provider Contract
      │
      ▼
CloudKit / iCloud
      │
      ▼
Other Local Sync Engines
```

Publication files and Master Catalog records are not transported through this profile.

## 6. Normative Requirements

**SYNCHRONIZATIO-R001** — Only approved Personal Knowledge envelopes MAY cross the sync provider boundary.

**SYNCHRONIZATIO-R002** — Provider records MUST preserve entity and version identities.

**SYNCHRONIZATIO-R003** — CloudKit schemas MUST remain adapter details.

**SYNCHRONIZATIO-R004** — Credentials and account scope MUST be protected.

**SYNCHRONIZATIO-R005** — Provider outages MUST preserve offline local commits.

**SYNCHRONIZATIO-R006** — Retry and cursor behavior MUST be idempotent.

**SYNCHRONIZATIO-R007** — Master Library MUST not be registered as a sync peer.

**SYNCHRONIZATIO-R008** — Publication payloads MUST not use this transport.

**SYNCHRONIZATIO-R009** — Schema migrations MUST preserve convergence.

## 7. Invariants

**SYNCHRONIZATIO-I001** — Personal sync is independent of NAS.

**SYNCHRONIZATIO-I002** — Transport does not own merge semantics.

**SYNCHRONIZATIO-I003** — Acquisition remains separate.

**SYNCHRONIZATIO-I004** — Offline-first behavior is preserved.

**SYNCHRONIZATIO-I005** — Provider implementation is replaceable.

## 8. Failure, Recovery and Degradation

Provider outage SHALL queue local changes and expose status. Corrupt records SHALL be isolated and reported to Sync Engine for conflict or repair handling.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

An annotation created on iPad is committed locally, pushed to CloudKit and pulled by Mac. The source PDF remains independently acquired on each device.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `../Providers/SyncProviders.md`
- `../../04-Platform/Sync/README.md`
- `../../02-Domain/KnowledgeLifecycle.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
