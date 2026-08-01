# Cross-Language Contracts

**Project:** KnowledgeOS  
**Section:** Code Architecture / Dependency Rules  
**Document:** CrossLanguageContracts  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

OpenAPI, JSON Schema and event schemas are the cross-language source. Swift and TypeScript models are generated. Domain models are not serialized directly. Transport conversion occurs at application boundaries and preserves stable identity, authority, provenance and version metadata.
