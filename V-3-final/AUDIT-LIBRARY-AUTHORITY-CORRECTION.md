# Library Authority Model Correction Audit

**Project:** KnowledgeOS  
**Architecture Version:** 3.0  
**Amendment:** V3.0-001  
**Status:** Completed

## Corrected Model

- KnowledgeOS Server runs on the NAS.
- The NAS Master Library owns the complete Master Catalog and source publications.
- Device Libraries are selective local Libraries, not NAS replicas.
- Devices browse the Master Catalog and acquire publications on demand.
- Personal state is never uploaded to the NAS Master Library.
- Personal state synchronizes among macOS, iPhone and iPad through iCloud/CloudKit.
- Publication acquisition and personal-state synchronization are separate flows.

## Normative Changes

- Added ADR-013.
- Added Architecture Amendment V3.0-001.
- Amended ADR-004, ADR-008 and ADR-009.
- Added normative correction sections to Library, Sync, Synchronization Integration, Sync Providers and Storage Providers.
- Updated C4 Level 1, Level 2 and Deployment views.
- Replaced the Synchronization UML with the personal-state synchronization flow.
- Added Publication Acquisition UML.
- Added corrected vocabulary.

## Validation

- Markdown documents: 178
- Empty Markdown documents: 0
- Missing mandatory metadata blocks: 0
- Broken Markdown links: 0
- PlantUML sources: 9

## Diagram Validation Requirement

The previously validated eight diagrams were changed by this amendment and a ninth diagram was added.

Run `validate-diagrams.sh` again. The corrected baseline is final only after all current PlantUML sources compile successfully.
