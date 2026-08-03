# Architecture Decision Matrix

**Project:** KnowledgeOS  
**Section:** Governance  
**Document:** ArchitectureDecisionMatrix  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Determine when a change requires an ADR and which architecture sections require review.

## 2. Matrix

| Change | ADR | Foundation | Domain | Kernel | Platform | Integration | Execution | Views |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Clarification | No | As needed | As needed | As needed | As needed | As needed | As needed | As needed |
| Optional field | Usually no | No | Owner | No | Consumer | Consumer | No | Maybe |
| New Engine | Yes | Maybe | Yes | Yes | Yes | Yes | Yes | Yes |
| New provider | Maybe | No | No | No | Owner | Yes | Maybe | Maybe |
| Identity change | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Authority change | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Public API break | Yes | Maybe | Maybe | Maybe | Yes | Yes | Yes | Yes |
| Storage replacement | Usually no | No | No | No | No | Yes | Maybe | Maybe |
| Library topology | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Sync semantics | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

## 3. ADR Test

An ADR is required when a change affects multiple major sections, changes identity/authority/lifecycle, adds an architectural component, changes compatibility, changes source-of-truth semantics, creates long-lived constraints or supersedes an accepted decision.

## 4. Review Output

The review records decision, rationale, affected documents, migration need, compatibility class, target release and validation requirements.
