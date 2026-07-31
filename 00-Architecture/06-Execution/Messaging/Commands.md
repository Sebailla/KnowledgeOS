# Command Execution Semantics

**Project:** KnowledgeOS  
**Section:** Execution / Messaging  
**Document:** Commands  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define runtime guarantees for command handling.

## 2. Scope

Applies to Command Bus commands.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 4. Responsibility and Boundaries

Commands express state-changing intent and have one logical handler.

## 5. Conceptual Model

Command runtime covers validation, authorization, expected version, idempotency, transaction and result mapping.

## 6. Normative Requirements

**COMMANDS-R001** — Commands MUST have stable identity.

**COMMANDS-R002** — One logical handler MUST exist.

**COMMANDS-R003** — Expected-version conflicts MUST be explicit.

**COMMANDS-R004** — Retryable commands MUST use idempotency.

**COMMANDS-R005** — Success MUST follow commit.

**COMMANDS-R006** — Validation failures MUST not retry automatically.

**COMMANDS-R007** — Unknown commit status MUST reconcile.

**COMMANDS-R008** — Nested cross-Engine commands SHOULD use workflows.

## 7. Invariants

**COMMANDS-I001** — One handler per command.

**COMMANDS-I002** — No duplicate committed effects.

**COMMANDS-I003** — Commands are immutable.

**COMMANDS-I004** — Authorization precedes mutation.

**COMMANDS-I005** — Result categories are stable.

## 8. Failure and Recovery

Transient failures retry under policy. Concurrency conflicts return conflict results, not generic infrastructure errors.

## 9. Security, Privacy and Observability

Execution metadata SHALL contain only the information required for coordination and diagnosis. Publication content, Personal Knowledge, credentials, access tokens and provider secrets MUST NOT appear in logs, traces, metrics or retry envelopes except under explicit protected diagnostic policy.

Every significant execution path SHALL propagate correlation identity and expose bounded diagnostic state.

## 10. Example

`CreateAnnotation` commits locally and emits an event before returning success.

## 11. Compatibility and Evolution

Changes to delivery guarantees, transaction scope, ordering, consistency, retry semantics, concurrency rules, resource limits or recovery behavior require architectural review. Backward-compatible additions MAY introduce optional policies or metadata.

## 12. Related Documents

- `../../03-Kernel/CommandBus.md`
- `Events.md`
- `../Concurrency/Transactions.md`

## 13. Status

This document is part of the KnowledgeOS Execution V4 release-candidate baseline.
