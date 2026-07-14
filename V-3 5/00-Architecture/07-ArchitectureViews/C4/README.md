# C4 Architecture Views

**Project:** KnowledgeOS

**Section:** Architecture

**Layer:** Architecture Views

**Document:** C4 Architecture Views

**Version:** 3.0

**Status:** Approved

**Author:** KnowledgeOS Team

---

# 1. Purpose

This directory contains the official C4 architecture views for KnowledgeOS Architecture V3.

The views are derived from the normative architecture. They do not replace the normative documents or ADRs.

# 2. Active Views

* `diagrams/level1/C4-L1-SystemContext.puml`
* `diagrams/level2/C4-L2-Containers.puml`
* `diagrams/level3/C4-L3-PlatformEngines.puml`
* `diagrams/deployment/C4-Deployment-Native-NAS-Providers.puml`

# 3. Rendering

The diagrams are self-contained PlantUML sources and require no network access.

Render all diagrams from `00-Architecture/07-ArchitectureViews/C4` with:

```bash
plantuml diagrams/level1/*.puml \
  diagrams/level2/*.puml \
  diagrams/level3/*.puml \
  diagrams/deployment/*.puml
```

# 4. Authority

When a diagram conflicts with normative architecture, the normative architecture and accepted ADRs prevail.

# 5. Invariants

* The NAS-backed Library remains the configured Source of Truth.
* Native clients remain Offline First.
* Local durable replicas are not represented as competing canonical authorities.
* Platform Engines own product capabilities.
* Providers and external services remain behind Integration boundaries.
* AI services are optional dependencies.
* Architecture Views shall be updated when the represented architecture changes.

# 6. Status

**Approved**

These views form the initial official C4 baseline for KnowledgeOS Architecture V3.
