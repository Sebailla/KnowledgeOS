# Engine Interactions

**Documentation version:** 5.6.4  
**Status:** Consolidated

## Purpose

This document defines the allowed high-level interaction model for the engines consolidated in modules 46–59. It is a navigation and dependency guide, not permission to import internal packages across boundaries.

## Canonical flow

```text
Source bytes
  → Document Engine
  → Library Engine (authoritative logical object and journal)
  → Search Engine and Knowledge Graph projections
  → Personal Knowledge contextual projection
  → AI Engine context and tools
  → Sync Engine replication between local replicas and NAS Master Library
```

## Dependency rules

1. Document parsing may create proposed Library objects but cannot commit them without Library transactions.
2. Search and Knowledge Graph are rebuildable projections; neither replaces the Library source of truth.
3. Personal Knowledge is user-owned and supplies bounded personalization, never authorization.
4. AI consumes authorized context through contracts and may propose actions only through tools.
5. Sync transports Library changes and applies remote changes through Library validation.
6. Engines exchange identifiers and provenance rather than private storage rows.

## Failure isolation

A failure in AI, semantic search, graph inference, OCR, or synchronization must not prevent local access to already committed Library content. Derived projections expose staleness and remain rebuildable.
