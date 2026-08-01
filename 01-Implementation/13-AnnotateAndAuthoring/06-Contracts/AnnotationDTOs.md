# Annotation Dtos

**Project:** KnowledgeOS  
**Section:** Implementation / Annotate and Authoring / 06-Contracts  
**Document:** AnnotationDTOs  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** macOS, iPhone, iPad, Web  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the annotation dtos for Annotate and Authoring, covering commands, queries, events, DTOs and compatibility.

## 2. Module Boundary

This module implements creation, editing, attachment, organization, persistence and synchronization of Personal Knowledge associated with publications and concepts.

Included:

- highlights;
- notes and comments;
- bookmarks;
- sticky notes;
- tags and collections;
- digital ink and drawings;
- Apple Pencil integration;
- attachments and personal assets;
- stable UDM, DPM and hybrid anchors;
- version history;
- conflicts and merge;
- offline-first authoring;
- desktop, mobile and optional web integration.

Excluded:

- modification of publication source bytes;
- mutation of canonical UDM or DPM;
- Master Library metadata authority;
- publication acquisition;
- canonical knowledge processing;
- search-index ownership;
- AI provider policy.

## 3. Architectural Context

```text
Immutable Publication + UDM + DPM
              │
              ▼
         Stable Anchors
              │
              ▼
       Personal Knowledge
├── Annotation Versions
├── Notes and Highlights
├── Ink and Attachments
├── Collections and Tags
└── Conflict Branches
              │
              ▼
      Personal Sync Engine
```

The publication remains unchanged. Annotation data is a separate user-owned layer.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- Publications, UDM and DPM SHALL remain immutable.
- Annotations, highlights, notes, comments, bookmarks, tags, collections, drawings and attachments SHALL belong to Personal Knowledge.
- Personal Knowledge SHALL NOT be written to the NAS Master Library.
- Every annotation SHALL have a stable identity, version, provenance and lifecycle state.
- Every attached annotation SHALL use one or more stable anchors.
- Anchor resolution SHALL preserve the original selector and resolution history.
- Orphaned annotations SHALL remain recoverable.
- Compatible publication reprocessing SHOULD preserve annotation attachment.
- Conflicts SHALL preserve competing versions until an explicit merge.
- Deletion SHALL use tombstones when synchronization convergence requires them.
- Annotation changes SHALL commit locally before synchronization.
- Publication acquisition and Personal Knowledge synchronization SHALL remain separate.
- UI SHALL use public Annotation contracts and SHALL NOT access stores directly.
- Failure SHALL preserve committed Personal Knowledge and anchor history.
- Contracts SHALL be immutable and versioned.
- Retryable mutations SHALL use idempotency.
- Events SHALL follow committed state.
- DTOs SHALL not expose database rows, CloudKit records or UI framework types.

## 6. Annotation Model

Every annotation SHOULD include:

- annotation identity;
- annotation type;
- owner scope;
- target anchors;
- body or asset references;
- created and modified times;
- version identity;
- parent versions;
- provenance;
- lifecycle state;
- synchronization state;
- privacy classification;
- extension data.

Annotation types SHALL remain extensible through namespaced contracts without overriding core semantics.

## 7. Anchor Model

Supported anchor categories include:

| Anchor | Primary Use | Authority |
|---|---|---|
| UDM text range | highlights and textual notes | semantic |
| UDM node | section, figure, claim or concept | semantic |
| DPM region | visual annotation on fixed layout | presentation |
| Hybrid | semantic intent plus spatial fallback | combined |
| External | resource outside managed publication | external |

Anchor resolution SHALL return resolved, ambiguous, orphaned, migrated or unavailable status.

## 8. Offline and Synchronization

Authoring SHALL commit locally first.

```text
Edit Personal Knowledge
→ Validate
→ Commit Local Version
→ Publish Local Event
→ Queue Sync Envelope
→ Provider Transport
→ Detect Conflict
→ Merge or Converge
```

The NAS Master Library is not a synchronization peer.

## 9. Conflict and Merge

Conflicts MAY occur in annotation body, anchor, metadata, assets, collections or deletion state.

Merge SHALL preserve:

- competing versions;
- parent lineage;
- actor and device provenance;
- anchor history;
- attachment identities;
- deletion/tombstone semantics.

Automatic merge SHALL only apply to fields with deterministic conflict rules.

## 10. Failure and Recovery

The module SHALL handle:

- missing or changed target publication;
- unresolved anchor;
- incompatible persisted version;
- corrupt personal asset;
- provider outage;
- synchronization conflict;
- unknown remote commit state;
- interrupted drawing save;
- insufficient local storage;
- process or device restart.

Recovery SHALL preserve committed Personal Knowledge and expose orphaned or conflicted items for repair.

## 11. Security and Privacy

- Personal Knowledge is user-owned.
- Personal Knowledge SHALL not be written to Master Library storage.
- Sync providers SHALL receive only approved Personal Knowledge envelopes.
- Logs SHALL not include note text, highlights, ink payloads, attachments or credentials.
- Personal assets SHALL use protected local storage.
- Web access SHALL enforce user and resource authorization.
- Export of annotations SHALL be explicit.
- Remote AI use over annotations requires separate authorization.

## 12. Performance and Accessibility

The implementation SHOULD:

- support large annotation collections through paging and indexing;
- stream ink and attachments;
- bound memory use;
- debounce draft persistence without losing committed edits;
- render annotation overlays incrementally;
- preserve keyboard and VoiceOver access on macOS;
- support Dynamic Type, VoiceOver and Apple Pencil on mobile;
- expose accessible annotation markers and conflict states.

## 13. Verification and Acceptance

- Publications, UDM and DPM remain unchanged.
- Highlights survive compatible reprocessing.
- Orphaned annotations remain recoverable.
- Offline annotation editing works.
- Conflicts preserve all branches.
- Merge creates a new version with parent lineage.
- Ink and attachments use personal asset identities.
- Personal Knowledge never enters Master Library persistence.
- CloudKit mapping does not leak into public contracts.
- Deletion converges through tombstones.
- Accessibility and performance tests pass.
- Architecture traceability is complete.

## 14. Traceability

- `00-Architecture/04-Platform/Annotation/README.md`
- `00-Architecture/04-Platform/Sync/README.md`
- `00-Architecture/02-Domain/UDM/Nodes/Anchors.md`
- `00-Architecture/02-Domain/UDM/Nodes/AnnotationNodes.md`
- `00-Architecture/02-Domain/KnowledgeObject/Assets.md`
- `00-Architecture/03-Kernel/WorkflowEngine.md`
- `00-Architecture/05-Integration/Providers/SyncProviders.md`
- `01-Implementation/07-LocalReadingFoundation/README.md`
- `01-Implementation/03-MobileApplication/README.md`
- `01-Implementation/02-DesktopApplication/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 15. Compatibility and Migration

Annotation schemas, anchor formats, personal assets, synchronization envelopes and public contracts SHALL be versioned.

Breaking changes require migration that preserves identity, ownership, provenance, anchors and conflict history.

## 16. Status

This document is part of the KnowledgeOS Annotate and Authoring V4 implementation baseline.
