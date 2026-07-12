# Export Providers

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Providers

**Document:** Export Providers

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural model for Export Providers in KnowledgeOS.

Export Providers implement concrete transformation and publication capabilities used by the Export Engine to generate external representations from canonical knowledge.

Export Providers generate external representations.

They never own canonical knowledge.

They never own export orchestration.

---

# 2. Scope

This document governs Providers that implement export capabilities including:

* Markdown export;
* HTML export;
* PDF export;
* PDF/A export;
* EPUB export;
* DOCX export;
* plain-text export;
* JSON export;
* XML export;
* RDF export;
* image export;
* archive export;
* future publication formats.

This document also governs:

* Export Provider identity;
* export capability declarations;
* format support;
* feature support;
* transformation behavior;
* validation behavior;
* Provider selection metadata;
* fidelity reporting;
* execution characteristics.

This document does not govern:

* canonical knowledge;
* Export Engine orchestration;
* Render Engine ownership;
* output transport protocols;
* synchronization;
* destination storage;
* user interface;
* publication policy.

---

# 3. Architectural Position

Export Providers belong to the Integration layer.

They connect the Platform Export Engine with concrete output formats and publication technologies.

```text
Canonical Knowledge
        │
        ▼
Export Engine
        │
        ▼
Export Capability Contract
        │
        ▼
Export Provider
        │
        ▼
External Representation
```

The Export Engine coordinates the operation.

The Export Provider performs the concrete transformation.

---

# 4. Core Principle

The KnowledgeOS Export Engine shall never depend directly upon a specific output library, document format SDK, rendering framework or serialization technology.

The dependency direction is:

```text
Export Engine
    │
    ▼
Export Contract
    │
    ▼
Export Provider
    │
    ▼
Concrete Technology
```

Never:

```text
Export Engine
    │
    ▼
Concrete PDF Library
```

Technology-specific behavior remains behind the Export Provider boundary.

---

# 5. Export Provider Definition

An Export Provider is a replaceable implementation of one or more Export Capability Contracts.

Conceptually:

```text
Export Provider
│
├── Identity
├── Version
├── Supported Formats
├── Supported Profiles
├── Supported Features
├── Configuration
├── Transformation
├── Validation
├── Fidelity Reporting
├── Health
└── Lifecycle
```

An Export Provider may support one format or multiple closely related formats.

Provider identity shall never replace Export Capability identity.

---

# 6. Provider and Format Separation

KnowledgeOS shall distinguish between:

* Export Provider;
* Export Format;
* Export Profile;
* Export Capability;
* Export Request;
* Export Result.

Example:

```text
Provider
    PDF Export Provider

Format
    PDF/A-2b

Profile
    Archive

Capability
    Visual Document Export

Request
    Export DDT Version 14

Result
    Published PDF/A Representation
```

These concepts shall never be treated as equivalent.

---

# 7. Export Provider Responsibilities

An Export Provider is responsible for:

* implementing declared Export Contracts;
* validating Provider-specific configuration;
* translating canonical export input into Provider-specific structures;
* generating the target representation;
* validating generated output where supported;
* reporting unsupported capabilities;
* reporting transformation limitations;
* producing Provider execution metadata;
* exposing supported formats and Features;
* exposing health and availability;
* supporting cancellation where applicable;
* supporting streaming or incremental output where applicable.

An Export Provider is not responsible for:

* deciding what knowledge is exported;
* selecting the canonical source version;
* deciding the Export Profile;
* deciding user authorization;
* modifying canonical knowledge;
* publishing output to arbitrary destinations without orchestration;
* silently discarding unsupported capabilities;
* selecting itself globally.

---

# 8. Export Engine Responsibilities

The Platform Export Engine remains responsible for:

* export request validation;
* export scope determination;
* source version selection;
* Export Profile selection;
* Provider resolution and selection;
* export planning;
* capability mapping;
* orchestration;
* final validation policy;
* Export Report generation;
* provenance recording;
* publication coordination.

The Provider transforms.

The Export Engine orchestrates.

---

# 9. Provider Independence

KnowledgeOS shall support multiple Export Providers simultaneously.

Examples may include:

* built-in Providers;
* local native Providers;
* Plugin-provided Providers;
* command-line-backed Providers;
* library-backed Providers;
* remote publication Providers;
* specialized scientific publishing Providers.

No Provider shall become an architectural dependency of the Export Engine.

---

# 10. Export Capability Model

Export Providers expose Capabilities rather than concrete technology names.

Typical Export Capabilities may include:

```text
Export.Markdown
Export.HTML
Export.PDF
Export.PDFA
Export.EPUB
Export.DOCX
Export.JSON
Export.XML
Export.RDF
Export.ImageSequence
Export.ArchivePackage
Export.StructuredRepresentation
Export.VisualRepresentation
```

Canonical Capability identities shall be governed by the Capability Registry.

---

# 11. Capability Granularity

Export Capabilities shall be granular enough to permit meaningful Provider resolution.

A Provider supporting PDF shall not automatically be assumed to support:

* PDF/A;
* tagged PDF;
* forms;
* embedded annotations;
* digital signatures;
* encryption;
* accessibility metadata.

Each supported Feature shall be declared explicitly.

---

# 12. Export Format Identity

Every target format shall have a stable Format Identity.

A Format Identity shall remain independent from:

* file extension;
* Provider identity;
* implementation library;
* operating system;
* serialization package.

Example:

```text
Format Identity:
    application/pdf

Profile:
    PDF/A-2b
```

The precise serialization is implementation-defined.

The architectural requirement is unambiguous identification.

---

# 13. Format Version

Formats supporting explicit versions shall declare them.

Examples may include:

* PDF 1.7;
* PDF 2.0;
* PDF/A-1;
* PDF/A-2;
* EPUB 3;
* HTML Living Standard profile;
* custom canonical exchange version.

Format Version shall remain distinct from Provider Version.

---

# 14. Export Profiles

Export Providers may declare support for Export Profiles defined by the Export Engine.

Typical profiles include:

* Print;
* Archive;
* Publication;
* Exchange;
* Markdown;
* Scientific;
* Backup;
* Accessibility;
* Web Publication.

A Provider shall not invent conflicting meanings for Platform-owned Export Profiles.

---

# 15. Export Profile Compatibility

A Provider may support:

* a complete Export Profile;
* a subset of a Profile;
* a Profile with limitations;
* no support for a Profile.

Profile compatibility shall be explicit.

A Provider shall not claim full support when mandatory Profile semantics cannot be preserved.

---

# 16. Export Features

Export Providers may declare optional Features.

Examples include:

* embedded annotations;
* selectable text;
* accessibility tags;
* hyperlinks;
* bookmarks;
* table of contents;
* embedded fonts;
* color profile support;
* image compression;
* vector graphics;
* metadata embedding;
* encryption;
* digital signatures;
* streaming;
* incremental output;
* page numbering;
* footnotes;
* endnotes;
* bibliography formatting.

Feature support shall be explicit and versioned where required.

---

# 17. Required and Optional Features

An Export Request may define:

* required Features;
* preferred Features;
* optional Features.

Missing required Features produce incompatibility.

Missing preferred Features may permit controlled degradation.

Missing optional Features shall be reported when relevant.

---

# 18. Export Input Model

The Export Engine shall communicate with Export Providers through canonical Export Inputs.

An Export Input may include:

* Export Request Identity;
* source Document Digital Twin reference;
* canonical version;
* export scope;
* Export Profile;
* target Format Identity;
* required Features;
* preferred Features;
* canonical metadata;
* annotation selection;
* rendering reference when applicable;
* execution parameters;
* cancellation context;
* correlation metadata.

Provider-specific input types shall remain internal to the Provider.

---

# 19. Export Scope

Export Providers shall operate only on the scope prepared by the Export Engine.

The scope may include:

* complete Document Digital Twin;
* selected chapters;
* selected pages;
* selected nodes;
* selected annotations;
* a Collection;
* a Workspace;
* a graph subset;
* metadata only.

Providers shall never expand export scope independently.

---

# 20. Structural Export Providers

Structural Export Providers transform canonical models directly into structured external representations.

Typical outputs include:

* Markdown;
* JSON;
* XML;
* RDF;
* HTML;
* canonical packages.

Conceptually:

```text
Canonical Models
        │
        ▼
Structural Export Provider
        │
        ▼
Structured Representation
```

Structural export does not require visual rendering unless the requested format or Profile requires it.

---

# 21. Visual Export Providers

Visual Export Providers generate paginated or visual representations.

Typical outputs include:

* PDF;
* PDF/A;
* image sequences;
* print-ready output;
* presentation-oriented output.

Conceptually:

```text
Canonical Models
        │
        ▼
Render Engine
        │
        ▼
Render Tree
        │
        ▼
Visual Export Provider
        │
        ▼
Visual Representation
```

The Export Provider consumes approved Render outputs.

It never owns Render Engine semantics.

---

# 22. Hybrid Export Providers

Hybrid Export Providers combine structural and visual transformation.

Examples may include:

* EPUB with structured content and generated visual assets;
* HTML with semantic structure and rendered diagrams;
* DOCX with structure, styles and embedded media;
* archive packages containing canonical and visual representations.

Hybrid behavior shall be explicit.

---

# 23. Markdown Export Provider

A Markdown Export Provider may generate:

* canonical Markdown;
* human-readable Markdown;
* platform-compatible Markdown;
* application-specific Markdown profiles.

The Provider shall declare:

* supported Markdown dialect;
* supported extensions;
* asset handling policy;
* annotation handling policy;
* metadata handling policy;
* unsupported feature behavior.

Markdown export shall never be assumed lossless by default.

---

# 24. HTML Export Provider

An HTML Export Provider may generate:

* standalone HTML;
* multi-file websites;
* semantic HTML;
* accessible HTML;
* publication packages.

The Provider shall declare:

* HTML profile;
* CSS generation behavior;
* asset packaging;
* script policy;
* accessibility support;
* metadata support;
* hyperlink behavior.

Executable scripts shall never be introduced without explicit Profile and security policy.

---

# 25. PDF Export Provider

A PDF Export Provider may generate visual paginated representations.

The Provider shall declare support for:

* PDF Version;
* pagination;
* selectable text;
* image embedding;
* hyperlinks;
* bookmarks;
* annotation representation;
* accessibility tagging;
* metadata;
* encryption;
* signatures where applicable.

PDF export shall not imply PDF/A support.

---

# 26. PDF/A Export Provider

A PDF/A Provider shall explicitly declare the supported archival conformance level.

Examples may include:

* PDF/A-1b;
* PDF/A-2b;
* PDF/A-2u;
* PDF/A-3.

Archival output shall be validated against the declared conformance level before successful completion.

---

# 27. EPUB Export Provider

An EPUB Provider may generate reflowable or fixed-layout publications.

The Provider shall declare support for:

* EPUB Version;
* reflowable content;
* fixed layout;
* navigation documents;
* metadata;
* embedded fonts;
* media;
* accessibility metadata;
* annotation representation where applicable.

Reflowable EPUB and fixed-layout EPUB are distinct capabilities.

---

# 28. DOCX Export Provider

A DOCX Provider may generate editable office documents.

The Provider shall declare support for:

* heading structure;
* paragraphs;
* lists;
* tables;
* figures;
* styles;
* footnotes;
* endnotes;
* comments;
* tracked changes where supported.

DOCX export shall report unsupported canonical semantics explicitly.

---

# 29. JSON Export Provider

A JSON Export Provider may generate structured representations for:

* interoperability;
* backup;
* testing;
* external processing;
* canonical exchange.

The Provider shall declare:

* schema identity;
* schema version;
* serialization rules;
* unknown-field policy;
* reference handling;
* asset handling;
* provenance handling.

JSON output without an explicit schema shall not be treated as a stable exchange contract.

---

# 30. XML Export Provider

An XML Export Provider may generate:

* generic XML;
* domain-specific XML;
* archival XML;
* scientific publishing XML;
* interoperable structured packages.

The Provider shall declare:

* schema;
* namespace policy;
* validation policy;
* reference behavior;
* asset packaging.

---

# 31. RDF Export Provider

An RDF Export Provider may generate graph representations.

The Provider shall declare:

* serialization format;
* ontology mapping;
* namespace policy;
* URI generation policy;
* relationship mapping;
* provenance mapping.

Graph export shall not redefine Domain ontology semantics.

---

# 32. Image Export Provider

An Image Export Provider may generate:

* page images;
* region images;
* thumbnails;
* figure exports;
* rendered annotation layers.

The Provider shall declare:

* image format;
* dimensions;
* resolution;
* color space;
* compression;
* transparency support;
* page selection behavior.

Image export is visual and derived.

It is never canonical knowledge.

---

# 33. Archive Export Provider

An Archive Export Provider may package multiple artifacts.

A package may include:

* canonical representation;
* Markdown;
* assets;
* annotations;
* metadata;
* provenance;
* checksums;
* validation report.

Archive packaging shall define a stable package structure and version.

---

# 34. Asset Handling

Export Providers shall declare how they handle Assets.

Possible strategies include:

* Embed;
* Copy;
* Reference;
* Transform;
* Omit with Warning.

Asset handling shall remain explicit.

Silent omission is prohibited.

---

# 35. Asset Identity Preservation

When possible, exported Assets shall preserve a traceable relationship with canonical Asset identities.

External formats may use different identifiers.

Mapping shall be recorded in the Export Report where required.

---

# 36. Asset Transformation

Assets may be transformed for format compatibility.

Examples include:

* image conversion;
* resizing;
* compression;
* color-space conversion;
* vector-to-raster conversion;
* media transcoding.

Every transformation shall remain traceable.

---

# 37. Annotation Handling

Export Providers shall declare how they represent annotations.

Possible strategies include:

* native annotation representation;
* visual flattening;
* comment conversion;
* endnote conversion;
* separate companion file;
* omission with explicit warning.

The strategy may depend upon the Export Profile.

---

# 38. Ink Handling

Handwritten ink may be represented as:

* vector strokes;
* rasterized overlays;
* embedded annotations;
* separate Assets;
* unsupported capability.

Ink shall never disappear silently.

---

# 39. Highlight Handling

Highlights may be represented as:

* native highlight annotations;
* styled text;
* background color;
* separate annotation data;
* visual flattening.

Semantic annotation metadata may exceed the target format's capabilities.

Any loss shall be reported.

---

# 40. Provenance Handling

Export Providers shall declare how provenance is represented.

Possible strategies include:

* embedded metadata;
* companion metadata file;
* package manifest;
* RDF statements;
* Export Report only.

Canonical provenance shall remain preserved internally even when the target format cannot represent it fully.

---

# 41. Metadata Handling

Metadata may include:

* title;
* authors;
* language;
* identifiers;
* source references;
* creation date;
* modification date;
* rights;
* subject classifications;
* custom metadata.

The Provider shall map supported metadata fields explicitly.

Unsupported metadata shall be reported.

---

# 42. Hyperlink Handling

Export Providers shall declare support for:

* internal links;
* external links;
* cross-document links;
* annotation links;
* graph links.

Broken or unrepresentable links shall be reported.

---

# 43. Reference Handling

Canonical references may include:

* citations;
* cross-references;
* bibliographic references;
* node references;
* Asset references.

The Provider shall preserve reference semantics where the target format permits.

---

# 44. Capability Mapping

Every Export Provider shall participate in Capability Mapping.

Capability Mapping evaluates:

```text
Canonical Capability
        │
        ▼
Target Format Capability
        │
        ▼
Mapping Strategy
```

Each capability shall be classified as:

* Preserved;
* Transformed;
* Flattened;
* Externalized;
* Omitted with Warning;
* Unsupported.

---

# 45. Fidelity Model

Export fidelity represents how completely the external representation preserves selected canonical semantics.

Fidelity may be evaluated across dimensions including:

* textual fidelity;
* structural fidelity;
* semantic fidelity;
* visual fidelity;
* annotation fidelity;
* metadata fidelity;
* provenance fidelity;
* relationship fidelity.

A single percentage is insufficient unless accompanied by dimensional detail.

---

# 46. Fidelity Levels

KnowledgeOS may use conceptual fidelity levels such as:

* Exact;
* High;
* Partial;
* Reduced;
* Minimal;
* Unsupported.

The exact model is governed by Export architecture.

Providers supply the evidence required for evaluation.

---

# 47. Fidelity Report

An Export Provider shall return Provider-level fidelity information.

The final Export Report may include:

* preserved capabilities;
* transformed capabilities;
* unsupported capabilities;
* warnings;
* validation results;
* Provider limitations.

The Export Engine owns the final report.

---

# 48. Controlled Degradation

Controlled degradation is permitted when:

* the Export Profile allows it;
* required semantics remain intact;
* unsupported capabilities are reported;
* the user or policy accepts the result.

Silent degradation is prohibited.

---

# 49. Lossless Export

A Provider may claim lossless export only when every required canonical semantic in the declared export scope can be preserved and reconstructed according to the target contract.

Lossless claims shall be explicit and testable.

Visual similarity alone does not establish losslessness.

---

# 50. Deterministic Transformation

Export Provider transformation shall be deterministic when the target format and selected options permit it.

Given the same:

* canonical input;
* source version;
* Export Profile;
* Provider Version;
* configuration;
* execution conditions defined by the contract;

the Provider shall produce semantically equivalent output.

---

# 51. Reproducible Export

Every export shall preserve enough metadata to reproduce the transformation where practical.

Reproducibility metadata may include:

* Provider Identity;
* Provider Version;
* Format Identity;
* Format Version;
* Export Profile;
* configuration fingerprint;
* source version;
* transformation options;
* execution timestamp.

---

# 52. Canonical Source Immutability

Export Providers receive canonical knowledge as read-only input.

They shall never:

* modify source models;
* modify source version history;
* modify provenance;
* modify annotations;
* modify Library organization.

Export is a derived transformation.

---

# 53. Temporary Artifacts

Providers may create temporary artifacts during export.

Examples include:

* intermediate files;
* render caches;
* generated Assets;
* validation artifacts;
* temporary package directories.

Temporary artifacts remain non-canonical.

They shall be cleaned according to execution policy.

---

# 54. Streaming Export

A Provider may support streaming output.

Streaming may be useful for:

* large archives;
* large JSON representations;
* media output;
* remote publication;
* low-memory execution.

Streaming semantics shall define:

* ordering;
* completion;
* cancellation;
* validation;
* partial output handling.

---

# 55. Incremental Export

A Provider may support incremental export.

Incremental export may update an existing external representation using canonical changes.

Support shall be explicitly declared.

Incremental export shall not compromise reproducibility or integrity.

---

# 56. Partial Output

An export may fail after producing partial output.

The Provider shall distinguish:

* no output produced;
* temporary partial output;
* invalid partial output;
* recoverable partial output;
* complete validated output.

Partial output shall never be published as successful output automatically.

---

# 57. Output Validation

Export Providers shall support output validation when required by the Format or Export Profile.

Validation may include:

* schema validation;
* syntax validation;
* structural validation;
* archival conformance;
* package integrity;
* link validation;
* completeness validation.

Validation failure prevents successful Provider completion.

---

# 58. Provider-Level Validation

Provider-level validation verifies concrete format correctness.

The Export Engine may perform additional Platform-level validation.

These are separate responsibilities.

---

# 59. Format Validation

Format validation shall use the applicable target specification when available.

Examples include:

* EPUB validation;
* PDF/A conformance validation;
* XML Schema validation;
* JSON Schema validation;
* package manifest validation.

A generated file is not valid merely because it can be opened.

---

# 60. Output Integrity

Export outputs may include integrity metadata.

Examples include:

* cryptographic hash;
* package checksum;
* asset checksum;
* signature;
* validation report.

Integrity metadata supports verification and exchange.

---

# 61. Export Provider Configuration

Provider configuration may include:

* default output options;
* compression level;
* image quality;
* font embedding policy;
* color profile;
* schema profile;
* page dimensions;
* validation level;
* temporary directory policy.

Configuration shall be validated before execution.

---

# 62. Provider Selection

Export Provider selection belongs to the Export Engine and Platform policy.

Selection may consider:

* target Format;
* required Export Profile;
* required Features;
* fidelity requirements;
* Provider availability;
* validation support;
* performance;
* device compatibility;
* user preference;
* security policy.

Providers shall not select themselves globally.

---

# 63. Selection by Target Format

The target Format is a primary Provider-resolution input.

Example:

```text
Target:
    EPUB 3

Required Features:
    Reflowable
    Navigation
    Embedded Images

Eligible Providers:
    Provider A
    Provider C
```

The Export Engine selects among eligible Providers according to policy.

---

# 64. Selection by Fidelity

A high-fidelity export request may exclude Providers unable to preserve mandatory semantics.

A lower-fidelity request may permit controlled degradation.

Fidelity requirements shall be part of Provider compatibility evaluation.

---

# 65. Device Compatibility

Some Export Providers may be available only on specific devices or operating systems.

Examples include:

* native macOS print frameworks;
* server-side publication services;
* web-compatible serializers;
* local command-line tools.

Environment compatibility shall be explicit.

---

# 66. Offline Compatibility

Export Providers shall declare whether execution is:

* Offline Capable;
* Online Required;
* Hybrid.

Core local export formats should remain available offline whenever technically practical.

---

# 67. External Export Services

A Provider may delegate transformation to an external service.

External export shall declare:

* external transmission;
* transmitted data category;
* authentication requirement;
* retention characteristics where known;
* cost characteristics;
* privacy implications.

External export shall never be hidden behind a generic format request.

---

# 68. Security

Export Providers shall operate within explicit security boundaries.

Security requirements may include:

* source read authorization;
* output destination authorization;
* temporary file protection;
* external transmission permission;
* secret handling;
* package integrity;
* sandboxing.

Providers shall receive only the authority required for execution.

---

# 69. Sensitive Content

Sensitive canonical knowledge shall not be transmitted to remote Export Providers unless:

* the Provider is eligible under privacy policy;
* required permissions are granted;
* external transmission is explicit;
* the Export Profile permits it.

Technical compatibility does not imply privacy compatibility.

---

# 70. Output Destination Separation

Generating an output and publishing it to a destination are separate concerns.

```text
Export Provider
    │
    ▼
Generated Representation
    │
    ▼
Publication / Storage Integration
```

An Export Provider shall not gain unrestricted destination access merely because it generated the output.

---

# 71. Export Provider Failure Model

Typical canonical failures include:

* FormatUnsupported;
* ProfileUnsupported;
* FeatureUnsupported;
* InvalidExportInput;
* TransformationFailed;
* AssetTransformationFailed;
* ValidationFailed;
* OutputIntegrityFailed;
* ResourceExhausted;
* Timeout;
* Cancelled;
* ExternalServiceUnavailable;
* AuthenticationFailed;
* PermissionDenied;
* PartialOutputProduced.

Provider-specific failures shall be translated into canonical categories.

---

# 72. Cancellation

Export Providers shall support cancellation when technically possible.

Cancellation semantics shall define:

* temporary artifact cleanup;
* partial output handling;
* external request cancellation;
* validation interruption;
* publication prevention.

Cancellation shall not modify canonical input.

---

# 73. Retry

Retries shall be governed by execution policy.

Retry eligibility depends upon:

* failure category;
* idempotency;
* output destination;
* external side effects;
* partial output state;
* cost.

Providers shall not perform uncontrolled hidden retries.

---

# 74. Idempotency

Export generation should be idempotent with respect to canonical input and execution identity where the Provider Contract defines it.

Repeated generation may produce equivalent output without being byte-identical when the target format embeds non-semantic timestamps or identifiers.

Idempotency semantics shall be explicit.

---

# 75. Export Provider Health

Providers shall expose health where practical.

Health may consider:

* required library availability;
* runtime availability;
* external service reachability;
* validation tool availability;
* configuration validity;
* temporary storage availability.

Health is distinct from compatibility.

---

# 76. Observability

Export Provider execution shall be observable.

Observable metadata may include:

* Provider Identity;
* Provider Version;
* target Format;
* Export Profile;
* duration;
* source scope size;
* output size;
* validation result;
* fidelity result;
* warning count;
* failure category;
* correlation metadata.

Canonical content shall not be logged unnecessarily.

---

# 77. Metrics

Export Provider metrics may include:

* execution count;
* success rate;
* failure rate;
* average duration;
* output size;
* validation failure rate;
* cancellation count;
* controlled degradation count;
* Provider selection frequency;
* external service usage.

Metrics shall remain content-safe.

---

# 78. Export Provider Invariants

The following invariants apply.

* Export Providers belong to the Integration layer.
* Export Providers implement public Export Capability Contracts.
* The Export Engine never depends directly upon format-specific technologies.
* Export Providers never own canonical knowledge.
* Export Providers never modify canonical input.
* Export Providers never own export orchestration.
* Export Provider identity is distinct from Format identity.
* Export Profile semantics remain owned by the Export Engine.
* Provider-specific types never cross the Provider boundary.
* Unsupported capabilities are never discarded silently.
* Controlled degradation is explicit.
* Fidelity is reported across meaningful dimensions.
* Visual similarity alone does not establish losslessness.
* Target Format support is explicit.
* Format Version support is explicit.
* Required Features participate in compatibility evaluation.
* Asset transformation remains traceable.
* Annotation loss is explicitly reported.
* Provenance remains preserved internally.
* Generated output is validated when required.
* Partial output is never silently published as successful output.
* Output generation and destination publication remain separate concerns.
* Provider selection belongs to Platform policy.
* External transformation is explicit.
* Export execution remains observable and reproducible.

---

# 79. Prohibited Behaviors

Export Providers shall never:

* mutate canonical knowledge;
* alter source version history;
* bypass the Export Engine;
* bypass permission checks;
* select themselves globally;
* expose format-library objects to Platform consumers;
* silently omit unsupported annotations;
* silently omit Assets;
* silently remove provenance;
* claim lossless export without semantic guarantees;
* treat file extension as sufficient Format identity;
* publish partial invalid output as successful;
* write to arbitrary destinations without authorization;
* transmit sensitive content externally without explicit policy approval;
* perform uncontrolled hidden retries;
* redefine Export Profile semantics;
* treat successful file creation as sufficient validation.

---

# 80. Related Documents

* `ProviderModel.md`
* `AIProviders.md`
* `OCRProviders.md`
* `StorageProviders.md`
* `SyncProviders.md`
* `../DataExchange/ExportProtocols.md`
* `../DataExchange/CanonicalExchange.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/Compatibility.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Render/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../02-Domain/KnowledgeObject/Provenance.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 81. Status

**Approved**

This document defines the architectural model for Export Providers in KnowledgeOS.

Export Providers implement replaceable transformation capabilities for concrete external formats while remaining isolated from canonical knowledge and export orchestration.

The Export Engine determines what is exported, which source version is used, which Export Profile applies and which Provider is selected.

The Export Provider transforms the prepared canonical input into a concrete external representation, validates that representation, reports fidelity and exposes every limitation explicitly.

External formats are derived.

Canonical knowledge remains authoritative.

---
