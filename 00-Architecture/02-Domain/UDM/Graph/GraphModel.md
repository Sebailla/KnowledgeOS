# UDM Graph Model

**Project:** KnowledgeOS  
**Section:** Domain / Universal Document Model  
**Document:** GraphModel  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Specify the typed semantic graph projected from UDM.

## 2. Scope

Applies to semantic graph projection and graph-consuming capabilities.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative. A requirement identified by an invariant or rule identifier is testable and applies to every conforming implementation unless the rule explicitly limits its scope.


## 4. Context and Responsibilities

The graph is a directed typed multigraph with canonical, personal, derived and external authority layers.

## 5. Conceptual Model

Vertices use stable domain identities. Edges use relationship identities. Graph persistence is replaceable and projection is deterministic.

## 6. Normative Requirements

**GRAPHMODEL-R001** — Graph projection MUST be idempotent.

**GRAPHMODEL-R002** — Every edge MUST identify its authority layer.

**GRAPHMODEL-R003** — Derived edges MUST NOT masquerade as source assertions.

**GRAPHMODEL-R004** — Graph storage MUST be rebuildable from authoritative inputs.

**GRAPHMODEL-R005** — Vertex identity MUST reuse domain identity where available.

**GRAPHMODEL-R006** — Projection rules MUST be versioned.

## 7. Invariants

**GRAPHMODEL-I001** — Every edge has valid endpoints.

**GRAPHMODEL-I002** — Provenance is preserved.

**GRAPHMODEL-I003** — Authority layers do not collapse.

**GRAPHMODEL-I004** — Graph persistence is not canonical knowledge.

## 8. Failure and Edge Cases

A conforming implementation SHALL fail explicitly when it cannot preserve identity, provenance, semantic meaning or authority boundaries. It SHALL NOT repair uncertain input by silently inventing facts. Recoverable ambiguity MAY be represented through confidence, alternatives, unresolved references or validation findings.

Failures SHALL be categorized as structural, semantic, compatibility, provenance, security or processing failures. Each failure SHALL identify the affected entity and the violated rule.

## 9. Examples

Rebuilding the graph database from the same UDM and projection rules yields an equivalent graph.

## 10. Compatibility and Evolution

Changes to this contract SHALL follow semantic versioning at the specification level. Backward-compatible additions MAY introduce optional fields, types or relationships. Changes that alter required semantics, identity rules, authority boundaries or canonical interpretation require a major version.

Unknown optional extensions SHOULD be preserved during round trips. Unknown required semantics MUST produce an explicit incompatibility result.

## 11. Security and Privacy Considerations

Implementations SHALL treat imported data, extension payloads, external identifiers and generated semantic assertions as untrusted until validated. Personal Knowledge and restricted source material MUST respect scoped authority and execution policy. Remote processing MUST NOT occur without applicable authorization.

## 12. Related Documents

- `../UDM.md`
- `RelationshipModel.md`
- `Ontology.md`
- `../Core/Identity.md`

## 13. Status

This document is part of the KnowledgeOS UDM V4 release-candidate baseline. It becomes frozen after architectural review and validation against the complete Domain package.
