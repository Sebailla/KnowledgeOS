
# Plugin SDK Manifest

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Plugin SDK

**Document:** Manifest

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Manifest Model used by the KnowledgeOS Plugin SDK.

The Manifest is the canonical declarative description of a distributable extension.

It describes:

* what the extension is;
* which version it represents;
* what it provides;
* what it requires;
* where it participates;
* which permissions it requests;
* which environments it supports;
* which compatibility constraints apply;
* how its packaged artifacts are identified.

The Manifest describes an extension.

It never executes behavior.

---

# 2. Scope

This document governs:

* Manifest Identity;
* Manifest Versioning;
* Extension Identity;
* Extension Metadata;
* Extension Type;
* Capability Declarations;
* Contract Declarations;
* Extension Point Declarations;
* Dependency Declarations;
* Permission Declarations;
* Compatibility Declarations;
* Entry Point Metadata;
* Integrity Metadata;
* Manifest Validation.

This document does not govern:

* Plugin runtime lifecycle;
* extension implementation behavior;
* Provider execution;
* package installation;
* runtime activation;
* canonical knowledge;
* business state.

---

# 3. Definition of a Manifest

A Manifest is a machine-readable, declarative and versioned description of an extension package.

A Manifest provides sufficient metadata for KnowledgeOS to determine whether an extension package:

* can be identified;
* can be understood;
* can be validated;
* can be installed;
* can participate in approved Extension Points;
* can provide declared Capabilities;
* can operate within declared compatibility constraints.

A Manifest contains declarations.

It does not contain executable behavior.

---

# 4. Architectural Position

The Manifest exists between extension packaging and runtime validation.

```text
Extension Development
        │
        ▼
Implementation Artifacts
        │
        +
        ▼
Manifest
        │
        ▼
Extension Package
        │
        ▼
Validation
        │
        ▼
Plugin Engine
```

The Manifest provides declarative information.

The Plugin Engine interprets and validates that information according to approved architectural contracts.

---

# 5. Mission

The mission of the Manifest Model is to make extension identity, requirements and participation explicit before execution.

KnowledgeOS shall not need to execute extension code to discover fundamental extension metadata.

Core extension characteristics shall be statically inspectable.

---

# 6. Design Philosophy

The Manifest is declarative.

It shall describe facts and requirements.

It shall not:

* execute code;
* contain scripts;
* define runtime algorithms;
* perform capability resolution;
* activate extensions;
* mutate Platform state;
* contain canonical knowledge.

Declarative metadata enables validation before trust.

---

# 7. Manifest as Canonical Package Description

Every distributable extension package shall contain exactly one authoritative Manifest.

The Manifest is the canonical package-level description of the extension release.

Duplicate authoritative Manifests are prohibited.

Derived metadata may exist.

Authority remains with the package Manifest.

---

# 8. Manifest Schema

Every Manifest shall conform to an explicit Manifest Schema.

The Schema defines:

* required fields;
* optional fields;
* field types;
* structural constraints;
* version-specific semantics.

Manifest Schema versions shall be explicit.

A Manifest shall identify the Schema Version under which it was authored.

---

# 9. Manifest Schema Version

The Manifest Schema Version identifies the structure and semantics used to interpret a Manifest.

It is independent from:

* Extension Version;
* SDK Version;
* Contract Version;
* Capability Version;
* Extension Point Version.

Example conceptual model:

```text
Manifest Schema Version: 2
Extension Version: 4.3.1
SDK Compatibility: >=3.0 <4.0
```

These versions represent different architectural concerns.

---

# 10. Manifest Identity

A Manifest shall identify the extension release it describes.

The effective release identity is:

```text
Extension Identity
        +
Extension Version
```

The Manifest itself does not create a separate competing extension identity.

It describes the identified extension release.

---

# 11. Extension Identity

Every extension shall have a stable Extension Identity.

Extension Identity shall remain independent from:

* display name;
* package filename;
* installation path;
* distribution channel;
* runtime instance;
* user-facing localization.

Extension Identity represents the stable architectural identity of the extension.

---

# 12. Extension Version

Every extension release shall have an explicit Extension Version.

Extension Version identifies a specific release of the extension.

Two packages declaring the same:

```text
Extension Identity
        +
Extension Version
```

shall represent the same immutable release.

If package contents differ, package integrity validation shall detect the inconsistency.

---

# 13. Immutable Release Identity

Published extension releases are immutable.

Once an extension release has been distributed under a specific Extension Identity and Extension Version, its package contents shall not be silently replaced.

Changes require a new Extension Version.

This guarantees:

* reproducibility;
* integrity;
* traceability;
* deterministic package identification.

---

# 14. Extension Metadata

A Manifest may contain descriptive metadata.

Typical metadata includes:

* Name;
* Description;
* Author;
* Publisher;
* License;
* Documentation Reference;
* Source Reference;
* Support Reference.

Descriptive metadata supports discovery and presentation.

It does not define architectural behavior.

---

# 15. Human-Readable Name

An extension may declare a human-readable Name.

The Name:

* may be localized;
* may change between releases;
* may be presented to users.

The Name shall never replace Extension Identity.

---

# 16. Description

An extension may provide a human-readable Description.

The Description shall explain the extension's purpose.

It shall not be interpreted as a machine-readable capability declaration.

Machine behavior depends upon explicit structured metadata.

---

# 17. Author and Publisher

A Manifest may identify:

* Author;
* Publisher.

Author describes authorship.

Publisher identifies the entity responsible for distributing the package.

Publisher identity may participate in trust and signature verification.

Authorship alone does not imply trust.

---

# 18. Extension Type

Every extension shall declare an Extension Type.

Typical Extension Types may include:

* Plugin;
* Provider;
* Adapter;
* Connector;
* Composite Extension.

Extension Type supports classification.

It shall not replace explicit Capability or Extension Point declarations.

---

# 19. Plugin Type

A Plugin is a general deployable extension unit that participates in one or more approved Extension Points.

A Plugin may:

* provide Capabilities;
* require Capabilities;
* register Providers;
* subscribe to public Events;
* contribute Workflow Steps;
* participate in processing pipelines.

Plugin behavior remains governed by declared Contracts and Extension Points.

---

# 20. Provider Type

A Provider extension implements one or more approved Provider Contracts.

Examples include:

* AI Provider;
* OCR Provider;
* Storage Provider;
* Synchronization Provider;
* Export Provider.

Provider Type does not identify the specific Capability implemented.

Capabilities shall be declared explicitly.

---

# 21. Adapter Type

An Adapter extension bridges compatible external or internal representations through approved Contracts.

An Adapter shall not bypass architectural boundaries.

Adapters transform interaction.

They do not redefine canonical Domain semantics.

---

# 22. Connector Type

A Connector extension integrates KnowledgeOS with an external system or service.

A Connector may require:

* network access;
* authentication;
* external credentials;
* synchronization capabilities;
* remote execution capabilities.

External integration requirements shall be explicitly declared.

---

# 23. Composite Extension Type

A Composite Extension may provide multiple related extension roles within one package.

A Composite Extension shall still declare independently:

* every provided Capability;
* every required Capability;
* every Extension Point participation;
* every required permission;
* every dependency.

Composite packaging shall not hide architectural responsibilities.

---

# 24. Capability Declarations

The Manifest shall declare every Capability provided or required by the extension.

A Capability declaration shall identify:

* Capability Identity;
* Capability Version or Version Range;
* provision or consumption role;
* required Features when applicable;
* optional Features when applicable.

Undeclared Capabilities shall not be assumed.

---

# 25. Provided Capabilities

A provided Capability declaration states that the extension implements an approved Capability.

Conceptually:

```text
provides:
  - capability: AI.EmbeddingGeneration
    version: 1
```

A declaration alone does not prove conformance.

Runtime and package validation remain required.

---

# 26. Required Capabilities

A required Capability declaration states that the extension depends upon an architectural ability.

Conceptually:

```text
requires:
  - capability: Storage.ObjectAccess
    version: ">=1 <3"
```

Required Capabilities shall reference Capability identities.

They shall not reference concrete implementation brands unless an explicit architectural exception exists.

---

# 27. Optional Capability Dependencies

A Manifest may declare optional Capability dependencies.

Optional dependencies may enhance extension behavior.

Their absence shall not prevent activation unless the extension selects a mode that explicitly requires them.

Fallback semantics shall be documented.

---

# 28. Contract Declarations

The Manifest shall declare the public Contracts implemented or required by the extension when those Contracts are necessary for validation.

A Contract declaration may identify:

* Contract Identity;
* Contract Version or Version Range;
* implementation or consumption role.

Contract declarations support compatibility validation.

They do not redefine Contract semantics.

---

# 29. Implemented Contracts

An implemented Contract declaration states that the extension claims conformance with a specific public Contract.

Example:

```text
implements:
  - contract: AI.EmbeddingProvider
    version: 2
```

Conformance shall be validated according to the Contract Model.

---

# 30. Required Contracts

A required Contract declaration states that the extension depends upon a public Contract being available.

Required Contract dependencies shall be:

* explicit;
* versioned;
* compatible.

Private implementation contracts shall never appear in public Manifests.

---

# 31. Extension Point Declarations

The Manifest shall declare every Extension Point in which the extension intends to participate.

A declaration shall identify:

* Extension Point Identity;
* supported Version or Version Range;
* associated implementation reference;
* participation metadata when required.

Undeclared participation is prohibited.

---

# 32. Extension Point Participation

A participation declaration expresses intent.

It does not create an active Binding.

The lifecycle remains:

```text
Manifest Declaration
        │
        ▼
Validation
        │
        ▼
Compatibility Evaluation
        │
        ▼
Binding
        │
        ▼
Activation
```

The Manifest describes participation.

The runtime governs participation.

---

# 33. Participation Metadata

An Extension Point declaration may contain metadata required by the Extension Point Contract.

Examples may include:

* declared priority;
* processing stage;
* supported formats;
* supported Features;
* scope restrictions.

Participation metadata shall conform to the Extension Point definition.

Extensions shall not invent unsupported participation semantics.

---

# 34. Dependency Declarations

The Manifest shall explicitly declare extension-level dependencies.

Dependencies may include:

* required Capabilities;
* required Contracts;
* required SDK versions;
* required Extension Point versions;
* explicitly approved extension package dependencies.

Dependencies shall be machine-readable where practical.

---

# 35. Extension Package Dependencies

Direct dependencies upon another extension package shall be exceptional.

The preferred model is:

```text
Extension A
        │
        ▼
Required Capability
        │
        ▼
Capability Resolution
        │
        ▼
Compatible Implementation
```

Instead of:

```text
Extension A
        │
        ▼
Specific Extension B
```

Direct package dependencies shall require explicit architectural justification.

---

# 36. Required Dependencies

A required dependency must be satisfied before the extension can become active.

Unsatisfied required dependencies shall result in explicit activation failure or inactive state.

KnowledgeOS shall never silently ignore missing required dependencies.

---

# 37. Optional Dependencies

Optional dependencies may enhance extension behavior.

Their absence shall not prevent core extension operation.

The Manifest shall distinguish required and optional dependencies explicitly.

---

# 38. Dependency Version Ranges

Dependencies may declare supported Version Ranges.

Version ranges shall be:

* explicit;
* deterministic;
* compatible with the applicable versioning model.

Unbounded compatibility assumptions are discouraged.

---

# 39. Dependency Graph

Manifest dependencies contribute to the extension dependency graph.

The graph shall support:

* missing dependency detection;
* compatibility validation;
* cycle detection;
* activation planning;
* diagnostics.

Required dependency cycles are prohibited unless explicitly modeled through an approved orchestration mechanism.

---

# 40. Permission Declarations

The Manifest shall declare every permission required by the extension.

Typical permissions may include:

* Knowledge.Read;
* Knowledge.ProposeModification;
* Annotation.Read;
* Annotation.Create;
* FileSystem.Read;
* FileSystem.Write;
* Network.Access;
* ExternalService.Invoke;
* BackgroundExecution;
* Event.Subscribe.

Permission declarations shall follow least privilege.

---

# 41. Required Permissions

A required permission is necessary for a declared extension capability or participation.

Required permissions shall be traceable to:

* a provided Capability;
* a required Capability;
* an Extension Point;
* an external integration requirement.

Unjustified permissions shall fail architectural or security review.

---

# 42. Optional Permissions

An extension may declare optional permissions for optional functionality.

Denial of an optional permission shall disable only the functionality requiring that permission.

Optional permission denial shall not automatically disable unrelated extension capabilities.

---

# 43. Permission Scope

Permissions may be scoped.

Possible scopes include:

* Platform;
* Library;
* Workspace;
* User;
* Device;
* specific resource;
* Execution Context.

The Manifest may declare the maximum permission scope requested.

Runtime authorization determines the actual granted scope.

---

# 44. Declared Permissions and Granted Permissions

Declared permissions and granted permissions are distinct.

```text
Declared Permissions
        │
        ▼
Authorization Evaluation
        │
        ▼
Granted Permissions
```

The Manifest requests authority.

It does not grant authority.

---

# 45. Permission Expansion

An extension update that requests additional permissions shall trigger explicit reevaluation.

New permissions shall never be silently granted because an earlier version of the extension was trusted.

Permission expansion is a security-relevant compatibility change.

---

# 46. Compatibility Declarations

The Manifest shall declare the compatibility requirements necessary to evaluate the extension before activation.

Compatibility declarations may include:

* Manifest Schema Version;
* SDK Version Range;
* required Contract Versions;
* required Capability Versions;
* required Extension Point Versions;
* Platform compatibility constraints;
* execution environment requirements.

Compatibility shall be explicit.

---

# 47. SDK Compatibility

Every extension shall declare the supported Plugin SDK Version Range.

Example:

```text
sdk:
  version: ">=3.0 <4.0"
```

The declared range defines the SDK compatibility expectation.

Compatibility shall still be validated against required Contracts and Extension Points.

---

# 48. Platform Compatibility

An extension may declare Platform compatibility constraints when necessary.

Platform release compatibility shall not replace granular Contract and Capability compatibility.

The preferred model remains contract-based compatibility.

Platform version constraints should be used only when broader runtime assumptions genuinely require them.

---

# 49. Environment Requirements

The Manifest may declare execution environment requirements.

Examples include:

* supported operating systems;
* processor architecture;
* required hardware capabilities;
* minimum memory class;
* local model requirements;
* required external runtime.

Environment requirements shall be explicit.

They shall not be inferred from implementation failure.

---

# 50. Device Compatibility

Extensions may declare supported device classes.

Examples include:

* macOS;
* iPhone;
* iPad;
* Web-compatible runtime;
* server or remote execution environment.

Device compatibility shall reflect actual execution requirements.

A capability available on one device shall not automatically be assumed available on another.

---

# 51. Offline Characteristics

The Manifest may declare execution characteristics such as:

* Offline Capable;
* Online Required;
* Hybrid.

These declarations support Offline First execution policy.

An extension requiring network access shall not represent itself as fully offline-capable.

---

# 52. External Communication Declaration

Extensions communicating with external systems shall explicitly declare that requirement.

External communication metadata may identify:

* communication requirement;
* external service category;
* network permission requirement;
* authentication requirement.

The Manifest shall not contain secret credentials.

---

# 53. Entry Point Metadata

The Manifest may identify package entry points required to locate extension implementation artifacts.

Entry Point metadata describes location.

It does not execute the entry point.

An Entry Point declaration may identify:

* logical Entry Point name;
* implementation artifact reference;
* execution role;
* runtime binding metadata.

---

# 54. Entry Point Independence

Architectural semantics shall not depend upon a specific programming-language entry point format.

The Manifest Model defines the meaning of an Entry Point.

Language-specific SDK bindings define its technical representation.

---

# 55. Multiple Entry Points

An extension package may contain multiple Entry Points when required.

Examples may include:

* Provider Entry Point;
* Workflow Step Entry Point;
* background execution Entry Point;
* user interface contribution Entry Point.

Every Entry Point shall be associated with explicit declared responsibilities.

Unreferenced executable artifacts shall not automatically become extension Entry Points.

---

# 56. Entry Point Validation

Entry Point metadata shall be validated before activation.

Validation may verify:

* referenced artifact existence;
* supported runtime;
* declared role;
* associated Contract;
* associated Extension Point;
* integrity coverage.

Invalid Entry Points shall prevent affected participation from becoming active.

---

# 57. Integrity Metadata

The Manifest or extension package metadata shall support integrity verification.

Integrity metadata may include:

* package hash;
* artifact hashes;
* digital signature references;
* publisher identity;
* signature algorithm metadata.

Integrity metadata supports verification.

It does not independently establish trust.

---

# 58. Package Hash

A package may provide a cryptographic hash representing immutable package contents.

The hash shall be calculated according to an explicitly defined canonical package representation.

Equivalent package contents shall produce equivalent integrity results.

---

# 59. Artifact Integrity

Individual implementation artifacts may have integrity metadata.

Artifact integrity supports:

* corruption detection;
* tampering detection;
* reproducibility;
* diagnostics.

All executable artifacts shall be covered by package integrity policy.

---

# 60. Digital Signatures

Extension packages may support digital signatures.

A digital signature may verify:

* package integrity;
* publisher identity;
* release authenticity.

A valid signature does not automatically grant permissions or activation.

Trust and authorization remain separate decisions.

---

# 61. Manifest Integrity

The Manifest itself shall be covered by package integrity verification.

An attacker shall not be able to modify:

* permissions;
* dependencies;
* Capabilities;
* compatibility;
* Entry Points;

without invalidating package integrity.

---

# 62. Manifest Validation

Manifest validation shall occur before extension code is executed.

Validation includes:

* Schema validation;
* Identity validation;
* Version validation;
* Capability declaration validation;
* Contract declaration validation;
* Extension Point validation;
* dependency validation;
* permission validation;
* compatibility validation;
* Entry Point validation;
* integrity metadata validation.

Invalid Manifests shall prevent extension activation.

---

# 63. Structural Validation

Structural validation verifies conformity with the declared Manifest Schema Version.

It includes:

* required fields;
* field types;
* allowed structures;
* valid identifiers;
* valid Version Range syntax.

Structural validity does not imply semantic validity.

---

# 64. Semantic Validation

Semantic validation verifies whether Manifest declarations are architecturally coherent.

Examples include:

* declared Capability exists;
* declared Contract exists;
* Extension Point accepts the declared Contract;
* Capability and Contract versions are compatible;
* requested permissions are valid;
* dependencies are satisfiable.

Semantic validation is mandatory.

---

# 65. Cross-Declaration Validation

Manifest declarations shall be validated together.

Examples:

* a provided Capability shall correspond to an implemented Contract;
* Extension Point participation shall reference a compatible Contract;
* required permissions shall correspond to declared functionality;
* Entry Points shall correspond to declared extension responsibilities.

Individually valid declarations may still form an invalid Manifest when combined inconsistently.

---

# 66. Deterministic Validation

Given the same:

* extension package;
* Manifest;
* Manifest Schema Version;
* SDK version;
* Contract Registry;
* Capability Registry;
* Extension Point Registry;
* validation policy;

Manifest validation shall produce the same result.

Validation shall be deterministic and reproducible.

---

# 67. Validation Result

Manifest validation shall produce an explicit result.

A result may include:

* Valid;
* Invalid;
* Valid with Warnings;
* Compatibility Failure;
* Integrity Failure.

Validation results shall include actionable diagnostics.

---

# 68. Validation Does Not Imply Trust

A structurally and semantically valid Manifest does not automatically make an extension trusted.

Validation answers:

> Is this declaration coherent and compatible?

Trust evaluation answers:

> Should this package be permitted to execute?

These are distinct concerns.

---

# 69. Validation Does Not Imply Activation

A valid Manifest does not imply that the extension becomes active.

Activation may additionally require:

* successful package validation;
* trust evaluation;
* permission grant;
* dependency availability;
* compatible environment;
* Plugin Engine activation policy.

The Manifest describes eligibility.

The runtime decides activation.

---

# 70. Success Criteria

The Manifest Model is successful when KnowledgeOS can identify, inspect, validate and evaluate an extension package before executing extension code, using only explicit, machine-readable and versioned declarations about identity, capabilities, contracts, participation, dependencies, permissions, compatibility, entry points and integrity.

---



# 71. Configuration Declaration

An extension may declare configuration requirements through the Manifest.

Configuration declarations describe:

* configuration schema;
* required values;
* optional values;
* default values;
* validation rules;
* configuration scope;
* reload behavior.

The Manifest declares configuration structure.

It never stores runtime configuration state.

---

# 72. Configuration Schema

Every extension-specific configuration model shall be explicitly versioned.

A Configuration Schema may define:

* field identity;
* field type;
* validation constraints;
* required status;
* default value;
* visibility;
* sensitivity classification;
* scope.

Configuration Schemas shall remain independent from user interface implementation.

---

# 73. Configuration Scope

Extension configuration may exist within defined scopes.

Typical scopes include:

* Platform;
* Library;
* Workspace;
* User;
* Device;
* Execution Profile.

Configuration scope shall be explicit.

A configuration value defined for one scope shall not automatically apply to another.

---

# 74. Configuration Validation

Extension configuration shall be validated before the affected capability becomes active.

Validation may include:

* required field presence;
* type validation;
* value range validation;
* dependency validation;
* environment compatibility;
* Provider compatibility.

Invalid configuration shall prevent affected execution.

---

# 75. Configuration Defaults

An extension may declare default values.

Defaults shall:

* remain deterministic;
* remain documented;
* never weaken security;
* never silently enable external data transmission;
* never grant permissions.

Defaults are convenience values.

They are not authorization decisions.

---

# 76. Dynamic Configuration

The Manifest may declare whether specific configuration values support runtime reload.

Dynamic configuration semantics shall be explicit.

A configuration change may require:

* no restart;
* capability reload;
* extension restart;
* complete runtime restart.

The Manifest declares the requirement.

The Plugin Engine governs runtime application.

---

# 77. Secret References

Secrets shall never be embedded directly in the Manifest.

An extension requiring secrets shall declare Secret References or Secret Requirements.

Examples include:

* API credential requirement;
* OAuth token requirement;
* encryption key requirement;
* certificate requirement.

The Manifest declares that a secret is required.

It never contains the secret value.

---

# 78. Secret Scope

Secret requirements may define scope.

Typical scopes include:

* User;
* Workspace;
* Device;
* Provider Instance;
* Execution Context.

Secret scope shall follow least privilege.

A secret available in one scope shall not automatically become available in another.

---

# 79. Secret Access

Secret access shall occur only through approved secret-management Contracts.

An extension shall never:

* read another extension's secrets;
* enumerate unrelated secrets;
* write secrets into logs;
* include secrets in diagnostics;
* persist secrets in canonical knowledge.

Secret access shall remain auditable.

---

# 80. Localization Metadata

A Manifest may declare localization resources.

Localization metadata may identify:

* supported locales;
* localized names;
* localized descriptions;
* localized permission explanations;
* localized configuration labels.

Localization affects presentation only.

It shall never redefine architectural semantics.

---

# 81. Resource Declaration

An extension package may declare packaged resources.

Typical resources include:

* templates;
* schemas;
* static assets;
* model metadata;
* localized content;
* transformation definitions;
* documentation.

Resources shall be explicitly associated with extension responsibilities.

Unreferenced executable resources shall not become active automatically.

---

# 82. Resource Identity

Packaged resources may have stable logical identities.

Resource identity shall remain independent from:

* archive path;
* installation path;
* runtime extraction location.

Logical identity supports deterministic reference and integrity verification.

---

# 83. Resource Integrity

All packaged resources participating in extension behavior shall be covered by integrity verification.

Resource modification after publication shall invalidate the package integrity result.

Equivalent immutable extension releases shall contain equivalent verified resources.

---

# 84. Native Dependencies

An extension may declare native or environment-specific dependencies when required.

Examples include:

* operating system frameworks;
* processor-specific libraries;
* hardware acceleration;
* external runtimes;
* command-line tools.

Native dependencies shall be explicit.

They shall not be discovered only after execution failure.

---

# 85. External Runtime Dependencies

Extensions requiring an external runtime shall declare that dependency.

Examples may include:

* local model runtime;
* language runtime;
* container runtime;
* external process;
* remote execution service.

The dependency declaration shall include compatibility and health expectations where applicable.

---

# 86. Network Requirements

The Manifest may declare network requirements.

A network declaration may specify:

* network access required;
* network access optional;
* expected service category;
* offline fallback availability;
* local-network-only requirement;
* internet requirement.

Network declarations support informed authorization and execution policy.

---

# 87. External Endpoints

The Manifest may declare the categories of external Endpoints contacted by the extension.

Endpoint declarations shall not contain secret credentials.

They may contain:

* service category;
* protocol requirements;
* expected data exchange type;
* authentication requirement;
* privacy classification.

Runtime endpoint configuration remains separate.

---

# 88. Data Transmission Declaration

Extensions transmitting user data externally shall explicitly declare that behavior.

The declaration shall identify, at an architectural level:

* data category;
* destination category;
* purpose;
* persistence expectation;
* required permission.

External transmission shall never be hidden behind generic network permission alone.

---

# 89. Data Persistence Declaration

An extension may declare whether it persists operational data.

Persistence declarations may identify:

* data category;
* storage scope;
* retention expectations;
* deletion behavior;
* portability behavior.

Plugin operational data shall remain distinct from canonical knowledge.

---

# 90. Cache Declaration

An extension may declare runtime caches.

Cache declarations may describe:

* cache purpose;
* scope;
* invalidation expectations;
* persistence behavior;
* sensitivity classification.

Caches remain disposable.

They shall never become authoritative data stores.

---

# 91. Background Execution Declaration

Extensions requiring background execution shall declare that requirement.

The declaration may identify:

* background capability;
* expected duration;
* scheduling need;
* cancellation support;
* resource class;
* offline behavior.

Background execution requires explicit permission and runtime policy approval.

---

# 92. Scheduled Execution Declaration

An extension may declare scheduled execution requirements.

A scheduled execution declaration may specify:

* required Scheduler participation;
* trigger category;
* minimum frequency;
* maximum frequency;
* offline requirements;
* missed-execution behavior.

The Manifest declares requirements.

The Scheduler governs actual execution.

---

# 93. User Interface Contribution Declaration

An extension may declare approved user interface contributions.

Examples may include:

* command palette actions;
* settings panels;
* annotation tools;
* rendering controls;
* contextual actions.

User interface contribution shall occur only through explicit UI Extension Points.

Direct modification of application interfaces is prohibited.

---

# 94. User Interface Independence

The Manifest Model shall remain independent from specific user interface frameworks.

A UI contribution declaration describes architectural participation.

Platform-specific SDK bindings define technical realization.

An extension shall not require unrestricted access to application view hierarchies.

---

# 95. Update Metadata

A Manifest may declare update-related metadata.

Update metadata may include:

* previous supported versions;
* upgrade path;
* migration requirement;
* rollback compatibility;
* permission changes;
* dependency changes.

Update metadata supports safe lifecycle management.

---

# 96. Update Compatibility

An extension update shall be evaluated against:

* existing configuration;
* persisted Plugin data;
* previous permissions;
* active bindings;
* dependency graph;
* supported Contracts;
* supported Extension Points.

Update compatibility shall be explicit.

A newer version shall not be assumed compatible merely because it shares the same Extension Identity.

---

# 97. Permission Changes During Update

The Manifest shall make permission changes between extension versions detectable.

Permission changes may include:

* newly requested permissions;
* expanded scope;
* removed permissions;
* changed data transmission behavior.

Permission expansion requires explicit authorization reevaluation.

---

# 98. Capability Changes During Update

The Manifest shall make Capability changes between versions detectable.

Changes may include:

* new provided Capabilities;
* removed Capabilities;
* changed Capability Versions;
* new required Capabilities;
* changed Features.

Breaking Capability changes shall participate in compatibility evaluation.

---

# 99. Contract Changes During Update

Changes to implemented or required Contracts shall be explicit.

An update may require:

* new Contract Versions;
* deprecated Contract migration;
* compatibility adapters;
* revalidation.

Incompatible Contract changes shall prevent automatic activation.

---

# 100. Extension Point Changes During Update

Changes to Extension Point participation shall be detectable.

Examples include:

* new participation;
* removed participation;
* changed participation priority;
* changed scope;
* changed Version Range.

New participation may require new permissions or compatibility review.

---

# 101. Migration Declaration

An extension update may declare migrations.

Migration declarations may describe:

* source extension version range;
* target extension version;
* migrated data category;
* migration Entry Point;
* reversibility;
* failure semantics.

Migrations shall remain explicit and versioned.

---

# 102. Migration Execution

Migration code shall not execute during Manifest parsing.

The Manifest identifies migration requirements.

The Plugin Engine and Kernel coordinate migration execution through approved Contracts.

Migration failure shall leave the previous valid state recoverable when possible.

---

# 103. Configuration Migration

Configuration Schema changes may require configuration migration.

Migration shall preserve:

* existing valid values;
* secret references;
* scope;
* user intent.

Silent deletion of incompatible configuration is prohibited.

---

# 104. Plugin Data Migration

Operational Plugin data migrations shall remain separate from canonical knowledge migrations.

A Plugin shall never use an operational migration to modify canonical knowledge directly.

Canonical changes require approved Platform Commands.

---

# 105. Rollback Metadata

An extension may declare rollback compatibility.

Rollback metadata may identify:

* supported previous versions;
* irreversible migrations;
* retained compatibility state;
* rollback prerequisites.

Rollback safety shall never be assumed.

---

# 106. Removal Metadata

A Manifest may declare removal-related behavior.

Removal metadata may describe:

* operational data cleanup;
* retained data;
* export options;
* migration to replacement extension;
* external resource cleanup.

Removal shall never silently delete canonical knowledge.

---

# 107. Canonical Manifest Representation

KnowledgeOS shall define a canonical representation for Manifest processing.

Canonicalization ensures that semantically equivalent Manifest content produces equivalent:

* validation input;
* integrity input;
* comparison behavior;
* signing behavior.

Canonical representation is independent from authoring formatting.

---

# 108. Manifest Serialization

A Manifest may be serialized using an approved format.

The serialization format is an implementation concern.

The Manifest Model remains authoritative.

Serialization shall preserve:

* field identity;
* field type;
* Version semantics;
* ordering where semantically relevant;
* unknown-field behavior;
* integrity coverage.

---

# 109. Unknown Fields

Manifest Schema evolution shall define how unknown fields are handled.

Possible policies include:

* Ignore when explicitly allowed;
* Preserve;
* Reject.

Unknown-field behavior shall be version-specific and deterministic.

Silent reinterpretation is prohibited.

---

# 110. Field Ordering

Field ordering shall not affect Manifest semantics unless a specific ordered collection explicitly requires it.

Canonicalization shall define deterministic ordering for integrity and comparison purposes.

Authoring order shall not create hidden behavior.

---

# 111. Duplicate Fields

Duplicate singular fields are prohibited.

Duplicate entries in collections shall follow explicit identity and conflict rules.

Ambiguous duplicate declarations shall fail validation.

---

# 112. Default Materialization

Canonical processing may materialize declared Schema defaults.

Default materialization shall be deterministic.

The canonical Manifest representation shall distinguish when necessary between:

* explicitly declared value;
* Schema-derived default.

This distinction may be relevant for migration and diagnostics.

---

# 113. Manifest Comparison

KnowledgeOS may compare Manifests across extension versions.

Comparison may identify:

* identity changes;
* permission changes;
* Capability changes;
* Contract changes;
* Extension Point changes;
* dependency changes;
* environment changes;
* migration requirements.

Manifest comparison supports update review and security decisions.

---

# 114. Manifest Fingerprint

A canonical Manifest may produce a stable fingerprint.

The fingerprint may support:

* change detection;
* validation caching;
* diagnostics;
* integrity relationships.

A Manifest fingerprint does not replace complete package integrity verification.

---

# 115. Manifest Signing

The canonical Manifest representation may participate in digital signing.

Signing shall cover all security-relevant declarations, including:

* identity;
* version;
* permissions;
* Capabilities;
* Contracts;
* Extension Points;
* dependencies;
* Entry Points;
* integrity references.

Excluded fields shall be explicitly defined.

---

# 116. Signature Verification

Signature verification shall occur before trust-dependent decisions.

Verification may establish:

* integrity;
* signer identity;
* signature validity.

Signature verification does not establish:

* authorization;
* permission grant;
* compatibility;
* safe behavior.

These remain separate evaluations.

---

# 117. Publisher Trust

Publisher trust may be evaluated using:

* trusted publisher records;
* certificate chains;
* enterprise policy;
* explicit user approval;
* approved registries.

Trust policy belongs to security governance.

The Manifest carries publisher metadata.

It does not define trust policy.

---

# 118. Manifest Confidentiality

Manifests should not contain confidential information.

Manifests may be inspected before extension execution and may be visible during package discovery.

Secrets, private tokens and user-specific data are prohibited.

---

# 119. Manifest Security Review

Security review shall evaluate:

* permission scope;
* external communication;
* data transmission;
* secret requirements;
* background execution;
* Entry Points;
* native dependencies;
* update permission expansion;
* removal behavior.

A structurally valid Manifest may still fail security review.

---

# 120. Manifest Privacy Review

Privacy review shall evaluate:

* accessed data categories;
* transmitted data categories;
* external destinations;
* persistence behavior;
* retention expectations;
* optional and required permissions.

Privacy-relevant behavior shall be transparent before activation.

---

# 121. Manifest Observability

Manifest processing shall be observable.

Observable operations may include:

* parsing;
* structural validation;
* semantic validation;
* compatibility evaluation;
* integrity verification;
* trust evaluation;
* update comparison.

Observability shall not expose secrets because secrets are prohibited from the Manifest.

---

# 122. Manifest Diagnostics

Manifest diagnostics may identify:

* invalid field;
* missing required field;
* unknown Capability;
* incompatible Contract;
* unknown Extension Point;
* missing dependency;
* excessive permission;
* invalid Entry Point;
* unsupported environment;
* integrity failure.

Diagnostics shall be precise and actionable.

---

# 123. Manifest Error Model

Typical Manifest error categories include:

* UnsupportedManifestSchema;
* InvalidManifestStructure;
* InvalidExtensionIdentity;
* InvalidExtensionVersion;
* InvalidCapabilityDeclaration;
* InvalidContractDeclaration;
* InvalidExtensionPointDeclaration;
* InvalidDependency;
* InvalidPermission;
* IncompatibleSDK;
* IncompatiblePlatform;
* InvalidEntryPoint;
* IntegrityFailure;
* SignatureFailure.

Internal parser exceptions shall not become public error semantics.

---

# 124. Manifest Schema Evolution

Manifest Schemas shall evolve through explicit Schema Versions.

Preferred evolution mechanisms include:

* optional fields;
* additive structures;
* explicit feature flags;
* new Schema Versions.

Existing Schema semantics shall not be silently redefined.

---

# 125. Backward Schema Compatibility

KnowledgeOS may support older Manifest Schema Versions through:

* native parsing;
* compatibility translators;
* migration into a canonical representation.

Backward compatibility shall be explicit.

Unsupported Schema Versions shall produce an explicit error.

---

# 126. Forward Schema Compatibility

Forward compatibility may be supported only when unknown-field policy and semantic safety permit it.

A runtime shall not claim compatibility with a newer Schema Version when required semantics are unknown.

Safe rejection is preferred over incorrect interpretation.

---

# 127. Manifest Translation

Compatibility translators may convert supported Manifest Schema Versions into the current canonical representation.

Translation shall:

* be deterministic;
* preserve semantics;
* preserve security-relevant declarations;
* remain observable;
* record source Schema Version.

Translation shall not invent missing authority or permissions.

---

# 128. Manifest Deprecation

A Manifest Schema Version may become deprecated.

Deprecation shall define:

* replacement Schema Version;
* migration guidance;
* compatibility period;
* retirement policy.

Extensions shall be able to detect Schema deprecation through SDK tooling.

---

# 129. Manifest Schema Retirement

A retired Manifest Schema Version is no longer accepted for new extension activation.

Historical package metadata may remain readable for audit and migration purposes.

Retirement shall never destroy historical traceability.

---

# 130. Manifest Governance

Changes to the Manifest Model are governed architectural changes.

A new Manifest field shall be justified by:

* stable architectural meaning;
* machine-readable validation need;
* compatibility implications;
* security implications;
* long-term maintenance cost.

Implementation convenience alone does not justify public Manifest expansion.

---

# 131. Manifest Review

Manifest review shall evaluate:

* clarity;
* necessity;
* semantic ownership;
* compatibility;
* security;
* privacy;
* deterministic interpretation;
* canonicalization;
* validation feasibility.

Ambiguous declarations shall not be added to the Schema.

---

# 132. Commands

Typical Manifest-related Commands include:

* ValidateManifest;
* CanonicalizeManifest;
* CompareManifests;
* TranslateManifest;
* VerifyManifestSignature;
* GenerateManifestFingerprint.

Commands operate on Manifest artifacts and validation state.

They never activate extension behavior directly.

---

# 133. Events

Typical Manifest Events include:

* ManifestParsed;
* ManifestValidated;
* ManifestValidationFailed;
* ManifestCanonicalized;
* ManifestTranslated;
* ManifestSignatureVerified;
* ManifestIntegrityFailed;
* ManifestCompatibilityEvaluated.

Events describe completed Manifest processing facts.

---

# 134. Queries

Typical Manifest Queries include:

* GetManifestSchema;
* GetSupportedManifestSchemas;
* GetManifestValidationResult;
* GetManifestCompatibility;
* GetManifestPermissions;
* GetManifestCapabilities;
* GetManifestDependencies;
* GetManifestExtensionPoints;
* CompareManifestVersions.

Queries never modify extension runtime state.

---

# 135. Manifest Invariants

The following invariants apply:

* Every distributable extension package has exactly one authoritative Manifest.
* The Manifest is declarative.
* The Manifest never executes behavior.
* The Manifest never contains runtime business state.
* The Manifest never contains canonical knowledge.
* The Manifest never contains secret values.
* Every Manifest identifies its Schema Version.
* Every Manifest identifies exactly one Extension Identity and Extension Version.
* Published extension release identity is immutable.
* Every Capability provided or required is explicitly declared.
* Every Contract implemented or required is explicitly declared when required for validation.
* Every Extension Point participation is explicitly declared.
* Every required dependency is explicitly declared.
* Every requested permission is explicitly declared.
* Declared permissions do not grant permissions.
* Manifest validity does not imply trust.
* Manifest validity does not imply activation.
* Compatibility is explicitly declared and validated.
* Entry Points are declarative references.
* Unreferenced executable artifacts do not become active Entry Points.
* Integrity covers the Manifest and executable artifacts.
* External communication is explicitly declared.
* External data transmission is explicitly declared.
* Configuration structure is separate from configuration state.
* Secret requirements use references, never embedded values.
* Updates expose permission, Capability, Contract and participation changes.
* Migrations are explicit.
* Manifest interpretation is deterministic.
* Canonicalization is deterministic.
* Schema evolution is explicit.
* Unsupported semantic versions are never silently interpreted.
* Historical Manifest metadata remains traceable.

---

# 136. Prohibited Behaviors

A Manifest shall never:

* execute scripts;
* contain executable business logic;
* mutate Platform state;
* activate an extension;
* grant permissions;
* embed credentials;
* embed secret values;
* contain user canonical knowledge;
* expose private Engine internals;
* reference undocumented Extension Points;
* declare undeclared runtime behavior indirectly;
* hide external communication;
* hide external data transmission;
* silently expand permissions during update;
* use package filename as Extension Identity;
* use installation path as Extension Identity;
* silently replace immutable extension releases;
* depend upon authoring field order for behavior;
* permit ambiguous duplicate declarations;
* bypass Contract or Capability validation;
* bypass Plugin Engine lifecycle controls.

---

# 137. Related Documents

* SDKArchitecture.md
* Contracts.md
* Capabilities.md
* ExtensionPoints.md
* Compatibility.md
* `../Providers/ProviderModel.md`
* `../README.md`
* `../../04-Platform/Plugin/README.md`
* `../../03-Kernel/Configuration.md`
* `../../03-Kernel/DependencyInjection.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 138. Status

**Approved**

This document defines the Manifest Model used by the KnowledgeOS Plugin SDK.

The Manifest is the canonical, declarative, versioned and machine-readable description of an extension release.

It enables KnowledgeOS to inspect, validate, compare, secure and evaluate an extension package before executing extension code.

The Manifest declares identity, capabilities, contracts, Extension Point participation, dependencies, permissions, compatibility, configuration requirements, environment requirements, Entry Points, integrity and migration metadata.

It never executes behavior.

It never grants authority.

It never contains secrets or canonical knowledge.

A valid Manifest establishes declarative coherence.

Trust, authorization, activation and execution remain separate runtime decisions.
