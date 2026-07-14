# Architecture Amendment V3.0-001

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Governance

**Document:** Architecture Amendment V3.0-001

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This amendment corrects the scope of the NAS Master Library, device-local Libraries and cross-device personal synchronization.

# 2. Clarification

The original Frozen V3 baseline used `Source of Truth`, `replica` and `synchronization` too broadly.

The approved model is:

* KnowledgeOS Server runs on the NAS.
* The NAS Master Library is authoritative for the Master Catalog, source publications and master-source metadata.
* Each Apple device maintains a selective local Library containing only publications acquired for that device.
* Device Libraries are not replicas of the NAS Master Library.
* Personal state is not uploaded to the NAS.
* Personal state synchronizes among macOS, iPhone and iPad through the approved iCloud/CloudKit profile.
* Publication acquisition from the NAS is distinct from personal-state synchronization.

# 3. Governing Decision

ADR-013 is the normative decision for this clarification.

ADR-004, ADR-008 and ADR-009 remain active as amended by ADR-013.

# 4. Freeze Effect

The Architecture V3 Freeze remains in force with this approved amendment incorporated into the baseline.

Future documents and implementation shall use the corrected authority model.
