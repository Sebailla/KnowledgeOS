# Module Visibility

**Project:** KnowledgeOS  
**Section:** Code Architecture / Dependency Rules  
**Document:** ModuleVisibility  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

Every workspace exposes one documented public entry point. Deep imports into `src/internal`, persistence implementations or generated internals are forbidden. Swift packages expose intentional `public` symbols and keep adapters `internal` unless an application composition root requires them.
