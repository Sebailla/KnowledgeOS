# Architecture V4 Migration Plan

**Project:** KnowledgeOS  
**Section:** Governance  
**Document:** ArchitectureV4MigrationPlan  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define migration from earlier documentation and implementation assumptions to Architecture V4.

## 2. Principles

Preserve user data, stable identity and provenance; separate Master, Local and Personal scopes; avoid implicit replication; migrate incrementally; make steps restartable; retain rollback evidence.

## 3. Documentation Migration

1. Remove single-library and Working Copy terminology.
2. Align all documents with ADR-013.
3. Update UDM and DPM contracts.
4. Update Engine ownership.
5. Update Integration and Execution guarantees.
6. Update diagrams and ADR references.
7. Validate links and freeze V4.

## 4. Implementation Migration

### Phase 1 — Identity and Authority

Introduce explicit Master, Local, Personal and version identities.

### Phase 2 — Library Separation

Separate Master Catalog, Master source storage, Local membership, local storage and local derived artifacts.

### Phase 3 — Acquisition

Implement explicit acquisition workflows.

### Phase 4 — Personal Synchronization

Move annotations, notes, progress and personal relationships to the approved synchronization profile.

### Phase 5 — Rebuildable Projections

Regenerate search indexes, graph projections, embeddings and previews from authoritative inputs.

## 5. Safety

Migration SHALL snapshot existing state, verify checksums, retain journals, preserve old identifiers as aliases when needed, avoid destructive conversion before verification, support resume and provide rollback guidance.

## 6. Completion Criteria

No client treats Master as a replica peer; Personal Knowledge is absent from NAS Master storage; acquisition and synchronization are distinct; identity and provenance validate; derived artifacts rebuild successfully.
