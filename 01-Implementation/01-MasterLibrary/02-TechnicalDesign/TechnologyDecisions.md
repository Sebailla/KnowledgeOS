
# Master Library Technology Decisions

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Technical Design

**Document:** Technology Decisions

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Requirements Baseline:** Master Library Requirements v1.0

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document selects and justifies the concrete technologies used to implement the Master Library Module.

It freezes the initial implementation stack for:

* repository organization;
* KnowledgeOS Server;
* Master Catalog persistence;
* NAS source-publication storage;
* network API;
* contract generation;
* authentication;
* server trust;
* macOS client;
* client persistence;
* client file storage;
* testing;
* packaging;
* deployment;
* continuous integration.

These decisions authorize the transition from abstract Technical Design to concrete implementation planning.

---

# 2. Decision Scope

The decisions apply to the first production-capable Master Library vertical:

```text
KnowledgeOS Server on NAS
        ↓
Master Catalog
        ↓
PDF source-publication storage
        ↓
Versioned LAN API
        ↓
Native macOS client
        ↓
Publication acquisition
        ↓
Selective Local Library
        ↓
Offline local availability
```

They do not select technologies for:

* iCloud or CloudKit synchronization;
* annotations;
* UDM;
* DPM;
* Render;
* AI;
* Plugins;
* public internet access.

---

# 3. Decision Principles

Technology choices are evaluated according to:

1. architecture compatibility;
2. single-developer feasibility;
3. operational simplicity;
4. NAS deployability;
5. data integrity;
6. testability;
7. explicit migrations;
8. bounded-resource behavior;
9. long-term maintainability;
10. future Apple-platform reuse;
11. low initial financial cost;
12. avoidance of unnecessary infrastructure.

---

# 4. Decision Summary

The approved initial stack is:

```text
Repository
    pnpm monorepo
    Turborepo
    TypeScript project references where useful

KnowledgeOS Server
    Node.js 24 LTS
    TypeScript
    NestJS 11
    Fastify adapter
    REST API
    OpenAPI 3.1
    Zod validation at contract boundaries
    SQLite
    Drizzle ORM
    better-sqlite3 driver
    Pino structured logging
    SHA-256 integrity
    HTTP streaming with optional Range support
    OCI container deployment

macOS Client
    Swift 6 language mode
    SwiftUI
    Swift Concurrency
    URLSession
    GRDB over SQLite
    Keychain
    CryptoKit
    Application Support filesystem storage
    Quick Look or PDFKit placeholder opening

Testing
    Vitest
    NestJS testing utilities
    Supertest
    Testcontainers where needed
    Swift Testing
    XCTest / XCUITest where required
    temporary real filesystems
    real SQLite integration tests

Contracts
    OpenAPI as transport-contract source of truth
    generated Swift request/response models where practical
```

---

# 5. Repository Decision

## Decision TD-001

KnowledgeOS implementation shall use one monorepo.

The initial structure shall be:

```text
knowledgeos/
├── apps/
│   ├── server/
│   └── macos/
├── packages/
│   ├── server-domain/
│   ├── server-application/
│   ├── api-contract/
│   ├── error-registry/
│   ├── config/
│   └── test-support/
├── tooling/
├── docs/
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

The native macOS Xcode project remains inside:

```text
apps/macos/
```

It participates in the same repository but not in the pnpm dependency graph.

---

# 6. Monorepo Rationale

A monorepo is selected because it provides:

* one implementation history;
* synchronized server and API-contract changes;
* one module-focused working tree;
* simpler CI coordination;
* easier documentation traceability;
* easier end-to-end test orchestration;
* reduced overhead for a single developer.

The monorepo shall not imply inappropriate runtime coupling.

The server and macOS client remain independent applications.

---

# 7. Rejected Repository Alternatives

## Multiple Repositories

Rejected initially because it would add:

* release coordination;
* contract-version coordination;
* duplicated automation;
* increased administrative overhead.

It may be reconsidered if release ownership becomes independent later.

## One Undifferentiated Application Directory

Rejected because it would blur:

* server/client boundaries;
* package ownership;
* Domain independence;
* deployment artifacts.

---

# 8. JavaScript Package Manager

## Decision TD-002

The TypeScript workspace shall use:

```text
pnpm
```

The repository shall pin the package-manager version through the `packageManager` field.

---

# 9. pnpm Rationale

pnpm is selected because it provides:

* workspace support;
* deterministic lockfile;
* efficient disk use;
* strict dependency resolution;
* familiarity for the project owner;
* straightforward CI use.

No npm or Yarn lockfiles shall coexist in the repository.

---

# 10. Monorepo Task Runner

## Decision TD-003

The TypeScript workspace shall use:

```text
Turborepo
```

Turborepo shall coordinate:

* build;
* type checking;
* linting;
* unit tests;
* integration tests;
* generated contracts;
* development tasks.

It shall not become an architectural dependency.

---

# 11. Server Runtime

## Decision TD-004

KnowledgeOS Server shall use:

```text
Node.js 24 LTS
```

Node.js 24 is selected rather than Node.js 26 Current because the server requires an LTS baseline, predictable security maintenance and conservative production behavior. Node.js 24 is the active LTS line in July 2026.

---

# 12. Node Version Policy

The repository shall pin:

* the Node major version;
* the minimum supported minor version;
* the production container digest or exact image version.

Patch and compatible minor updates may be adopted after automated validation.

The project shall not depend on an End-of-Life Node release.

---

# 13. Server Language

## Decision TD-005

KnowledgeOS Server shall use:

```text
TypeScript
```

Required compiler policy:

```text
strict = true
noUncheckedIndexedAccess = true
exactOptionalPropertyTypes = true
useUnknownInCatchVariables = true
```

Unchecked `any` shall not be used at public or Domain boundaries.

---

# 14. TypeScript Rationale

TypeScript is selected because it provides:

* strong compatibility with the developer's primary stack;
* mature Node.js tooling;
* explicit server contracts;
* testable modular Domain code;
* effective OpenAPI integration;
* high implementation velocity.

TypeScript compile-time types do not replace runtime validation.

---

# 15. Server Framework

## Decision TD-006

KnowledgeOS Server shall use:

```text
NestJS 11
```

NestJS is selected as the modular application framework.

The official NestJS migration guidance identifies the current major migration path as version 10 to 11.

---

# 16. NestJS Responsibilities

NestJS shall provide:

* application bootstrap;
* module composition;
* dependency injection;
* controllers;
* guards;
* interceptors;
* configuration integration;
* testing utilities;
* OpenAPI integration;
* graceful shutdown hooks.

NestJS shall not define Domain semantics.

---

# 17. NestJS Boundary Rules

The following shall remain outside the Domain packages:

* Nest decorators;
* controllers;
* guards;
* interceptors;
* framework exceptions;
* database decorators;
* HTTP request types.

Domain and application packages shall remain testable without creating a Nest application.

---

# 18. HTTP Adapter

## Decision TD-007

NestJS shall use:

```text
Fastify adapter
```

Fastify is selected instead of the default Express adapter for:

* efficient streaming;
* explicit request limits;
* lower framework overhead;
* schema-oriented behavior;
* strong lifecycle control.

The module shall not depend directly on Fastify types outside the transport layer.

---

# 19. Rejected Server Framework Alternatives

## Plain Fastify

Not selected initially because the project benefits from NestJS module organization, dependency injection and testing conventions.

## Express

Not selected because Fastify better matches the bounded streaming and explicit resource-control requirements.

## Bun Runtime

Not selected for the first server baseline because Node.js LTS provides a more conservative NAS-production target and broader ecosystem maturity.

## Deno

Not selected because it would reduce reuse of the selected NestJS and pnpm ecosystem without a module requirement demanding it.

---

# 20. API Style

## Decision TD-008

The Master Library API shall use:

```text
REST over HTTP/HTTPS
```

The initial version prefix is:

```text
/v1
```

---

# 21. REST Rationale

REST is selected because the module requires:

* bounded catalog queries;
* explicit resource retrieval;
* HTTP streaming;
* Range requests;
* straightforward native Apple networking;
* conventional health endpoints;
* simple NAS operations.

GraphQL is not required for the first vertical.

---

# 22. API Contract Source

## Decision TD-009

The transport contract source of truth shall be:

```text
OpenAPI 3.1
```

NestJS provides official OpenAPI integration support.

---

# 23. OpenAPI Policy

The OpenAPI document shall define:

* endpoint paths;
* methods;
* request schemas;
* response schemas;
* error envelopes;
* authentication;
* pagination;
* headers;
* content media types;
* Range behavior;
* compatibility information.

The generated specification shall be checked into source control or deterministically reproducible.

---

# 24. Contract Generation

The project may generate:

* Swift transport models;
* Swift API-client scaffolding;
* TypeScript client types for tests;
* contract fixtures;
* API documentation.

Generated code shall not define the Domain model directly.

Generated output shall remain isolated from hand-written Domain code.

---

# 25. Runtime Validation

## Decision TD-010

Transport and configuration boundaries shall use:

```text
Zod
```

Zod shall validate:

* environment configuration;
* request DTOs where not already fully validated by transport schema;
* external response data in test or client-generation tooling;
* machine-readable error registry;
* manifest parsing where appropriate.

---

# 26. Validation Boundary Rule

Runtime validation is mandatory for:

* HTTP input;
* environment input;
* manifest input;
* database-to-Domain mapping;
* OpenAPI-derived external data;
* administrative metadata.

TypeScript interfaces alone are insufficient.

---

# 27. Catalog Database

## Decision TD-011

The server Master Catalog shall use:

```text
SQLite
```

One server process owns the catalog database.

The database file resides in the Master Library persistent volume and is accessed only by KnowledgeOS Server.

---

# 28. SQLite Rationale

SQLite is selected because the initial deployment has:

* one owning server process;
* limited write concurrency;
* read-dominant catalog access;
* no need for a separate database service;
* strong transactional semantics;
* simple backup and deployment;
* low NAS operational overhead.

SQLite WAL is persistent once enabled.

---

# 29. SQLite Deployment Constraint

The SQLite database shall be opened by the KnowledgeOS Server process running on the same NAS host or container environment that owns the database file.

Clients shall never open the database over a network share.

The database shall not be simultaneously opened by multiple unrelated server processes.

---

# 30. SQLite Journal Mode

## Decision TD-012

The default database configuration shall use:

```text
PRAGMA journal_mode = WAL
PRAGMA foreign_keys = ON
PRAGMA busy_timeout = governed value
```

WAL is selected for improved read/write coexistence within the single server runtime.

The deployment validation shall confirm that the reference NAS filesystem correctly supports the required locking and durability behavior.

---

# 31. WAL Fallback

If actual NAS validation demonstrates unsafe or unreliable WAL behavior on the selected storage topology:

1. the database shall move to a server-local persistent filesystem on the NAS;
2. or journaling mode shall change through an approved IDR;
3. or PostgreSQL shall be reconsidered.

The implementation shall not ignore observed locking or durability failures.

---

# 32. Database Access Layer

## Decision TD-013

The server shall use:

```text
Drizzle ORM
```

Drizzle shall provide:

* typed schema definitions;
* SQL migrations;
* explicit query construction;
* transaction support;
* minimal runtime abstraction;
* readable generated SQL.

---

# 33. Database Driver

## Decision TD-014

The initial SQLite driver shall be:

```text
better-sqlite3
```

The driver is selected for synchronous, predictable SQLite access inside the server process.

Database operations shall not execute uncontrolled long-running work on the request path.

---

# 34. Native Driver Constraint

`better-sqlite3` includes native binaries.

Therefore:

* server images shall be built for each supported NAS architecture;
* initial supported architecture shall be frozen after identifying the reference NAS;
* x86_64 and ARM64 shall not be claimed without actual builds and tests;
* the final container image shall include the compiled driver;
* CI shall verify the selected target architecture.

---

# 35. Database Alternative Trigger

The driver shall be reconsidered if:

* the reference NAS architecture cannot build or run it reliably;
* container cross-compilation becomes disproportionate;
* Node's built-in SQLite support satisfies all required APIs and tooling;
* measured performance or operational evidence rejects it.

Changing the driver without changing schema semantics is an implementation-level decision, but shall be documented.

---

# 36. Rejected Database Alternatives

## PostgreSQL

Not selected initially because it adds:

* another service;
* credentials;
* backup coordination;
* greater memory use;
* more operational work.

It remains the preferred escalation option if true multi-process or higher-concurrency server requirements emerge.

## MongoDB

Not selected because the catalog has relational integrity, stable identities, versions and transactional consistency requirements.

## Database BLOB Storage

Not selected because publication payloads may be large and are better handled through governed filesystem streaming.

## JSON Catalog Files

Not selected because they would complicate:

* transactional mutation;
* querying;
* pagination;
* migrations;
* concurrency;
* integrity constraints.

---

# 37. Server File Storage

## Decision TD-015

Publication payloads shall use:

```text
NAS filesystem storage managed by KnowledgeOS Server
```

The database stores logical storage references and integrity metadata.

The filesystem stores:

* PDF source payloads;
* covers;
* staging files;
* quarantined files;
* backup artifacts where configured.

---

# 38. Filesystem Commit Strategy

The server shall prefer:

```text
atomic rename on the same filesystem
```

Registration staging and final publication storage shall be placed on the same filesystem where practical.

Cross-filesystem moves shall use a recoverable copy-validate-commit workflow.

---

# 39. Source Integrity

## Decision TD-016

Publication and local-payload integrity shall use:

```text
SHA-256
```

SHA-256 shall be calculated with streaming reads.

The checksum shall be represented in a canonical lowercase hexadecimal form.

---

# 40. PDF Validation

## Decision TD-017

The first registration baseline shall perform:

* file-signature validation;
* non-zero file validation;
* declared media-type validation;
* minimal structural open or parse;
* byte-length calculation;
* SHA-256 calculation.

Deep rendering correctness is deferred to the Render Module.

---

# 41. PDF Validation Library

The exact PDF parser may be selected during the server implementation spike.

The selected library shall:

* run in Node.js 24;
* support server-side validation;
* avoid requiring full rendering;
* have acceptable licensing;
* not require uploading content externally.

The library selection shall be recorded as a subordinate dependency decision.

---

# 42. Structured Logging

## Decision TD-018

The server shall use:

```text
Pino
```

Pino shall provide structured JSON logs.

NestJS logging shall be adapted to the same structured pipeline.

---

# 43. Logging Policy

Production logs shall use:

```text
JSON lines
UTC timestamps
stable severity
requestId
operation
safe identifiers
error code
duration where relevant
```

Development may use human-readable pretty formatting.

Pretty formatting shall not be installed or enabled in the production runtime unless explicitly required.

---

# 44. Metrics

## Decision TD-019

The server shall expose Prometheus-compatible metrics through a protected operational endpoint.

The initial implementation may use a lightweight Prometheus client library.

Required metrics include:

* request count;
* request duration;
* catalog latency;
* active transfers;
* transferred bytes;
* acquisition delivery failures;
* integrity failures;
* authentication failures;
* storage failures.

---

# 45. Tracing

## Decision TD-020

Distributed tracing is deferred.

The first module shall use:

* request identifiers;
* operation identifiers;
* structured logs;
* metrics.

OpenTelemetry may be added later only when cross-process tracing provides measured value.

---

# 46. Server Authentication Model

## Decision TD-021

The initial authentication model shall use device pairing and server-issued opaque bearer credentials.

The flow is:

```text
Administrator creates short-lived pairing code
        ↓
Client connects to trusted server
        ↓
Client submits pairing code and device identity
        ↓
Server registers device
        ↓
Server issues high-entropy opaque credential
        ↓
Client stores credential in Keychain
        ↓
Server stores only credential hash
```

---

# 47. Authentication Rationale

Opaque device credentials are selected instead of public user accounts because the first deployment is:

* private;
* local-network based;
* single-user or trusted-household oriented;
* device-centric;
* not dependent on an external identity provider.

---

# 48. Credential Requirements

Credentials shall be:

* cryptographically random;
* high entropy;
* revocable;
* independently issued per device;
* hashed at rest on the server;
* transmitted only over the approved secure transport;
* stored only in Keychain on Apple clients.

---

# 49. Token Format

The credential shall be an opaque token.

JWT is not selected initially because the server owns the complete authorization state and immediate revocation is required.

The server may issue short-lived session tokens derived from the opaque credential if later measurement justifies it.

---

# 50. Authorization

## Decision TD-022

Server authorization shall use role-based access control with:

```text
Reader
Administrator
```

Role checks shall be implemented through NestJS guards and application-level authorization policies.

Role assignment remains server authoritative.

---

# 51. Administrative Authentication

Administrator access shall use a separate credential or role assignment.

Reader authentication alone shall never imply Administrator capability.

The initial administrative workflow may use:

* local server CLI to create the first administrator;
* protected pairing;
* explicit role assignment.

---

# 52. Transport Security

## Decision TD-023

Production LAN communication shall use:

```text
HTTPS
```

Development-only local profiles may use HTTP.

The server shall generate or receive a persistent TLS identity.

---

# 53. Server Trust Model

The client shall pin a stable server identity during registration.

The initial trust evidence shall combine:

* TLS certificate or public-key fingerprint;
* stable KnowledgeOS ServerId;
* user-confirmed pairing information.

A changed fingerprint or ServerId shall trigger identity mismatch.

---

# 54. Local Certificate Strategy

The initial production strategy shall support a self-managed server certificate.

The server may:

1. generate a self-signed certificate during initialization;
2. or use an administrator-provided certificate.

The certificate and private key shall reside outside the disposable container.

---

# 55. Certificate Rotation

Certificate rotation shall be an explicit administrative operation.

The client shall not silently trust a changed certificate.

A governed re-trust flow shall preserve server identity and explain the change.

---

# 56. Rejected Authentication Alternatives

## OAuth

Not selected for the first private LAN module because it would require unnecessary identity-provider infrastructure.

## Username and Password Accounts

Not selected initially because the primary trust unit is the device, not a public multi-user account.

## IP-Based Trust

Rejected because IP addresses are mutable and insufficient as authentication.

## Unauthenticated LAN Access

Rejected because a local network is not a sufficient security boundary.

---

# 57. Publication Streaming

## Decision TD-024

Publication content shall use native HTTP response streaming.

The server shall set:

* `Content-Type`;
* `Content-Length`;
* source-version header;
* checksum metadata;
* cache policy;
* content-disposition policy where appropriate.

The client shall stream bytes directly into a staging file.

---

# 58. Range Requests

## Decision TD-025

The server shall support single byte-range requests for publication content.

Initial support is limited to:

```text
Range: bytes=<start>-<end?>
```

Multiple ranges in one request are not required.

---

# 59. Range Rationale

Single-range support enables:

* resumable acquisition;
* recovery from interrupted transfers;
* efficient continuation;
* conventional URLSession behavior.

Full-file checksum validation remains mandatory after resumed transfer.

---

# 60. Resume Policy

## Decision TD-026

The client shall support resumable acquisition when all conditions are true:

* the staging file exists;
* persisted checkpoint is valid;
* server supports Range;
* server identity is unchanged;
* MasterLibraryId is unchanged;
* PublicationId is unchanged;
* SourceVersion is unchanged;
* expected byte length is unchanged;
* expected checksum is unchanged.

Otherwise, acquisition restarts from byte zero.

---

# 61. Range Safety

The server shall reject:

* invalid units;
* negative ranges;
* ranges beyond file length;
* multiple unsupported ranges;
* range requests for nonexistent SourceVersion;
* arbitrary path-derived ranges.

---

# 62. Catalog Pagination

## Decision TD-027

The initial catalog API shall use cursor-based pagination.

The cursor shall be opaque to clients.

The stable ordering shall use:

```text
normalized title
PublicationId tie breaker
```

---

# 63. Cursor Requirements

The cursor shall encode or reference:

* ordering position;
* sort mode;
* filters;
* catalog-revision context where required.

Clients shall not construct cursors manually.

---

# 64. Catalog Search

## Decision TD-028

Initial search shall use SQLite metadata search.

The first version shall support normalized matching for:

* title;
* subtitle;
* author;
* subject;
* publisher.

SQLite FTS5 may be used for catalog metadata if supported by the selected SQLite build and proven through tests.

Publication-content search remains out of scope.

---

# 65. Catalog Cache Policy

The macOS client may cache complete catalog metadata for offline browsing.

This cache is:

* derived;
* replaceable;
* scoped to ServerId and MasterLibraryId;
* marked by CatalogRevision and retrieval time.

Publication payloads are never automatically mirrored with the catalog cache.

---

# 66. macOS Language

## Decision TD-029

The macOS client shall use:

```text
Swift 6 language mode
```

The client shall adopt strict concurrency incrementally and resolve concurrency warnings as implementation defects rather than suppressing them globally.

---

# 67. macOS UI Framework

## Decision TD-030

The client UI shall use:

```text
SwiftUI
```

AppKit interoperability may be used for:

* file panels;
* Quick Look;
* PDFKit integration;
* macOS-specific window behavior;
* functionality not adequately covered by SwiftUI.

---

# 68. Client Concurrency

## Decision TD-031

The client shall use:

```text
Swift Concurrency
```

Approved primitives include:

* `async/await`;
* `Task`;
* actors;
* `MainActor`;
* structured cancellation.

Detached tasks shall be used only with explicit justification.

---

# 69. Client Networking

## Decision TD-032

The client shall use:

```text
URLSession
```

URLSession shall provide:

* HTTPS;
* authentication headers;
* streaming or download tasks;
* Range requests;
* cancellation;
* progress;
* background-compatible transfer where appropriate;
* certificate challenge handling.

---

# 70. URLSession Transfer Mode

Initial publication acquisition shall use a download-task or streamed-file approach that writes to disk rather than returning the complete payload as `Data`.

The exact API shall be proven through the acquisition spike.

---

# 71. Client Persistence

## Decision TD-033

The macOS client shall use:

```text
GRDB
+
SQLite
```

GRDB is selected for explicit control over:

* schema;
* migrations;
* transactions;
* WAL;
* queries;
* restart recovery;
* test databases;
* filesystem/database workflow coordination.

---

# 72. Why GRDB Instead of SwiftData

SwiftData is available on macOS 14 and later.

It is not selected for this module because the acquisition subsystem requires unusually explicit control over:

* transaction timing;
* migration behavior;
* operation-state recovery;
* deterministic queries;
* cross-resource filesystem coordination;
* inspection during integration tests.

This decision does not reject SwiftData for unrelated future UI-oriented state.

---

# 73. Why GRDB Instead of Core Data

Core Data is mature but introduces an object-graph abstraction that is not required for this relational, workflow-heavy client state.

GRDB provides a more direct SQLite model and aligns server/client persistence concepts without sharing database files or schema.

---

# 74. Client SQLite Configuration

The client database shall use:

```text
WAL
foreign-key enforcement
explicit migrations
bounded busy timeout
```

The database remains device-local.

It shall not be stored in iCloud Drive.

---

# 75. Secure Client Storage

## Decision TD-034

Client credentials and sensitive trust material shall use:

```text
Apple Keychain
```

The ordinary client database may store only a Keychain reference or credential identifier.

No plain-text fallback is permitted.

---

# 76. Client Cryptography

## Decision TD-035

The macOS client shall use:

```text
CryptoKit
```

CryptoKit shall support:

* SHA-256 validation;
* fingerprint calculation;
* secure comparison;
* future device-key operations where required.

---

# 77. Local Publication Storage

## Decision TD-036

Local publication payloads shall reside under the application's:

```text
Application Support directory
```

They shall not be stored in:

* temporary directories;
* user Downloads by default;
* iCloud Drive;
* the app bundle;
* the client SQLite database.

---

# 78. Local Storage Layout

The baseline logical layout is:

```text
Application Support/
└── KnowledgeOS/
    ├── database/
    ├── library/
    │   └── <server-id>/
    │       └── <master-library-id>/
    │           └── <publication-id>/
    │               └── <source-version>/
    │                   └── source.pdf
    ├── staging/
    ├── quarantine/
    └── diagnostics/
```

The physical root shall be obtained from Apple platform APIs.

---

# 79. Local Commit Strategy

Validated downloads shall be moved atomically from staging into the final local Library location when possible.

The local database record shall become `AVAILABLE_LOCAL` only after final-file commit.

Recovery markers shall cover interruption between file and database commits.

---

# 80. Local PDF Opening

## Decision TD-037

The Master Library Module shall use:

```text
Quick Look or PDFKit
```

for the minimal local-opening proof.

This capability only confirms:

* local payload availability;
* readable local PDF;
* offline access.

It does not define the final KnowledgeOS Render Engine.

---

# 81. Client State Observation

## Decision TD-038

SwiftUI presentation state shall use:

* `@Observable` where appropriate;
* `@State`;
* environment-injected feature dependencies;
* actor-isolated mutable service state.

One global mutable application store shall be avoided.

---

# 82. Server Discovery

## Decision TD-039

The first production vertical shall support:

```text
manual server registration
```

Bonjour discovery may be added after the manual connection flow is complete.

The product shall never depend exclusively on automatic discovery.

---

# 83. Reference Client Scope

## Decision TD-040

Master Library completion requires:

```text
macOS client
```

iPhone and iPad client implementation is deferred.

Shared client libraries shall avoid unnecessary macOS-only coupling.

---

# 84. Minimum macOS Version

## Decision TD-041

The first reference client shall target:

```text
macOS 15 or later
```

This baseline shall be revisited before public release based on:

* actual user targets;
* Xcode support;
* selected Swift toolchain;
* required platform APIs.

The module shall not depend on unreleased operating-system APIs.

---

# 85. Server Packaging

## Decision TD-042

KnowledgeOS Server shall ship as:

```text
OCI-compatible container image
```

The image shall support the architecture of the reference NAS.

---

# 86. Container Base

The server image shall use a minimal maintained Linux base compatible with:

* Node.js 24 LTS;
* native SQLite driver;
* required certificates;
* non-root execution;
* health checks.

An Alpine base shall not be selected automatically because native-module compatibility must be validated.

A Debian-slim style base is the initial preference.

---

# 87. Container User

The server shall run as a non-root user.

The container shall receive only required access to:

* Master Library volume;
* certificate volume;
* configuration;
* diagnostics.

---

# 88. Persistent Volumes

At minimum:

```text
Master Library volume
TLS identity / secrets volume
optional diagnostics volume
```

Deleting the container shall not delete persistent Library data.

---

# 89. Container Health Check

The container shall use the server health endpoint.

A process being alive shall not alone indicate readiness.

The health check shall distinguish:

* liveness;
* readiness;
* degraded Library availability.

---

# 90. Reference NAS Decision

## Decision TD-043

The exact reference NAS remains a required implementation input.

Before production code passes Increment 0, the following shall be recorded:

```text
NAS manufacturer
NAS model
CPU architecture
Operating system
Container runtime
Available memory
Storage filesystem
Network interface
Persistent volume path
```

Until recorded, NAS-specific packaging remains provisionally approved but not validated.

---

# 91. NAS Architecture Support

The first module shall support exactly the reference NAS architecture.

Additional architectures require:

* container build;
* native dependency build;
* integration test;
* streaming test;
* persistence test.

---

# 92. Server Configuration

## Decision TD-044

Server configuration shall use:

```text
environment variables
+
optional mounted configuration file
+
mounted secrets
```

Configuration precedence shall be documented.

---

# 93. Configuration Validation

All configuration shall be validated at startup using Zod.

Invalid required configuration prevents readiness.

No silent fallback shall select a different Master Library root or network port.

---

# 94. Database Migrations

## Decision TD-045

Drizzle migrations shall be:

* generated from reviewed schema changes;
* checked into source control;
* executed through an explicit migration command;
* optionally executed during controlled startup;
* tested against representative prior schemas.

Production startup shall not perform destructive migrations silently.

---

# 95. Server Testing Framework

## Decision TD-046

Server unit and integration tests shall use:

```text
Vitest
```

NestJS testing utilities may construct modules for integration tests.

---

# 96. HTTP API Testing

## Decision TD-047

Server HTTP integration tests shall use:

```text
Supertest
```

Tests shall verify:

* status;
* headers;
* contract body;
* authentication;
* authorization;
* streaming;
* Range behavior;
* error envelope.

---

# 97. Test Database Policy

Server tests shall use real SQLite databases in temporary directories.

Domain tests may use in-memory repositories.

Persistence integration tests shall not substitute SQLite with an unrelated in-memory database.

---

# 98. Filesystem Test Policy

Storage integration tests shall use real temporary filesystems.

Required scenarios include:

* staging;
* commit;
* rename;
* missing file;
* permission denial where practical;
* orphan source;
* stale staging;
* checksum mismatch.

---

# 99. Container Integration Testing

Container tests shall verify:

* image build;
* non-root startup;
* persistent-volume mapping;
* migration;
* health;
* restart;
* source registration;
* content streaming.

---

# 100. Client Testing

## Decision TD-048

Client tests shall use:

```text
Swift Testing
+
XCTest where framework integration requires it
+
XCUITest for user flows
```

---

# 101. Client Integration Tests

Client integration tests shall use:

* temporary GRDB databases;
* temporary Application Support substitutes;
* real CryptoKit checksum calculations;
* local HTTPS test server;
* representative PDFs;
* controlled interruption;
* Keychain adapter abstraction.

---

# 102. End-to-End Test Harness

## Decision TD-049

The repository shall contain an E2E harness capable of:

1. starting a real server;
2. creating a temporary Master Library;
3. registering seed publications;
4. starting or targeting the macOS client test build;
5. executing acquisition;
6. disconnecting or stopping the server;
7. verifying offline local availability.

---

# 103. Contract Tests

The OpenAPI document shall be validated in CI.

Tests shall ensure:

* server responses conform to schemas;
* generated Swift models compile;
* required error codes remain registered;
* endpoint changes are intentional.

---

# 104. Continuous Integration

## Decision TD-050

CI shall initially use:

```text
GitHub Actions
```

Required jobs:

```text
TypeScript formatting
TypeScript linting
TypeScript type checking
Server unit tests
Server integration tests
OpenAPI validation
Server build
Container build
Swift formatting/linting
Swift tests
macOS client build
Contract-generation verification
```

macOS jobs require a macOS runner.

---

# 105. TypeScript Formatting and Linting

## Decision TD-051

The TypeScript workspace shall use:

```text
ESLint
Prettier
```

Rules shall preserve strictness at Domain and public boundaries.

Blanket disabling of type-safety rules is prohibited.

---

# 106. Swift Formatting and Linting

## Decision TD-052

The Swift project shall use:

```text
SwiftFormat
SwiftLint
```

The selected rule set shall be checked into source control.

Generated API code may use bounded exclusions.

---

# 107. Build Reproducibility

The project shall pin:

* Node major and minimum version;
* pnpm version;
* package lockfile;
* Swift tools version where applicable;
* Xcode requirement;
* container base digest before production release;
* migration versions;
* OpenAPI generator version.

---

# 108. Dependency Update Policy

Dependencies shall use controlled update groups:

```text
security patches
compatible patch updates
compatible minor updates
major updates
```

Major updates require review and test evidence.

Automatic merge of runtime dependency updates is prohibited initially.

---

# 109. Backup Technology

## Decision TD-053

The Master Library backup design shall use filesystem-level backup coordinated with SQLite checkpointing.

The backup workflow shall:

1. place mutable administration into a safe mode where required;
2. checkpoint SQLite WAL;
3. create a consistent database backup;
4. copy manifest;
5. copy source publications and metadata;
6. record backup manifest and checksums.

---

# 110. Backup Tooling

The implementation may use:

* SQLite backup API;
* controlled database copy after checkpoint;
* NAS snapshot capability;
* restic or equivalent external backup tool.

The canonical backup format shall not depend solely on one NAS-vendor snapshot feature.

---

# 111. Restore Policy

Restore shall recreate:

* MasterLibraryId;
* catalog records;
* PublicationId values;
* SourceVersion values;
* source payloads;
* integrity metadata.

Restore shall not generate new logical identities for existing restored publications.

---

# 112. Feature Flags

## Decision TD-054

Feature flags shall be limited to incomplete vertical increments and test behavior.

Flags shall have:

* owner;
* purpose;
* default;
* removal condition.

No critical security or integrity behavior may be disabled through an ordinary production flag.

---

# 113. Initial Feature Flags

Potential temporary flags:

```text
rangeDownloadsEnabled
automaticResumeEnabled
bonjourDiscoveryEnabled
fullIntegrityValidationEnabled
```

Before module completion, the final production value of each flag shall be frozen or the flag removed.

---

# 114. Decision: No Redis

Redis shall not be introduced in the Master Library Module.

The module does not require:

* distributed cache;
* distributed locks;
* cross-process queue;
* session cluster.

In-process bounded queues and SQLite persistence are sufficient initially.

---

# 115. Decision: No Message Broker

RabbitMQ, Kafka, NATS and equivalent brokers shall not be introduced.

Background jobs shall execute within the single server runtime with durable operation records where needed.

This decision shall be revisited only if the server becomes multi-process or distributed.

---

# 116. Decision: No Kubernetes

Kubernetes shall not be used for the first NAS deployment.

A single OCI container with persistent volumes is sufficient.

---

# 117. Decision: No Public Cloud Dependency

The Master Library Module shall operate without:

* cloud database;
* cloud object storage;
* SaaS authentication;
* external telemetry service;
* external metadata API.

Internet access is not required for normal catalog browsing or publication acquisition on the LAN.

---

# 118. Decision: No Electron Client

The macOS client shall not use Electron.

A native SwiftUI client is required to support:

* future iPhone and iPad reuse;
* native filesystem behavior;
* Keychain;
* future CloudKit;
* platform lifecycle;
* future Apple Pencil capabilities;
* native accessibility;
* efficient large-file behavior.

---

# 119. Decision: No Web Client in Module 1

A web client is deferred.

The server API shall remain usable by a future web client, but no web UI shall be created during Master Library implementation.

---

# 120. Decision: No Personal-State Schema

The server database and API shall contain no schema for:

* annotations;
* progress;
* favorites;
* personal tags;
* personal relationships;
* personal notes;
* CloudKit state.

This prohibition shall be verified by contract and persistence tests.

---

# 121. Decision Validation Spikes

Before Increment 0 is completed, execute these spikes:

## Spike 1 — NAS Container

Validate:

* Node.js 24 image;
* NestJS startup;
* native SQLite driver;
* persistent volume;
* non-root permissions;
* health endpoint.

## Spike 2 — SQLite on NAS

Validate:

* WAL;
* restart;
* transaction durability;
* locking;
* backup checkpoint;
* corruption behavior under forced termination.

## Spike 3 — Large PDF Streaming

Validate:

* server memory;
* client memory;
* time to first byte;
* sustained throughput;
* interruption;
* Range resume;
* final SHA-256.

## Spike 4 — Local Atomic Installation

Validate:

* staging;
* final rename;
* database commit;
* interruption between commits;
* recovery marker.

## Spike 5 — TLS and Pairing

Validate:

* persistent server identity;
* self-signed certificate;
* fingerprint display;
* pairing code;
* opaque credential;
* Keychain storage;
* mismatch detection.

## Spike 6 — OpenAPI Swift Generation

Validate:

* generated Swift models;
* URLSession integration;
* nullable and optional fields;
* error envelope;
* version compatibility;
* generated-code isolation.

---

# 122. Decision Review Triggers

Technology decisions shall be reopened only when evidence shows:

* target NAS incompatibility;
* unacceptable reliability;
* unacceptable memory use;
* unacceptable operational complexity;
* security weakness;
* missing required capability;
* dependency abandonment;
* architecture conflict.

Preference alone is insufficient to reopen a frozen decision.

---

# 123. Version Policy

Exact versions shall be pinned when repository creation begins.

The policy is:

```text
Node.js              24 LTS
NestJS               11.x
TypeScript           current compatible stable
Fastify              current Nest-compatible stable
SQLite               runtime-provided stable
Drizzle              current reviewed stable
Swift                Xcode-supported Swift 6
GRDB                 current reviewed stable
OpenAPI tooling      pinned exact version
```

Patch numbers shall not be hard-coded permanently into this architectural document.

They belong in repository manifests and lockfiles.

---

# 124. Licensing Policy

All selected production dependencies shall be reviewed for licenses compatible with KnowledgeOS distribution.

The dependency inventory shall record:

* package;
* version;
* license;
* source;
* runtime or development classification.

Dependencies with unclear or restrictive licensing shall not enter the production stack without review.

---

# 125. Security Policy

Before production completion:

* runtime dependencies shall have no unresolved known critical vulnerability;
* container base shall be scanned;
* secrets shall remain outside images;
* TLS private keys shall remain outside source control;
* opaque credentials shall be hashed on the server;
* Keychain shall store client credentials;
* path traversal tests shall pass;
* Range validation tests shall pass.

---

# 126. Performance Policy

The stack is accepted only if measured behavior proves:

* bounded server memory during large transfer;
* bounded client memory during large transfer;
* usable catalog latency;
* reliable SQLite behavior;
* acceptable checksum duration;
* acceptable local installation time.

No technology is accepted solely from synthetic claims.

---

# 127. Technology Decision Completion Gate

The Technology Decisions are complete when:

```text
[ ] Repository model selected
[ ] Package manager selected
[ ] Task runner selected
[ ] Server runtime selected
[ ] Server language selected
[ ] Server framework selected
[ ] HTTP adapter selected
[ ] API style selected
[ ] Contract source selected
[ ] Runtime validation selected
[ ] Server database selected
[ ] ORM selected
[ ] Database driver selected
[ ] File storage selected
[ ] Checksum selected
[ ] Logging selected
[ ] Authentication selected
[ ] Authorization selected
[ ] TLS direction selected
[ ] Server trust selected
[ ] Range support selected
[ ] Resume policy selected
[ ] Pagination selected
[ ] macOS language selected
[ ] macOS UI selected
[ ] Client networking selected
[ ] Client persistence selected
[ ] Secure storage selected
[ ] Local file storage selected
[ ] PDF opening selected
[ ] Server packaging selected
[ ] Testing selected
[ ] CI selected
[ ] Backup direction selected
[ ] Validation spikes defined
```

---

# 128. Remaining Required Input

One implementation input remains unresolved:

```text
Reference NAS hardware and operating environment
```

This does not invalidate the logical stack decision.

It blocks final validation of:

* container architecture;
* native SQLite driver;
* volume semantics;
* WAL behavior;
* non-root permissions;
* performance targets.

---

# 129. Technology Invariants

The following invariants apply:

* Node.js uses an active LTS release.
* Server code uses strict TypeScript.
* NestJS remains outside Domain packages.
* SQLite has one owning server runtime.
* Clients never open the server SQLite database.
* Publication payloads remain filesystem-backed.
* Large payloads use streaming.
* OpenAPI remains the transport-contract source.
* Authentication is device-based and revocable.
* Production communication uses HTTPS.
* Server identity is pinned and verified.
* macOS is native SwiftUI.
* Client persistence is device-local SQLite through GRDB.
* Credentials remain in Keychain.
* Local payloads remain under Application Support.
* Personal state remains absent from NAS contracts and schema.
* OCI deployment remains single-service and operationally simple.

---

# 130. Prohibited Technology Drift

Implementation shall not silently introduce:

* a second package manager;
* Express alongside Fastify;
* PostgreSQL without an IDR;
* Redis;
* message broker;
* Kubernetes;
* public SaaS authentication;
* Electron;
* a web client;
* source-file database BLOB storage;
* SwiftData as a second competing client persistence authority;
* unencrypted production LAN transport;
* IP-address-only trust;
* personal-state server tables;
* unpinned contract generators;
* direct client NAS access.

---

# 131. Related Documents

## Technical Design

* `README.md`
* `SystemDesign.md`
* `ServerDesign.md`
* `ClientDesign.md`
* `DataFlow.md`
* `ErrorModel.md`

## Requirements

* `../01-Requirements/Scope.md`
* `../01-Requirements/UseCases.md`
* `../01-Requirements/AcceptanceCriteria.md`

## Next Detailed Areas

* `../03-Domain/README.md`
* `../04-Contracts/README.md`
* `../05-Persistence/README.md`
* `../06-Server/README.md`
* `../07-Client/README.md`
* `../08-Testing/README.md`
* `../09-Operations/README.md`

---

# 132. Status

**Approved**

The Master Library implementation stack is selected.

The approved primary technologies are:

```text
Node.js 24 LTS
TypeScript
NestJS 11
Fastify
REST
OpenAPI 3.1
Zod
SQLite
Drizzle ORM
better-sqlite3
Pino
OCI containers

Swift 6
SwiftUI
Swift Concurrency
URLSession
GRDB
Keychain
CryptoKit
Application Support storage
Quick Look or PDFKit
```

The Technical Design area is now complete at the decision level.

Implementation remains in `DESIGNING` until the Domain, Contracts, Persistence, Testing, Operations and module-specific Definition of Done areas are completed.
