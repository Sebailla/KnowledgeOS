# Public API Conventions

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Public API

**Document:** API Conventions

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the universal conventions governing all public APIs exposed by KnowledgeOS.

Public API conventions establish a stable, predictable and technology-independent interaction model for external consumers.

These conventions apply regardless of whether a capability is exposed through:

* REST;
* GraphQL;
* Local API;
* SDK bindings;
* inter-process communication;
* future public API styles.

Public APIs expose Platform capabilities.

They never expose internal architectural implementation.

---

# 2. Scope

This document governs:

* public API identity;
* public operation naming;
* request and response semantics;
* resource and capability representation;
* command and query exposure;
* event exposure;
* error representation;
* correlation;
* idempotency;
* pagination;
* filtering;
* sorting;
* concurrency control;
* asynchronous operations;
* cancellation;
* compatibility;
* deprecation;
* security;
* observability.

This document does not define:

* REST-specific URI structure;
* GraphQL Schema details;
* transport-specific serialization;
* authentication protocol implementation;
* Platform business logic;
* internal Kernel contracts;
* internal Engine APIs;
* Provider-specific interfaces.

---

# 3. Definition of a Public API

A Public API is a stable, documented and versioned contract through which an external consumer may access approved KnowledgeOS capabilities.

A Public API defines:

* available operations;
* input requirements;
* output guarantees;
* error semantics;
* security requirements;
* compatibility expectations;
* lifecycle status.

A Public API is an architectural boundary.

It is not a projection of internal classes or services.

---

# 4. Architectural Position

Public APIs belong to the Integration layer.

```text
External Consumer
        │
        ▼
Public API
        │
        ▼
Integration Adapter
        │
        ▼
Platform Contract
        │
        ▼
Platform Engine
```

Public APIs translate external interactions into approved Platform operations.

They never bypass Platform contracts.

---

# 5. Mission

The mission of the Public API layer is to expose KnowledgeOS capabilities through stable external contracts while preserving:

* architectural isolation;
* semantic consistency;
* security;
* compatibility;
* user ownership;
* technology independence;
* long-term maintainability.

External clients may evolve independently.

KnowledgeOS internals remain protected.

---

# 6. Design Philosophy

Public APIs are contract-first.

The API shall be designed from architectural semantics rather than generated from implementation details.

Public API design shall prioritize:

* clarity;
* stability;
* explicitness;
* consistency;
* minimality;
* predictability;
* evolvability.

Convenience shall never justify exposing architectural internals.

---

# 7. Public API Principles

Every Public API shall follow these principles:

* Contract First;
* Stable Semantics;
* Explicit Versioning;
* Least Privilege;
* Deterministic Interpretation;
* Consistent Errors;
* Idempotency Where Applicable;
* Observable Execution;
* Backward Compatibility Where Practical;
* Technology Independence;
* Privacy by Default;
* No Internal Leakage.

---

# 8. Capability-Oriented APIs

Public APIs shall expose approved Platform capabilities.

They shall not mirror internal package structures.

Preferred:

```text
Knowledge.Read
Knowledge.Create
Search.Execute
Annotation.Create
Export.Start
```

Avoid:

```text
KnowledgeRepository.GetEntity
SearchService.ExecuteInternalQuery
AnnotationStore.InsertRecord
```

Public operations describe architectural intent.

They never reveal implementation topology.

---

# 9. Public API Surface

The Public API surface may expose:

* Commands;
* Queries;
* asynchronous Operations;
* Events;
* resource representations;
* capability metadata;
* health metadata;
* compatibility metadata.

Every exposed surface shall have explicit ownership and versioning.

---

# 10. API Ownership

Every Public API operation shall have exactly one architectural owner.

Typical owners include:

* Knowledge Engine;
* Library Engine;
* Search Engine;
* Annotation Engine;
* Render Engine;
* AI Engine;
* Sync Engine;
* Export Engine;
* Plugin Engine;
* Integration services.

Ownership defines semantic authority.

The Public API layer exposes owned semantics.

It does not redefine them.

---

# 11. Operation Categories

Public API operations fall into distinct categories:

* Command;
* Query;
* Operation Control;
* Event Subscription;
* Capability Discovery;
* Administrative Operation.

Each category has different semantics.

They shall not be conflated.

---

# 12. Commands

A Public Command requests a state-changing operation.

Commands shall:

* express intent;
* be explicit;
* include required authorization context;
* define idempotency semantics;
* produce a known result contract;
* not expose internal transaction boundaries.

Examples include:

* CreateKnowledge;
* UpdateAnnotation;
* StartExport;
* EnablePlugin;
* StartSynchronization.

---

# 13. Queries

A Public Query retrieves information without modifying canonical state.

Queries shall:

* be side-effect free at the architectural level;
* expose explicit filters;
* expose explicit pagination when required;
* define consistency expectations;
* avoid implementation-specific query languages unless explicitly governed.

Examples include:

* GetKnowledgeObject;
* SearchKnowledge;
* GetExportStatus;
* ListPlugins;
* GetSynchronizationReport.

---

# 14. Asynchronous Operations

Long-running work shall be exposed as asynchronous Operations when appropriate.

Typical examples include:

* document import;
* OCR processing;
* export generation;
* AI execution;
* synchronization;
* large reindexing;
* Plugin validation.

An asynchronous request returns an Operation Reference rather than blocking until completion.

---

# 15. Operation Reference

An Operation Reference identifies a long-running public operation.

It may contain:

* Operation Identity;
* operation type;
* lifecycle status;
* creation time;
* update time;
* progress reference;
* result reference;
* cancellation capability;
* correlation metadata.

Operation identity shall remain stable throughout execution.

---

# 16. Operation Lifecycle

A public asynchronous Operation may follow a lifecycle such as:

```text
Accepted
    │
    ▼
Pending
    │
    ▼
Running
    │
    ├────────────┬────────────┐
    ▼            ▼            ▼
Completed     Failed       Cancelled
```

Lifecycle states shall be explicit.

Intermediate states shall never be inferred from missing results.

---

# 17. Operation Status

Public API clients may query Operation status.

Status may include:

* state;
* progress;
* current phase;
* warnings;
* failure information;
* result availability;
* cancellation state.

Progress is informational unless explicitly guaranteed.

---

# 18. Operation Result

A completed Operation may produce:

* direct result;
* resource reference;
* generated artifact reference;
* report reference;
* no content;
* failure.

Result semantics shall be explicit.

---

# 19. Cancellation

Asynchronous Operations may support cancellation.

Cancellation support shall be declared.

A cancellation request may result in:

* Cancelled;
* Cancellation Requested;
* Cannot Cancel;
* Already Completed.

Cancellation shall not imply rollback unless explicitly defined.

---

# 20. Command and Resource Separation

A Command is not a resource.

A resource is not a Command.

Example:

```text
Command:
    StartExport

Resource:
    Export Operation

Result:
    Exported Representation
```

Public API design shall preserve this distinction.

---

# 21. Resource Representation

Public resource representations expose stable external views of Platform-managed concepts.

Examples include:

* Knowledge Object summary;
* Annotation representation;
* Library representation;
* Operation status;
* Plugin descriptor;
* Provider descriptor.

Public representations shall remain independent from internal persistence models.

---

# 22. Representation Identity

Every externally addressable representation shall expose a stable identity where applicable.

Identity shall remain independent from:

* database primary key;
* filesystem path;
* process-local pointer;
* storage location;
* implementation-specific identifier.

Internal identifiers shall not leak unless they are themselves approved public identities.

---

# 23. Public Identifiers

Public identifiers shall be:

* stable;
* opaque where appropriate;
* globally or contextually unambiguous;
* serializable;
* independent from implementation topology.

Consumers shall not infer semantics from opaque identifiers.

---

# 24. Identifier Immutability

Once assigned, a public identity shall not change because of:

* storage migration;
* Provider replacement;
* filesystem relocation;
* synchronization;
* renaming;
* internal refactoring.

Identity evolution shall follow explicit Domain rules.

---

# 25. Request Model

Every public request shall define:

* operation identity or route;
* input payload;
* authentication context;
* authorization scope;
* optional idempotency metadata;
* optional concurrency metadata;
* optional correlation metadata;
* optional locale;
* optional execution preferences.

Undocumented request fields are prohibited.

---

# 26. Request Validation

Public requests shall be validated before Platform execution.

Validation may include:

* structural validation;
* type validation;
* identifier validation;
* required field validation;
* range validation;
* compatibility validation;
* authorization prerequisites;
* semantic preconditions.

Invalid requests shall not reach internal execution paths.

---

# 27. Structural and Semantic Validation

Structural validation asks:

> Is the request well-formed?

Semantic validation asks:

> Is the request meaningful and permitted in the current state?

These are distinct validation stages.

Both shall produce explicit error semantics.

---

# 28. Unknown Request Fields

Unknown-field handling shall be versioned and explicit.

Possible policies include:

* Reject;
* Ignore;
* Preserve where applicable.

Silent reinterpretation is prohibited.

---

# 29. Response Model

Every public response shall expose a documented result contract.

A response may contain:

* data;
* Operation Reference;
* warnings;
* pagination metadata;
* correlation metadata;
* version metadata;
* no content.

Internal objects shall never be serialized directly as public responses.

---

# 30. Response Envelope

API styles may use an explicit response envelope where beneficial.

A conceptual envelope may contain:

```text
data
errors
warnings
metadata
correlation
```

The exact transport representation may vary.

The semantics shall remain consistent.

---

# 31. Success Semantics

Success shall mean that the declared operation completed according to its contract.

Examples:

* a Command was accepted;
* a Query completed;
* an asynchronous Operation was created;
* a resource was returned;
* a state transition completed.

Transport success alone does not establish business success.

---

# 32. Warnings

Responses may include non-fatal warnings.

Warnings may describe:

* controlled degradation;
* deprecated usage;
* partial optional Feature availability;
* fallback execution;
* non-critical validation findings.

Warnings shall not be used to conceal failure of mandatory semantics.

---

# 33. Error Model

All Public APIs shall use a canonical public error model.

An error may contain:

* Error Code;
* Error Category;
* Human-readable Message;
* field or path reference;
* recoverability;
* retryability;
* correlation reference;
* documentation reference;
* safe diagnostic metadata.

Internal exceptions shall never cross the Public API boundary.

---

# 34. Error Categories

Typical public error categories include:

* Validation;
* Authentication;
* Authorization;
* Not Found;
* Conflict;
* Unsupported;
* Compatibility;
* Rate Limit;
* Timeout;
* Cancellation;
* Dependency Failure;
* External Service Failure;
* Resource Exhaustion;
* Internal Failure.

Categories shall remain stable across API styles.

---

# 35. Error Codes

Error Codes shall be:

* stable;
* machine-readable;
* documented;
* semantically specific;
* independent from transport-specific status codes.

Transport status may accompany the error.

It shall not replace the canonical Error Code.

---

# 36. Error Detail

Error detail shall expose enough information for corrective action without revealing:

* stack traces;
* secrets;
* internal paths;
* database details;
* implementation topology;
* sensitive content.

Diagnostics shall remain safe.

---

# 37. Retryability

Errors may declare whether retry is:

* Safe;
* Conditionally Safe;
* Unsafe;
* Unknown.

Retryability shall reflect idempotency and execution semantics.

Clients shall not infer retryability solely from transport failures.

---

# 38. Correlation

Every significant Public API request shall support correlation metadata.

Correlation may include:

* Correlation Identity;
* Request Identity;
* Causation Identity;
* Operation Identity;
* Trace Reference.

Correlation supports:

* diagnostics;
* tracing;
* auditability;
* distributed execution;
* client support.

---

# 39. Correlation Identity

A client may provide a Correlation Identity.

KnowledgeOS may generate one when absent.

The returned value shall allow the interaction to be traced across architectural boundaries.

---

# 40. Request Identity

A Request Identity identifies one public API invocation.

It is distinct from:

* Correlation Identity;
* Operation Identity;
* Idempotency Key;
* resource identity.

These concepts shall not be conflated.

---

# 41. Idempotency

State-changing Public API operations shall define idempotency semantics.

An operation may be:

* inherently idempotent;
* idempotent through an Idempotency Key;
* conditionally idempotent;
* non-idempotent.

Idempotency shall never be assumed universally.

---

# 42. Idempotency Key

A client may provide an Idempotency Key for supported operations.

The key shall be scoped according to the operation contract.

Repeated requests with the same valid key and semantically equivalent input shall follow the declared idempotency guarantees.

---

# 43. Idempotency Conflict

Reuse of an Idempotency Key with semantically different input shall produce an explicit conflict.

The system shall never silently reinterpret the key.

---

# 44. Idempotency Retention

The retention period for Idempotency Keys shall be explicit.

Clients shall not assume indefinite retention.

Retention may depend upon:

* operation type;
* security policy;
* storage policy;
* execution profile.

---

# 45. Concurrency Control

Public APIs shall expose concurrency control where required.

Mechanisms may include:

* expected version;
* ETag;
* revision;
* conditional update;
* lease;
* lock token.

Concurrency control shall protect Platform semantics without exposing storage internals.

---

# 46. Optimistic Concurrency

Optimistic concurrency may require an expected public version.

Conceptually:

```text
Read Version 7
        │
        ▼
Submit Update expecting Version 7
        │
        ├── Current Version 7 → Apply
        └── Current Version 8 → Conflict
```

Conflict shall be explicit.

---

# 47. Version Conflict

A Version Conflict indicates that the submitted operation was based on stale state.

The error should provide safe metadata such as:

* expected version;
* current version reference;
* affected resource;
* resolution guidance where appropriate.

The API shall not resolve semantic conflicts silently.

---

# 48. Partial Updates

Public APIs may support partial updates only when semantics are unambiguous.

Partial updates shall define:

* omitted-field behavior;
* null behavior;
* validation;
* concurrency;
* idempotency;
* immutable-field behavior.

Ambiguous merge behavior is prohibited.

---

# 49. Replace Operations

A replace operation provides a complete new public representation for the mutable scope.

Replace semantics shall not permit modification of immutable identity or protected provenance unless explicitly allowed.

---

# 50. Pagination

Queries returning potentially large collections shall support pagination.

Pagination shall define:

* page or cursor model;
* page size limits;
* continuation semantics;
* ordering requirements;
* consistency expectations.

Unbounded result sets are discouraged.

---

# 51. Cursor Pagination

Cursor-based pagination is preferred when:

* collections are large;
* data changes frequently;
* stable traversal is required;
* offset cost is high.

Cursors shall be opaque.

Clients shall not construct or interpret them.

---

# 52. Offset Pagination

Offset pagination may be used for stable or bounded collections.

Its limitations shall be documented where concurrent changes may cause:

* duplicates;
* omissions;
* unstable pages.

---

# 53. Pagination Stability

Pagination shall define whether results represent:

* a stable snapshot;
* current state per page;
* best-effort traversal.

Clients shall not assume snapshot consistency unless guaranteed.

---

# 54. Page Size

Public APIs shall define:

* default page size;
* maximum page size;
* minimum page size where relevant.

Excessive client values shall be rejected or bounded explicitly.

---

# 55. Filtering

Collection Queries may support filtering.

Filters shall be:

* documented;
* typed;
* bounded;
* capability-oriented;
* protected against implementation leakage.

Public APIs shall not expose raw internal database query languages by default.

---

# 56. Sorting

Collection Queries may support sorting.

Sort fields shall be explicitly documented.

Stable secondary ordering should be defined when required for deterministic pagination.

---

# 57. Search and Filtering Separation

General collection filtering and Knowledge Search are distinct.

```text
Filtering
    │
    └── Restricts a known collection.

Search
    │
    └── Executes retrieval through the Search Engine.
```

Public API design shall not collapse Search semantics into generic filter parameters.

---

# 58. Field Selection

Public APIs may support explicit field selection or projection.

Projection shall expose approved public fields only.

It shall never allow arbitrary internal property access.

---

# 59. Expansion

A public response may support expansion of related representations.

Expansion shall define:

* supported relationships;
* depth limits;
* authorization;
* performance limits;
* cycle prevention.

Unlimited recursive expansion is prohibited.

---

# 60. Bulk Operations

Public APIs may support bulk Commands or Queries.

Bulk semantics shall define:

* maximum item count;
* ordering;
* atomicity;
* partial success;
* per-item errors;
* idempotency;
* cancellation.

Bulk does not imply transactional atomicity.

---

# 61. Bulk Atomicity

A bulk operation may be:

* Fully Atomic;
* Group Atomic;
* Per-Item Independent;
* Best Effort.

Atomicity semantics shall be explicit.

---

# 62. Partial Success

Bulk operations may produce partial success.

The response shall identify, per item:

* success;
* failure;
* warning;
* result reference;
* retryability.

Partial success shall never be represented as unqualified success.

---

# 63. Rate Limiting

Public APIs may enforce rate limits.

Rate-limit metadata may include:

* limit;
* remaining allowance;
* reset time;
* retry-after guidance;
* scope.

Rate limiting shall remain independent from authorization.

---

# 64. Quotas

Some capabilities may be governed by quotas.

Examples include:

* storage;
* AI execution;
* export volume;
* synchronization traffic;
* Plugin operations.

Quota failure shall produce an explicit public error.

---

# 65. Localization

Public API requests may declare locale where relevant.

Locale may affect:

* human-readable messages;
* formatting;
* language preference;
* AI execution hints.

Locale shall not change canonical semantics.

---

# 66. Time Representation

Public APIs shall use explicit and unambiguous time representations.

Time values shall define:

* instant or local time;
* time zone;
* precision;
* calendar assumptions.

Canonical timestamps should represent instants where possible.

---

# 67. Time Zones

Time-zone-sensitive operations shall require explicit time-zone context.

Implicit server-local time is prohibited in public contracts.

---

# 68. Numeric Precision

Public API contracts shall define numeric precision where ambiguity could affect correctness.

Examples include:

* confidence values;
* progress;
* coordinates;
* dimensions;
* monetary values;
* storage sizes.

Binary floating-point assumptions shall not remain implicit.

---

# 69. Enumeration Evolution

Public Enumerations may evolve.

Clients shall not assume all future values are known unless the Contract declares a closed Enumeration.

The API shall distinguish:

* Open Enumeration;
* Closed Enumeration.

---

# 70. Null and Absence

Public API Contracts shall distinguish where required between:

* field absent;
* explicit null;
* empty collection;
* empty string;
* unknown value;
* not applicable.

These states shall not be conflated.

---

# 71. Defaults

Default behavior shall be explicit.

Defaults shall not:

* expand permissions;
* enable external transmission;
* incur paid execution silently;
* alter canonical authority;
* reduce privacy.

Security- and privacy-relevant choices require explicit intent.

---

# 72. Compatibility

Public API compatibility shall be evaluated semantically.

Compatibility includes:

* operation semantics;
* input semantics;
* output semantics;
* error semantics;
* security semantics;
* pagination semantics;
* idempotency semantics.

Matching field structure alone is insufficient.

---

# 73. Additive Evolution

Compatible evolution may include:

* new optional fields;
* new optional operations;
* new open-enumeration values;
* additional metadata;
* new warnings.

Existing semantics shall remain unchanged.

---

# 74. Breaking Changes

Breaking changes include:

* removing operations;
* removing required fields;
* changing field meaning;
* changing authorization semantics;
* changing error semantics incompatibly;
* changing idempotency semantics;
* changing pagination semantics incompatibly.

Breaking changes require explicit API version evolution.

---

# 75. Deprecation

Deprecated Public API elements shall remain identifiable.

Deprecation metadata shall include:

* deprecated element;
* reason;
* replacement;
* migration guidance;
* compatibility period;
* retirement policy.

Deprecation shall be observable to clients.

---

# 76. Retirement

A retired API operation is unavailable for new execution.

Historical documentation and compatibility metadata should remain traceable.

Retirement shall never occur silently.

---

# 77. Authentication

Every protected Public API operation shall require an authenticated principal.

Authentication mechanism details are defined in `Authentication.md`.

Public API conventions require only that identity be established before protected execution.

---

# 78. Authorization

Authorization shall evaluate:

* principal;
* requested capability;
* action;
* resource;
* scope;
* policy;
* execution context.

Authentication does not imply authorization.

---

# 79. Least Privilege

Public API operations shall expose the minimum authority required.

Preferred:

```text
Annotation.Create
```

Avoid:

```text
Platform.WriteEverything
```

API granularity shall reinforce security boundaries.

---

# 80. Sensitive Data

Public APIs handling sensitive data shall define:

* access requirements;
* transmission requirements;
* logging restrictions;
* retention behavior;
* response minimization.

Sensitive data shall not appear in generic error metadata.

---

# 81. Privacy

Public APIs shall expose only the minimum data required for the requested capability.

Responses shall be scoped according to:

* authorization;
* resource ownership;
* Workspace;
* Library;
* user policy;
* privacy classification.

---

# 82. Public API Observability

Every significant public interaction shall be observable.

Observable metadata may include:

* API operation;
* API version;
* principal class;
* result status;
* duration;
* error category;
* correlation identity;
* request size;
* response size.

Canonical content shall not be logged by default.

---

# 83. Metrics

Public API metrics may include:

* request count;
* success rate;
* failure rate;
* latency;
* cancellation;
* rate-limit events;
* authorization failures;
* compatibility failures;
* deprecated operation usage;
* asynchronous Operation duration.

Metrics shall preserve privacy.

---

# 84. Tracing

Public API requests may participate in distributed or local tracing.

A trace may represent:

```text
External Request
        │
        ▼
Authentication
        │
        ▼
Authorization
        │
        ▼
Integration Adapter
        │
        ▼
Platform Contract
        │
        ▼
Platform Execution
        │
        ▼
Public Response
```

Tracing shall not expose raw sensitive payloads by default.

---

# 85. Auditability

Security-sensitive or state-changing operations may require audit records.

Audit metadata may include:

* principal;
* operation;
* resource reference;
* result;
* timestamp;
* correlation;
* authorization decision;
* relevant policy version.

Audit records shall be immutable.

---

# 86. API Documentation

Every Public API operation shall be documented.

Documentation shall include:

* purpose;
* owner;
* version;
* category;
* inputs;
* outputs;
* errors;
* permissions;
* idempotency;
* concurrency;
* lifecycle status;
* examples where appropriate.

Undocumented public operations are prohibited.

---

# 87. API Discoverability

KnowledgeOS may expose machine-readable API metadata.

Discoverable metadata may include:

* available operations;
* versions;
* capabilities;
* deprecated elements;
* error definitions;
* authentication requirements.

Discovery shall expose only public information.

---

# 88. API Testing

Public APIs shall support contract testing.

Tests may verify:

* request validation;
* response structure;
* error behavior;
* authentication;
* authorization;
* idempotency;
* concurrency;
* pagination;
* compatibility.

Contract tests preserve API stability.

---

# 89. Public API Invariants

The following invariants apply.

* Public APIs belong to the Integration layer.
* Public APIs expose approved Platform capabilities.
* Public APIs never expose Engine internals.
* Public APIs never expose persistence models directly.
* Every public operation has exactly one architectural owner.
* Commands and Queries have distinct semantics.
* Queries do not modify canonical state.
* Long-running work uses explicit asynchronous Operation semantics where appropriate.
* Public identities remain independent from implementation topology.
* Internal exceptions never cross the Public API boundary.
* Error Codes remain stable and machine-readable.
* Correlation is supported for significant interactions.
* Idempotency semantics are explicit.
* Concurrency semantics are explicit where required.
* Pagination semantics are explicit.
* Bulk atomicity is explicit.
* Partial success is explicit.
* Security-relevant defaults never expand authority.
* Compatibility is semantic.
* Breaking changes require explicit version evolution.
* Deprecation is explicit.
* Authentication and authorization remain separate.
* Public API execution remains observable.
* Canonical content is not logged by default.
* Public APIs remain technology-independent.

---

# 90. Prohibited Behaviors

Public APIs shall never:

* expose internal Engine services;
* expose internal repositories;
* expose database schemas as public models;
* expose filesystem paths as canonical identities;
* leak internal exceptions;
* return stack traces;
* depend upon undocumented behavior;
* silently change operation semantics;
* silently expand authorization;
* silently change local execution to remote execution;
* silently incur paid execution;
* use transport success as proof of Platform success;
* represent partial success as complete success;
* assume all Commands are idempotent;
* expose unbounded collection queries by default;
* accept arbitrary internal query languages;
* interpret opaque public identifiers;
* bypass Platform contracts;
* bypass Kernel execution;
* mutate canonical knowledge through Queries.

---

# 91. Related Documents

* `REST.md`
* `GraphQL.md`
* `LocalAPI.md`
* `Authentication.md`
* `Versioning.md`
* `../README.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/Compatibility.md`
* `../../04-Platform/README.md`
* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/QueryBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Observability.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 92. Status

**Approved**

This document defines the universal conventions governing all KnowledgeOS Public APIs.

Public APIs expose stable Platform capabilities through explicit, versioned and technology-independent contracts.

They preserve architectural isolation by translating external interactions into approved Commands, Queries, Operations and Events without exposing Domain, Kernel, Platform or persistence internals.

Public API behavior is explicit, secure, observable, compatible and predictable across REST, GraphQL, Local API and future interaction styles.
