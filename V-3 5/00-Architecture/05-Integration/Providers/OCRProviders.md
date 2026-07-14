
# OCR Providers

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Providers

**Document:** OCR Providers

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural model for Optical Character Recognition Providers in KnowledgeOS.

OCR Providers implement replaceable text-recognition capabilities used by the Import Engine and related document-processing workflows.

OCR Providers recognize observable textual and visual evidence.

They never own canonical document meaning.

They never construct authoritative knowledge directly.

---

# 2. Scope

This document governs Providers that implement capabilities including:

* printed text recognition;
* handwritten text recognition;
* page-level OCR;
* region-level OCR;
* multilingual recognition;
* orientation detection;
* script detection;
* character confidence;
* word confidence;
* line confidence;
* bounding-box extraction;
* baseline extraction;
* reading-order hints;
* table-cell text recognition;
* formula-region recognition where supported;
* batch OCR;
* incremental OCR;
* local OCR;
* remote OCR;
* native operating-system OCR;
* specialized historical-document OCR.

This document also governs:

* OCR Provider identity;
* OCR Capability declarations;
* OCR request and result models;
* language and script support;
* geometry preservation;
* confidence reporting;
* Provider selection metadata;
* execution locality;
* validation behavior;
* privacy characteristics;
* observability.

This document does not govern:

* canonical document reconstruction;
* semantic interpretation;
* heading classification;
* table reconstruction;
* layout ownership;
* UDM construction;
* DPM construction;
* Import Engine orchestration;
* Knowledge Object creation;
* correction user interface;
* Provider packaging.

---

# 3. Architectural Position

OCR Providers belong to the Integration layer.

They connect the Import Engine and document-processing workflows with concrete OCR technologies.

```text
Information Source
        │
        ▼
Import Engine
        │
        ▼
OCR Capability Contract
        │
        ▼
OCR Provider
        │
        ▼
Concrete OCR Runtime
        │
        ▼
Recognition Result
```

The Import Engine orchestrates recognition and reconstruction.

The OCR Provider performs concrete recognition.

---

# 4. Core Principle

The KnowledgeOS Import Engine shall never depend directly upon a specific OCR library, model, vendor or cloud service.

The dependency direction is:

```text
Import Engine
    │
    ▼
OCR Contract
    │
    ▼
OCR Provider
    │
    ▼
Concrete OCR Technology
```

Never:

```text
Import Engine
    │
    ▼
Concrete OCR SDK
```

Technology-specific behavior remains behind the OCR Provider boundary.

---

# 5. OCR Provider Definition

An OCR Provider is a replaceable implementation of one or more OCR Capability Contracts.

Conceptually:

```text
OCR Provider
│
├── Identity
├── Version
├── Capabilities
├── Languages
├── Scripts
├── Input Types
├── Recognition Modes
├── Configuration
├── Execution
├── Confidence Model
├── Geometry Model
├── Health
└── Lifecycle
```

An OCR Provider may expose one recognition engine or multiple recognition modes.

A recognition model is not a Provider.

The Provider is the architectural integration boundary.

---

# 6. Provider and Recognition Model Separation

KnowledgeOS shall distinguish between:

* OCR Provider;
* OCR Model;
* OCR Capability;
* OCR Request;
* OCR Result;
* Import Interpretation;
* Canonical Document Model.

Example:

```text
Provider
    Local OCR Runtime

Model
    Latin Printed Text Model

Capability
    Printed Text Recognition

Request
    Recognize Page Region 12

Result
    Tokens + Geometry + Confidence

Canonical Interpretation
    Paragraph Node in UDM
```

These concepts shall never be treated as equivalent.

---

# 7. OCR Provider Responsibilities

An OCR Provider is responsible for:

* implementing declared OCR Contracts;
* validating Provider-specific configuration;
* accepting supported image or page inputs;
* recognizing visible text;
* identifying supported scripts and languages;
* preserving recognition geometry;
* reporting confidence metadata;
* reporting recognition alternatives where supported;
* reporting orientation and script hints;
* reporting unsupported inputs;
* exposing health and availability;
* supporting cancellation where possible;
* supporting batch execution where declared;
* translating runtime-specific results into canonical OCR results.

An OCR Provider is not responsible for:

* deciding whether a region is a heading;
* deciding document hierarchy;
* deciding canonical reading order;
* reconstructing paragraphs;
* reconstructing tables;
* assigning semantic meaning;
* generating Knowledge Objects;
* modifying canonical models;
* resolving document identity;
* selecting itself globally;
* replacing Import Engine validation.

---

# 8. Import Engine Responsibilities

The Platform Import Engine remains responsible for:

* deciding when OCR is required;
* selecting the OCR scope;
* selecting the Provider;
* selecting recognition modes;
* preprocessing orchestration;
* page segmentation;
* layout-analysis orchestration;
* reading-order reconstruction;
* semantic classification;
* canonical model construction;
* confidence aggregation;
* correction workflows;
* provenance integration;
* validation.

The OCR Provider recognizes.

The Import Engine interprets and reconstructs.

---

# 9. Provider Independence

KnowledgeOS shall support multiple OCR Providers simultaneously.

Examples may include:

* built-in native Providers;
* local open-source Providers;
* local machine-learning Providers;
* operating-system OCR Providers;
* remote commercial OCR Providers;
* self-hosted OCR services;
* handwriting-specialized Providers;
* historical-document Providers;
* scientific-formula Providers;
* Plugin-provided Providers.

No Provider shall become an architectural dependency of the Import Engine.

---

# 10. OCR Capability Model

OCR Providers expose explicit Capabilities rather than technology names.

Typical OCR Capabilities may include:

```text
OCR.PrintedText
OCR.HandwrittenText
OCR.PageRecognition
OCR.RegionRecognition
OCR.LanguageDetection
OCR.ScriptDetection
OCR.OrientationDetection
OCR.BoundingBoxes
OCR.Baselines
OCR.WordConfidence
OCR.CharacterConfidence
OCR.AlternativeCandidates
OCR.TableCellRecognition
OCR.FormulaRegionRecognition
OCR.BatchRecognition
```

Canonical Capability identities shall be governed by the Capability Registry.

---

# 11. Capability Granularity

OCR Capabilities shall be granular enough to support meaningful Provider resolution.

A Provider supporting printed text recognition shall not automatically be assumed to support:

* handwriting;
* formulas;
* tables;
* vertical text;
* mixed scripts;
* bounding polygons;
* character-level confidence;
* batch execution.

Each supported Feature shall be declared explicitly.

---

# 12. OCR Capability Features

OCR Capabilities may expose optional Features.

Examples include:

* Multilingual Recognition;
* Mixed-Language Pages;
* Vertical Text;
* Right-to-Left Text;
* Curved Baselines;
* Rotated Text;
* Low-Resolution Input;
* Historical Fonts;
* Fraktur;
* Handwriting;
* Character Alternatives;
* Word Alternatives;
* Polygon Geometry;
* Reading-Order Hints;
* Batch Processing;
* Streaming Results;
* Incremental Recognition.

Required Features participate in compatibility evaluation.

---

# 13. Recognition Modes

An OCR Provider may expose recognition modes.

Typical modes include:

* Fast;
* Accurate;
* Printed;
* Handwritten;
* Sparse Text;
* Dense Page;
* Historical Document;
* Technical Document;
* Multilingual;
* Low Resource.

Recognition modes are Provider capabilities or configuration abstractions.

They shall not redefine Import Engine semantics.

---

# 14. Input Model

The Import Engine shall communicate with OCR Providers through canonical OCR requests.

An OCR Request may include:

* Request Identity;
* source reference;
* page reference;
* image reference;
* selected region;
* image dimensions;
* image resolution;
* orientation hint;
* language hints;
* script hints;
* recognition mode;
* required Features;
* preprocessing metadata;
* timeout;
* cancellation context;
* privacy classification;
* correlation metadata.

Provider-specific input types shall remain internal to the Provider.

---

# 15. Supported Input Types

OCR Providers shall declare supported inputs.

Typical input types include:

* page image;
* cropped region;
* bitmap;
* raster image;
* camera image;
* scanned page;
* image sequence;
* PDF page rendering;
* tiled image.

A Provider shall not assume access to the original file unless explicitly required by its Contract.

---

# 16. Page-Level Recognition

Page-level recognition processes a complete page image.

It may produce:

* recognized lines;
* recognized words;
* recognized characters;
* bounding geometry;
* confidence;
* orientation hints;
* script hints;
* reading-order hints.

Page-level output is observational.

It does not define canonical page structure.

---

# 17. Region-Level Recognition

Region-level recognition processes a selected page region.

Typical regions include:

* text block;
* title area;
* caption area;
* table cell;
* margin note;
* footnote;
* header;
* footer.

The region is selected by the Import Engine or a layout-analysis workflow.

The OCR Provider shall not expand the requested region silently.

---

# 18. Token Model

OCR output may contain recognized tokens.

A token may represent:

* character;
* grapheme;
* word;
* line;
* text span.

Every token may include:

* recognized text;
* normalized text where supported;
* geometry;
* confidence;
* alternatives;
* language;
* script;
* orientation;
* Provider metadata.

Token granularity shall be explicit.

---

# 19. Character Recognition

Providers supporting character-level output may expose:

* recognized character;
* confidence;
* alternatives;
* bounding geometry;
* script classification.

Character-level output may be required for:

* correction workflows;
* uncertain-word reconstruction;
* historical texts;
* formula-adjacent text;
* handwriting.

Character recognition remains non-canonical until validated and integrated.

---

# 20. Word Recognition

Word-level output should preserve:

* word text;
* token order within the line;
* geometry;
* confidence;
* language;
* alternatives where supported.

Word boundaries inferred by the Provider shall remain traceable.

They may be revised during Import reconstruction.

---

# 21. Line Recognition

Line-level output may include:

* line text;
* baseline;
* bounding geometry;
* token references;
* confidence;
* direction;
* orientation.

Recognized lines are evidence.

They are not automatically canonical paragraphs.

---

# 22. Recognition Geometry

OCR Providers shall preserve geometric information whenever supported.

Geometry may include:

* bounding rectangle;
* rotated rectangle;
* polygon;
* baseline;
* character boxes;
* word boxes;
* line boxes.

Geometry shall use a declared coordinate system.

---

# 23. Coordinate System

Every OCR Result containing geometry shall declare its coordinate system.

The coordinate system shall define:

* origin;
* axes;
* units;
* page or region dimensions;
* rotation;
* normalization state.

Geometry without a known coordinate system is invalid for canonical integration.

---

# 24. Normalized Coordinates

KnowledgeOS may support normalized coordinates.

Conceptually:

```text
x ∈ [0,1]
y ∈ [0,1]
```

Normalized coordinates improve portability across image resolutions.

The original input dimensions shall remain traceable.

---

# 25. Rotated Geometry

Providers supporting rotated text shall preserve rotation or polygon geometry.

Axis-aligned boxes alone may be insufficient.

Rotation data shall not be discarded when available.

---

# 26. Baselines

Text baselines may be preserved for:

* line reconstruction;
* handwriting;
* curved text;
* vertical alignment;
* typographic analysis.

Baseline support shall be declared explicitly.

---

# 27. Confidence Model

OCR Providers shall expose confidence where available.

Confidence may exist at:

* page level;
* region level;
* line level;
* word level;
* character level.

Confidence is Provider evidence.

It is not a universal probability unless explicitly calibrated.

---

# 28. Confidence Semantics

Every Provider shall document the semantics of its confidence values.

Confidence metadata shall identify where possible:

* value range;
* calibration behavior;
* granularity;
* meaning;
* known limitations.

KnowledgeOS shall not assume that confidence values from different Providers are directly comparable.

---

# 29. Confidence Normalization

The Integration layer may normalize Provider confidence into a canonical representation.

Normalization shall preserve:

* original Provider confidence;
* original range;
* normalized value;
* normalization method;
* Provider identity;
* model identity.

Original evidence shall never be discarded.

---

# 30. Confidence Thresholds

Providers shall not globally decide the acceptance threshold for canonical import.

They may expose recommended thresholds.

The Import Engine and active Import Profile determine:

* automatic acceptance;
* review requirement;
* alternate Provider execution;
* reprocessing requirement;
* rejection.

Threshold policy belongs to Platform orchestration.

---

# 31. Alternative Candidates

Providers may expose alternative recognition candidates.

Example:

```text
Recognized:
    cardiomegaly

Alternatives:
    cardiomegalia
    cardiomegaly.
```

Alternatives may support:

* correction;
* language-aware reconstruction;
* ensemble recognition;
* confidence review.

Alternative candidates shall remain traceable to the Provider.

---

# 32. Language Support

OCR Providers shall declare supported languages.

Language declarations may include:

* language identity;
* script;
* recognition quality class;
* model requirement;
* offline availability;
* mixed-language support.

Language identity should follow an approved standard.

---

# 33. Language Hints

OCR Requests may provide language hints.

Hints may be:

* Required;
* Preferred;
* Candidate List;
* Unknown.

A Provider shall report when requested language support is unavailable.

---

# 34. Language Detection

Providers may support language detection.

Language detection may occur at:

* page level;
* region level;
* line level;
* token level.

Detected language is evidence.

The Import Engine decides how it affects reconstruction.

---

# 35. Mixed-Language Documents

Providers shall explicitly declare support for mixed-language content.

Mixed-language support may include:

* multiple Latin languages;
* mixed scripts;
* embedded quotations;
* multilingual tables;
* bilingual pages.

Single-language support shall not be misrepresented as multilingual support.

---

# 36. Script Support

OCR Providers shall declare supported scripts independently from languages.

Typical scripts include:

* Latin;
* Cyrillic;
* Greek;
* Arabic;
* Hebrew;
* Devanagari;
* Han;
* Hangul;
* Japanese Kana;
* historical scripts.

Language and script shall not be treated as interchangeable.

---

# 37. Script Detection

Providers may expose script detection.

Script detection may support Provider selection or multi-pass OCR.

Detected script remains observational metadata.

---

# 38. Text Direction

OCR Results shall preserve text direction where available.

Typical directions include:

* left-to-right;
* right-to-left;
* top-to-bottom;
* bottom-to-top.

Direction is required for reliable reconstruction of some scripts and layouts.

---

# 39. Orientation Detection

OCR Providers may expose page or region orientation.

Typical orientations include:

* 0 degrees;
* 90 degrees;
* 180 degrees;
* 270 degrees;
* arbitrary rotation.

Orientation output may inform preprocessing or reprocessing.

---

# 40. Reading-Order Hints

OCR Providers may expose reading-order hints.

These hints are advisory.

Canonical reading order remains owned by layout analysis and Import reconstruction.

A Provider shall not present heuristic reading order as authoritative document structure.

---

# 41. Printed Text Recognition

Printed Text Providers shall declare support for:

* common typefaces;
* small text;
* low contrast;
* multi-column pages;
* rotated text;
* degraded scans;
* historical typography where applicable.

Support shall be based on declared capabilities, not assumptions.

---

# 42. Handwriting Recognition

Handwriting recognition is a distinct Capability.

Providers shall declare support for:

* isolated handwriting;
* cursive handwriting;
* margin annotations;
* form fields;
* mixed print and handwriting;
* supported languages and scripts.

Printed OCR support does not imply handwriting support.

---

# 43. Historical Document Recognition

Historical-document Providers may support:

* degraded paper;
* bleed-through;
* irregular printing;
* obsolete typefaces;
* Fraktur;
* ligatures;
* historical spelling;
* marginalia.

Historical recognition support shall be explicit.

---

# 44. Table-Cell Recognition

OCR Providers may recognize text within table cells.

They do not own table reconstruction.

The valid flow is:

```text
Layout Analysis
        │
        ▼
Detected Cell Region
        │
        ▼
OCR Provider
        │
        ▼
Recognized Cell Text
        │
        ▼
Table Reconstruction
```

Table topology remains outside the OCR Provider.

---

# 45. Formula Regions

OCR Providers may recognize formula-adjacent or formula-region content.

Formula recognition is distinct from ordinary OCR.

A Provider shall declare whether it returns:

* plain text;
* structured mathematical notation;
* LaTeX;
* MathML;
* visual tokens;
* unsupported result.

Formula semantics remain subject to validation.

---

# 46. Captions

OCR may recognize text within detected caption regions.

Caption association with figures or tables belongs to layout and semantic reconstruction.

OCR Providers shall not own caption relationships.

---

# 47. Headers and Footers

OCR Providers may recognize header and footer text.

Classification as header or footer belongs to layout analysis.

Repeated-content detection may be supplied as advisory metadata when supported.

---

# 48. Footnotes

OCR Providers may recognize footnote regions.

Footnote identity, numbering and reference association belong to Import reconstruction.

---

# 49. Preprocessing Relationship

OCR accuracy depends strongly upon preprocessing.

Possible preprocessing includes:

* deskewing;
* denoising;
* contrast correction;
* binarization;
* dewarping;
* perspective correction;
* page splitting;
* background removal;
* resolution enhancement.

Preprocessing orchestration belongs to the Import Engine or dedicated processing Providers.

OCR Providers may declare input recommendations.

---

# 50. Provider-Managed Preprocessing

An OCR Provider may perform internal preprocessing.

Internal preprocessing shall be declared where it materially affects:

* geometry;
* confidence;
* reproducibility;
* output coordinates;
* image fidelity.

The Provider shall preserve mapping to the original input coordinate space when required.

---

# 51. Preprocessing Provenance

When preprocessing occurs, recognition provenance shall record:

* preprocessing Provider;
* preprocessing operations;
* input image reference;
* transformed image reference;
* geometry mapping;
* relevant configuration.

Recognition shall remain traceable to the original source.

---

# 52. Multi-Pass Recognition

KnowledgeOS may perform multiple OCR passes.

Examples include:

* fast pass followed by accurate pass;
* printed pass followed by handwriting pass;
* language-specific passes;
* alternate Provider comparison;
* low-confidence region reprocessing.

Multi-pass orchestration belongs to the Import Engine.

---

# 53. Provider Ensembles

Multiple OCR Providers may recognize the same region.

Conceptually:

```text
Page Region
   │
   ├── Provider A
   ├── Provider B
   └── Provider C
          │
          ▼
   Recognition Comparison
```

The Provider Model permits coexistence.

Result reconciliation belongs to Import processing.

---

# 54. Result Comparison

OCR Result comparison may consider:

* recognized text;
* confidence;
* token geometry;
* language;
* script;
* alternatives;
* dictionary consistency;
* semantic consistency.

No OCR Provider owns final reconciliation.

---

# 55. Correction Workflow

OCR Results may enter a correction workflow.

Corrections may be:

* automatic;
* dictionary-based;
* model-assisted;
* user-reviewed;
* consensus-based.

Corrected text shall preserve provenance linking:

* original recognition;
* correction operation;
* corrected result;
* responsible actor or Provider.

---

# 56. User Corrections

User corrections are authoritative editorial actions within their permitted scope.

They shall not overwrite recognition evidence silently.

The system should preserve:

* original OCR text;
* corrected text;
* correction timestamp;
* correction author;
* affected token references.

---

# 57. Recognition Provenance

Every OCR Result shall preserve provenance.

Provenance may include:

* Provider Identity;
* Provider Version;
* model identity;
* model revision;
* recognition mode;
* language hints;
* preprocessing references;
* input image reference;
* execution timestamp;
* execution locality;
* relevant configuration.

Provenance is mandatory for reproducibility and review.

---

# 58. OCR Result Authority

OCR output is not canonical knowledge by default.

OCR Results may be:

* provisional;
* accepted;
* corrected;
* rejected;
* reprocessed;
* integrated.

Canonical integration occurs only through Import Engine validation and model construction.

---

# 59. Execution Locality

Every OCR Provider shall declare execution locality.

Typical values include:

* Embedded;
* Local;
* Local Network;
* Self-Hosted Remote;
* External Remote.

Execution locality affects:

* privacy;
* offline availability;
* latency;
* cost;
* policy eligibility;
* data residency.

---

# 60. Local-First OCR

KnowledgeOS shall prefer local OCR when:

* the required Capability is available;
* expected quality is sufficient;
* device resources permit execution;
* user policy prefers local processing.

Local-first does not prohibit remote OCR.

It establishes a default architectural preference.

---

# 61. Offline OCR

OCR Providers shall declare whether they operate offline.

Offline OCR requires:

* local execution;
* available model resources;
* supported language models;
* sufficient device resources.

The absence of network connectivity shall not disable compatible local OCR Providers.

---

# 62. Remote OCR

Remote OCR Providers shall declare:

* external transmission requirement;
* transmitted data type;
* authentication requirement;
* retention characteristics where known;
* region or residency constraints;
* cost characteristics;
* supported languages and Features.

Remote processing shall never be hidden.

---

# 63. Sensitive Documents

Sensitive document images shall be processed only by Providers eligible under active privacy policy.

A remote Provider may be incompatible even when technically capable.

Privacy compatibility is independent from technical compatibility.

---

# 64. Data Transmission

Remote OCR may transmit:

* full pages;
* page regions;
* images;
* metadata;
* language hints.

The transmitted scope shall be limited to the minimum required by the OCR Request.

Providers shall never expand transmission scope silently.

---

# 65. Provider Selection

OCR Provider selection belongs to the Import Engine and Platform policy.

Selection may consider:

* required Capability;
* language;
* script;
* handwriting;
* expected quality;
* confidence support;
* geometry support;
* locality;
* privacy;
* availability;
* latency;
* cost;
* device resources;
* user preference.

Providers shall not globally select themselves.

---

# 66. Selection by Document Type

Provider selection may depend upon document characteristics.

Examples include:

* modern printed book;
* historical book;
* scientific paper;
* handwritten notes;
* multilingual magazine;
* technical manual;
* low-resolution scan.

Document classification may guide Provider resolution.

It shall not create permanent Provider coupling.

---

# 67. Selection by Region

Different regions of the same page may use different Providers.

Example:

```text
Page
├── Printed Body Text → Printed OCR Provider
├── Handwritten Margin → Handwriting Provider
└── Formula Region → Formula Recognition Provider
```

Region-level selection supports specialized recognition.

---

# 68. Selection by Confidence

Low-confidence output may trigger:

* alternate Provider execution;
* more accurate recognition mode;
* preprocessing retry;
* language-specific retry;
* user review.

Thresholds belong to Import policy.

---

# 69. Cost Characteristics

OCR Providers may expose cost characteristics.

Typical values include:

* Free;
* Local Resource Cost;
* Metered;
* Subscription;
* Unknown.

Remote or commercial Providers may expose unit-cost metadata where available.

---

# 70. Resource Characteristics

Local OCR Providers may declare:

* memory requirements;
* processor requirements;
* accelerator support;
* storage requirements;
* model size;
* execution concurrency;
* batch capacity.

Resource metadata supports scheduling and Provider selection.

---

# 71. Authentication

Remote OCR Providers may require:

* API keys;
* OAuth;
* access tokens;
* client certificates;
* custom authentication.

Secrets shall be managed through approved secret-management Contracts.

They shall never be stored in extension Manifests.

---

# 72. Provider Configuration

OCR Provider configuration may include:

* Endpoint;
* model selection;
* language packs;
* recognition mode;
* timeout;
* batch size;
* confidence options;
* geometry options;
* concurrency;
* temporary storage behavior.

Configuration shall be validated before execution.

---

# 73. Provider Health

OCR Providers shall expose health where practical.

Health may consider:

* runtime availability;
* language-model availability;
* authentication validity;
* Endpoint reachability;
* model readiness;
* required resource availability;
* configuration validity.

Health is distinct from compatibility.

---

# 74. Model Availability

A Provider may be healthy while a required language model is unavailable.

Example:

```text
Provider:
    Healthy

English Model:
    Available

Spanish Model:
    Available

Japanese Model:
    Missing
```

Provider selection shall consider the specific required model resources.

---

# 75. Batch Recognition

Providers may support batch recognition.

Batch execution may process:

* multiple pages;
* multiple regions;
* multiple documents;
* tiled images.

Batch support shall define:

* ordering;
* failure semantics;
* partial completion;
* cancellation;
* maximum batch size.

---

# 76. Incremental Recognition

Incremental OCR may recognize only changed or previously unresolved regions.

Incremental behavior shall preserve:

* source identity;
* region identity;
* previous result references;
* updated provenance.

Incremental processing shall not silently invalidate unrelated recognition results.

---

# 77. Cancellation

OCR Providers shall support cancellation where technically possible.

Cancellation semantics shall define:

* active task interruption;
* temporary artifact cleanup;
* partial result handling;
* remote request cancellation;
* batch behavior.

Partial results shall be marked explicitly.

---

# 78. Timeout

OCR execution shall support explicit timeouts.

Timeout policy may depend upon:

* page size;
* recognition mode;
* Provider;
* batch size;
* document type;
* execution locality.

Timeout shall produce a canonical failure.

---

# 79. Retry

Retries shall be controlled by Platform execution policy.

Retry may involve:

* same Provider;
* alternate mode;
* alternate preprocessing;
* alternate Provider;
* reduced region;
* language-specific model.

Providers shall not perform uncontrolled hidden retries.

---

# 80. Idempotency

OCR recognition should be idempotent with respect to the same immutable input, Provider Version, model, configuration and execution conditions where deterministic behavior is supported.

Equivalent executions may produce semantically equivalent results even when runtime metadata differs.

Idempotency guarantees shall be explicit.

---

# 81. OCR Failure Model

Typical canonical OCR failures include:

* InputUnsupported;
* LanguageUnsupported;
* ScriptUnsupported;
* HandwritingUnsupported;
* ModelUnavailable;
* ProviderUnavailable;
* AuthenticationFailed;
* PermissionDenied;
* InvalidImage;
* ImageTooLarge;
* ResolutionTooLow;
* RecognitionFailed;
* GeometryUnavailable;
* Timeout;
* Cancelled;
* RateLimited;
* ResourceExhausted;
* ExternalServiceFailure;
* PartialResultProduced.

Provider-specific failures shall be translated into canonical categories.

---

# 82. Partial Recognition

An OCR execution may return partial results.

The result shall distinguish:

* Complete;
* Partial;
* Cancelled;
* Failed Before Recognition;
* Failed After Partial Recognition.

Partial output shall never be silently treated as complete.

---

# 83. Recognition Validation

OCR Results shall be structurally validated before entering Import reconstruction.

Validation may include:

* valid coordinate system;
* valid geometry bounds;
* valid token hierarchy;
* confidence range validity;
* language identity validity;
* script identity validity;
* source reference integrity.

Semantic correctness remains a later concern.

---

# 84. Provider-Level Validation

Provider-level validation verifies concrete recognition result integrity.

The Import Engine may perform additional validation including:

* dictionary consistency;
* language consistency;
* reading-flow consistency;
* layout consistency;
* semantic consistency.

These responsibilities remain separate.

---

# 85. OCR Observability

OCR execution shall be observable.

Observable metadata may include:

* Provider Identity;
* Provider Version;
* model identity;
* recognition mode;
* page count;
* region count;
* language hints;
* detected languages;
* execution duration;
* confidence summary;
* partial-result status;
* failure category;
* execution locality;
* correlation metadata.

Raw recognized content shall not be logged by default.

---

# 86. Metrics

OCR Provider metrics may include:

* pages processed;
* regions processed;
* average duration;
* average confidence;
* low-confidence token count;
* failure rate;
* retry count;
* alternate Provider usage;
* local versus remote execution;
* correction rate;
* language usage;
* handwriting usage.

Metrics shall preserve user privacy.

---

# 87. Tracing

OCR execution may participate in local or distributed tracing.

A trace may represent:

```text
Import Request
    │
    ▼
Preprocessing
    │
    ▼
OCR Provider Selection
    │
    ▼
Recognition
    │
    ▼
Validation
    │
    ▼
Layout and Semantic Reconstruction
```

Tracing shall preserve correlation without requiring recognized text capture.

---

# 88. OCR Provider Invariants

The following invariants apply.

* OCR Providers belong to the Integration layer.
* OCR Providers implement public OCR Capability Contracts.
* The Import Engine never depends directly upon concrete OCR technologies.
* OCR Providers recognize evidence.
* OCR Providers never own canonical document meaning.
* OCR Providers never construct canonical UDM or DPM models directly.
* OCR Provider identity is distinct from OCR model identity.
* Provider-specific types never cross the Provider boundary.
* Recognition geometry uses an explicit coordinate system.
* Original confidence evidence is preserved.
* Confidence values from different Providers are not assumed directly comparable.
* Language and script are modeled separately.
* Printed-text support does not imply handwriting support.
* Reading-order hints are advisory.
* Table reconstruction remains outside OCR Providers.
* Caption association remains outside OCR Providers.
* Formula semantics remain subject to validation.
* OCR output is non-canonical until validated and integrated.
* Recognition provenance is mandatory.
* Execution locality is explicit.
* Remote processing is explicit.
* Transmission scope is minimal and explicit.
* Local-to-remote fallback never silently changes privacy behavior.
* Provider selection belongs to Platform policy.
* Partial recognition is never silently treated as complete.
* User corrections preserve original OCR evidence.
* OCR execution remains observable and reproducible.

---

# 89. Prohibited Behaviors

OCR Providers shall never:

* mutate canonical knowledge;
* create authoritative UDM nodes directly;
* create authoritative DPM nodes directly;
* classify document hierarchy as canonical truth;
* expose concrete OCR SDK types to Platform consumers;
* hide execution locality;
* transmit complete documents when only a region was authorized;
* discard geometry silently;
* discard original confidence silently;
* claim handwriting support based only on printed OCR support;
* treat language and script as equivalent;
* present heuristic reading order as authoritative;
* overwrite user corrections silently;
* log recognized private text by default;
* perform uncontrolled hidden retries;
* silently switch to a remote Provider;
* treat partial output as complete;
* erase recognition provenance.

---

# 90. Related Documents

* `ProviderModel.md`
* `AIProviders.md`
* `ExportProviders.md`
* `StorageProviders.md`
* `SyncProviders.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/Compatibility.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../02-Domain/DPM/Processing/LayoutAnalysis.md`
* `../../02-Domain/DPM/Layout/ReadingFlow.md`
* `../../02-Domain/DPM/Mapping/UDMMapping.md`
* `../../02-Domain/UDM/Processing/ProcessingPipeline.md`
* `../../02-Domain/KnowledgeObject/Provenance.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 91. Status

**Approved**

This document defines the architectural model for OCR Providers in KnowledgeOS.

OCR Providers integrate replaceable local, native, self-hosted and remote recognition technologies through stable OCR Capability Contracts.

They recognize text, geometry, language, script, orientation and confidence from observable document evidence.

They do not determine canonical document meaning, hierarchy or knowledge.

The Import Engine remains responsible for preprocessing orchestration, Provider selection, layout reconstruction, semantic interpretation, canonical model construction, validation and provenance integration.

OCR output is evidence.

Canonical knowledge is produced only after controlled reconstruction and validation.
