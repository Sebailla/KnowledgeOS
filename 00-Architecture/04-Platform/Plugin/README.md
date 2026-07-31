# Plugin Engine

**Project:** KnowledgeOS  
**Section:** Platform  
**Document:** PluginEngine  
**Version:** 4.0  
**Status:** Release Candidate  
**Normative Language:** RFC 2119-style keywords  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define plugin lifecycle, capability security, extension registration, compatibility and isolation.

## 2. Scope

Covers plugins extending approved Platform capabilities without modifying the architectural core.

## 3. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.


## 4. Responsibility and Boundaries

Plugin Engine owns:

- plugin discovery and installation;
- manifest validation;
- lifecycle;
- capability grants;
- permission enforcement;
- extension registration;
- compatibility checks;
- isolation;
- plugin diagnostics;
- revocation and uninstall.

Plugins are extensions, not architectural peers. They use public contracts only.

## 5. Conceptual Model

```text
PluginEngine
├── PluginRegistry
├── ManifestValidator
├── CapabilityManager
├── PermissionEvaluator
├── ExtensionRegistry
├── PluginRuntime
├── CompatibilityService
└── Plugin events
```

## 6. Normative Requirements

**PLUGINENGINE-R001** — Every plugin MUST have stable identity, version and signed or otherwise trusted provenance according to policy.

**PLUGINENGINE-R002** — Capabilities MUST be explicitly declared and granted.

**PLUGINENGINE-R003** — Plugins MUST NOT access private Engine implementations or repositories.

**PLUGINENGINE-R004** — Plugins MUST NOT redefine Domain identity, UDM, DPM or authority.

**PLUGINENGINE-R005** — Extensions MUST use unique namespaces.

**PLUGINENGINE-R006** — Plugin execution MUST be isolated according to risk profile.

**PLUGINENGINE-R007** — Permissions MUST be revocable.

**PLUGINENGINE-R008** — Compatibility MUST be checked before activation.

**PLUGINENGINE-R009** — Plugin failure MUST be isolated from the host.

**PLUGINENGINE-R010** — Network, storage, AI and synchronization access MUST require declared capabilities.

**PLUGINENGINE-R011** — Uninstall MUST preserve user-owned data or require explicit deletion choice.

**PLUGINENGINE-R012** — Plugin events and operations MUST be observable.

## 7. Invariants

**PLUGINENGINE-I001** — Least privilege is enforced.

**PLUGINENGINE-I002** — Core semantics cannot be overridden.

**PLUGINENGINE-I003** — Private internals remain inaccessible.

**PLUGINENGINE-I004** — Plugin failure does not corrupt canonical knowledge.

**PLUGINENGINE-I005** — Capability grants are auditable.

**PLUGINENGINE-I006** — Extensions remain namespaced and versioned.

## 8. Commands, Queries, Events and Workflows

Commands include `InstallPlugin`, `EnablePlugin`, `DisablePlugin`, `GrantCapability`, `RevokeCapability` and `UninstallPlugin`.

Queries include `ListPlugins`, `GetPluginPermissions`, `CheckCompatibility` and `ListExtensions`.

Events include `PluginInstalled`, `PluginEnabled`, `PluginDisabled`, `PluginFailed` and `CapabilityRevoked`.

## 9. Failure, Recovery and Degradation

A crashing plugin SHALL be disabled or isolated according to policy. Invalid manifests SHALL prevent activation. Revoked permissions SHALL take effect before future privileged operations.

## 10. Security, Privacy and Observability

Every Engine SHALL enforce authorization and privacy at its public boundary. Personal Knowledge, publication content, credentials and provider secrets MUST NOT be exposed through logs, metrics, traces or events beyond the minimum approved scope.

Each significant operation SHALL propagate correlation identity and expose diagnosable progress without transferring business ownership to the Kernel.

## 11. Examples

A citation provider plugin registers a namespaced metadata extractor and external resolver through public Import and Knowledge contracts. It cannot read Sync repositories directly.

## 12. Compatibility and Evolution

Public contracts SHALL be versioned. Backward-compatible changes MAY add optional operations, fields or events. Changes to ownership, authority, lifecycle, identity, delivery guarantees or privacy boundaries require architectural review and, when significant, an ADR.

## 13. Related Documents

- `../README.md`
- `../../02-Domain/UDM/Core/TypeSystem.md`
- `../../03-Kernel/DependencyInjection.md`
- `../../05-Integration/PluginSDK/README.md`
- `../../05-Integration/PublicAPI/README.md`

## 14. Status

This document is part of the KnowledgeOS Platform V4 release-candidate baseline.
