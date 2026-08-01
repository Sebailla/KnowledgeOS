# Web Publishing

**Project:** KnowledgeOS  
**Section:** Implementation / Export and Publishing / 12-Web  
**Document:** WebPublishing  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** KnowledgeOS Server, macOS, iPhone, iPad, Web  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the web publishing for Export and Publishing, covering optional web export and remote delivery.

## 2. Module Boundary

This module generates and optionally publishes derived outputs from approved KnowledgeOS sources.

Included:

- export planning;
- format transformation;
- rendering and composition;
- asset selection and packaging;
- profiles;
- loss analysis;
- local and remote publishing;
- manifests, signatures and encryption;
- output delivery;
- export registries and history;
- desktop, mobile and web integration;
- Plugin SDK export extension points;
- tests and operations.

Excluded:

- canonical UDM or DPM ownership;
- Knowledge Object mutation;
- source import or acquisition;
- Personal Knowledge synchronization;
- annotation editing;
- search-index ownership;
- AI provider ownership;
- unrestricted plugin execution.

## 3. Architectural Context

```text
Knowledge Objects + UDM + DPM + Selected Personal Knowledge
                              │
                              ▼
                       Export Profile
                              │
                              ▼
                      Export Pipeline
├── Resolve Inputs
├── Transform Structure
├── Compose Presentation
├── Process Assets
├── Validate Fidelity and Loss
├── Package
└── Produce Manifest
                              │
                              ▼
                     Derived Export Artifact
                              │
                              ▼
                    Optional Publishing Flow
```

Every output is derived. Source knowledge remains unchanged.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- UDM, DPM and Knowledge Objects SHALL remain canonical inputs.
- Every export output SHALL remain derived and regenerable.
- Export SHALL NOT mutate canonical publication content or Personal Knowledge.
- Personal Knowledge inclusion SHALL be explicit and opt-in.
- Every export SHALL identify source identities, versions and export profile.
- Export profiles SHALL be immutable versions.
- Lossy transformations SHALL produce an explicit loss report.
- Equivalent inputs, versions and profile SHALL produce equivalent logical output.
- Assets SHALL preserve identity, integrity and relationship information where the target permits.
- Temporary workspaces SHALL be isolated and securely cleaned.
- Export failures SHALL NOT modify source state.
- Retryable export operations SHALL be idempotent or create explicitly distinct outputs.
- Public contracts SHALL not expose format-library implementation types.
- Plugin exporters SHALL use approved public contracts and capabilities only.
- Logs and telemetry SHALL not contain publication content, Personal Knowledge or secrets by default.
- Publishing SHALL remain separate from export generation.
- Delivery success SHALL not be assumed without the declared acknowledgement.
- Signatures and encryption SHALL not alter logical output semantics.
- Publishing history SHALL remain operational and SHALL not alter source provenance.
- Client UI SHALL use public Export contracts.
- Preview SHALL identify format, profile and possible losses.
- Users SHALL see progress, cancellation, failure and output location.
- Print and share integrations SHALL preserve privacy and authorization.

## 6. Export Profile

Every export profile SHOULD define:

- profile identity and version;
- target format and format version;
- source scope;
- Personal Knowledge inclusion policy;
- layout and fidelity mode;
- typography and theme;
- asset policy;
- citation and bibliography policy;
- table and figure policy;
- accessibility policy;
- localization;
- signing and encryption;
- output validation;
- delivery policy;
- plugin extensions;
- resource limits.

Profiles SHALL be immutable once used for a published export record.

## 7. Export Lifecycle

```text
Requested
→ Planning
→ Transforming
→ Rendering
→ Packaging
→ Validating
→ Ready
```

Optional publishing adds:

```text
Ready
→ Publishing
→ Delivered
→ Acknowledged
```

Additional states include:

- Paused;
- Cancelled;
- RetryScheduled;
- Failed;
- ValidationFailed;
- DeliveryFailed;
- Superseded;
- Expired.

## 8. Loss and Fidelity Model

Loss categories include:

- unsupported semantic structure;
- unsupported presentation;
- missing asset;
- approximated typography;
- flattened interactivity;
- omitted Personal Knowledge;
- unresolved reference;
- reduced accessibility;
- transformed multimedia;
- provider-specific degradation.

A loss report SHALL identify severity, affected identity, reason and fallback.

## 9. Failure and Recovery

The module SHALL handle:

- unsupported format or version;
- missing UDM or DPM;
- missing asset;
- invalid profile;
- transformation failure;
- render-provider failure;
- packaging failure;
- validation failure;
- insufficient disk or memory;
- interrupted job;
- plugin exporter failure;
- remote publishing outage;
- unknown delivery state;
- signing or encryption failure.

Recovery SHALL resume from compatible checkpoints or restart safely without mutating source state.

## 10. Security and Privacy

- Personal Knowledge inclusion is opt-in.
- Private annotations and history SHALL be excluded by default.
- Export and publishing authorization SHALL be explicit.
- Temporary workspaces SHALL be protected.
- Credentials and signing keys SHALL use approved secure storage.
- Logs SHALL not contain publication content or Personal Knowledge.
- Remote publishing SHALL transmit only approved artifacts and metadata.
- Export files SHALL follow output retention and secure deletion policy.
- Plugin exporters SHALL receive minimum necessary capabilities and data.

## 11. Performance and Resource Management

The implementation SHOULD:

- stream large assets;
- use bounded temporary storage;
- partition independent transformations;
- preserve deterministic merge order;
- support background export;
- expose progress;
- support cancellation;
- avoid blocking local reading and annotation;
- enforce output-size limits;
- provide backpressure for remote publishing;
- measure transformation, rendering, packaging and delivery latency.

## 12. Verification and Acceptance

- Source UDM, DPM, Knowledge Objects and Personal Knowledge remain unchanged.
- Fixed inputs, versions and profile produce equivalent logical output.
- Every export records source and profile versions.
- Lossy output produces a complete loss report.
- Private Personal Knowledge is excluded by default.
- Asset relationships and integrity remain coherent.
- Unsupported required capabilities fail explicitly.
- Interrupted export resumes or restarts safely.
- Plugin exporters cannot access private repositories.
- Publishing does not imply delivery acknowledgement unless confirmed.
- Format, visual, accessibility, privacy, performance and recovery tests pass.
- Architecture traceability is complete.

## 13. Traceability

- `00-Architecture/04-Platform/Export/README.md`
- `00-Architecture/02-Domain/UDM/UDM.md`
- `00-Architecture/02-Domain/DPM/DPM.md`
- `00-Architecture/02-Domain/KnowledgeObject/README.md`
- `00-Architecture/05-Integration/DataExchange/ExportProtocols.md`
- `00-Architecture/05-Integration/Providers/ExportProviders.md`
- `00-Architecture/03-Kernel/WorkflowEngine.md`
- `00-Architecture/03-Kernel/JobSystem.md`
- `01-Implementation/15-PluginRuntime/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 14. Compatibility and Migration

Export profiles, format adapters, manifests, reports, registry records, checkpoints, plugin extension points and public contracts SHALL be versioned.

Breaking changes require migration or explicit regeneration policy. Derived export artifacts MAY be regenerated; source identity and provenance SHALL remain unchanged.

## 15. Status

This document is part of the KnowledgeOS Export and Publishing V4 implementation baseline.
