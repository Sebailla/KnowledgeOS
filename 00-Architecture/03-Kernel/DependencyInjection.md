# Dependency Injection

**Project:** KnowledgeOS  
**Section:** Kernel  
**Document:** DependencyInjection  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define registration, resolution, lifetime, scope and module composition.

## 2. Scope

This specification applies to Kernel contracts and every Platform or Integration component that consumes them. It is technology-neutral and does not prescribe a concrete framework, broker, database, scheduler or dependency-injection container.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibilities

Dependency Injection constructs modules from explicit contracts and replaceable implementations.

## 5. Exclusions

It is not a global service locator and does not determine business ownership.

## 6. Conceptual Model

```text
ServiceDescriptor
├── contractId
├── factory
├── lifetime
├── moduleId
├── dependencies[]
└── qualifiers[]
```

## 7. Normative Requirements

**DEPENDENCYIN-R001** — Dependencies MUST be declared explicitly.

**DEPENDENCYIN-R002** — Constructor or factory injection SHOULD be preferred.

**DEPENDENCYIN-R003** — Global service-locator access MUST NOT be the default.

**DEPENDENCYIN-R004** — Registration collisions MUST fail unless replacement is explicit.

**DEPENDENCYIN-R005** — Module-private implementations MUST remain private.

**DEPENDENCYIN-R006** — Lifetime compatibility MUST be validated.

**DEPENDENCYIN-R007** — Resolution cycles MUST fail validation.

**DEPENDENCYIN-R008** — Scopes MUST be disposed deterministically.

**DEPENDENCYIN-R009** — Testing MUST support replacement of external dependencies.


## 8. Invariants

**DEPENDENCYIN-I001** — Dependency graphs are acyclic.

**DEPENDENCYIN-I002** — Service lifetime is explicit.

**DEPENDENCYIN-I003** — Resolution is deterministic.

**DEPENDENCYIN-I004** — Contracts are stable and versioned.


## 9. Failure and Recovery

Failures SHALL be explicit, typed and observable. Retryable operations MUST preserve idempotency. Durable work SHALL resume from the latest consistent state. Kernel infrastructure MUST NOT fabricate Domain success, silently discard committed work or reinterpret business authority.

## 10. Security and Privacy

Kernel services SHALL minimize exposure of publication content, Personal Knowledge, credentials and provider secrets. Correlation metadata, logs and traces MUST be redacted according to policy. Kernel infrastructure MUST NOT become an unauthorized data sink.

## 11. Example

The AI Engine depends on an AI provider contract; Integration registers a concrete provider without exposing it to Domain.

## 12. Compatibility and Evolution

Backward-compatible additions MAY introduce optional metadata or contracts. Changes to delivery guarantees, ordering, identity, persistence, transaction boundaries, failure semantics or lifecycle behavior require architectural review and a major version when compatibility cannot be preserved.

## 13. Related Documents

- `README.md`
- `KernelArchitecture.md`
- `../02-Domain/DomainModel.md`
- `../02-Domain/EngineResponsibilities.md`

## 14. Status

This document is part of the KnowledgeOS Kernel V4 release-candidate baseline.
