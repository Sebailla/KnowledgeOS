# Event Bus

**Project:** KnowledgeOS  
**Section:** Kernel  
**Document:** EventBus  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define event publication, subscription, delivery, replay, ordering and consumer idempotency.

## 2. Scope

This specification applies to Kernel contracts and every Platform or Integration component that consumes them. It is technology-neutral and does not prescribe a concrete framework, broker, database, scheduler or dependency-injection container.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibilities

Event Bus delivers immutable Domain events, Integration events and internal notifications under declared guarantees.

## 5. Exclusions

Events do not replace commands, queries or authoritative repositories.

## 6. Conceptual Model

```text
EventEnvelope
├── eventId
├── eventType
├── payload
├── aggregateRef?
├── aggregateVersion?
├── correlationId
├── causationId?
├── occurredAt
├── publishedAt
└── schemaVersion
```

## 7. Normative Requirements

**EVENTBUS-R001** — Every durable event MUST have immutable identity.

**EVENTBUS-R002** — Domain events MUST be published only after committed state.

**EVENTBUS-R003** — Delivery semantics MUST be documented.

**EVENTBUS-R004** — Consumers MUST be idempotent when redelivery is possible.

**EVENTBUS-R005** — Ordering guarantees MUST be explicitly scoped.

**EVENTBUS-R006** — Schemas MUST be versioned.

**EVENTBUS-R007** — Poison events MUST be isolated.

**EVENTBUS-R008** — Replay MUST preserve original identity and occurrence time.

**EVENTBUS-R009** — Sensitive payloads MUST be minimized.


## 8. Invariants

**EVENTBUS-I001** — Events are immutable facts.

**EVENTBUS-I002** — Committed state precedes publication.

**EVENTBUS-I003** — Redelivery does not duplicate effects.

**EVENTBUS-I004** — Ordering is never assumed beyond declared scope.


## 9. Failure and Recovery

Failures SHALL be explicit, typed and observable. Retryable operations MUST preserve idempotency. Durable work SHALL resume from the latest consistent state. Kernel infrastructure MUST NOT fabricate Domain success, silently discard committed work or reinterpret business authority.

## 10. Security and Privacy

Kernel services SHALL minimize exposure of publication content, Personal Knowledge, credentials and provider secrets. Correlation metadata, logs and traces MUST be redacted according to policy. Kernel infrastructure MUST NOT become an unauthorized data sink.

## 11. Example

PersonalStateMerged is emitted after Sync commits the merged version. Search consumes it idempotently to update its index.

## 12. Compatibility and Evolution

Backward-compatible additions MAY introduce optional metadata or contracts. Changes to delivery guarantees, ordering, identity, persistence, transaction boundaries, failure semantics or lifecycle behavior require architectural review and a major version when compatibility cannot be preserved.

## 13. Related Documents

- `README.md`
- `KernelArchitecture.md`
- `../02-Domain/DomainModel.md`
- `../02-Domain/EngineResponsibilities.md`

## 14. Status

This document is part of the KnowledgeOS Kernel V4 release-candidate baseline.
