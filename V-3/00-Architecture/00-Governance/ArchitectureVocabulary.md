# Architecture Vocabulary

**Project:** KnowledgeOS

**Section:** Governance

**Document:** Architecture Vocabulary

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the official architectural vocabulary of KnowledgeOS.

Its objectives are:

* establish a ubiquitous language;
* eliminate ambiguity;
* ensure consistency across documentation;
* provide a stable terminology for implementation.

Every architectural document shall use these definitions.

No document may redefine any concept defined here.

---

# 2. Scope

This vocabulary applies to:

* Architecture
* ADR
* Specifications
* C4
* UML
* Public APIs
* Engine documentation
* Source code
* Technical discussions

---

# 3. Vocabulary Rules

Every concept:

* has exactly one official name;
* has exactly one official definition;
* belongs to a single architectural context;
* remains stable across versions.

Synonyms are forbidden.

---

# 4. Core Domain

## Knowledge Object

The primary domain entity managed by KnowledgeOS.

A Knowledge Object represents a single logical unit of knowledge independently of its physical origin.

A Knowledge Object may originate from:

* PDF
* EPUB
* DOCX
* Markdown
* HTML
* CHM
* Image (OCR)
* Plain text
* Future formats

A Knowledge Object contains:

* identity;
* metadata;
* UDM;
* assets;
* annotations;
* provenance;
* history.

---

## Knowledge Library

The complete collection of Knowledge Objects managed by a user.

A Library is a domain concept.

It is not a directory.

It is not a database.

---

## Collection

A logical grouping of Knowledge Objects.

Collections never own Knowledge Objects.

---

## Workspace

A temporary working context that groups Knowledge Objects, Collections and user state.

---

# 5. Universal Document Model

## Universal Document Model (UDM)

The canonical representation of the structured content contained within a Knowledge Object.

The UDM is independent of:

* storage;
* rendering;
* synchronization;
* physical source.

---

## Node

The smallest structural element of the UDM.

Every Node has:

* NodeID;
* NodeType;
* parent;
* attributes.

---

## Block Node

A node representing block-level content.

Examples:

* Paragraph
* Heading
* Table
* Figure
* Code Block

---

## Inline Node

A node representing inline content.

Examples:

* Text
* Link
* Emphasis
* Inline Code

---

## Anchor

A persistent reference to one or more Nodes.

Anchors provide stable targets for annotations.

---

# 6. Identity

## KnowledgeObjectID

Globally unique identifier assigned to a Knowledge Object.

The identifier never changes.

---

## NodeID

Unique identifier assigned to a Node.

---

## AssetID

Unique identifier assigned to an Asset.

---

## WorkflowID

Unique identifier assigned to a Workflow execution.

---

## PluginID

Unique identifier assigned to a Plugin.

---

## EntityID

Unique identifier assigned to a semantic entity.

---

# 7. Storage

## Object Repository

Repository responsible for storing Knowledge Objects.

---

## Asset Repository

Repository responsible for storing binary resources.

---

## Journal Repository

Repository responsible for recording persistent operations.

---

## Index Repository

Repository responsible for storing rebuildable indexes.

---

## Configuration Repository

Repository responsible for storing application configuration.

---

## Backup Repository

Repository responsible for storing recovery snapshots.

---

## Working Copy

Local copy of a Library used by a device.

All user operations occur on the Working Copy.

---

## Source of Truth

The authoritative Library copy.

Initially implemented using the user's NAS.

---

# 8. Kernel

## Kernel

The infrastructure layer shared by all Engines.

The Kernel contains no business logic.

---

## Command Bus

Infrastructure component responsible for dispatching Commands.

---

## Query Bus

Infrastructure component responsible for dispatching Queries.

---

## Event Bus

Infrastructure component responsible for publishing Events.

---

## Workflow Engine

Kernel component responsible for orchestrating long-running processes.

---

## Scheduler

Kernel component responsible for deferred execution.

---

# 9. Engine

## Engine

A functional module responsible for one architectural capability.

Every Engine:

* has a single primary responsibility;
* exposes public contracts;
* encapsulates its implementation.

---

## Library Engine

Manages the Library.

---

## Import Engine

Transforms physical sources into Knowledge Objects.

---

## Render Engine

Transforms the UDM into visual representations.

---

## Search Engine

Retrieves information from the Library.

---

## Annotation Engine

Manages annotations.

---

## Knowledge Engine

Builds and maintains the Knowledge Graph.

---

## AI Engine

Provides artificial intelligence capabilities.

---

## Sync Engine

Synchronizes Working Copies with the Source of Truth.

---

## Export Engine

Generates external representations.

---

## Plugin Engine

Manages Plugins.

---

# 10. Artificial Intelligence

## Provider

A software component implementing one AI capability.

Providers are replaceable.

---

## Provider Manager

Component responsible for selecting and managing Providers.

---

## Embedding

A vector representation of content.

---

## Prompt

A structured instruction executed by an AI Provider.

---

## Context

The information supplied to a model before execution.

---

# 11. Architecture

## Command

A request expressing an intention to change system state.

---

## Query

A request for information that does not modify state.

---

## Event

An immutable record describing something that has already happened.

Events are always expressed in the past tense.

---

## Workflow

An orchestrated sequence of steps executed by the Workflow Engine.

---

## Contract

A public interface between architectural components.

---

## Public API

The externally supported interface of an Engine.

---

## Plugin

A deployable extension that interacts with KnowledgeOS exclusively through public contracts.

---

# 12. Graph

## Knowledge Graph

A graph derived from Knowledge Objects.

The Knowledge Graph is not the Source of Truth.

It is a derived representation.

---

## Entity

A semantic object extracted from one or more Knowledge Objects.

---

## Relationship

A semantic connection between two entities.

---

## Ontology

The formal definition of concepts and relationships used by the Knowledge Graph.

---

# 13. Forbidden Terminology

The following terms shall not be used as architectural concepts.

| Forbidden           | Official Term                                                                       |
| ------------------- | ----------------------------------------------------------------------------------- |
| Document            | Knowledge Object*(except when referring to a physical source or a document type)* |
| Document Repository | Object Repository                                                                   |
| Internal Model      | Universal Document Model                                                            |
| File Library        | Knowledge Library                                                                   |
| Document ID         | KnowledgeObjectID                                                                   |
| Document Lifecycle  | Knowledge Object Lifecycle                                                          |
| Record              | Knowledge Object                                                                    |
| Folder Structure    | Repository Structure                                                                |
| AI Model Manager    | Provider Manager                                                                    |

---

# 14. Abbreviations

| Abbreviation | Meaning                                  |
| ------------ | ---------------------------------------- |
| UDM          | Universal Document Model                 |
| ADR          | Architecture Decision Record             |
| API          | Application Programming Interface        |
| OCR          | Optical Character Recognition            |
| SDK          | Software Development Kit                 |
| NAS          | Network Attached Storage                 |
| CQRS         | Command Query Responsibility Segregation |

---

# 15. Governance

Every new architectural concept must be introduced through:

1. an approved ADR;
2. an update to this vocabulary.

No concept becomes official until it is defined here.

---

# 16. Related Documents

* README.md
* DocumentationStandards.md
* ArchitectureDecisionMatrix.md
* ProductVision.md
* ArchitectureModel.md

---

# 17. Status

**Approved**

This document defines the official ubiquitous language of KnowledgeOS.

Every architectural artifact, specification, diagram and implementation shall use this vocabulary as the single authoritative source of terminology.
