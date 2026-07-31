# Model Context Protocol Integration

**Project:** KnowledgeOS  
**Section:** Integration / External Services  
**Document:** MCP  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define safe MCP exposure and consumption for KnowledgeOS capabilities.

## 2. Scope

Applies to MCP servers, clients, tools and resources.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

MCP adapters expose approved public contracts and capabilities. They SHALL not expose private repositories or unrestricted personal data.

## 5. Conceptual Model

MCP tools map to Platform commands and queries. Resources map to approved read-only representations. Prompts remain versioned integration assets.

## 6. Normative Requirements

**MCP-R001** — MCP tools MUST enforce authentication and authorization.

**MCP-R002** — Capabilities MUST be explicit.

**MCP-R003** — Tool inputs MUST be validated.

**MCP-R004** — Private repository access is prohibited.

**MCP-R005** — Personal Knowledge exposure MUST require user authorization.

**MCP-R006** — Tool side effects MUST use idempotency where retryable.

**MCP-R007** — Server metadata MUST declare versions and capabilities.

**MCP-R008** — Remote MCP endpoints MUST follow network policy.

## 7. Invariants

**MCP-I001** — MCP does not redefine Domain semantics.

**MCP-I002** — Least privilege applies.

**MCP-I003** — Public contracts remain authoritative.

**MCP-I004** — Personal data is minimized.

**MCP-I005** — Tools are observable.

## 8. Failure, Recovery and Degradation

Unavailable MCP endpoints SHALL degrade explicitly. Malformed responses SHALL be rejected.

## 9. Security, Privacy and Observability

Integration boundaries SHALL minimize exposed data, enforce authentication and authorization, preserve provenance, and redact credentials, publication content and Personal Knowledge from logs and telemetry.

Providers and external services SHALL be observable without becoming business authorities.

## 10. Examples

An MCP tool `search_local_library` maps to Search Engine query rather than directly reading an index database.

## 11. Compatibility and Evolution

Public integration contracts SHALL be versioned. Breaking changes require a major version, migration guidance and architectural review. Unknown optional extensions SHOULD be preserved. Unknown required semantics MUST fail explicitly.

## 12. Related Documents

- `../PublicAPI/APIConventions.md`
- `../../04-Platform/Plugin/README.md`
- `RemoteExecution.md`

## 13. Status

This document is part of the KnowledgeOS Integration V4 release-candidate baseline.
