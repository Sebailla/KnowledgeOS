# AI Engine

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** AIEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define policy-controlled local and remote AI orchestration, derived artifacts, provenance and validation.

## 2. Scope

Covers summarization, extraction, classification, recommendation, assistance and provider-neutral model execution.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

AI Engine owns:

- AI task contracts;
- provider selection;
- local/remote execution policy;
- context assembly;
- prompt/template management;
- model invocation;
- provenance;
- result validation;
- AI artifact lifecycle;
- privacy enforcement.

AI output is derived or personal until explicitly accepted through an approved workflow.

AI SHALL NOT own canonical knowledge or identity.

## 5. Conceptual Model

```text
AIEngine
├── TaskService
├── ContextBuilder
├── PolicyEvaluator
├── ProviderRegistry
├── PromptRegistry
├── ResultValidator
├── AIArtifactRepository
└── AI events
```

## 6. Normative Requirements

**AIENGINE-R001** — AI MUST remain optional.

**AIENGINE-R002** — Provider selection MUST obey privacy, capability and cost policy.

**AIENGINE-R003** — Remote execution MUST require authorization for transmitted content.

**AIENGINE-R004** — Every result MUST record provider, model, configuration, input references and timestamp.

**AIENGINE-R005** — AI output MUST not become canonical automatically.

**AIENGINE-R006** — Personal AI artifacts MUST remain Personal Knowledge.

**AIENGINE-R007** — Deterministic tasks SHOULD use deterministic processing when possible.

**AIENGINE-R008** — Unsupported confidence claims MUST not be fabricated.

**AIENGINE-R009** — Prompts and templates MUST be versioned.

**AIENGINE-R010** — Sensitive context MUST be minimized and redacted according to policy.

**AIENGINE-R011** — Provider failures SHOULD permit approved fallback.

**AIENGINE-R012** — AI artifacts MUST be invalidated when source or model dependencies change.

## 7. Invariants

**AIENGINE-I001** — AI is non-authoritative by default.

**AIENGINE-I002** — Provenance is mandatory.

**AIENGINE-I003** — Providers are replaceable.

**AIENGINE-I004** — Personal content remains protected.

**AIENGINE-I005** — Canonical identity does not depend on model output.

**AIENGINE-I006** — Derived AI artifacts are rebuildable.

## 8. Commands, Queries, Events and Workflows

Commands include `GenerateSummary`, `ExtractEntities`, `ClassifyDocument`, `CreateFlashcards`, `SuggestRelationships` and `InvalidateAIArtifact`.

Queries include `GetAIArtifact`, `GetAvailableModels`, `EstimateTaskPolicy` and `GetTaskStatus`.

Events include `AITaskQueued`, `AIArtifactGenerated`, `AIResultRejected`, `AIProviderUnavailable` and `AIArtifactInvalidated`.

Long-running tasks use Job System or Workflow Engine.

## 9. Failure, Recovery and Degradation

Provider timeout or quota failure SHALL preserve task state and allow retry or fallback. Invalid or unsafe output SHALL be rejected while retaining diagnostic provenance without exposing sensitive prompt content.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

A local model generates a summary stored as a Personal AI artifact. It syncs through Personal Knowledge if enabled, never becoming Master Library metadata.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../README.md`
- `../Knowledge/README.md`
- `../../02-Domain/KnowledgeGraph/README.md`
- `../../03-Kernel/JobSystem.md`
- `../../05-Integration/Providers/AIProviders.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
