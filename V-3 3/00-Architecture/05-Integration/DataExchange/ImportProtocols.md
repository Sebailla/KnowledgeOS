
# Import Protocols

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Data Exchange

**Document:** Import Protocols

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural protocols governing the import of external information into KnowledgeOS.

Import Protocols establish the controlled process through which files, packages, documents, external services, repositories and other information sources are:

* identified;
* acquired;
* staged;
* inspected;
* decoded;
* validated;
* transformed;
* mapped;
* reviewed;
* integrated.

Import Protocols admit external information into KnowledgeOS.

They never write directly into canonical knowledge.

---

# 2. Scope

This document governs import from:

* local files;
* directories;
* removable storage;
* NAS repositories;
* remote URLs;
* external APIs;
* cloud services;
* scanners;
* cameras;
* clipboard content;
* drag-and-drop operations;
* shared content;
* email attachments;
* archive packages;
* Canonical Exchange Packages;
* synchronization packages;
* Plugin-provided sources;
* future external sources.

This document also governs:

* source acquisition;
* source identity;
* format detection;
* staging;
* decoding;
* extraction;
* structural validation;
* semantic validation;
* security inspection;
* Canonical Exchange conversion;
* Import Plans;
* identity resolution;
* conflict handling;
* execution;
* rollback;
* recovery;
* provenance;
* observability.

This document does not govern:

* internal canonical knowledge semantics;
* OCR implementation;
* layout-analysis algorithms;
* Provider implementation details;
* concrete serialization syntax;
* user-interface design;
* direct synchronization replication;
* export protocols;
* storage implementation.

---

# 3. Definition of an Import Protocol

An Import Protocol is a versioned architectural process that defines how an external information source enters the KnowledgeOS processing boundary.

An Import Protocol defines:

* source acquisition;
* source inspection;
* accepted representations;
* validation stages;
* transformation stages;
* failure semantics;
* security requirements;
* provenance requirements;
* canonical integration prerequisites.

An Import Protocol is not a parser.

It is not a Provider.

It is not an Import Engine implementation.

It is the governed sequence through which external information becomes eligible for canonical integration.

---

# 4. Architectural Position

Import Protocols belong to the Integration layer.

```text
External Source
        │
        ▼
Import Protocol
        │
        ▼
Import Provider / Adapter
        │
        ▼
Staging Boundary
        │
        ▼
Canonical Exchange
        │
        ▼
Import Engine
        │
        ▼
Knowledge Engine
        │
        ▼
Canonical Knowledge
```

The Integration layer acquires and represents external information.

The Platform layer orchestrates processing.

The Domain layer owns canonical meaning.

---

# 5. Core Principle

External information shall never become canonical merely because it was successfully acquired or parsed.

The required progression is:

```text
Acquired
    │
    ▼
Staged
    │
    ▼
Inspected
    │
    ▼
Validated
    │
    ▼
Mapped
    │
    ▼
Planned
    │
    ▼
Integrated
```

Every transition shall be explicit.

---

# 6. Mission

The mission of Import Protocols is to enable KnowledgeOS to ingest heterogeneous information while preserving:

* canonical integrity;
* user ownership;
* provenance;
* determinism;
* security;
* privacy;
* reversibility;
* extensibility;
* format independence;
* failure isolation;
* observability.

---

# 7. Design Philosophy

Import shall be:

* staged;
* explicit;
* deterministic where possible;
* reversible before commit;
* idempotent where identity permits;
* security-aware;
* privacy-aware;
* provenance-preserving;
* format-independent;
* failure-isolated.

Import shall prefer controlled admission over direct conversion into mutable canonical objects.

---

# 8. Import Boundary

All external information shall cross an explicit Import Boundary.

```text
Untrusted External Information
        │
        ▼
Import Boundary
        │
        ▼
Controlled Staging
```

Before crossing into canonical processing, the source shall be treated as untrusted.

The Import Boundary shall enforce:

* size limits;
* source validation;
* access control;
* content-type validation;
* path safety;
* decompression safety;
* active-content restrictions;
* resource limits.

---

# 9. Import Source

An Import Source is the external origin from which information is acquired.

Examples include:

* a file;
* a directory;
* a URL;
* an API response;
* a scanner;
* a camera;
* a cloud repository;
* a NAS location;
* an Exchange Package;
* a clipboard payload;
* an application share.

The source is external evidence.

It is not a canonical object.

---

# 10. Source Identity

Every import shall preserve a Source Identity where available.

Source Identity may include:

* URI;
* filesystem reference;
* file identifier;
* external system identity;
* remote object identifier;
* publication identifier;
* device reference;
* package identity;
* external revision.

Source Identity supports:

* provenance;
* duplicate detection;
* incremental import;
* re-import;
* conflict analysis.

---

# 11. Source Identity Stability

Source Identity may be:

* stable;
* conditionally stable;
* ephemeral;
* unknown.

Import processing shall record the confidence and stability of the identity.

A filename alone shall not be assumed to be a stable Source Identity.

---

# 12. Source Descriptor

An Import Source Descriptor may contain:

* Source Identity;
* source type;
* source location;
* display name;
* media type;
* size;
* modification time;
* creation time;
* source revision;
* access method;
* authentication requirement;
* expected integrity;
* privacy classification.

Source descriptors are operational metadata.

They do not establish canonical meaning.

---

# 13. Import Request

An Import Request initiates an import workflow.

A request may include:

* Request Identity;
* source references;
* target Library;
* Import Profile;
* user preferences;
* identity policy;
* duplicate policy;
* conflict policy;
* privacy policy;
* execution preferences;
* optional Provider preferences;
* correlation metadata.

The Import Request expresses intent.

It does not perform canonical mutation directly.

---

# 14. Import Profile

An Import Profile defines the desired processing and integration behavior.

Typical profiles may include:

* Fast Import;
* High-Fidelity Import;
* Archival Import;
* Scientific Document Import;
* Book Import;
* Web Content Import;
* Image Scan Import;
* Metadata-Only Import;
* Exchange Package Import;
* Reprocessing Import.

A Profile may define:

* required processing stages;
* fidelity requirements;
* OCR policy;
* layout-analysis policy;
* provenance requirements;
* original-source retention;
* user-review requirements;
* degradation tolerance.

---

# 15. Profile Identity

Every Import Profile shall have:

* Profile Identity;
* Profile Version;
* owner;
* required stages;
* optional stages;
* validation rules;
* default policy.

Changing Profile semantics incompatibly requires Version evolution.

---

# 16. Import Session

An Import Session represents one bounded import execution context.

A Session may include:

* Session Identity;
* Import Request;
* acquired sources;
* staged artifacts;
* detected formats;
* selected Providers;
* processing state;
* Import Plan;
* validation results;
* conflicts;
* final outcome.

Session state is operational.

It is not canonical knowledge.

---

# 17. Import Session Lifecycle

An Import Session may follow:

```text
Created
    │
    ▼
Acquiring
    │
    ▼
Staging
    │
    ▼
Inspecting
    │
    ▼
Processing
    │
    ▼
Planning
    │
    ├───────────────┐
    ▼               ▼
Awaiting Review   Failed
    │
    ▼
Executing
    │
    ├───────────────┐
    ▼               ▼
Completed        Rolled Back
```

Lifecycle states shall be explicit.

---

# 18. Acquisition

Acquisition obtains external source content or a controlled reference to it.

Acquisition may involve:

* reading a local file;
* copying into staging;
* downloading;
* streaming;
* scanning;
* capturing;
* retrieving through an API;
* mounting or accessing a repository;
* accepting an application share.

Acquisition shall not yet imply content trust.

---

# 19. Copy and Reference Acquisition

A source may be acquired by:

* Copy;
* Secure Reference;
* Stream;
* Snapshot;
* Provider-managed access.

The selected strategy shall be explicit.

Mutable external sources should normally be snapshotted when reproducibility requires it.

---

# 20. Source Snapshot

A Source Snapshot captures the exact input used by the import workflow.

A snapshot may preserve:

* source bytes;
* content hash;
* source metadata;
* source revision;
* acquisition time.

Snapshots support:

* reproducibility;
* reprocessing;
* audit;
* duplicate detection;
* failure recovery.

---

# 21. Mutable Sources

External sources may change during import.

Import shall avoid reading inconsistent mixed revisions.

Strategies may include:

* snapshot copy;
* source lock;
* expected revision;
* content hash verification;
* restart on change;
* Provider-supported version read.

The selected consistency strategy shall be recorded.

---

# 22. Remote Acquisition

Remote acquisition may require:

* authentication;
* authorization;
* secure transport;
* rate-limit handling;
* retries;
* resumable download;
* integrity verification;
* privacy approval.

Remote acquisition shall never expand scope beyond the Import Request silently.

---

# 23. Source Access Authorization

The import workflow shall access only sources explicitly authorized by:

* user selection;
* configured repository scope;
* application permission;
* security-scoped reference;
* external service authorization;
* approved automation policy.

Successful authentication to a source does not imply authorization to import all accessible content.

---

# 24. Staging

Staging isolates acquired content before canonical processing.

Staging provides a controlled environment for:

* security inspection;
* decoding;
* extraction;
* temporary transformation;
* validation;
* recovery;
* cleanup.

Staged content remains non-canonical.

---

# 25. Staging Identity

Every staged artifact shall have a Staging Identity.

Staging Identity supports:

* references;
* cleanup;
* processing lineage;
* diagnostics;
* checkpointing.

Staging Identity shall not become canonical identity.

---

# 26. Staging Storage

Staging Storage shall be:

* isolated;
* bounded;
* access-controlled;
* temporary or lifecycle-managed;
* non-authoritative;
* observable.

Staging may use local or approved remote storage according to privacy policy.

---

# 27. Staging Immutability

Acquired source snapshots should be immutable within the Import Session.

Derived processing artifacts shall be stored separately.

This preserves the original input for:

* comparison;
* reprocessing;
* provenance;
* diagnostics.

---

# 28. Staging Cleanup

Staged artifacts shall have cleanup policy.

Cleanup may occur after:

* successful completion;
* rollback;
* cancellation;
* expiration;
* manual removal;
* checkpoint retention period.

Original sources shall never be deleted merely because staged copies are cleaned.

---

# 29. Quarantine

Potentially unsafe sources may enter Quarantine.

Quarantined sources shall not proceed to ordinary parsing or active-content execution.

Quarantine may result from:

* integrity failure;
* suspicious archive structure;
* malware signal;
* prohibited executable content;
* excessive resource requirements;
* invalid signature;
* policy violation.

---

# 30. Quarantine Lifecycle

Quarantined content may be:

* rejected;
* retained for analysis;
* manually approved;
* reprocessed with stronger isolation;
* deleted from staging.

Manual approval shall not bypass mandatory structural safety checks.

---

# 31. Format Detection

Format Detection identifies the likely representation of an acquired source.

Detection may use:

* declared media type;
* file signature;
* magic bytes;
* structural inspection;
* filename extension;
* Provider metadata;
* container structure.

Filename extension alone is insufficient.

---

# 32. Declared and Detected Format

The workflow shall distinguish:

* declared format;
* detected format;
* resolved format.

A mismatch may indicate:

* incorrect metadata;
* renamed file;
* malformed source;
* malicious content;
* unsupported hybrid format.

Mismatch shall be observable.

---

# 33. Format Confidence

Format Detection may produce confidence.

Confidence may be:

* Certain;
* High;
* Medium;
* Low;
* Ambiguous.

Low or ambiguous confidence may require:

* additional detection;
* user selection;
* safe rejection;
* multiple parser candidates.

---

# 34. Composite Formats

Some sources are containers containing multiple representations.

Examples include:

* EPUB;
* DOCX;
* ZIP archives;
* web archives;
* Exchange Packages;
* office packages.

Detection shall identify both:

* container format;
* contained logical format.

---

# 35. Format Ambiguity

When several formats are plausible, the workflow shall not choose nondeterministically.

Resolution may use:

* explicit user choice;
* deterministic priority;
* stronger structural validation;
* Import Profile;
* Provider capability;
* source metadata.

The decision shall be recorded.

---

# 36. Provider Resolution

Import Provider resolution identifies compatible implementations for the detected source and Import Profile.

Resolution may consider:

* source type;
* format;
* format Version;
* required Features;
* document characteristics;
* privacy;
* locality;
* health;
* availability;
* resource requirements;
* user preference.

Providers shall not select themselves globally.

---

# 37. Provider Selection

Provider Selection chooses one compatible Provider or a controlled Provider pipeline.

Selection shall be:

* explicit;
* deterministic under equivalent conditions;
* observable;
* policy-driven.

The selected Provider shall remain replaceable.

---

# 38. Multi-Provider Import

An import workflow may use multiple Providers.

Example:

```text
PDF Provider
    │
    ▼
Page Extraction
    │
    ▼
OCR Provider
    │
    ▼
Layout Provider
    │
    ▼
Semantic Processing
```

Each Provider shall have an explicit responsibility.

Hidden coupling between Providers is prohibited.

---

# 39. Import Pipeline

An Import Pipeline is a sequence of approved processing stages.

Typical stages include:

1. Acquisition;
2. Staging;
3. Security Inspection;
4. Format Detection;
5. Decoding;
6. Content Extraction;
7. OCR;
8. Layout Analysis;
9. Structural Reconstruction;
10. Semantic Enrichment;
11. Canonical Exchange Mapping;
12. Validation;
13. Import Planning;
14. Canonical Integration.

Not every source requires every stage.

---

# 40. Pipeline Definition

Every Import Pipeline shall define:

* Pipeline Identity;
* Pipeline Version;
* stages;
* stage order;
* required inputs;
* produced outputs;
* failure policy;
* retry policy;
* cancellation semantics;
* checkpoint policy.

Pipeline definitions shall not be hidden in implementation code alone.

---

# 41. Stage Isolation

Each stage shall consume and produce explicit artifacts or contracts.

A stage shall not depend upon undocumented mutable state from another stage.

This enables:

* replacement;
* testing;
* retry;
* observability;
* checkpointing;
* parallelization.

---

# 42. Stage Determinism

Stages shall be deterministic where the underlying algorithm permits it.

Given equivalent:

* input;
* Provider Version;
* configuration;
* model;
* execution conditions;

the stage should produce semantically equivalent output.

Nondeterministic stages shall declare that characteristic.

---

# 43. Stage Failure

A stage failure shall identify:

* stage;
* Provider;
* input reference;
* failure category;
* retryability;
* partial output;
* recovery options.

Failure shall not corrupt prior stage artifacts.

---

# 44. Decoding

Decoding converts source bytes or streams into a format-specific structured representation.

Decoding may include:

* container parsing;
* character decoding;
* metadata extraction;
* resource enumeration;
* page enumeration;
* embedded Asset extraction.

Decoded output remains non-canonical.

---

# 45. Decoder Safety

Decoders shall enforce:

* size limits;
* nesting limits;
* recursion limits;
* entry-count limits;
* path safety;
* decompression limits;
* memory limits;
* timeout.

External decoder libraries shall be treated as security-sensitive dependencies.

---

# 46. Text Decoding

Text decoding shall identify:

* character encoding;
* Unicode normalization;
* line-ending normalization;
* byte-order markers;
* decoding errors.

Original bytes may be preserved for provenance and reprocessing.

---

# 47. Container Extraction

Container extraction shall prevent:

* path traversal;
* absolute paths;
* symbolic-link escape;
* device-file creation;
* duplicate ambiguous paths;
* decompression bombs;
* uncontrolled nested archives.

Extracted entries shall remain within staging.

---

# 48. Content Extraction

Content Extraction obtains observable information from the decoded source.

It may produce:

* text;
* images;
* pages;
* metadata;
* Assets;
* links;
* styles;
* structural hints;
* embedded annotations;
* external references.

Extraction does not establish canonical semantics.

---

# 49. Original Asset Preservation

Where policy permits, original source Assets should be preserved.

Preservation supports:

* fidelity;
* reprocessing;
* provenance;
* user ownership;
* future parser improvements.

Original Assets shall remain distinguishable from derived Assets.

---

# 50. Derived Assets

Processing may generate derived Assets such as:

* rendered pages;
* thumbnails;
* cropped regions;
* normalized images;
* extracted figures;
* OCR overlays.

Every derived Asset shall reference its source and transformation provenance.

---

# 51. OCR Invocation

OCR shall be invoked only when required or explicitly requested.

Possible triggers include:

* image-only page;
* missing text layer;
* unreliable text layer;
* scanned handwriting;
* selected regions;
* low-confidence extraction.

OCR orchestration belongs to the Import Engine.

---

# 52. Native Text and OCR Text

The workflow shall distinguish:

* source-native text;
* extracted text;
* OCR-recognized text;
* corrected text;
* AI-assisted text.

These representations shall not overwrite one another silently.

---

# 53. Layout Analysis

Layout Analysis may identify:

* Pages;
* Regions;
* Columns;
* text blocks;
* figures;
* tables;
* headers;
* footers;
* reading-order candidates;
* spatial relationships.

Layout output remains provisional until mapped and validated.

---

# 54. Structural Reconstruction

Structural Reconstruction maps observable content into document structure.

It may infer:

* headings;
* paragraphs;
* lists;
* tables;
* captions;
* footnotes;
* references;
* sections.

Inference confidence and provenance shall be preserved.

---

# 55. Semantic Enrichment

Semantic Enrichment may add:

* entities;
* concepts;
* classifications;
* links;
* summaries;
* inferred relationships;
* language metadata.

Enrichment is optional unless required by the Import Profile.

Probabilistic enrichment is non-authoritative until validated.

---

# 56. AI-Assisted Import

AI may assist:

* classification;
* extraction;
* reconstruction;
* entity recognition;
* metadata completion;
* ambiguity resolution.

AI-assisted processing shall preserve:

* Provider or model provenance where appropriate;
* confidence or uncertainty;
* human-review status;
* original source evidence.

AI output shall never silently become canonical fact.

---

# 57. Canonical Exchange Conversion

Processed import artifacts shall be mapped into the Canonical Exchange Model before canonical integration when the applicable protocol requires it.

```text
Provider Output
    │
    ▼
Import Mapping
    │
    ▼
Canonical Exchange
    │
    ▼
Validation
```

Provider-specific structures shall not cross into canonical Domain mutation.

---

# 58. Mapping Identity

Every mapping operation shall have a Mapping Identity or traceable processing reference.

Mapping provenance may include:

* source artifact;
* Provider;
* mapping Version;
* configuration;
* timestamp;
* warnings;
* confidence.

---

# 59. Mapping Rules

Mapping rules shall define:

* source field;
* target exchange field;
* normalization;
* default behavior;
* omission behavior;
* conflict behavior;
* unsupported behavior.

Mapping rules shall be versioned.

---

# 60. Mapping Loss

Information that cannot be represented shall be classified as:

* Omitted;
* Externalized;
* Preserved as Extension Data;
* Flattened;
* Approximated;
* Unsupported.

Mapping loss shall be reported.

---

# 61. Structural Validation

Structural validation verifies that produced exchange representations conform to their expected schemas.

It includes:

* required fields;
* types;
* identities;
* references;
* collection constraints;
* format Versions;
* extension structures.

Passing structural validation does not imply semantic correctness.

---

# 62. Semantic Validation

Semantic validation verifies meaning and consistency.

Examples include:

* valid hierarchy;
* valid relationships;
* valid Anchors;
* valid Version lineage;
* valid Asset references;
* consistent language metadata;
* compatible UDM and DPM mapping.

Semantic validation may produce warnings or blockers.

---

# 63. Fidelity Validation

Fidelity validation evaluates how well the processed representation preserves source information.

Fidelity dimensions may include:

* textual;
* structural;
* semantic;
* visual;
* annotation;
* metadata;
* provenance;
* Asset.

The Import Profile determines required fidelity.

---

# 64. Confidence Aggregation

Import processing may aggregate confidence from:

* OCR;
* layout analysis;
* classification;
* metadata extraction;
* identity matching;
* semantic inference.

Confidence from different Providers shall not be averaged without a defined normalization model.

---

# 65. Validation Severity

Validation findings may have severity:

* Information;
* Warning;
* Review Required;
* Blocking;
* Security Blocking.

Severity shall determine whether the workflow may proceed automatically.

---

# 66. Validation Report

Every significant import shall produce a Validation Report.

The report may include:

* detected format;
* selected Providers;
* structural findings;
* semantic findings;
* fidelity findings;
* security findings;
* missing Assets;
* unresolved references;
* confidence summary;
* degradation;
* required user decisions.

---

# 67. Identity Resolution

Identity Resolution determines whether imported Exchange Objects correspond to existing canonical objects.

Resolution may use:

* canonical identity;
* Source Identity;
* content hash;
* publication identifier;
* metadata similarity;
* relationship context;
* previous import history.

Identity Resolution shall not rely solely on filename.

---

# 68. Identity Match Types

Possible identity outcomes include:

* Exact Match;
* Strong Match;
* Probable Match;
* Ambiguous Match;
* No Match;
* Conflict.

Only policy-approved match levels may be applied automatically.

---

# 69. Duplicate Detection

Duplicate detection may occur at:

* source level;
* package level;
* object level;
* Asset level;
* content level;
* Version level.

Duplicate detection shall distinguish:

* duplicate content;
* duplicate identity;
* alternate representation;
* new Version;
* independent object with similar content.

---

# 70. Re-Import

Re-import of a previously imported source shall use prior import provenance when available.

Possible outcomes include:

* no-op;
* refresh metadata;
* create new Version;
* replace derived representation;
* create conflict;
* require review.

Re-import shall not create uncontrolled duplicate objects.

---

# 71. Import History

KnowledgeOS should preserve import history linking:

* Source Identity;
* Source Snapshot;
* Import Session;
* Provider pipeline;
* created canonical identities;
* created Versions;
* warnings;
* decisions.

History supports future reprocessing and diagnosis.

---

# 72. Conflict Detection

Import conflicts may include:

* canonical identity collision;
* stale expected Version;
* incompatible source lineage;
* metadata conflict;
* content divergence;
* deletion conflict;
* relationship conflict;
* unsupported merge.

Conflicts shall be explicit.

---

# 73. Conflict Resolution Responsibility

Import Protocols detect and represent conflicts.

The Knowledge Engine and approved Platform policy resolve canonical conflicts.

Import Providers shall never resolve conflicts independently.

---

# 74. Conflict Strategies

Possible strategies include:

* Reject;
* Create New Object;
* Create New Version;
* Merge;
* Preserve Both;
* Require User Decision;
* Apply Policy;
* Defer.

The selected strategy shall be recorded.

---

# 75. Merge

Merge is permitted only when a defined semantic merge model exists.

Generic structural merge is insufficient for canonical knowledge.

A merge shall preserve:

* source provenance;
* conflicting values;
* resolution decisions;
* resulting Version lineage.

---

# 76. Import Plan

An Import Plan describes the intended canonical effects before execution.

An Import Plan may contain:

* objects to create;
* objects to update;
* Versions to create;
* Assets to persist;
* relationships to establish;
* annotations to import;
* identities to map;
* conflicts;
* omissions;
* degradation;
* required permissions;
* resource estimates.

The Plan is non-canonical until executed.

---

# 77. Import Plan Identity

Every Import Plan shall have stable identity within the Import Session.

The Plan shall reference:

* validated exchange representation;
* policy;
* mapping Version;
* target Library;
* expected canonical state.

---

# 78. Plan Determinism

Given equivalent:

* validated input;
* canonical state;
* policy;
* mapping rules;
* Import Profile;

the Import Plan shall be equivalent.

Nondeterministic identity or merge decisions are prohibited.

---

# 79. Plan Validation

Before execution, the Import Plan shall be validated for:

* authorization;
* target availability;
* identity consistency;
* Version consistency;
* relationship validity;
* storage requirements;
* required Provider availability;
* policy compliance;
* resource limits.

---

# 80. Import Preview

KnowledgeOS may expose a preview of the Import Plan.

A preview may show:

* objects to be created;
* objects to be updated;
* duplicates;
* conflicts;
* warnings;
* expected fidelity;
* omitted information;
* required user decisions.

Preview supports informed user control.

---

# 81. User Decisions

Some imports may require explicit user decisions.

Examples include:

* ambiguous duplicate;
* identity collision;
* low-confidence title;
* uncertain reading order;
* privacy-sensitive remote processing;
* destructive replacement;
* unsupported annotation mapping.

Decisions shall be persisted as part of Import provenance.

---

# 82. Import Execution

Import Execution applies an approved Import Plan through Platform Commands.

```text
Import Plan
    │
    ▼
Knowledge Engine Commands
    │
    ▼
Domain Validation
    │
    ▼
Canonical Commit
```

The Import Protocol shall never mutate Domain state directly.

---

# 83. Execution Boundary

The canonical execution boundary begins only after:

* acquisition;
* staging;
* security validation;
* exchange validation;
* identity resolution;
* planning;
* authorization;
* required approval.

Everything before this boundary remains non-canonical.

---

# 84. Atomicity

Import atomicity shall be explicit.

An import may be:

* Fully Atomic;
* Object Atomic;
* Stage Atomic;
* Batch Atomic;
* Incrementally Committed.

The selected model shall be appropriate to scale and recovery requirements.

---

# 85. Fully Atomic Import

A fully atomic import commits all planned canonical changes or none.

This model may be appropriate for bounded imports.

It may be impractical for very large imports.

---

# 86. Object-Atomic Import

An object-atomic import commits each canonical object independently.

Partial completion is possible.

The final report shall identify every committed and uncommitted object.

---

# 87. Incremental Commit

Large imports may commit in validated checkpoints.

Incremental commit shall define:

* checkpoint boundary;
* dependency ordering;
* rollback scope;
* partial completion semantics;
* resume semantics.

Partial success shall remain explicit.

---

# 88. Commit Ordering

When imported objects depend on one another, commit ordering shall follow an explicit dependency graph.

Examples include:

* Assets before references;
* parent objects before dependent relationships;
* identities before annotations;
* baseline Versions before later Versions.

Ordering shall be deterministic.

---

# 89. Canonical Validation

Every planned canonical mutation shall pass Domain and Platform validation.

Import validation cannot replace Domain invariants.

A structurally valid Exchange Object may still be rejected by canonical rules.

---

# 90. Commit Result

Import execution shall produce a structured result.

The result may include:

* created identities;
* updated identities;
* created Versions;
* skipped duplicates;
* conflicts;
* failed items;
* warnings;
* degradation;
* provenance references;
* rollback status.

---

# 91. Partial Success

Partial success shall never be represented as complete success.

The result shall distinguish:

* fully completed;
* partially completed;
* failed before commit;
* failed after partial commit;
* rolled back;
* cancelled;
* awaiting decision.

---

# 92. Rollback

Rollback reverses eligible canonical effects of a failed or cancelled import.

Rollback support depends upon the atomicity and commit model.

Rollback shall never erase pre-existing canonical state unrelated to the Import Session.

---

# 93. Rollback Plan

A complex import may define a Rollback Plan before execution.

The Plan may identify:

* created objects to remove;
* created Versions to invalidate;
* relationships to remove;
* Assets to release;
* indexes to rebuild;
* provenance to preserve.

Audit and provenance records should remain traceable after rollback.

---

# 94. Compensation

When true rollback is impossible, import may use compensating actions.

Compensation shall be:

* explicit;
* bounded;
* idempotent where possible;
* observable;
* recorded.

Compensation is not equivalent to transactional rollback.

---

# 95. Recovery

An interrupted import may be recoverable from checkpoints.

Recovery shall validate:

* Session identity;
* input integrity;
* staged artifact availability;
* canonical state;
* policy Version;
* Provider compatibility;
* checkpoint validity.

Recovery shall never blindly continue against changed canonical state.

---

# 96. Resume

Resume continues an Import Session from a valid checkpoint.

Resume may re-execute idempotent stages.

Previously committed canonical effects shall be detected and not duplicated.

---

# 97. Cancellation

Import may be cancelled.

Cancellation semantics shall define:

* active-stage interruption;
* staged artifact retention;
* Provider cancellation;
* partial canonical commit;
* rollback;
* checkpoint preservation;
* final status.

Cancellation shall never leave ambiguous canonical state.

---

# 98. Timeout

Import stages may have timeouts.

Timeouts shall be scoped by:

* acquisition;
* decoding;
* OCR;
* external Provider;
* validation;
* canonical commit.

A timeout shall identify whether canonical mutation occurred.

---

# 99. Retry

Retries shall be controlled by Platform execution policy.

Retry eligibility depends upon:

* stage;
* failure;
* idempotency;
* Provider;
* cost;
* remote side effects;
* partial output;
* privacy policy.

Providers shall not perform uncontrolled hidden retries.

---

# 100. Stage Idempotency

Every retryable stage shall define idempotency semantics.

Examples include:

* acquisition by immutable source revision;
* content extraction from immutable snapshot;
* OCR using immutable image and model Version;
* deterministic mapping;
* canonical create with Idempotency Key.

---

# 101. Import Idempotency

Import of the same immutable source under the same identity and policy should produce:

* no-op;
* same canonical result;
* explicit new Version;
* explicit conflict;
* explicit reprocessing result.

It shall not create uncontrolled duplicates.

---

# 102. Import Fingerprint

An Import Fingerprint may support idempotency and duplicate detection.

It may include:

* source content hash;
* Source Identity;
* source revision;
* Import Profile;
* mapping Version;
* relevant configuration.

Fingerprint semantics shall be explicit.

---

# 103. Original Source Retention

The Import Profile may define whether the original source is:

* retained;
* referenced;
* archived;
* discarded after processing;
* retained temporarily.

Retention shall respect:

* user ownership;
* storage policy;
* privacy;
* rights;
* reproducibility requirements.

---

# 104. Original Source Authority

Retaining an original source does not make it the sole canonical representation.

The relationship may be:

* Source Evidence;
* Original Asset;
* Authoritative External Source;
* Archived Input;
* Reprocessable Source.

The role shall be explicit.

---

# 105. NAS Import

A NAS may provide source documents or act as the Library Source of Truth.

The Import Protocol shall distinguish:

* importing an external NAS file;
* registering an existing Library artifact;
* synchronizing a known canonical artifact;
* reprocessing an existing original source.

NAS location alone does not determine the operation type.

---

# 106. Directory Import

Directory import may discover multiple candidate sources.

It shall define:

* traversal depth;
* supported formats;
* hidden-file policy;
* symbolic-link policy;
* duplicate policy;
* package grouping;
* ordering;
* error isolation.

Directory structure shall not automatically become canonical Library structure unless explicitly selected.

---

# 107. Recursive Import

Recursive import shall be bounded.

Limits may include:

* maximum depth;
* maximum file count;
* maximum total size;
* maximum nested archive count;
* excluded paths;
* supported file classes.

---

# 108. Archive Import

Archive import shall perform container validation before extraction.

It shall distinguish:

* archive as transport container;
* archive as Exchange Package;
* archive as original user content;
* archive containing multiple independent documents.

The interpretation shall be explicit.

---

# 109. URL Import

URL import may acquire:

* web page;
* file;
* API representation;
* feed;
* remote Asset.

URL import shall consider:

* redirects;
* content type;
* authentication;
* robots or access policy where applicable;
* tracking;
* external references;
* content freshness;
* remote change.

---

# 110. Redirect Policy

Redirects shall be bounded and validated.

The import workflow shall prevent:

* protocol downgrade;
* redirect loops;
* credential forwarding to unrelated origins;
* internal-network access through malicious redirects;
* unauthorized destination expansion.

---

# 111. Web Import

Web import may preserve:

* requested URL;
* resolved URL;
* retrieval time;
* HTTP metadata;
* page content;
* linked Assets;
* rendered representation;
* source snapshot.

Dynamic web content may require explicit rendering and active-content policy.

---

# 112. API Import

External API import shall define:

* Endpoint;
* authentication;
* pagination;
* rate limits;
* schema;
* revision semantics;
* duplicate detection;
* incremental cursor;
* error handling.

Provider-specific API responses shall be mapped into Canonical Exchange.

---

# 113. Scanner Import

Scanner import may acquire page images directly.

The workflow may include:

* device selection;
* resolution;
* color mode;
* duplex behavior;
* page ordering;
* image correction;
* OCR;
* source metadata.

Scanner drivers remain behind Provider boundaries.

---

# 114. Camera Import

Camera import may require:

* perspective correction;
* page detection;
* blur detection;
* exposure validation;
* multi-page grouping;
* orientation;
* privacy-safe temporary storage.

Captured images remain source evidence.

---

# 115. Clipboard Import

Clipboard import shall accept only approved content types.

It shall distinguish:

* plain text;
* rich text;
* image;
* file reference;
* URL;
* structured application data.

Clipboard content shall be treated as untrusted input.

---

# 116. Drag-and-Drop Import

Drag-and-drop is an acquisition mechanism.

It shall resolve into the same Import Request and validation pipeline as other source mechanisms.

User-interface convenience shall not bypass security or canonical planning.

---

# 117. Shared Content Import

Content received through operating-system share mechanisms shall preserve:

* source application where available;
* content type;
* supplied metadata;
* access scope;
* temporary reference lifetime.

Shared content shall not be trusted merely because the operating system delivered it.

---

# 118. Email Attachment Import

Email attachment import may preserve:

* attachment identity;
* original filename;
* media type;
* sender metadata where permitted;
* message reference;
* received time.

Email content and attachments remain untrusted.

---

# 119. Exchange Package Import

A Canonical Exchange Package shall follow:

1. Container Validation;
2. Manifest Validation;
3. Integrity Verification;
4. Compatibility Validation;
5. Structural Validation;
6. Semantic Validation;
7. Identity Resolution;
8. Import Planning;
9. Canonical Execution.

A valid signature does not skip these stages.

---

# 120. Synchronization Package Import

Synchronization artifacts shall normally be processed through the Sync Engine rather than generic Import.

A package shall be routed based on:

* protocol identity;
* package type;
* intended operation;
* Endpoint identity;
* Change Set semantics.

Generic Import shall not reinterpret synchronization packages arbitrarily.

---

# 121. Plugin-Provided Import

Plugins may contribute:

* source connectors;
* format detectors;
* decoders;
* extractors;
* processors;
* mapping adapters.

Participation shall occur only through approved Extension Points and Contracts.

Plugins shall never write directly into canonical repositories.

---

# 122. Import Security Model

Import processing shall assume hostile input.

Threats include:

* malformed files;
* parser exploits;
* decompression bombs;
* path traversal;
* active content;
* macros;
* scripts;
* malicious fonts;
* oversized images;
* recursive references;
* external tracking;
* credential theft;
* metadata injection.

Security controls are mandatory.

---

# 123. Active Content

Active content shall not execute automatically during Import.

Examples include:

* scripts;
* macros;
* embedded executables;
* active web content;
* document actions;
* external command references.

Active content may be:

* stripped;
* preserved inertly;
* quarantined;
* rejected;
* explicitly enabled in a sandbox.

---

# 124. Parser Isolation

High-risk parsers should execute within isolation boundaries.

Possible isolation includes:

* sandbox;
* separate process;
* constrained runtime;
* restricted filesystem;
* restricted network;
* resource quotas.

Parser failure shall not compromise the main runtime.

---

# 125. Network Isolation

Import processing shall not access the network unless required and authorized.

Parsers shall not resolve external resources automatically.

External references shall be processed through controlled acquisition policy.

---

# 126. Resource Limits

Import shall enforce limits for:

* source size;
* page count;
* image dimensions;
* archive entries;
* decompressed size;
* recursion depth;
* object count;
* Asset count;
* execution time;
* memory;
* temporary storage.

Limits may depend upon Profile and environment.

---

# 127. Sensitive Source Handling

Sensitive sources shall be processed according to privacy classification.

Policy may require:

* local-only processing;
* encrypted staging;
* restricted Provider selection;
* no remote OCR;
* no remote AI;
* limited logging;
* shorter retention.

---

# 128. External Transmission

Import processing shall make external transmission explicit.

Remote OCR, AI or conversion shall disclose:

* data category;
* destination category;
* purpose;
* retention characteristics where known;
* cost;
* policy requirement.

Local-to-remote fallback shall never occur silently.

---

# 129. Secret Exclusion

Imported content shall not be interpreted as trusted configuration or credentials.

Secret-like values found in content shall remain document content unless an explicit secure import capability exists.

Imports shall never write credentials directly into secret storage automatically.

---

# 130. Import Privacy

Import shall expose only the minimum source information required to each Provider.

A Provider processing one page shall not receive the complete Library unless required and authorized.

Data minimization is mandatory.

---

# 131. Import Provenance

Every canonical artifact created through Import shall preserve provenance.

Provenance may include:

* Source Identity;
* source snapshot hash;
* acquisition time;
* Import Session;
* Import Profile;
* Provider pipeline;
* Provider Versions;
* transformations;
* user decisions;
* validation outcome;
* canonical commit.

---

# 132. Transformation Provenance

Each material transformation should record:

* operation;
* input;
* output;
* Provider;
* Version;
* configuration reference;
* timestamp;
* warnings;
* deterministic status.

This enables future reprocessing.

---

# 133. Import Report

Every completed Import Session shall produce an Import Report.

The report may include:

* Session Identity;
* sources;
* detected formats;
* selected Providers;
* processing stages;
* created objects;
* updated objects;
* skipped duplicates;
* conflicts;
* warnings;
* degradation;
* failures;
* rollback status;
* provenance references.

---

# 134. Observability

Import execution shall be observable.

Observable metadata may include:

* Session Identity;
* source type;
* source count;
* format;
* Profile;
* Provider identities;
* stage durations;
* object count;
* Asset count;
* validation findings;
* result;
* correlation identity.

Raw private content shall not be logged by default.

---

# 135. Metrics

Import metrics may include:

* Imports started;
* Imports completed;
* Imports failed;
* sources processed;
* pages processed;
* bytes processed;
* OCR usage;
* Provider selection;
* duplicate detection;
* identity conflicts;
* validation failures;
* average duration;
* cancellation;
* rollback;
* recovery;
* degradation.

---

# 136. Tracing

Import may participate in tracing.

A trace may represent:

```text
Import Request
    │
    ▼
Acquisition
    │
    ▼
Staging
    │
    ▼
Detection
    │
    ▼
Processing Pipeline
    │
    ▼
Canonical Exchange
    │
    ▼
Import Plan
    │
    ▼
Canonical Commit
```

Tracing shall preserve privacy and security.

---

# 137. Audit

Significant imports may produce audit records.

Audit metadata may include:

* Principal;
* Application;
* source category;
* target Library;
* Import Profile;
* result;
* created canonical references;
* user decisions;
* external transmission;
* timestamp;
* correlation identity.

Audit shall not include unnecessary source content.

---

# 138. Import Commands

Typical Import Commands include:

* CreateImportSession;
* AcquireImportSource;
* DetectImportFormat;
* SelectImportProvider;
* ExecuteImportStage;
* ValidateImportArtifacts;
* CreateImportPlan;
* ApproveImportPlan;
* ExecuteImportPlan;
* CancelImportSession;
* RollbackImportSession;
* ResumeImportSession.

Commands modify Import operational state or invoke controlled canonical operations.

---

# 139. Import Queries

Typical Import Queries include:

* GetImportSession;
* GetImportStatus;
* GetDetectedFormat;
* GetImportValidationReport;
* GetImportPlan;
* GetImportConflicts;
* GetImportPreview;
* GetImportReport;
* GetSupportedImportFormats;
* GetCompatibleImportProviders.

Queries never modify canonical state.

---

# 140. Import Events

Typical Import Events include:

* ImportSessionCreated;
* ImportSourceAcquired;
* ImportSourceQuarantined;
* ImportFormatDetected;
* ImportProviderSelected;
* ImportStageCompleted;
* ImportStageFailed;
* ImportValidationCompleted;
* ImportConflictDetected;
* ImportPlanCreated;
* ImportPlanApproved;
* ImportExecutionStarted;
* ImportObjectCommitted;
* ImportCompleted;
* ImportCancelled;
* ImportRolledBack;
* ImportRecoveryRequired.

Events describe completed Import facts.

---

# 141. Import Protocol Versioning

Every stable Import Protocol shall have an explicit Version.

Versioning governs:

* stage semantics;
* source descriptors;
* validation;
* package interpretation;
* failure semantics;
* checkpoint semantics;
* Import Plan semantics.

Published protocol semantics shall not change silently.

---

# 142. Import Compatibility

Compatibility evaluation may consider:

* Import Protocol Version;
* source format Version;
* Provider Version;
* Canonical Exchange Version;
* required Profile Version;
* required Features;
* Platform Capabilities;
* environment;
* privacy policy.

Unsupported required semantics shall fail explicitly.

---

# 143. Deprecation

Deprecated Import Protocols or format integrations shall expose:

* reason;
* replacement;
* migration;
* support period;
* retirement policy.

Existing sources shall remain reprocessable where practical through compatibility tooling.

---

# 144. Import Protocol Invariants

The following invariants apply.

* Import Protocols belong to the Integration layer.
* External information is untrusted by default.
* Import Providers never write directly into canonical knowledge.
* Successful acquisition does not imply successful import.
* Successful parsing does not imply semantic validity.
* Staged artifacts remain non-canonical.
* Source Identity is distinct from canonical identity.
* Filename is never sufficient canonical identity.
* Original source evidence is preserved according to Profile policy.
* Provider-specific types never cross into Domain mutation.
* Format Detection never depends solely on file extension.
* Format ambiguity is resolved explicitly.
* Provider selection belongs to Platform policy.
* Every processing stage has explicit inputs and outputs.
* Stage failures remain isolated.
* Native text, OCR text and corrected text remain distinguishable.
* AI-generated interpretations remain non-authoritative until validated.
* Canonical Exchange mapping precedes canonical integration where required.
* Identity Resolution is explicit.
* Duplicate content is not automatically duplicate identity.
* Import conflicts are never resolved silently.
* Complex canonical effects are represented through an Import Plan.
* Canonical mutation begins only after validation, planning and authorization.
* Import atomicity is explicit.
* Partial success is explicit.
* Rollback never removes unrelated pre-existing canonical state.
* Resume validates canonical state before continuing.
* Retry semantics depend upon stage idempotency.
* External transmission is explicit.
* Active content is never executed automatically.
* Staging paths never become canonical identity.
* Import provenance is preserved.
* Import execution remains observable and auditable where required.

---

# 145. Prohibited Behaviors

Import Protocols shall never:

* deserialize external data directly into mutable Domain objects;
* allow Import Providers to access canonical repositories directly;
* bypass the Import Engine;
* bypass the Knowledge Engine;
* infer canonical identity from filename alone;
* infer deletion from source absence automatically;
* silently merge ambiguous duplicates;
* silently discard unsupported content;
* silently overwrite original evidence;
* silently replace native text with OCR text;
* silently promote AI output to canonical fact;
* execute embedded scripts or macros automatically;
* extract archive entries outside staging;
* follow unrestricted external references;
* transmit sensitive sources remotely without policy approval;
* use remote fallback without disclosure;
* treat parser success as canonical acceptance;
* commit before required validation completes;
* represent partial completion as full success;
* retry non-idempotent canonical operations blindly;
* delete original external sources during cleanup;
* expose secrets in logs or reports;
* permit Plugin import extensions to bypass public Contracts.

---

# 146. Related Documents

* `CanonicalExchange.md`
* `ExportProtocols.md`
* `Serialization.md`
* `../Providers/OCRProviders.md`
* `../Providers/StorageProviders.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/ExtensionPoints.md`
* `../PluginSDK/Compatibility.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Library/README.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/WorkflowEngine.md`
* `../../03-Kernel/Observability.md`
* `../../02-Domain/KnowledgeObject/KnowledgeObject.md`
* `../../02-Domain/KnowledgeObject/Provenance.md`
* `../../02-Domain/KnowledgeObject/Versioning.md`
* `../../02-Domain/UDM/Processing/ProcessingPipeline.md`
* `../../02-Domain/DPM/Processing/LayoutAnalysis.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 147. Status

**Approved**

This document defines the architectural protocols governing the import of external information into KnowledgeOS.

Import is a controlled progression from untrusted external source to validated canonical integration.

Sources are acquired, staged, inspected, decoded, transformed, represented through Canonical Exchange, validated, resolved, planned and only then committed through approved Platform and Domain operations.

Import Providers remain replaceable.

External formats remain isolated.

Original evidence and provenance remain preserved.

Canonical knowledge remains protected from direct external mutation.
