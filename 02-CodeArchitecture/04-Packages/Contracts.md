# Contracts Package

**Project:** KnowledgeOS  
**Section:** Code Architecture / Packages  
**Document:** Contracts  
**Version:** 5.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## Responsibility

Language-neutral OpenAPI, JSON Schema and event schemas plus generated Swift and TypeScript wire types.

## Public API

The package SHALL expose one documented root entry point, stable types and explicit compatibility. Internal files are not public API.

## Dependencies

Dependencies SHALL follow `02-DependencyRules/DependencyGraph.md`; framework and provider dependencies are prohibited unless this package is explicitly an adapter package.

## Verification

Unit tests, contract tests, architecture tests and generated-artifact drift checks are required as applicable.
