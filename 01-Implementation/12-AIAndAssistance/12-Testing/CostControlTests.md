# Cost Control Tests

**Project:** KnowledgeOS  
**Section:** Implementation / AI and Assistance / 12-Testing  
**Document:** CostControlTests  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** KnowledgeOS Server, macOS, iPhone, iPad, Web  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the cost control tests for AI and Assistance, covering grounding, privacy, fallback, cost, safety and performance verification.

## 2. Module Boundary

This module implements optional AI-assisted capabilities over approved KnowledgeOS sources.

Included:

- local and remote model providers;
- context assembly;
- retrieval-augmented generation;
- grounded question answering;
- summarization;
- extraction and classification;
- relationship suggestions;
- flashcards and study assistance;
- translation and writing assistance;
- recommendations;
- AI artifacts;
- privacy, cost and safety policy;
- desktop, mobile and web integration;
- contracts, tests and operations.

Excluded:

- canonical UDM or DPM authority;
- automatic modification of publication metadata;
- automatic acceptance of graph relationships;
- source acquisition;
- annotation ownership;
- Personal Knowledge synchronization transport;
- direct provider use from UI code.

## 3. Architectural Context

```text
Authorized Knowledge Sources
├── UDM
├── DPM
├── Knowledge Graph
├── Search Results
└── Personal Knowledge
          │
          ▼
Policy Evaluation
├── Privacy
├── Cost
├── Capability
└── Safety
          │
          ▼
Context Assembly and Prompt
          │
          ▼
Local or Remote Provider
          │
          ▼
Validation and Grounding
          │
          ▼
Derived or Personal AI Artifact
```

AI output is not canonical knowledge by default.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- AI SHALL remain an optional KnowledgeOS capability.
- AI output SHALL remain derived or Personal Knowledge until explicitly accepted through an approved workflow.
- AI SHALL NOT become canonical authority automatically.
- Every task SHALL record provider, model, prompt or template version, configuration and input references.
- Remote model execution SHALL require explicit privacy-policy authorization.
- Personal Knowledge SHALL NOT be transmitted remotely without explicit authorization.
- Local models SHOULD be preferred when privacy, offline operation or cost policy requires them.
- Provider selection SHALL be policy-driven and replaceable.
- AI output SHALL be treated as untrusted until validated.
- Grounded responses SHALL preserve source identities and citations where applicable.
- Model, prompt and artifact versions SHALL be explicit.
- Retries and fallbacks SHALL preserve task identity and provenance.
- AI artifacts SHALL be invalidated when source, model or prompt dependencies change.
- Logs and telemetry SHALL NOT contain prompts, publication content, Personal Knowledge or secrets by default.
- Privacy, cost and safety policies SHALL be evaluated before execution.
- Denied tasks SHALL fail before content is transmitted.
- Cost estimates and usage SHALL be observable when providers support them.
- Safety filtering SHALL not erase provenance or silently alter accepted user knowledge.
- Tests SHALL verify privacy denial before transmission.
- Tests SHALL verify provenance and grounding.
- Tests SHALL verify provider fallback does not weaken privacy policy.
- Completion SHALL demonstrate that AI artifacts can be removed without losing canonical knowledge.

## 6. AI Task Model

Every AI task SHOULD include:

- task identity;
- task type;
- actor;
- privacy class;
- input references and versions;
- context sources;
- provider-selection policy;
- selected provider and model;
- prompt or template version;
- configuration;
- deadline and cancellation;
- expected output schema;
- validation policy;
- cost policy;
- provenance;
- final artifact identity.

Tasks SHALL not embed more source content than necessary.

## 7. Artifact Model

AI artifacts may include:

- summaries;
- answers;
- extracted entities;
- classifications;
- suggested relationships;
- flashcards;
- translations;
- rewritten text;
- study plans;
- recommendations.

Every artifact SHALL identify:

- generated/derived status;
- provider and model;
- prompt/template version;
- input identities;
- creation time;
- privacy scope;
- confidence or limitations where applicable;
- grounding citations;
- validation outcome;
- user acceptance state.

## 8. Grounding and Citations

Grounded tasks SHOULD use Search and Knowledge Graph contracts to retrieve context.

The implementation SHALL distinguish:

- source-backed statements;
- model inference;
- user-provided context;
- unsupported statements;
- uncertainty.

Citations SHALL reference stable KnowledgeOS identities and anchors when available.

## 9. Failure and Degradation

The module SHALL handle:

- no eligible provider;
- local model unavailable;
- remote provider outage;
- quota or cost limit;
- privacy-policy denial;
- context too large;
- incompatible output schema;
- unsafe or invalid output;
- timeout;
- cancellation;
- unknown remote completion state;
- stale source dependencies;
- missing grounding evidence.

Failure SHALL not modify canonical or Personal Knowledge automatically.

## 10. Security and Privacy

- Remote transmission requires explicit policy authorization.
- Personal Knowledge context requires explicit user-scoped access.
- Credentials SHALL use approved secure storage.
- Provider retention and training policy SHALL be known where applicable.
- Logs SHALL not contain prompts, responses, source content or secrets by default.
- Prompt injection and malicious source content SHALL be treated as untrusted input.
- Tool or agent capabilities, if introduced later, SHALL use least privilege.
- AI artifacts SHALL inherit an explicit privacy scope.

## 11. Cost and Resource Management

The implementation SHOULD:

- estimate provider cost before execution when possible;
- expose usage and budget status;
- allow local-only profiles;
- bound context size and output length;
- control concurrent tasks;
- defer expensive background work;
- protect interactive reading and annotation;
- cache only policy-approved derived artifacts;
- invalidate artifacts when dependencies change.

## 12. Verification and Acceptance

- AI is fully optional.
- Local-only operation is supported for eligible tasks.
- Remote execution is blocked when privacy policy denies it.
- Personal Knowledge is not sent remotely without authorization.
- Provider, model, prompt and source provenance are recorded.
- Grounded answers preserve citations.
- Unsupported claims or uncertainty are explicit.
- Suggestions do not modify canonical or Personal Knowledge automatically.
- Provider fallback preserves privacy and cost policy.
- Invalid output is rejected.
- AI artifacts can be deleted without losing canonical knowledge.
- Privacy, cost, safety, grounding and performance tests pass.
- Architecture traceability is complete.

## 13. Traceability

- `00-Architecture/04-Platform/AI/README.md`
- `00-Architecture/02-Domain/KnowledgeGraph/README.md`
- `00-Architecture/04-Platform/Search/README.md`
- `00-Architecture/05-Integration/Providers/AIProviders.md`
- `00-Architecture/05-Integration/ExternalServices/RemoteExecution.md`
- `00-Architecture/03-Kernel/WorkflowEngine.md`
- `00-Architecture/03-Kernel/JobSystem.md`
- `01-Implementation/09-KnowledgeProcessingPipeline/README.md`
- `01-Implementation/10-KnowledgeGraph/README.md`
- `01-Implementation/11-SearchAndDiscovery/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 14. Compatibility and Migration

AI task schemas, prompts, providers, models, artifacts, manifests and public contracts SHALL be versioned.

Breaking changes require migration or artifact invalidation policy. Canonical knowledge SHALL never depend solely on an AI artifact.

## 15. Status

This document is part of the KnowledgeOS AI and Assistance V4 implementation baseline.
