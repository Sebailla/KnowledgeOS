# Embedding Generation

**Project:** KnowledgeOS  
**Section:** Implementation / Knowledge Processing Pipeline / 06-DerivedArtifacts  
**Document:** EmbeddingGeneration  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** KnowledgeOS Server, macOS, iPhone, iPad  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the embedding generation for the Knowledge Processing Pipeline, covering thumbnails, previews, indexes, embeddings and graph projections.

## 2. Module Boundary

This module converts a validated, locally registered source publication into canonical and derived knowledge artifacts.

Included:

- source validation and fingerprinting;
- metadata and asset extraction;
- OCR preparation and execution;
- UDM generation and validation;
- DPM generation and validation;
- canonical publication;
- thumbnails and previews;
- search indexes;
- embeddings;
- Knowledge Graph projection;
- checkpoints, invalidation and regeneration;
- provider integration;
- operational diagnostics.

Excluded:

- source discovery and acquisition;
- Local Library membership decisions;
- reading UI;
- annotation creation;
- Personal Knowledge synchronization;
- export;
- plugin lifecycle.

## 3. Architectural Context

```text
Registered Local Source
          │
          ▼
Processing Workflow
├── Validate Source
├── Detect Format
├── Extract Metadata and Assets
├── OCR when required
├── Generate UDM
├── Validate and Canonicalize UDM
├── Generate DPM
├── Validate DPM and mappings
├── Publish Canonical Versions
└── Generate Derived Artifacts
          │
          ▼
Processed Knowledge Object
```

Canonical and derived outputs remain distinct.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- Original source bytes SHALL remain immutable throughout processing.
- Canonical processing SHALL begin only after successful local registration and integrity validation.
- Every processing stage SHALL declare inputs, outputs, processor version and configuration fingerprint.
- Equivalent inputs processed with the same versions and configuration SHALL produce semantically equivalent canonical output.
- Retryable stages SHALL be idempotent.
- Partial pipeline failure SHALL NOT publish inconsistent canonical UDM or DPM.
- Published UDM and DPM versions SHALL be immutable.
- Node, anchor, asset and relationship identities SHOULD be preserved during compatible reprocessing.
- Every source-derived assertion SHALL preserve provenance.
- AI, statistical and heuristic outputs SHALL remain derived until explicitly accepted by an approved workflow.
- Indexes, embeddings, previews, thumbnails and graph projections SHALL remain rebuildable.
- Personal Knowledge SHALL NOT be folded into publication processing.
- Remote processing SHALL follow explicit privacy and authorization policy.
- Processing state SHALL be observable, resumable and cancellable.
- Derived artifact keys SHALL include source, canonical and processor versions.
- Stale artifacts SHALL be invalidated when any dependency changes.
- Similarity or inference SHALL NOT be treated as canonical truth.
- Artifact deletion SHALL not delete authoritative source or canonical knowledge.

## 6. Processing Manifest

Every processing run SHOULD produce a manifest containing:

- processing identity;
- Knowledge Object identity;
- source item identity and version;
- source checksum;
- pipeline definition version;
- stage definitions;
- processor identities and versions;
- configuration fingerprints;
- input and output identities;
- stage outcomes;
- validation findings;
- checkpoints;
- timestamps;
- privacy profile;
- final publication outcome.

The manifest is operational provenance and SHALL not replace Domain provenance records.

## 7. Stage Lifecycle

```text
Pending
→ Ready
→ Running
→ Validating
→ Completed
```

Additional states include:

- Paused;
- Cancelled;
- RetryScheduled;
- Failed;
- Incompatible;
- Skipped;
- Superseded.

A downstream stage SHALL not run until required upstream outputs are valid and committed.

## 8. Canonical Publication

Canonical publication SHALL be atomic for each declared UDM or DPM version.

Publication requires:

- valid identity;
- valid provenance;
- compatible schema;
- successful required validation;
- complete required references;
- committed version metadata;
- event or outbox persistence.

Warnings MAY remain only when the processing profile permits them and they are explicitly recorded.

## 9. Derived Artifact Management

Derived artifacts SHALL declare:

- artifact identity;
- artifact type;
- source and canonical dependencies;
- processor or model;
- processor version;
- configuration fingerprint;
- creation time;
- validity state;
- privacy scope;
- integrity metadata.

Invalidation SHALL propagate through the dependency graph.

## 10. Failure and Recovery

The module SHALL handle:

- unsupported or malformed source;
- parser failure;
- OCR failure;
- missing assets;
- inconsistent metadata;
- invalid UDM;
- invalid DPM;
- provider outage;
- quota or rate limit;
- insufficient memory or disk;
- process restart;
- checkpoint incompatibility;
- unknown commit status;
- partial derived-artifact generation.

Recovery SHALL resume from the latest compatible checkpoint and SHALL not duplicate canonical versions, artifacts, events or provider side effects.

If canonical publication fails, prior published versions remain authoritative.

## 11. Security and Privacy

- Source content SHALL remain local unless explicit policy authorizes remote processing.
- Remote provider requests SHALL contain minimum necessary data.
- Personal Knowledge SHALL not be included.
- Provider credentials SHALL use approved secure storage.
- Logs and traces SHALL not contain source text, images, annotations or secrets.
- Generated artifacts SHALL inherit appropriate privacy classification.
- Temporary processing files SHALL follow retention and secure-cleanup policy.

## 12. Performance and Resource Management

Processing SHOULD:

- stream large files;
- partition independent work;
- bound memory and disk use;
- apply backpressure;
- honor device energy policy;
- schedule expensive mobile work appropriately;
- support server concurrency limits;
- avoid starving interactive reading and annotation;
- expose queue depth, stage latency and failure rates.

Parallel execution SHALL not change canonical output.

## 13. Verification and Acceptance

- Fixed input and versions produce equivalent UDM and DPM.
- Retried stages do not duplicate outputs.
- Process restart resumes from checkpoints.
- Invalid UDM or DPM is not published.
- Compatible reprocessing preserves stable identities.
- OCR output preserves source-region provenance.
- Derived artifacts invalidate when dependencies change.
- Embeddings and graph projections can be deleted and regenerated.
- Provider failure supports explicit fallback or failure.
- Personal Knowledge is absent from processing inputs.
- Security, privacy, performance and recovery tests pass.
- Architecture traceability is complete.

## 14. Traceability

- `00-Architecture/02-Domain/UDM/UDM.md`
- `00-Architecture/02-Domain/DPM/DPM.md`
- `00-Architecture/02-Domain/KnowledgeObject/README.md`
- `00-Architecture/02-Domain/KnowledgeGraph/README.md`
- `00-Architecture/03-Kernel/WorkflowEngine.md`
- `00-Architecture/03-Kernel/JobSystem.md`
- `00-Architecture/04-Platform/Import/README.md`
- `00-Architecture/04-Platform/Knowledge/README.md`
- `00-Architecture/04-Platform/Search/README.md`
- `00-Architecture/04-Platform/AI/README.md`
- `00-Architecture/05-Integration/Providers/OCRProviders.md`
- `00-Architecture/05-Integration/Providers/AIProviders.md`
- `01-Implementation/08-ImportAndAcquisition/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 15. Compatibility and Migration

Pipeline definitions, processing manifests, checkpoints, canonical schemas, provider contracts and artifact registries SHALL be versioned.

Breaking changes require migration or explicit reprocessing policy. Derived artifacts MAY be regenerated; canonical identity and provenance SHALL be preserved.

## 16. Status

This document is part of the KnowledgeOS Knowledge Processing Pipeline V4 implementation baseline.
