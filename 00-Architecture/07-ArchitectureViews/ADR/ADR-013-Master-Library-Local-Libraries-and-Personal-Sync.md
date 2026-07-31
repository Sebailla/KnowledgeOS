
# ADR-013 — Master Library, Selective Local Libraries and Personal Sync

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views

**Document:** ADR-013 — Master Library, Selective Local Libraries and Personal Sync

**Version:** 3.1

**Status:** Accepted

**Author:** KnowledgeOS Team

---

# 1. Context

KnowledgeOS distinguishes canonical publication custody from personal knowledge management.

The platform intentionally separates:

- the authoritative repository of publications;
- the publications available on each client device;
- the personal knowledge generated while reading.

The NAS hosts the complete Master Library through the KnowledgeOS Server.

Each Apple device maintains only a selective Local Library.

Personal knowledge is synchronized independently among Apple devices and is never written back to the Master Library.

This separation minimizes synchronization complexity, preserves user privacy and allows every device to operate independently while maintaining a single authoritative publication repository.

---

# 2. Decision

KnowledgeOS adopts three independent architectural scopes.

1. Master Library
2. Selective Local Libraries
3. Personal State Synchronization

Each scope has different responsibilities, ownership and lifecycle.

---

# 3. Master Library

The Master Library is hosted by the KnowledgeOS Server running on the NAS.

It represents the canonical publication repository of the entire KnowledgeOS ecosystem.

The Master Library manages:

- the complete publication catalog;
- source publications;
- original publication files;
- master metadata;
- publication versions;
- publication availability;
- publication acquisition;
- catalog search;
- publication delivery.

The Master Library is the Source of Truth for every publication managed by KnowledgeOS.

The Master Library is intentionally unaware of user-specific reading activity.

Therefore it never stores:

- annotations;
- highlights;
- bookmarks;
- reading progress;
- personal collections;
- favorites;
- personal tags;
- personal relationships;
- AI conversations;
- AI summaries;
- flashcards;
- Apple Pencil drawings;
- sticky notes;
- any other personal knowledge created by users.

The Master Library is not a synchronization endpoint.

---

# 4. Selective Local Libraries

Each macOS, iPhone and iPad client owns one Local Library.

A Local Library is an autonomous working copy containing only the publications required by that device.

A Local Library:

- contains only selected publications;
- operates completely offline;
- stores publication payloads;
- stores local metadata;
- stores derived assets;
- stores thumbnails;
- stores OCR;
- stores AI indexes;
- stores search indexes;
- stores embeddings;
- stores personal knowledge;
- stores application state.

A Local Library is never considered a replica of the Master Library.

Its content is intentionally selective.

Different devices may legitimately contain different publications.

---

# 5. Local Library Creation

A Local Library is created independently from the Master Library.

During first execution the client scans user-authorized locations on the device.

The scan discovers supported publications already available locally.

For every discovered publication the client:

- validates the file;
- extracts metadata;
- calculates checksums;
- generates local identities;
- creates Knowledge Objects;
- creates search indexes;
- generates thumbnails;
- generates previews;
- performs OCR when required;
- registers provenance.

The resulting Local Library becomes immediately usable.

This process does not require access to the NAS.

---

# 6. Publication Acquisition

The Master Library is consulted only when the user explicitly requests publications not already available locally.

Publication acquisition follows this workflow:

```text
Browse Master Catalog

↓

Select Publication

↓

Acquire Publication

↓

Validate

↓

Create Local Knowledge Object

↓

Register in Local Library

↓

Available Offline
```

Publication acquisition is an explicit operation initiated by the user.

Acquisition is not synchronization.

---

# 7. Personal Knowledge

Personal Knowledge represents everything created by the user while interacting with publications.

Examples include:

- annotations;
- highlights;
- bookmarks;
- sticky notes;
- Apple Pencil drawings;
- reading progress;
- reading history;
- favorites;
- personal collections;
- tags;
- relationships;
- AI conversations;
- AI summaries;
- generated flashcards;
- user preferences.

Personal Knowledge belongs exclusively to the user.

It never becomes part of the Master Library.

---

# 8. Personal State Synchronization

Personal Knowledge synchronizes exclusively among Apple devices using the approved iCloud / CloudKit profile.

Synchronization may include:

- annotations;
- reading progress;
- bookmarks;
- favorites;
- tags;
- collections;
- relationships;
- preferences;
- AI-generated personal artifacts;
- application state.

Publication files are not synchronized through this mechanism.

Only Personal Knowledge is synchronized.

---

# 9. Personal Synchronization Flow

```text
User Interaction

↓

Personal Knowledge

↓

iCloud / CloudKit

↓

Other Local Libraries
```

The Master Library is never part of this synchronization flow.

---

# 10. Authority Model

Authority is scoped rather than global.

| Scope                    | Authority          |
| ------------------------ | ------------------ |
| Master Catalog           | KnowledgeOS Server |
| Source Publications      | KnowledgeOS Server |
| Master Metadata          | KnowledgeOS Server |
| Publication Delivery     | KnowledgeOS Server |
| Device Local Library     | Local Device       |
| Personal Knowledge       | User               |
| Personal Synchronization | Sync Engine        |
| Cache                    | Rebuildable        |
| Derived Assets           | Rebuildable        |
| OCR                      | Rebuildable        |
| Embeddings               | Rebuildable        |
| Search Indexes           | Rebuildable        |

---

# 11. Architectural Rules

The following rules are mandatory.

1. The Master Library shall never receive Personal Knowledge.
2. Local Libraries shall never be treated as replicas.
3. Publication acquisition shall always be explicit.
4. Synchronization shall never acquire publications.
5. Acquisition shall never synchronize Personal Knowledge.
6. Every Local Library shall remain independently usable.
7. Devices may intentionally contain different publications.
8. Personal Knowledge shall survive publication updates.
9. Rebuildable artifacts shall never be considered canonical.
10. The Master Library shall remain completely independent from iCloud synchronization.

---

# 12. Consequences

This architecture provides:

- complete offline operation;
- minimal synchronization complexity;
- high privacy;
- independent device libraries;
- deterministic publication ownership;
- clear separation between acquisition and synchronization;
- scalable publication management;
- simple recovery procedures;
- reduced synchronization conflicts.

---

# 13. Superseded Interpretation

This ADR supersedes any previous interpretation of:

- ADR-004
- ADR-008
- ADR-009

that implied:

- device libraries are replicas of the Master Library;
- the Master Library participates in Personal Knowledge synchronization;
- publication acquisition and synchronization are equivalent operations.

Those ADRs remain valid except where explicitly amended by this document.

---

# 14. Status

**Accepted**

This ADR is normative for KnowledgeOS Architecture V3.

Any future architectural decision concerning libraries, acquisition, synchronization or personal knowledge shall comply with this ADR.
