# Plugin SDK Compatibility

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Plugin SDK

**Document:** Compatibility

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the compatibility model used by the KnowledgeOS Plugin SDK.

Compatibility determines whether an extension can be understood, validated, installed, bound and executed safely within a specific KnowledgeOS environment.

Compatibility is explicit.

It is multi-dimensional.

It is never inferred from version numbers alone.

---

# 2. Scope

This document governs compatibility across:

* Plugin SDK Versions;
* Manifest Schema Versions;
* Contract Versions;
* Capability Versions;
* Extension Point Versions;
* Platform Versions;
* extension package versions;
* execution environments;
* dependencies;
* permissions;
* runtime Features.

This document does not govern:

* extension implementation quality;
* business correctness;
* Provider selection policy;
* Plugin activation policy;
* runtime performance;
* user trust decisions.

---

# 3. Definition of Compatibility

Compatibility is the validated ability of two or more architectural elements to interact according to their declared semantics and constraints.

Compatibility requires more than structural similarity.

It requires agreement across:

* identity;
* version;
* semantics;
* Contracts;
* Capabilities;
* permissions;
* dependencies;
* execution environment;
* lifecycle state.

Two components are compatible only when every required compatibility dimension is satisfied.

---

# 4. Architectural Position

Compatibility evaluation occurs before runtime participation.

```text
Extension Package
        │
        ▼
Manifest Validation
        │
        ▼
Compatibility Evaluation
        │
        ▼
Dependency Validation
        │
        ▼
Permission Evaluation
        │
        ▼
Binding Eligibility
        │
        ▼
Runtime Activation
```

Compatibility is necessary for activation.

It is not sufficient by itself.

---

# 5. Mission

The mission of the Compatibility Model is to preserve ecosystem stability while allowing KnowledgeOS and its extensions to evolve independently.

Internal implementations may change.

Public semantics remain protected.

---

# 6. Design Philosophy

Compatibility shall be:

* explicit;
* semantic;
* deterministic;
* observable;
* reproducible;
* version-aware;
* conservative.

Safe rejection is preferred over incorrect execution.

---

# 7. Compatibility Dimensions

KnowledgeOS evaluates compatibility across several independent dimensions.

```text
Extension Compatibility
│
├── Manifest Compatibility
├── SDK Compatibility
├── Contract Compatibility
├── Capability Compatibility
├── Extension Point Compatibility
├── Platform Compatibility
├── Dependency Compatibility
├── Permission Compatibility
└── Environment Compatibility
```

Failure in any required dimension produces incompatibility.

---

# 8. Compatibility Result

Compatibility evaluation produces an explicit result.

Typical results include:

* Compatible;
* Compatible with Warnings;
* Compatible through Adapter;
* Partially Compatible;
* Incompatible;
* Indeterminate.

An Indeterminate result shall never be treated as Compatible automatically.

---

# 9. Compatibility Context

Compatibility is evaluated within an explicit context.

The context may include:

* installed Platform Version;
* available SDK Version;
* active Contract Registry;
* active Capability Registry;
* active Extension Point Registry;
* installed dependencies;
* granted permissions;
* device characteristics;
* operating system;
* execution profile;
* connectivity state.

Compatibility without context is incomplete.

---

# 10. Semantic Compatibility

Semantic compatibility means that interacting components preserve the declared meaning of their operations.

Semantic evaluation considers:

* operation responsibility;
* input meaning;
* output meaning;
* success semantics;
* failure semantics;
* permission semantics;
* lifecycle semantics;
* execution guarantees.

Matching structure does not guarantee matching meaning.

---

# 11. Structural Compatibility

Structural compatibility determines whether exchanged representations conform to expected shapes and types.

Structural compatibility may validate:

* required fields;
* field types;
* collection structure;
* identifiers;
* serialization format;
* Version syntax.

Structural compatibility is necessary.

It is not sufficient for semantic compatibility.

---

# 12. Behavioral Compatibility

Behavioral compatibility determines whether an implementation behaves according to the guarantees declared by its Contracts and Capabilities.

Behavioral evaluation may include:

* required operations;
* deterministic behavior where required;
* idempotency semantics;
* cancellation behavior;
* timeout behavior;
* failure behavior;
* result guarantees.

Behavioral incompatibility shall prevent execution.

---

# 13. SDK Compatibility

SDK compatibility determines whether an extension can interact with the public development surface exposed by the installed KnowledgeOS runtime.

The Manifest shall declare a supported SDK Version Range.

Compatibility evaluation verifies:

* supported SDK Version;
* required public types;
* required SDK Features;
* required validation semantics;
* required packaging semantics.

A matching SDK major version alone does not guarantee compatibility.

---

# 14. SDK Version Range

An extension shall declare an explicit supported SDK Version Range.

Conceptually:

```text
sdk:
  version: ">=3.0 <4.0"
```

Unbounded Version Ranges are discouraged.

Version Range interpretation shall be deterministic.

---

# 15. Manifest Schema Compatibility

Manifest Schema compatibility determines whether KnowledgeOS can interpret the extension Manifest safely.

Evaluation verifies:

* supported Manifest Schema Version;
* known required fields;
* unknown-field policy;
* canonicalization rules;
* security-relevant declarations;
* translation availability.

Unsupported Manifest semantics shall produce incompatibility.

---

# 16. Manifest Translation Compatibility

A supported Manifest Compatibility Translator may convert an older Schema Version into the current canonical representation.

Translation is compatible only when it preserves:

* identity;
* permissions;
* Capabilities;
* Contracts;
* Extension Point declarations;
* dependencies;
* integrity semantics;
* security semantics.

Translation shall never invent missing permissions or authority.

---

# 17. Contract Compatibility

Contract compatibility determines whether an extension and KnowledgeOS share mutually supported public interaction semantics.

Evaluation considers:

* Contract Identity;
* Contract Version;
* operation semantics;
* inputs;
* outputs;
* errors;
* permissions;
* execution guarantees;
* serialization.

Incompatible Contract Versions shall never be silently substituted.

---

# 18. Contract Version Negotiation

When multiple Contract Versions are supported, negotiation identifies a mutually compatible version.

A typical policy may prefer:

1. explicitly requested compatible version;
2. highest mutually compatible stable version;
3. approved Compatibility Adapter;
4. explicit incompatibility.

Negotiation shall be deterministic.

---

# 19. Contract Adapter Compatibility

A Compatibility Adapter may bridge two supported Contract Versions.

Adapter compatibility requires:

* explicit supported source version;
* explicit supported target version;
* preserved semantics;
* known limitations;
* observable adaptation.

An Adapter shall not claim compatibility when semantics cannot be preserved.

---

# 20. Capability Compatibility

Capability compatibility determines whether an extension requirement can be satisfied by an available Capability definition and implementation.

Evaluation considers:

* Capability Identity;
* Capability Version;
* required Contracts;
* required Features;
* dependencies;
* permissions;
* lifecycle state;
* implementation availability.

Capability existence does not guarantee runtime availability.

---

# 21. Capability Feature Compatibility

A Capability implementation may expose optional Features.

Compatibility evaluation distinguishes:

* required Features;
* preferred Features;
* unsupported optional Features.

Missing required Features produce incompatibility.

Missing preferred Features may produce a warning or controlled fallback.

---

# 22. Capability Dependency Compatibility

A Capability is compatible only when its required Capability dependencies are also compatible and available.

Dependency evaluation shall be recursive.

The resulting dependency graph shall be:

* complete;
* version-compatible;
* acyclic;
* authorized;
* available within the required scope.

---

# 23. Extension Point Compatibility

Extension Point compatibility determines whether an extension may participate at a declared architectural location.

Evaluation considers:

* Extension Point Identity;
* Extension Point Version;
* required Contract;
* associated Capability;
* participation mode;
* multiplicity;
* ordering;
* scope;
* permissions;
* lifecycle status.

A compatible Contract alone does not imply compatible Extension Point participation.

---

# 24. Participation Mode Compatibility

An implementation shall be compatible with the participation semantics of the Extension Point.

Examples include:

* Single Participant;
* Multiple Participants;
* Ordered Pipeline;
* Unordered Broadcast;
* First Successful Participant.

An extension designed for one participation mode shall not be bound to another incompatible mode.

---

# 25. Ordering Compatibility

Extensions participating in ordered Extension Points shall provide valid ordering metadata.

Compatibility evaluation shall detect:

* missing required stages;
* incompatible priorities;
* unresolved dependencies;
* circular dependencies;
* ambiguous ordering.

Invalid ordering prevents activation of the affected Binding.

---

# 26. Scope Compatibility

Compatibility may depend upon scope.

Possible scopes include:

* Platform;
* Library;
* Workspace;
* User;
* Device;
* Execution Context.

An extension compatible at one scope may be incompatible at another due to:

* permissions;
* environment;
* configuration;
* dependency availability;
* execution policy.

---

# 27. Platform Compatibility

Platform compatibility evaluates broader runtime assumptions not fully represented by individual Contracts and Capabilities.

It may include:

* minimum Platform Version;
* maximum Platform Version;
* required architectural Features;
* supported runtime services;
* required migration state.

Platform version constraints shall supplement granular compatibility.

They shall not replace it.

---

# 28. Platform Feature Compatibility

An extension may require explicitly named Platform Features.

Examples may include:

* background execution support;
* isolated Plugin execution;
* remote Provider execution;
* rendering target support;
* local model runtime;
* specific security capability.

Required Features shall be machine-readable where practical.

---

# 29. Extension Package Compatibility

Package compatibility determines whether the extension package can be processed and executed in the current environment.

Evaluation may consider:

* package format;
* Manifest validity;
* package integrity;
* entry point format;
* runtime artifacts;
* native dependencies;
* supported processor architecture.

Package compatibility does not imply semantic compatibility.

---

# 30. Package Integrity Compatibility

A package failing integrity verification is incompatible with execution.

Integrity compatibility verifies:

* expected package hash;
* artifact hashes;
* digital signatures where required;
* immutable release identity.

A package with altered contents shall never be treated as the declared immutable release.

---

# 31. Dependency Compatibility

Extension dependencies shall be compatible before activation.

Dependencies may include:

* Capabilities;
* Contracts;
* SDK Versions;
* Extension Points;
* approved extension packages;
* external runtimes;
* operating system services.

Missing or incompatible required dependencies produce incompatibility.

---

# 32. Direct Extension Dependency Compatibility

Direct dependencies upon specific extension packages shall be exceptional.

When present, compatibility evaluation shall verify:

* Extension Identity;
* Version Range;
* lifecycle state;
* integrity;
* activation eligibility.

Capability dependencies remain preferred.

---

# 33. Optional Dependency Compatibility

Missing optional dependencies do not automatically produce incompatibility.

They may produce:

* reduced functionality;
* disabled optional Features;
* fallback execution;
* compatibility warnings.

The fallback behavior shall be explicit.

---

# 34. Permission Compatibility

Permission compatibility determines whether an extension's required permissions can be granted within the current policy and scope.

Evaluation considers:

* requested permission;
* requested scope;
* Platform security policy;
* user or administrator decision;
* data sensitivity;
* execution environment.

Compatibility does not grant permission.

It determines whether permission requirements are satisfiable.

---

# 35. Permission Scope Compatibility

An extension may request a broader permission scope than the current context permits.

Example:

```text
Requested:
    Knowledge.Read at Platform Scope

Available:
    Knowledge.Read at Workspace Scope
```

This may result in:

* incompatibility;
* partial compatibility;
* reduced-mode compatibility;

according to the declared extension semantics.

---

# 36. Permission Change Compatibility

An extension update requesting additional permissions is not automatically compatible with the previously granted authorization state.

Compatibility evaluation shall identify:

* new permissions;
* expanded scopes;
* new external transmission;
* new background execution;
* new filesystem access.

Permission expansion requires explicit reevaluation.

---

# 37. Environment Compatibility

Environment compatibility determines whether the execution environment satisfies extension requirements.

Evaluation may include:

* operating system;
* device class;
* processor architecture;
* memory class;
* available storage;
* network availability;
* hardware acceleration;
* external runtime availability.

Environment assumptions shall be explicit.

---

# 38. Device Compatibility

An extension may support one or more device classes.

Examples include:

* macOS;
* iPhone;
* iPad;
* Web runtime;
* server runtime.

Unsupported device execution shall be rejected before activation.

---

# 39. Operating System Compatibility

Operating system compatibility may include:

* supported operating system family;
* minimum version;
* required framework;
* required security capability;
* sandbox requirement.

Operating system compatibility belongs to the environment dimension.

It shall not redefine architectural Contract semantics.

---

# 40. Processor Architecture Compatibility

Extensions containing native artifacts shall declare supported processor architectures.

Examples may include:

* arm64;
* x86_64;
* WebAssembly-compatible runtime.

Architecture mismatch shall produce explicit incompatibility.

---

# 41. Runtime Compatibility

Extensions requiring a specific execution runtime shall declare it.

Examples include:

* language runtime;
* local model runtime;
* container runtime;
* remote execution runtime.

Runtime compatibility shall be validated before Entry Point activation.

---

# 42. Offline Compatibility

Offline compatibility determines whether the extension can satisfy its declared Capabilities without network access.

An extension may be:

* Offline Compatible;
* Online Required;
* Hybrid.

Runtime connectivity state may affect availability.

It shall not change the declared compatibility characteristics.

---

# 43. Network Compatibility

Extensions requiring external communication shall be compatible only when:

* required network access is permitted;
* required Endpoint categories are reachable where necessary;
* authentication requirements are satisfiable;
* privacy policy permits the communication.

Temporary unavailability may produce a runtime availability failure rather than permanent package incompatibility.

---

# 44. Configuration Compatibility

Configuration compatibility determines whether existing or proposed configuration satisfies the extension's Configuration Schema.

Evaluation includes:

* required fields;
* value types;
* ranges;
* secret references;
* scope;
* Provider requirements;
* migration requirements.

Invalid configuration prevents affected capabilities from activating.

---

# 45. Secret Compatibility

Extensions requiring secrets are compatible only when the runtime supports the required secret-management Contract and scope.

Secret values do not need to exist during package inspection.

However, affected execution remains unavailable until required secret references can be resolved.

---

# 46. Data Compatibility

Data compatibility determines whether extension-maintained operational data can be interpreted by the target extension version.

Evaluation may include:

* Plugin data schema;
* cache version;
* index version;
* migration availability;
* rollback compatibility.

Operational data compatibility remains separate from canonical knowledge compatibility.

---

# 47. Configuration Migration Compatibility

An extension update requiring configuration migration is compatible only when:

* a valid migration path exists;
* source Schema Version is supported;
* target Schema Version is known;
* secret references are preserved;
* failure recovery is defined.

Silent configuration loss is prohibited.

---

# 48. Plugin Data Migration Compatibility

Plugin operational data migration shall be compatible with:

* source extension version;
* target extension version;
* data schema;
* migration Entry Point;
* rollback policy;
* failure semantics.

Incompatible operational data shall not be silently discarded.

---

# 49. Rollback Compatibility

Rollback compatibility determines whether a newer extension release can be safely replaced with an earlier supported release.

Rollback evaluation considers:

* configuration migration reversibility;
* Plugin data reversibility;
* permission changes;
* Contract changes;
* Capability changes;
* extension Binding changes.

Rollback shall never be assumed safe by default.

---

# 50. Removal Compatibility

Removal compatibility evaluates whether an extension may be removed without violating active architectural dependencies.

Evaluation considers:

* required Capability consumers;
* active Extension Point bindings;
* dependent extensions;
* persisted operational data;
* external resources;
* replacement availability.

Removal shall never silently remove canonical knowledge.

---

# 51. Compatibility Levels

KnowledgeOS may classify compatibility using explicit levels.

A conceptual model may include:

| Level         | Meaning                                                             |
| ------------- | ------------------------------------------------------------------- |
| Full          | All required dimensions satisfied                                   |
| Adapted       | Compatible through approved adapters                                |
| Reduced       | Core operation available with optional features disabled            |
| Conditional   | Compatible after configuration, permission or dependency resolution |
| Incompatible  | One or more mandatory dimensions cannot be satisfied                |
| Indeterminate | Insufficient information to determine safely                        |

Compatibility levels shall remain machine-readable where practical.

---

# 52. Full Compatibility

Full Compatibility means:

* all required Contracts are compatible;
* all required Capabilities are compatible;
* all Extension Point declarations are compatible;
* all required dependencies are satisfiable;
* environment requirements are satisfied;
* permission requirements are satisfiable;
* no required migration is missing.

Full Compatibility does not imply trust or activation.

---

# 53. Adapted Compatibility

Adapted Compatibility means execution is possible through approved Compatibility Adapters or Translators.

Adapted Compatibility shall identify:

* Adapter identity;
* source version;
* target version;
* known limitations;
* performance implications where relevant.

Adaptation shall remain observable.

---

# 54. Reduced Compatibility

Reduced Compatibility means the extension can provide its required core behavior while one or more optional Features are unavailable.

Reduced Compatibility shall identify:

* unavailable optional Features;
* fallback behavior;
* affected Capabilities;
* user-visible limitations.

Required behavior shall remain intact.

---

# 55. Conditional Compatibility

Conditional Compatibility means compatibility can be achieved after satisfying explicit conditions.

Typical conditions include:

* granting permission;
* providing configuration;
* installing a dependency;
* resolving a secret reference;
* enabling a runtime Feature;
* completing a migration.

Conditions shall be explicit and actionable.

---

# 56. Incompatibility

Incompatibility means one or more mandatory requirements cannot be satisfied safely.

Typical causes include:

* unsupported SDK Version;
* unsupported Manifest Schema;
* incompatible Contract;
* incompatible Capability;
* unavailable required Extension Point;
* unsatisfied required dependency;
* impossible permission requirement;
* unsupported environment;
* invalid package integrity.

Incompatibility shall prevent affected activation.

---

# 57. Indeterminate Compatibility

Compatibility is Indeterminate when available metadata is insufficient to make a safe decision.

KnowledgeOS shall not treat Indeterminate as Compatible.

The extension may require:

* additional metadata;
* environment inspection;
* dependency discovery;
* security review;
* explicit administrative decision.

---

# 58. Success Criteria

The Plugin SDK Compatibility Model is successful when KnowledgeOS can determine, before execution, whether an extension and its declared Capabilities, Contracts, Extension Points, dependencies, permissions and environment requirements can interact safely and semantically correctly with the installed Platform.

---



# 59. Compatibility Evaluation Process

Compatibility evaluation shall follow an explicit and deterministic process.

```text
Load Extension Manifest
        │
        ▼
Validate Manifest Schema
        │
        ▼
Resolve SDK Compatibility
        │
        ▼
Resolve Contract Compatibility
        │
        ▼
Resolve Capability Compatibility
        │
        ▼
Resolve Extension Point Compatibility
        │
        ▼
Validate Dependencies
        │
        ▼
Evaluate Permissions
        │
        ▼
Evaluate Environment
        │
        ▼
Evaluate Configuration and Migration
        │
        ▼
Produce Compatibility Result
```

No required compatibility dimension may be skipped.

---

# 60. Evaluation Inputs

Compatibility evaluation consumes explicit inputs.

Typical inputs include:

* extension Manifest;
* extension package metadata;
* Plugin SDK Version;
* Manifest Schema Registry;
* Contract Registry;
* Capability Registry;
* Extension Point Registry;
* installed dependency state;
* granted permission state;
* execution environment;
* active compatibility policies;
* available Compatibility Adapters;
* current configuration;
* existing extension data version.

Evaluation inputs shall be versioned or identifiable where required for reproducibility.

---

# 61. Evaluation Output

Every evaluation shall produce a structured Compatibility Report.

The report shall include:

* Compatibility Result;
* Compatibility Level;
* evaluated extension identity;
* evaluated extension version;
* evaluation context;
* successful dimensions;
* failed dimensions;
* warnings;
* required actions;
* selected adapters when applicable;
* unresolved conditions;
* correlation metadata.

A Boolean result alone is insufficient.

---

# 62. Compatibility Report

The Compatibility Report is an immutable evaluation artifact.

It records the compatibility decision made under a specific evaluation context.

The report is not canonical knowledge.

It is an operational and governance artifact.

---

# 63. Evaluation Context Identity

Every Compatibility Report shall identify the context under which it was produced.

Context identity may include:

* Platform Version;
* SDK Version;
* registry versions;
* policy version;
* device identity class;
* operating system version;
* execution profile;
* permission state version;
* dependency state version.

A result without context cannot be assumed valid in another environment.

---

# 64. Deterministic Evaluation

Given the same:

* extension package;
* Manifest;
* registries;
* environment;
* permission state;
* dependency state;
* compatibility policy;

the evaluation shall produce the same result.

Compatibility evaluation shall be deterministic and reproducible.

---

# 65. Evaluation Reproducibility

KnowledgeOS shall preserve enough metadata to reproduce a compatibility decision.

Reproducibility metadata may include:

* evaluator version;
* policy version;
* registry snapshots;
* selected adapters;
* environment classification;
* input fingerprints;
* evaluation timestamp.

Reproduction shall not require executing extension business logic.

---

# 66. Compatibility Matrix

KnowledgeOS may represent compatibility relationships through Compatibility Matrices.

Typical matrices include:

* SDK-to-Extension Compatibility;
* Contract Version Compatibility;
* Capability Version Compatibility;
* Extension Point Version Compatibility;
* Platform Feature Compatibility;
* Device Compatibility;
* Operating System Compatibility.

Matrices support explicit evaluation.

They shall not replace semantic rules.

---

# 67. Contract Compatibility Matrix

A Contract Compatibility Matrix may define relationships such as:

| Consumer Version | Provider Version | Result                     |
| ---------------- | ---------------- | -------------------------- |
| 1                | 1                | Compatible                 |
| 1                | 2                | Compatible through Adapter |
| 2                | 1                | Incompatible               |
| 2                | 2                | Compatible                 |

Matrix entries shall reflect semantic review.

They shall not be generated solely from numeric ordering.

---

# 68. Capability Compatibility Matrix

A Capability Compatibility Matrix may describe which Capability Versions satisfy consumer requirements.

The matrix may additionally identify:

* required Features;
* unsupported Features;
* required Contracts;
* migration requirements;
* deprecation state.

Capability compatibility remains semantic.

---

# 69. Extension Point Compatibility Matrix

An Extension Point Compatibility Matrix may evaluate:

* Extension Point Version;
* Contract Version;
* Capability Version;
* participation mode;
* binding scope;
* ordering semantics.

A compatible Contract does not automatically imply a compatible Extension Point Binding.

---

# 70. Compatibility Graph

Complex compatibility relationships may be represented as a graph.

```text
Extension
   │
   ├── requires → SDK
   ├── requires → Contract A
   ├── provides → Capability B
   ├── binds to → Extension Point C
   ├── depends on → Capability D
   └── requires → Permission E
```

Every required path in the graph shall resolve successfully for Full Compatibility.

---

# 71. Graph Validation

Compatibility graph validation shall include:

* missing nodes;
* unsupported versions;
* incompatible edges;
* circular required dependencies;
* retired Contracts;
* retired Capabilities;
* retired Extension Points;
* unauthorized required paths.

Invalid required graph paths produce incompatibility.

---

# 72. Compatibility Negotiation

Compatibility negotiation determines whether mutually supported semantics can be established.

Negotiation may apply to:

* SDK bindings;
* Contract Versions;
* Capability Versions;
* optional Features;
* Extension Point Versions;
* transport bindings;
* serialization formats.

Negotiation shall remain explicit and deterministic.

---

# 73. Negotiation Boundaries

Negotiation may select among compatible alternatives.

It shall never:

* redefine a Contract;
* invent missing Capabilities;
* grant permissions;
* bypass security policy;
* ignore required dependencies;
* reinterpret incompatible semantics.

Negotiation operates within declared compatibility rules.

---

# 74. Negotiation Result

A negotiation result shall identify:

* selected version;
* selected Features;
* selected adapter;
* excluded alternatives;
* fallback behavior;
* known limitations.

Negotiated decisions shall remain observable.

---

# 75. Preferred Compatibility Strategy

KnowledgeOS shall prefer compatibility strategies in the following conceptual order:

1. Native Compatibility;
2. Compatible Newer Public Version;
3. Approved Compatibility Adapter;
4. Reduced Optional Feature Mode;
5. Explicit Conditional Compatibility;
6. Explicit Incompatibility.

Silent semantic degradation is prohibited.

---

# 76. Compatibility Adapter Registry

Approved Compatibility Adapters shall be registered.

A registry entry shall identify:

* Adapter Identity;
* source Contract or Schema Version;
* target Contract or Schema Version;
* preserved semantics;
* known limitations;
* compatibility status;
* lifecycle status.

Unregistered adapters shall not participate in authoritative compatibility evaluation.

---

# 77. Adapter Chaining

Multiple Compatibility Adapters may be chained only when explicitly supported.

```text
Version 1
    │
    ▼
Adapter A
    │
    ▼
Version 2
    │
    ▼
Adapter B
    │
    ▼
Version 3
```

Adapter chains shall be validated for:

* semantic preservation;
* deterministic ordering;
* cumulative limitations;
* performance impact;
* failure behavior.

Unbounded adapter chaining is prohibited.

---

# 78. Native Compatibility Preference

Native Compatibility shall be preferred over adapted compatibility when both satisfy policy requirements.

This reduces:

* translation risk;
* semantic loss;
* operational complexity;
* performance overhead;
* long-term maintenance burden.

Policy may still prefer another compatible implementation for privacy, locality or explicit user preference.

---

# 79. Compatibility Caching

Compatibility results may be cached.

Caching shall use a key derived from the complete compatibility context.

Typical cache inputs include:

* extension package fingerprint;
* Manifest fingerprint;
* Platform Version;
* SDK Version;
* registry versions;
* compatibility policy version;
* permission state version;
* dependency state version;
* environment identity.

Incomplete cache keys are prohibited.

---

# 80. Cache Invalidation

Compatibility cache entries shall be invalidated when relevant inputs change.

Typical invalidation causes include:

* Platform update;
* SDK update;
* Contract Registry update;
* Capability Registry update;
* Extension Point Registry update;
* permission change;
* dependency installation or removal;
* environment change;
* policy change;
* extension package change;
* configuration change;
* security revocation.

Stale compatibility decisions shall not authorize execution.

---

# 81. Cached Result Scope

A cached Compatibility Report is valid only for its recorded context.

A result produced on macOS shall not automatically apply to iPadOS.

A result produced for one Workspace permission scope shall not automatically apply to another.

Scope shall remain explicit.

---

# 82. Compatibility and Installation

Installation eligibility requires at minimum:

* valid package structure;
* valid Manifest;
* supported Manifest Schema;
* interpretable package metadata;
* acceptable package integrity.

Full runtime compatibility may be evaluated before or after installation according to policy.

Installation does not imply activation.

---

# 83. Compatibility and Activation

Activation requires all mandatory compatibility dimensions to be satisfied or explicitly accepted through an approved conditional workflow.

Activation shall additionally require:

* trust approval;
* permission grant;
* valid configuration;
* dependency availability;
* healthy required runtime services.

Compatibility is one activation prerequisite.

---

# 84. Compatibility and Binding

An extension may be generally compatible with KnowledgeOS but incompatible with a specific Extension Point Binding.

Binding compatibility shall be evaluated separately for each declared participation.

One incompatible Binding need not invalidate unrelated compatible extension capabilities unless it is required for core extension operation.

---

# 85. Partial Extension Compatibility

An extension package may contain several independently declared capabilities or participations.

The package may therefore be partially compatible.

Example:

```text
Capability A → Compatible
Capability B → Incompatible
Extension Point C → Compatible
Extension Point D → Permission Denied
```

Partial activation is permitted only when the Manifest and architecture explicitly support independent capability activation.

---

# 86. Atomic Compatibility Requirements

An extension may declare a set of capabilities as atomically required.

If any member is incompatible, the complete atomic set is incompatible.

Atomic requirements shall be explicit.

They shall not be inferred from implementation assumptions.

---

# 87. Capability-Level Activation

When supported, compatible capabilities may activate independently.

Capability-level activation shall preserve:

* dependency correctness;
* permission isolation;
* Binding correctness;
* configuration isolation;
* observability.

Disabled incompatible capabilities shall remain visible in diagnostics.

---

# 88. Compatibility and Updates

Every extension update shall trigger compatibility reevaluation.

Reevaluation shall compare:

* old Manifest;
* new Manifest;
* old permissions;
* new permissions;
* old dependencies;
* new dependencies;
* old Capabilities;
* new Capabilities;
* old Contracts;
* new Contracts;
* old Extension Point declarations;
* new declarations;
* migration requirements.

Update compatibility shall never be assumed.

---

# 89. Update Compatibility Report

An update evaluation shall produce a report identifying:

* newly compatible behavior;
* removed behavior;
* permission expansion;
* new dependencies;
* incompatible bindings;
* required migrations;
* rollback limitations;
* user-visible changes.

The report supports informed update approval.

---

# 90. Backward Update Compatibility

An update is backward-compatible when existing supported interactions continue to satisfy their declared semantics.

Backward compatibility may still require:

* configuration migration;
* data migration;
* permission reevaluation;
* Binding refresh.

These requirements shall be explicit.

---

# 91. Breaking Update Compatibility

An update is breaking when it requires incompatible changes in:

* public Contracts;
* required Capabilities;
* Extension Point participation;
* permissions;
* configuration;
* operational data;
* supported environment.

Breaking updates shall not be activated automatically without explicit policy approval.

---

# 92. Migration Compatibility

Migration compatibility determines whether extension state can move safely from one version to another.

Evaluation shall consider:

* source version;
* target version;
* migration path;
* migration Entry Point;
* data categories;
* reversibility;
* failure recovery;
* canonical knowledge boundaries.

Missing required migrations produce incompatibility.

---

# 93. Multi-Step Migration

An extension may require a multi-step migration.

```text
Version 1
    │
    ▼
Migration 1→2
    │
    ▼
Version 2
    │
    ▼
Migration 2→3
    │
    ▼
Version 3
```

Every step shall be explicit, compatible and recoverable according to its declared policy.

Unbounded implicit migration chains are prohibited.

---

# 94. Migration Planning

Migration planning shall determine:

* required steps;
* step order;
* required resources;
* required downtime;
* rollback points;
* compatibility checkpoints;
* final validation.

Migration planning belongs to runtime execution governance.

Compatibility provides the required metadata.

---

# 95. Degraded Compatibility

Degraded Compatibility may be accepted when:

* all mandatory semantics remain available;
* only optional behavior is unavailable;
* data integrity remains preserved;
* security is not weakened;
* limitations are visible.

Degraded execution shall never be presented as Full Compatibility.

---

# 96. Fallback Compatibility

Fallback execution may select an alternate compatible Capability implementation.

Fallback shall require:

* compatible Capability semantics;
* valid Contract;
* required permissions;
* acceptable privacy characteristics;
* explicit fallback policy.

Fallback shall not silently switch from local to remote execution when that changes privacy or cost behavior.

---

# 97. Offline Fallback

When a preferred remote implementation is unavailable, an offline-compatible implementation may be selected if:

* Capability semantics remain compatible;
* required Features remain available;
* local policy permits it;
* result differences are within declared semantics.

Offline First policies may prioritize this behavior.

---

# 98. Remote Fallback

Fallback from local to remote execution requires explicit consideration of:

* external data transmission;
* permission;
* privacy policy;
* connectivity;
* cost policy;
* user preference.

Remote fallback shall never be hidden.

---

# 99. Compatibility Failure Model

Compatibility failures shall be categorized.

Typical categories include:

* ManifestIncompatible;
* SDKIncompatible;
* ContractIncompatible;
* CapabilityIncompatible;
* ExtensionPointIncompatible;
* DependencyIncompatible;
* PermissionUnsatisfied;
* EnvironmentIncompatible;
* ConfigurationIncompatible;
* MigrationUnavailable;
* IntegrityFailure;
* IndeterminateCompatibility.

Failure categories shall remain stable public diagnostics.

---

# 100. Failure Severity

Compatibility failures may have severity levels.

Typical levels include:

* Information;
* Warning;
* Conditional Blocker;
* Binding Blocker;
* Capability Blocker;
* Extension Blocker;
* Security Blocker.

Severity shall reflect execution impact.

It shall not conceal incompatibility.

---

# 101. Actionable Diagnostics

Every incompatibility should produce actionable diagnostics where possible.

Diagnostics may identify:

* failed dimension;
* required version;
* available version;
* missing Feature;
* missing dependency;
* missing permission;
* unsupported device;
* required migration;
* suggested compatible alternative.

Diagnostics shall not expose private internals.

---

# 102. Compatibility Security

Compatibility evaluation is security-sensitive.

An attacker shall not be able to obtain execution by:

* falsifying versions;
* omitting permissions;
* hiding dependencies;
* modifying Manifest declarations;
* replacing package artifacts;
* injecting unregistered adapters;
* exploiting cached results from another scope.

Security-relevant inputs shall be integrity-protected.

---

# 103. Trusted Compatibility Metadata

Compatibility decisions shall rely upon authoritative metadata.

Authoritative sources include:

* validated Manifest;
* approved registries;
* trusted policy;
* verified package metadata;
* verified environment metadata;
* granted permission state.

Self-declared extension metadata shall be validated before use.

---

# 104. Compatibility and Trust

Compatibility and trust are independent.

A package may be:

```text
Compatible
    +
Untrusted
```

or:

```text
Trusted
    +
Incompatible
```

Both cases prevent normal activation.

Trust does not override incompatibility.

Compatibility does not establish trust.

---

# 105. Compatibility and Authorization

Compatibility does not grant authority.

Permission compatibility determines whether requirements may be satisfied.

Authorization determines whether they are actually granted.

An extension shall execute only within granted authority.

---

# 106. Compatibility and Health

Compatibility represents the ability to interact correctly.

Health represents current operational readiness.

A compatible Provider may be temporarily unhealthy.

An unhealthy Provider remains compatible but unavailable.

The distinction shall remain explicit.

---

# 107. Compatibility and Availability

Compatibility and availability are distinct.

```text
Compatible + Available
Compatible + Unavailable
Incompatible + Installed
Compatible + Disabled
```

Runtime selection shall consider both compatibility and availability.

---

# 108. Privacy Compatibility

Privacy Compatibility evaluates whether extension behavior conforms to current privacy policy.

Evaluation may consider:

* local or remote execution;
* transmitted data categories;
* external persistence;
* Endpoint jurisdiction or category;
* user consent;
* Workspace policy.

Privacy incompatibility may block otherwise technically compatible execution.

---

# 109. Data Residency Compatibility

Where required, compatibility may include data residency constraints.

An implementation may be ineligible when it requires transmission or persistence outside an approved boundary.

Residency requirements shall be explicit policy inputs.

---

# 110. Cost Compatibility

Execution policy may evaluate whether an implementation is compatible with active cost constraints.

A metered remote Provider may be technically compatible but ineligible under a zero-cost execution profile.

Cost policy affects selection eligibility.

It does not redefine Capability semantics.

---

# 111. Performance Compatibility

Some execution profiles may define minimum performance requirements.

An implementation may be incompatible with a specific profile when it cannot satisfy required:

* latency;
* throughput;
* memory;
* streaming;
* deadline;
* concurrency.

Performance Compatibility shall be profile-specific.

---

# 112. Compatibility Observability

Every compatibility evaluation shall be observable.

Observable metadata may include:

* Extension Identity;
* Extension Version;
* evaluation context;
* evaluator version;
* Compatibility Level;
* failed dimensions;
* selected adapters;
* evaluation duration;
* cache usage;
* correlation metadata.

Observability shall preserve security and privacy.

---

# 113. Compatibility Metrics

Metrics may include:

* evaluation count;
* Compatible results;
* Incompatible results;
* Conditional results;
* Adapted results;
* cache hit rate;
* common failure dimensions;
* deprecated version usage;
* adapter usage;
* update incompatibility rate.

Metrics support ecosystem evolution and deprecation planning.

---

# 114. Compatibility Tracing

Compatibility evaluation may participate in tracing.

A trace may represent:

```text
Manifest Validation
        │
        ▼
SDK Check
        │
        ▼
Contract Resolution
        │
        ▼
Capability Resolution
        │
        ▼
Extension Point Validation
        │
        ▼
Dependency Evaluation
        │
        ▼
Environment Evaluation
        │
        ▼
Compatibility Result
```

Tracing shall not execute extension business code.

---

# 115. Compatibility Audit

Security-relevant compatibility decisions may be auditable.

Audit records may include:

* evaluated package fingerprint;
* policy version;
* decision;
* overriding administrative decision;
* accepted warning;
* granted exception;
* decision timestamp.

Audit history shall be immutable.

---

# 116. Compatibility Exceptions

Architectural or administrative compatibility exceptions shall be rare and explicit.

An exception shall identify:

* affected extension;
* affected incompatibility;
* scope;
* rationale;
* authorizing authority;
* expiration;
* risk;
* compensating controls.

Exceptions shall never silently redefine public compatibility rules.

---

# 117. Temporary Exceptions

Temporary exceptions shall have an explicit expiration condition.

Expired exceptions shall no longer permit activation.

Indefinite temporary exceptions are prohibited.

---

# 118. Non-Overridable Incompatibilities

Some incompatibilities shall not be overridden.

Examples may include:

* invalid package integrity;
* unsupported security semantics;
* impossible Contract interpretation;
* corrupted Manifest;
* prohibited permission model;
* canonical integrity risk.

Non-overridable conditions shall be defined by security and architecture policy.

---

# 119. Compatibility Evolution

The Compatibility Model shall evolve conservatively.

Preferred evolution mechanisms include:

* new explicit dimensions;
* additive result metadata;
* new policy versions;
* approved adapters;
* improved diagnostics.

Existing result semantics shall not be silently redefined.

---

# 120. Policy Versioning

Compatibility policies shall be explicitly versioned.

Policy versioning supports:

* reproducibility;
* auditability;
* controlled evolution;
* cache correctness.

A changed policy may produce a different result from the same extension package.

The policy version shall therefore be recorded.

---

# 121. Compatibility Governance

Compatibility rules are governed architectural contracts.

New rules shall be justified by:

* semantic safety;
* ecosystem stability;
* security;
* privacy;
* execution correctness;
* long-term maintainability.

Implementation convenience alone does not justify relaxing compatibility.

---

# 122. Compatibility Review

Review shall evaluate:

* semantic correctness;
* false-compatible risk;
* false-incompatible risk;
* migration burden;
* security impact;
* privacy impact;
* determinism;
* observability;
* long-term support cost.

Safe rejection remains preferable to unsafe acceptance.

---

# 123. Commands

Typical Compatibility Commands include:

* EvaluateCompatibility;
* ReevaluateCompatibility;
* RegisterCompatibilityAdapter;
* RemoveCompatibilityAdapter;
* ApproveCompatibilityException;
* RevokeCompatibilityException;
* InvalidateCompatibilityCache.

Commands modify compatibility evaluation state, adapter registration or exception state.

They do not alter immutable published Contract semantics.

---

# 124. Events

Typical Compatibility Events include:

* CompatibilityEvaluated;
* CompatibilityFailed;
* CompatibilityChanged;
* CompatibilityAdapterRegistered;
* CompatibilityAdapterRemoved;
* CompatibilityExceptionApproved;
* CompatibilityExceptionExpired;
* CompatibilityCacheInvalidated.

Events describe completed compatibility-related facts.

---

# 125. Queries

Typical Compatibility Queries include:

* GetCompatibilityReport;
* CheckExtensionCompatibility;
* CheckBindingCompatibility;
* CheckUpdateCompatibility;
* GetCompatibilityFailures;
* GetRequiredActions;
* ListCompatibilityAdapters;
* GetCompatibilityPolicyVersion;
* GetCompatibilityException;
* CompareCompatibilityReports.

Queries never modify extension runtime state.

---

# 126. Compatibility Invariants

The following invariants apply.

* Compatibility is explicit.
* Compatibility is multi-dimensional.
* Compatibility is semantic, not merely numeric or structural.
* Every evaluation occurs within an explicit context.
* Every evaluation produces a structured Compatibility Report.
* Evaluation is deterministic under equivalent inputs.
* Evaluation is reproducible.
* All mandatory dimensions shall be evaluated.
* Compatible does not mean trusted.
* Compatible does not mean authorized.
* Compatible does not mean enabled.
* Compatible does not mean healthy.
* Compatible does not mean available.
* Incompatible versions are never silently substituted.
* Compatibility negotiation operates only within declared rules.
* Compatibility Adapters are explicit, registered and observable.
* Native Compatibility is preferred when equivalent.
* Cache keys include the complete relevant compatibility context.
* Cached results are invalidated when relevant inputs change.
* Update compatibility is always reevaluated.
* Permission expansion requires explicit authorization reevaluation.
* Missing required migrations produce incompatibility.
* Degraded Compatibility preserves mandatory semantics.
* Remote fallback never silently changes privacy or cost behavior.
* Indeterminate Compatibility is never treated as Compatible automatically.
* Security-relevant incompatibilities may be non-overridable.
* Compatibility exceptions are explicit, scoped, auditable and temporary where applicable.
* Policy versions are explicit.
* Historical Compatibility Reports remain traceable.

---

# 127. Prohibited Behaviors

Compatibility evaluation shall never:

* infer compatibility from version numbers alone;
* treat structural similarity as semantic compatibility;
* skip mandatory dimensions;
* silently ignore missing dependencies;
* silently ignore required permissions;
* silently downgrade Contract semantics;
* silently bind incompatible Extension Points;
* silently expand authority;
* silently switch from local to remote execution;
* reuse cached results across incompatible scopes;
* trust unverified compatibility metadata;
* execute extension business code merely to determine basic compatibility;
* treat Indeterminate as Compatible;
* allow invalid package integrity through an exception;
* use compatibility exceptions to redefine permanent architecture;
* mutate published Contract, Capability or Extension Point semantics.

---

# 128. Related Documents

* SDKArchitecture.md
* Contracts.md
* Capabilities.md
* ExtensionPoints.md
* Manifest.md
* `../Providers/ProviderModel.md`
* `../README.md`
* `../../04-Platform/Plugin/README.md`
* `../../03-Kernel/Configuration.md`
* `../../03-Kernel/Observability.md`
* `../../01-Foundation/ArchitecturePrinciples.md`
* `../../06-Execution/Concurrency/Determinism.md`
* `../../06-Execution/Concurrency/Idempotency.md`

---

# 129. Status

**Approved**

This document defines the compatibility model used by the KnowledgeOS Plugin SDK.

Compatibility is an explicit, semantic, deterministic and multi-dimensional relationship evaluated across Manifest Schemas, SDK Versions, Contracts, Capabilities, Extension Points, dependencies, permissions, configuration, environment, package integrity and migration state.

Every evaluation produces an immutable and reproducible Compatibility Report within an explicit context.

Compatibility does not establish trust, authorization, activation, health or availability.

It establishes only that declared architectural interactions can occur according to compatible semantics and constraints.

KnowledgeOS prefers native compatibility, permits explicit adaptation, supports controlled reduced modes and rejects unsafe or indeterminate execution.

Safe rejection has priority over incorrect execution.
