# Dependency Graph

**Project:** KnowledgeOS  
**Section:** Code Architecture / Dependency Rules  
**Document:** DependencyGraph  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

```text
Schemas / Contracts
        ↓
Domain Types
        ↓
Kernel Contracts
        ↓
Platform Public APIs
        ↓
Infrastructure Adapters
        ↓
Applications and Services
```

Apple applications follow the same logical direction using Swift modules. UI depends on application façades, never repositories. Provider adapters depend on provider contracts, never the reverse.
