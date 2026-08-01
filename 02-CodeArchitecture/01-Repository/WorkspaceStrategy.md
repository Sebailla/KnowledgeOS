# Workspace Strategy

**Project:** KnowledgeOS  
**Section:** Code Architecture / Repository  
**Document:** WorkspaceStrategy  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

`pnpm-workspace.yaml` includes `apps/*`, `packages/*`, `services/*` and `tools/*`. Swift packages are intentionally excluded from pnpm and are managed by Swift Package Manager. Cross-language sharing occurs only through generated schemas, fixtures and conformance tests.
