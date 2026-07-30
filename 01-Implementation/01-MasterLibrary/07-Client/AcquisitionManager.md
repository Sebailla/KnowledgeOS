

# Master Library Acquisition Manager

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Client

**Document:** Acquisition Manager

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the implementation model of the KnowledgeOS Acquisition Manager.

The Acquisition Manager is the client capability responsible for receiving, validating, staging, analyzing and preparing new knowledge sources before they are submitted to the authoritative Master Library.

It supports local and offline acquisition workflows.

An acquisition may begin, progress and remain safely stored in the Local Library without server connectivity.

The acquired content becomes authoritative only after successful validation and commit by the Master Library Server.

---

# 2. Scope

This document defines:

* acquisition responsibilities;
* acquisition sources;
* acquisition states;
* local staging;
* input validation;
* file and folder acquisition;
* URL acquisition;
* scan and capture acquisition;
* provider acquisition;
* metadata extraction;
* checksum generation;
* duplicate analysis;
* user review;
* local persistence;
* synchronization handoff;
* recovery;
* security;
* observability;
* testing;
* invariants.

It does not redefine:

* authoritative import processing;
* server-side ingestion;
* Domain identity rules;
* synchronization protocol;
* provider contracts;
* OCR Engine internals;
* parsing and rendering Engine internals;
* authoritative storage layout.

---

# 3. Architectural Role

The Acquisition Manager is the client entry point for adding new source material.

Its logical position is:

```text
Acquisition Source

↓

Acquisition Manager

↓

Local Validation and Staging

↓

Metadata and Duplicate Analysis

↓

Local Acquisition Record

↓

Pending Synchronization

↓

Master Library Server

↓

Authoritative Import and Commit
```

The Acquisition Manager prepares authoritative proposals.

It does not commit directly to the Master Library.

---

# 4. Fundamental Principles

The Acquisition Manager follows these principles:

* Offline First;
* durable staging;
* explicit user intent;
* immutable source preservation;
* deterministic validation;
* recoverable workflows;
* stable acquisition identity;
* no silent data loss;
* no direct authoritative write;
* no implicit duplicate merging;
* explicit security boundaries;
* observable progress;
* idempotent finalization.

---

# 5. Responsibilities

The Acquisition Manager is responsible for:

* receiving acquisition requests;
* identifying the acquisition source;
* validating source accessibility;
* copying or capturing source content;
* creating a durable acquisition record;
* computing checksums;
* extracting initial metadata;
* identifying source format;
* identifying duplicate candidates;
* collecting user corrections;
* preparing synchronization payloads;
* preserving acquisition state across restart;
* presenting progress and errors;
* handing accepted local acquisitions to synchronization.

---

# 6. Non-Responsibilities

The Acquisition Manager is not responsible for:

* writing directly to NAS Source of Truth;
* writing directly to the server Catalog;
* assigning final authoritative Publication identity;
* silently replacing an existing Publication;
* making unreviewed AI output authoritative;
* bypassing server-side validation;
* trusting external filenames or metadata;
* permanently deleting original user files;
* implementing all parser or OCR logic internally;
* guaranteeing that a local acquisition will be accepted by the server.

---

# 7. Acquisition Sources

The Acquisition Manager may support:

* individual local files;
* multiple local files;
* folders;
* drag and drop;
* Finder or Files selection;
* Share Sheet input;
* URLs;
* browser sharing;
* camera capture;
* document scanning;
* clipboard content;
* provider results;
* plugin-provided sources;
* external device imports.

Each source type uses a dedicated adapter.

---

# 8. Acquisition Types

Logical acquisition types include:

* FileAcquisition;
* MultiFileAcquisition;
* FolderAcquisition;
* URLAcquisition;
* ScanAcquisition;
* CameraAcquisition;
* ClipboardAcquisition;
* ProviderAcquisition;
* PluginAcquisition;
* SharedContentAcquisition.

Acquisition type does not determine final Publication type.

---

# 9. Internal Architecture

The Acquisition Manager is composed of:

```text
Acquisition Manager

├── Presentation
│   ├── Source Selection
│   ├── Progress
│   ├── Metadata Review
│   ├── Duplicate Review
│   └── Error Recovery
│
├── Application
│   ├── Start Acquisition
│   ├── Validate Source
│   ├── Stage Content
│   ├── Analyze Content
│   ├── Review Acquisition
│   └── Finalize Acquisition
│
├── Domain
│   ├── Acquisition Record
│   ├── Source Descriptor
│   ├── Metadata Proposal
│   ├── Duplicate Candidate
│   └── Acquisition Decision
│
├── Services
│   ├── Checksum Service
│   ├── Format Detection
│   ├── Metadata Extraction
│   ├── Duplicate Analysis
│   ├── OCR Coordination
│   └── Provider Coordination
│
└── Adapters
    ├── Filesystem
    ├── URL
    ├── Scanner
    ├── Camera
    ├── Clipboard
    ├── Provider
    └── Plugin
```

---

# 10. Acquisition Identity

Every acquisition receives a stable `AcquisitionId`.

The identifier is created before source processing begins.

The identifier is used for:

* staging ownership;
* job coordination;
* recovery;
* diagnostics;
* idempotency;
* synchronization handoff;
* user-visible history.

The identifier shall not be derived from filename, path or checksum.

---

# 11. Acquisition Record

An acquisition record includes:

* `AcquisitionId`;
* acquisition type;
* source descriptor;
* source display name;
* creation timestamp;
* actor;
* originating device;
* current state;
* progress;
* staging references;
* checksum status;
* detected format;
* metadata proposal;
* duplicate candidates;
* user decisions;
* errors;
* retry state;
* synchronization state;
* resulting authoritative resource reference when available.

---

# 12. Acquisition States

An acquisition may transition through:

```text
Created

↓

Validating

↓

Staging

↓

Analyzing

↓

ReviewRequired

↓

Ready

↓

QueuedForSynchronization

↓

Synchronizing

↓

Submitted

↓

Accepted
```

Alternative states include:

* Draft;
* WaitingForInput;
* WaitingForNetwork;
* Rejected;
* Conflict;
* Cancelled;
* Failed;
* RecoveryRequired.

---

# 13. State Transition Rules

State transitions shall:

* be explicit;
* be persisted;
* validate required preconditions;
* preserve prior evidence;
* be idempotent where replay is possible;
* prevent unsupported reverse transitions;
* emit local events after commit.

No acquisition shall appear Accepted before server confirmation.

---

# 14. Acquisition Workflow

The standard acquisition workflow is:

```text
Receive User Intent

↓

Create Acquisition Record

↓

Validate Source

↓

Stage Source Content

↓

Compute Checksum

↓

Detect Format

↓

Extract Initial Metadata

↓

Analyze Duplicate Candidates

↓

Request User Review if Required

↓

Finalize Local Proposal

↓

Create Pending Synchronization Work

↓

Submit to Master Library Server

↓

Apply Authoritative Result
```

---

# 15. Offline Acquisition

Offline acquisition may complete all local phases that do not require server authority.

Offline-capable phases include:

* source selection;
* validation;
* staging;
* checksum generation;
* local format detection;
* local metadata extraction;
* local OCR where available;
* local duplicate analysis;
* user review;
* proposal finalization.

The acquisition remains queued until synchronization is possible.

---

# 16. Source Descriptor

A source descriptor identifies how the content entered the client.

It may include:

* source type;
* original filename;
* original path reference;
* original URL;
* provider identifier;
* capture timestamp;
* declared media type;
* detected media type;
* size;
* source application;
* access scope;
* platform-specific bookmark or permission reference.

Sensitive path details shall not be exposed unnecessarily.

---

# 17. Source Ownership

The Acquisition Manager shall determine whether source content is:

* copied into staging;
* referenced temporarily;
* streamed into staging;
* captured directly;
* supplied by a provider;
* produced by a plugin.

Acquisition shall not depend indefinitely on an external temporary reference.

---

# 18. Durable Staging

Before an acquisition is considered safe, required source content shall be durably staged.

Durable staging means:

* the source has been copied or captured into managed storage;
* the source can survive application restart;
* the source is associated with the Acquisition record;
* integrity metadata exists;
* cleanup cannot remove it while active.

---

# 19. External File References

External file references may be used only during initial access.

The client shall not assume that:

* the original path remains available;
* removable storage remains mounted;
* security-scoped access persists forever;
* the original file remains unchanged;
* a cloud-backed file remains downloaded.

Required content shall be copied into controlled staging.

---

# 20. File Acquisition

File acquisition supports one or more selected files.

The workflow shall:

1. obtain user-authorized access;
2. inspect file metadata;
3. validate size and type;
4. reject unsupported unsafe inputs;
5. copy content into staging;
6. compute checksum;
7. detect actual format;
8. continue analysis.

The original file remains untouched.

---

# 21. Multi-File Acquisition

Multiple selected files may represent:

* independent Publications;
* one Publication with Assets;
* one multi-file source package;
* an ambiguous set requiring user review.

The client shall not infer grouping solely from selection order.

Grouping decisions shall be explicit or rule-based and reviewable.

---

# 22. Folder Acquisition

Folder acquisition may recursively inspect supported content.

Folder traversal shall define:

* recursion policy;
* maximum depth;
* maximum item count;
* symbolic-link handling;
* hidden-file policy;
* package handling;
* ignored patterns;
* error behavior.

Folder import shall remain bounded.

---

# 23. Folder Acquisition Safety

Folder acquisition shall protect against:

* recursive symbolic links;
* filesystem cycles;
* inaccessible paths;
* excessive file counts;
* unexpectedly large content;
* hidden system directories;
* special device files;
* path traversal;
* unstable external mounts.

Each accepted file receives its own tracked staging relationship.

---

# 24. Drag and Drop

Drag and drop may provide:

* files;
* folders;
* URLs;
* text;
* provider-specific payloads;
* application-specific objects.

Drop payloads are untrusted.

The adapter shall normalize them into supported source descriptors before acquisition begins.

---

# 25. Share Sheet Acquisition

Share extensions may receive:

* files;
* URLs;
* text;
* images;
* scanned documents;
* application-provided objects.

The extension should:

* capture the content safely;
* create an isolated handoff;
* avoid direct Local Library writes;
* notify or invoke the main application;
* preserve user intent.

---

# 26. URL Acquisition

URL acquisition begins from a user-approved URL.

It may support:

* web pages;
* downloadable files;
* feeds;
* provider resources;
* supported document endpoints.

The URL is validated before any network request.

---

# 27. URL Validation

URL validation shall include:

* supported scheme;
* normalized hostname;
* port policy;
* credential rejection;
* private-network policy;
* redirect policy;
* maximum redirect count;
* allowlist or denylist rules;
* payload-size limits;
* content-type validation.

Unsupported or unsafe URLs shall be rejected.

---

# 28. Server-Side Request Forgery Protection

URL acquisition shall protect against access to:

* loopback interfaces;
* local metadata services;
* private infrastructure;
* internal management endpoints;
* restricted local services;
* unsupported protocols.

Private-network access requires explicit trusted configuration.

---

# 29. URL Retrieval

URL retrieval shall enforce:

* TLS validation;
* timeout;
* cancellation;
* redirect validation;
* response-size limit;
* decompression-size limit;
* content-type inspection;
* checksum generation;
* bounded retries.

Downloaded content is staged before analysis.

---

# 30. Web Content Capture

A web page acquisition may preserve:

* original URL;
* retrieval timestamp;
* response metadata;
* HTML snapshot;
* linked essential Assets;
* extracted readable content;
* screenshot or preview;
* provenance.

The exact capture level depends on policy and available capabilities.

---

# 31. Scan Acquisition

Scan acquisition may use platform document-scanning capabilities.

It supports:

* one page;
* multiple pages;
* automatic edge detection;
* perspective correction;
* page ordering;
* user review;
* image or PDF output.

The scan result is staged as source content.

---

# 32. Camera Acquisition

Camera acquisition may capture:

* document pages;
* whiteboards;
* notes;
* objects;
* contextual images.

The user shall review captured material before finalization when practical.

Camera metadata shall not automatically become authoritative publication metadata.

---

# 33. Clipboard Acquisition

Clipboard acquisition may accept:

* plain text;
* rich text;
* HTML;
* images;
* URLs.

Clipboard data is volatile.

It shall be copied immediately into durable staging when acquisition begins.

---

# 34. Provider Acquisition

Provider acquisition retrieves content through an approved provider adapter.

The adapter shall:

* authenticate through protected credentials;
* request only required data;
* validate provider responses;
* enforce limits;
* preserve provenance;
* stage received content;
* classify provider metadata as proposed.

Provider output remains untrusted until validated.

---

# 35. Plugin Acquisition

Plugins may propose acquisition sources through declared capabilities.

Plugins shall not:

* write directly into Local Library storage;
* assign authoritative identity;
* bypass validation;
* access unrelated files;
* submit unrestricted network payloads.

Plugin output enters the same acquisition pipeline as other sources.

---

# 36. Input Validation

Input validation occurs before and after staging.

Validation may include:

* source existence;
* readable access;
* size;
* format;
* media type;
* extension consistency;
* file signature;
* archive structure;
* page count;
* encoding;
* corruption indicators;
* security policy.

Validation results are persisted.

---

# 37. Format Detection

Format detection shall use available evidence such as:

* magic bytes;
* media type;
* file structure;
* extension;
* parser probing;
* provider metadata.

Filename extension alone is insufficient.

---

# 38. Supported Formats

Supported formats are defined by active import capabilities.

Examples may include:

* PDF;
* EPUB;
* Markdown;
* HTML;
* plain text;
* images;
* office documents;
* structured exchange packages;
* supported archive packages.

Unsupported formats may remain staged for future processing only when explicitly allowed.

---

# 39. Archive Validation

Archive input shall be protected against:

* path traversal;
* absolute paths;
* symbolic-link escape;
* archive bombs;
* excessive file count;
* excessive decompressed size;
* nested archive abuse;
* duplicate conflicting paths.

Archive extraction shall occur inside controlled staging.

---

# 40. Size Limits

Acquisition limits may apply to:

* individual file size;
* total acquisition size;
* folder item count;
* total decompressed size;
* page count;
* image dimensions;
* URL response size;
* provider response size.

Limits are configuration-driven and user-visible when exceeded.

---

# 41. Checksum Generation

Checksums shall be computed for staged source content.

Checksums support:

* integrity;
* duplicate analysis;
* transfer verification;
* idempotency;
* corruption detection.

Checksum algorithms shall follow the persistence architecture.

---

# 42. Checksum Timing

Checksum generation occurs after content is under controlled staging.

For streamed acquisition, checksum computation may occur during the write.

The final checksum is accepted only after the staged file is completely and durably written.

---

# 43. Source Immutability

Once an acquisition source is staged and checksummed, that staged source revision is immutable.

Any modification creates:

* a new staged revision;
* a new checksum;
* updated acquisition state;
* invalidated derived analysis where required.

In-place mutation is prohibited.

---

# 44. Initial Metadata Extraction

The Acquisition Manager may derive initial metadata including:

* title;
* subtitle;
* creators;
* publication date;
* language;
* source format;
* page count;
* document identifiers;
* publisher;
* description;
* keywords;
* cover candidate.

Extracted metadata is proposed data.

---

# 45. Metadata Sources

Metadata may originate from:

* embedded document metadata;
* filename;
* directory context;
* OCR;
* content analysis;
* provider metadata;
* user input;
* plugin output;
* AI suggestions.

Each proposed value should preserve provenance and confidence where available.

---

# 46. Metadata Proposal

A metadata proposal contains:

* field;
* proposed value;
* source;
* confidence;
* extraction method;
* supporting evidence;
* user acceptance state;
* validation state.

Accepted local values remain pending until server commit.

---

# 47. Metadata Precedence

Metadata precedence shall be explicit.

A possible ordering is:

1. explicit user input;
2. trusted structured metadata;
3. approved provider metadata;
4. embedded source metadata;
5. deterministic extraction;
6. OCR-derived metadata;
7. AI suggestion;
8. filename-derived fallback.

Precedence does not eliminate user review.

---

# 48. OCR Coordination

OCR may be requested when:

* text is absent;
* scan quality permits;
* the format requires image interpretation;
* the user requests it;
* acquisition policy enables it.

OCR execution may be local or server-assisted.

Local acquisition does not depend on remote OCR availability.

---

# 49. OCR Result Classification

OCR output is derived data.

It shall preserve:

* source page;
* source checksum;
* OCR provider or engine;
* model version;
* language;
* confidence;
* creation time.

OCR output shall not silently replace the immutable source.

---

# 50. AI-Assisted Metadata

AI may suggest:

* title normalization;
* creators;
* summary;
* tags;
* type classification;
* collection suggestions;
* relationships.

AI results are suggestions.

They require explicit acceptance before becoming part of the local proposal.

---

# 51. AI Privacy

Remote AI processing requires:

* enabled provider;
* explicit applicable policy;
* approved data scope;
* minimized content;
* user visibility;
* secure transport;
* credential isolation.

The client shall provide a local-only path where required by privacy policy.

---

# 52. Duplicate Analysis

Duplicate analysis identifies possible existing content.

It may compare:

* source checksum;
* normalized document identifiers;
* provider identifiers;
* title;
* creators;
* publication date;
* source filename;
* content fingerprint;
* extracted text similarity;
* metadata similarity.

Duplicate analysis produces candidates, not automatic identity decisions.

---

# 53. Exact Checksum Match

An exact checksum match indicates identical source bytes.

It does not automatically prove that:

* the acquisition should be rejected;
* the Publication is the same logical knowledge object;
* the existing source should be replaced;
* duplicate storage is invalid.

The result informs a user or policy decision.

---

# 54. Duplicate Candidate

A duplicate candidate includes:

* existing Publication identity;
* match type;
* confidence;
* matching fields;
* differing fields;
* source revision;
* local availability;
* authoritative revision;
* suggested actions.

Candidates shall be ranked deterministically.

---

# 55. Duplicate Decisions

Supported decisions may include:

* CreateNewPublication;
* AddSourceToExistingPublication;
* AddNewSourceRevision;
* AttachAsAsset;
* SkipAcquisition;
* ReviewLater.

Available decisions depend on Domain rules and server capabilities.

---

# 56. Duplicate Review

The duplicate review interface should show:

* proposed acquisition metadata;
* existing candidate metadata;
* source checksums;
* source formats;
* known identifiers;
* differences;
* consequences of each action.

The client shall not hide uncertainty.

---

# 57. Batch Acquisition

Batch acquisition supports multiple independent acquisitions.

Each item shall have:

* its own AcquisitionId;
* validation result;
* staging state;
* metadata proposal;
* duplicate candidates;
* user decision;
* synchronization state.

A batch container may coordinate shared progress without merging item identities.

---

# 58. Batch Failure Behavior

One item failure shall not necessarily fail the entire batch.

The client shall support:

* successful items continuing;
* failed items remaining reviewable;
* retrying selected items;
* cancelling selected items;
* preserving batch context.

Atomic all-or-nothing behavior is used only when explicitly required.

---

# 59. User Review

User review may be required when:

* metadata confidence is low;
* duplicate candidates exist;
* grouping is ambiguous;
* format is uncertain;
* OCR quality is low;
* provider metadata conflicts;
* an unsupported decision is required;
* server-required fields are missing.

Review state shall survive restart.

---

# 60. Review Model

The review model may contain:

* source preview;
* metadata proposal;
* validation warnings;
* duplicate candidates;
* cover candidates;
* extraction results;
* privacy indicators;
* required decisions.

Review edits are stored as durable drafts.

---

# 61. Acquisition Drafts

A draft acquisition may remain incomplete.

Drafts shall preserve:

* staged source;
* entered metadata;
* user decisions;
* analysis results;
* errors;
* progress;
* required next action.

Drafts are protected local user data.

---

# 62. Finalization

Local finalization confirms that the acquisition proposal is ready for synchronization.

Finalization requires:

* durable staged source;
* completed required validation;
* stable checksum;
* accepted or resolved metadata;
* duplicate decision;
* required fields;
* valid synchronization payload.

Finalization does not make the acquisition authoritative.

---

# 63. Finalization Idempotency

Repeated finalization of the same unchanged acquisition shall not create duplicate pending changes.

The acquisition shall use:

* stable AcquisitionId;
* deterministic proposal version;
* idempotency key;
* tracked pending change reference.

---

# 64. Acquisition Proposal

The finalized acquisition proposal may contain:

* AcquisitionId;
* source descriptor;
* staged content descriptor;
* checksum;
* detected format;
* metadata proposal;
* provenance;
* duplicate decision;
* desired operation;
* related resource references;
* client capabilities;
* idempotency key.

---

# 65. Pending Change Creation

Finalization creates one or more durable pending changes.

Possible pending operations include:

* create Publication;
* add source;
* add source revision;
* attach Asset;
* update metadata;
* assign cover;
* add collection membership.

Pending changes are coordinated through the Local Library.

---

# 66. Synchronization Handoff

The Acquisition Manager hands synchronization-ready work to the Synchronization Layer.

The handoff includes:

* pending change identifiers;
* staged content references;
* checksums;
* dependencies;
* expected operation;
* base revisions where applicable;
* idempotency data.

The Synchronization Layer owns transfer execution.

---

# 67. Upload Preparation

Before upload, the client verifies:

* acquisition remains finalized;
* staged content exists;
* checksum still matches;
* pending change is Ready;
* authentication is available;
* server capability is compatible;
* storage references are valid.

A failed preflight returns the acquisition to an explicit recoverable state.

---

# 68. Server Validation

The Master Library Server may validate:

* authentication;
* authorization;
* operation compatibility;
* Domain rules;
* duplicate policy;
* source format;
* checksum;
* metadata;
* storage availability;
* base revision;
* idempotency.

Local validation does not replace server validation.

---

# 69. Server Acceptance

When accepted, the server returns authoritative results such as:

* Publication identity;
* source identity;
* authoritative revisions;
* normalized metadata;
* committed checksums;
* processing state;
* synchronization checkpoint;
* warnings.

The Local Library applies the result transactionally.

---

# 70. Server Rejection

A server rejection shall preserve:

* local acquisition;
* staged source;
* submitted proposal;
* server reason;
* retry eligibility;
* required correction;
* authoritative context where provided.

The client shall not delete the acquisition automatically.

---

# 71. Server Conflict

A conflict may occur when:

* an existing candidate changed;
* a base revision is stale;
* the selected duplicate action is no longer valid;
* a collection or relationship changed;
* a source already exists in another authoritative form.

The conflict is persisted and presented for resolution.

---

# 72. Accepted Acquisition State

After authoritative acceptance, the Acquisition Manager shall:

1. validate the server result;
2. apply authoritative state through Local Library;
3. reconcile pending changes;
4. associate the Acquisition record with resulting identities;
5. update state to Accepted;
6. release protected staging only when safe;
7. schedule derived processing;
8. preserve audit history.

---

# 73. Staging Retention After Acceptance

Staged source content may be:

* promoted to local authoritative replica;
* retained until authoritative download verification;
* removed after confirmed local replacement;
* retained according to recovery policy.

Staging shall not be deleted before the accepted source is safely represented locally.

---

# 74. Cancellation

An acquisition may be cancelled when no critical commit is active.

Cancellation shall:

* persist cancellation state;
* stop associated jobs;
* preserve or delete staging according to policy;
* warn before removing unique captured data;
* leave diagnostics;
* avoid removing unrelated batch items.

---

# 75. Cancellation of Unsaved Capture

For unique camera, scan or clipboard content, cancellation may cause permanent loss.

The client shall require explicit confirmation before deleting the only durable copy.

---

# 76. Retry

Retry may apply to:

* source access;
* file copy;
* checksum computation;
* URL retrieval;
* provider access;
* OCR;
* metadata extraction;
* synchronization;
* authoritative result application.

Retry policy shall distinguish transient and permanent failures.

---

# 77. Recovery

The Acquisition Manager recovers interrupted workflows at startup.

It inspects:

* acquisition records;
* staging items;
* associated jobs;
* checksum status;
* pending changes;
* transfer records;
* accepted-result application;
* abandoned source references.

---

# 78. Recovery Decisions

Recovery may:

* resume staging;
* restart deterministic analysis;
* recompute checksum;
* restore review state;
* resume transfer;
* reconcile accepted result;
* mark user action required;
* quarantine inconsistent staging.

Unique user content shall be preserved.

---

# 79. Orphaned Staging

Staging without a valid acquisition owner is an anomaly.

The client shall:

* inspect metadata;
* avoid immediate deletion;
* determine whether the item belongs to an interrupted workflow;
* preserve potentially unique content;
* expose recovery or cleanup action.

---

# 80. Corrupted Staging

If staged content fails checksum validation, the client shall classify whether it is:

* reproducible from an external source;
* redownloadable;
* unique captured content;
* partially transferred content.

Unique captured content receives the highest recovery priority.

---

# 81. Source Preview

The client may generate previews for review.

Previews are derived data.

They may include:

* cover image;
* first page;
* text excerpt;
* image thumbnails;
* web snapshot;
* scan contact sheet.

Preview failure shall not invalidate the staged source.

---

# 82. Cover Candidate

A cover candidate may originate from:

* embedded cover;
* first page;
* selected image;
* provider metadata;
* generated thumbnail;
* user-selected file.

Cover candidates remain proposed until accepted.

---

# 83. Provenance

Every acquisition shall preserve provenance.

Provenance may include:

* original source type;
* original URL;
* provider;
* capture device;
* acquisition time;
* user;
* source application;
* checksum;
* extraction tools;
* metadata sources.

Sensitive provenance fields may have restricted visibility.

---

# 84. Security Architecture

Acquisition is a high-risk input boundary.

Security controls include:

* source validation;
* size limits;
* archive protection;
* path containment;
* URL restrictions;
* TLS validation;
* provider isolation;
* plugin capability limits;
* parser isolation where required;
* safe temporary storage;
* content scanning where configured.

---

# 85. Parser Isolation

Potentially unsafe parsers should execute with restricted privileges where practical.

Isolation may include:

* separate process;
* sandbox;
* resource limit;
* timeout;
* read-only input;
* controlled output directory;
* no unrestricted network;
* no credential access.

Parser failure shall not corrupt the Local Library.

---

# 86. Malware and Unsafe Content

The client may integrate optional content scanning.

A suspicious source may be:

* rejected;
* quarantined;
* marked for review;
* blocked from parsing;
* allowed only under explicit policy.

Security classification is operational and shall not silently modify source bytes.

---

# 87. Filename Safety

Filenames are untrusted display values.

The client shall:

* normalize display safely;
* reject control-character abuse;
* avoid direct path construction;
* generate internal storage names;
* preserve original filename as metadata where safe.

---

# 88. Path Containment

All staged content shall remain under controlled Local Library storage.

The client shall prevent:

* `../` traversal;
* absolute-path escape;
* symbolic-link escape;
* mounted-volume redirection;
* plugin-selected internal paths.

---

# 89. Network Security

Network acquisition shall enforce:

* approved schemes;
* TLS certificate validation;
* bounded timeouts;
* redirect validation;
* response-size limits;
* DNS rebinding protection where applicable;
* private-network restrictions;
* credential redaction.

---

# 90. Privacy

Acquisition may involve private content.

The client shall:

* avoid transmitting source content without policy;
* expose remote processing decisions;
* minimize provider payloads;
* keep local acquisition possible;
* redact logs;
* protect previews and temporary files;
* avoid unnecessary system-wide indexing.

---

# 91. Credentials

Provider and server credentials shall use secure platform storage.

Credentials shall not be stored:

* in acquisition records;
* in source URLs;
* in logs;
* in staging metadata;
* in diagnostic exports.

---

# 92. Resource Management

Acquisition shall manage:

* disk usage;
* memory;
* CPU;
* GPU;
* network;
* battery;
* concurrent jobs;
* temporary storage.

Large acquisitions shall use streaming where possible.

---

# 93. Backpressure

The Acquisition Manager shall prevent unbounded work.

Limits may apply to:

* concurrent acquisitions;
* concurrent file copies;
* concurrent URL downloads;
* concurrent OCR jobs;
* concurrent metadata extraction;
* total staged size;
* batch item count.

New work may be queued when limits are reached.

---

# 94. Progress Model

Acquisition progress shall represent meaningful stages.

Example:

```text
Validating
Staging
Checksumming
Detecting Format
Extracting Metadata
Analyzing Duplicates
Waiting for Review
Ready to Synchronize
Uploading
Waiting for Server
Applying Result
Completed
```

Progress percentages shall not be fabricated when total work is unknown.

---

# 95. User Notifications

The client may notify the user when:

* acquisition completes locally;
* review is required;
* network is required;
* synchronization succeeds;
* server rejects the proposal;
* a conflict occurs;
* recovery requires action;
* storage is insufficient.

Notifications shall link to the relevant Acquisition record.

---

# 96. Error Model

Acquisition errors may include:

* SourceUnavailable;
* AccessDenied;
* UnsupportedFormat;
* InvalidFormat;
* SizeLimitExceeded;
* StorageUnavailable;
* StorageFull;
* ChecksumFailure;
* DownloadFailure;
* ProviderFailure;
* OCRFailure;
* MetadataExtractionFailure;
* DuplicateDecisionRequired;
* SynchronizationFailure;
* ServerRejection;
* Conflict;
* RecoveryFailure;
* InternalFailure.

---

# 97. Error Presentation

Error presentation shall explain:

* what failed;
* whether the staged source is safe;
* whether user input was preserved;
* whether retry is possible;
* whether network is required;
* whether another decision is required;
* whether cleanup is safe.

Raw exceptions belong in diagnostics.

---

# 98. Observability

Acquisition observability may include:

* AcquisitionId;
* acquisition type;
* current stage;
* duration;
* staged byte count;
* checksum duration;
* detected format;
* duplicate candidate count;
* retry count;
* synchronization result;
* failure classification.

Knowledge content shall not be logged unnecessarily.

---

# 99. Logging

Logs may contain:

* timestamp;
* component;
* AcquisitionId;
* JobId;
* CorrelationId;
* operation;
* state transition;
* duration;
* result;
* error category.

Logs shall exclude:

* source contents;
* credentials;
* unrestricted URLs with secrets;
* full metadata when sensitive;
* AI prompts containing private content.

---

# 100. Diagnostic Record

A diagnostic record may include:

* source type;
* safe display name;
* staged size;
* checksum status;
* format detection result;
* job states;
* synchronization state;
* latest error;
* recovery recommendation.

Diagnostic export shall redact sensitive provenance.

---

# 101. Testing Strategy

Acquisition testing includes:

* unit tests;
* adapter tests;
* file acquisition tests;
* folder acquisition tests;
* URL security tests;
* scan tests;
* provider tests;
* duplicate analysis tests;
* offline tests;
* recovery tests;
* synchronization tests;
* security tests;
* performance tests.

---

# 102. Mandatory File Tests

Tests shall cover:

* supported file;
* unsupported file;
* incorrect extension;
* corrupt file;
* empty file;
* large file;
* inaccessible file;
* file removed during copy;
* removable storage disconnect;
* checksum mismatch;
* duplicate checksum.

---

# 103. Mandatory Folder Tests

Tests shall cover:

* empty folder;
* nested folder;
* deep hierarchy;
* excessive item count;
* symbolic-link cycle;
* unreadable child;
* mixed formats;
* duplicate files;
* package directories;
* cancellation during traversal.

---

# 104. Mandatory URL Tests

Tests shall cover:

* valid HTTPS URL;
* redirect chain;
* redirect to restricted host;
* oversized response;
* incorrect media type;
* timeout;
* interrupted download;
* TLS failure;
* loopback URL;
* private network URL;
* archive bomb response;
* retry.

---

# 105. Mandatory Offline Tests

Tests shall verify:

* file acquisition completes locally;
* scan acquisition completes locally;
* metadata review persists;
* duplicate review persists;
* acquisition finalizes locally;
* synchronization remains queued;
* application restart preserves all state;
* connectivity restoration resumes safely.

---

# 106. Mandatory Recovery Tests

Tests shall cover:

* termination during staging;
* termination during checksum;
* termination during metadata extraction;
* termination during review;
* termination during finalization;
* termination during upload;
* termination after server acceptance but before local application;
* orphaned staging;
* corrupted staging;
* disk full.

---

# 107. Mandatory Security Tests

Security tests shall cover:

* path traversal;
* symbolic-link escape;
* archive traversal;
* archive bomb;
* URL private-network access;
* DNS rebinding scenarios where applicable;
* malformed parser input;
* plugin capability bypass;
* credential leakage;
* log redaction;
* oversized images;
* decompression limits.

---

# 108. Performance Requirements

The Acquisition Manager shall support:

* streaming large files;
* bounded memory use;
* incremental checksumming;
* asynchronous analysis;
* cancellable work;
* bounded concurrency;
* large batch progress;
* responsive user review.

Heavy processing shall not block primary client interaction.

---

# 109. Scalability

The design shall support growth in:

* source size;
* batch size;
* metadata complexity;
* duplicate candidate count;
* OCR duration;
* staged content volume;
* queued offline acquisitions.

Queries and workflows shall remain bounded.

---

# 110. Cleanup

Cleanup may remove acquisition data only when:

* the acquisition is cancelled and removal is confirmed where needed;
* accepted data is safely represented locally;
* staging is verified as redundant;
* retention policy allows deletion;
* no pending change depends on it;
* no recovery record requires it.

---

# 111. Cleanup Prohibitions

Cleanup shall never automatically delete:

* active staging;
* unique captured content;
* finalized offline acquisitions;
* rejected acquisitions awaiting correction;
* conflicted acquisitions;
* pending synchronization content;
* recovery evidence;
* user review drafts.

---

# 112. Prohibited Designs

The following designs are prohibited:

* direct client write to authoritative NAS storage;
* direct client write to server database;
* treating local finalization as authoritative acceptance;
* using original external path as durable source storage;
* mutating staged source in place;
* trusting file extension as format proof;
* silently merging duplicate candidates;
* deleting rejected acquisitions automatically;
* sending content to remote AI without policy;
* unrestricted plugin acquisition access;
* unbounded archive extraction;
* unbounded folder traversal;
* URLs accessing restricted local infrastructure;
* storing credentials in acquisition records;
* logging private source content;
* removing staging before accepted data is locally safe;
* using checksum as the sole Domain identity rule;
* losing user review state after restart.

---

# 113. Acquisition Manager Invariants

The following invariants are mandatory:

* every acquisition has stable identity;
* source content is durably staged before being considered safe;
* staged source revisions are immutable;
* the original user source is not modified;
* acquisition can proceed offline where server authority is not required;
* local finalization does not imply authoritative acceptance;
* only the server commits to the Master Library;
* every finalized acquisition has a durable synchronization proposal;
* every staged item has an owning Acquisition record;
* checksums are computed over durably written content;
* format detection does not rely solely on filename extension;
* duplicate analysis produces candidates, not silent identity decisions;
* user decisions survive restart;
* unique captured content is never treated as disposable temporary data;
* pending acquisition content is never evicted as cache;
* remote processing is policy-controlled;
* external and plugin inputs are untrusted;
* URL acquisition enforces network security boundaries;
* archive extraction remains contained and bounded;
* server rejection preserves the local acquisition;
* server conflict preserves both local and authoritative context;
* accepted state is applied locally before staging is released;
* retries are idempotent;
* cancellation preserves consistency;
* recovery prioritizes unique user content;
* cleanup is dependency-aware;
* acquisition progress is observable;
* all authoritative identifiers come from server-confirmed results.

---

# 114. Related Documents

## Architecture

* `00-Architecture/01-Foundation/ArchitectureConstraints.md`
* `00-Architecture/01-Foundation/ArchitecturePrinciples.md`
* `00-Architecture/01-Foundation/QualityAttributes.md`
* `00-Architecture/03-Kernel/JobSystem.md`
* `00-Architecture/03-Kernel/WorkflowEngine.md`
* `00-Architecture/04-Platform/Import/README.md`
* `00-Architecture/04-Platform/Knowledge/README.md`
* `00-Architecture/04-Platform/Library/README.md`
* `00-Architecture/04-Platform/Plugin/README.md`
* `00-Architecture/04-Platform/Sync/README.md`
* `00-Architecture/05-Integration/ExternalServices/RemoteExecution.md`
* `00-Architecture/06-Execution/Reliability/Recovery.md`

## Master Library

* `01-Requirements/UseCases.md`
* `01-Requirements/AcceptanceCriteria.md`
* `02-TechnicalDesign/ClientDesign.md`
* `02-TechnicalDesign/DataFlow.md`
* `02-TechnicalDesign/OfflineModel.md`
* `02-TechnicalDesign/SynchronizationDesign.md`
* `03-Domain/DomainModel.md`
* `03-Domain/States.md`
* `04-Contracts/ClientContracts.md`
* `04-Contracts/SynchronizationContracts.md`
* `05-Persistence/SourceStorage.md`
* `05-Persistence/Checksums.md`
* `05-Persistence/Integrity.md`
* `05-Persistence/Recovery.md`
* `06-Server/ServerArchitecture.md`
* `06-Server/Security.md`
* `07-Client/README.md`
* `07-Client/ClientArchitecture.md`
* `07-Client/LocalLibrary.md`
* `07-Client/CatalogBrowser.md`
* `08-Testing/TestStrategy.md`
* `08-Testing/IntegrationTests.md`
* `08-Testing/EndToEndTests.md`
* `09-Operations/BackupRecovery.md`

---

# 115. Status

**Approved**

The Acquisition Manager is frozen as the client-side entry point for adding new knowledge sources to KnowledgeOS.

It receives and validates untrusted input, creates durable immutable staging, supports complete offline preparation, preserves metadata and duplicate decisions, and hands explicit proposals to synchronization without bypassing Master Library authority.

With this document, the `07-Client` implementation block is complete.
