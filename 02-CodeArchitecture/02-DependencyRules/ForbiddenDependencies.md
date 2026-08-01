# Forbidden Dependencies

**Project:** KnowledgeOS  
**Section:** Code Architecture / Dependency Rules  
**Document:** ForbiddenDependencies  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

Forbidden dependencies include UI → persistence, Domain → framework, Platform public API → provider SDK, plugin → private Engine code, Local Library → Master database, synchronization → acquisition, and generated types → application implementation. Architecture tests SHALL enforce these rules.
