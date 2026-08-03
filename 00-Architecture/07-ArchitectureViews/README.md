# Architecture Views

**Project:** KnowledgeOS  
**Section:** Architecture Views  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

This package provides complementary views of the KnowledgeOS architecture. Views explain the same approved architecture from context, container, component, deployment, behavior and decision perspectives.

## 2. Structure

```text
07-ArchitectureViews/
├── ADR/
├── C4/
├── UML/
├── rendered/
├── validate-diagrams.sh
└── README.md
```

## 3. Authority

ADRs record decisions. Foundation and Domain specifications define normative meaning. Diagrams visualize those decisions and SHALL NOT silently introduce new architecture. When a diagram conflicts with a normative document or accepted ADR, the normative text prevails and the diagram MUST be corrected.

## 4. Required Model

All views SHALL preserve these boundaries:

- NAS KnowledgeOS Server owns the Master Library and source publications.
- Each Apple device owns a selective Local Library.
- Local Libraries are not Master replicas.
- Publication acquisition is explicit and separate from synchronization.
- Personal Knowledge synchronizes only among Local Libraries through iCloud/CloudKit.
- Personal Knowledge never enters the Master Library.
- UDM and DPM remain separate canonical models.
- Engines own Platform capabilities; Kernel owns execution infrastructure.

## 5. View Types

C4 provides System Context, Containers, Platform Engines and Deployment views. UML provides lifecycle and behavioral flows. ADRs provide decision rationale, consequences and supersession rules.

## 6. Validation

PlantUML sources SHALL compile locally. Rendered assets are derived and MAY be regenerated. Every view change SHOULD be validated against ADR-013 and the current Domain Model.
