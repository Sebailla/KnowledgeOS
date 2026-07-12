# Canonical Exchange

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Data Exchange

**Document:** Canonical Exchange

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Canonical Exchange Model used by KnowledgeOS for structured data interchange across external formats, systems, Providers, Plugins, APIs and KnowledgeOS installations.

The Canonical Exchange Model establishes a stable interoperability boundary between external representations and the internal canonical models of KnowledgeOS.

It defines:

* what may be exchanged;
* how exchange identity is represented;
* how content and metadata are packaged;
* how relationships are represented;
* how Assets are referenced;
* how provenance is preserved;
* how Versions are expressed;
* how extensions are carried;
* how integrity is verified;
* how compatibility is negotiated;
* how partial exchange is represented.

The Canonical Exchange Model is not the KnowledgeOS Domain Model.

It is not the Universal Document Model.

It is not the Document Presentation Model.

It is not a persistence model.

It is not a transport protocol.

It is an interoperability representation.

---

# 2. Scope

This document governs:

* Canonical Exchange Packages;
* Exchange Objects;
* Exchange Identity;
* Exchange Manifests;
* content representations;
* metadata representations;
* Asset exchange;
* relationship exchange;
* annotation exchange;
* provenance exchange;
* Version exchange;
* extension data;
* integrity metadata;
* compatibility metadata;
* partial exchange;
* incremental exchange;
* import and export symmetry;
* deterministic exchange;
* exchange validation.

This document does not govern:

* concrete import protocols;
* concrete export protocols;
* binary serialization syntax;
* transport protocols;
* HTTP semantics;
* GraphQL semantics;
* Local API transport;
* Provider-specific wire formats;
* internal Domain persistence;
* synchronization replication protocols.

---

# 3. Definition of Canonical Exchange

Canonical Exchange is the architecture-level representation used to transfer KnowledgeOS-compatible information between architectural boundaries.

It provides a common intermediate model for interoperability.

```text
External Format A
        │
        ▼
     Adapter
        │
        ▼
Canonical Exchange
        │
        ▼
     Adapter
        │
        ▼
External Format B
```

Canonical Exchange reduces direct format-to-format coupling.

Without a canonical exchange boundary, every format could require direct conversion to every other format.

```text
Format A ─────► Format B
    │              │
    ├────────────► Format C
    │              │
    └────────────► Format D
```

With Canonical Exchange:

```text
Format A ─┐
Format B ─┼──► Canonical Exchange ───► KnowledgeOS
Format C ─┤
Format D ─┘
```

and:

```text
KnowledgeOS
    │
    ▼
Canonical Exchange
    ├──► Format A
    ├──► Format B
    ├──► Format C
    └──► Format D
```

---

# 4. Architectural Position

Canonical Exchange belongs to the Integration layer.

```text
External System
        │
        ▼
Import / Export Protocol
        │
        ▼
Canonical Exchange Model
        │
        ▼
Mapping and Validation
        │
        ▼
Platform Contract
        │
        ▼
Domain Canonical Model
```

The Integration layer owns exchange representation.

The Domain layer owns canonical knowledge semantics.

The Platform layer owns operational processing.

The Kernel owns execution mechanisms.

---

# 5. Mission

The mission of Canonical Exchange is to provide a stable interoperability model that:

* isolates external formats;
* preserves user ownership;
* supports portability;
* preserves provenance;
* preserves identity where possible;
* avoids unnecessary information loss;
* supports deterministic processing;
* enables future format evolution;
* supports partial and incremental exchange;
* remains independent from storage technology.

---

# 6. Core Principle

The central principle is:

> Canonical Exchange is canonical for interoperability, not canonical for knowledge.

KnowledgeOS internal canonical authority remains governed by:

* Knowledge Object;
* UDM;
* DPM;
* Domain Identity;
* Domain Versioning;
* Provenance;
* Platform lifecycle.

An Exchange Package never becomes canonical merely because it was successfully parsed.

---

# 7. Exchange Boundary

Every external data exchange crosses an explicit boundary.

```text
External Data
    │
    ▼
Decode
    │
    ▼
Structural Validation
    │
    ▼
Canonical Exchange Representation
    │
    ▼
Semantic Validation
    │
    ▼
Domain Mapping
    │
    ▼
Platform Operation
```

The reverse direction is:

```text
Platform State
    │
    ▼
Public Projection
    │
    ▼
Canonical Exchange Representation
    │
    ▼
Exchange Validation
    │
    ▼
Encode
    │
    ▼
External Data
```

No external representation shall bypass this boundary when canonical exchange semantics are required.

---

# 8. Canonical Exchange Model

The Canonical Exchange Model is a versioned logical model composed of:

* Exchange Package;
* Manifest;
* Exchange Objects;
* Exchange Assets;
* Exchange Relationships;
* Exchange Annotations;
* Exchange Provenance;
* Extension Data;
* Integrity Metadata.

Conceptually:

```text
ExchangePackage
├── Manifest
├── Objects
├── Assets
├── Relationships
├── Annotations
├── Provenance
├── Extensions
└── Integrity
```

Not every package must contain every component.

Required components depend upon the exchange profile.

---

# 9. Exchange Package

An Exchange Package is the top-level unit of Canonical Exchange.

A package represents one bounded exchange operation.

It may contain:

* one Knowledge Object;
* multiple Knowledge Objects;
* an entire Library subset;
* annotations;
* Assets;
* relationships;
* metadata;
* provenance;
* incremental changes.

An Exchange Package shall have explicit identity and Version metadata.

---

# 10. Exchange Package Identity

Every Exchange Package shall have an Exchange Package Identity.

Package identity supports:

* tracing;
* duplicate detection;
* diagnostics;
* integrity;
* audit;
* incremental exchange;
* provenance.

Package Identity is not Knowledge Object Identity.

It identifies the exchange artifact or logical exchange unit.

---

# 11. Package Identity Properties

Package Identity shall be:

* globally unique within its intended scope;
* stable for the exact logical package;
* independent from filesystem path;
* independent from transport location;
* independent from temporary storage;
* opaque where appropriate.

Re-encoding the same logical package may preserve or regenerate Package Identity according to protocol semantics.

This behavior shall be explicit.

---

# 12. Exchange Manifest

Every complete Exchange Package shall contain a Manifest.

The Manifest describes the package itself.

Typical Manifest information includes:

* Package Identity;
* Exchange Model Version;
* Package Version;
* creation time;
* producer;
* producer Version;
* exchange profile;
* included components;
* root objects;
* dependencies;
* integrity metadata;
* extension declarations;
* compatibility requirements.

The Manifest is metadata about the exchange.

It is not metadata about a Knowledge Object unless explicitly mapped.

---

# 13. Exchange Model Version

Every package shall declare the Canonical Exchange Model Version it conforms to.

This Version governs:

* package structure;
* field semantics;
* identity semantics;
* relationship representation;
* Asset representation;
* extension rules;
* validation rules.

Exchange Model Version is distinct from:

* Knowledge Object Version;
* UDM Version;
* DPM Version;
* API Version;
* serialization format Version;
* application Version.

---

# 14. Package Version

A Package Version may identify revisions of the same logical Exchange Package.

Package Version is optional unless required by the exchange profile.

It shall not be confused with the Versions of objects contained within the package.

---

# 15. Exchange Profile

An Exchange Profile defines a constrained use of the Canonical Exchange Model.

Possible profiles may include:

* Knowledge Object Exchange;
* Library Exchange;
* Annotation Exchange;
* Portable Archive;
* Plugin Data Exchange;
* Incremental Exchange;
* Backup Exchange;
* Interoperability Exchange.

Profiles may define:

* required components;
* optional components;
* permitted extensions;
* validation rules;
* size constraints;
* compatibility requirements.

---

# 16. Profile Identity

Every Exchange Profile shall have:

* Profile Identity;
* Profile Version;
* description;
* required capabilities;
* validation rules.

Profile identity shall be stable.

Changing profile semantics incompatibly requires Version evolution.

---

# 17. Exchange Object

An Exchange Object represents one transferable logical object.

An Exchange Object may correspond to:

* Knowledge Object;
* document;
* collection;
* annotation set;
* metadata object;
* semantic entity;
* relationship container;
* another approved public concept.

Exchange Objects are public interoperability representations.

They are not direct serialized Domain objects.

---

# 18. Exchange Object Structure

An Exchange Object may contain:

* Exchange Object Identity;
* Object Type;
* Source Identity;
* Canonical Identity where export policy permits;
* Object Version;
* content;
* metadata;
* Asset references;
* relationships;
* provenance;
* extensions;
* integrity metadata.

The exact fields depend upon Object Type and profile.

---

# 19. Exchange Object Identity

Every Exchange Object shall have an identity within the package.

This identity supports:

* internal references;
* relationship targets;
* Asset association;
* annotation targets;
* deterministic mapping.

Exchange Object Identity may be package-local or globally stable according to the exchange profile.

---

# 20. Canonical Identity Preservation

When exporting KnowledgeOS objects, canonical identities may be preserved when:

* portability requires it;
* privacy policy allows it;
* collision semantics are defined;
* the destination can safely interpret them.

Canonical identity preservation shall never expose private implementation identifiers accidentally.

---

# 21. Source Identity

Imported objects may carry Source Identity.

Source Identity may represent:

* external system identity;
* source document identity;
* original URI;
* publication identifier;
* provider identifier;
* archive identifier.

Source Identity supports provenance and duplicate detection.

It does not automatically become KnowledgeOS canonical identity.

---

# 22. Identity Mapping

Import processing shall explicitly map:

```text
Exchange Identity
        │
        ▼
Identity Resolution
        │
        ├──► Existing Canonical Identity
        │
        └──► New Canonical Identity
```

Identity mapping shall be:

* deterministic where possible;
* observable;
* conflict-aware;
* provenance-preserving.

---

# 23. Identity Collision

An identity collision occurs when incoming identity information conflicts with existing canonical identity.

Possible outcomes include:

* merge;
* reject;
* create new identity;
* require user decision;
* create conflict state.

Collision policy belongs to Platform and Domain semantics.

Canonical Exchange only preserves the information required to evaluate it.

---

# 24. Object Type

Every Exchange Object shall declare a public Object Type.

Object Type shall describe interoperability semantics.

It shall not expose internal class names.

Examples may include:

* knowledge-object;
* document;
* collection;
* annotation-set;
* semantic-entity;
* asset-container.

Object Type evolution shall follow compatibility rules.

---

# 25. Content Representation

Exchange content may be represented as:

* structured content;
* textual content;
* binary Asset reference;
* canonical document projection;
* external format attachment;
* multiple representations.

The package shall identify the semantic role of each representation.

---

# 26. Multiple Representations

An Exchange Object may contain multiple representations of the same logical content.

Examples include:

* canonical structured representation;
* Markdown representation;
* original PDF;
* rendered HTML;
* thumbnail;
* OCR text.

Representations shall declare their relationship.

One representation shall not silently override another.

---

# 27. Primary Representation

An Exchange Profile may designate one representation as primary.

Primary representation means:

* preferred for the exchange purpose;
* not necessarily canonical within KnowledgeOS;
* not necessarily highest fidelity;
* not necessarily original source.

The designation shall be explicit.

---

# 28. Original Representation

An original source representation may be preserved as an Asset.

Examples include:

* original PDF;
* EPUB;
* image;
* web archive;
* imported Markdown file.

Preserving the original supports:

* provenance;
* reprocessing;
* reproducibility;
* future parser improvements;
* user ownership.

---

# 29. Structured Knowledge Representation

Structured knowledge may be exchanged through an approved public projection.

The projection may preserve:

* hierarchy;
* content nodes;
* semantic nodes;
* Assets;
* Anchors;
* relationships;
* metadata.

The exchange projection shall not be assumed identical to the internal UDM serialization.

---

# 30. UDM Exchange Projection

KnowledgeOS may define a public UDM-compatible exchange representation.

This representation shall:

* preserve approved UDM semantics;
* omit private implementation state;
* declare UDM Contract Version;
* support validation;
* support migration.

The internal UDM object graph shall not be serialized blindly.

---

# 31. DPM Exchange Projection

KnowledgeOS may exchange approved DPM presentation information.

This may include:

* Pages;
* Regions;
* Columns;
* Reading Flow;
* typography;
* visual hierarchy;
* spatial relationships;
* mapping Anchors.

DPM exchange shall declare the applicable DPM Contract Version.

---

# 32. UDM and DPM Independence

UDM and DPM projections remain logically distinct.

```text
Knowledge Semantics
        │
        ▼
       UDM

Presentation Semantics
        │
        ▼
       DPM
```

An Exchange Package may contain:

* UDM only;
* DPM only where meaningful;
* both UDM and DPM;
* neither, for other exchange profiles.

DPM shall not redefine UDM semantics.

---

# 33. Metadata Exchange

Exchange Objects may carry metadata.

Metadata may include:

* title;
* authorship;
* language;
* publication information;
* creation time;
* modification time;
* classification;
* tags;
* identifiers;
* rights information;
* custom metadata.

Metadata fields shall have explicit semantics.

---

# 34. Metadata Namespaces

Metadata may use namespaces to avoid collisions.

Namespaces may identify:

* KnowledgeOS canonical metadata;
* external standards;
* Provider metadata;
* Plugin metadata;
* custom user metadata.

Namespace identity shall be stable.

---

# 35. Metadata Preservation

Unknown metadata should be preserved when:

* preservation is safe;
* the exchange profile permits it;
* size limits permit it;
* privacy policy permits it.

Unknown metadata shall not automatically gain canonical semantic meaning.

---

# 36. Metadata Normalization

Import may normalize metadata.

Normalization may include:

* date normalization;
* language-tag normalization;
* identifier normalization;
* whitespace normalization;
* Unicode normalization.

Original values may be preserved when provenance or reversibility requires them.

---

# 37. Asset Exchange

Assets are transferable binary or external content resources associated with Exchange Objects.

Examples include:

* images;
* audio;
* video;
* PDFs;
* fonts where legally permitted;
* attachments;
* thumbnails;
* OCR source images;
* generated artifacts.

Assets shall have explicit identity and integrity metadata.

---

# 38. Exchange Asset

An Exchange Asset may contain:

* Asset Identity;
* media type;
* byte length;
* content hash;
* logical role;
* filename hint;
* embedded content;
* external reference;
* provenance;
* rights metadata.

Filename is descriptive metadata.

It is not Asset Identity.

---

# 39. Asset Identity

Asset Identity shall remain independent from:

* filename;
* filesystem path;
* temporary URL;
* object-store key.

Content-addressed identity may be used where appropriate.

---

# 40. Embedded Assets

An Asset may be embedded within an Exchange Package.

Embedded Assets support:

* portability;
* offline transfer;
* deterministic packaging;
* archival exchange.

Embedded content shall have integrity metadata.

---

# 41. Referenced Assets

An Exchange Package may reference external Assets when the profile permits it.

External references shall declare:

* reference URI or identifier;
* expected media type;
* expected integrity where available;
* availability assumptions;
* authorization requirements where applicable.

Referenced Assets reduce package size.

They reduce self-containment.

---

# 42. Self-Contained Package

A self-contained Exchange Package contains all required Assets for its intended interpretation.

A self-contained package should remain usable without access to its original source environment.

This property is particularly important for:

* portability;
* archival export;
* migration;
* backup;
* offline transfer.

---

# 43. Asset Integrity

Every embedded Asset should include a cryptographic content hash.

Integrity metadata may include:

* algorithm;
* digest;
* byte length;
* media type.

Integrity verification shall occur before canonical acceptance where required.

---

# 44. Duplicate Assets

Multiple Exchange Objects may reference the same Exchange Asset.

The package should avoid unnecessary duplication when identity and integrity permit shared reference.

Deduplication shall not alter logical ownership semantics.

---

# 45. Relationships

Exchange Objects may declare relationships.

A relationship shall define:

* Relationship Identity where applicable;
* relationship type;
* source;
* target;
* direction;
* metadata;
* provenance;
* Version where required.

Relationship semantics shall use public types.

---

# 46. Internal Relationships

An internal relationship connects objects within the same Exchange Package.

Targets may use Exchange Object Identity.

Internal references shall be resolvable during package validation.

---

# 47. External Relationships

An external relationship references an object outside the package.

The target may be represented by:

* canonical identity;
* source identity;
* URI;
* external identifier;
* unresolved reference.

External relationships may remain unresolved after import.

---

# 48. Unresolved Relationships

Canonical Exchange shall support unresolved relationships when the profile permits them.

An unresolved relationship shall preserve enough information for future resolution.

It shall not be silently discarded.

---

# 49. Relationship Integrity

A package shall distinguish:

* valid resolved relationship;
* valid unresolved relationship;
* broken internal reference;
* prohibited relationship.

Broken internal references shall fail validation unless explicitly permitted by the profile.

---

# 50. Annotation Exchange

Annotations may be exchanged as:

* standalone Exchange Objects;
* embedded object components;
* dedicated Annotation Exchange collections.

Annotation exchange shall preserve:

* Annotation Identity;
* target;
* Anchor;
* content;
* author information where permitted;
* timestamps;
* Version;
* provenance.

---

# 51. Annotation Anchors

Annotation Anchors shall use stable public representations.

Anchors may reference:

* UDM nodes;
* text ranges;
* spatial regions;
* Pages;
* Assets;
* semantic entities;
* external source locations.

Anchor semantics shall remain compatible with Domain and Annotation Engine contracts.

---

# 52. Anchor Degradation

Some destination formats may not preserve full Anchor precision.

Export shall identify degradation when:

* spatial Anchors become textual;
* structural Anchors become approximate;
* dynamic content cannot preserve exact location.

Degradation shall never be hidden.

---

# 53. Provenance

Canonical Exchange shall preserve provenance whenever available.

Provenance may identify:

* source system;
* source Resource;
* source format;
* original creator;
* importer;
* transformation;
* processing step;
* timestamp;
* software Version;
* Provider;
* AI involvement.

Provenance is essential for trust and reproducibility.

---

# 54. Provenance Chain

An Exchange Object may carry a provenance chain.

Conceptually:

```text
Original Source
    │
    ▼
Imported Representation
    │
    ▼
OCR
    │
    ▼
Structural Analysis
    │
    ▼
KnowledgeOS Canonical Model
    │
    ▼
Exchange Projection
```

Each transformation may contribute provenance metadata.

---

# 55. Transformation Record

A Transformation Record may include:

* Transformation Identity;
* operation type;
* input references;
* output references;
* tool or Provider;
* tool Version;
* parameters where safe;
* timestamp;
* deterministic status;
* warnings.

Sensitive parameters shall not be exposed unnecessarily.

---

# 56. AI Provenance

When AI materially contributes to exchanged content, provenance may record:

* AI-assisted transformation;
* model or Provider category;
* execution time;
* relevant processing profile;
* human review status where available.

Secret prompts, credentials and private Provider internals shall not be exposed automatically.

---

# 57. Rights and Licensing

Exchange Objects and Assets may include rights metadata.

Rights metadata may identify:

* copyright status;
* license;
* attribution requirements;
* redistribution constraints;
* source terms.

KnowledgeOS shall not interpret missing rights metadata as unrestricted permission.

---

# 58. Privacy Metadata

Exchange Profiles may include privacy classification.

Privacy metadata may indicate:

* private;
* shared;
* public;
* restricted;
* sensitive;
* externally sourced.

Privacy metadata supplements authorization.

It does not grant access by itself.

---

# 59. Version Exchange

Exchange Objects may carry Version information.

Version information may include:

* canonical object Version;
* source Version;
* exchange projection Version;
* revision;
* parent Version;
* timestamp.

These Version concepts shall remain distinct.

---

# 60. Version Lineage

Where applicable, exchange may preserve Version lineage.

Conceptually:

```text
Version A
    │
    ▼
Version B
    │
    ▼
Version C
```

or:

```text
        Version B1
       /
Version A
       \
        Version B2
```

Lineage preservation supports:

* history;
* merge;
* provenance;
* conflict analysis.

---

# 61. Snapshot Exchange

A Snapshot Exchange represents state at a defined logical point.

A snapshot shall define:

* snapshot identity;
* creation time;
* included scope;
* consistency model;
* root objects;
* Version context.

A snapshot is not automatically a backup.

---

# 62. Incremental Exchange

An Incremental Exchange contains changes relative to a known baseline.

It may include:

* created objects;
* updated objects;
* deleted objects;
* relationship changes;
* Asset additions;
* metadata changes.

The baseline shall be explicitly identified.

---

# 63. Baseline Identity

An incremental package shall identify the baseline it depends upon.

The baseline may be identified by:

* Package Identity;
* snapshot identity;
* Version vector;
* checkpoint;
* another approved stable reference.

Applying an incremental package to an incompatible baseline shall fail explicitly.

---

# 64. Change Representation

Changes may be represented as:

* full replacement objects;
* semantic patches;
* operation records;
* version transitions.

The selected representation shall be deterministic and versioned.

Generic untyped patches are discouraged.

---

# 65. Deletion Representation

Incremental exchange shall represent deletion explicitly.

Possible forms include:

* tombstone;
* deletion record;
* lifecycle transition.

Absence from an incremental package shall never imply deletion.

---

# 66. Tombstones

A tombstone may preserve:

* object identity;
* deletion time;
* deletion Version;
* provenance;
* deletion reason where appropriate.

Tombstones support deterministic replication and migration.

---

# 67. Partial Exchange

Canonical Exchange shall support partial packages.

A partial package may intentionally omit:

* Assets;
* relationships;
* history;
* DPM;
* annotations;
* optional metadata.

Omission shall be explicit.

---

# 68. Completeness Metadata

A package shall be able to declare its completeness.

Possible states may include:

* complete;
* partial;
* metadata-only;
* content-only;
* Assets-external;
* incremental.

Consumers shall not infer completeness from component absence alone.

---

# 69. Missing Data

The exchange model shall distinguish:

* intentionally omitted;
* unavailable;
* unsupported;
* redacted;
* unresolved;
* failed to export.

These states have different semantics.

---

# 70. Redaction

Exchange may intentionally redact information.

Redaction shall be represented explicitly where disclosure of redaction itself is permitted.

Redacted data shall not be represented as ordinary absence when that would alter meaning.

---

# 71. Exchange Extensions

Canonical Exchange shall support controlled extensibility.

Extensions may be defined by:

* KnowledgeOS;
* Plugin;
* Provider;
* external standard;
* organization.

Extensions shall use stable namespaces.

---

# 72. Extension Namespace

Every extension shall identify:

* namespace;
* extension identity;
* Version;
* owner;
* compatibility requirements.

Extension names shall not collide with canonical fields.

---

# 73. Extension Data

Extension data shall be:

* structurally bounded;
* namespace-scoped;
* serializable;
* size-limited;
* validation-aware.

Extension data shall not bypass canonical validation or security policy.

---

# 74. Unknown Extensions

Consumers may:

* preserve unknown extensions;
* ignore unknown optional extensions;
* reject unknown required extensions.

The package shall declare whether an extension is required for correct interpretation.

---

# 75. Required Extensions

A required extension means the package cannot be interpreted correctly without support for that extension.

Unsupported required extensions shall cause explicit compatibility failure.

---

# 76. Optional Extensions

Optional extensions may enrich the package without changing its core interpretation.

Unsupported optional extensions may be preserved or ignored according to profile policy.

---

# 77. Extension Promotion

An extension may later become part of the Canonical Exchange Model.

Promotion shall define:

* migration;
* namespace transition;
* compatibility;
* duplicate-field resolution;
* deprecation of the extension form.

Silent semantic takeover is prohibited.

---

# 78. Exchange Dependencies

An Exchange Package may depend upon external schemas, vocabularies or other packages.

Dependencies shall be explicit.

A dependency may include:

* identity;
* Version range;
* integrity;
* required or optional status;
* resolution information.

---

# 79. Dependency Resolution

Dependency resolution shall be:

* deterministic where possible;
* bounded;
* security-aware;
* observable.

Automatic retrieval of external dependencies shall follow network and privacy policy.

---

# 80. Circular Dependencies

Exchange Packages should avoid circular external dependencies.

Where unavoidable, identity resolution shall not require infinite recursive loading.

Dependency graphs shall be bounded.

---

# 81. Integrity Model

Canonical Exchange shall support integrity verification.

Integrity may cover:

* package;
* Manifest;
* Exchange Objects;
* Assets;
* individual representations.

Integrity metadata shall identify the algorithm used.

---

# 82. Package Integrity

A package may include a package-level integrity digest.

The digest shall define:

* canonicalization rules;
* included components;
* ordering;
* algorithm.

Package integrity shall not depend upon nondeterministic serialization.

---

# 83. Digital Signatures

Exchange Packages may support digital signatures.

A signature may establish:

* publisher identity;
* package integrity;
* provenance evidence.

A valid signature does not imply:

* trust;
* authorization;
* semantic validity;
* absence of malicious content.

---

# 84. Signature Scope

Signature metadata shall define exactly what was signed.

Possible scopes include:

* entire package;
* Manifest;
* selected objects;
* individual Assets.

Ambiguous signature scope is prohibited.

---

# 85. Trust Evaluation

Trust evaluation is distinct from signature verification.

```text
Signature Validity
        │
        ▼
Identity Evidence
        │
        ▼
Trust Policy
        │
        ▼
Authorization / Acceptance Decision
```

A cryptographically valid package may still be rejected.

---

# 86. Confidentiality

Canonical Exchange itself defines representation semantics.

Confidentiality may be provided by:

* encrypted package;
* encrypted transport;
* encrypted Asset;
* access-controlled container.

Encryption mechanisms shall be explicit and versioned.

---

# 87. Encrypted Content

Encrypted content shall declare enough metadata to identify:

* encryption scheme;
* key reference or resolution mechanism;
* encrypted component;
* integrity mechanism.

Secret keys shall never be embedded in the same unprotected package.

---

# 88. Compression

Exchange Packages may use compression.

Compression is a packaging or serialization concern.

It shall not change logical exchange semantics.

Consumers shall enforce decompression limits to prevent resource exhaustion.

---

# 89. Exchange Validation

Canonical Exchange validation occurs in stages.

```text
Package
    │
    ▼
Container Validation
    │
    ▼
Manifest Validation
    │
    ▼
Structural Validation
    │
    ▼
Reference Validation
    │
    ▼
Integrity Validation
    │
    ▼
Compatibility Validation
    │
    ▼
Semantic Validation
```

Passing one stage does not imply success at later stages.

---

# 90. Container Validation

Container validation verifies:

* package readability;
* expected structure;
* size limits;
* prohibited paths;
* duplicate entries;
* decompression safety.

Container validation occurs before semantic processing.

---

# 91. Manifest Validation

Manifest validation verifies:

* required fields;
* Exchange Model Version;
* profile;
* package identity;
* declared components;
* extension declarations;
* dependency declarations.

Invalid Manifest data shall fail explicitly.

---

# 92. Structural Validation

Structural validation verifies:

* required object fields;
* field types;
* object identities;
* allowed object types;
* representation structure;
* extension structure.

Structural validity does not imply semantic validity.

---

# 93. Reference Validation

Reference validation verifies:

* internal object references;
* Asset references;
* relationship targets;
* Annotation targets;
* dependency references.

Broken required internal references shall fail validation.

---

# 94. Integrity Validation

Integrity validation verifies:

* content hashes;
* byte lengths;
* package digest;
* signatures where required.

Integrity failure shall never be silently ignored.

---

# 95. Compatibility Validation

Compatibility validation verifies:

* Exchange Model Version;
* Profile Version;
* required extensions;
* required capabilities;
* serialization support;
* dependency compatibility.

Unsupported required semantics shall fail before canonical import.

---

# 96. Semantic Validation

Semantic validation verifies that structurally valid exchange information can be interpreted meaningfully.

Examples include:

* valid relationship types;
* valid Annotation Anchors;
* valid identity combinations;
* valid Version lineage;
* valid content-role combinations.

Semantic validation may require Platform or Domain knowledge.

---

# 97. Validation Result

Validation shall produce an explicit result.

A result may contain:

* valid;
* invalid;
* valid with warnings;
* compatible with degradation;
* incompatible;
* requires user decision.

Warnings shall not be hidden.

---

# 98. Import Mapping

A valid Exchange Package is mapped into Platform import contracts.

Conceptually:

```text
Canonical Exchange
        │
        ▼
Exchange Validation
        │
        ▼
Identity Resolution
        │
        ▼
Domain Mapping
        │
        ▼
Import Plan
        │
        ▼
Platform Execution
```

Validation alone does not modify canonical state.

---

# 99. Import Plan

Before canonical mutation, complex imports may produce an Import Plan.

An Import Plan may contain:

* objects to create;
* objects to update;
* identity matches;
* conflicts;
* missing dependencies;
* expected degradation;
* required user decisions;
* estimated resource use.

The Import Plan supports preview and deterministic execution.

---

# 100. Export Projection

Export begins from approved Platform state.

Conceptually:

```text
Canonical Knowledge
        │
        ▼
Export Scope Resolution
        │
        ▼
Public Projection
        │
        ▼
Canonical Exchange
        │
        ▼
Target Export Protocol
```

Internal objects shall not be serialized directly.

---

# 101. Export Scope

Export scope shall define what is included.

Scope may include:

* selected Knowledge Objects;
* collection;
* Library subset;
* annotations;
* Assets;
* Version history;
* relationships;
* provenance;
* presentation information.

Scope shall be explicit and reproducible.

---

# 102. Export Policy

Export policy may define:

* identity preservation;
* metadata inclusion;
* privacy redaction;
* Asset embedding;
* history inclusion;
* provenance inclusion;
* external reference handling;
* extension inclusion.

Policy shall be observable.

---

# 103. Import and Export Symmetry

Canonical Exchange should support meaningful import/export symmetry.

Symmetry means:

* exported information can be interpreted on re-import;
* identity semantics remain defined;
* provenance remains traceable;
* unsupported information loss is reported.

Perfect byte-for-byte round-trip is not always required.

Semantic round-trip expectations shall be explicit.

---

# 104. Round-Trip Fidelity

Round-trip fidelity may be classified.

Possible levels include:

* lossless;
* semantically equivalent;
* structurally equivalent;
* presentation-equivalent;
* degraded;
* unsupported.

The applicable fidelity level shall be known for each exchange path.

---

# 105. Lossless Exchange

Lossless exchange preserves all information required by the declared profile.

Lossless does not necessarily mean byte-identical serialization.

Logical equivalence is the relevant property unless the profile states otherwise.

---

# 106. Lossy Exchange

A lossy exchange intentionally cannot preserve all source semantics.

Loss shall be:

* identified;
* classified;
* reported;
* accepted according to policy.

Silent loss is prohibited.

---

# 107. Degradation Report

An exchange operation may produce a Degradation Report.

The report may identify:

* omitted content;
* unsupported metadata;
* simplified layout;
* unresolved relationships;
* lost Annotation precision;
* unavailable Assets;
* unsupported extensions.

The report is part of the exchange result.

---

# 108. Determinism

Canonical Exchange processing should be deterministic for equivalent inputs and configuration.

Determinism supports:

* reproducibility;
* testing;
* integrity;
* caching;
* deduplication;
* audit.

Nondeterministic transformations shall be identified.

---

# 109. Deterministic Ordering

Where logical collections are unordered, serialization may impose deterministic ordering for:

* hashing;
* signatures;
* comparison;
* reproducible exports.

Serialization ordering shall not create false Domain semantics.

---

# 110. Canonicalization

A canonicalization procedure may define deterministic representation for:

* hashing;
* signatures;
* equality;
* reproducibility.

Canonicalization is distinct from the Canonical Exchange Model itself.

---

# 111. Reproducibility

Given equivalent:

* canonical source state;
* export scope;
* exchange profile;
* configuration;
* deterministic dependencies;

KnowledgeOS should produce semantically equivalent Canonical Exchange output.

External timestamps or nondeterministic identifiers shall be controlled where reproducibility requires it.

---

# 112. Idempotent Import

Import of the same package should be idempotent when the applicable profile and identity policy support it.

Repeated import shall not create uncontrolled duplicates.

Idempotency may depend upon:

* Package Identity;
* Exchange Object Identity;
* canonical identity;
* source identity;
* import policy.

---

# 113. Import Replay

Replaying an import shall produce one of:

* same canonical result;
* no-op;
* explicit update;
* explicit conflict;
* explicit incompatibility.

Uncontrolled duplicate creation is prohibited.

---

# 114. Export Idempotency

Equivalent export requests may produce semantically equivalent packages.

Exact Package Identity reuse depends upon export policy.

The distinction between:

* logical export identity;
* generated artifact identity;
* package instance identity;

shall remain explicit.

---

# 115. Large Exchange Packages

Large packages shall support bounded processing.

Possible techniques include:

* streaming;
* chunking;
* staged validation;
* incremental extraction;
* temporary storage;
* asynchronous Operations.

The complete package shall not be required in memory unless bounded and justified.

---

# 116. Streaming Exchange

Streaming exchange may process components incrementally.

Streaming shall preserve:

* validation order;
* identity resolution;
* integrity;
* cancellation;
* error reporting;
* partial-state safety.

Canonical mutation shall not occur prematurely when atomic validation is required.

---

# 117. Chunked Exchange

Large exchange content may be divided into chunks.

Chunks shall define:

* Package Identity;
* chunk identity;
* sequence or dependency;
* integrity;
* completeness;
* reassembly rules.

Missing chunks shall be detected explicitly.

---

# 118. Exchange Checkpointing

Long-running exchange processing may create checkpoints.

A checkpoint may preserve:

* validated components;
* processed objects;
* identity mappings;
* Asset state;
* progress;
* errors.

Checkpointing shall not make partially validated content canonical automatically.

---

# 119. Cancellation

Exchange processing may be cancelable.

Cancellation shall define:

* completed work;
* temporary state cleanup;
* retained checkpoint;
* canonical mutation state;
* resumability.

Cancellation shall not leave ambiguous canonical state.

---

# 120. Recovery

Exchange processing shall support recovery where practical.

Recovery may resume from:

* validated package;
* checkpoint;
* staged Assets;
* completed mapping phase.

Recovery shall preserve deterministic semantics.

---

# 121. Exchange Security

Canonical Exchange shall be treated as untrusted input when imported.

Security concerns include:

* malformed structures;
* decompression bombs;
* path traversal;
* oversized content;
* malicious Assets;
* recursive references;
* dependency attacks;
* signature spoofing;
* extension abuse;
* parser vulnerabilities.

Validation and isolation are mandatory.

---

# 122. Path Traversal Prevention

Exchange containers shall never be allowed to write arbitrary filesystem paths.

Package entry paths shall be:

* normalized;
* validated;
* bounded to staging storage;
* independent from canonical Resource identity.

Absolute and traversal paths shall be rejected.

---

# 123. Resource Exhaustion Protection

Exchange processing shall enforce limits for:

* package size;
* object count;
* Asset count;
* Asset size;
* nesting depth;
* relationship count;
* extension size;
* decompression ratio;
* dependency depth.

Limits may depend upon profile and environment.

---

# 124. Malicious Content

Assets may contain malicious content.

KnowledgeOS shall not assume that a structurally valid package contains safe files.

Asset handling may require:

* sandboxing;
* media validation;
* safe decoding;
* malware scanning where available;
* execution prohibition.

---

# 125. Active Content

Exchange Packages shall not execute embedded active content automatically.

Scripts, macros, executables and active documents shall be treated according to explicit security policy.

Importing content is not permission to execute it.

---

# 126. External References

External references may create privacy and security risks.

Automatic resolution may:

* reveal user IP address;
* transmit identifiers;
* access untrusted content;
* trigger authentication;
* create tracking requests.

External reference resolution shall follow explicit policy.

---

# 127. Network Isolation

Package validation should not require network access unless the profile explicitly permits dependency or external reference resolution.

Offline validation shall remain possible for self-contained packages.

---

# 128. Privacy

Exchange may expose private knowledge.

Export shall enforce:

* authorization;
* scope;
* redaction policy;
* external transmission policy;
* Asset inclusion policy.

Import shall not silently transmit imported content externally.

---

# 129. Data Minimization

Exchange Packages should contain only information required by the selected scope and profile.

Internal operational metadata shall not be included merely because it exists.

---

# 130. Secret Exclusion

Exchange Packages shall never include secret material by default.

Examples include:

* passwords;
* API keys;
* refresh tokens;
* private keys;
* Provider credentials;
* encryption master keys;
* internal authentication tokens.

Secret references shall be handled through dedicated secure mechanisms.

---

# 131. Exchange Observability

Every significant exchange operation shall be observable.

Observable metadata may include:

* Package Identity;
* Exchange Model Version;
* profile;
* source;
* destination;
* object count;
* Asset count;
* total size;
* validation result;
* degradation count;
* duration;
* result;
* correlation identity.

Private content shall not be logged by default.

---

# 132. Exchange Metrics

Metrics may include:

* packages imported;
* packages exported;
* objects exchanged;
* Assets exchanged;
* bytes processed;
* validation failures;
* compatibility failures;
* integrity failures;
* identity conflicts;
* degradation events;
* average processing time;
* cancellation;
* recovery;
* idempotent replay detection.

---

# 133. Exchange Tracing

Exchange processing may participate in tracing.

A trace may represent:

```text
Exchange Input
    │
    ▼
Decode
    │
    ▼
Validate
    │
    ▼
Resolve Identity
    │
    ▼
Map
    │
    ▼
Platform Operation
    │
    ▼
Exchange Result
```

Trace payload capture shall remain privacy-safe.

---

# 134. Exchange Audit

Security-sensitive or significant exchange operations may produce audit records.

Audit metadata may include:

* Principal;
* Application Identity;
* Package Identity;
* profile;
* scope;
* source or destination class;
* result;
* degradation;
* timestamp;
* correlation identity.

Audit shall not include unnecessary exchanged content.

---

# 135. Canonical Exchange Commands

Typical Commands associated with Canonical Exchange include:

* ValidateExchangePackage;
* CreateExchangePackage;
* ResolveExchangeIdentity;
* CreateImportPlan;
* ExecuteImportPlan;
* CreateExportProjection;
* VerifyExchangeIntegrity;
* CancelExchangeOperation.

These Commands are executed through Platform contracts.

Canonical Exchange itself does not execute business logic.

---

# 136. Canonical Exchange Queries

Typical Queries include:

* GetExchangePackageManifest;
* GetExchangeCompatibility;
* GetExchangeValidationResult;
* GetExchangeProfile;
* ListExchangeProfiles;
* GetImportPlan;
* GetExchangeDegradationReport;
* CheckExchangeDependency.

Queries never modify canonical state.

---

# 137. Canonical Exchange Events

Typical Events include:

* ExchangePackageValidated;
* ExchangePackageRejected;
* ExchangeIntegrityVerified;
* ExchangeIntegrityFailed;
* ImportPlanCreated;
* ExchangeIdentityResolved;
* ExchangeConflictDetected;
* ExchangeDegradationDetected;
* ExchangePackageCreated;
* ExchangeOperationCompleted.

Events describe completed exchange facts.

---

# 138. Relationship to Import Protocols

`ImportProtocols.md` defines how external data enters the Canonical Exchange boundary.

```text
External Input
    │
    ▼
Import Protocol
    │
    ▼
Canonical Exchange
```

Import protocols shall not redefine Canonical Exchange semantics.

---

# 139. Relationship to Export Protocols

`ExportProtocols.md` defines how Canonical Exchange representations are delivered to external targets.

```text
Canonical Exchange
    │
    ▼
Export Protocol
    │
    ▼
External Output
```

Export protocols shall not expose internal Domain objects directly.

---

# 140. Relationship to Serialization

`Serialization.md` defines how Canonical Exchange logical structures are encoded.

```text
Canonical Exchange Model
        │
        ▼
Serialization
        │
        ▼
Bytes / Files / Messages
```

Serialization is representation encoding.

It is not semantic ownership.

---

# 141. Relationship to Synchronization

Canonical Exchange and synchronization are related but distinct.

Canonical Exchange transfers bounded representations.

Synchronization coordinates ongoing state convergence.

```text
Canonical Exchange
    │
    └── Bounded interoperability representation.

Synchronization
    │
    └── Ongoing state convergence protocol.
```

Synchronization may use exchange representations.

It shall not be reduced automatically to import/export.

---

# 142. Relationship to Backup

Backup and Canonical Exchange are also distinct.

A portable Exchange Package may support backup-like use.

A backup may additionally require:

* exact storage state;
* recovery metadata;
* encryption metadata;
* operational state;
* checkpoints.

Portability and disaster recovery are different goals.

---

# 143. Canonical Exchange Invariants

The following invariants apply.

* Canonical Exchange belongs to the Integration layer.
* Canonical Exchange is canonical for interoperability, not canonical for knowledge.
* The Domain Model remains the owner of canonical knowledge semantics.
* Exchange Objects are not serialized internal Domain objects.
* Exchange identity is distinct from canonical Domain identity.
* Package Identity is distinct from contained Object Identity.
* Exchange Model Version is distinct from API, UDM, DPM and serialization Versions.
* Every complete package has an explicit Manifest.
* Every Exchange Object has explicit identity within its exchange scope.
* External identity never becomes canonical identity implicitly.
* Identity collisions are handled explicitly.
* Original representations may be preserved without becoming canonical.
* UDM and DPM exchange projections remain logically distinct.
* Assets have identity independent from filename and path.
* Broken required internal references fail validation.
* Unresolved external references may be preserved explicitly.
* Provenance is preserved whenever available.
* AI-assisted transformation may be represented in provenance.
* Incremental exchange always identifies its baseline.
* Absence from an incremental package never implies deletion.
* Partial exchange declares its incompleteness.
* Redaction is distinct from ordinary absence.
* Extensions are namespace-scoped and versioned.
* Unsupported required extensions cause explicit compatibility failure.
* Integrity verification is distinct from trust evaluation.
* Signature validity does not imply authorization or semantic validity.
* Validation occurs before canonical acceptance.
* Successful parsing does not imply semantic validity.
* Successful validation does not itself mutate canonical state.
* Import and export operate through explicit Platform contracts.
* Lossy exchange reports degradation.
* Exchange processing is deterministic where required.
* Repeated import does not create uncontrolled duplicates when identity semantics support idempotency.
* Large packages are processed with bounded resources.
* Imported packages are treated as untrusted input.
* Embedded active content is never executed automatically.
* External references are not resolved silently when privacy may change.
* Secret material is excluded by default.
* Exchange operations remain observable and auditable where required.

---

# 144. Prohibited Behaviors

Canonical Exchange shall never:

* become a second Domain Model;
* replace the UDM;
* replace the DPM;
* become the canonical Source of Truth;
* expose database rows directly;
* expose internal Engine objects;
* expose private Kernel objects;
* use filesystem paths as canonical identity;
* treat filenames as Asset identity;
* convert external identity into canonical identity implicitly;
* silently merge identity collisions;
* silently discard unresolved relationships;
* silently discard unsupported metadata when preservation is possible;
* silently degrade content;
* treat package absence as deletion in incremental exchange;
* allow extensions to overwrite canonical fields;
* ignore unsupported required extensions;
* ignore integrity failures;
* equate valid signature with trust;
* execute embedded active content automatically;
* allow package paths to escape staging storage;
* perform unrestricted network access during validation;
* include secrets by default;
* mutate canonical state during structural validation;
* serialize internal Domain objects directly for export;
* deserialize external data directly into mutable Domain objects;
* bypass Platform import or export contracts.

---

# 145. Related Documents

* `ImportProtocols.md`
* `ExportProtocols.md`
* `Serialization.md`
* `../PublicAPI/APIConventions.md`
* `../PublicAPI/Versioning.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/Compatibility.md`
* `../Providers/ProviderModel.md`
* `../../04-Platform/Import/README.md`
* `../../04-Platform/Export/README.md`
* `../../04-Platform/Knowledge/README.md`
* `../../04-Platform/Library/README.md`
* `../../04-Platform/Sync/README.md`
* `../../02-Domain/DomainModel.md`
* `../../02-Domain/KnowledgeObject/KnowledgeObject.md`
* `../../02-Domain/KnowledgeObject/Identity.md`
* `../../02-Domain/KnowledgeObject/Provenance.md`
* `../../02-Domain/KnowledgeObject/Versioning.md`
* `../../02-Domain/UDM/UDM.md`
* `../../02-Domain/DPM/DPM.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 146. Status

**Approved**

This document defines the Canonical Exchange Model of KnowledgeOS.

Canonical Exchange provides the stable interoperability boundary through which KnowledgeOS-compatible information can move between external formats, systems, Providers, Plugins, APIs and KnowledgeOS installations.

It preserves identity, provenance, relationships, Assets, Versions and extension information without exposing internal implementation models.

It supports complete, partial, incremental, lossless and explicitly degraded exchange.

It remains independent from transport, serialization technology and persistence.

Canonical Exchange is the common language of interoperability.

It is never the canonical owner of knowledge.
