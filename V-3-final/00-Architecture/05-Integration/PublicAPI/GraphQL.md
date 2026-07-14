
# GraphQL API

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Public API

**Document:** GraphQL

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural conventions governing the KnowledgeOS GraphQL API.

The GraphQL API exposes approved Platform capabilities through a stable, versioned and graph-oriented public Schema.

GraphQL defines how external clients query and invoke public capabilities.

It does not redefine Platform semantics.

It does not expose internal Domain, Kernel, Engine or persistence implementation.

---

# 2. Scope

This document governs:

* GraphQL Schema design;
* public Types;
* Fields;
* Arguments;
* Queries;
* Mutations;
* Subscriptions;
* Connections;
* pagination;
* filtering;
* sorting;
* nullability;
* input objects;
* interfaces;
* unions;
* Enumerations;
* custom Scalars;
* asynchronous Operations;
* error representation;
* authorization;
* complexity controls;
* batching;
* caching;
* deprecation;
* compatibility;
* observability.

This document does not govern:

* Platform business logic;
* internal object graphs;
* internal Domain entities;
* database relationships;
* ORM models;
* Provider-specific interfaces;
* REST semantics;
* Local API transport;
* authentication protocol internals;
* private Event Bus subscriptions.

---

# 3. Definition of the GraphQL API

The KnowledgeOS GraphQL API is a public query and mutation surface represented through a documented GraphQL Schema.

The Schema defines:

* public object Types;
* public input Types;
* Queries;
* Mutations;
* Subscriptions;
* Field semantics;
* authorization requirements;
* error semantics;
* compatibility obligations;
* deprecation status.

The GraphQL Schema is a public contract.

It is not an introspected copy of internal classes or persistence models.

---

# 4. Architectural Position

The GraphQL API belongs to the Integration layer.

```text
GraphQL Client
        │
        ▼
GraphQL Boundary
        │
        ▼
GraphQL Adapter
        │
        ▼
Public API Contract
        │
        ▼
Platform Command / Query / Event
        │
        ▼
Platform Engine
```

Resolvers translate GraphQL operations into approved Platform contracts.

Resolvers shall never access Engine internals directly.

---

# 5. Mission

The mission of the GraphQL API is to provide a flexible, typed and discoverable public interaction surface while preserving:

* architectural isolation;
* semantic stability;
* predictable authorization;
* bounded execution;
* compatibility;
* observability;
* privacy;
* long-term maintainability.

Client flexibility shall not compromise Platform boundaries.

---

# 6. Design Philosophy

The GraphQL API shall be:

* Schema First;
* capability-oriented;
* explicit;
* typed;
* bounded;
* secure by default;
* version-aware;
* discoverable;
* implementation-independent.

The Schema shall represent public architectural meaning.

It shall not expose internal implementation convenience.

---

# 7. Schema Ownership

The GraphQL Schema is composed from public capabilities owned by architectural components.

Every public Field shall have exactly one architectural owner.

Typical owners include:

* Knowledge Engine;
* Library Engine;
* Search Engine;
* Annotation Engine;
* Export Engine;
* Sync Engine;
* AI Engine;
* Plugin Engine;
* Integration services.

The GraphQL layer exposes semantics.

It does not become their owner.

---

# 8. Schema as Public Contract

Every stable GraphQL Type, Field, Argument, Mutation and Subscription is a public compatibility commitment.

A published Schema element shall not change meaning silently.

Schema evolution follows the policies defined in `Versioning.md`.

---

# 9. Schema Boundaries

The GraphQL Schema shall expose only approved public concepts.

It shall never expose:

* internal repositories;
* internal services;
* database rows;
* ORM relations;
* mutable Domain internals;
* private Kernel objects;
* Provider SDK types;
* filesystem paths;
* internal Event payloads.

The Schema boundary protects internal architecture.

---

# 10. Public Graph Model

GraphQL exposes a public graph of approved relationships.

The public graph may include relationships such as:

```text
Library
    │
    ├── contains → Knowledge Objects
    ├── exposes → Collections
    └── references → Assets
```

The public graph is a designed external projection.

It is not the complete internal Knowledge Graph.

---

# 11. GraphQL Types

Public object Types represent stable external views of Platform-managed concepts.

Typical Types may include:

* KnowledgeObject;
* KnowledgeObjectVersion;
* Library;
* Annotation;
* Asset;
* SearchResult;
* ExportOperation;
* SynchronizationOperation;
* Provider;
* Plugin;
* Capability;
* Error;
* PageInfo.

Public Types shall remain independent from internal persistence models.

---

# 12. Type Identity

Every publicly addressable object Type should expose stable identity where applicable.

Identity shall remain independent from:

* database primary keys;
* filesystem paths;
* object-store keys;
* process-local identity;
* internal implementation classes.

Public identity shall follow Domain and Public API identity rules.

---

# 13. Global Object Identity

KnowledgeOS may expose global object identity where appropriate.

A global identity model may support:

* consistent object references;
* cache normalization;
* node lookup;
* cross-Type linking.

Opaque identifiers shall not expose internal implementation details.

---

# 14. Node Model

KnowledgeOS may define a public `Node` interface for globally identifiable GraphQL objects.

Conceptually:

```graphql
interface Node {
  id: ID!
}
```

Implementing `Node` does not imply that every internal Domain object is externally addressable.

Only approved public objects participate.

---

# 15. Root Query

The root `Query` Type exposes side-effect-free public retrieval capabilities.

Typical Fields may include:

```graphql
type Query {
  knowledgeObject(id: ID!): KnowledgeObject
  library(id: ID!): Library
  search(input: SearchInput!): SearchConnection!
  operation(id: ID!): Operation
  plugins(filter: PluginFilter): PluginConnection!
}
```

Root Queries shall not mutate canonical state.

---

# 16. Queries

GraphQL Queries retrieve public information.

Queries shall:

* remain side-effect free at the architectural level;
* enforce authorization per Field and Resource;
* define pagination;
* define consistency expectations;
* avoid unrestricted traversal;
* avoid internal query-language exposure.

Query execution may populate caches or telemetry without violating canonical Query semantics.

---

# 17. Root Mutation

The root `Mutation` Type exposes approved state-changing Commands.

Typical Fields may include:

```graphql
type Mutation {
  createAnnotation(input: CreateAnnotationInput!): CreateAnnotationPayload!
  startExport(input: StartExportInput!): StartExportPayload!
  startSynchronization(input: StartSynchronizationInput!): StartSynchronizationPayload!
  enablePlugin(input: EnablePluginInput!): EnablePluginPayload!
}
```

Mutations express public intent.

They shall not map directly to arbitrary internal methods.

---

# 18. Mutations

GraphQL Mutations shall:

* correspond to approved public Commands;
* use explicit input objects;
* return explicit payload objects;
* define authorization;
* define idempotency where applicable;
* define concurrency semantics;
* expose asynchronous Operation References when required.

Mutation order within one GraphQL operation follows GraphQL execution semantics.

It shall not be treated as a hidden Platform transaction.

---

# 19. Mutation Input Objects

Every non-trivial Mutation shall use a dedicated input object.

Preferred:

```graphql
input CreateAnnotationInput {
  clientMutationId: String
  knowledgeObjectId: ID!
  anchor: AnnotationAnchorInput!
  content: AnnotationContentInput!
  expectedVersion: String
}
```

Avoid large sets of unrelated scalar arguments.

Input objects improve evolution, validation and documentation.

---

# 20. Mutation Payload Objects

Every Mutation should return a dedicated payload object.

Example:

```graphql
type CreateAnnotationPayload {
  annotation: Annotation
  operation: Operation
  warnings: [Warning!]!
  errors: [UserError!]!
  clientMutationId: String
}
```

Payload objects allow compatible additive evolution.

---

# 21. Client Mutation Identity

Mutations may support a client-provided mutation or correlation identity.

This identity may assist:

* client reconciliation;
* optimistic user interfaces;
* correlation;
* duplicate detection.

It shall not automatically replace the canonical Idempotency Key.

---

# 22. Idempotency

GraphQL Mutations shall define idempotency semantics.

A Mutation may be:

* inherently idempotent;
* idempotent through an explicit input key;
* conditionally idempotent;
* non-idempotent.

GraphQL transport alone does not define idempotency.

---

# 23. Idempotency Key

Supported Mutations may accept an Idempotency Key in:

* a defined input field;
* approved request metadata;
* transport extension metadata.

Its scope shall include:

* Principal or client;
* Mutation identity;
* API or Contract Version;
* semantic input fingerprint.

---

# 24. Idempotency Conflict

Reuse of an Idempotency Key with different semantic input shall produce an explicit conflict.

The Mutation shall not execute the conflicting request.

---

# 25. Concurrency Control

Mutations affecting versioned Resources shall expose concurrency controls where required.

Typical mechanisms include:

* expected Version;
* expected Revision;
* expected ETag;
* conditional state;
* lease reference.

Lost-update protection shall not depend upon hidden persistence behavior.

---

# 26. Expected Version

An input may include an expected public Resource Version.

Example:

```graphql
input UpdateAnnotationInput {
  annotationId: ID!
  expectedVersion: String!
  content: AnnotationContentInput!
}
```

A mismatch produces a public conflict error.

---

# 27. Partial Updates

Partial update Mutations shall define:

* omitted-field behavior;
* explicit null behavior;
* immutable-field behavior;
* validation;
* concurrency;
* idempotency.

Generic unrestricted patch maps are prohibited.

---

# 28. Deletion Mutations

Deletion shall use explicit public semantics.

Examples may include:

* deleteAnnotation;
* removePlugin;
* archiveKnowledgeObject;
* requestPermanentDeletion.

A deletion Mutation shall identify whether it performs:

* logical deletion;
* archival;
* tombstone creation;
* collection removal;
* permanent erasure.

---

# 29. Asynchronous Mutations

Long-running Mutations shall return an Operation Reference.

Example:

```graphql
type StartExportPayload {
  operation: ExportOperation!
  warnings: [Warning!]!
  errors: [UserError!]!
}
```

Mutation success means the Operation was accepted according to the Contract.

It does not mean the long-running work completed.

---

# 30. Operation Interface

KnowledgeOS may define a public Operation interface.

Conceptually:

```graphql
interface Operation {
  id: ID!
  state: OperationState!
  createdAt: DateTime!
  updatedAt: DateTime!
  progress: OperationProgress
  warnings: [Warning!]!
  error: OperationError
}
```

Operation lifecycle semantics remain defined by `APIConventions.md`.

---

# 31. Operation Implementations

Specific Operation Types may include:

* ImportOperation;
* ExportOperation;
* SynchronizationOperation;
* AIExecutionOperation;
* PluginValidationOperation;
* ReindexOperation.

Each Type may expose capability-specific result information.

---

# 32. Operation Cancellation

Cancelable Operations may expose an explicit Mutation.

Example:

```graphql
cancelOperation(input: CancelOperationInput!): CancelOperationPayload!
```

Cancellation shall not be implied by deleting the Operation object.

---

# 33. Root Subscription

The root `Subscription` Type exposes approved public event streams.

Typical Subscriptions may include:

```graphql
type Subscription {
  operationUpdated(operationId: ID!): OperationUpdate!
  libraryChanged(libraryId: ID!): LibraryChangeEvent!
  annotationChanged(knowledgeObjectId: ID!): AnnotationChangeEvent!
}
```

Subscriptions expose public Events.

They do not expose the internal Event Bus directly.

---

# 34. Subscription Semantics

Every Subscription shall define:

* Event Identity;
* Event Version;
* authorization scope;
* delivery semantics;
* ordering guarantees;
* replay support;
* resumption behavior;
* disconnect behavior;
* error behavior.

Subscription availability shall not be assumed for every public Event.

---

# 35. Event Projection

GraphQL Subscription payloads are public projections of approved Events.

Internal Event payloads shall be translated before exposure.

A public Subscription shall never serialize private internal Event objects directly.

---

# 36. Subscription Authorization

Authorization shall be evaluated:

* when the Subscription is established;
* when protected Event payloads are delivered;
* when relevant authorization state changes.

A valid initial Subscription shall not guarantee indefinite delivery after permission revocation.

---

# 37. Subscription Identity

A Subscription may have a runtime identity for:

* cancellation;
* resumption;
* observability;
* diagnostics;
* quota enforcement.

Subscription identity is distinct from Event identity.

---

# 38. Subscription Resumption

Subscriptions may support resumption using:

* cursor;
* Event sequence;
* checkpoint;
* last-seen Event identity.

Resumption guarantees shall be explicit.

Unsupported replay shall not be simulated silently.

---

# 39. Event Ordering

Subscriptions shall define ordering guarantees.

Possible semantics include:

* per Resource order;
* per aggregate order;
* per Subscription order;
* best effort;
* no guaranteed global order.

Clients shall not assume global ordering unless explicitly guaranteed.

---

# 40. Duplicate Events

Subscription delivery may be at-least-once where required by transport.

Clients may receive duplicate Event projections.

Event identity or delivery metadata should support duplicate detection when applicable.

---

# 41. Subscription Transport

GraphQL Subscriptions may use:

* WebSocket;
* Server-Sent Events;
* local IPC stream;
* another approved transport.

Transport choice shall not redefine Event semantics.

---

# 42. Subscription Backpressure

Subscription transport shall define behavior when consumers cannot keep pace.

Possible policies include:

* bounded buffering;
* disconnect;
* event coalescing where semantically safe;
* resumption requirement;
* overflow error.

Silent unbounded buffering is prohibited.

---

# 43. Schema Naming

GraphQL names shall describe public architectural meaning.

Preferred:

```graphql
KnowledgeObject
SearchConnection
StartExportInput
EnablePluginPayload
```

Avoid:

```graphql
KnowledgeEntityORM
SearchServiceResponse
PluginRepositoryRecord
```

Internal implementation terminology shall not leak into the Schema.

---

# 44. Field Naming

Field names shall be:

* clear;
* stable;
* consistent;
* domain-appropriate;
* free of transport or storage implementation names.

Fields shall normally use lower camel case according to GraphQL conventions.

---

# 45. Type Naming

Type names shall normally use PascalCase.

Input Types should use the `Input` suffix.

Mutation payloads should use the `Payload` suffix.

Connections should use the `Connection` suffix.

Edges should use the `Edge` suffix.

Enums should use descriptive singular names.

---

# 46. Scalar Fields

Scalar Fields shall expose stable public values.

The Schema shall not use generic string fields when a more explicit custom Scalar or Enum is required for correctness.

---

# 47. Custom Scalars

KnowledgeOS may define custom Scalars such as:

* DateTime;
* Date;
* Duration;
* URI;
* JSON;
* Decimal;
* Locale;
* LanguageTag;
* ContentHash;
* Cursor.

Every custom Scalar shall define:

* serialization;
* parsing;
* validation;
* canonical representation;
* precision;
* failure semantics.

---

# 48. JSON Scalar

A generic JSON Scalar shall be used sparingly.

It may be appropriate for:

* explicitly extensible metadata;
* externally defined structured payloads;
* opaque Provider metadata when approved.

It shall not replace designed public Types.

---

# 49. Date and Time

Date and time Scalars shall use explicit, unambiguous representations.

A `DateTime` value should represent an instant with explicit offset or UTC semantics.

Implicit server-local time is prohibited.

---

# 50. Numeric Precision

Custom Scalars shall be used when standard GraphQL numeric types cannot preserve required precision.

Examples include:

* large counters;
* byte sizes;
* monetary values;
* high-precision coordinates;
* hashes;
* revision identifiers.

Precision shall never be lost silently.

---

# 51. Enumerations

GraphQL Enums shall declare whether their semantics are effectively open or closed for compatibility planning.

GraphQL clients often generate closed language Enumerations.

Therefore, adding Enum values may break poorly designed clients even when the Schema change is additive.

Enum evolution requires compatibility review.

---

# 52. Open Value Patterns

Where future values must be tolerated, KnowledgeOS may use:

* string-backed custom Scalars;
* value objects;
* known-value plus raw-value structures.

This may be preferable to a closed GraphQL Enum.

---

# 53. Nullability

GraphQL nullability is a public compatibility commitment.

A non-null Field guarantees that successful resolution produces a value.

Changing:

```graphql
String
```

to:

```graphql
String!
```

may be breaking for inputs.

Changing:

```graphql
String!
```

to:

```graphql
String
```

may be breaking for outputs.

Nullability changes require explicit review.

---

# 54. Null Semantics

The Schema shall distinguish where required between:

* absent input field;
* explicit null;
* empty value;
* unknown value;
* inaccessible value;
* failed Field resolution.

These states shall not be conflated.

---

# 55. Non-Null Propagation

GraphQL non-null error propagation may nullify parent Fields.

Schema designers shall avoid broad non-null chains where one recoverable child failure would erase useful parent data.

Nullability shall reflect actual public guarantees.

---

# 56. Input Nullability

Input Fields shall define:

* required presence;
* optional absence;
* explicit null behavior;
* default value;
* clear semantics.

Defaults shall not expand authority or change privacy behavior silently.

---

# 57. Interfaces

GraphQL Interfaces may represent shared public contracts.

Examples may include:

* Node;
* Operation;
* SearchResult;
* Provider;
* KnowledgeReference.

Interfaces shall reflect stable shared semantics.

They shall not mirror internal language interfaces.

---

# 58. Unions

GraphQL Unions may represent alternative public result Types.

Examples may include:

* SearchResultItem;
* AnnotationTarget;
* ExportArtifact;
* CapabilityImplementation.

Union membership evolution requires client compatibility consideration.

---

# 59. Type Resolution

Interface and Union Type resolution shall depend upon approved public Type metadata.

It shall not expose internal class names or implementation package identifiers.

---

# 60. Input Polymorphism

GraphQL lacks universal native input unions in many implementations.

KnowledgeOS shall model input polymorphism explicitly through:

* tagged input objects;
* one-of semantics;
* separate Mutations;
* validated discriminator fields.

Ambiguous combinations shall fail validation.

---

# 61. Connections

Large collections shall use a Connection model.

A Connection may include:

```graphql
type AnnotationConnection {
  edges: [AnnotationEdge!]!
  nodes: [Annotation!]!
  pageInfo: PageInfo!
  totalCount: Int
}
```

Connection semantics shall remain consistent across the Schema.

---

# 62. Edges

An Edge may contain:

* cursor;
* node;
* relationship-specific metadata.

Edge metadata shall describe the public relationship.

It shall not expose internal join-table records.

---

# 63. PageInfo

The common `PageInfo` Type may expose:

* hasNextPage;
* hasPreviousPage;
* startCursor;
* endCursor.

Cursor semantics remain governed by `APIConventions.md`.

---

# 64. Cursor Pagination

Cursor pagination is preferred for large or changing collections.

Typical Arguments include:

```graphql
first: Int
after: Cursor
last: Int
before: Cursor
```

Maximum limits shall be enforced.

---

# 65. Cursor Opacity

GraphQL cursors shall be opaque.

Clients shall not decode, construct or modify them.

Cursors shall be bound to:

* Field;
* filter;
* sort;
* API contract;
* authorization context;
* representation semantics.

---

# 66. Offset Pagination

Offset pagination may be supported for bounded or stable collections.

Its limitations under concurrent change shall be documented.

Offset pagination shall not be used merely because it mirrors database implementation.

---

# 67. Filtering

Collection Fields may accept typed filter input objects.

Example:

```graphql
input AnnotationFilter {
  knowledgeObjectId: ID
  status: AnnotationStatus
  createdAfter: DateTime
  authorId: ID
}
```

Filters shall expose approved public semantics only.

---

# 68. Filter Composition

Filters may support logical composition when bounded and justified.

Examples include:

* `and`;
* `or`;
* `not`.

Complexity shall be limited.

Raw internal query expressions are prohibited.

---

# 69. Sorting

Sorting shall use typed sort input.

Example:

```graphql
input AnnotationSort {
  field: AnnotationSortField!
  direction: SortDirection!
}
```

Only documented public Fields may be sorted.

Stable tie-breaking shall be defined for pagination.

---

# 70. Search and Graph Traversal

Knowledge Search shall be exposed through Search Engine contracts.

GraphQL clients shall not recreate unrestricted Search by traversing deeply connected Fields.

Search and relationship traversal remain distinct capabilities.

---

# 71. Field Arguments

Field Arguments shall:

* be typed;
* be documented;
* have explicit defaults;
* avoid implementation-specific options;
* support validation;
* remain bounded.

Arguments shall not expose Provider SDK parameters unless the public capability explicitly permits them.

---

# 72. Field Selection Semantics

GraphQL allows clients to select Fields.

Field selection controls response shape.

It does not change operation authorization or core semantic scope automatically.

Requesting fewer Fields does not grant broader access.

---

# 73. Field Authorization

Authorization may apply at:

* operation level;
* object level;
* Field level;
* relationship level;
* item level.

The Schema shall avoid surprising partial disclosure.

Authorization behavior shall be explicit.

---

# 74. Hidden Fields

A Field unavailable to the current Principal may result in:

* authorization error;
* null with error where contractually appropriate;
* omission through Schema partitioning;
* operation denial.

The selected model shall remain consistent and avoid Resource-existence leakage.

---

# 75. Resolver Responsibilities

Resolvers are Integration Adapters.

Resolvers are responsible for:

* validating public inputs;
* obtaining Authentication Context;
* invoking authorization;
* translating to Platform Commands or Queries;
* mapping public results;
* mapping canonical errors;
* preserving correlation;
* applying Field-level policies.

Resolvers are not responsible for Platform business logic.

---

# 76. Resolver Prohibitions

Resolvers shall never:

* access databases directly;
* access repositories directly;
* mutate Domain objects directly;
* call private Engine services;
* execute vendor SDKs;
* implement synchronization semantics;
* implement AI orchestration;
* bypass Command Bus or Query Bus where required.

Thin resolvers preserve architectural boundaries.

---

# 77. Data Loaders

GraphQL implementations may use request-scoped batching and caching mechanisms such as Data Loaders.

These mechanisms may reduce duplicate retrieval.

They shall:

* remain request-scoped unless broader caching is explicitly safe;
* preserve authorization;
* preserve ordering;
* avoid cross-Principal leakage;
* avoid changing Query semantics.

---

# 78. N+1 Prevention

GraphQL implementations shall prevent uncontrolled repeated downstream Queries.

Mitigations may include:

* batching;
* prefetch planning;
* projection-aware Queries;
* bounded relationship loading;
* request-scoped caches.

Optimization shall not expose internal persistence assumptions publicly.

---

# 79. Resolver Batching

Batching shall preserve:

* input-to-output correspondence;
* authorization per item;
* error isolation;
* deterministic ordering where required.

A batch is not automatically transactional.

---

# 80. Resolver Caching

Resolver caches shall include relevant context such as:

* Principal;
* authorization scope;
* Locale;
* API contract;
* Resource Revision;
* representation profile.

Cross-context cache reuse is prohibited.

---

# 81. Query Complexity

GraphQL allows clients to request complex nested selections.

KnowledgeOS shall enforce execution complexity limits.

Complexity evaluation may consider:

* Field cost;
* nesting depth;
* collection size;
* requested page size;
* expensive Capabilities;
* recursive relationships;
* external Provider calls.

---

# 82. Depth Limits

The GraphQL API may enforce maximum query depth.

Depth limits reduce:

* recursive expansion;
* resource exhaustion;
* accidental large requests;
* denial-of-service risk.

Depth alone is not a complete cost model.

---

# 83. Field Cost

Fields may have declared cost weights.

Examples include:

* scalar Field;
* local relationship;
* Search execution;
* AI execution;
* remote Provider lookup;
* large Asset metadata;
* aggregate count.

Cost metadata supports deterministic complexity evaluation.

---

# 84. Multiplicative Cost

Collection Fields may multiply child Field cost by requested or maximum page size.

Complexity evaluation shall avoid assuming small result counts when the client requests large collections.

---

# 85. Complexity Rejection

Requests exceeding allowed complexity shall fail before expensive Platform execution.

The error should identify:

* calculated cost;
* allowed limit;
* high-cost Fields where safe;
* mitigation guidance.

---

# 86. Persisted Operations

KnowledgeOS may support persisted GraphQL operations.

A persisted Operation associates a stable identifier with a validated GraphQL document.

Persisted operations may improve:

* security;
* performance;
* cacheability;
* compatibility control;
* mobile-client stability.

---

# 87. Persisted Operation Identity

Every persisted Operation shall have stable identity and Version.

Changing the GraphQL document or semantic expectations requires a new persisted Operation Version or identity.

---

# 88. Allowlisted Operations

High-security deployments may permit only approved persisted Operations.

Allowlisting shall remain environment- and policy-specific.

It shall not redefine the public Schema itself.

---

# 89. Automatic Persisted Queries

Automatic persisted-query mechanisms may reduce request size.

Unknown hashes shall not cause execution of unvalidated Operations without the required registration flow.

---

# 90. Query Documents

GraphQL operation documents shall define:

* operation type;
* operation name;
* variables;
* selection set;
* fragments.

Stable production operations should use explicit operation names.

Anonymous operations may be restricted.

---

# 91. Operation Naming

Public clients should name GraphQL operations.

Names support:

* observability;
* rate limiting;
* persisted operations;
* diagnostics;
* audit;
* complexity policy.

Operation names are client metadata.

They do not replace public Field identity.

---

# 92. Fragments

Fragments may improve reuse.

Fragment usage shall not bypass:

* complexity calculation;
* authorization;
* depth limits;
* Field deprecation warnings.

The expanded selection semantics remain authoritative.

---

# 93. Directives

KnowledgeOS may expose approved public Directives.

Possible uses include:

* deprecation;
* specified-by metadata;
* conditional inclusion;
* bounded custom behavior.

Custom Directives shall be minimal, documented and versioned.

---

# 94. Internal Directives

Implementation-only Directives shall not become part of the public Schema unless intentionally published.

Schema tooling metadata shall not leak private architecture.

---

# 95. Error Model

GraphQL errors shall preserve the canonical public error model.

A GraphQL error may include safe extensions such as:

* canonical Error Code;
* category;
* Field path;
* retryability;
* correlation identity;
* documentation reference.

Internal exceptions shall never cross the boundary.

---

# 96. Request Errors

Request-level errors may include:

* syntax errors;
* validation errors;
* unsupported operation;
* unknown Field;
* invalid Variable;
* complexity limit exceeded;
* unsupported persisted Operation.

These failures occur before normal resolver execution.

---

# 97. Field Errors

A Field may fail during execution.

GraphQL may return:

* partial data;
* Field error;
* null propagation according to Schema nullability.

Partial data shall never be represented as complete success without errors.

---

# 98. User Errors

Expected Mutation validation or business precondition failures may be exposed through typed payload errors where appropriate.

Example:

```graphql
type UserError {
  code: String!
  message: String!
  path: [String!]!
}
```

Transport-level GraphQL errors remain appropriate for authentication, authorization, execution and unexpected failures according to policy.

---

# 99. Partial Data

GraphQL may return partial data.

The client shall be able to distinguish:

* complete data;
* partial data with recoverable errors;
* operation failure;
* unauthorized Fields;
* unavailable optional Features.

Partial data semantics shall be explicit.

---

# 100. Error Path

GraphQL error paths identify the response location affected by the error.

They supplement canonical Error Codes.

They do not establish semantic error identity by themselves.

---

# 101. Error Masking

Unexpected internal errors shall be masked.

Public responses may include:

* generic safe message;
* canonical internal-failure code;
* correlation identity.

Detailed diagnostics belong to protected logs and traces.

---

# 102. Authentication

Protected GraphQL operations shall authenticate according to `Authentication.md`.

Authentication normally occurs before execution.

The resulting Authentication Context shall remain available to all resolvers in the request.

---

# 103. Authorization

Authorization shall be enforced for:

* root operations;
* Resources;
* Fields;
* relationships;
* Subscription delivery;
* Mutations;
* asynchronous Operation results.

Schema visibility alone does not grant authority.

---

# 104. Authorization Consistency

The same public capability shall preserve equivalent authorization semantics across:

* GraphQL;
* REST;
* Local API;
* SDK surfaces.

Transport choice shall not create an authorization bypass.

---

# 105. Introspection

GraphQL introspection may be available according to environment and policy.

Public introspection exposes the public Schema.

It shall not expose:

* internal resolver details;
* private Directives;
* implementation services;
* secret configuration;
* internal Types.

---

# 106. Restricted Introspection

Production or high-security environments may restrict introspection.

Restriction is a defense-in-depth measure.

It does not replace authorization, validation or complexity controls.

---

# 107. Schema Discovery

Clients may discover:

* Types;
* Fields;
* Arguments;
* deprecations;
* descriptions;
* custom Scalar specifications;
* supported Directives.

Discovery shall expose only stable public metadata.

---

# 108. Schema Documentation

Every public GraphQL element shall have documentation.

Descriptions should explain:

* semantic responsibility;
* nullability;
* authorization;
* pagination;
* lifecycle;
* deprecation;
* units;
* format;
* compatibility.

Schema descriptions supplement architecture documentation.

---

# 109. Versioning Strategy

GraphQL generally favors compatible additive Schema evolution.

KnowledgeOS shall avoid whole-Schema Version proliferation when compatible evolution is possible.

Breaking changes still require explicit version evolution according to `Versioning.md`.

---

# 110. Additive Evolution

Compatible GraphQL evolution may include:

* new optional Fields;
* new Types;
* new Mutations;
* new Queries;
* new optional Arguments with safe defaults;
* new Union members after compatibility review;
* new Interface implementations after compatibility review.

Client generation behavior shall be considered.

---

# 111. Breaking Changes

Breaking GraphQL changes include:

* removing a Field;
* renaming a Field;
* changing Field meaning;
* changing output nullability incompatibly;
* changing input nullability incompatibly;
* removing Enum values;
* adding required Arguments;
* changing Scalar serialization;
* changing authorization semantics;
* changing pagination semantics;
* changing Mutation side effects.

Breaking changes require explicit migration.

---

# 112. Deprecation

GraphQL Fields and Enum values may use standard deprecation metadata.

Deprecation shall include:

* reason;
* replacement;
* migration guidance;
* lifecycle status;
* planned retirement where known.

Deprecation metadata shall also exist outside Schema introspection where required.

---

# 113. Deprecated Field Usage

KnowledgeOS may observe usage of deprecated Fields.

Usage metrics support:

* migration planning;
* consumer identification;
* retirement readiness;
* support prioritization.

Field values shall not be logged merely for usage analysis.

---

# 114. Schema Generations

When unavoidable breaking changes affect broad Schema semantics, KnowledgeOS may expose a new GraphQL Schema generation.

Schema generations shall be explicit and independently documented.

A new generation is not required for every additive change.

---

# 115. Field-Level Versioning

Version suffixes in Field names should generally be avoided.

Example to avoid:

```graphql
knowledgeObjectV2
```

Prefer additive evolution, replacement Fields with meaningful names or a new Schema generation when necessary.

---

# 116. Capability Discovery

The GraphQL API may expose public Capability metadata.

Clients should use Capability discovery rather than infer support from Schema presence alone when runtime availability may vary.

Example:

```graphql
capabilities(filter: CapabilityFilter): CapabilityConnection!
```

Schema support and runtime Capability availability are distinct.

---

# 117. Provider Availability

GraphQL may expose authorized Provider and Capability health summaries.

It shall not expose secret configuration or private infrastructure details.

---

# 118. Caching

GraphQL response caching is more complex than REST caching because one request may combine many Resources.

Caching strategies may include:

* normalized client cache;
* persisted-operation cache;
* resolver cache;
* response cache for approved operations;
* Data Loader cache.

Every cache shall preserve authorization and Version context.

---

# 119. Normalized Client Caching

Stable public identities and Type names support normalized client caches.

Representation identity shall remain stable across internal storage migrations.

---

# 120. Response Caching

Whole-response caching may be used only when:

* operation identity is known;
* Variables are included in the cache key;
* Principal and authorization scope are included;
* Schema generation is included;
* Locale and representation context are included;
* Resource freshness is acceptable.

Shared caching of private responses is prohibited unless safely partitioned.

---

# 121. Cache Invalidation

Cache invalidation may use:

* Resource Revision;
* public Event;
* Operation completion;
* time-based policy;
* explicit invalidation.

Cache implementation shall not redefine canonical authority.

---

# 122. Incremental Delivery

GraphQL implementations may support incremental response delivery where standardized and compatible.

Possible mechanisms include deferred or streamed Fields.

Support shall be explicit.

Partial delivery shall preserve:

* ordering;
* completion;
* error semantics;
* cancellation;
* authorization.

---

# 123. File Upload

GraphQL file upload support shall be used cautiously.

Large or resumable binary uploads may be better exposed through dedicated REST or Local API flows.

GraphQL Mutations may create upload Operations or authorized upload references.

---

# 124. File Download

Large binary downloads should normally use authorized artifact references or dedicated binary endpoints.

Embedding large binary content directly in GraphQL responses is discouraged.

---

# 125. Cross-Surface References

GraphQL may return public links or references to REST or Local API artifact-transfer endpoints.

Cross-surface use shall preserve:

* authentication;
* authorization;
* Versioning;
* Resource identity;
* expiration;
* auditability.

---

# 126. Rate Limiting

GraphQL rate limiting may consider:

* Principal;
* client;
* operation name;
* persisted Operation identity;
* complexity;
* Mutation count;
* Subscription count;
* expensive Capability use.

Simple request count alone may be insufficient.

---

# 127. Quotas

GraphQL operations may consume Capability-specific quotas.

Examples include:

* AI execution;
* Search volume;
* export creation;
* synchronization Operations;
* Subscription count.

Quota failures shall use canonical public errors.

---

# 128. Timeout

GraphQL request execution shall have bounded timeout semantics.

Long-running work shall transition to asynchronous Operations rather than extending synchronous request duration indefinitely.

---

# 129. Cancellation

Transport disconnect may cancel eligible synchronous resolver work according to policy.

It shall not automatically cancel accepted asynchronous Operations.

Explicit Operation cancellation remains separate.

---

# 130. GraphQL Observability

Every significant GraphQL operation shall be observable.

Observable metadata may include:

* operation type;
* operation name;
* persisted Operation identity;
* Schema generation;
* selected root Fields;
* complexity score;
* depth;
* duration;
* error count;
* canonical Error Codes;
* Principal class;
* correlation identity;
* deprecated Field usage.

Raw Variables and sensitive results shall not be logged by default.

---

# 131. Field-Level Observability

Expensive or security-sensitive Fields may expose protected operational metrics.

Field-level tracing shall avoid excessive overhead and sensitive data capture.

---

# 132. Metrics

GraphQL metrics may include:

* Query count;
* Mutation count;
* Subscription count;
* operation latency;
* resolver latency;
* complexity rejections;
* depth rejections;
* authentication failures;
* authorization failures;
* persisted-operation usage;
* deprecated Field usage;
* Data Loader batch size;
* partial-response rate.

---

# 133. Tracing

GraphQL operations may participate in tracing.

A trace may represent:

```text
GraphQL Request
        │
        ▼
Parse and Validate
        │
        ▼
Authentication
        │
        ▼
Authorization
        │
        ▼
Complexity Evaluation
        │
        ▼
Resolver Execution
        │
        ▼
Platform Contracts
        │
        ▼
GraphQL Response
```

Trace payload capture shall be privacy-safe.

---

# 134. Audit

State-changing and security-sensitive Mutations may produce audit records.

Audit metadata may include:

* Principal Identity;
* Application Identity;
* Mutation identity;
* Resource reference;
* result;
* authorization decision;
* Schema generation;
* correlation identity;
* timestamp.

Audit records shall not contain secrets or unnecessary content.

---

# 135. Schema Validation

The GraphQL Schema shall be validated before publication.

Validation includes:

* Type correctness;
* naming;
* ownership;
* nullability;
* deprecation;
* authorization metadata;
* pagination consistency;
* custom Scalar definitions;
* unreachable Types;
* conflicting semantics;
* compatibility.

---

# 136. Contract Testing

Stable GraphQL operations shall have contract tests.

Tests may verify:

* Query behavior;
* Mutation behavior;
* Subscription behavior;
* input validation;
* output Types;
* nullability;
* errors;
* authorization;
* pagination;
* complexity;
* deprecation;
* compatibility.

---

# 137. Schema Compatibility Testing

Schema-diff tooling may detect structural changes.

Architectural review shall additionally detect semantic and behavioral incompatibility.

A structurally additive change may still be breaking.

---

# 138. Resolver Testing

Resolver tests shall verify translation between:

* GraphQL inputs;
* public API Contracts;
* Platform Commands and Queries;
* canonical errors;
* GraphQL payloads.

Tests shall not substitute for Platform Engine tests.

---

# 139. Subscription Testing

Subscription tests shall verify:

* authorization;
* filtering;
* Event Version;
* ordering;
* duplicate behavior;
* disconnect;
* resumption;
* permission revocation;
* backpressure.

---

# 140. GraphQL Invariants

The following invariants apply.

* GraphQL belongs to the Integration layer.
* The GraphQL Schema is a public contract.
* The Schema never mirrors internal Domain or persistence models automatically.
* Every public Field has exactly one architectural owner.
* Resolvers remain thin Integration Adapters.
* Resolvers never access repositories or Engine internals directly.
* Queries never modify canonical state.
* Mutations correspond to approved public Commands.
* Long-running Mutations return explicit Operation References.
* Subscriptions expose public Event projections, never the private Event Bus.
* Public Type identity remains independent from implementation topology.
* GraphQL nullability is a compatibility commitment.
* Internal exceptions never cross the GraphQL boundary.
* Partial data is explicit.
* Pagination uses opaque, context-bound cursors where required.
* Field authorization is explicit.
* Schema visibility does not grant authority.
* Query complexity is bounded.
* Query depth is bounded where required.
* Request-scoped caches never cross authorization boundaries.
* Data Loader batching preserves item-level authorization.
* Persisted Operations are versioned and validated.
* Deprecated Field usage remains observable.
* GraphQL Version evolution is semantic.
* Additive Schema change does not automatically guarantee client compatibility.
* Large binary transfer is separated from ordinary GraphQL payloads where appropriate.
* GraphQL execution remains observable and auditable where required.

---

# 141. Prohibited Behaviors

The GraphQL API shall never:

* expose ORM entities directly;
* expose database relationships automatically;
* expose internal class names;
* expose private Event Bus payloads;
* allow resolvers to bypass Platform contracts;
* allow Queries to mutate canonical state;
* map arbitrary internal methods to Mutations;
* use generic JSON objects instead of designed public Types without justification;
* expose unrestricted recursive traversal;
* expose unbounded collections;
* accept raw internal query languages;
* ignore Field-level authorization;
* reuse caches across Principals without isolation;
* log sensitive Variables or results by default;
* represent accepted asynchronous work as completed;
* return internal stack traces;
* silently reinterpret deprecated Fields;
* hide partial data errors;
* rely on GraphQL introspection as the sole API documentation;
* treat Schema presence as proof of runtime Capability availability.

---

# 142. Related Documents

* `APIConventions.md`
* `Authentication.md`
* `Versioning.md`
* `REST.md`
* `LocalAPI.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/Capabilities.md`
* `../PluginSDK/Compatibility.md`
* `../../04-Platform/README.md`
* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/QueryBus.md`
* `../../03-Kernel/EventBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Observability.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 143. Status

**Approved**

This document defines the architectural conventions governing the KnowledgeOS GraphQL API.

The GraphQL API exposes approved Platform Queries, Commands, Operations and public Event streams through a stable, typed and bounded public Schema.

The Schema is intentionally designed.

It is never generated as a direct projection of Domain objects, Engine services, repositories or persistence models.

Resolvers translate GraphQL interactions into approved Platform contracts while preserving authentication, authorization, compatibility, observability and execution limits.

GraphQL provides flexible client-driven selection.

It never provides unrestricted access to KnowledgeOS internals.
