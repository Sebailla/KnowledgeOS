# Annotation Engine

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** AnnotationEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define user-owned annotations, highlights, bookmarks, notes, drawings and stable attachment behavior.

## 2. Scope

Covers Personal Knowledge annotation semantics and workflows across Local Libraries.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Annotation Engine owns:

- annotation creation and editing;
- highlights;
- bookmarks;
- sticky notes;
- Apple Pencil drawings;
- anchor attachment;
- orphan handling;
- annotation versions;
- annotation conflict behavior;
- annotation export contracts.

Annotations are Personal Knowledge. They SHALL NOT be stored in the NAS Master Library.

## 5. Conceptual Model

```text
AnnotationEngine
├── AnnotationService
├── HighlightService
├── BookmarkService
├── DrawingService
├── AnchorResolver
├── AnnotationRepository contracts
└── Annotation events
```

## 6. Normative Requirements

**ANNOTATIONENGI-R001** — Every annotation MUST have an immutable Personal Knowledge identity.

**ANNOTATIONENGI-R002** — Annotations MUST attach through stable anchors.

**ANNOTATIONENGI-R003** — Annotation changes MUST create version history when synchronization requires it.

**ANNOTATIONENGI-R004** — Annotations MUST commit locally before synchronization.

**ANNOTATIONENGI-R005** — Annotation Engine MUST not write annotations to the Master Library.

**ANNOTATIONENGI-R006** — Orphaned annotations MUST remain recoverable.

**ANNOTATIONENGI-R007** — Re-anchoring MUST preserve original selector and resolution history.

**ANNOTATIONENGI-R008** — Conflicts MUST preserve competing versions until merge.

**ANNOTATIONENGI-R009** — Drawings and binary attachments MUST use Personal asset identities.

**ANNOTATIONENGI-R010** — Deletion MUST use tombstones when convergence requires it.

**ANNOTATIONENGI-R011** — Annotation exports MUST preserve ownership and provenance.

## 7. Invariants

**ANNOTATIONENGI-I001** — Annotations are user-owned.

**ANNOTATIONENGI-I002** — Canonical publication content is unchanged.

**ANNOTATIONENGI-I003** — Anchor history is preserved.

**ANNOTATIONENGI-I004** — Offline creation is supported.

**ANNOTATIONENGI-I005** — Synchronization provider does not own annotations.

**ANNOTATIONENGI-I006** — Conflict resolution is auditable.

## 8. Commands, Queries, Events and Workflows

Commands include `CreateAnnotation`, `UpdateAnnotation`, `DeleteAnnotation`, `CreateHighlight`, `AttachDrawing` and `ResolveAnnotationAnchor`.

Queries include `ListAnnotationsForPublication`, `GetAnnotation`, `FindOrphanedAnnotations` and `GetAnnotationHistory`.

Events include `AnnotationCreated`, `AnnotationModified`, `AnnotationDeleted`, `AnnotationOrphaned` and `AnnotationReanchored`.

Sync Engine consumes committed Personal Knowledge changes.

## 9. Failure, Recovery and Degradation

Anchor resolution failure SHALL preserve annotation content and mark it orphaned. Synchronization conflict SHALL preserve both versions and expose merge operations.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

A highlight created on iPad attaches to a UDM text-range anchor, syncs through iCloud and resolves against the same acquired publication on Mac. The NAS never receives it.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../README.md`
- `../../02-Domain/UDM/Nodes/AnnotationNodes.md`
- `../../02-Domain/UDM/Nodes/Anchors.md`
- `../Sync/README.md`
- `../Library/README.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
