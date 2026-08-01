# Dependency Mapping

**Project:** KnowledgeOS  
**Section:** Implementation / Local Reading Foundation / 02-TechnicalDesign  
**Document:** DependencyMapping  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** macOS, iPhone, iPad  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the dependency mapping for the Local Reading Foundation module, covering technical architecture, state, dependencies and failure behavior.

## 2. Module Boundary

Local Reading Foundation implements the smallest complete capability that allows a user to open and read a publication already available in a Local Library.

Included:

- local availability resolution;
- opening a publication;
- reading sessions;
- UDM semantic flow;
- DPM source-faithful presentation;
- reflowed presentation;
- asset resolution;
- reading position;
- recent items;
- offline operation;
- native desktop and mobile integration.

Excluded:

- device scanning;
- import;
- Master Library acquisition;
- annotation creation;
- search;
- Personal Knowledge synchronization;
- export;
- AI;
- plugins.

Excluded capabilities SHALL remain behind their owning Engines and later vertical modules.

## 3. Architectural Context

```text
Local Library
    │
    ▼
Open Publication Command
    │
    ▼
Availability Resolution
    │
    ├── UDM
    ├── DPM
    ├── Assets
    └── Personal Reading State
    │
    ▼
Render Plan
    │
    ▼
Desktop or Mobile Reader
```

The NAS is not required after the selected publication is locally available.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- The module SHALL open only publications that are locally available or explicitly supported as remote-read-only.
- Reading of locally available publications SHALL work without NAS or internet connectivity.
- The module SHALL NOT acquire publications; acquisition remains owned by Library and Import workflows.
- The module SHALL NOT synchronize Personal Knowledge; synchronization remains owned by Sync Engine.
- Reading position and recent-item state SHALL be treated as Personal Knowledge or local personal state according to the approved profile.
- Reading state SHALL NOT be written to the Master Library.
- UDM SHALL provide semantic content and reading order.
- DPM SHALL provide source-faithful pages, regions and presentation mappings.
- Rendering and caches SHALL remain derived and rebuildable.
- Stable Knowledge Object, UDM, DPM and asset identities SHALL be preserved.
- UI SHALL access the module through explicit commands, queries and observable state.
- Failure SHALL preserve locally available source content and committed Personal Knowledge.

## 6. State Model

The module distinguishes:

| State | Authority |
|---|---|
| Local publication membership | Local Library |
| Source publication identity and provenance | Master or local source authority |
| UDM and DPM versions | canonical local representations |
| Reading position | Personal Knowledge / personal local state |
| Active viewport | ephemeral session |
| Render cache | derived |
| Recent items | personal local state |

State transitions SHALL preserve these boundaries.

## 7. Execution Model

Opening a publication SHOULD follow:

```text
Validate Request
→ Resolve Knowledge Object
→ Resolve Local Availability
→ Validate Source and Representations
→ Restore Reading Session
→ Build Render Plan
→ Present Reader
→ Persist Eligible Personal State
```

Long-running preparation MAY use jobs or workflows. The user SHALL receive progress and cancellation.

## 8. Failure and Recovery

The module SHALL handle:

- missing local payload;
- evicted publication;
- corrupt source;
- missing UDM or DPM;
- stale render cache;
- missing asset;
- incompatible persisted session;
- interrupted restoration;
- unavailable Master Library;
- low-memory or low-storage conditions.

Recovery SHOULD rebuild derived state, preserve Personal Knowledge and avoid reacquisition unless the user or Library workflow explicitly requests it.

## 9. Security and Privacy

- Reading state SHALL remain personal.
- File access SHALL use approved platform security scopes.
- Logs SHALL not include publication text, annotations or private paths.
- Reader diagnostics SHALL use identities and error categories.
- Remote services SHALL not receive content unless an explicit later capability authorizes them.
- Screenshots, previews and caches SHALL follow retention policy.

## 10. Performance and Accessibility

The reader SHOULD:

- open locally available publications responsively;
- stream or page large sources;
- bound memory and cache usage;
- support keyboard and VoiceOver on macOS;
- support dynamic type and VoiceOver on mobile;
- preserve semantic order;
- support reduced motion and contrast preferences;
- make loading, error and unavailable states accessible.

## 11. Verification and Acceptance

- A locally available publication opens while NAS is offline.
- No acquisition request is created implicitly.
- Reading position persists locally.
- Reading position is never sent to Master Library.
- Source-faithful and reflowed modes are distinguishable.
- Missing DPM can fall back to an approved generated presentation when UDM permits.
- Corrupt caches rebuild safely.
- Missing assets produce explicit behavior.
- Restored sessions validate identity and versions.
- Contracts, persistence and migrations pass automated tests.
- Accessibility tests pass.
- Architecture traceability is complete.

## 12. Traceability

- `00-Architecture/02-Domain/DomainModel.md`
- `00-Architecture/02-Domain/UDM/UDM.md`
- `00-Architecture/02-Domain/DPM/DPM.md`
- `00-Architecture/04-Platform/Library/README.md`
- `00-Architecture/04-Platform/Render/README.md`
- `00-Architecture/03-Kernel/README.md`
- `01-Implementation/02-DesktopApplication/README.md`
- `01-Implementation/03-MobileApplication/README.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 13. Compatibility and Migration

Persisted reading positions, sessions, recent items and cache metadata SHALL be versioned.

Breaking changes require migration or safe invalidation. Derived caches MAY be discarded; Personal Knowledge SHALL be migrated or preserved.

## 14. Status

This document is part of the KnowledgeOS Local Reading Foundation V4 implementation baseline.
