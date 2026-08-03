# GraphQL API

**Project:** KnowledgeOS  
**Section:** Integration / Public API  
**Document:** GraphQL  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define GraphQL transport for approved query and mutation contracts.

## 2. Scope

Applies where GraphQL is enabled.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

GraphQL provides composable reads and explicit mutations over public schemas.

## 5. Conceptual Model

Schema types map to public contracts. Resolvers invoke Platform queries and commands rather than private repositories.

## 6. Normative Requirements

**GRAPHQL-R001** — Resolvers MUST enforce authorization.

**GRAPHQL-R002** — Mutations MUST preserve idempotency where retryable.

**GRAPHQL-R003** — Query complexity and depth MUST be bounded.

**GRAPHQL-R004** — N+1 access MUST be controlled.

**GRAPHQL-R005** — Schema deprecation MUST follow API policy.

**GRAPHQL-R006** — Subscriptions MUST expose approved integration events only.

**GRAPHQL-R007** — Resolvers MUST not leak internal implementation types.

**GRAPHQL-R008** — Personal fields MUST be scope-protected.

## 7. Invariants

**GRAPHQL-I001** — Schema is versioned through compatibility policy.

**GRAPHQL-I002** — Resolvers are thin adapters.

**GRAPHQL-I003** — Business logic remains in Platform.

**GRAPHQL-I004** — Queries are bounded.

**GRAPHQL-I005** — Private state is protected.

## 8. Failure, Recovery and Degradation

Complexity-limit failures SHALL occur before expensive execution.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

A `publication` resolver uses Library Query Bus and a `createAnnotation` mutation uses Annotation Command Bus.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `APIConventions.md`
- `Authentication.md`
- `Versioning.md`
- `../../03-Kernel/QueryBus.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
