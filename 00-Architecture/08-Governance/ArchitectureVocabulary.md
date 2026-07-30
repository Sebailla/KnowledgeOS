
# Architecture Vocabulary

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Governance

**Document:** Architecture Vocabulary

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the canonical architectural vocabulary of KnowledgeOS Architecture Version 3.

KnowledgeOS contains multiple architectural layers, models, execution mechanisms and integration boundaries.

Without a controlled vocabulary, the same term may acquire different meanings across:

* Foundation;
* Domain;
* Kernel;
* Platform;
* Integration;
* Execution;
* Architecture Views;
* implementation.

Such semantic drift creates:

* ambiguous responsibilities;
* incorrect dependencies;
* incompatible contracts;
* misleading diagrams;
* implementation errors;
* documentation contradictions.

This document establishes the canonical meaning of the principal architectural terms used throughout KnowledgeOS.

---

# 2. Scope

This document governs architectural terminology related to:

* the product;
* knowledge;
* documents;
* identity;
* storage;
* presentation;
* execution;
* messaging;
* workflows;
* concurrency;
* reliability;
* Platform Engines;
* Plugins;
* Providers;
* APIs;
* synchronization;
* AI;
* Architecture Views;
* Governance.

This document does not attempt to define:

* every implementation class;
* every programming-language term;
* every third-party technology;
* every user-interface term;
* every future Domain concept.

Terms not defined here shall use their ordinary technical meaning unless another approved normative document defines them more precisely.

---

# 3. Core Principle

The fundamental principle is:

> One architectural concept shall have one canonical meaning across KnowledgeOS.

The complementary principle is:

> Different architectural concepts shall not share one term merely because their implementations appear similar.

---

# 4. Vocabulary Authority

This document is the canonical vocabulary reference for Architecture V3.

Specialized normative documents may provide more detailed definitions.

They shall not redefine a canonical term incompatibly.

---

# 5. Vocabulary Governance

A canonical term may be:

* introduced;
* clarified;
* deprecated;
* superseded;

only through Architecture Governance.

---

# 6. Terminology Rules

The following rules apply:

* use canonical terms consistently;
* avoid unnecessary synonyms;
* distinguish identity from location;
* distinguish canonical state from derived state;
* distinguish execution intention from execution Attempt;
* distinguish internal contracts from external integrations;
* distinguish structural models from presentation models.

---

# 7. Product Terms

---

# 8. KnowledgeOS

**KnowledgeOS** is the personal knowledge management platform defined by the Product Vision and Architecture V3.

KnowledgeOS provides governed capabilities for:

* ingestion;
* representation;
* organization;
* reading;
* annotation;
* search;
* transformation;
* synchronization;
* AI-assisted processing;
* extension.

KnowledgeOS is not synonymous with:

* one application process;
* one device;
* one database;
* one Library;
* one AI model.

---

# 9. User

A **User** is the human owner and primary controller of knowledge managed through KnowledgeOS.

The User retains ownership of their knowledge.

---

# 10. Platform

The **Platform** is the complete KnowledgeOS product capability environment.

It includes:

* Domain models;
* Kernel infrastructure;
* Platform Engines;
* Integration boundaries;
* Execution infrastructure.

The Platform is not synonymous with `04-Platform`.

---

# 11. Architecture

The **Architecture** is the approved set of structures, responsibilities, contracts, principles, constraints and execution semantics governing KnowledgeOS.

---

# 12. Architecture Version

An **Architecture Version** is a governed architectural baseline.

Example:

```text
Architecture Version 3.0
```

---

# 13. Knowledge Terms

---

# 14. Knowledge

**Knowledge** is meaningful information represented, related, interpreted or managed within KnowledgeOS.

Knowledge may originate from:

* documents;
* annotations;
* metadata;
* relationships;
* user-created content;
* imported sources;
* derived processing.

---

# 15. Knowledge Object

A **Knowledge Object** is a first-class Domain entity representing a manageable unit of knowledge within KnowledgeOS.

A Knowledge Object may aggregate:

* identity;
* content;
* metadata;
* Sources;
* Assets;
* Relationships;
* Provenance;
* Versioning;
* lifecycle state.

The canonical definition is governed by:

`../02-Domain/KnowledgeObject/KnowledgeObject.md`

---

# 16. Knowledge Object Identity

**Knowledge Object Identity** is the stable logical identity of a Knowledge Object.

It is independent from:

* file path;
* storage location;
* presentation;
* current Version.

---

# 17. Knowledge Graph

The **Knowledge Graph** is the graph-oriented representation of relationships among knowledge entities.

It supports:

* explicit Relationships;
* semantic connections;
* graph navigation;
* derived knowledge structures.

---

# 18. Relationship

A **Relationship** is a typed connection between identifiable Domain entities.

A Relationship is not merely a visual link.

---

# 19. Source

A **Source** represents the origin from which knowledge or content was obtained.

Examples include:

* local file;
* PDF;
* EPUB;
* Web resource;
* external service;
* user-created content.

---

# 20. Provenance

**Provenance** records the origin and transformation history relevant to a Knowledge Object or derived representation.

---

# 21. Metadata

**Metadata** is structured descriptive information associated with an architectural or Domain entity.

Metadata is distinct from primary content.

---

# 22. Asset

An **Asset** is a managed binary or media Resource associated with knowledge.

Examples include:

* image;
* audio;
* video;
* attachment;
* generated preview.

---

# 23. Derived Artifact

A **Derived Artifact** is output generated from canonical or source data that can normally be regenerated.

Examples include:

* thumbnail;
* Search index;
* embedding;
* preview;
* rendered export.

A Derived Artifact is not automatically canonical state.

---

# 24. Document Terms

---

# 25. Document

A **Document** is a structured knowledge representation that may be imported, created, transformed, read, annotated or exported by KnowledgeOS.

A Document is not defined solely by its original file format.

---

# 26. Source Document

A **Source Document** is the original or authoritative external input from which a KnowledgeOS representation may be created.

---

# 27. Universal Document Model

The **Universal Document Model (UDM)** is the canonical semantic and structural document representation used by KnowledgeOS.

UDM represents what the document means and how its content is structurally organized.

---

# 28. UDM

**UDM** is the canonical acronym for Universal Document Model.

It shall not be reused for another concept.

---

# 29. Document Presentation Model

The **Document Presentation Model (DPM)** represents presentation, layout, spatial structure and visual characteristics associated with a document.

DPM represents how content is presented.

---

# 30. DPM

**DPM** is the canonical acronym for Document Presentation Model.

---

# 31. UDM and DPM Separation

UDM and DPM are complementary but distinct.

```text
UDM
  │
  └── Semantic and structural meaning

DPM
  │
  └── Presentation and layout meaning
```

UDM shall not become dependent on one specific presentation.

DPM shall not redefine canonical semantic content.

---

# 32. Node

A **Node** is an identifiable element within a structured model such as UDM or DPM.

The exact Node semantics depend on the governing model.

---

# 33. UDM Node

A **UDM Node** is a semantic or structural element of the Universal Document Model.

---

# 34. Presentation Node

A **Presentation Node** is an element of the Document Presentation Model.

---

# 35. Node Identity

**Node Identity** is the stable identity of a Node within its governed identity scope.

---

# 36. Structural Node

A **Structural Node** represents document organization.

Examples may include:

* section;
* paragraph;
* list;
* table.

---

# 37. Content Node

A **Content Node** represents primary document content.

---

# 38. Inline Node

An **Inline Node** represents content embedded within a larger structural flow.

---

# 39. Semantic Node

A **Semantic Node** represents explicit semantic meaning beyond basic document structure.

---

# 40. Annotation Node

An **Annotation Node** represents annotation-related content or structure within the governed model.

---

# 41. Asset Node

An **Asset Node** references or represents a managed Asset within the document model.

---

# 42. Anchor

An **Anchor** is a stable reference mechanism used to identify a meaningful position, range or target within knowledge or document structure.

An Anchor is not equivalent to a file offset.

---

# 43. Anchor Mapping

**Anchor Mapping** maps an Anchor between compatible representations or model states.

---

# 44. Layout

**Layout** is the spatial organization of presentation elements.

---

# 45. Layout Graph

A **Layout Graph** represents spatial and presentation relationships among DPM elements.

---

# 46. Region

A **Region** is a bounded presentation area within a layout.

---

# 47. Page

A **Page** is a presentation partition where the source or presentation model defines paginated structure.

A Page is not necessarily a canonical semantic boundary.

---

# 48. Reading Flow

**Reading Flow** defines the intended traversal order of presented content.

---

# 49. Visual Hierarchy

**Visual Hierarchy** represents presentation cues that communicate relative visual importance.

---

# 50. Presentation Reconstruction

**Presentation Reconstruction** is the process of rebuilding a usable presentation from source layout and presentation information.

---

# 51. Identity Terms

---

# 52. Identity

**Identity** is the stable logical distinction of an entity from other entities.

Identity is not synonymous with:

* name;
* path;
* location;
* current representation.

---

# 53. Identifier

An **Identifier** is a value used to represent Identity within a defined scope.

---

# 54. Stable Identifier

A **Stable Identifier** remains associated with the same logical entity across its supported lifecycle.

---

# 55. Reference

A **Reference** points to an identifiable entity.

A Reference is not necessarily ownership.

---

# 56. Address

An **Address** identifies where something can currently be reached or accessed.

An Address may change while Identity remains stable.

---

# 57. Path

A **Path** identifies a location within a hierarchical namespace or file system.

A Path is not canonical Identity.

---

# 58. Key

A **Key** is a value used for lookup, indexing, uniqueness, partitioning or cryptographic purposes according to context.

A Key is not automatically Domain Identity.

---

# 59. Version

A **Version** identifies a meaningful state or contract revision within a defined Versioning model.

---

# 60. Revision

A **Revision** is a recorded change to an entity or artifact.

A Revision does not necessarily represent a public compatibility Version.

---

# 61. Storage Terms

---

# 62. Library

A **Library** is a governed collection of KnowledgeOS knowledge and associated Resources.

A Library may include:

* Knowledge Objects;
* Documents;
* Assets;
* metadata;
* Relationships;
* synchronization state.

---

# 63. Source of Truth

The **Source of Truth** is the authoritative canonical storage location or authority for a defined data scope.

For the primary KnowledgeOS Library architecture, the NAS is the configured Library Source of Truth.

---

# 64. Canonical State

**Canonical State** is the authoritative state from which other representations may be derived or reconciled.

---

# 65. Canonical Storage

**Canonical Storage** stores canonical state.

Canonical Storage and Source of Truth are related but not always interchangeable concepts.

---

# 66. NAS

**NAS** means Network Attached Storage.

Within the primary KnowledgeOS architecture, the NAS serves as the configured Library Source of Truth.

---

# 67. Local Replica

A **Local Replica** is a managed local representation of canonical or synchronizable state.

A Local Replica may support Offline First operation.

A Local Replica is not equivalent to a disposable cache.

---

# 68. Cache

A **Cache** is a replaceable optimization layer containing data that may be discarded and reconstructed without violating canonical correctness.

---

# 69. Temporary Storage

**Temporary Storage** holds short-lived data required during processing.

It is not canonical by default.

---

# 70. Offline First

**Offline First** is the architectural principle that core user workflows remain functional without continuous network availability.

Offline First does not mean:

* network is never used;
* synchronization is unnecessary;
* every remote capability is available offline.

---

# 71. Synchronization

**Synchronization** is the governed process of reconciling state across participating locations or replicas.

---

# 72. Sync

**Sync** is the accepted abbreviated form of Synchronization in names and implementation-oriented contexts.

Normative prose should prefer `Synchronization` where clarity matters.

---

# 73. Synchronization Session

A **Synchronization Session** is one bounded logical synchronization operation.

---

# 74. Conflict

A **Conflict** occurs when concurrent or divergent changes cannot be reconciled automatically under existing policy.

---

# 75. Reconciliation

**Reconciliation** is the process of determining and establishing a consistent state when observed states or external outcomes differ or are uncertain.

---

# 76. Platform Architecture Terms

---

# 77. Engine

An **Engine** is a major Platform capability boundary with explicit responsibility, contracts and lifecycle.

Examples include:

* AI Engine;
* Annotation Engine;
* Export Engine;
* Import Engine;
* Knowledge Engine;
* Library Engine;
* Plugin Engine;
* Render Engine;
* Search Engine;
* Sync Engine.

An Engine is not:

* an arbitrary service class;
* a utility module;
* a Provider implementation.

---

# 78. Platform Engine

A **Platform Engine** is an Engine governed by `04-Platform`.

---

# 79. Engine Responsibility

An **Engine Responsibility** is a capability owned by one Engine as defined by the Domain and Platform architecture.

---

# 80. Engine Boundary

An **Engine Boundary** separates one Platform capability responsibility from another.

---

# 81. Engine Interaction

**Engine Interaction** is governed communication between Engines through approved contracts and Kernel mechanisms.

---

# 82. Direct Engine Coupling

**Direct Engine Coupling** is an implementation dependency that bypasses governed contracts or coordination mechanisms.

It is prohibited where it violates Platform architecture.

---

# 83. Kernel

The **Kernel** is the foundational application infrastructure layer providing shared coordination and execution primitives.

The Kernel includes capabilities such as:

* Command Bus;
* Query Bus;
* Event Bus;
* Job System;
* Scheduler;
* Workflow Engine;
* Dependency Injection;
* Configuration;
* Logging;
* Observability.

The Kernel does not own Domain business semantics.

---

# 84. Kernel Service

A **Kernel Service** is a foundational infrastructure capability owned by the Kernel.

---

# 85. Dependency Injection

**Dependency Injection (DI)** is the governed mechanism for supplying dependencies without requiring components to construct concrete dependencies directly.

---

# 86. Configuration

**Configuration** is governed runtime or deployment-specific information used to control behavior without redefining Domain semantics.

---

# 87. Integration Terms

---

# 88. Integration

**Integration** is the architectural boundary through which KnowledgeOS interacts with external systems, Providers, protocols, APIs and extension environments.

---

# 89. Provider

A **Provider** is an implementation behind a governed Integration contract that supplies a capability to KnowledgeOS.

Examples include:

* AI Provider;
* OCR Provider;
* Storage Provider;
* Sync Provider;
* Export Provider.

A Provider is not the Platform Engine that consumes the capability.

---

# 90. Provider Model

The **Provider Model** defines the common architecture governing Provider identity, capabilities, lifecycle, selection, health, failure and compatibility.

---

# 91. AI Provider

An **AI Provider** supplies AI model or AI execution capability through a governed Provider contract.

It may be:

* local;
* remote.

---

# 92. OCR Provider

An **OCR Provider** supplies optical character recognition capability.

---

# 93. Storage Provider

A **Storage Provider** supplies storage access behind a governed Integration contract.

---

# 94. Sync Provider

A **Sync Provider** supplies synchronization transport or remote synchronization capability.

---

# 95. Export Provider

An **Export Provider** supplies format-specific or destination-specific Export capability.

---

# 96. External Service

An **External Service** is a system outside the KnowledgeOS architectural boundary with which KnowledgeOS interacts.

---

# 97. Adapter

An **Adapter** is an implementation that translates between one interface or model and another.

An Adapter may implement a Provider contract.

`Adapter` and `Provider` are not automatically synonymous.

---

# 98. Protocol

A **Protocol** defines rules for structured communication or exchange.

---

# 99. Transport

A **Transport** is the mechanism used to carry communication.

A Transport does not define the complete semantic contract.

---

# 100. Public API

A **Public API** is an explicitly supported external interface exposed by KnowledgeOS.

---

# 101. Local API

A **Local API** is a supported API intended for local-device or local-environment access.

---

# 102. REST

**REST** refers to the REST architectural style as applied to supported HTTP APIs.

---

# 103. GraphQL

**GraphQL** refers to the GraphQL query and API technology used where explicitly supported.

---

# 104. Authentication

**Authentication** establishes the identity of a caller or Principal.

---

# 105. Authorization

**Authorization** determines whether an authenticated or otherwise identified Principal may perform an action.

---

# 106. OAuth

**OAuth** is the authorization framework used for delegated authorization where applicable.

---

# 107. MCP

**MCP** means Model Context Protocol.

Within KnowledgeOS, MCP is an external integration protocol and does not redefine internal Domain or Kernel contracts.

---

# 108. Webhook

A **Webhook** is an externally delivered event-style HTTP callback.

A Webhook is not automatically an internal Domain Event.

---

# 109. Remote Execution

**Remote Execution** is execution performed outside the local KnowledgeOS Runtime through a governed external boundary.

---

# 110. Data Exchange Terms

---

# 111. Data Exchange

**Data Exchange** is the governed movement of information into or out of KnowledgeOS through defined representations and protocols.

---

# 112. Import

**Import** is the process of ingesting external content or data into KnowledgeOS.

---

# 113. Export

**Export** is the process of producing external representations or outputs from KnowledgeOS-managed information.

---

# 114. Canonical Exchange

**Canonical Exchange** is an exchange representation designed to preserve KnowledgeOS semantics as completely as required by its contract.

---

# 115. Serialization

**Serialization** is the conversion of structured state into a transferable or storable representation.

---

# 116. Deserialization

**Deserialization** reconstructs structured state from a serialized representation.

Deserialization does not imply trust or validity.

---

# 117. Plugin Terms

---

# 118. Plugin

A **Plugin** is an independently developed extension that operates through governed extension contracts and granted Capabilities.

A Plugin is not an unrestricted internal module.

---

# 119. Plugin SDK

The **Plugin SDK** is the supported development contract and tooling surface used to build KnowledgeOS Plugins.

---

# 120. Extension Point

An **Extension Point** is a governed location where Plugins may extend KnowledgeOS behavior.

---

# 121. Capability

A **Capability** is an explicitly granted authority or functional permission available to a Plugin or other governed participant.

---

# 122. Plugin Manifest

A **Plugin Manifest** is the declarative description of Plugin identity, compatibility, requested Capabilities and relevant metadata.

---

# 123. Plugin Contract

A **Plugin Contract** is a stable supported interface governing Plugin interaction with KnowledgeOS.

---

# 124. Plugin Compatibility

**Plugin Compatibility** defines whether a Plugin can safely operate with a given KnowledgeOS or SDK contract Version.

---

# 125. Sandbox

A **Sandbox** is an isolation boundary restricting Plugin or untrusted execution.

Sandbox semantics depend on the implementation platform and shall not be assumed stronger than the actual isolation mechanism.

---

# 126. Execution Terms

---

# 127. Execution

**Execution** is the governed performance of work within or through KnowledgeOS.

---

# 128. Runtime

The **Runtime** is the active execution environment in which KnowledgeOS components operate.

Runtime is not synonymous with the complete Platform architecture.

---

# 129. Execution Model

The **Execution Model** defines how work is represented, admitted, scheduled, executed, cancelled, completed and recovered.

---

# 130. Execution Context

An **Execution Context** is the contextual state associated with one execution scope.

It may include:

* Operation Identity;
* Correlation;
* Causation;
* Principal;
* cancellation;
* Deadline;
* Execution Profile;
* observability context.

---

# 131. Operation

An **Operation** is a logical unit of user-visible or system-visible activity.

An Operation may span multiple:

* Commands;
* Events;
* Jobs;
* Attempts;
* Provider calls.

---

# 132. Operation Identity

**Operation Identity** identifies one logical Operation across its execution chain.

---

# 133. Attempt

An **Attempt** is one concrete execution of retryable or recoverable work.

Retries and resumed execution create new Attempts.

---

# 134. Attempt Identity

**Attempt Identity** uniquely identifies one concrete execution Attempt.

---

# 135. Command

A **Command** is an explicit request to perform an action that may change state or cause effects.

A Command expresses intent.

---

# 136. Query

A **Query** is a request to retrieve information without intentionally changing canonical state.

---

# 137. Event

An **Event** represents a fact or notification that something has occurred.

An Event is not a request to perform an action.

---

# 138. Message

A **Message** is a general communication Unit.

Commands, Queries and Events are distinct semantic Message categories where transported through messaging infrastructure.

---

# 139. Command Bus

The **Command Bus** routes Commands to governed Command handling.

---

# 140. Query Bus

The **Query Bus** routes Queries to governed Query handling.

---

# 141. Event Bus

The **Event Bus** distributes Events to interested Consumers.

---

# 142. Handler

A **Handler** is a component responsible for processing a specific governed input such as a Command, Query, Event or Job Type.

---

# 143. Consumer

A **Consumer** receives and processes Events or other stream-delivered information according to its contract.

---

# 144. Background Work

**Background Work** is execution that does not require continuous immediate user interaction.

Background Work may be:

* durable;
* ephemeral.

---

# 145. Background Job

A **Background Job** is a governed Unit of asynchronous work whose lifecycle is independent from one immediate synchronous call stack.

---

# 146. Durable Job

A **Durable Job** is a Background Job whose required execution state survives process interruption.

---

# 147. Ephemeral Background Work

**Ephemeral Background Work** is disposable asynchronous work whose loss is acceptable.

---

# 148. Job Identity

**Job Identity** identifies one logical Job across all execution Attempts.

---

# 149. Job Type

A **Job Type** identifies a stable Job execution contract.

---

# 150. Job Payload

A **Job Payload** contains serializable input required to execute a Job.

---

# 151. Workflow

A **Workflow** is an explicit orchestration of multiple Steps, operations or Jobs according to governed control flow.

---

# 152. Workflow Step

A **Workflow Step** is one governed stage within a Workflow.

---

# 153. Scheduler

The **Scheduler** determines when eligible work receives execution opportunity.

---

# 154. Scheduling

**Scheduling** is the governed allocation of execution opportunity over time.

---

# 155. Scheduling Class

A **Scheduling Class** identifies the broad execution priority and responsiveness category of work.

---

# 156. Deadline

A **Deadline** is the time after which an operation no longer satisfies its timing contract or should no longer begin or continue according to policy.

---

# 157. Timeout

A **Timeout** is the bounded period a caller or Runtime is willing to wait for an operation or Attempt.

A Timeout does not prove an external effect did not occur.

---

# 158. Cancellation

**Cancellation** is a request to stop unnecessary future or ongoing work.

Cancellation is normally cooperative.

---

# 159. Cancellation Request

A **Cancellation Request** expresses the intent to stop execution.

It does not prove execution has stopped.

---

# 160. Safe Point

A **Safe Point** is an execution boundary at which work may safely:

* stop;
* suspend;
* checkpoint;
* release Resources.

---

# 161. Suspension

**Suspension** is the temporary cessation of execution with valid continuation semantics.

---

# 162. Resume

**Resume** is the continuation of suspended logical work, normally through a new execution Attempt.

---

# 163. Lifecycle

A **Lifecycle** is the governed progression of an entity through defined states or phases.

---

# 164. Concurrency Terms

---

# 165. Concurrency

**Concurrency** is the condition in which multiple operations make progress during overlapping periods.

---

# 166. Parallelism

**Parallelism** is simultaneous execution of multiple operations.

Concurrency does not necessarily imply Parallelism.

---

# 167. Concurrency Control

**Concurrency Control** is the set of mechanisms used to preserve correctness when operations overlap.

---

# 168. Lock

A **Lock** is a synchronization mechanism controlling concurrent access to a Resource or critical section.

---

# 169. Lease

A **Lease** is time-bounded ownership or authority that expires unless renewed.

A Lease does not automatically guarantee exactly-once execution.

---

# 170. Transaction

A **Transaction** is a bounded set of operations governed by defined atomicity and consistency semantics.

---

# 171. Transaction Boundary

A **Transaction Boundary** defines which operations participate in one transaction.

---

# 172. Idempotency

**Idempotency** is the property that repeated application of the same logical operation does not produce unintended additional effects.

---

# 173. Idempotency Key

An **Idempotency Key** identifies the logical effect scope protected against duplicate execution.

---

# 174. Deduplication

**Deduplication** identifies and suppresses equivalent duplicate work or data within a defined scope.

Deduplication is not Idempotency.

---

# 175. Determinism

**Determinism** is the property that equivalent inputs under equivalent defined conditions produce equivalent governed results.

---

# 176. Reproducibility

**Reproducibility** is the ability to reproduce a result or execution outcome under documented conditions.

Reproducibility and Determinism are related but distinct.

---

# 177. Ordering

**Ordering** defines the relative processing sequence guaranteed within an explicit scope.

---

# 178. Global Ordering

**Global Ordering** is ordering across all relevant operations.

KnowledgeOS shall not assume Global Ordering unless explicitly provided.

---

# 179. Partition

A **Partition** is a bounded execution, storage or ordering scope identified by a stable key.

---

# 180. Concurrency Key

A **Concurrency Key** identifies a scope within which execution concurrency is restricted.

---

# 181. Backpressure

**Backpressure** is the controlled reduction, delay or rejection of incoming work when downstream capacity is constrained.

---

# 182. Queue

A **Queue** is a structure holding work awaiting processing.

A Queue does not by itself define durability, ordering or exactly-once semantics.

---

# 183. Reliability Terms

---

# 184. Reliability

**Reliability** is the ability of KnowledgeOS to perform required behavior correctly under expected operating and failure conditions.

---

# 185. Failure

A **Failure** is the inability of an operation or component to satisfy its defined contract.

---

# 186. Error

An **Error** is structured information representing an unsuccessful or invalid condition.

`Error` and `Failure` are related but not always synonymous.

---

# 187. Fault

A **Fault** is an underlying defect or adverse condition that may cause a Failure.

---

# 188. Transient Failure

A **Transient Failure** is a failure condition expected to potentially succeed when retried later.

---

# 189. Permanent Failure

A **Permanent Failure** is a failure condition not expected to succeed through unchanged retry.

---

# 190. Retry

A **Retry** is a new execution Attempt of the same logical operation after a failed Attempt.

---

# 191. Retry Policy

A **Retry Policy** defines:

* eligibility;
* Attempt limits;
* delay;
* backoff;
* jitter;
* retry budget.

---

# 192. Retry Budget

A **Retry Budget** bounds the amount of retry activity permitted within a defined scope.

---

# 193. Backoff

**Backoff** is the controlled delay between retry Attempts.

---

# 194. Jitter

**Jitter** is bounded variation added to retry timing to reduce synchronized retry behavior.

---

# 195. Recovery

**Recovery** is the governed process of restoring safe operation or determining correct state after interruption, failure or uncertainty.

---

# 196. Recovery Required

**Recovery Required** is a state indicating normal execution cannot safely continue or determine the outcome without Recovery logic.

---

# 197. Checkpoint

A **Checkpoint** is durable intermediate execution state from which compatible logical work may resume or restart with reduced lost progress.

A Checkpoint is not successful completion.

---

# 198. Checkpointing

**Checkpointing** is the process of creating and managing Checkpoints.

---

# 199. Compensation

**Compensation** is a governed action intended to semantically counteract or mitigate a previously completed effect.

Compensation is not equivalent to transaction rollback.

---

# 200. Rollback

**Rollback** reverses changes within a transaction or another explicitly reversible boundary.

---

# 201. Reconciliation

In reliability contexts, **Reconciliation** determines actual state when execution outcome is uncertain.

---

# 202. Unknown Outcome

An **Unknown Outcome** exists when KnowledgeOS cannot determine whether an attempted effect occurred.

---

# 203. Degraded Mode

**Degraded Mode** is a controlled operating state in which reduced capability remains available while some normal capability is unavailable.

---

# 204. Fault Isolation

**Fault Isolation** limits the propagation of one failure into unrelated architectural areas.

---

# 205. Observability Terms

---

# 206. Observability

**Observability** is the ability to understand system state and behavior from generated evidence.

---

# 207. Log

A **Log** is a structured or textual record of an occurrence relevant to diagnosis or operation.

---

# 208. Metric

A **Metric** is a quantitative measurement of system behavior or state.

---

# 209. Trace

A **Trace** represents the execution path of an operation across participating components or boundaries.

---

# 210. Span

A **Span** represents one timed Unit of work within a Trace.

---

# 211. Correlation Identity

**Correlation Identity** links related execution or messages belonging to a broader logical activity.

---

# 212. Causation Identity

**Causation Identity** identifies the direct cause of a Message or operation.

---

# 213. Telemetry

**Telemetry** is operational evidence emitted for observability.

Telemetry may include:

* Logs;
* Metrics;
* Traces.

---

# 214. Performance Terms

---

# 215. Performance

**Performance** describes system behavior with respect to:

* latency;
* throughput;
* Resource use;
* responsiveness.

---

# 216. Latency

**Latency** is the elapsed time between defined operation boundaries.

---

# 217. Throughput

**Throughput** is the amount of work completed within a defined period.

---

# 218. Resource

A **Resource** is a bounded execution or system capacity consumed or reserved by work.

Examples include:

* CPU;
* memory;
* GPU;
* Storage;
* network;
* Provider quota.

---

# 219. Resource Budget

A **Resource Budget** is an explicit limit or allocation governing Resource consumption.

---

# 220. Resource Admission

**Resource Admission** determines whether sufficient governed capacity exists to begin significant work.

---

# 221. Memory Pressure

**Memory Pressure** is a condition in which available memory capacity becomes constrained enough to require adaptive behavior.

---

# 222. Execution Profile

An **Execution Profile** defines execution expectations and constraints for a class of work.

It may include:

* priority;
* latency sensitivity;
* Resource profile;
* cancellation behavior;
* durability.

---

# 223. Cache Strategy

A **Cache Strategy** defines:

* what may be cached;
* where;
* for how long;
* invalidation;
* consistency expectations.

---

# 224. AI Terms

---

# 225. Artificial Intelligence

**Artificial Intelligence (AI)** refers to model-based capabilities used as tools within KnowledgeOS.

AI is not the architectural center or Source of Truth of KnowledgeOS.

---

# 226. AI Engine

The **AI Engine** is the Platform Engine responsible for governed AI capability orchestration.

---

# 227. AI Model

An **AI Model** is a computational model used to perform an AI capability.

---

# 228. Local Model

A **Local Model** executes within the user's local environment.

---

# 229. Remote Model

A **Remote Model** executes through an external Provider or remote service.

---

# 230. Inference

**Inference** is the execution of an AI Model to produce output from input.

---

# 231. Embedding

An **Embedding** is a vector representation derived from content for semantic processing.

An Embedding is derived state and is not canonical source content.

---

# 232. Prompt

A **Prompt** is structured input supplied to an AI Model.

---

# 233. AI Output

**AI Output** is model-generated output.

AI Output does not become canonical knowledge merely because it was generated.

---

# 234. Human Acceptance

**Human Acceptance** is explicit user confirmation where architecture requires AI-generated or derived content to become authoritative user knowledge.

---

# 235. Security Terms

---

# 236. Principal

A **Principal** is an identity under whose authority an operation executes.

A Principal may represent:

* User;
* system;
* Plugin;
* Recovery process.

---

# 237. Authority

**Authority** is the permission or power to perform a governed action.

---

# 238. Trust Boundary

A **Trust Boundary** is a boundary across which assumptions about identity, authority, validity or confidentiality change.

---

# 239. Capability Grant

A **Capability Grant** is explicit authorization to use a defined Capability.

---

# 240. Secret

A **Secret** is sensitive information used to establish authority or access.

Examples include:

* credentials;
* API keys;
* private tokens.

---

# 241. Privacy

**Privacy** is the protection and governed handling of user information according to user ownership and architectural policy.

---

# 242. Architecture View Terms

---

# 243. Architecture View

An **Architecture View** is a structured representation of the architecture from one defined perspective.

---

# 244. Architecture Decision Record

An **Architecture Decision Record (ADR)** records a significant architectural decision, its context, alternatives and consequences.

---

# 245. ADR

**ADR** is the canonical acronym for Architecture Decision Record.

---

# 246. C4

**C4** is the architecture visualization model used to represent progressive structural abstraction.

---

# 247. System Context

A **System Context View** represents:

* users;
* KnowledgeOS;
* external systems;
* high-level relationships.

---

# 248. Container

Within C4, a **Container** is a separately running or deployable application, process or data store boundary.

It is not synonymous with a Docker container.

---

# 249. Component

Within C4, a **Component** is a significant architectural building block within a Container.

It is not an arbitrary source-code file or class.

---

# 250. UML

**UML** means Unified Modeling Language.

KnowledgeOS uses UML selectively for structural and behavioral modeling.

---

# 251. View Identity

**View Identity** is the stable identifier of an Architecture View.

---

# 252. Normative Document

A **Normative Document** defines approved architectural requirements within its Scope.

---

# 253. Rector Document

A **Rector Document** is the governing README or equivalent document defining the architecture of a directory or major scope.

---

# 254. Architecture Governance Terms

---

# 255. Governance

**Governance** is the process controlling how architecture is proposed, evaluated, approved, changed, migrated and frozen.

---

# 256. Architectural Truth

**Architectural Truth** is the currently approved set of normative architectural statements governing KnowledgeOS.

---

# 257. Architecture Backlog

The **Architecture Backlog** records unresolved or deferred architectural work.

Backlog items are not approved architecture.

---

# 258. Architecture Decision Matrix

The **Architecture Decision Matrix** is the governed evaluation framework used to assess significant architecture proposals.

---

# 259. Architecture Review

An **Architecture Review** is a structured evaluation of architectural completeness, correctness, consistency or conformance.

---

# 260. Architecture Freeze

**Architecture Freeze** establishes a stable approved architecture baseline for implementation.

Freeze prohibits uncontrolled change.

It does not prohibit governed evolution.

---

# 261. Frozen Baseline

A **Frozen Baseline** is the approved set of architecture artifacts included in an Architecture Freeze.

---

# 262. Migration

**Migration** is the governed transition from one architectural, data, contract or implementation state to another.

---

# 263. Migration Plan

A **Migration Plan** defines how a source state transitions to a target state.

---

# 264. Deprecation

**Deprecation** indicates that an architectural element remains temporarily supported but should not guide new work.

---

# 265. Supersession

**Supersession** replaces one approved architectural decision or artifact with another while preserving history.

---

# 266. Archive

An **Archive** preserves historical artifacts outside the active normative baseline.

---

# 267. Exception

An **Exception** is an explicitly governed temporary deviation from an architectural rule.

---

# 268. Non-Conformance

**Non-Conformance** is a documented mismatch between an artifact and applicable approved architecture.

---

# 269. Architecture Debt

**Architecture Debt** is known architectural work deferred despite a recognized gap, limitation or future obligation.

Architecture Debt shall remain explicit.

---

# 270. Documentation Debt

**Documentation Debt** is a known defect or incompleteness in architecture documentation.

---

# 271. Architecture Status Terms

---

# 272. Draft

**Draft** means an artifact is under development and is not normative.

---

# 273. Proposed

**Proposed** means an artifact is ready for review but not yet approved.

---

# 274. Approved

**Approved** means an artifact is normative within its declared Scope.

---

# 275. Deprecated

**Deprecated** means an artifact remains temporarily relevant but should not guide new work.

---

# 276. Superseded

**Superseded** means an artifact has been replaced by another approved artifact.

---

# 277. Archived

**Archived** means an artifact is retained for historical reference and is outside the active normative baseline.

---

# 278. Quality Terms

---

# 279. Quality Attribute

A **Quality Attribute** is a measurable or assessable non-functional property of the architecture.

Examples include:

* reliability;
* performance;
* maintainability;
* portability;
* privacy.

---

# 280. Constraint

A **Constraint** is a condition that limits architectural choices.

---

# 281. Principle

An **Architecture Principle** is a fundamental rule used to guide architectural decisions.

---

# 282. Invariant

An **Invariant** is a condition that shall remain true within its defined Scope.

---

# 283. Prohibited Behavior

A **Prohibited Behavior** is an explicitly invalid architectural action or state.

---

# 284. Contract

A **Contract** is an explicit agreement defining expected behavior between architectural participants.

A Contract may include:

* inputs;
* outputs;
* failures;
* compatibility;
* lifecycle;
* invariants.

---

# 285. Public Contract

A **Public Contract** is a supported contract exposed outside its owning internal implementation boundary.

---

# 286. Internal Contract

An **Internal Contract** governs interaction between internal architectural participants.

---

# 287. Compatibility

**Compatibility** is the ability of independently versioned participants or artifacts to interact according to their declared contracts.

---

# 288. Backward Compatibility

**Backward Compatibility** is the ability of a newer participant or Version to support defined older contracts or artifacts.

---

# 289. Forward Compatibility

**Forward Compatibility** is the ability of an older participant or reader to tolerate or interoperate with defined newer artifacts or extensions.

---

# 290. Breaking Change

A **Breaking Change** invalidates a previously supported contract or assumption.

---

# 291. Compatible Extension

A **Compatible Extension** adds behavior without invalidating existing supported contracts.

---

# 292. Canonical Term Relationships

The following distinctions are mandatory.

---

# 293. Knowledge Object Versus Document

A Knowledge Object is a broader Domain entity.

A Document is one structured knowledge representation.

They are not automatically synonymous.

---

# 294. UDM Versus DPM

UDM governs semantic and structural representation.

DPM governs presentation and layout representation.

---

# 295. Source of Truth Versus Local Replica

The Source of Truth is authoritative.

A Local Replica supports local operation and synchronization.

---

# 296. Local Replica Versus Cache

A Local Replica participates in managed state continuity.

A Cache is disposable optimization state.

---

# 297. Engine Versus Provider

An Engine owns a Platform capability.

A Provider supplies an external or replaceable implementation capability through Integration.

---

# 298. Engine Versus Kernel Service

An Engine owns a major product capability.

A Kernel Service provides shared foundational infrastructure.

---

# 299. Provider Versus External Service

A Provider is the governed KnowledgeOS-side capability abstraction or implementation.

An External Service is the system outside KnowledgeOS.

---

# 300. Plugin Versus Internal Module

A Plugin is an independently developed governed extension.

An internal module is part of the KnowledgeOS implementation.

---

# 301. Command Versus Event

A Command requests action.

An Event reports that something occurred.

---

# 302. Query Versus Command

A Query requests information.

A Command requests action that may change state or cause effects.

---

# 303. Job Versus Workflow

A Job represents one executable Unit of asynchronous work.

A Workflow coordinates multiple Steps or operations.

---

# 304. Job Versus Attempt

A Job represents logical execution intention.

An Attempt represents one concrete execution.

---

# 305. Operation Versus Attempt

An Operation may span multiple Attempts.

An Attempt is one concrete execution occurrence.

---

# 306. Retry Versus Resume

Retry starts a new Attempt after failure.

Resume continues suspended logical work, normally through a new Attempt using valid continuation state.

---

# 307. Timeout Versus Cancellation

Timeout limits waiting or execution according to time policy.

Cancellation expresses intent to stop work.

Neither automatically proves external effects did not occur.

---

# 308. Deduplication Versus Idempotency

Deduplication suppresses equivalent duplicate work.

Idempotency protects against unintended repeated effects.

---

# 309. Rollback Versus Compensation

Rollback reverses work within a reversible transactional boundary.

Compensation performs a semantic counteraction after an effect may already be committed.

---

# 310. Checkpoint Versus Completion

A Checkpoint records resumable progress.

Completion records successful terminal outcome.

---

# 311. Failure Versus Unknown Outcome

Failure indicates the operation did not satisfy its contract.

Unknown Outcome means the system cannot determine whether the effect occurred.

---

# 312. Authentication Versus Authorization

Authentication establishes identity.

Authorization determines permitted action.

---

# 313. Identity Versus Address

Identity defines what an entity is.

Address defines where it can currently be reached.

---

# 314. Identity Versus Path

Identity remains logically stable.

A Path may change.

---

# 315. Canonical State Versus Derived State

Canonical State is authoritative.

Derived State can normally be reconstructed from authoritative inputs.

---

# 316. Architecture Versus Implementation

Architecture defines approved structures, responsibilities and constraints.

Implementation realizes those contracts.

Existing implementation does not automatically redefine architecture.

---

# 317. Architecture View Versus Normative Architecture

A View represents architecture.

It does not independently create architectural truth.

---

# 318. Backlog Versus Approved Architecture

A Backlog item records unresolved work.

It is not an approved architectural requirement.

---

# 319. Deprecated Versus Superseded

Deprecated means still temporarily relevant but discouraged.

Superseded means replaced by another approved artifact or decision.

---

# 320. Canonical Abbreviations

The following abbreviations are canonical:

| Abbreviation | Meaning                           |
| ------------ | --------------------------------- |
| AI           | Artificial Intelligence           |
| ADR          | Architecture Decision Record      |
| API          | Application Programming Interface |
| C4           | C4 Architecture Model             |
| DI           | Dependency Injection              |
| DPM          | Document Presentation Model       |
| MCP          | Model Context Protocol            |
| NAS          | Network Attached Storage          |
| OCR          | Optical Character Recognition     |
| REST         | Representational State Transfer   |
| SDK          | Software Development Kit          |
| UDM          | Universal Document Model          |
| UML          | Unified Modeling Language         |

---

# 321. Deprecated Terminology

Deprecated terminology shall be recorded when terminology changes would otherwise create ambiguity.

No canonical V3 term shall be silently replaced by an informal synonym.

---

# 322. Future Terms

New terms shall be added only when:

* the concept is architecturally significant;
* existing vocabulary does not already cover it;
* its relationship to existing terms is clear.

---

# 323. Vocabulary Review

Vocabulary review shall occur:

* before Architecture Freeze;
* after major architectural decisions;
* when contradictions arise;
* when new architecture blocks are introduced.

---

# 324. Vocabulary Validation

Architecture review should detect:

* conflicting definitions;
* inconsistent capitalization;
* duplicate acronyms;
* synonym drift;
* layer confusion;
* obsolete terms.

---

# 325. Vocabulary Invariants

The following invariants apply.

* One architectural concept has one canonical meaning.
* Canonical terms are not silently redefined.
* UDM and DPM remain distinct.
* Identity remains distinct from path and location.
* Source of Truth remains distinct from Local Replica and Cache.
* Engine remains distinct from Provider.
* Provider remains distinct from External Service.
* Plugin remains distinct from internal module.
* Kernel Service remains distinct from Platform Engine.
* Command, Query and Event remain semantically distinct.
* Job remains distinct from Workflow and Attempt.
* Operation remains distinct from Attempt.
* Retry remains distinct from Resume.
* Timeout remains distinct from Cancellation.
* Deduplication remains distinct from Idempotency.
* Rollback remains distinct from Compensation.
* Checkpoint remains distinct from Completion.
* Authentication remains distinct from Authorization.
* Canonical State remains distinct from Derived State.
* Architecture View remains distinct from normative Architecture.
* Architecture Backlog remains distinct from approved Architecture.
* Deprecated remains distinct from Superseded.
* Acronyms remain unique within the architecture.
* Canonical terminology evolves only through Governance.

---

# 326. Prohibited Behaviors

KnowledgeOS shall never:

* use one canonical term with incompatible meanings across architecture layers;
* redefine UDM as a presentation model;
* redefine DPM as canonical semantic content;
* treat a file path as permanent Domain Identity;
* treat a Cache as the Source of Truth;
* treat a Local Replica as disposable Cache without explicit architecture;
* treat an Engine and Provider as interchangeable;
* treat an External Service as the same architectural concept as a Provider;
* treat a Plugin as unrestricted internal code;
* treat a Command as an Event;
* treat an Event as an instruction merely because a Consumer reacts to it;
* treat a Query as a state-changing Command;
* treat a Workflow as one opaque Job when orchestration semantics matter;
* reuse Job Identity as Attempt Identity;
* treat a Retry as continuation of the same Attempt;
* treat Timeout as proof that an external effect did not occur;
* treat Cancellation Request as proof that execution stopped;
* treat Deduplication as sufficient Idempotency;
* treat Compensation as transaction rollback;
* treat a Checkpoint as successful completion;
* treat an Unknown Outcome as confirmed failure;
* treat Authentication as sufficient Authorization;
* treat an Architecture View as independent architectural truth;
* treat Backlog content as approved architecture;
* reuse a canonical acronym for another concept;
* introduce informal synonyms that obscure architectural boundaries.

---

# 327. Related Documents

## Foundation

* `../01-Foundation/ArchitectureConstraints.md`
* `../01-Foundation/ArchitectureModel.md`
* `../01-Foundation/ArchitecturePrinciples.md`
* `../01-Foundation/ProductVision.md`
* `../01-Foundation/QualityAttributes.md`

## Domain

* `../02-Domain/README.md`
* `../02-Domain/DomainModel.md`
* `../02-Domain/EngineResponsibilities.md`
* `../02-Domain/KnowledgeObject/README.md`
* `../02-Domain/UDM/README.md`
* `../02-Domain/DPM/README.md`

## Kernel

* `../03-Kernel/KernelArchitecture.md`

## Platform

* `../04-Platform/README.md`

## Integration

* `../05-Integration/README.md`

## Execution

* `../06-Execution/README.md`

## Architecture Views

* `../07-ArchitectureViews/README.md`

## Governance

* `README.md`
* `ArchitectureBacklog.md`
* `ArchitectureDecisionMatrix.md`
* `ArchitectureReview-v3.0.md`
* `ArchitectureV3MigrationPlan.md`
* `DocumentationStandards.md`

---

# 328. Status

**Approved**

This document defines the canonical architectural vocabulary of KnowledgeOS Architecture Version 3.

Canonical terminology preserves architectural meaning across Foundation, Domain, Kernel, Platform, Integration, Execution, Architecture Views and Governance.

Knowledge Object, Document, UDM and DPM remain distinct concepts.

UDM represents semantic and structural document meaning.

DPM represents presentation and layout meaning.

Identity remains distinct from identifier, path, address and storage location.

The NAS is the configured Library Source of Truth within the primary KnowledgeOS architecture.

Source of Truth, Local Replica and Cache remain distinct.

Platform Engines own major product capabilities.

Kernel Services provide shared foundational infrastructure.

Providers supply capabilities behind governed Integration contracts.

External Services remain outside the KnowledgeOS architectural boundary.

Plugins are independently developed governed extensions rather than unrestricted internal modules.

Commands express intent.

Queries request information.

Events represent facts.

Jobs represent executable Units of asynchronous work.

Workflows coordinate multiple Steps or operations.

Job Identity remains distinct from Attempt Identity.

Retries create new Attempts.

Timeout does not prove an external effect did not occur.

Cancellation Request does not prove execution stopped.

Deduplication and Idempotency remain distinct.

Rollback and Compensation remain distinct.

Checkpoints represent resumable progress rather than completion.

Canonical State remains distinct from Derived State.

Architecture Views represent normative architecture but do not independently create architectural truth.

Architecture Backlog items are unresolved work and are not approved architecture.

Canonical terms and acronyms evolve only through Architecture Governance.

KnowledgeOS therefore uses a controlled architectural vocabulary to prevent semantic drift, preserve boundaries and ensure that every architectural document describes the same system using the same conceptual language.

---

# 999. Corrected Library Authority Vocabulary

## Master Library

The complete NAS-hosted collection managed by KnowledgeOS Server, authoritative for the Master Catalog, source publications and master-source metadata.

## Master Catalog

The complete browsable catalog exposed by KnowledgeOS Server. A catalog entry may be visible on a device without the publication payload being present locally.

## Selective Local Library

A device-specific Library containing only publications acquired for that device. It is not a replica of the NAS Master Library.

## Publication Acquisition

The one-way governed operation by which a client obtains a selected publication from KnowledgeOS Server and materializes it in a Selective Local Library.

## Personal State

User-specific state such as annotations, reading progress, personal tags, favorites, personal relationships, personal metadata and preferences.

## Personal State Synchronization

Cross-device convergence of Personal State among approved Apple devices through the Sync Engine and the iCloud/CloudKit Provider profile.

## NAS Master Library Authority

Authority over Master Catalog entries, source publications and master-source metadata. It does not include Personal State.
