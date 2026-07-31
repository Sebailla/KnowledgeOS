# Command Bus

**Project:** KnowledgeOS  
**Section:** Kernel  
**Document:** CommandBus  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define intent execution, handler contracts, idempotency, authorization and concurrency.

## 2. Scope

This specification applies to Kernel contracts and every Platform or Integration component that consumes them. It is technology-neutral and does not prescribe a concrete framework, broker, database, scheduler or dependency-injection container.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibilities

Command Bus routes one state-changing intention to one logical handler and returns a typed execution result.

## 5. Exclusions

It does not own the business decision and is not a general read/query mechanism.

## 6. Conceptual Model

```text
CommandEnvelope
├── commandId
├── commandType
├── payload
├── actor
├── correlationId
├── causationId?
├── idempotencyKey?
├── expectedVersion?
└── deadline?
```

## 7. Normative Requirements

**COMMANDBUS-R001** — Every command MUST have stable identity.

**COMMANDBUS-R002** — Every command type MUST have exactly one logical handler.

**COMMANDBUS-R003** — Handlers MUST validate authorization and preconditions.

**COMMANDBUS-R004** — Retryable commands MUST use idempotency keys.

**COMMANDBUS-R005** — Success MUST not be reported before committed state.

**COMMANDBUS-R006** — Expected-version conflicts MUST fail explicitly.

**COMMANDBUS-R007** — Payloads MUST remain immutable during handling.

**COMMANDBUS-R008** — Cross-aggregate long-running operations SHOULD use Workflow Engine.

**COMMANDBUS-R009** — Results MUST distinguish validation, conflict, authorization, transient and permanent failures.


## 8. Invariants

**COMMANDBUS-I001** — One logical handler per command.

**COMMANDBUS-I002** — Committed effects precede success.

**COMMANDBUS-I003** — Retries do not duplicate effects.

**COMMANDBUS-I004** — Business ownership remains with the handler module.


## 9. Failure and Recovery

Failures SHALL be explicit, typed and observable. Retryable operations MUST preserve idempotency. Durable work SHALL resume from the latest consistent state. Kernel infrastructure MUST NOT fabricate Domain success, silently discard committed work or reinterpret business authority.

## 10. Security and Privacy

Kernel services SHALL minimize exposure of publication content, Personal Knowledge, credentials and provider secrets. Correlation metadata, logs and traces MUST be redacted according to policy. Kernel infrastructure MUST NOT become an unauthorized data sink.

## 11. Example

AcquirePublication is handled by Library Engine. Command Bus provides correlation and idempotency but does not define acquisition semantics.

## 12. Compatibility and Evolution

Backward-compatible additions MAY introduce optional metadata or contracts. Changes to delivery guarantees, ordering, identity, persistence, transaction boundaries, failure semantics or lifecycle behavior require architectural review and a major version when compatibility cannot be preserved.

## 13. Related Documents

- `README.md`
- `KernelArchitecture.md`
- `../02-Domain/DomainModel.md`
- `../02-Domain/EngineResponsibilities.md`

## 14. Status

This document is part of the KnowledgeOS Kernel V4 release-candidate baseline.
