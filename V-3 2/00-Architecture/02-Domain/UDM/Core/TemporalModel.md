# Temporal Model

**Project:** KnowledgeOS

**Section:** Domain

**Category:** Universal Document Model

**Document:** Temporal Model

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the temporal model used by the Universal Document Model (UDM).

The Temporal Model allows knowledge to express time-related semantics independently of version history.

Temporal information belongs to the represented knowledge itself.

It does not describe the evolution of the UDM implementation.

---

# 2. Scope

The Temporal Model applies to every node within the UDM.

It defines:

* temporal attributes;
* validity intervals;
* temporal uncertainty;
* temporal relationships;
* temporal reasoning support.

Version history is defined separately.

---

# 3. Design Goals

The Temporal Model shall:

* represent knowledge in time;
* distinguish historical facts from document revisions;
* support incomplete dates;
* support uncertain dates;
* support intervals;
* remain renderer-independent.

---

# 4. Temporal Concepts

The UDM distinguishes three independent notions of time.

```text
Knowledge Time
        │
        ├── Event Time
        ├── Valid Time
        └── Transaction Time
```

Each concept has a distinct meaning.

---

# 5. Event Time

Represents when something occurred in the real world.

Examples:

* publication;
* discovery;
* experiment;
* observation;
* meeting.

Event Time belongs to the represented knowledge.

---

# 6. Valid Time

Represents the period during which knowledge is considered valid.

Examples:

* validity of a law;
* taxonomic classification period;
* product availability;
* software support window.

Valid Time may be open-ended.

---

# 7. Transaction Time

Represents when the information entered the Knowledge Library.

Examples:

* import timestamp;
* annotation timestamp;
* synchronization timestamp.

Transaction Time belongs to the platform history.

It shall not be confused with Event Time.

---

# 8. Temporal Intervals

Temporal information may represent:

* instant;
* interval;
* recurring period;
* unknown period.

Intervals may define:

* start;
* end;
* duration;
* open boundary.

---

# 9. Temporal Precision

Not every date has the same precision.

Supported levels include:

* year;
* month;
* day;
* hour;
* minute;
* second.

Unknown components remain explicitly undefined.

---

# 10. Temporal Uncertainty

Knowledge may contain uncertain temporal information.

Examples:

* circa 1850;
* before 1900;
* after World War II;
* between 1980 and 1985.

The UDM preserves uncertainty without forcing artificial precision.

---

# 11. Temporal Relationships

Nodes may participate in temporal relationships.

Examples:

* precedes;
* follows;
* overlaps;
* contains;
* simultaneous.

Temporal relationships are independent from structural relationships.

---

# 12. Temporal Attributes

Temporal information may be attached to any node.

Typical attributes include:

* EventTime;
* ValidFrom;
* ValidUntil;
* RecordedAt;
* Precision;
* Confidence.

Node types decide which attributes are applicable.

---

# 13. Relationship to Versioning

Temporal information represents knowledge.

Versioning represents document evolution.

These concepts are independent.

Example:

A historical event from 1969 may be corrected in a node version created in 2028.

The event date remains 1969.

The version date becomes 2028.

---

# 14. Relationship to Provenance

Provenance records how knowledge entered and evolved within the platform.

Temporal information describes the knowledge itself.

The two models complement each other.

---

# 15. Temporal Invariants

The following invariants apply.

* Temporal information never replaces Versioning.
* Event Time is independent from Transaction Time.
* Valid Time may be unknown.
* Uncertainty shall be preserved.
* Temporal reasoning never modifies canonical content.

---

# 16. Relationship to the Knowledge Graph

Temporal attributes enrich graph semantics.

The Knowledge Graph may answer questions such as:

* What was valid in 1995?
* Which concepts coexisted?
* Which documents reference obsolete knowledge?

Temporal reasoning is derived from the UDM.

---

# 17. Relationship to Other Documents

This document complements:

* Versioning.md
* Provenance.md
* Ontology.md
* RelationshipModel.md
* NodeAttributes.md

---

# 18. Status

**Approved**

This document defines the temporal model of the Universal Document Model.

Temporal information represents the chronology of knowledge independently of version history and platform operations.
