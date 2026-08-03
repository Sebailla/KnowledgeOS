# @knowledgeos/library

Application and Platform Library use cases for the first KnowledgeOS vertical slice.

## Implements

- local source registration;
- Master Catalog browsing;
- explicit acquisition requests;
- local availability resolution;
- Local Library listing;
- committed event publication;
- in-memory repositories and catalog for tests.

## Boundaries

This package orchestrates Domain objects through public contracts. It does not own PostgreSQL, filesystem transfer, HTTP, CloudKit, rendering or UI.
