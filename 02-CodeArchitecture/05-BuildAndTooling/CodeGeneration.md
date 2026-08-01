# Code Generation

**Project:** KnowledgeOS  
**Section:** Code Architecture / Build and Tooling  
**Document:** CodeGeneration  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

The generation pipeline validates schemas, produces TypeScript and Swift models, formats outputs, runs round-trip fixtures and fails when generated files differ from committed artifacts. No application may define competing handwritten wire models.
