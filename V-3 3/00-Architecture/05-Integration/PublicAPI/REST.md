
# REST API

**Project:** KnowledgeOS

**Section:** Architecture

**Module:** Integration

**Category:** Public API

**Document:** REST

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the architectural conventions governing the KnowledgeOS REST API.

The REST API exposes approved Platform capabilities through stable, versioned and resource-oriented HTTP contracts.

REST defines how external clients interact through HTTP.

It does not redefine Platform semantics.

It does not expose internal Engine, Kernel, Domain or persistence implementation.

---

# 2. Scope

This document governs:

* REST resources;
* URI conventions;
* HTTP methods;
* request representations;
* response representations;
* media types;
* status codes;
* asynchronous Operations;
* pagination;
* filtering;
* sorting;
* conditional requests;
* concurrency control;
* caching;
* idempotency;
* bulk operations;
* error representation;
* authentication integration;
* version placement;
* deprecation;
* observability.

This document does not govern:

* Platform business logic;
* internal service endpoints;
* database schemas;
* GraphQL semantics;
* Local API transport;
* authentication protocol internals;
* Provider-specific APIs;
* external webhook delivery;
* private Kernel communication.

---

# 3. Definition of the REST API

The KnowledgeOS REST API is a public HTTP interface exposing stable resources, Commands, Queries and asynchronous Operations.

A REST endpoint defines:

* a public resource or operation;
* accepted HTTP methods;
* request representation;
* response representation;
* authentication requirements;
* authorization requirements;
* error semantics;
* version semantics;
* lifecycle status.

An endpoint is a public contract.

It is not a route to an internal service implementation.

---

# 4. Architectural Position

The REST API belongs to the Integration layer.

```text
REST Client
    │
    ▼
HTTP Boundary
    │
    ▼
REST Adapter
    │
    ▼
Public API Contract
    │
    ▼
Platform Command / Query
    │
    ▼
Platform Engine
```

The REST Adapter translates HTTP interactions into public Platform contracts.

It never invokes Engine internals directly.

---

# 5. Mission

The mission of the REST API is to provide a predictable, interoperable and independently evolvable HTTP interface while preserving:

* architectural isolation;
* semantic consistency;
* explicit security;
* compatibility;
* cache correctness;
* idempotency;
* observability;
* long-term maintainability.

---

# 6. Design Philosophy

The REST API shall be:

* resource-oriented;
* contract-first;
* stateless at the request boundary;
* explicit;
* versioned;
* secure by default;
* cache-aware;
* predictable;
* technology-independent.

REST design shall reflect public architectural semantics.

It shall not mirror internal class or folder structures.

---

# 7. REST Resources

A REST Resource is a stable public representation of a Platform-managed concept.

Typical resources may include:

* Knowledge Objects;
* Libraries;
* Annotations;
* Search Results;
* Export Operations;
* Synchronization Operations;
* Providers;
* Plugins;
* Capabilities;
* Public API metadata.

A Resource representation is external.

It is not an internal Domain object or persistence record.

---

# 8. Resource Identity

Every addressable REST Resource shall have a stable public identity.

Resource identity shall remain independent from:

* database primary key;
* filesystem path;
* Storage Provider key;
* process memory address;
* internal repository identifier;
* deployment topology.

Public identities may be opaque.

Clients shall not infer implementation meaning from them.

---

# 9. Resource URI

A Resource URI identifies one public REST Resource or collection.

URIs shall be:

* stable;
* predictable;
* hierarchical only where the relationship is semantically meaningful;
* independent from internal package structure;
* free of implementation technology names.

Preferred:

```text
/libraries/{libraryId}/knowledge/{knowledgeId}
```

Avoid:

```text
/postgres/knowledge_rows/{rowId}
```

---

# 10. URI Naming

URI path segments shall normally use nouns.

Preferred:

```text
/knowledge
/annotations
/libraries
/plugins
/providers
/operations
```

Avoid verb-oriented internal-service routes such as:

```text
/getKnowledge
/createAnnotation
/runSearchService
```

Commands not naturally represented as standard resource transitions may use explicit action subresources.

---

# 11. Plural Collections

Collection resources should use plural nouns.

Examples:

```text
/libraries
/annotations
/providers
/plugins
```

Singular naming may be used only when the resource is inherently unique within its scope.

---

# 12. Nested Resources

Nested URIs may express clear ownership or containment.

Example:

```text
/libraries/{libraryId}/annotations
```

Nesting shall remain shallow.

Excessive nesting creates coupling and unstable paths.

Deep graph relationships should use explicit relationship or Query resources.

---

# 13. Relationship Resources

Relationships may be represented through explicit subresources.

Examples:

```text
/knowledge/{knowledgeId}/relationships
/knowledge/{knowledgeId}/assets
/knowledge/{knowledgeId}/annotations
```

Relationship semantics shall remain owned by the applicable Platform and Domain contracts.

---

# 14. URI Stability

Resource relocation, Provider replacement or storage migration shall not change public URIs merely because internal topology changed.

A URI change is a public contract change.

---

# 15. URI Opacity

Clients shall treat resource identifiers as opaque.

Identifiers shall not encode mutable attributes such as:

* title;
* filename;
* username;
* storage path;
* Provider identity.

Human-readable slugs may supplement identity.

They shall not replace stable identity unless explicitly governed.

---

# 16. Query Parameters

Query parameters may express:

* filtering;
* sorting;
* pagination;
* field selection;
* expansion;
* representation preferences;
* execution options where appropriate.

Query parameters shall not expose raw internal query languages.

---

# 17. HTTP Methods

REST endpoints shall use HTTP methods according to their public semantics.

Typical use includes:

* `GET` for retrieval;
* `POST` for creation or Commands;
* `PUT` for complete replacement where supported;
* `PATCH` for defined partial modification;
* `DELETE` for requested deletion;
* `HEAD` for metadata-only retrieval where supported;
* `OPTIONS` for capability and protocol metadata where applicable.

Method choice shall reflect operation semantics.

---

# 18. GET

`GET` retrieves a public representation without modifying canonical state.

`GET` shall be:

* safe;
* idempotent;
* cacheable when policy permits.

Operational metrics, access logs and cache population do not violate Query semantics.

---

# 19. POST

`POST` may be used to:

* create a resource;
* submit a Command;
* start an asynchronous Operation;
* execute a complex Query represented as a resource;
* submit a bulk request.

POST semantics shall be explicit.

POST shall not automatically be assumed non-idempotent.

Supported Idempotency Keys shall be documented.

---

# 20. PUT

`PUT` may replace the complete mutable representation of a Resource at a known URI.

PUT semantics shall define:

* whether creation is permitted;
* required concurrency metadata;
* immutable fields;
* omitted-field behavior;
* validation;
* idempotency.

PUT shall not replace protected identity or provenance.

---

# 21. PATCH

`PATCH` may perform a defined partial update.

The patch format shall be explicit and versioned.

PATCH semantics shall define:

* supported operations;
* field absence;
* explicit null;
* immutable fields;
* concurrency control;
* validation;
* idempotency.

Arbitrary internal object patching is prohibited.

---

# 22. DELETE

`DELETE` requests deletion according to the Resource contract.

Deletion may mean:

* logical deletion;
* tombstone creation;
* archive transition;
* removal from a collection;
* permanent deletion when explicitly authorized.

The API shall not imply physical erasure when only logical deletion occurred.

---

# 23. HEAD

`HEAD` may retrieve metadata equivalent to `GET` without returning the representation body.

Support shall be explicit.

HEAD metadata may include:

* existence;
* representation Version;
* content length;
* ETag;
* modification metadata;
* deprecation metadata.

---

# 24. OPTIONS

`OPTIONS` may expose protocol-level capabilities.

It shall not reveal private implementation details.

Possible metadata includes:

* allowed methods;
* supported media types;
* version information;
* authentication requirements;
* cross-origin policy where applicable.

---

# 25. Commands in REST

Commands shall be exposed explicitly when they do not map naturally to direct Resource creation or mutation.

Examples may include:

```text
POST /exports
POST /synchronizations
POST /plugins/{pluginId}/enable-operations
```

Action naming shall create or address an Operation or state transition.

Avoid arbitrary RPC-style routes.

---

# 26. State Transition Resources

Complex state transitions should be modeled as Resources or Operations.

Example:

```text
POST /plugins/{pluginId}/activation-operations
```

This creates an activation Operation rather than invoking an internal method directly.

---

# 27. Query Resources

Complex Queries may use `POST` when request complexity, size or sensitivity makes URI query parameters inappropriate.

Example:

```text
POST /searches
```

The request creates or executes a Search Query contract.

This use of POST does not imply canonical mutation.

---

# 28. Search Endpoint

Knowledge Search shall be exposed through Search Engine semantics.

Typical models may include:

```text
GET /search?query=...
```

for simple bounded search, or:

```text
POST /searches
```

for structured, complex or asynchronous search.

The REST API shall not reinterpret Search as generic database filtering.

---

# 29. Request Media Types

Every request body shall use an approved media type.

Typical forms may include:

* JSON;
* multipart form data;
* binary stream;
* approved canonical exchange format.

Media type support shall be explicit per operation.

---

# 30. Response Media Types

Every response representation shall declare its media type.

Content negotiation may select among compatible representations.

Examples may include:

* JSON resource representation;
* Markdown export;
* PDF artifact;
* EPUB artifact;
* binary Asset;
* event stream.

Representation selection shall not change operation semantics silently.

---

# 31. JSON Representation

JSON may be used as the default structured REST representation.

JSON contracts shall define:

* field names;
* field types;
* nullability;
* unknown-field policy;
* Enumeration openness;
* numeric precision;
* time representation;
* identifier representation.

Internal serialization objects shall never be exposed directly.

---

# 32. Media Type Versioning

Semantic Version may be represented through media type parameters or versioned media types where appropriate.

Example conceptual form:

```text
application/vnd.knowledgeos.knowledge+json;version=2
```

The exact convention shall remain consistent within the REST surface.

---

# 33. Content Negotiation

Clients may express accepted response media types.

KnowledgeOS shall return:

* a supported compatible representation;
* or an explicit not-acceptable error.

The server shall not silently return an incompatible representation.

---

# 34. Content Type Validation

Requests with unsupported or missing required Content Type shall be rejected explicitly.

Payload parsing shall not rely on heuristic format detection for protected public operations.

---

# 35. Character Encoding

Textual REST representations should use UTF-8 unless a specific public format requires otherwise.

Encoding shall be explicit where ambiguity exists.

---

# 36. Request Body Limits

REST operations shall define request body limits.

Limits may depend upon:

* operation;
* media type;
* client class;
* execution profile;
* security policy.

Oversized requests shall fail before expensive processing where practical.

---

# 37. Response Body Limits

Large responses should use:

* pagination;
* streaming;
* asynchronous artifact generation;
* range requests;
* downloadable representation references.

Unbounded response construction is discouraged.

---

# 38. HTTP Status Codes

HTTP status codes shall represent transport-level and high-level operation outcomes.

Canonical public Error Codes remain authoritative for machine-readable failure semantics.

HTTP status never replaces the canonical error contract.

---

# 39. Successful Status Codes

Typical successful codes may include:

* `200 OK`;
* `201 Created`;
* `202 Accepted`;
* `204 No Content`;
* `206 Partial Content`.

The selected code shall reflect actual semantics.

---

# 40. 200 OK

`200 OK` may represent successful retrieval or completed synchronous execution.

The response body shall conform to the documented representation contract.

---

# 41. 201 Created

`201 Created` indicates successful Resource creation.

The response should identify the created Resource through:

* `Location`;
* response representation;
* or both.

Creation is not complete if required canonical validation failed.

---

# 42. 202 Accepted

`202 Accepted` indicates that an asynchronous request was accepted but not completed.

The response shall include an Operation Reference or status location.

Acceptance shall never be presented as completed success.

---

# 43. 204 No Content

`204 No Content` may represent successful completion without a response representation.

It shall not be used when clients require result metadata or warnings.

---

# 44. 206 Partial Content

`206 Partial Content` may be used for supported byte-range retrieval.

Range support shall be explicit.

It shall not represent partial semantic success of a bulk Command.

---

# 45. Redirection Status

Redirects may be used only when public semantics remain clear.

Clients shall not be redirected to private storage locations exposing credentials or implementation topology.

Temporary artifact URLs shall be scoped, expiring and authorized.

---

# 46. Client Error Status Codes

Typical client-side errors may use:

* `400 Bad Request`;
* `401 Unauthorized`;
* `403 Forbidden`;
* `404 Not Found`;
* `405 Method Not Allowed`;
* `406 Not Acceptable`;
* `409 Conflict`;
* `410 Gone`;
* `412 Precondition Failed`;
* `413 Content Too Large`;
* `415 Unsupported Media Type`;
* `422 Unprocessable Content`;
* `428 Precondition Required`;
* `429 Too Many Requests`.

Canonical Error Codes provide precise meaning.

---

# 47. 400 Bad Request

`400 Bad Request` represents malformed request syntax or invalid general structure.

More specific semantic validation failures may use another appropriate code with canonical error details.

---

# 48. 401 Unauthorized

`401 Unauthorized` indicates missing or invalid authentication.

Despite the HTTP name, it represents authentication failure.

It shall not be used for a valid authenticated Principal lacking permission.

---

# 49. 403 Forbidden

`403 Forbidden` indicates that authentication succeeded but authorization denied the requested operation.

Responses shall avoid leaking protected Resource existence when policy requires concealment.

---

# 50. 404 Not Found

`404 Not Found` indicates that the requested public Resource or endpoint is unavailable within the visible scope.

It may also be used to conceal protected Resource existence according to security policy.

---

# 51. 409 Conflict

`409 Conflict` represents a state conflict such as:

* resource Version conflict;
* duplicate identity;
* Idempotency Key conflict;
* incompatible lifecycle transition;
* binding conflict.

The canonical error shall identify the conflict category.

---

# 52. 410 Gone

`410 Gone` may indicate a Resource or API element intentionally retired and no longer available.

The response may include migration or archival metadata.

---

# 53. 412 Precondition Failed

`412 Precondition Failed` indicates failure of a conditional request such as an ETag or expected revision mismatch.

The response shall provide safe concurrency diagnostics.

---

# 54. 422 Unprocessable Content

`422 Unprocessable Content` may represent structurally valid input that fails semantic validation.

Examples include:

* invalid state transition;
* incompatible Capability requirement;
* unsupported export combination;
* invalid annotation anchor.

---

# 55. 428 Precondition Required

`428 Precondition Required` may be used when concurrency-sensitive modification requires a condition such as `If-Match`.

This prevents accidental lost updates.

---

# 56. 429 Too Many Requests

`429 Too Many Requests` indicates rate-limit enforcement.

The response should include safe retry guidance when available.

---

# 57. Server Error Status Codes

Typical server-side failures may use:

* `500 Internal Server Error`;
* `502 Bad Gateway`;
* `503 Service Unavailable`;
* `504 Gateway Timeout`.

Internal details shall remain hidden.

Canonical errors shall identify the public failure category.

---

# 58. 500 Internal Server Error

`500 Internal Server Error` represents an unexpected failure within KnowledgeOS.

The response shall include correlation metadata.

Stack traces and internal implementation details are prohibited.

---

# 59. 502 Bad Gateway

`502 Bad Gateway` may represent invalid or failed interaction with an upstream Provider or external service.

Provider identity may be included only when safe and useful.

---

# 60. 503 Service Unavailable

`503 Service Unavailable` indicates temporary inability to execute the requested capability.

Examples include:

* required Provider unavailable;
* maintenance;
* resource exhaustion;
* unavailable Endpoint.

Retry guidance may be included.

---

# 61. 504 Gateway Timeout

`504 Gateway Timeout` may represent timeout while waiting for an external or downstream service.

The response shall distinguish timeout from known cancellation or definitive failure.

---

# 62. Canonical Error Representation

REST errors shall use the canonical public error model defined by `APIConventions.md`.

A conceptual representation may include:

```text
code
category
message
field
retryability
correlationId
details
documentation
```

The exact JSON schema shall be versioned.

---

# 63. Multiple Validation Errors

A request may produce multiple validation errors.

The response may include an ordered collection of field or semantic errors.

Error ordering shall be deterministic where practical.

---

# 64. Problem Details

KnowledgeOS may use a standards-compatible problem-details representation.

Any such representation shall preserve canonical KnowledgeOS Error Codes and semantic categories.

Transport standards shall not replace architectural error ownership.

---

# 65. Asynchronous Operations

Long-running REST requests shall return `202 Accepted` with an Operation Resource.

Example:

```text
POST /exports

202 Accepted
Location: /operations/{operationId}
```

The Operation Resource exposes lifecycle and result references.

---

# 66. Operation Resource

An Operation Resource may expose:

* Operation Identity;
* type;
* state;
* progress;
* phase;
* created time;
* updated time;
* warnings;
* failure;
* result links;
* cancellation link.

The representation shall follow `APIConventions.md`.

---

# 67. Operation Polling

Clients may poll an Operation Resource.

Polling guidance may include:

* recommended interval;
* retry-after;
* terminal-state behavior;
* expiration.

Excessive polling may be rate-limited.

---

# 68. Operation Events

Clients may optionally receive Operation updates through approved event mechanisms.

Event delivery does not replace the authoritative Operation Resource.

---

# 69. Operation Cancellation

Cancellation may be requested through a documented transition or cancellation Resource.

Example conceptual model:

```text
POST /operations/{operationId}/cancellation
```

Cancellation support and result shall be explicit.

---

# 70. Operation Expiration

Completed Operation Resources may expire according to retention policy.

Expiration shall not remove canonical results or exported artifacts that have their own lifecycle.

Clients shall be able to distinguish expired Operation metadata from missing business Resources.

---

# 71. Pagination

REST collection endpoints shall use explicit pagination.

The preferred model for large or changing collections is opaque cursor pagination.

Example:

```text
GET /annotations?limit=50&cursor=opaque-value
```

---

# 72. Pagination Response

A paginated response may contain:

* items;
* next cursor;
* previous cursor where supported;
* page size;
* total count when available and affordable;
* snapshot or consistency metadata.

Total count shall not be required when expensive or unstable.

---

# 73. Cursor Opacity

REST clients shall treat cursors as opaque.

Cursors shall not expose internal database offsets, keys or query plans.

---

# 74. Cursor Scope

A cursor shall be bound to the applicable:

* endpoint;
* filters;
* sort;
* API Version;
* authorization context;
* representation profile.

Using a cursor in an incompatible context shall fail explicitly.

---

# 75. Filtering

REST filters shall use documented query parameters or structured Query Resources.

Examples may include:

```text
?status=active
?libraryId=...
?createdAfter=...
```

Filter semantics shall remain typed and bounded.

---

# 76. Repeated Filter Values

Multi-value filters shall use one documented convention consistently.

Examples may include:

* repeated parameters;
* delimited values;
* structured filter object through POST Query.

Ambiguous parsing is prohibited.

---

# 77. Sorting

Sorting may use documented fields and direction.

Example:

```text
?sort=createdAt,-title
```

Only approved public fields may participate.

Stable tie-breaking shall be defined when required for cursor pagination.

---

# 78. Field Selection

REST may support explicit field projection.

Example conceptual form:

```text
?fields=id,title,version
```

Only approved fields may be selected.

Projection shall not expose internal properties.

---

# 79. Expansion

REST may support explicit relationship expansion.

Example conceptual form:

```text
?expand=annotations,assets
```

Expansion shall have:

* depth limits;
* authorization checks;
* size limits;
* cycle prevention;
* documented supported relationships.

---

# 80. Conditional Requests

REST may use HTTP conditional request semantics.

Typical headers include:

* `If-Match`;
* `If-None-Match`;
* `If-Modified-Since`;
* `If-Unmodified-Since`.

ETag-based semantics are preferred when Resource Revision is explicit.

---

# 81. ETag

An ETag represents a Version of a specific REST representation.

It may support:

* caching;
* conditional retrieval;
* optimistic concurrency.

ETag is not automatically equivalent to Domain Version or Storage hash.

Its semantics shall be documented.

---

# 82. Strong and Weak ETags

Strong ETags indicate byte- or representation-level equivalence according to HTTP semantics.

Weak ETags indicate semantic equivalence suitable for caching but not all mutation preconditions.

The REST API shall use the correct form deliberately.

---

# 83. If-Match

Mutation operations may require `If-Match`.

A mismatch shall produce `412 Precondition Failed` or the documented conflict response.

This protects against lost updates.

---

# 84. If-None-Match

`If-None-Match` may support:

* cache validation;
* create-if-absent;
* duplicate prevention.

Semantics depend upon the operation and shall be explicit.

---

# 85. Cacheability

Every REST operation shall define cacheability.

Responses may be:

* publicly cacheable;
* privately cacheable;
* revalidation-required;
* non-cacheable;
* no-store.

Sensitive or user-specific responses shall default to restrictive caching.

---

# 86. Cache-Control

REST responses shall use appropriate cache metadata.

Cache policy shall consider:

* sensitivity;
* authorization;
* representation Version;
* Resource Revision;
* volatility;
* offline requirements.

---

# 87. Vary

Responses using content negotiation or request-dependent representation shall expose appropriate `Vary` semantics.

Cache keys shall include relevant:

* media type;
* API Version;
* encoding;
* authorization context where applicable;
* locale;
* representation profile.

---

# 88. Private Data Caching

Authenticated private responses shall not be stored in shared caches unless explicitly designed and safely partitioned.

Cache optimization shall never override privacy.

---

# 89. Offline REST Clients

REST clients may cache approved representations for offline use.

Offline cache semantics shall define:

* freshness;
* invalidation;
* Resource Revision;
* pending Commands;
* conflict behavior;
* revalidation.

Client-side offline behavior shall not redefine canonical authority.

---

# 90. Idempotency Header

Supported state-changing operations may accept an Idempotency Key through a documented header.

The header name and scope shall remain consistent.

The Idempotency Key shall be associated with:

* Principal or client scope;
* operation identity;
* API Version;
* semantic request fingerprint.

---

# 91. Idempotent Replay

A repeated request with the same valid Idempotency Key and equivalent input may return:

* the original result;
* the current Operation Resource;
* the original failure when contractually required.

The response shall remain semantically consistent.

---

# 92. Idempotency Conflict

Reuse of the same Idempotency Key with different semantic input shall produce an explicit conflict.

The system shall not execute the new request.

---

# 93. Bulk REST Operations

Bulk operations may be represented through dedicated collection Commands.

Example:

```text
POST /annotation-batches
```

Bulk request and result models shall define:

* maximum size;
* atomicity;
* per-item status;
* ordering;
* idempotency;
* asynchronous execution.

---

# 94. Bulk Result

A Bulk Result shall distinguish:

* complete success;
* partial success;
* complete failure;
* accepted asynchronous processing.

Each item shall have an explicit result or error.

---

# 95. Multipart Requests

Multipart requests may be used for operations combining metadata and binary content.

Examples include:

* Asset upload;
* import package submission;
* Plugin package upload.

Multipart field semantics shall be explicit and versioned.

---

# 96. Binary Upload

Large binary uploads should support:

* streaming;
* size limits;
* integrity metadata;
* cancellation;
* resumability where required;
* media type validation.

Upload completion does not imply canonical import completion.

---

# 97. Range Download

Large binary Resources may support HTTP range requests.

Range support shall define:

* stable representation;
* ETag behavior;
* authorization;
* expiry;
* partial integrity.

---

# 98. Temporary Download URLs

KnowledgeOS may issue temporary authorized download references.

They shall be:

* scoped;
* expiring;
* non-guessable;
* limited to the intended Resource;
* revocable where required.

Temporary URLs shall not reveal long-lived credentials.

---

# 99. Authentication Integration

Protected REST operations shall authenticate according to `Authentication.md`.

Authentication may use:

* bearer token;
* proof-of-possession token;
* client certificate;
* local capability credential;
* another approved method.

The REST layer validates transport presentation and produces an Authentication Context.

---

# 100. Authorization Integration

After authentication, authorization evaluates the requested REST operation and Resource scope.

Authorization denial shall produce the appropriate canonical error and HTTP status.

REST routes shall not contain hidden authorization exceptions.

---

# 101. Cross-Origin Access

Browser-accessible REST APIs may define explicit cross-origin policy.

Cross-origin access shall:

* allow only approved origins;
* limit methods and headers;
* avoid credential leakage;
* support preflight correctly;
* remain environment-specific.

Wildcard credentialed access is prohibited.

---

# 102. CSRF Protection

Cookie-authenticated state-changing REST operations shall include appropriate CSRF protection.

Bearer-token APIs not relying on ambient browser credentials may use a different threat model.

Protection shall match the authentication method.

---

# 103. Transport Security

Remote REST APIs shall use approved secure transport.

Plaintext remote authentication and protected content transmission are prohibited.

Local transport may use operating-system-protected channels according to `LocalAPI.md`.

---

# 104. Request Signing

High-assurance clients may use signed requests.

Request-signing semantics may cover:

* method;
* URI;
* body hash;
* timestamp;
* nonce;
* selected headers;
* client identity.

Signature validation shall prevent replay where required.

---

# 105. Version Placement

The REST API shall use one consistent primary Version-placement strategy.

Possible strategies include:

* path Version;
* media-type Version;
* header Version.

The selected strategy shall be documented and applied consistently.

---

# 106. Path Versioning

A path-based Version may use:

```text
/api/v1/knowledge
```

Path Versioning is explicit and easy to route.

It may couple Resource URIs to API generation.

This tradeoff shall be accepted deliberately.

---

# 107. Media-Type Versioning

Media-type Versioning may keep stable Resource URIs while negotiating representation contracts.

It requires disciplined content negotiation.

It shall not obscure operation-level incompatibility.

---

# 108. Header Versioning

Header Versioning may express requested API Version outside the URI.

It shall remain visible in diagnostics, caching and documentation.

Caches shall vary by Version header.

---

# 109. Default REST Version

A default REST Version may exist only when documented.

Clients requiring stable compatibility should request a Version explicitly.

Changing the default to an incompatible Version is breaking.

---

# 110. Deprecation Headers

REST responses may expose deprecation and Sunset metadata through approved headers.

Headers supplement:

* response metadata;
* machine-readable API descriptions;
* documentation.

Deprecation shall not rely on headers alone.

---

# 111. REST API Discovery

KnowledgeOS may expose public REST metadata such as:

* supported Versions;
* root links;
* operation discovery;
* media types;
* authentication requirements;
* deprecation status;
* health endpoints.

Discovery shall not reveal private topology.

---

# 112. Hypermedia Links

REST representations may include typed links to related Resources and Operations.

Link relations shall be documented.

Clients should prefer public links over constructing related URIs through internal assumptions.

---

# 113. Link Stability

Link relation semantics shall remain stable.

Target URIs may evolve when clients follow provided links rather than deriving them.

---

# 114. Health Endpoints

Public or administrative health endpoints may expose limited operational status.

Health responses shall avoid:

* secrets;
* internal hostnames;
* stack traces;
* private dependency details;
* user data.

Detailed health may require administrative authorization.

---

# 115. Readiness and Liveness

Where operationally useful, REST may distinguish:

* Liveness;
* Readiness;
* Capability Health.

These states have different semantics.

A live process may not be ready to serve a specific Capability.

---

# 116. Rate Limit Metadata

REST responses may expose rate-limit metadata through headers or response metadata.

The format shall remain documented and consistent.

Rate limits may differ by:

* Principal;
* client;
* operation;
* Capability;
* Provider;
* execution profile.

---

# 117. Retry-After

Temporary failures or rate limits may include retry guidance.

Clients shall treat retry guidance as advisory within the operation's retryability semantics.

---

# 118. REST Observability

Every significant REST request shall be observable.

Observable metadata may include:

* HTTP method;
* normalized route template;
* API Version;
* operation identity;
* status code;
* canonical Error Code;
* Principal class;
* request size;
* response size;
* duration;
* correlation identity;
* cache result;
* deprecation state.

Raw sensitive payloads shall not be logged by default.

---

# 119. REST Metrics

REST metrics may include:

* requests per endpoint;
* requests per Version;
* success rate;
* error rate;
* latency;
* response size;
* rate-limit events;
* authentication failures;
* authorization failures;
* deprecated endpoint usage;
* cache hit rate;
* asynchronous Operation creation.

---

# 120. REST Tracing

REST requests may initiate or continue distributed traces.

A trace shall preserve:

```text
HTTP Request
    │
    ▼
Authentication
    │
    ▼
Authorization
    │
    ▼
REST Adapter
    │
    ▼
Platform Contract
    │
    ▼
Platform Execution
    │
    ▼
HTTP Response
```

Trace propagation shall follow approved standards without exposing sensitive information.

---

# 121. REST Audit

State-changing and security-sensitive REST operations may produce audit records.

Audit records may include:

* Principal Identity;
* Application Identity;
* operation;
* Resource reference;
* API Version;
* result;
* authorization decision;
* timestamp;
* correlation identity.

Audit records shall not contain secret credentials.

---

# 122. REST Contract Testing

Every stable REST operation shall have contract tests.

Tests may verify:

* method semantics;
* URI behavior;
* request validation;
* response representation;
* status codes;
* canonical errors;
* authentication;
* authorization;
* idempotency;
* ETag behavior;
* pagination;
* Version negotiation;
* deprecation metadata.

---

# 123. REST Compatibility Testing

Compatibility tests shall verify supported Versions and Adapters.

A change passing schema validation may still fail semantic compatibility testing.

Behavioral guarantees shall be tested.

---

# 124. REST Invariants

The following invariants apply.

* REST belongs to the Integration layer.
* REST exposes public Platform capabilities.
* REST never exposes Engine internals.
* REST Resource models are distinct from persistence models.
* Public URIs are independent from storage topology.
* Resource identifiers are stable and opaque where appropriate.
* GET is safe and does not modify canonical state.
* HTTP method semantics remain explicit.
* Commands not naturally represented as Resource mutation use explicit Operation or action Resources.
* Asynchronous acceptance is never reported as completed success.
* HTTP status codes do not replace canonical Error Codes.
* Internal exceptions never cross the REST boundary.
* Content types are explicit.
* Unsupported media types fail explicitly.
* Pagination semantics are explicit.
* Cursors are opaque and context-bound.
* ETag semantics are explicit.
* Concurrency-sensitive modification may require preconditions.
* Cache policy is explicit.
* Private responses never become publicly cacheable accidentally.
* Idempotency semantics are explicit.
* Idempotency state is API-Version-aware.
* Partial bulk success is explicit.
* Upload completion is distinct from canonical processing completion.
* Authentication and authorization remain separate.
* Remote protected communication uses secure transport.
* Version resolution is deterministic.
* Deprecated usage remains observable.
* REST execution remains observable and auditable where required.

---

# 125. Prohibited Behaviors

The REST API shall never:

* mirror internal service classes directly;
* expose database tables as Resources;
* expose filesystem paths as canonical identifiers;
* expose Provider SDK objects;
* use GET for canonical mutation;
* treat POST as automatically non-idempotent;
* return `200 OK` for failed Platform operations;
* represent accepted asynchronous work as complete;
* return stack traces;
* return secrets;
* expose unbounded collections by default;
* expose raw internal query languages;
* accept ambiguous patch semantics;
* silently ignore failed concurrency preconditions;
* silently return an unsupported representation;
* silently reinterpret unsupported API Versions;
* cache private responses publicly;
* expose long-lived credentials in temporary URLs;
* bypass Platform contracts;
* bypass authentication or authorization;
* use route structure to reveal internal architecture.

---

# 126. Related Documents

* `APIConventions.md`
* `Authentication.md`
* `Versioning.md`
* `GraphQL.md`
* `LocalAPI.md`
* `../PluginSDK/Contracts.md`
* `../PluginSDK/Compatibility.md`
* `../ExternalServices/Webhooks.md`
* `../../04-Platform/README.md`
* `../../03-Kernel/CommandBus.md`
* `../../03-Kernel/QueryBus.md`
* `../../03-Kernel/JobSystem.md`
* `../../03-Kernel/Observability.md`
* `../../01-Foundation/ArchitecturePrinciples.md`

---

# 127. Status

**Approved**

This document defines the architectural conventions governing the KnowledgeOS REST API.

The REST API exposes approved Platform Resources, Commands, Queries and asynchronous Operations through stable, versioned and secure HTTP contracts.

REST remains independent from internal Engine services, Domain implementations, storage topology and concrete Provider technologies.

HTTP methods, status codes, media types, caching, idempotency, concurrency and pagination preserve their documented semantics.

The REST API exposes architecture intentionally.

It never leaks implementation accidentally.
