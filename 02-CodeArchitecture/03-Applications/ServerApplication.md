# Server Application

**Project:** KnowledgeOS  
**Section:** Code Architecture / Applications  
**Document:** ServerApplication  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## Responsibility

NestJS composition root for KnowledgeOS Server on NAS. It exposes versioned APIs, composes Platform services and infrastructure adapters, and owns no Domain policy.

## Rules

- Compose public modules only.
- Keep persistence and provider SDKs behind adapters.
- Preserve V4 authority boundaries.
- Define platform lifecycle, configuration and observability.
- Include architecture, contract and end-to-end tests.
