# Architecture Vocabulary

**Project:** KnowledgeOS  
**Section:** Governance  
**Document:** ArchitectureVocabulary  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define official KnowledgeOS architecture terminology.

## 2. Terms

**Master Library** — NAS-hosted authoritative catalog and publication repository managed by KnowledgeOS Server.

**Local Library** — Selective device-owned library populated through discovery, import or acquisition.

**Personal Knowledge** — User-owned annotations, notes, highlights, progress, collections and personal relationships.

**Acquisition** — Explicit transfer and registration of a publication into a Local Library.

**Synchronization** — Convergence of Personal Knowledge among approved Local Libraries.

**Knowledge Object** — Persistent aggregate coordinating identity, metadata, sources, assets, provenance, versions and canonical representations.

**UDM** — Canonical semantic representation.

**DPM** — Canonical presentation representation.

**Knowledge Graph** — Layered projection of canonical, personal, derived and external relationships.

**Engine** — Platform component owning one coherent business capability.

**Provider** — Integration adapter implementing an external capability contract.

**Derived Artifact** — Rebuildable output such as index, embedding, preview or graph projection.

## 3. Deprecated Usage

Do not use replica for Local versus Master, Working Copy for Local Library, sync for acquisition, one global Source of Truth, file as Knowledge Object, annotation as Master metadata or graph database as Knowledge Graph.
