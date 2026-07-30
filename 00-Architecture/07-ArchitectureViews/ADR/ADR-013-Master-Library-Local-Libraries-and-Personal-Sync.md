# ADR-013 — Master Library, Selective Local Libraries and Personal Sync

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views

**Document:** ADR-013 — Master Library, Selective Local Libraries and Personal Sync

**Version:** 3.0

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

KnowledgeOS distinguishes master publication custody from personal reading and knowledge state.

The NAS must provide the complete private master catalog and source publications through a KnowledgeOS Server application. Apple devices must maintain only the publications selected for local use. Personal user state must move among Apple devices without being written back to the NAS Master Library.

# 2. Decision

KnowledgeOS adopts three distinct scopes.

## 2.1 NAS Master Library

KnowledgeOS Server runs on the NAS and manages:

* the complete Master Catalog;
* source publications and source files;
* master-source metadata;
* publication versions and availability;
* catalog browsing and publication delivery.

The NAS Master Library does not receive personal annotations, reading progress, personal tags, personal relationships, favorites or equivalent private user state.

## 2.2 Selective Device-Local Libraries

Each macOS, iPhone and iPad client maintains its own selective local Library.

A local Library:

* contains only publications acquired for that device;
* may browse the remote Master Catalog without downloading every publication;
* stores downloaded publication payloads for offline use;
* stores or materializes personal state required by that device;
* is not a replica of the NAS Master Library.

## 2.3 Personal State Synchronization

Personal user state synchronizes among Apple devices through the approved iCloud/CloudKit profile.

The synchronized scope may include:

* annotations;
* reading progress;
* personal tags;
* favorites;
* personal relationships;
* personal metadata;
* personal preferences.

Personal synchronization does not make iCloud the source of master publication files.

Publication payload download remains a separate acquisition operation from the NAS Master Library.

# 3. Authority Model

Authority is scoped, not global.

| Scope | Authority |
| --- | --- |
| Master Catalog | KnowledgeOS Server on NAS |
| Source publications | KnowledgeOS Server on NAS |
| Master-source metadata | KnowledgeOS Server on NAS |
| Device-local publication payload | Local device after acquisition |
| Unsynchronized personal changes | Originating device |
| Cross-device personal-state convergence | Sync Engine using iCloud/CloudKit profile |
| Cache and derived artifacts | No canonical authority; rebuildable |

# 4. Consequences

* The NAS must run KnowledgeOS Server rather than acting only as a shared folder.
* Catalog browsing and publication acquisition require server contracts.
* Local Library membership is device-specific unless an explicit personal preference is synchronized.
* Personal state never needs NAS availability to synchronize among Apple devices.
* A publication can be present on one device and absent on another.
* Sync and acquisition are separate architectural flows.
* The term `replica` shall not be used for the relationship between a device Library and the NAS Master Library.

# 5. Superseded Interpretation

This ADR supersedes any earlier interpretation of ADR-004, ADR-008 or ADR-009 that treated device Libraries as NAS replicas or treated the NAS as a synchronization peer for personal state.

The earlier ADRs remain active as amended by this decision.

# 6. Status

**Accepted**

This ADR is normative for KnowledgeOS Architecture V3.
