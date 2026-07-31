# View Hierarchy

**Project:** KnowledgeOS  
**Section:** Implementation / Desktop Application / 04-DesktopUI  
**Document:** ViewHierarchy  
**Version:** 4.0  
**Status:** Release Candidate  
**Platform:** macOS  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the view hierarchy for the KnowledgeOS macOS application, covering desktop UI composition, hierarchy and lifecycle.

## 2. Scope

This document applies to the native macOS client and its integration with:

- the device Local Library;
- the NAS-hosted Master Library;
- Personal Knowledge;
- UDM and DPM;
- Platform Engines;
- Kernel execution services;
- Apple platform services.

It does not redefine Domain authority, acquisition semantics, synchronization ownership or Platform Engine responsibilities.

## 3. Product Context

The macOS application is the primary KnowledgeOS client.

It SHALL support:

- local device scanning from user-authorized locations;
- an independent offline-first Local Library;
- browsing the remote Master Catalog;
- explicit acquisition of selected publications;
- reading and rendering;
- annotations and Personal Knowledge;
- search;
- optional AI;
- workspace and multi-window behavior;
- future personal synchronization through iCloud/CloudKit.

The NAS is not mounted as the working Local Library and is not a Personal Knowledge synchronization peer.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- The macOS application SHALL maintain an independent Local Library.
- The application SHALL remain usable offline for locally available publications.
- The application SHALL browse the Master Catalog without treating the Local Library as a replica.
- Publication acquisition SHALL be explicit and separate from Personal Knowledge synchronization.
- Personal Knowledge SHALL synchronize only through the approved iCloud/CloudKit profile.
- The application SHALL NOT write annotations, highlights, reading progress or personal relationships to the NAS Master Library.
- UI components SHALL invoke public Platform contracts and SHALL NOT access repositories directly.
- Long-running work SHALL expose durable operation identity, progress, cancellation and failure state.
- Stable Domain identity SHALL be preserved across windows, workspaces, navigation and restoration.
- Views SHALL be declarative projections of state and SHALL not own business rules.
- Accessibility, keyboard navigation and native macOS conventions SHALL be supported.
- View lifecycle SHALL not leak tasks, subscriptions or security-sensitive state.

## 6. Architecture and Design Guidance

Implementation SHOULD:

- use explicit module composition at application startup;
- keep SwiftUI/AppKit view code separate from Platform services;
- expose commands, queries and observable state through stable façades or ViewModels;
- preserve stable Domain identity in navigation and restoration payloads;
- treat render, search, graph and AI projections as derived;
- use structured concurrency with lifecycle-bound tasks;
- propagate cancellation and correlation;
- validate all persisted UI and workspace state before restoration;
- avoid singleton mutable state except for explicitly governed application services;
- keep framework-specific types out of shared public contracts;
- support graceful degradation when the Master Library or remote providers are unavailable.

## 7. State and Lifecycle

Desktop state SHALL be classified as:

| State Class | Examples | Persistence |
|---|---|---|
| Domain-backed | Local Library membership, annotations | Domain repositories |
| Restorable workspace | windows, tabs, open documents | local restoration store |
| Session | active navigation, transient filters | scoped session |
| Ephemeral UI | hover, focus, animation | memory only |
| Derived | render cache, search results | rebuildable cache |

Lifecycle transitions SHALL release subscriptions, tasks, file handles and security-scoped resources deterministically.

## 8. Failure and Recovery

The application SHALL preserve:

- Local Library identity;
- locally available publications;
- committed Personal Knowledge;
- workspace restoration evidence;
- operation identities;
- import and acquisition progress;
- provenance and integrity findings.

Unavailable NAS access SHALL degrade Master Catalog browsing and acquisition only. It SHALL NOT prevent reading or annotating locally available publications.

Invalid restoration state SHALL be isolated and repaired without deleting authoritative user data.

## 9. Security and Privacy

- User-selected files SHALL use approved macOS security-scoped access where required.
- Credentials and tokens SHALL use Keychain or another approved secure store.
- Personal Knowledge SHALL not be written to NAS.
- Logs SHALL not contain publication content, private paths, annotations or credentials.
- Remote AI or OCR SHALL require policy authorization.
- Window and workspace restoration payloads SHALL avoid sensitive content where identity references suffice.

## 10. Accessibility and Native Experience

The desktop application SHOULD follow native macOS conventions for:

- keyboard navigation;
- menus and commands;
- window restoration;
- focus;
- accessibility labels and reading order;
- drag and drop;
- document opening;
- toolbar and sidebar behavior;
- VoiceOver;
- reduced motion and contrast preferences.

Accessibility transformations SHALL preserve UDM semantic order.

## 11. Verification and Acceptance

- The behavior is covered by automated tests where technically feasible.
- Offline behavior is verified.
- Master Catalog and Local Library scopes remain visibly distinct.
- Personal Knowledge never enters Master Library persistence.
- Cancellation, timeout and failure behavior are verified.
- Architecture traceability is documented.
- Accessibility implications are reviewed.
- No direct private-repository access exists from UI code.

## 12. Traceability

- `00-Architecture/02-Domain/DomainModel.md`
- `00-Architecture/04-Platform/README.md`
- `00-Architecture/04-Platform/Library/README.md`
- `00-Architecture/04-Platform/Annotation/README.md`
- `00-Architecture/04-Platform/Render/README.md`
- `00-Architecture/04-Platform/Search/README.md`
- `00-Architecture/04-Platform/Sync/README.md`
- `00-Architecture/03-Kernel/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 13. Compatibility and Evolution

Breaking changes to restoration formats, Local Library identity mapping, public client contracts or acquisition behavior require migration guidance and architecture review.

Persisted workspace and session formats SHALL be versioned.

## 14. Status

This document is part of the KnowledgeOS Desktop Application V4 implementation baseline.
