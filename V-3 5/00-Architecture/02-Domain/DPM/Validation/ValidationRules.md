# Validation Rules

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Document Presentation Model

**Document:** Validation Rules

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the Validation Rules of the Document Presentation Model (DPM).

Validation determines whether a reconstructed DPM satisfies the canonical specification.

Validation never modifies the DPM.

Validation only evaluates conformance.

---

# 2. Scope

Validation governs:

* Presentation Nodes;
* Pages;
* Regions;
* Columns;
* Layout Graph;
* Reading Flow;
* Style definitions;
* Mapping references.

Validation applies before a DPM becomes authoritative.

---

# 3. Design Goals

Validation shall:

* remain deterministic;
* remain reproducible;
* remain technology-independent;
* guarantee canonical integrity;
* prevent invalid presentation models.

---

# 4. Design Philosophy

Validation verifies.

It never repairs.

It never infers.

It never reconstructs.

Its responsibility is limited to determining whether a DPM conforms to the specification.

---

# 5. Validation Pipeline

```text
Candidate DPM
      │
      ▼
Validation Rules
      │
      ▼
Consistency Rules
      │
      ▼
Authoritative DPM
```

Every authoritative DPM passes both stages.

---

# 6. Validation Targets

Validation applies to:

* Presentation Nodes;
* Presentation Types;
* Presentation Attributes;
* Layout Graph;
* Reading Flow;
* Typography Roles;
* Decorations;
* Semantic Color Roles;
* Themes;
* Mappings.

Each target is validated independently.

---

# 7. Structural Validation

Structural validation verifies:

* valid hierarchy;
* valid containment;
* valid identities;
* valid parent-child relationships;
* required elements.

---

# 8. Layout Validation

Layout validation verifies:

* valid Pages;
* valid Regions;
* valid Columns;
* valid spatial relationships;
* valid Layout Graph references.

---

# 9. Reading Flow Validation

Reading Flow validation verifies:

* valid entry points;
* valid exits;
* deterministic traversal;
* reachable presentation nodes;
* absence of invalid cycles.

---

# 10. Style Validation

Style validation verifies:

* valid Typography Roles;
* valid hierarchy levels;
* valid semantic color roles;
* valid decoration definitions;
* compatible Theme mappings.

---

# 11. Mapping Validation

Mapping validation verifies:

* existing UDM references;
* existing Presentation references;
* valid Asset mappings;
* valid Anchor mappings;
* compatible versions.

---

# 12. Identity Validation

Validation verifies:

* unique PresentationNodeIDs;
* unique Page identities;
* unique Region identities;
* unique Mapping identities.

Identity conflicts invalidate the DPM.

---

# 13. Version Validation

Validation verifies compatibility between:

* DPM Version;
* UDM Version;
* Mapping Versions;
* Theme Version requirements.

Version incompatibilities invalidate the model.

---

# 14. Provenance Validation

Validation verifies the existence of required provenance information.

Missing provenance prevents canonical publication.

---

# 15. Validation Results

Every validation produces:

* status;
* diagnostics;
* failed rules;
* warnings;
* execution metadata.

Results are immutable.

---

# 16. Failure Policy

Validation failures never modify the candidate DPM.

Possible outcomes include:

* Accepted;
* Accepted with warnings;
* Rejected.

Rejected DPMs never become authoritative.

---

# 17. Relationship to Processing

Validation follows Layout Analysis and Classification.

Processing produces candidates.

Validation determines authority.

---

# 18. Relationship to Consistency Rules

Validation Rules evaluate individual elements.

Consistency Rules evaluate the complete presentation model.

Both stages are mandatory.

---

# 19. Invariants

The following invariants apply:

* Validation never modifies the DPM;
* Validation is deterministic;
* Validation is reproducible;
* every authoritative DPM has passed validation;
* rejected DPMs never become canonical.

---

# 20. Related Documents

* ConsistencyRules.md
* ../Processing/LayoutAnalysis.md
* ../Processing/Classification.md
* ../Layout/LayoutGraph.md
* ../../UDM/Validation/ValidationRules.md

---

# 21. Status

**Approved**

This document defines the Validation Rules of the Document Presentation Model.

Validation determines whether a candidate DPM satisfies the canonical specification while remaining deterministic, reproducible and independent of rendering technologies.
