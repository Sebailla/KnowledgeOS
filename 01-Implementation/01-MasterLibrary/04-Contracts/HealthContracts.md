
# Master Library Health Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Health Contracts

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Technical Baseline:** Master Library Technical Design v1.0

**Domain Baseline:** Master Library Domain v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the public and protected health contracts of KnowledgeOS Server and the Master Library Module.

It establishes:

* process liveness;
* application readiness;
* server health;
* Master Library health;
* component health;
* provider health;
* degraded operation;
* health aggregation;
* health-state precedence;
* public health disclosure;
* authenticated diagnostic health;
* Kubernetes- and container-compatible probes;
* client behavior;
* observability integration;
* error behavior;
* security boundaries;
* testing obligations.

The health model intentionally distinguishes:

```text
Process liveness
≠
Server readiness
≠
Master Library availability
≠
Publication availability
≠
Optional provider availability
```

---

# 2. Scope

This document defines the contracts for:

```text
GET /v1/health
GET /v1/health/live
GET /v1/health/ready
GET /v1/health/components
```

The initial implementation may expose only the first three endpoints publicly.

`/v1/health/components` shall require authentication and may require Administrator authorization depending on the detail level returned.

---

# 3. Explicit Exclusions

This document does not define:

* infrastructure monitoring configuration;
* Prometheus scrape configuration;
* Grafana dashboards;
* OpenTelemetry collector deployment;
* NAS vendor monitoring;
* detailed hardware diagnostics;
* disk SMART data;
* operating-system process supervision;
* publication-specific integrity reports;
* administrative repair operations;
* personal-state synchronization health;
* CloudKit health in Module 1;
* AI provider functionality beyond optional health classification;
* OCR provider implementation.

Health contracts expose operational state.

They do not perform recovery themselves.

---

# 4. Core Health Principle

> A running server process shall not be reported as fully healthy when its required Master Library capabilities are unavailable.

The complementary principle is:

> Failure of an optional provider shall not make the Master Library unavailable when core catalog and publication-delivery capabilities remain safe.

---

# 5. Health Layers

KnowledgeOS defines four distinct health layers:

```text
Layer 1 — Process Liveness

Layer 2 — Server Readiness

Layer 3 — Master Library Health

Layer 4 — Component and Provider Health
```

Publication availability remains a separate Domain concern.

---

# 6. Layer 1 — Process Liveness

Process liveness answers:

```text
Is the server process running and capable of responding?
```

It does not verify:

* catalog integrity;
* source storage;
* Master Library format;
* publication availability;
* authentication persistence;
* optional providers.

---

# 7. Layer 2 — Server Readiness

Server readiness answers:

```text
Can the server safely accept ordinary requests?
```

Readiness evaluates required application dependencies such as:

* configuration;
* server identity;
* routing;
* authentication infrastructure;
* catalog persistence connection;
* required storage access;
* startup recovery completion.

---

# 8. Layer 3 — Master Library Health

Master Library health answers:

```text
Can the authoritative Master Library safely serve its supported operations?
```

It evaluates:

* MasterLibraryId;
* Library manifest;
* format compatibility;
* catalog database;
* CatalogRevision;
* required indexes;
* source registry;
* source storage;
* structural consistency;
* startup reconciliation;
* maintenance state.

---

# 9. Layer 4 — Components and Providers

Component health describes individual dependencies and subsystems.

Examples:

```text
CATALOG_DATABASE
SOURCE_STORAGE
STAGING_STORAGE
AUTHENTICATION_STORE
CURSOR_SIGNING
TLS_IDENTITY
BACKGROUND_JOBS
OCR_PROVIDER
AI_PROVIDER
EXPORT_ENGINE
IMPORT_ENGINE
```

Optional components shall not automatically determine core Library availability.

---

# 10. Health State Families

KnowledgeOS uses different state families for different health dimensions.

## ServerHealthState

```text
STARTING
HEALTHY
DEGRADED
UNHEALTHY
MAINTENANCE
```

## MasterLibraryHealthState

```text
UNINITIALIZED
INITIALIZING
AVAILABLE
DEGRADED
UNAVAILABLE
MAINTENANCE
INVALID
UNSUPPORTED
```

## ComponentHealthState

```text
AVAILABLE
DEGRADED
UNAVAILABLE
UNKNOWN
DISABLED
```

---

# 11. Why Separate State Families

A single generic `status` value is insufficient.

For example:

```text
ServerHealthState = HEALTHY
MasterLibraryHealthState = DEGRADED
OCR_PROVIDER = UNAVAILABLE
```

may represent a valid operational state where:

* the process is healthy;
* the catalog is available;
* publications may be downloaded;
* OCR is temporarily unavailable.

---

# 12. ServerHealthState

The public ServerHealthState values are:

```text
STARTING
HEALTHY
DEGRADED
UNHEALTHY
MAINTENANCE
```

---

# 13. STARTING

## Meaning

The server process is running but startup initialization has not completed.

Possible pending operations:

* configuration loading;
* identity loading;
* database migration;
* startup reconciliation;
* storage validation;
* background-service initialization.

## Behavior

* liveness may succeed;
* readiness shall fail;
* protected operational endpoints should return temporary unavailability;
* startup progress may remain internal.

---

# 14. HEALTHY

## Meaning

The server application is operational and all required server-level dependencies are available.

A healthy server may still expose:

```text
MasterLibraryHealthState = DEGRADED
```

when the degraded condition does not make the application itself unsafe.

---

# 15. DEGRADED

## Meaning

The server can safely serve at least part of its required behavior, but one or more non-fatal components are impaired.

Examples:

* optional diagnostics unavailable;
* background cleanup delayed;
* optional provider unavailable;
* reduced transfer concurrency;
* non-critical metrics exporter unavailable.

The degraded state shall not hide a failure that makes core requests unsafe.

---

# 16. UNHEALTHY

## Meaning

The server cannot safely provide required operational behavior.

Examples:

* server identity unavailable;
* required configuration invalid;
* authentication verifier store unavailable;
* catalog persistence inaccessible;
* required source storage inaccessible;
* startup recovery failed.

## Behavior

* liveness may still succeed;
* readiness fails;
* ordinary API requests return service-unavailable errors;
* administrative recovery may remain possible.

---

# 17. MAINTENANCE

## Meaning

The server is intentionally restricting ordinary operations while performing an authorized maintenance activity.

Examples:

* migration;
* restore;
* full reconciliation;
* Library repair;
* integrity scan requiring exclusive access.

The server process remains live.

Readiness for ordinary Reader traffic may fail.

---

# 18. MasterLibraryHealthState

The public Master Library health values are:

```text
UNINITIALIZED
INITIALIZING
AVAILABLE
DEGRADED
UNAVAILABLE
MAINTENANCE
INVALID
UNSUPPORTED
```

---

# 19. UNINITIALIZED

## Meaning

No Master Library aggregate currently exists.

## Behavior

* server bootstrap may remain healthy;
* catalog operations unavailable;
* publication acquisition unavailable;
* Administrator initialization may be allowed.

---

# 20. INITIALIZING

## Meaning

The Master Library is being created or finalized.

## Behavior

* catalog access unavailable;
* publication acquisition unavailable;
* administrative status may be visible;
* initialization must finish or fail safely.

---

# 21. AVAILABLE

## Meaning

The Master Library can safely serve all currently permitted core operations.

Required baseline conditions:

```text
manifest valid
format supported
catalog readable
CatalogRevision valid
required indexes available
source registry coherent
source storage accessible
startup reconciliation complete
```

Individual publications may still be unavailable, withdrawn or corrupted.

---

# 22. DEGRADED Library

## Meaning

The Master Library remains safely usable, but one or more non-critical capabilities are impaired.

Examples:

* cover storage unavailable;
* one optional index rebuilding;
* background integrity scan delayed;
* some individual sources unavailable;
* optional provider unavailable.

The contract shall state which actions remain available.

---

# 23. UNAVAILABLE Library

## Meaning

The Master Library cannot currently provide required Reader operations.

Examples:

* catalog database inaccessible;
* source root disconnected;
* required permissions unavailable;
* required index inaccessible;
* storage provider unavailable.

This state may be transient.

---

# 24. MAINTENANCE Library

## Meaning

The Library is intentionally restricted for maintenance.

The health response should expose safe maintenance information such as:

* maintenance state;
* whether Reader operations are blocked;
* expected retry delay when known.

It shall not expose sensitive operational details.

---

# 25. INVALID Library

## Meaning

The Master Library violates required structural or integrity invariants.

Examples:

* manifest identity inconsistent;
* CatalogRevision invalid;
* catalog-source relationships inconsistent;
* unsupported persisted state combinations;
* recovery marker corruption.

Automatic retry is normally not appropriate.

---

# 26. UNSUPPORTED Library

## Meaning

The server runtime cannot safely interpret the active Library format or schema.

Examples:

* newer unsupported Library format;
* incompatible database schema;
* missing required migration implementation.

Normal mutation and Reader access shall be blocked.

---

# 27. ComponentHealthState

Component health values are:

```text
AVAILABLE
DEGRADED
UNAVAILABLE
UNKNOWN
DISABLED
```

---

# 28. AVAILABLE Component

The component is functioning within its required operational bounds.

---

# 29. DEGRADED Component

The component remains partially usable or is operating below normal capacity.

Examples:

* slow response;
* reduced concurrency;
* partial index availability;
* fallback provider active;
* delayed background processing.

---

# 30. UNAVAILABLE Component

The component cannot currently provide its function.

Whether this affects ServerHealthState or MasterLibraryHealthState depends on whether the component is required.

---

# 31. UNKNOWN Component

The component state cannot currently be determined.

`UNKNOWN` shall not be treated as `AVAILABLE`.

For required components, prolonged `UNKNOWN` may degrade or invalidate readiness.

---

# 32. DISABLED Component

The component is intentionally not configured or not enabled.

Examples:

* OCR provider disabled;
* AI provider disabled;
* optional metrics exporter disabled.

A disabled optional component shall not make the server unhealthy.

---

# 33. Required and Optional Components

Every health component shall be classified as:

```text
REQUIRED
OPTIONAL
```

This classification belongs to server configuration and module architecture.

---

# 34. Required Components

The initial required components are:

```text
SERVER_IDENTITY
TLS_IDENTITY
CONFIGURATION
CATALOG_DATABASE
SOURCE_STORAGE
AUTHENTICATION_STORE
CURSOR_SIGNING
STARTUP_RECOVERY
```

Depending on deployment, `STAGING_STORAGE` is required for administrative publication upload but not necessarily for Reader-only catalog access.

---

# 35. Optional Components

Potential optional components include:

```text
OCR_PROVIDER
AI_PROVIDER
EXPORT_ENGINE
IMPORT_ENGINE
METRICS_EXPORTER
TRACING_EXPORTER
COVER_STORAGE
BACKGROUND_CLEANUP
```

Their availability shall not automatically determine core Reader readiness.

---

# 36. Core Reader Components

The minimum required components for catalog browsing are:

```text
SERVER_IDENTITY
TLS_IDENTITY
CONFIGURATION
AUTHENTICATION_STORE
CATALOG_DATABASE
CURSOR_SIGNING
```

---

# 37. Core Publication Download Components

Publication download additionally requires:

```text
SOURCE_STORAGE
```

and a valid source for the requested publication.

---

# 38. Administrative Upload Components

Publication registration and source replacement additionally require:

```text
STAGING_STORAGE
CATALOG_DATABASE write access
SOURCE_STORAGE write access
CHECKSUM_SERVICE
```

Their temporary failure may remove administrative allowed actions without disabling Reader catalog access.

---

# 39. Health Aggregation

Health aggregation shall evaluate:

```text
component classification
+
component state
+
affected capabilities
+
current maintenance policy
```

It shall not simply choose the worst state from every optional provider.

---

# 40. Server Health Aggregation

Baseline rules:

```text
Any required server component UNAVAILABLE
→ ServerHealthState = UNHEALTHY

Any required server component DEGRADED
→ ServerHealthState = DEGRADED

Only optional components DEGRADED or UNAVAILABLE
→ HEALTHY or DEGRADED according to operational significance

Authorized maintenance active
→ MAINTENANCE

Startup incomplete
→ STARTING
```

---

# 41. Library Health Aggregation

Baseline rules:

```text
No Master Library
→ UNINITIALIZED

Initialization active
→ INITIALIZING

Unsupported format/schema
→ UNSUPPORTED

Structural invariant violation
→ INVALID

Required Library component unavailable
→ UNAVAILABLE

Non-critical Library component impaired
→ DEGRADED

All required Library components available
→ AVAILABLE

Authorized Library maintenance
→ MAINTENANCE
```

---

# 42. State Precedence

When several conditions coexist, the following precedence applies to ServerHealthState:

```text
MAINTENANCE
UNHEALTHY
STARTING
DEGRADED
HEALTHY
```

For MasterLibraryHealthState:

```text
UNSUPPORTED
INVALID
MAINTENANCE
INITIALIZING
UNAVAILABLE
DEGRADED
AVAILABLE
UNINITIALIZED
```

`UNINITIALIZED` applies only when no Library exists.

Precedence implementation shall remain deterministic.

---

# 43. Health and Capability Availability

Health shall expose or derive the current availability of major actions.

Examples:

```text
CATALOG_BROWSE
CATALOG_SEARCH
PUBLICATION_DETAILS
PUBLICATION_DOWNLOAD
ADMIN_PUBLICATION_REGISTRATION
ADMIN_SOURCE_REPLACEMENT
FULL_INTEGRITY_VALIDATION
```

A degraded system may permit only a subset.

---

# 44. Health Does Not Replace Authorization

A health response may indicate that an action is operationally available.

It does not grant permission.

Authorization still depends on:

* authenticated Device;
* DeviceRole;
* endpoint policy;
* resource state.

---

# 45. Health and Publication Availability

Master Library health does not replace individual PublicationAvailability.

Example:

```text
Master Library = AVAILABLE
Publication A = AVAILABLE
Publication B = CORRUPTED
Publication C = WITHDRAWN
```

This is valid.

---

# 46. Health Endpoint Overview

The baseline endpoints are:

```text
GET /v1/health
GET /v1/health/live
GET /v1/health/ready
GET /v1/health/components
```

---

# 47. GET /v1/health

## Purpose

Returns a safe summarized view of:

* server health;
* Master Library health;
* high-level capability availability;
* selected provider states;
* server timestamp.

## Authentication

Unauthenticated.

## Disclosure Level

Public and bounded.

---

# 48. Public Health Response

Baseline response:

```json
{
  "server": {
    "state": "HEALTHY"
  },
  "library": {
    "initialized": true,
    "state": "AVAILABLE"
  },
  "capabilities": {
    "catalogBrowse": true,
    "publicationDownload": true,
    "administration": true
  },
  "providers": {
    "ocr": "DISABLED",
    "ai": "DISABLED"
  },
  "checkedAt": "2026-07-16T19:00:00Z"
}
```

---

# 49. Public Health Response Requirements

The public response shall contain:

```text
server
library
capabilities
checkedAt
```

`providers` is optional and shall include only approved safe provider summaries.

---

# 50. Public Server Health Object

Schema direction:

```yaml
type: object
required:
  - state
properties:
  state:
    $ref: '#/components/schemas/ServerHealthState'
```

No internal component names or failure causes are required publicly.

---

# 51. Public Library Health Object

Schema direction:

```yaml
type: object
required:
  - initialized
  - state
properties:
  initialized:
    type: boolean
  state:
    $ref: '#/components/schemas/MasterLibraryHealthState'
```

When uninitialized:

```json
{
  "initialized": false,
  "state": "UNINITIALIZED"
}
```

---

# 52. Public Capability Health

The initial public capability summary may contain:

```text
catalogBrowse
catalogSearch
publicationDetails
publicationDownload
administration
```

Each value is a boolean indicating current operational availability.

It is not authorization.

---

# 53. Public Provider Summary

Optional provider fields may include:

```text
ocr
ai
export
import
```

Values use ComponentHealthState.

Providers that are not part of Module 1 may be omitted or marked `DISABLED`.

---

# 54. Public Health Data Minimization

The unauthenticated endpoint shall not expose:

* database engine;
* database file;
* source-storage path;
* NAS mount point;
* registered devices;
* credential state;
* host metrics;
* stack traces;
* exact error causes;
* publication metadata;
* personal state.

---

# 55. GET /v1/health/live

## Purpose

Determines process liveness.

## Authentication

Unauthenticated.

## Required Checks

Only lightweight process-level checks:

* request handler responsive;
* event loop capable of responding;
* process not intentionally terminating.

It shall not query every dependency.

---

# 56. Liveness Success

Response:

```text
204 No Content
```

or:

```json
{
  "status": "LIVE",
  "checkedAt": "2026-07-16T19:00:00Z"
}
```

The approved baseline is:

```text
204 No Content
```

to keep the probe lightweight.

---

# 57. Liveness Failure

If the process cannot respond, no HTTP response may be possible.

If it can respond while intentionally terminating, it may return:

```text
503 Service Unavailable
```

The endpoint shall not report failure merely because the NAS storage is unavailable.

---

# 58. Liveness Invariant

The following condition is valid:

```text
GET /v1/health/live
→ 204

GET /v1/health/ready
→ 503
```

This means the process is alive but not ready.

---

# 59. GET /v1/health/ready

## Purpose

Determines whether the server can safely accept ordinary operational traffic.

## Authentication

Unauthenticated.

## Required Checks

Readiness includes:

* startup complete;
* valid server identity;
* valid required configuration;
* TLS identity available;
* authentication store available;
* catalog persistence available;
* required startup recovery complete;
* Master Library state suitable for at least configured ordinary operations.

---

# 60. Readiness Success

When ready:

```text
204 No Content
```

---

# 61. Readiness Failure

When not ready:

```text
503 Service Unavailable
```

The response may be empty for infrastructure probes.

The server should include:

```text
Retry-After
```

when a temporary maintenance or startup delay is known.

---

# 62. Readiness and Uninitialized Library

The server may be considered ready for bootstrap administration while the Library is uninitialized.

Therefore, readiness has two possible deployment policies:

```text
BOOTSTRAP_READY
OPERATIONAL_READY
```

The approved v1 `/ready` policy is:

```text
server ready for its currently valid lifecycle state
```

Thus, an uninitialized but correctly configured server may return ready because it can safely serve bootstrap and initialization operations.

The public `/health` response still reports Library `UNINITIALIZED`.

---

# 63. Readiness and Reader Operations

A ready bootstrap server does not imply Reader catalog availability.

Clients shall inspect:

* Library state;
* capability availability;
* allowed actions.

---

# 64. Readiness and Maintenance

During maintenance:

* liveness succeeds;
* readiness may fail for ordinary traffic;
* `/health` reports `MAINTENANCE`;
* administrative maintenance endpoints may remain accessible.

The deployment readiness probe should return `503` when ordinary traffic must be removed.

---

# 65. GET /v1/health/components

## Purpose

Returns detailed health information for authorized diagnostics.

## Authentication

Bearer credential required.

## Authorization

The approved baseline requires:

```text
ADMINISTRATOR
```

---

# 66. Component Health Response

Example:

```json
{
  "server": {
    "state": "DEGRADED",
    "checkedAt": "2026-07-16T19:00:00Z"
  },
  "library": {
    "initialized": true,
    "masterLibraryId": "2cc17a92-3bc4-443b-9cc3-b5fc23a12832",
    "state": "DEGRADED",
    "catalogRevision": 42
  },
  "components": [
    {
      "code": "SERVER_IDENTITY",
      "classification": "REQUIRED",
      "state": "AVAILABLE",
      "checkedAt": "2026-07-16T19:00:00Z"
    },
    {
      "code": "CATALOG_DATABASE",
      "classification": "REQUIRED",
      "state": "AVAILABLE",
      "checkedAt": "2026-07-16T19:00:00Z"
    },
    {
      "code": "SOURCE_STORAGE",
      "classification": "REQUIRED",
      "state": "AVAILABLE",
      "checkedAt": "2026-07-16T19:00:00Z"
    },
    {
      "code": "OCR_PROVIDER",
      "classification": "OPTIONAL",
      "state": "UNAVAILABLE",
      "message": "The OCR provider is temporarily unavailable.",
      "checkedAt": "2026-07-16T19:00:00Z"
    }
  ],
  "availableActions": [
    "CATALOG_BROWSE",
    "CATALOG_SEARCH",
    "PUBLICATION_DETAILS",
    "PUBLICATION_DOWNLOAD"
  ],
  "checkedAt": "2026-07-16T19:00:00Z"
}
```

---

# 67. HealthComponent Schema

Conceptually:

```yaml
type: object
required:
  - code
  - classification
  - state
  - checkedAt
properties:
  code:
    $ref: '#/components/schemas/HealthComponentCode'
  classification:
    $ref: '#/components/schemas/HealthComponentClassification'
  state:
    $ref: '#/components/schemas/ComponentHealthState'
  message:
    $ref: '#/components/schemas/SafeMessage'
  checkedAt:
    $ref: '#/components/schemas/Timestamp'
  latencyMs:
    type: integer
    minimum: 0
```

`latencyMs` is optional.

---

# 68. HealthComponentClassification

Public diagnostic values:

```text
REQUIRED
OPTIONAL
```

---

# 69. HealthComponentCode

Initial component codes:

```text
SERVER_IDENTITY
TLS_IDENTITY
CONFIGURATION
AUTHENTICATION_STORE
CATALOG_DATABASE
CATALOG_INDEXES
CATALOG_REVISION
SOURCE_REGISTRY
SOURCE_STORAGE
STAGING_STORAGE
CURSOR_SIGNING
STARTUP_RECOVERY
BACKGROUND_JOBS
COVER_STORAGE
OCR_PROVIDER
AI_PROVIDER
IMPORT_ENGINE
EXPORT_ENGINE
METRICS_EXPORTER
TRACING_EXPORTER
```

---

# 70. Component Code Stability

Health component codes shall:

* remain stable;
* use uppercase snake case;
* have one meaning;
* avoid vendor-specific names;
* not expose physical storage details.

---

# 71. Component Message

The optional `message` shall be:

* safe;
* concise;
* diagnostic;
* non-sensitive;
* independent from raw exception messages.

Example:

```text
The source storage is temporarily unavailable.
```

Incorrect:

```text
EACCES: permission denied, open /volume1/knowledgeos/library/...
```

---

# 72. Component Latency

`latencyMs` may be exposed to authenticated Administrators.

It shall represent the duration of the health check itself.

It is diagnostic, not an SLA guarantee.

---

# 73. Health Check Timestamp

Every response and component shall use UTC RFC 3339 timestamps.

`checkedAt` indicates when the state was evaluated.

---

# 74. Health Snapshot Consistency

A health response shall be assembled from one bounded evaluation cycle.

Component timestamps may differ slightly.

The top-level state shall derive from the component results included in or associated with that cycle.

---

# 75. Health Check Execution Modes

Health checks may be:

```text
ON_DEMAND
CACHED
BACKGROUND
```

---

# 76. On-Demand Checks

Lightweight checks may run during the request.

Examples:

* process liveness;
* configuration loaded;
* identity object present.

---

# 77. Cached Checks

Potentially expensive checks should use recent cached results.

Examples:

* catalog integrity;
* source-root traversal;
* provider connectivity;
* full index validation.

The response shall expose `checkedAt`.

---

# 78. Background Checks

Expensive checks may run on a scheduled background job.

Examples:

* full source checksum validation;
* orphan detection;
* deep catalog consistency scan;
* provider diagnostics.

Their results should not block every health request.

---

# 79. Health Result Freshness

Each check may define a maximum acceptable age.

When the last result exceeds its freshness window:

```text
state = UNKNOWN
```

or the check is refreshed.

Required checks shall not remain indefinitely `AVAILABLE` from stale evidence.

---

# 80. Freshness Windows

Suggested baseline direction:

```text
liveness                     immediate
server identity              cached until configuration change
catalog connection           ≤ 30 seconds
source storage access        ≤ 30 seconds
startup recovery             event-driven
optional providers           ≤ 60 seconds
deep integrity scan          scheduled
```

Final operational values belong in configuration.

---

# 81. Health Check Timeouts

Every external or storage check shall have a bounded timeout.

A timed-out check shall become:

```text
DEGRADED
```

or:

```text
UNAVAILABLE
```

according to component requirements and failure semantics.

It shall not block the health endpoint indefinitely.

---

# 82. Health Check Concurrency

Independent component checks may run concurrently.

Concurrency shall remain bounded.

The health endpoint shall not create an unbounded fan-out to every publication or provider.

---

# 83. Health Check Side Effects

Health checks shall be read-only where practical.

They shall not:

* mutate CatalogRevision;
* register publications;
* repair sources automatically;
* rotate credentials;
* delete staging files;
* update personal state.

A dedicated recovery workflow owns mutations.

---

# 84. Storage Health Checks

Storage health shall distinguish:

```text
read availability
write availability
capacity
consistency
```

A Reader-only capability may remain available when write access is unavailable.

---

# 85. Source Storage Read Health

The source-storage read check verifies:

* configured root resolves;
* root is readable;
* expected Library context is accessible;
* bounded safe probe succeeds.

It shall not scan all source files.

---

# 86. Source Storage Write Health

The write check verifies whether administrative commits can safely proceed.

It may use:

* a controlled temporary file;
* a dedicated health-check area;
* atomic create/delete.

It shall not modify authoritative publication sources.

---

# 87. Read-Only Degradation

Example:

```text
source read = AVAILABLE
source write = UNAVAILABLE
```

Possible result:

```text
Server = DEGRADED
Library = DEGRADED
Catalog browse = available
Publication download = available
Administration = unavailable
```

---

# 88. Catalog Database Health

The catalog check evaluates:

* connection;
* basic read query;
* schema compatibility;
* CatalogRevision readability;
* required tables;
* required indexes where practical.

Deep logical consistency remains a separate scheduled check.

---

# 89. Catalog Database Write Health

Administrative readiness additionally evaluates bounded write capability or transaction readiness.

It shall not create authoritative catalog mutations.

---

# 90. Catalog Index Health

Missing or invalid required indexes may produce:

* `DEGRADED` when performance is impaired but correctness remains;
* `UNAVAILABLE` when required query correctness cannot be guaranteed.

---

# 91. CatalogRevision Health

The check verifies:

* revision exists;
* revision is non-negative;
* revision context matches MasterLibraryId;
* revision can be read consistently.

It does not increment the revision.

---

# 92. Source Registry Health

The source registry check verifies:

* records readable;
* current source references structurally resolvable;
* no impossible current-version state detected in the bounded check.

A full source-file comparison belongs to reconciliation.

---

# 93. Authentication Store Health

The authentication-store check verifies:

* credential records readable;
* required verifier configuration present;
* server credential pepper available;
* device-role resolution operational.

It shall not test real credentials through logs or fixtures.

---

# 94. Cursor Signing Health

The cursor-signing check verifies:

* signing key available;
* signing and verification round-trip succeeds using synthetic data;
* key format valid.

It shall not expose the signing secret.

---

# 95. TLS Identity Health

The TLS identity check verifies:

* certificate and key available;
* public-key fingerprint derivable;
* certificate currently valid according to policy;
* private key readable by the server;
* key-certificate relationship valid.

It shall not expose private-key details.

---

# 96. Startup Recovery Health

The startup-recovery component remains:

```text
UNKNOWN or UNAVAILABLE
```

until startup reconciliation has completed.

Normal readiness shall not become successful before required recovery completes.

---

# 97. Background Job Health

Background job health may evaluate:

* scheduler running;
* queue available;
* no permanently blocked critical jobs;
* last successful execution within expected period.

Optional delayed jobs may degrade rather than disable core Reader operations.

---

# 98. OCR Provider Health

OCR is optional in Module 1.

States:

```text
DISABLED
AVAILABLE
DEGRADED
UNAVAILABLE
UNKNOWN
```

OCR failure shall not prevent:

* catalog browsing;
* publication download;
* local opening of existing PDFs.

---

# 99. AI Provider Health

AI providers are optional.

AI failure shall not make the Master Library unavailable.

The response shall not disclose:

* provider credentials;
* API keys;
* private endpoints;
* model prompts.

---

# 100. Import Engine Health

Import-engine health affects administrative publication registration.

Its failure may remove:

```text
ADMIN_PUBLICATION_REGISTRATION
```

while Reader operations remain available.

---

# 101. Export Engine Health

Export-engine health is outside core Master Library Reader functionality.

Its failure shall be optional unless an operation explicitly requires it.

---

# 102. Provider Health Abstraction

The public health contract shall expose provider role, not vendor identity, unless vendor disclosure is explicitly approved.

Preferred:

```text
AI_PROVIDER
```

Avoid:

```text
OPENAI_API
```

in the stable public health registry.

---

# 103. Health and NAS Terminology

The contract shall not model the NAS itself as one opaque health state.

Instead, it shall report functional storage roles such as:

```text
SOURCE_STORAGE
CATALOG_DATABASE
STAGING_STORAGE
BACKUP_STORAGE
```

This keeps the model vendor-neutral.

---

# 104. Public Health HTTP Status

`GET /v1/health` shall normally return:

```text
200 OK
```

when a valid health document can be produced, even when the document reports degraded or unavailable components.

This allows clients to inspect the health state.

---

# 105. Public Health Endpoint Failure

`GET /v1/health` returns:

```text
503 Service Unavailable
```

only when the server cannot construct a valid health response or when server bootstrap health is fundamentally unavailable.

---

# 106. Probe Endpoint Status

Probe endpoints use HTTP status directly:

```text
/v1/health/live
204 when live
503 when terminating or unable to serve

/v1/health/ready
204 when ready
503 when not ready
```

---

# 107. Components Endpoint HTTP Status

`GET /v1/health/components` shall normally return:

```text
200 OK
```

with the detailed health snapshot.

Authentication and authorization failures use normal error contracts.

---

# 108. Health Error Codes

Public health-related error codes include:

```text
HEALTH_CHECK_FAILED
HEALTH_SNAPSHOT_UNAVAILABLE
READINESS_CHECK_FAILED
SERVER_STARTING
SERVER_UNHEALTHY
SERVER_MAINTENANCE
COMPONENT_HEALTH_UNKNOWN
```

Existing specific errors remain preferred when appropriate.

---

# 109. HEALTH_CHECK_FAILED

Used when one health evaluation cannot complete as expected but a valid response cannot be produced.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 110. HEALTH_SNAPSHOT_UNAVAILABLE

Used when no valid current or cached health snapshot exists.

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 111. READINESS_CHECK_FAILED

Used by diagnostic clients when the server is not ready.

Probe responses may remain bodyless.

When JSON is returned:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

---

# 112. SERVER_STARTING

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

The response may contain `Retry-After`.

---

# 113. SERVER_UNHEALTHY

HTTP:

```text
503 Service Unavailable
```

Retryable depends on the underlying safe public classification.

The default is:

```text
false
```

until the cause is known to be transient.

---

# 114. SERVER_MAINTENANCE

HTTP:

```text
503 Service Unavailable
```

Retryable:

```text
true
```

when maintenance is expected to finish.

---

# 115. Client Health Interpretation

The client shall interpret health as guidance for remote operations.

It shall not use server health to invalidate valid local content.

---

# 116. Client Behavior — Server HEALTHY

The client may:

* authenticate;
* inspect Library descriptor;
* browse catalog when allowed;
* acquire publications when allowed;
* perform administration according to role.

---

# 117. Client Behavior — Server DEGRADED

The client shall:

* inspect capability availability;
* preserve remote data already loaded;
* disable unavailable actions;
* present a non-blocking warning when appropriate;
* avoid assuming every operation will fail.

---

# 118. Client Behavior — Server UNHEALTHY

The client shall:

* stop automatic protected operations;
* preserve local Library access;
* retain cached catalog metadata;
* show a server-unavailable state;
* allow manual retry when safe.

---

# 119. Client Behavior — Library UNAVAILABLE

The client may still:

* display local publications;
* display cached catalog;
* display server registration;
* inspect public health.

It shall disable:

* live catalog refresh;
* new publication download;
* remote publication details when unavailable.

---

# 120. Client Behavior — Library INVALID

The client shall:

* stop automatic catalog and acquisition retry;
* preserve local publications;
* present an Administrator-level warning;
* avoid attempting mutation outside recovery workflows.

---

# 121. Client Behavior — Library UNSUPPORTED

The client shall:

* block ordinary remote Library operations;
* preserve local publications;
* present compatibility guidance;
* avoid automatic migrations.

---

# 122. Client Behavior — Optional Provider Failure

An optional provider failure shall affect only features depending on that provider.

Example:

```text
OCR_PROVIDER = UNAVAILABLE
```

The client may disable OCR actions while keeping catalog and downloads available.

---

# 123. Health Refresh Policy

The client may refresh public health:

* during server registration;
* before pairing;
* after connection failure;
* when entering a diagnostic screen;
* periodically while online;
* after maintenance.

It shall not poll excessively.

---

# 124. Suggested Client Polling

Recommended baseline:

```text
foreground active connection: every 60 seconds
degraded state: bounded retry every 30–60 seconds
offline: exponential backoff
diagnostic screen: manual refresh
```

Final values belong to client configuration.

---

# 125. Health and Connectivity State

The client connectivity model may use health results:

```text
HTTP unreachable
→ OFFLINE

HTTP reachable + identity valid + health healthy
→ ONLINE

HTTP reachable + degraded state
→ DEGRADED

identity mismatch
→ IDENTITY_MISMATCH
```

---

# 126. Health and Authentication

A healthy public endpoint does not imply authentication is valid.

The client shall maintain authentication state separately.

---

# 127. Health and Trust

The client shall verify server trust before using authenticated detailed health endpoints.

The public health endpoint shall not replace ServerDescriptor identity verification.

---

# 128. Caching Public Health

Recommended:

```text
Cache-Control: no-store
```

because current operational state may change quickly.

---

# 129. ETag Exclusion

The initial health contract does not require ETag support.

Health state should be retrieved directly when needed.

---

# 130. Rate Limiting

Public health endpoints may use generous bounded rate limits.

Liveness and readiness probes shall be exempted or separately governed so orchestration does not trigger ordinary client rate limits.

---

# 131. Health Check Protection

Health endpoints shall resist:

* expensive repeated deep checks;
* provider fan-out attacks;
* path disclosure;
* timing-based internal topology discovery;
* unauthenticated component enumeration.

---

# 132. Public and Protected Disclosure

Public health provides summarized states.

Protected Administrator health may provide:

* component codes;
* required/optional classification;
* safe messages;
* latency;
* checked timestamps;
* current available actions.

It shall still exclude secrets and paths.

---

# 133. Internal Health Detail

The implementation may maintain richer internal health evidence:

* raw exception category;
* internal stack trace;
* storage mount diagnostics;
* provider response codes;
* migration logs.

This evidence shall not be returned through the public contract.

---

# 134. Health Logging

Every health-state transition should be logged.

Safe fields:

```text
previousState
newState
componentCode
classification
checkedAt
requestId?
safe reason code
```

---

# 135. Health Log Prohibitions

Health logs shall not contain:

* credentials;
* PairingCodes;
* secret keys;
* private certificate material;
* physical source paths where avoidable;
* publication content;
* personal state.

---

# 136. Health Metrics

Recommended metrics:

```text
knowledgeos_server_health_state
knowledgeos_library_health_state
knowledgeos_component_health_state
knowledgeos_health_check_duration_seconds
knowledgeos_health_check_failures_total
knowledgeos_readiness_failures_total
knowledgeos_health_state_transitions_total
```

---

# 137. Metric Representation

State metrics may use numeric gauge values with documented label semantics internally.

The public API continues to use stable string states.

---

# 138. Metric Cardinality

Metrics shall not use:

* PublicationId;
* DeviceId;
* RequestId;
* cursor;
* endpoint URL containing IDs;

as unbounded labels.

---

# 139. OpenTelemetry Integration

Health-check spans may record:

* component code;
* result state;
* duration;
* timeout;
* cached/on-demand classification.

Spans shall not contain secrets or paths.

---

# 140. Prometheus Integration

A future Prometheus endpoint may expose internal operational metrics.

It is not part of the public Master Library API contract.

It should require deployment-level access controls.

---

# 141. Health State Events

The server may emit internal events:

```text
ServerHealthChanged
MasterLibraryHealthChanged
ComponentHealthChanged
ReadinessChanged
```

These events are not public integration events by default.

---

# 142. Health Transition Debouncing

To prevent rapid state flapping, health aggregation may require:

* several consecutive failures;
* a minimum degraded interval;
* a success confirmation threshold.

Critical deterministic failures may transition immediately.

---

# 143. Immediate Failure Conditions

The following should normally cause immediate state change:

```text
server identity missing
credential pepper missing
catalog schema unsupported
MasterLibraryId invalid
catalog database unreadable
source storage disconnected for required Reader operation
startup recovery failed
```

---

# 144. Debounced Failure Conditions

The following may use bounded failure thresholds:

```text
optional provider timeout
temporary background-job delay
metrics exporter failure
single transient storage latency spike
```

---

# 145. Recovery Transition

A component may return to `AVAILABLE` only after a successful validated health check.

The aggregator shall then recompute Server and Library state.

---

# 146. Health and Maintenance Entry

Entering maintenance shall:

* set ServerHealthState or MasterLibraryHealthState to `MAINTENANCE`;
* update readiness according to traffic policy;
* remove blocked available actions;
* emit audit and health transition evidence.

---

# 147. Health and Maintenance Exit

Exiting maintenance requires:

* maintenance operation complete;
* required components revalidated;
* startup/recovery markers cleared;
* readiness recomputed.

The state shall not jump to `HEALTHY` or `AVAILABLE` without validation.

---

# 148. Health and Reconciliation

When persistence and filesystem disagree:

```text
STARTUP_RECOVERY = UNAVAILABLE
MasterLibraryHealthState = INVALID or UNAVAILABLE
```

depending on whether inconsistency is structural or potentially transient.

`RECONCILIATION_REQUIRED` remains the associated public error where relevant.

---

# 149. Full Integrity Scan

A full integrity scan is not part of ordinary health polling.

It may produce a summarized component result:

```text
SOURCE_INTEGRITY_SCAN = AVAILABLE | DEGRADED | UNAVAILABLE | UNKNOWN
```

after completion.

---

# 150. Individual Publication Corruption

One corrupted publication does not necessarily make the whole Library unavailable.

Baseline aggregation:

```text
single publication corrupted
→ PublicationAvailability = CORRUPTED
→ Library may remain DEGRADED or AVAILABLE
```

The exact Library degradation threshold may be policy-driven.

---

# 151. Corruption Threshold

The initial policy should mark the Library `DEGRADED` when one or more authoritative current sources are corrupted but the catalog remains safely usable.

It shall become `INVALID` or `UNAVAILABLE` when corruption affects:

* Library identity;
* catalog integrity;
* widespread source consistency;
* required structural invariants.

---

# 152. Cover Storage Failure

If cover storage is unavailable:

```text
COVER_STORAGE = UNAVAILABLE
Library = DEGRADED
Catalog browse = available
Publication download = available
Cover retrieval = unavailable
```

---

# 153. Staging Failure

If staging storage is unavailable:

```text
STAGING_STORAGE = UNAVAILABLE
Reader operations = available
Administrative source upload = unavailable
Server or Library = DEGRADED
```

---

# 154. Cursor Signing Failure

If cursor signing is unavailable:

```text
CURSOR_SIGNING = UNAVAILABLE
Catalog first page may not safely generate continuation
Catalog browse capability = unavailable or limited
ServerHealthState = UNHEALTHY or DEGRADED
```

The approved baseline is:

```text
ServerHealthState = UNHEALTHY
```

because catalog pagination is a required core contract.

---

# 155. Authentication Store Failure

If authentication store is unavailable:

```text
AUTHENTICATION_STORE = UNAVAILABLE
ServerHealthState = UNHEALTHY
Readiness = false
```

Public bootstrap health may still respond.

---

# 156. TLS Identity Failure

If production TLS identity is unavailable:

```text
TLS_IDENTITY = UNAVAILABLE
ServerHealthState = UNHEALTHY
Readiness = false
```

Production protected traffic shall not downgrade to HTTP.

---

# 157. Source Storage Failure

If source storage is unavailable but catalog database is readable:

```text
Catalog browse = available
Publication details = available
Publication download = unavailable
Library = DEGRADED or UNAVAILABLE
```

The approved baseline is:

```text
Library = DEGRADED
```

when metadata remains safely readable.

If the deployment defines source storage as mandatory for ordinary readiness, readiness policy may still fail.

---

# 158. Catalog Database Failure

If the catalog database is unavailable:

```text
CATALOG_DATABASE = UNAVAILABLE
Library = UNAVAILABLE
Server = UNHEALTHY
Catalog browse = unavailable
Publication details = unavailable
```

Previously downloaded local publications remain unaffected.

---

# 159. Server Identity Failure

If ServerId or trust identity cannot be loaded:

```text
SERVER_IDENTITY = UNAVAILABLE
Server = UNHEALTHY
Readiness = false
Pairing = unavailable
Credentials must not be accepted under uncertain identity
```

---

# 160. Health Contract Fixtures

Required fixtures:

```text
health-healthy.json
health-server-starting.json
health-server-degraded.json
health-server-unhealthy.json
health-library-uninitialized.json
health-library-available.json
health-library-degraded.json
health-library-unavailable.json
health-library-maintenance.json
health-library-invalid.json
health-library-unsupported.json
health-optional-provider-unavailable.json
health-source-storage-unavailable.json
health-catalog-unavailable.json
health-components-administrator.json
```

---

# 161. Public Health Contract Tests

Tests shall verify:

* endpoint works without authentication;
* response uses safe summarized fields;
* state enums valid;
* checkedAt valid;
* no physical paths;
* no credentials;
* no device data;
* no publication metadata;
* no personal state.

---

# 162. Liveness Tests

Tests shall verify:

* live process returns 204;
* catalog failure does not fail liveness;
* source-storage failure does not fail liveness;
* intentional shutdown may fail liveness;
* endpoint remains lightweight.

---

# 163. Readiness Tests

Tests shall verify:

* startup incomplete returns 503;
* server identity failure returns 503;
* authentication-store failure returns 503;
* catalog failure returns 503;
* startup recovery incomplete returns 503;
* valid uninitialized bootstrap server follows approved readiness policy;
* ordinary operational server returns 204.

---

# 164. Component Health Authorization Tests

Tests shall verify:

* unauthenticated request denied;
* Reader denied under Administrator-only baseline;
* Administrator accepted;
* secrets absent;
* component codes stable;
* required/optional classification present;
* unknown optional component decodes safely.

---

# 165. Aggregation Tests

Tests shall cover:

```text
all required available
required degraded
required unavailable
optional unavailable
maintenance active
uninitialized Library
unsupported format
invalid Library
source storage unavailable
catalog database unavailable
staging unavailable
OCR unavailable
```

---

# 166. Capability Derivation Tests

Tests shall verify:

* catalog database unavailable removes catalog actions;
* source storage unavailable removes publication download;
* staging unavailable removes publication registration;
* OCR unavailable removes only OCR-dependent actions;
* Reader role does not gain Administrator actions through health.

---

# 167. State Precedence Tests

Tests shall verify deterministic precedence.

Examples:

```text
maintenance + optional provider failure
→ MAINTENANCE

invalid Library + source storage unavailable
→ INVALID

unsupported format + maintenance marker
→ UNSUPPORTED
```

---

# 168. Freshness Tests

Tests shall verify:

* fresh cached check accepted;
* stale optional check becomes UNKNOWN;
* stale required check affects readiness according to policy;
* checkedAt preserved;
* background refresh updates state.

---

# 169. Timeout Tests

Tests shall verify:

* health check timeout bounded;
* timed-out required component affects aggregate state;
* timed-out optional provider does not block core operations;
* endpoint response remains bounded.

---

# 170. Security Tests

Tests shall prove health responses do not expose:

```text
NAS paths
database file paths
container mount paths
credentials
credential hashes
PairingCodes
cursor signing secret
TLS private key
stack traces
SQL
personal state
```

---

# 171. Client Tests

Client tests shall verify:

* local Library remains available when server unhealthy;
* cached catalog preserved when Library unavailable;
* optional-provider failure disables only related features;
* identity mismatch remains separate from health;
* unknown health state maps safely;
* health polling uses bounded backoff.

---

# 172. Unknown Health State Handling

Clients shall map unknown future state values to:

```text
UNKNOWN
```

or an equivalent safe unsupported state.

Unknown values shall not map to:

```text
HEALTHY
AVAILABLE
```

---

# 173. Health Versioning

Adding optional component codes is compatible when clients handle unknown values safely.

Changing the meaning of existing state values is breaking.

Removing required fields from health responses is breaking.

---

# 174. Health Contract Completion Gate

This document is complete when:

```text
[ ] Health layers are explicit
[ ] Liveness is defined
[ ] Readiness is defined
[ ] Server health is defined
[ ] Master Library health is defined
[ ] Component health is defined
[ ] Required components are defined
[ ] Optional components are defined
[ ] Aggregation rules are defined
[ ] State precedence is defined
[ ] Public health endpoint is defined
[ ] Liveness endpoint is defined
[ ] Readiness endpoint is defined
[ ] Detailed component endpoint is defined
[ ] Public disclosure boundaries are defined
[ ] Administrator diagnostics are defined
[ ] Storage health behavior is defined
[ ] Catalog health behavior is defined
[ ] Authentication health behavior is defined
[ ] Provider health behavior is defined
[ ] Capability derivation is defined
[ ] Client behavior is defined
[ ] Caching and freshness are defined
[ ] Check timeouts are defined
[ ] Observability integration is defined
[ ] Logging and metrics are defined
[ ] Security boundaries are defined
[ ] Fixtures are defined
[ ] Testing obligations are defined
[ ] Local Library independence is preserved
[ ] Personal-state exclusion is preserved
[ ] No architectural contradiction remains
```

---

# 175. Health Contract Invariants

The following invariants apply:

* Liveness is not readiness.
* Readiness is not Master Library availability.
* Master Library availability is not Publication availability.
* Optional-provider failure does not automatically make the server unhealthy.
* Required-component failure affects readiness.
* Health checks are bounded.
* Health checks do not mutate Domain authority.
* Public health responses are minimal.
* Detailed health requires authorization.
* Unknown health never maps to success.
* Server failure does not invalidate valid local publications.
* Library unavailability does not delete cached catalog metadata.
* OCR or AI failure does not block catalog and publication download.
* Health does not replace authorization.
* Health does not replace compatibility checks.
* Physical paths remain private.
* Secrets remain private.
* Personal state remains absent.

---

# 176. Prohibited Health Designs

The module shall not:

* represent health with one binary `UP` value;
* use liveness to perform deep database or storage scans;
* report readiness while required recovery is incomplete;
* report `AVAILABLE` from stale unchecked evidence indefinitely;
* make optional AI or OCR providers mandatory for core Reader health;
* expose raw exception messages;
* expose NAS paths;
* expose credentials;
* expose private-key details;
* expose registered devices publicly;
* scan every publication on each health request;
* mutate CatalogRevision during a health check;
* repair authoritative state during ordinary health polling;
* treat one corrupted publication as automatic total server failure;
* infer authorization from health capabilities;
* delete local content because the server is unhealthy;
* include annotation or reading-progress health in this module.

---

# 177. Related Documents

## Contracts

* `README.md`
* `APIConventions.md`
* `CommonTypes.md`
* `Authentication.md`
* `ErrorContracts.md`
* `ServerContracts.md`
* `CatalogContracts.md`
* `PublicationContracts.md`
* `AcquisitionContracts.md`
* `AdministrationContracts.md`
* `Versioning.md`
* `Compatibility.md`

## Domain

* `../03-Domain/States.md`
* `../03-Domain/Errors.md`
* `../03-Domain/DomainModel.md`

## Technical Design

* `../02-TechnicalDesign/SystemDesign.md`
* `../02-TechnicalDesign/ServerDesign.md`
* `../02-TechnicalDesign/ClientDesign.md`
* `../02-TechnicalDesign/ErrorModel.md`
* `../02-TechnicalDesign/TechnologyDecisions.md`

## Architecture

* `../../../00-Architecture/03-Kernel/Observability.md`
* `../../../00-Architecture/03-Kernel/Logging.md`
* `../../../00-Architecture/06-Execution/Reliability/Metrics.md`
* `../../../00-Architecture/06-Execution/Reliability/Observability.md`
* `../../../00-Architecture/06-Execution/Reliability/Tracing.md`

---

# 178. Status

**Approved**

The KnowledgeOS health model is frozen as:

```text
Process Liveness
        +
Server Readiness
        +
Master Library Health
        +
Required Component Health
        +
Optional Provider Health
        +
Capability Availability
```

The infrastructure contract foundation is now complete.

The next document is:

```text
01-MasterLibrary/04-Contracts/CatalogContracts.md
```

It shall define the first complete functional Reader API of KnowledgeOS:

```text
GET /v1/catalog
GET /v1/catalog/revision
```

including catalog visibility, search, filters, PublicationSummary, pagination integration, cached snapshots and remote-authority semantics.
