# Render Engine

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** RenderEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define renderer-independent interpretation of UDM and DPM, viewport projections, reflow and accessibility presentation.

## 2. Scope

Covers rendering orchestration and public render contracts. Excludes UI navigation and renderer-framework internals.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Render Engine owns:

- UDM/DPM interpretation;
- render-plan generation;
- source-faithful presentation;
- reflow;
- accessible presentation;
- viewport projection;
- pagination generation;
- renderer-provider contracts;
- render cache lifecycle.

It does not own UDM or DPM semantics.

## 5. Conceptual Model

```text
RenderEngine
├── RenderPlanner
├── UDMInterpreter
├── DPMInterpreter
├── ReflowService
├── AccessibilityProjection
├── RenderProvider contracts
└── RenderCache contracts
```

## 6. Normative Requirements

**RENDERENGINE-R001** — Render Engine MUST preserve UDM and DPM identity mappings.

**RENDERENGINE-R002** — Renderer-specific objects MUST remain outside public Domain contracts.

**RENDERENGINE-R003** — Source-faithful rendering MUST declare fidelity profile.

**RENDERENGINE-R004** — Reflow MUST preserve semantic reading order.

**RENDERENGINE-R005** — Accessible rendering SHOULD use approved alternate reading flows.

**RENDERENGINE-R006** — Render caches MUST be rebuildable.

**RENDERENGINE-R007** — Missing assets MUST produce explicit placeholders or failures.

**RENDERENGINE-R008** — Rendering MUST not mutate canonical UDM or DPM.

**RENDERENGINE-R009** — Provider selection MUST be policy-driven and replaceable.

**RENDERENGINE-R010** — Cancellation SHOULD be supported for expensive rendering.

**RENDERENGINE-R011** — Personal presentation preferences MUST remain local/personal state.

## 7. Invariants

**RENDERENGINE-I001** — Rendering is non-authoritative.

**RENDERENGINE-I002** — UDM and DPM remain immutable.

**RENDERENGINE-I003** — Mappings remain traceable.

**RENDERENGINE-I004** — Caches are derived.

**RENDERENGINE-I005** — Accessibility does not require semantic loss.

**RENDERENGINE-I006** — Provider implementations remain replaceable.

## 8. Commands, Queries, Events and Workflows

Commands include `GeneratePreview`, `GeneratePrintPresentation` and `InvalidateRenderCache`.

Queries include `BuildRenderPlan`, `RenderPage`, `RenderReflowedView` and `GetRenderCapabilities`.

Events include `PreviewGenerated`, `RenderCacheInvalidated` and `RenderProviderFailed`.

## 9. Failure, Recovery and Degradation

Provider failure SHOULD permit fallback when fidelity and policy allow. Missing DPM MAY allow generated reflow from UDM, but the result SHALL be identified as generated rather than source-faithful.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

A PDF source-faithful view consumes DPM pages. A responsive iPhone reading view generates a reflowed presentation from UDM while retaining annotation anchor mappings.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../README.md`
- `../../02-Domain/UDM/UDM.md`
- `../../02-Domain/DPM/DPM.md`
- `../Annotation/README.md`
- `../../05-Integration/Providers/RenderProviders.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
