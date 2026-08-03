# Document Presentation Model Specification

**Project:** KnowledgeOS  
**Section:** Domain / Document Presentation Model  
**Document:** DPM  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

The Document Presentation Model (DPM) defines the canonical spatial, visual and reading-order representation used by KnowledgeOS to reconstruct, inspect, render and transform documentary presentations independently of source format and renderer implementation.

DPM describes **how documentary content is presented**. It does not redefine what that content means. Semantic meaning, source-backed assertions and canonical content structure remain owned by the Universal Document Model (UDM).

## 2. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. Rules identified by stable identifiers are testable requirements for conforming implementations.


## 3. Architectural Position

```text
Source Manifestation
        │
        ├── semantic extraction ─────────► UDM
        │
        └── layout and style analysis ───► DPM
                                             │
                         ┌───────────────────┼───────────────────┐
                         ▼                   ▼                   ▼
                     Rendering        Reflow/Export       Visual Inspection
```

UDM and DPM are complementary canonical models:

- UDM answers what content means and how semantic units relate.
- DPM answers where presentation units appear, how they are styled and in what visual reading sequence they are encountered.
- Mapping contracts connect both models without collapsing them.

## 4. Design Principles

### 4.1 Separation of Semantics and Presentation

DPM SHALL NOT redefine UDM semantics. Typography, coordinates and spatial grouping do not become semantic facts unless a UDM processor independently classifies them with evidence.

### 4.2 Source Fidelity

DPM SHOULD preserve enough layout and style information to reconstruct a faithful representation of the source manifestation within declared tolerances.

### 4.3 Renderer Independence

DPM SHALL remain independent of SwiftUI, AppKit, UIKit, HTML/CSS, PDFKit, canvas APIs and other renderer-specific abstractions.

### 4.4 Explicit Coordinate Systems

Every spatial value SHALL identify its coordinate space, unit, origin, axes and transformation context.

### 4.5 Deterministic Reconstruction

Equivalent source inputs analyzed under the same processing versions and configuration SHALL yield equivalent DPM output.

### 4.6 Stable Presentation Identity

Pages, regions, presentation nodes and mappings SHALL have stable opaque identities when presentation continuity remains.

### 4.7 Multiple Valid Presentations

A UDM document MAY map to multiple DPMs: source-faithful, reflowed, accessible, responsive, print-oriented or user-generated. Each DPM declares its purpose and authority.

### 4.8 Accessibility and Adaptability

DPM SHALL preserve visual hierarchy and reading order while enabling alternate presentations. Source fidelity SHALL NOT prevent accessible reflow.

## 5. Canonical Envelope

```text
DPMDocument
├── specificationVersion
├── presentationId
├── presentationVersion
├── purpose
├── sourceRefs[]
├── udmDocumentRefs[]
├── coordinateSpaces{}
├── rootPresentationNodeIds[]
├── presentationNodes{}
├── pages{}
├── regions{}
├── layoutGraph
├── readingFlows{}
├── styles{}
├── mappings{}
├── provenance
├── validationManifest
└── extensions{}
```

The structure is logical. Serialization MAY use another physical arrangement while preserving equivalent meaning.

## 6. Presentation Purposes

A DPM declares one primary purpose:

- **source-faithful:** reconstruct the acquired manifestation;
- **reflowed:** reorganize content for variable viewport dimensions;
- **accessible:** optimize navigation and assistive interpretation;
- **responsive:** support breakpoint- or constraint-driven layout;
- **print:** generate paginated output;
- **editorial:** represent a user-created presentation;
- **inspection:** expose extracted layout evidence;
- **preview:** provide a reduced derived view.

Purpose constrains validation and required fidelity.

## 7. Coordinate Spaces

A coordinate space declares:

- identity;
- dimensionality;
- origin;
- axis directions;
- unit;
- extent;
- transform to parent space;
- precision;
- source or target association.

Common spaces include source page, normalized page, viewport, canvas, asset-local and physical print space.

Coordinates SHALL NOT be interpreted without their space. Normalized and absolute values are not interchangeable.

## 8. Presentation Node System

Presentation nodes represent visual objects such as page containers, regions, text frames, columns, blocks, lines, glyph runs, images, rules, decorations and overlays.

Each presentation node includes identity, type, bounds, transform, z-order, clipping, style references, child order, mappings and provenance.

Containment describes visual composition. Spatial relationships and reading order are separate graphs.

## 9. Pages and Regions

A page is a bounded presentation surface. It may correspond to a source page, generated print page or virtual page.

A region is a spatially coherent area with a presentation role, such as header, footer, body, margin, sidebar, column, figure area or footnote area.

Pages and regions are presentation constructs. They SHALL NOT create UDM semantic structure by themselves.

## 10. Layout Graph

The layout graph represents spatial and compositional relationships independently of containment. Relationships include above, below, leftOf, rightOf, overlaps, contains, alignedWith, adjacentTo, flowsTo and anchoredTo.

Every edge identifies coordinate context, evidence, confidence where inferred and provenance.

## 11. Reading Flow

A reading flow is an ordered traversal of presentation nodes for a declared audience or mode. A DPM MAY define primary, alternate, accessible and language-specific flows.

Reading order SHALL be explicit. Z-order, DOM order, coordinate order and semantic order are not assumed equivalent.

## 12. Style Model

DPM style comprises typography, color, decoration, themes and visual hierarchy. Styles are declarative and renderer-neutral.

Style values preserve source evidence and normalized values where applicable. Font files and executable styling are external assets, not embedded runtime behavior.

## 13. UDM Mapping

Mappings connect DPM presentation identities to UDM identities and anchors. They support one-to-one, one-to-many, many-to-one and unresolved relationships.

A mapping may indicate exact, partial, inferred or generated correspondence. It records provenance and confidence.

DPM mapping SHALL NOT transfer presentation properties into UDM or semantic authority into DPM.

## 14. Asset Mapping

Asset mappings connect visual placements or renditions to UDM asset references and source assets. Crop, transform, mask and placement belong to DPM; asset identity and semantic role belong to UDM.

## 15. Processing Model

DPM processing follows:

1. source inspection;
2. page and canvas detection;
3. region segmentation;
4. visual primitive extraction;
5. text-line and block formation;
6. style extraction;
7. column and spatial analysis;
8. reading-flow inference;
9. UDM mapping;
10. reconstruction assembly;
11. normalization;
12. validation;
13. publication.

Processing is deterministic for fixed inputs and processor versions. Failed analysis SHALL NOT silently publish a complete-fidelity claim.

## 16. Validation Model

Validation covers envelope, identity, coordinate spaces, geometry, containment, graph references, reading flows, style references, mappings, provenance and purpose-specific fidelity.

A source-faithful DPM has stricter reconstruction requirements than a preview DPM. Validation profiles SHALL declare those differences.

## 17. Serialization

Serialization preserves identities, coordinate spaces, numeric precision, transforms, ordering, style references, graph edges, mappings, provenance and extensions.

Renderer-specific object graphs and runtime caches SHALL NOT be serialized as canonical DPM.

## 18. Authority and Derived Status

A DPM is canonical for one declared presentation version, but it remains derived from source evidence or editorial actions. It is not authoritative for documentary semantics.

Machine-inferred layout and reading order carry processing provenance. User-edited presentations carry personal or editorial authority.

## 19. Core Invariants

**DPM-I001** — Every DPM has exactly one immutable presentation identity.

**DPM-I002** — Every spatial value belongs to an explicit coordinate space.

**DPM-I003** — Presentation containment is acyclic.

**DPM-I004** — Reading order is explicit and independent of z-order.

**DPM-I005** — DPM does not redefine UDM semantics.

**DPM-I006** — Every UDM mapping records correspondence type and provenance.

**DPM-I007** — Styles are renderer-neutral.

**DPM-I008** — Runtime UI state is excluded.

**DPM-I009** — Source-faithful claims are validated against declared tolerances.

**DPM-I010** — Unknown optional extensions remain preservable.

**DPM-I011** — Asset placement and asset identity remain separate.

**DPM-I012** — Reprocessing preserves identity when visual continuity remains.

## 20. Non-Goals

DPM does not define:

- canonical documentary semantics;
- user interface component architecture;
- application window state;
- persistence databases;
- synchronization transport;
- graphics APIs;
- font licensing;
- search indexes;
- AI provider selection;
- source-file ownership.

## 21. Conformance Classes

Implementations MAY claim:

- DPM Reader;
- DPM Writer;
- Layout Analyzer;
- Presentation Reconstructor;
- DPM Validator;
- UDM/DPM Mapper;
- DPM Renderer;
- Extension Host.

Claims SHALL state supported versions, purposes, coordinate systems and extensions.

## 22. Related Documents

- `README.md`
- `Core/PresentationIdentity.md`
- `Core/PresentationNodeModel.md`
- `Layout/LayoutGraph.md`
- `Layout/ReadingFlow.md`
- `Mapping/UDMMapping.md`
- `Processing/PresentationReconstruction.md`
- `Serialization/Serialization.md`
- `Validation/ValidationRules.md`
- `../UDM/UDM.md`

## 23. Status

This specification is the rector document for DPM V4. Subordinate specifications refine its contracts and SHALL NOT contradict its invariants.
