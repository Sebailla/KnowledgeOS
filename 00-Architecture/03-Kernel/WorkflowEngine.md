# Workflow Engine

**Project:** KnowledgeOS  
**Section:** Kernel  
**Document:** WorkflowEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define durable orchestration for long-running and failure-prone operations.

## 2. Scope

This specification applies to Kernel contracts and every Platform or Integration component that consumes them. It is technology-neutral and does not prescribe a concrete framework, broker, database, scheduler or dependency-injection container.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibilities

Workflow Engine owns execution state, checkpoints, retries, waits, compensation and recovery. Platform modules own business steps and transitions.

## 5. Exclusions

Workflow Engine does not own acquisition, synchronization, import or other business semantics.

## 6. Conceptual Model

```text
WorkflowInstance
├── workflowId
├── workflowType
├── definitionVersion
├── state
├── inputRefs[]
├── stepStates{}
├── checkpoints[]
├── correlationId
└── outcome?
```

## 7. Normative Requirements

**WORKFLOWENGI-R001** — Every durable workflow MUST have immutable identity.

**WORKFLOWENGI-R002** — Definitions MUST be versioned.

**WORKFLOWENGI-R003** — Instances MUST resume after restart.

**WORKFLOWENGI-R004** — Steps MUST declare retry and timeout policies.

**WORKFLOWENGI-R005** — External side effects MUST use idempotency or reconciliation.

**WORKFLOWENGI-R006** — Compensation MUST not erase authoritative evidence.

**WORKFLOWENGI-R007** — Cancellation semantics MUST be explicit.

**WORKFLOWENGI-R008** — History MUST be observable and auditable.

**WORKFLOWENGI-R009** — Definition upgrades MUST not reinterpret existing instances silently.

**WORKFLOWENGI-R010** — Completion MUST not be reported before required commits succeed.


## 8. Invariants

**WORKFLOWENGI-I001** — Workflow state is durable.

**WORKFLOWENGI-I002** — Definition version is explicit.

**WORKFLOWENGI-I003** — Retries do not duplicate effects.

**WORKFLOWENGI-I004** — Recovery resumes from a consistent checkpoint.

**WORKFLOWENGI-I005** — Kernel orchestration does not own Domain policy.


## 9. Failure and Recovery

Failures SHALL be explicit, typed and observable. Retryable operations MUST preserve idempotency. Durable work SHALL resume from the latest consistent state. Kernel infrastructure MUST NOT fabricate Domain success, silently discard committed work or reinterpret business authority.

## 10. Security and Privacy

Kernel services SHALL minimize exposure of publication content, Personal Knowledge, credentials and provider secrets. Correlation metadata, logs and traces MUST be redacted according to policy. Kernel infrastructure MUST NOT become an unauthorized data sink.

## 11. Example

Publication acquisition may download, verify, register and process. Workflow coordinates; Library and Import own the steps.

## 12. Compatibility and Evolution

Backward-compatible additions MAY introduce optional metadata or contracts. Changes to delivery guarantees, ordering, identity, persistence, transaction boundaries, failure semantics or lifecycle behavior require architectural review and a major version when compatibility cannot be preserved.

## 13. Related Documents

- `README.md`
- `KernelArchitecture.md`
- `../02-Domain/DomainModel.md`
- `../02-Domain/EngineResponsibilities.md`

## 14. Status

This document is part of the KnowledgeOS Kernel V4 release-candidate baseline.
