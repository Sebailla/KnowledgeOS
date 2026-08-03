# Local Persistence

**Project:** KnowledgeOS  
**Section:** Implementation / Mobile Application / 03-LocalLibrary  
**Document:** LocalPersistence  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** iPhone / iPad  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the local persistence for the KnowledgeOS native mobile applications.

## 2. Scope

This document applies to iPhone and iPad clients and their use of Local Library, Master Library acquisition, UDM, DPM, Personal Knowledge, Platform Engines, Kernel services and Apple platform integrations.

It does not redefine Domain authority, Master/Local Library separation, acquisition semantics or Personal Knowledge ownership.

## 3. Product Context

KnowledgeOS mobile clients provide selective, offline-first access to publications chosen for each device.

```text
NAS Master Library
      │ browse and explicit acquisition
      ▼
iPhone Local Library     iPad Local Library
      │                         │
      └──── Personal Knowledge Sync ────┘
                    iCloud / CloudKit
```

Each device MAY hold a different publication set. Personal Knowledge MAY converge across devices without storing that state in the NAS Master Library.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- The mobile application SHALL maintain an independent Local Library on each device.
- The application SHALL remain usable offline for locally available publications.
- The Master Library SHALL be browsed remotely and selected publications SHALL be acquired explicitly.
- Publication acquisition SHALL remain separate from Personal Knowledge synchronization.
- Personal Knowledge SHALL synchronize only among approved Local Libraries through iCloud/CloudKit.
- The mobile application SHALL NOT write annotations, highlights, reading progress, personal tags or personal relationships to the NAS Master Library.
- UI code SHALL invoke public Platform contracts and SHALL NOT access repositories directly.
- Stable Domain identity SHALL be preserved across navigation, acquisition, reading, annotation and synchronization.
- Long-running operations SHALL expose progress, cancellation and recoverable failure state.
- Local persistence SHALL preserve identity, provenance and version history.
- User-authorized scanning and document import SHALL preserve original files and integrity evidence.
- Storage pressure MAY evict rebuildable artifacts before authoritative local source payloads or Personal Knowledge.
- Acquisition retries SHALL be idempotent and resumable.

## 6. Design Guidance

Implementation SHOULD:

- use Swift concurrency with lifecycle-bound tasks;
- separate SwiftUI views from Platform services and repositories;
- adapt navigation and layout to iPhone and iPad size classes without changing Domain semantics;
- use stable identities in navigation and restoration;
- validate persisted state before restoration;
- preserve security-scoped file access where imported files require it;
- use Keychain for credentials and sensitive tokens;
- treat search indexes, render caches, graph projections and AI outputs as derived;
- minimize background execution and respect energy, thermal and network policies;
- keep public contracts independent of CloudKit and Apple framework record types.

## 7. State and Lifecycle

Mobile state SHALL be classified as:

| State | Examples | Authority |
|---|---|---|
| Local Library | local membership and acquired payloads | device |
| Personal Knowledge | annotations, notes, progress | user |
| Restorable UI | current publication, navigation path | local app |
| Session | filters, transient selection | session |
| Derived | thumbnails, indexes, previews | rebuildable |

Scene, task and subscription lifecycles SHALL release resources deterministically.

## 8. Failure and Recovery

The application SHALL preserve locally committed Personal Knowledge and Local Library identity across process termination, network loss, CloudKit outage and NAS unavailability.

Unknown acquisition or synchronization status SHALL be reconciled using stable operation and entity identities before retry.

Missing or corrupt derived artifacts SHALL be rebuilt. Missing local publication payloads SHALL be reacquired only through explicit policy or user action.

## 9. Security and Privacy

- Personal Knowledge SHALL not be transmitted to NAS.
- Remote AI or OCR SHALL require approved policy.
- CloudKit SHALL contain only approved Personal Knowledge envelopes.
- Logs and analytics SHALL exclude publication content, annotations, credentials and private paths.
- App groups, Keychain groups and entitlements SHALL follow least privilege.
- Imported document access SHALL use approved platform security mechanisms.

## 10. Accessibility and Device Adaptation

The implementation SHOULD support VoiceOver, Dynamic Type, reduced motion, sufficient contrast, keyboard use on iPad, pointer interaction, multitasking and Apple Pencil where applicable.

Accessible reading order SHALL preserve UDM semantics even when the visual presentation is adapted.

## 11. Verification and Acceptance

- Offline reading and annotation are verified.
- Master Catalog and Local Library remain distinct.
- Acquisition is resumable and idempotent.
- Personal Knowledge never enters Master Library persistence.
- iPhone/iPad synchronization conflicts preserve all versions.
- Cancellation, background suspension and process restoration are tested.
- Accessibility behavior is reviewed.
- No UI component accesses private repositories directly.
- Architecture traceability is documented.

## 12. Traceability

- `00-Architecture/02-Domain/DomainModel.md`
- `00-Architecture/02-Domain/KnowledgeLifecycle.md`
- `00-Architecture/04-Platform/Library/README.md`
- `00-Architecture/04-Platform/Annotation/README.md`
- `00-Architecture/04-Platform/Render/README.md`
- `00-Architecture/04-Platform/Sync/README.md`
- `00-Architecture/05-Integration/Synchronization/README.md`
- `00-Architecture/07-ArchitectureViews/ADR/ADR-013-Master-Library-Local-Libraries-and-Personal-Sync.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 13. Compatibility and Evolution

Persisted Local Library, Personal Knowledge, CloudKit envelope and restoration formats SHALL be versioned. Breaking changes require migration guidance, compatibility tests and architecture review.

## 14. Status

This document is part of the KnowledgeOS Mobile Application V4 implementation baseline.
