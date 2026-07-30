# AGENTS.md

**Project:** KnowledgeOS
**Area:** Integration
**Path:** `00-Architecture/05-Integration/`
**Document:** Integration Agent Guide
**Version:** 1.0
**Status:** Approved
**Owner:** KnowledgeOS Architecture Team

---

# 1. Purpose

This document defines the mandatory operational rules for every human or AI agent working inside:

```text
00-Architecture/05-Integration/
```

Its purpose is to preserve the boundaries between KnowledgeOS and:

* external systems;
* storage systems;
* providers;
* plugins;
* remote services;
* public consumers;
* synchronization transports;
* import and export ecosystems.

Integration translates between external variability and stable internal contracts.

It shall protect the Domain, Kernel and Platform from:

* provider-specific semantics;
* infrastructure-specific details;
* transport-specific behavior;
* vendor lock-in;
* unstable external contracts;
* untrusted external input.

This document refines:

* the root `AGENTS.md`;
* `00-Architecture/AGENTS.md`;
* `00-Architecture/02-Domain/AGENTS.md`;
* `00-Architecture/03-Kernel/AGENTS.md`;
* `00-Architecture/04-Platform/AGENTS.md`.

It shall not replace the normative Integration documentation.

---

# 2. Scope

These instructions apply to Integration areas such as:

```text
05-Integration/
├── DataExchange/
├── ExternalServices/
├── PluginSDK/
├── Providers/
├── PublicAPI/
├── PublicContracts/
├── Storage/
├── Synchronization/
└── README.md
```

They govern work involving:

* canonical data exchange;
* import protocols;
* export protocols;
* serialization;
* external service integration;
* remote execution;
* OAuth;
* MCP;
* webhooks;
* plugin contracts;
* plugin capabilities;
* provider abstractions;
* provider compatibility;
* public APIs;
* public contracts;
* storage abstractions;
* synchronization transports;
* integration security;
* integration privacy;
* compatibility;
* versioning;
* failure isolation.

---

# 3. Integration Authority

Integration is the architectural authority for system boundaries between KnowledgeOS and external or replaceable implementations.

Integration defines:

* boundary contracts;
* external adaptation;
* provider interfaces;
* transport-independent behavior;
* compatibility expectations;
* validation rules;
* failure translation;
* security boundaries;
* privacy boundaries;
* public exposure;
* storage abstraction;
* synchronization transport abstraction.

Integration shall not redefine:

* Product Vision;
* Domain semantics;
* Kernel mechanisms;
* Engine responsibilities;
* execution guarantees;
* concrete implementation technology;
* deployment-specific configuration.

---

# 4. Mandatory Reading Order

Before modifying Integration documentation, read:

1. root `AGENTS.md`;
2. `00-Architecture/AGENTS.md`;
3. `00-Architecture/02-Domain/AGENTS.md`;
4. `00-Architecture/03-Kernel/AGENTS.md`;
5. `00-Architecture/04-Platform/AGENTS.md`;
6. `00-Architecture/01-Foundation/ArchitecturePrinciples.md`;
7. `00-Architecture/01-Foundation/ArchitectureConstraints.md`;
8. `00-Architecture/01-Foundation/QualityAttributes.md`;
9. `00-Architecture/05-Integration/README.md`;
10. the target Integration document;
11. related Platform Engine documents;
12. related Execution documents;
13. related ADRs;
14. affected implementation documents.

For storage or synchronization changes, also read:

```text
ADR-003-Offline-First.md
ADR-004-Library-Source-of-Truth.md
ADR-008-Storage-Architecture.md
ADR-009-Synchronization-Strategy.md
ADR-010-Document-Identity.md
ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md
```

For public contracts, API or plugin changes, also read:

```text
ADR-007-Plugin-Architecture.md
ADR-011-Event-Architecture.md
ADR-012-Public-Contracts.md
```

---

# 5. Integration Invariants

Every Integration change shall preserve the following invariants.

## 5.1 Internal semantic protection

External concepts shall not redefine internal Domain meaning.

## 5.2 Provider replaceability

Providers shall remain interchangeable behind approved contracts.

## 5.3 Contract stability

Boundary contracts shall be explicit, versioned and testable.

## 5.4 Input distrust

All external input shall be treated as untrusted.

## 5.5 Failure isolation

External failures shall not silently corrupt internal state.

## 5.6 Vendor independence

Integration shall avoid unnecessary dependency on one vendor or protocol.

## 5.7 Canonical translation

External representations shall be translated into canonical internal models.

## 5.8 Identity preservation

Integration shall preserve stable identity across boundaries where required.

## 5.9 Provenance preservation

Imported, synchronized, generated and externally retrieved data shall retain provenance.

## 5.10 Offline-first compatibility

External integrations shall not make core local workflows depend on continuous network access.

## 5.11 Explicit data disclosure

Data sent outside KnowledgeOS shall be governed by explicit contracts and privacy rules.

## 5.12 Compatibility visibility

Breaking changes shall never be introduced silently.

---

# 6. Integration Boundary Model

Every integration shall define two sides:

```text
External system or provider
            ↓
Integration adapter or contract
            ↓
Canonical KnowledgeOS contract
            ↓
Platform Engine
            ↓
Domain model
```

External representations shall not pass directly into the Domain.

Platform Engines shall not directly depend on vendor-specific SDKs.

Implementation adapters shall conform to Integration contracts.

---

# 7. Prohibited Integration Patterns

Agents shall not introduce:

* provider-specific fields into Domain models;
* direct provider SDK dependencies inside Platform Engines;
* database schemas as public contracts;
* internal implementation types in public APIs;
* external payloads stored without validation;
* transport status codes as Domain errors;
* undocumented public endpoints;
* unversioned breaking contracts;
* unrestricted plugin capabilities;
* direct external access to Engine internals;
* hidden outbound network requests;
* silent synchronization conflict resolution;
* storage paths as canonical identities;
* vendor-specific authentication semantics in Domain or Platform;
* duplicated contracts for the same boundary.

---

# 8. Integration README

`05-Integration/README.md` is the authoritative rector document for Integration.

It shall define:

* Integration purpose;
* boundary model;
* Integration areas;
* dependency direction;
* contract model;
* provider model;
* public exposure;
* storage abstraction;
* synchronization abstraction;
* security;
* privacy;
* compatibility;
* failure handling;
* observability;
* testing;
* implementation mapping.

Changes to global Integration rules require review of this document.

---

# 9. Data Exchange

Data Exchange defines how knowledge moves into and out of KnowledgeOS through canonical exchange structures and protocols.

It shall support:

* import;
* export;
* interoperability;
* migration;
* backup;
* restoration;
* archival;
* external tool integration.

Data Exchange shall preserve internal semantics without forcing external consumers to depend on internal implementation details.

---

# 10. Canonical Exchange

`DataExchange/CanonicalExchange.md` shall define the canonical exchange representation.

It shall specify:

* exchange package identity;
* schema version;
* Knowledge Object representation;
* UDM representation;
* DPM representation;
* asset representation;
* metadata;
* provenance;
* relationships;
* annotations;
* lifecycle information where relevant;
* checksums;
* references;
* extension points;
* validation.

The canonical exchange format shall not be tied to one storage backend.

---

# 11. Canonical Exchange Invariants

Canonical exchange shall preserve:

* object identity;
* version identity;
* structural meaning;
* semantic meaning;
* presentation information where included;
* asset identity;
* relationship identity;
* provenance;
* source information;
* extension ownership;
* compatibility metadata.

A canonical exchange shall not silently flatten complex structures into lossy representations.

---

# 12. Import Protocols

Import protocols define how external sources are converted into KnowledgeOS-compatible input.

Each import protocol shall define:

* source type;
* source identification;
* accepted formats;
* validation;
* acquisition;
* integrity checks;
* identity strategy;
* provenance;
* unsupported features;
* loss behavior;
* error behavior;
* retry behavior;
* security;
* privacy.

Import protocols shall not directly define UDM implementation code.

They define the architectural translation contract.

---

# 13. Export Protocols

Export protocols define how KnowledgeOS models are transformed into external representations.

Each export protocol shall define:

* target format;
* supported content;
* unsupported content;
* identity preservation;
* asset handling;
* annotation handling;
* metadata handling;
* provenance handling;
* presentation handling;
* loss reporting;
* deterministic output where required;
* validation;
* compatibility.

Export shall not claim losslessness unless the target format can preserve all required semantics.

---

# 14. Data Exchange Serialization

`DataExchange/Serialization.md` shall define serialization behavior for exchange artifacts.

It shall specify:

* encoding;
* schema versioning;
* references;
* cycles;
* ordering;
* required fields;
* optional fields;
* unknown fields;
* extensions;
* binary assets;
* integrity;
* compression where relevant;
* encryption where relevant;
* validation;
* migration.

Serialization shall not become a substitute for the underlying Domain definitions.

---

# 15. Exchange Package Integrity

Exchange packages shall support integrity validation where required.

Integrity may include:

* manifest validation;
* checksums;
* asset checksums;
* schema validation;
* reference validation;
* signature validation where supported;
* size validation;
* duplicate detection.

Invalid packages shall not be partially imported without explicit partial-import semantics.

---

# 16. Data Exchange Compatibility

Compatibility shall define:

* supported schema versions;
* backward compatibility;
* forward compatibility;
* unknown-field behavior;
* unsupported-type behavior;
* migration requirements;
* deprecation policy.

Consumers shall not be required to understand private internal fields.

---

# 17. External Services

External Services defines integration with remote systems that provide capabilities or receive events.

Examples may include:

* AI services;
* OCR services;
* identity providers;
* remote execution services;
* external automation systems;
* external knowledge services;
* webhook consumers;
* MCP clients or servers.

Each external service integration shall remain behind an explicit contract.

---

# 18. External Service Contract

Every external service integration shall define:

* service purpose;
* trust boundary;
* authentication;
* authorization;
* request contract;
* response contract;
* timeout;
* retry;
* rate limits;
* availability assumptions;
* failure translation;
* privacy;
* data retention;
* observability;
* provider replacement;
* offline behavior.

External availability shall not be assumed.

---

# 19. Remote Execution

`ExternalServices/RemoteExecution.md` shall define architecture for operations executed outside the local KnowledgeOS environment.

Remote execution shall define:

* permitted operation types;
* submitted data;
* execution identity;
* provider;
* authentication;
* authorization;
* timeout;
* cancellation;
* result retrieval;
* result validation;
* provenance;
* retry;
* idempotency;
* privacy;
* failure behavior.

Remote execution shall not receive unrestricted access to the Master Library.

---

# 20. Remote Execution Security

Remote execution requests shall follow least privilege.

They shall include only the data required for the operation.

Remote systems shall not receive:

* unrelated Knowledge Objects;
* unrestricted library credentials;
* direct NAS access;
* internal service credentials;
* plugin secrets;
* unnecessary personal metadata.

Results shall be treated as untrusted input until validated.

---

# 21. OAuth

`ExternalServices/OAuth.md` shall define OAuth integration boundaries.

It shall distinguish:

* authorization client;
* resource owner;
* authorization server;
* resource server;
* access token;
* refresh token;
* scopes;
* consent;
* callback;
* session mapping.

OAuth documentation shall not depend on one provider unless describing an adapter.

---

# 22. OAuth Rules

OAuth integrations shall define:

* supported flows;
* redirect validation;
* state validation;
* PKCE where applicable;
* scope minimization;
* token storage;
* token rotation;
* refresh behavior;
* revocation;
* expiration;
* logout behavior;
* failure handling;
* auditability.

Tokens shall never be included in logs or committed files.

---

# 23. MCP

`ExternalServices/MCP.md` shall define KnowledgeOS integration with the Model Context Protocol where applicable.

It shall define whether KnowledgeOS acts as:

* MCP client;
* MCP server;
* both;
* neither for a specific deployment.

MCP integration shall remain an Integration concern.

It shall not redefine Domain or Platform responsibilities.

---

# 24. MCP Tool Exposure

MCP-exposed capabilities shall:

* map to explicit public contracts;
* define authorization;
* validate input;
* constrain output;
* preserve user consent;
* preserve privacy;
* remain observable;
* avoid exposing internal Engine APIs directly.

An MCP tool shall not receive unrestricted repository, library or storage access.

---

# 25. MCP Resources

MCP resources shall define:

* identity;
* content type;
* access rules;
* versioning;
* pagination where required;
* privacy;
* lifetime;
* caching;
* invalidation.

Resource identifiers shall not reveal sensitive storage paths.

---

# 26. Webhooks

`ExternalServices/Webhooks.md` shall define outbound and inbound webhook behavior.

Webhooks shall specify:

* event type;
* endpoint;
* payload schema;
* authentication;
* signature;
* delivery guarantees;
* retry;
* timeout;
* ordering;
* duplicate delivery;
* dead-letter behavior;
* observability;
* deactivation.

Webhook consumers shall be assumed unreliable.

---

# 27. Inbound Webhooks

Inbound webhooks shall:

* validate signatures;
* validate timestamps;
* prevent replay;
* validate schema;
* enforce authorization;
* enforce rate limits where required;
* map external input into canonical commands or events;
* remain idempotent where duplicate delivery is possible.

Inbound webhook payloads shall not directly mutate Domain or storage state.

---

# 28. Outbound Webhooks

Outbound webhooks shall publish only approved events.

They shall not expose:

* private internal event payloads;
* secrets;
* full Knowledge Object content without explicit permission;
* internal storage paths;
* internal database identifiers unless approved as public identities.

Payloads shall use public contract versions.

---

# 29. Plugin SDK

Plugin SDK defines how plugins extend KnowledgeOS through controlled contracts.

It shall define:

* plugin identity;
* manifest;
* capabilities;
* permissions;
* compatibility;
* lifecycle;
* public contracts;
* extension points;
* host interaction;
* isolation;
* failure containment;
* versioning.

Plugin SDK shall not expose private Engine implementation.

---

# 30. Plugin SDK Authority

Plugin SDK owns plugin-facing contracts.

Plugin Engine owns plugin lifecycle and execution coordination.

Platform Engines own the capabilities that plugins may extend.

Implementation owns sandboxing and runtime realization.

These responsibilities shall remain distinct.

---

# 31. Plugin Capabilities

`PluginSDK/Capabilities.md` shall define each available plugin capability.

Every capability shall specify:

* capability identifier;
* purpose;
* granting authority;
* allowed operations;
* denied operations;
* data scope;
* network scope;
* storage scope;
* lifecycle;
* audit requirements;
* revocation behavior.

Capabilities shall follow least privilege.

---

# 32. Plugin Permissions

Permissions shall be explicit and user-understandable.

Potential permission categories may include:

* read selected knowledge;
* modify selected knowledge;
* create annotations;
* invoke AI;
* access network;
* register import formats;
* register export formats;
* contribute UI;
* access temporary storage;
* schedule background work.

A broad permission shall not be used when a narrower one is possible.

---

# 33. Plugin Contracts

`PluginSDK/Contracts.md` shall define plugin-facing contract families.

Contracts shall:

* be versioned;
* remain stable;
* avoid internal types;
* define errors;
* define lifecycle;
* define cancellation;
* define timeout;
* define compatibility;
* define capability requirements.

Plugins shall not link directly to private Platform or Kernel interfaces.

---

# 34. Plugin Compatibility

`PluginSDK/Compatibility.md` shall define:

* host version compatibility;
* SDK version compatibility;
* contract version compatibility;
* capability availability;
* deprecation;
* migration;
* unsupported plugin behavior;
* safe disablement.

An incompatible plugin shall fail safely.

It shall not partially activate without explicit semantics.

---

# 35. Plugin Manifest

A plugin manifest shall define:

* plugin identifier;
* name;
* version;
* publisher;
* SDK version;
* required capabilities;
* optional capabilities;
* extension points;
* runtime requirements;
* entry points;
* compatibility;
* integrity metadata;
* signature where supported.

Manifest content shall be validated before plugin activation.

---

# 36. Plugin Isolation

Plugin architecture shall assume plugins may be faulty or untrusted.

Isolation shall address:

* process boundaries;
* memory access;
* storage access;
* network access;
* execution time;
* resource limits;
* capability enforcement;
* error containment;
* crash containment;
* revocation.

Plugins shall not execute with unrestricted host privileges.

---

# 37. Provider Architecture

Providers adapt interchangeable external or implementation-specific capabilities to stable KnowledgeOS contracts.

A provider may adapt:

* AI models;
* OCR systems;
* export systems;
* storage systems;
* authentication systems;
* search backends;
* remote execution systems;
* synchronization transports.

A provider is not an Engine.

---

# 38. Provider Contract

Every provider contract shall define:

* provider category;
* capability;
* input;
* output;
* errors;
* lifecycle;
* configuration;
* availability;
* cancellation;
* timeout;
* retry;
* rate limits;
* observability;
* compatibility;
* security;
* privacy.

Provider contracts shall remain independent from one vendor.

---

# 39. Provider Implementation

A provider implementation may depend on:

* vendor SDKs;
* operating-system APIs;
* external protocols;
* infrastructure libraries;
* remote services.

Such dependencies shall remain inside the implementation adapter.

They shall not leak into:

* Domain;
* Kernel;
* Platform contracts;
* public contracts.

---

# 40. Provider Selection

Provider selection shall be explicit.

Selection may consider:

* user preference;
* privacy policy;
* offline availability;
* capability;
* cost;
* quality;
* latency;
* platform support;
* configuration;
* fallback policy.

Provider selection policy belongs to the owning Platform Engine.

Provider adaptation belongs to Integration.

---

# 41. Provider Fallback

Fallback behavior shall define:

* eligible providers;
* order;
* triggering failures;
* retry interaction;
* data disclosure implications;
* user consent;
* result consistency;
* observability.

Fallback shall not send user data to a remote provider when local-only policy is active.

---

# 42. AI Providers

AI provider contracts shall define:

* model capabilities;
* local or remote execution;
* supported input types;
* supported output types;
* streaming;
* token or context limits;
* timeout;
* cancellation;
* cost metadata where relevant;
* model identity;
* model version;
* privacy;
* retention;
* availability.

Provider-specific prompt or response structures shall be translated into canonical AI contracts.

---

# 43. OCR Providers

OCR provider contracts shall define:

* accepted asset types;
* supported languages;
* layout support;
* confidence;
* region mapping;
* output structure;
* provenance;
* cancellation;
* timeout;
* privacy;
* local or remote execution.

OCR output shall be treated as derived and potentially uncertain.

---

# 44. Export Providers

Export provider contracts shall define:

* target formats;
* supported features;
* unsupported features;
* layout capabilities;
* asset handling;
* deterministic output;
* failure behavior;
* validation.

The Export Engine owns export semantics.

The provider owns concrete format generation.

---

# 45. Storage Providers

Storage provider contracts shall define:

* object operations;
* stream operations;
* metadata operations;
* integrity;
* atomicity;
* locking;
* consistency;
* transactions where supported;
* durability;
* availability;
* capacity;
* error translation;
* observability.

Storage providers shall not define library authority.

---

# 46. Public API

Public API defines externally consumable operations.

It may serve:

* desktop applications;
* mobile applications;
* web applications;
* plugins;
* automation tools;
* external clients;
* administrative tools.

Public API shall expose approved Platform capabilities through stable contracts.

---

# 47. Public API Boundaries

Public APIs shall not expose:

* internal database schemas;
* private Engine types;
* provider-specific payloads;
* internal file paths;
* internal message-bus implementation;
* private workflow state unless intentionally public;
* secret configuration;
* unrestricted plugin internals.

Public APIs shall expose canonical public representations.

---

# 48. API Versioning

Public API versioning shall define:

* version identifier;
* compatibility policy;
* deprecation policy;
* migration period;
* removal policy;
* client negotiation;
* unsupported version behavior.

Breaking changes shall require a new version or another approved compatibility strategy.

---

# 49. API Authentication

Public API documentation shall define:

* supported authentication mechanisms;
* identity mapping;
* session behavior;
* token behavior;
* expiration;
* revocation;
* failure responses.

Authentication shall remain distinct from authorization.

---

# 50. API Authorization

Authorization shall define:

* resource ownership;
* permission model;
* capability model;
* operation-level checks;
* object-level checks;
* administrative boundaries;
* plugin boundaries;
* audit requirements.

Authorization shall not be implemented only in UI clients.

---

# 51. API Request Validation

Every public request shall be validated for:

* schema;
* type;
* size;
* range;
* references;
* authorization;
* version;
* content type;
* rate limits where relevant;
* unsupported fields;
* malicious input.

Invalid external input shall not reach Domain or storage unchecked.

---

# 52. API Error Contracts

Public API errors shall be explicit and stable.

Error contracts shall define:

* error code;
* category;
* message semantics;
* retryability;
* affected field where relevant;
* correlation identifier;
* compatibility.

Internal stack traces and sensitive implementation details shall not be exposed.

---

# 53. API Pagination

Collection APIs shall define pagination where unbounded results are possible.

Pagination shall specify:

* cursor or offset model;
* ordering;
* stability;
* page size;
* maximum size;
* continuation;
* stale cursor behavior;
* filtering interaction.

Pagination shall not expose implementation-specific database offsets unless intentionally contracted.

---

# 54. API Filtering and Sorting

Filtering and sorting shall define:

* supported fields;
* operators;
* ordering;
* collation;
* null behavior;
* stable tie-breaking;
* validation;
* performance limitations.

Clients shall not be allowed to construct unrestricted storage queries.

---

# 55. API Idempotency

Public mutation APIs exposed to retries shall support idempotency where required.

Idempotency shall define:

* key location;
* key scope;
* persistence;
* expiration;
* replayed result;
* conflict behavior.

Network uncertainty shall not create duplicate user knowledge.

---

# 56. Public Contracts

Public Contracts define stable structures consumed across architectural or application boundaries.

They may include:

* commands;
* queries;
* events;
* DTOs;
* schemas;
* capabilities;
* API resources;
* plugin contracts;
* synchronization messages;
* exchange contracts.

Public contracts shall have one authoritative definition.

---

# 57. Public Contract Rules

Every public contract shall define:

* owner;
* purpose;
* version;
* consumers;
* fields;
* required fields;
* optional fields;
* extension behavior;
* validation;
* compatibility;
* errors;
* security classification;
* privacy classification.

Public contracts shall not expose private persistence or framework types.

---

# 58. Contract Ownership

A public contract shall be owned by the capability that defines its meaning.

Examples:

* Library contracts belong to Library capability;
* Sync contracts belong to Sync capability;
* AI contracts belong to AI capability;
* Plugin-facing contracts belong to Plugin SDK;
* exchange contracts belong to Data Exchange.

Contract location shall reflect ownership.

---

# 59. Contract Duplication

Agents shall not create:

* separate desktop and mobile versions of the same canonical contract;
* provider-specific copies of a Platform contract;
* plugin copies of public contracts;
* database entities presented as API contracts;
* multiple schemas with identical meaning and different names.

Where different boundary representations are necessary, mappings shall be explicit.

---

# 60. Contract Serialization

Contract serialization shall define:

* format;
* version;
* naming;
* optional values;
* unknown fields;
* numeric precision;
* timestamps;
* identifiers;
* binary data;
* references;
* validation.

Serialization behavior shall remain deterministic where required.

---

# 61. Storage

Storage Integration defines abstractions for persistence mechanisms.

It shall support the architectural storage model without owning Domain or Library semantics.

Storage concerns may include:

* authoritative files;
* relational persistence;
* local persistence;
* object storage;
* cache storage;
* metadata storage;
* transactional storage;
* backup access;
* restore access.

---

# 62. Storage Authority Separation

The following responsibilities shall remain distinct:

```text
Domain
    Defines meaning

Library Engine
    Defines library authority and behavior

Storage Integration
    Defines storage contracts

Implementation
    Defines concrete storage technology

Infrastructure
    Deploys and operates storage systems
```

Storage Integration shall not decide which library is authoritative.

That decision is architectural and already defined.

---

# 63. Master Library Storage

The Master Library resides on the NAS and is the authoritative shared library.

Its storage architecture includes:

* authoritative library files;
* authoritative metadata;
* PostgreSQL persistence;
* independent persistent volumes;
* containerized deployment;
* backup and recovery requirements.

Storage contracts shall preserve these semantics without coupling Platform Engines to deployment details.

---

# 64. Authoritative Files

Authoritative files shall preserve:

* original content;
* stable identity mapping;
* integrity;
* provenance;
* recoverability;
* versioning where required;
* backup compatibility;
* migration compatibility.

A cached or transformed copy shall not silently replace the authoritative file.

---

# 65. PostgreSQL Role

PostgreSQL may store authoritative structured library state, including:

* catalog information;
* identities;
* metadata;
* relationships;
* processing state;
* synchronization state;
* operational records.

Its exact schema belongs to implementation.

Integration shall define required storage behavior, not SQL structure.

---

# 66. Storage Transactions

Storage contracts shall define transactional guarantees where required.

They shall distinguish:

* atomic operation;
* multi-object transaction;
* optimistic concurrency;
* pessimistic locking;
* conditional update;
* partial commit;
* compensation.

A storage provider shall not claim stronger guarantees than it can deliver.

---

# 67. Storage Consistency

Storage consistency expectations shall be explicit.

Possible expectations include:

* strongly consistent;
* transactionally consistent;
* read-after-write;
* eventually consistent;
* snapshot;
* cache-consistent.

The owning operation defines the required expectation.

The provider defines whether it can satisfy it.

---

# 68. Storage Integrity

Storage shall support integrity through mechanisms such as:

* checksums;
* constraints;
* reference validation;
* atomic replacement;
* transactional updates;
* corruption detection;
* audit logs;
* backup verification.

Integrity failure shall be treated as a serious architectural event.

---

# 69. Storage Errors

Storage errors shall be translated into stable Integration errors.

Categories may include:

* unavailable;
* permission denied;
* not found;
* conflict;
* capacity exceeded;
* corruption;
* timeout;
* transaction failure;
* integrity violation;
* unsupported operation.

Vendor-specific error codes shall not leak into Platform contracts.

---

# 70. Storage Paths

Storage paths are implementation details.

They shall not be used as:

* canonical Knowledge Object identity;
* public API identity;
* stable synchronization identity;
* plugin identity.

Public references shall use stable architectural identifiers.

---

# 71. Storage Migration

Storage migration shall define:

* source version;
* target version;
* compatibility;
* preconditions;
* backups;
* validation;
* rollback;
* recovery;
* downtime;
* failure behavior;
* audit trail.

Destructive migrations require explicit approval.

---

# 72. Backup and Restore

Storage architecture shall define:

* backup scope;
* backup frequency;
* consistency point;
* encryption;
* retention;
* integrity verification;
* restore procedure;
* restore validation;
* disaster recovery.

A backup that cannot be verified or restored is not sufficient.

---

# 73. Synchronization Integration

Synchronization Integration defines transport and boundary contracts used by the Sync Engine.

It may include:

* change exchange;
* session protocols;
* transport;
* remote endpoints;
* checkpoints;
* manifests;
* conflict payloads;
* transfer integrity;
* authentication.

The Sync Engine owns synchronization semantics.

Integration owns synchronization boundaries and transport contracts.

---

# 74. Synchronization Protocol

A synchronization protocol shall define:

* participant identity;
* library identity;
* session identity;
* object identity;
* revision identity;
* change representation;
* ordering;
* checkpoints;
* transfer integrity;
* conflict representation;
* retry;
* resumption;
* cancellation;
* authentication;
* authorization;
* versioning.

---

# 75. Synchronization Participants

Participants may include:

* Master Library;
* Local Library;
* desktop client;
* mobile client;
* web client;
* personal synchronization service;
* approved future clients.

Each participant shall have an explicit role.

All participants shall not be assumed authoritative.

---

# 76. Synchronization Authority

The Master Library remains authoritative for shared library state.

Local Libraries may contain:

* synchronized authoritative copies;
* local caches;
* pending local changes;
* offline-created objects;
* personal state;
* conflict state.

Synchronization shall distinguish these categories.

---

# 77. Change Representation

Synchronization changes shall define:

* object identity;
* base revision;
* new revision;
* operation type;
* payload or delta;
* actor;
* origin;
* timestamp;
* ordering metadata;
* checksum;
* provenance.

Changes shall be replay-safe where required.

---

# 78. Synchronization Ordering

Synchronization ordering shall define its scope.

Possible scopes include:

* per object;
* per library;
* per participant;
* per synchronization session;
* no global ordering.

Ordering shall not depend solely on client wall-clock time.

---

# 79. Synchronization Checkpoints

Checkpoints shall define:

* participant;
* synchronization scope;
* last confirmed state;
* revision;
* creation time;
* validity;
* expiration;
* recovery behavior.

A checkpoint shall not advance before the corresponding state is durably accepted.

---

# 80. Synchronization Idempotency

Synchronization operations shall be idempotent where duplicate delivery is possible.

Idempotency shall address:

* repeated change upload;
* repeated change download;
* repeated acknowledgement;
* repeated conflict submission;
* repeated checkpoint update;
* resumed sessions.

Duplicate operations shall not create duplicate Knowledge Objects or assets.

---

# 81. Synchronization Conflicts

Conflict contracts shall define:

* conflict identity;
* object identity;
* competing revisions;
* origin;
* affected fields or structures;
* authority;
* resolution options;
* preserved versions;
* resolution result;
* audit information.

Conflicts shall remain visible until resolved.

---

# 82. Synchronization Transport

Transport may use:

* local network;
* secure remote network;
* HTTP;
* streaming;
* message transport;
* file transfer;
* future approved protocols.

Transport choice shall not alter synchronization semantics.

---

# 83. Synchronization Security

Synchronization shall define:

* participant authentication;
* library authorization;
* transport encryption;
* replay prevention;
* integrity validation;
* credential rotation;
* session expiration;
* device revocation;
* auditability.

A client shall not gain access to libraries it is not authorized to synchronize.

---

# 84. Synchronization Privacy

Synchronization shall transfer only data required for the authorized synchronization scope.

Personal or local-only state shall not be synchronized into the Master Library unless explicitly defined.

Private annotations, AI outputs or plugin data shall follow their own synchronization policies.

---

# 85. Integration Failure Model

Integration failures shall distinguish:

* validation failure;
* authentication failure;
* authorization failure;
* unavailable external service;
* rate limit;
* timeout;
* transport failure;
* protocol incompatibility;
* unsupported version;
* provider failure;
* data corruption;
* integrity failure;
* partial transfer;
* cancellation;
* privacy policy violation.

External failures shall be translated into stable internal categories.

---

# 86. Retry Rules

Retries shall define:

* retryable failures;
* non-retryable failures;
* maximum attempts;
* backoff;
* jitter;
* timeout;
* rate-limit handling;
* idempotency;
* duplicate prevention;
* observability;
* terminal state.

Authentication failure and schema incompatibility shall not normally be retried blindly.

---

# 87. Timeouts

Every remote or potentially blocking Integration operation shall define:

* connection timeout;
* operation timeout;
* idle timeout where relevant;
* cancellation behavior;
* retry interaction;
* uncertain completion behavior;
* error translation.

A timeout shall not be interpreted automatically as confirmed non-execution.

---

# 88. Circuit Breaking

Circuit-breaking behavior may be used for unstable external dependencies.

It shall define:

* monitored failures;
* threshold;
* open duration;
* half-open behavior;
* recovery;
* observability;
* fallback;
* privacy implications.

Circuit breaking shall not conceal permanent incompatibility.

---

# 89. Rate Limits

Rate-limit handling shall define:

* limit source;
* scope;
* reset;
* retry-after behavior;
* backoff;
* queueing;
* user impact;
* fallback;
* metrics.

Integration shall not issue uncontrolled retries against rate-limited services.

---

# 90. External Data Validation

External data shall be validated before internal use.

Validation may include:

* schema;
* size;
* type;
* encoding;
* references;
* identity;
* integrity;
* signatures;
* content safety;
* supported version;
* capability permission;
* authorization.

Successful parsing does not prove semantic validity.

---

# 91. External Data Sanitization

Sanitization shall preserve original provenance.

Sanitized data shall not silently replace the original without traceability.

Potential concerns include:

* executable content;
* embedded scripts;
* path traversal;
* malformed archives;
* decompression bombs;
* unsupported encodings;
* malicious metadata;
* invalid links;
* oversized payloads.

---

# 92. Integration Security

Every Integration area shall define its trust boundary.

Security review shall include:

* authentication;
* authorization;
* secret management;
* input validation;
* output disclosure;
* transport security;
* replay protection;
* rate limits;
* plugin permissions;
* provider trust;
* supply-chain risk;
* auditability.

No external dependency shall be trusted solely because it is configured.

---

# 93. Secret Management

Integration secrets may include:

* API keys;
* OAuth client secrets;
* access tokens;
* refresh tokens;
* webhook secrets;
* signing keys;
* storage credentials;
* synchronization credentials.

Secrets shall:

* remain outside documentation examples;
* remain outside version control;
* be redacted from logs;
* support rotation;
* use least privilege;
* have explicit ownership.

---

# 94. Integration Privacy

Every outbound integration shall define:

* data categories transmitted;
* purpose;
* destination;
* provider;
* retention;
* processing location where relevant;
* consent;
* user controls;
* deletion behavior;
* local alternative.

No data shall leave KnowledgeOS merely because an external capability exists.

---

# 95. Data Minimization

Outbound requests shall include only the minimum data required.

Integrations shall avoid transmitting:

* unrelated Knowledge Objects;
* full libraries;
* private annotations;
* sensitive metadata;
* original assets when excerpts suffice;
* stable personal identifiers when temporary identifiers suffice.

---

# 96. Integration Observability

Integration observability shall include:

* operation count;
* success;
* failure;
* timeout;
* retry;
* rate limit;
* provider availability;
* latency;
* payload size without payload content;
* transfer progress;
* compatibility errors;
* authentication errors.

Observability shall not record secrets or private user content.

---

# 97. Integration Logging

Logs should include:

* integration type;
* provider identifier;
* operation;
* correlation identifier;
* result;
* duration;
* error category;
* retry attempt;
* transferred size where safe.

Logs shall not include:

* tokens;
* secrets;
* full request bodies;
* full response bodies;
* private Knowledge Object content;
* unrestricted webhook payloads;
* plugin private data.

---

# 98. Integration Testing

Integration areas shall define appropriate tests.

These may include:

* contract tests;
* provider adapter tests;
* protocol tests;
* compatibility tests;
* serialization tests;
* malformed-input tests;
* authentication tests;
* authorization tests;
* retry tests;
* timeout tests;
* circuit-breaker tests;
* webhook signature tests;
* plugin capability tests;
* storage contract tests;
* synchronization tests;
* migration tests;
* privacy tests.

---

# 99. Provider Contract Tests

Every provider implementation shall pass the contract suite for its provider category.

Tests shall verify:

* required capabilities;
* error translation;
* timeout;
* cancellation;
* compatibility;
* configuration;
* privacy constraints;
* observability;
* fallback behavior where applicable.

A provider shall not be considered compatible based solely on successful basic requests.

---

# 100. Public Contract Tests

Public contracts shall have tests for:

* schema validation;
* serialization;
* backward compatibility;
* required fields;
* optional fields;
* unknown fields;
* invalid input;
* version negotiation;
* error contracts;
* security boundaries.

Snapshots alone shall not be the only compatibility mechanism.

---

# 101. Storage Contract Tests

Storage providers shall be tested for:

* create;
* read;
* update;
* delete where allowed;
* conditional update;
* transaction guarantees;
* concurrency;
* integrity;
* failure translation;
* capacity behavior;
* recovery;
* migration compatibility.

All storage implementations shall preserve the same architectural contract.

---

# 102. Synchronization Tests

Synchronization tests shall include:

* first synchronization;
* incremental synchronization;
* duplicate change;
* out-of-order change;
* interrupted transfer;
* resumed transfer;
* concurrent edits;
* conflict creation;
* conflict resolution;
* local offline changes;
* deleted objects;
* large assets;
* corrupted payloads;
* participant revocation;
* version incompatibility;
* Master Library recovery.

---

# 103. Compatibility Matrix

Integration components with multiple consumers or providers should define a compatibility matrix.

The matrix may include:

* contract version;
* provider version;
* host version;
* plugin SDK version;
* client version;
* synchronization protocol version;
* canonical exchange version.

Compatibility claims shall be tested.

---

# 104. Deprecation

Deprecated contracts shall define:

* replacement;
* reason;
* first deprecated version;
* support period;
* migration path;
* final removal criteria;
* affected consumers.

Deprecated contracts shall remain functional during their declared support period unless security requires earlier removal.

---

# 105. Breaking Changes

A breaking Integration change requires:

* impact analysis;
* affected consumer identification;
* contract versioning;
* migration strategy;
* compatibility documentation;
* implementation plan;
* test plan;
* deployment coordination;
* rollback plan;
* ADR review where architectural.

Breaking changes shall not be hidden as refactoring.

---

# 106. Integration and Domain Mapping

Every external-to-internal translation shall define mapping to:

* Knowledge Object;
* UDM;
* DPM;
* Identity;
* Knowledge Graph;
* provenance;
* lifecycle;
* validation.

Mappings shall specify:

* source field;
* target field;
* transformation;
* loss behavior;
* default behavior;
* error behavior;
* uncertainty;
* provenance.

---

# 107. Integration and Platform Mapping

Every Integration contract shall identify the Platform Engine that consumes or owns it.

Examples:

* AI Providers → AI Engine;
* OCR Providers → Import Engine;
* Export Providers → Export Engine;
* Storage → Library Engine and Sync Engine through approved boundaries;
* Synchronization → Sync Engine;
* Plugin SDK → Plugin Engine and approved Engine extension points;
* Public API → relevant Platform Engines.

An Integration contract without an owning capability is incomplete.

---

# 108. Integration and Kernel Mapping

Integration adapters may use Kernel mechanisms such as:

* commands;
* queries;
* events;
* jobs;
* workflows;
* configuration;
* logging;
* observability;
* scheduling.

Integration shall not redefine those mechanisms.

External events shall be translated into canonical internal commands or events.

---

# 109. Integration and Execution Mapping

Integration behavior shall remain consistent with:

* concurrency;
* transactions;
* ordering;
* retries;
* idempotency;
* timeout;
* backpressure;
* resource management;
* error handling;
* recovery;
* observability.

A protocol document shall not invent incompatible runtime guarantees.

---

# 110. ADR Impact

Integration changes may require ADR review when they alter:

* public contracts;
* event architecture;
* provider architecture;
* plugin architecture;
* storage architecture;
* synchronization strategy;
* identity behavior;
* source-of-truth behavior;
* offline-first behavior;
* external data disclosure;
* compatibility policy.

Relevant ADRs include:

```text
ADR-003-Offline-First.md
ADR-004-Library-Source-of-Truth.md
ADR-006-AI-Architecture.md
ADR-007-Plugin-Architecture.md
ADR-008-Storage-Architecture.md
ADR-009-Synchronization-Strategy.md
ADR-010-Document-Identity.md
ADR-011-Event-Architecture.md
ADR-012-Public-Contracts.md
ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md
```

---

# 111. Diagram Impact

Integration changes shall review relevant diagrams.

Potential diagram updates include:

* System Context;
* Container diagrams;
* Integration component diagrams;
* provider interaction diagrams;
* OAuth sequences;
* webhook sequences;
* plugin lifecycle diagrams;
* synchronization sequences;
* storage topology;
* deployment diagrams;
* failure and recovery workflows.

External systems shall be represented explicitly where architecturally relevant.

---

# 112. Documentation Rules

Each Integration document shall define, where applicable:

```text
Purpose
Scope
Boundary
Responsibilities
Non-Responsibilities
Internal Contract
External Contract
Mapping
Lifecycle
Authentication
Authorization
Validation
Compatibility
Versioning
Timeout
Retry
Idempotency
Failure Behavior
Security
Privacy
Observability
Testing
Implementation Mapping
Related ADRs
Related Diagrams
```

Documents shall not repeat Domain or Platform definitions.

They shall reference them.

---

# 113. Integration Vocabulary

Canonical terms shall be preserved.

Examples include:

* Provider;
* Adapter;
* Public Contract;
* Canonical Exchange;
* Import Protocol;
* Export Protocol;
* External Service;
* Remote Execution;
* Plugin SDK;
* Capability;
* Permission;
* Public API;
* Storage Provider;
* Synchronization Protocol;
* Synchronization Participant;
* Checkpoint;
* Conflict;
* Webhook;
* MCP.

Agents shall not alternate casually between:

* Provider and Engine;
* Adapter and Service;
* Protocol and Workflow;
* Storage and Library;
* Synchronization and Backup;
* Public API and Internal API;
* Plugin Capability and Permission.

---

# 114. Review Checklist

Before approving an Integration change, verify:

* the responsibility belongs in Integration;
* the owning Platform Engine is identified;
* Domain semantics remain protected;
* provider-specific details are isolated;
* contracts are explicit;
* contracts are versioned where required;
* external input is validated;
* identity is preserved;
* provenance is preserved;
* failure translation is defined;
* timeout is defined;
* retry is defined;
* idempotency is defined where required;
* compatibility is defined;
* security is defined;
* privacy is defined;
* observability is defined;
* offline behavior is defined;
* storage authority remains correct;
* synchronization authority remains correct;
* plugin capabilities remain least-privilege;
* public APIs do not expose internals;
* implementation adapters are replaceable;
* tests are defined;
* ADR impact was reviewed;
* diagrams were reviewed.

---

# 115. Minimum Change Rule

Agents shall make the smallest complete Integration change.

They shall not:

* expose private internals for convenience;
* bind Platform Engines to providers;
* introduce vendor fields into Domain;
* create duplicate public contracts;
* skip versioning for breaking changes;
* treat external input as trusted;
* create unrestricted plugin capabilities;
* use storage paths as identities;
* make network access mandatory for local core workflows;
* silently resolve synchronization conflicts;
* introduce fallback that violates privacy policy;
* log external payloads containing user knowledge;
* introduce unbounded retries;
* restructure Integration without architectural need.

---

# 116. Integration Completion Criteria

Integration work is complete only when:

* the boundary is explicit;
* the owning capability is explicit;
* the internal contract is defined;
* the external contract is defined;
* translation is defined;
* identity is preserved;
* provenance is preserved;
* validation is defined;
* compatibility is defined;
* versioning is defined;
* failure behavior is defined;
* timeout is defined;
* retry is defined;
* idempotency is defined where required;
* security is reviewed;
* privacy is reviewed;
* observability is defined;
* implementation adapters are identified;
* tests are defined;
* ADR impact is resolved;
* diagram impact is resolved;
* no provider-specific leakage remains;
* no unresolved contradiction remains.

---

# 117. Agent Reporting

After Integration work, the agent shall report:

* the Integration objective;
* the affected Integration area;
* the owning Platform Engine;
* files reviewed;
* files created;
* files modified;
* contract impact;
* provider impact;
* public API impact;
* plugin impact;
* storage impact;
* synchronization impact;
* identity impact;
* provenance impact;
* compatibility impact;
* security impact;
* privacy impact;
* Execution impact;
* implementation impact;
* ADR impact;
* diagram impact;
* validation performed;
* unresolved risks.

---

# 118. Final Rule

Integration is the protective boundary of KnowledgeOS.

External systems may change.

Providers may disappear.

Protocols may evolve.

Contracts may be consumed by unknown clients.

The Domain, Kernel and Platform shall remain coherent despite that variability.

Before integrating a system, define the boundary.

Before using a provider, define the contract.

Before accepting data, validate it.

Before exposing behavior, version it.

Before sending knowledge externally, enforce privacy.

Before synchronizing state, preserve identity and authority.

Before granting plugin access, apply least privilege.

Before declaring completion, verify the entire external-to-contract-to-Engine-to-Domain path.

---

# End of `00-Architecture/05-Integration/AGENTS.md`
