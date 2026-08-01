# Manifest And Discovery Guide

**Project:** KnowledgeOS  
**Section:** Implementation / Plugin Runtime / 03-ManifestAndDiscovery  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Platforms:** KnowledgeOS Server, macOS, iPhone, iPad, Web  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Define the manifest and discovery guide for the Plugin Runtime, covering manifest, package validation, signatures, publishers and discovery.

## 2. Module Boundary

This module implements the host runtime for approved KnowledgeOS plugins.

Included:

- plugin discovery and installation;
- manifest and package validation;
- signature and publisher verification;
- compatibility evaluation;
- activation and deactivation;
- capability grants and revocation;
- isolated execution;
- hooks, events, commands, queries, jobs and workflows;
- plugin registry, state and configuration;
- desktop, mobile and web contributions;
- security, testing and operations.

Excluded:

- Plugin SDK specification ownership;
- Domain identity or authority ownership;
- private Engine implementation access;
- direct repository access;
- canonical UDM, DPM or Knowledge Graph mutation;
- Personal Knowledge synchronization ownership;
- provider business policy;
- arbitrary unrestricted native or browser execution.

## 3. Architectural Context

```text
Plugin Package
     │
     ▼
Manifest and Trust Validation
     │
     ▼
Compatibility and Capability Evaluation
     │
     ▼
Plugin Registry
     │
     ▼
Isolated Plugin Runtime
├── Public SDK Contracts
├── Granted Capabilities
├── Extension Registry
├── Resource Limits
└── Audit and Observability
     │
     ▼
Platform Engines through Public Contracts
```

The host retains authority over all privileged operations.

## 4. Normative Language

The keywords **MUST**, **MUST NOT**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative.

## 5. Normative Requirements

- Plugins SHALL use versioned Plugin SDK public contracts only.
- Plugins SHALL NOT access private Engine repositories or implementation types.
- Capabilities SHALL be explicit, least-privilege, revocable and auditable.
- Plugins SHALL NOT redefine Domain identity, authority, UDM, DPM or Knowledge Graph semantics.
- Plugins SHALL NOT write Personal Knowledge to the Master Library.
- Plugin execution SHALL be isolated according to the approved risk profile.
- Plugin failure SHALL NOT corrupt canonical knowledge, Personal Knowledge or host runtime state.
- Manifest identity, version, publisher and compatibility SHALL be validated before activation.
- Plugin-specific extensions SHALL use unique namespaces.
- Plugin lifecycle operations SHALL be idempotent where retryable.
- Resource use SHALL be bounded and observable.
- Network, storage, AI and Personal Knowledge access SHALL require explicit capabilities.
- Uninstall SHALL preserve user-owned plugin data unless explicit deletion is approved.
- Compatibility failures SHALL prevent activation without deleting plugin data.
- The host SHALL retain final authority over extension registration and capability enforcement.

## 6. Plugin Lifecycle

```text
Discovered
→ Validating
→ Installed
→ Disabled
→ Enabling
→ Enabled
```

Additional states include:

- Incompatible;
- Quarantined;
- Failed;
- Updating;
- Disabling;
- Uninstalling;
- Removed;
- RecoveryRequired.

A plugin SHALL not execute privileged code before reaching `Enabled`.

## 7. Capability Model

Every capability SHOULD define:

- capability identity;
- description;
- risk level;
- resource scope;
- operation scope;
- parameters;
- grant source;
- grant lifetime;
- revocation behavior;
- audit policy;
- platform compatibility.

Examples include:

- metadata read;
- personal metadata write;
- Personal Knowledge read;
- annotation contribution;
- search query;
- AI task request;
- network access to approved destinations;
- plugin-scoped storage;
- import parser registration;
- export transformer registration;
- UI command contribution.

## 8. Isolation and Execution

Isolation profiles MAY include:

- in-process restricted execution;
- separate process;
- sandboxed helper;
- Web Worker or isolated browser realm;
- server worker container;
- declarative-only contribution.

Profile selection SHALL be based on trust, platform and requested capabilities.

Execution SHALL enforce:

- identity;
- capabilities;
- deadlines;
- cancellation;
- memory and CPU limits where supported;
- network policy;
- storage scope;
- correlation;
- audit;
- crash isolation.

## 9. Failure and Recovery

The module SHALL handle:

- malformed package;
- invalid signature;
- unknown publisher;
- incompatible SDK;
- unresolved dependency;
- denied capability;
- activation failure;
- runtime exception;
- process crash;
- timeout;
- memory or CPU abuse;
- invalid extension registration;
- failed update;
- failed migration;
- uninstall interruption.

Recovery SHALL preserve host integrity, plugin configuration and user-owned data where safe.

A failing plugin MAY be quarantined or disabled without affecting unrelated plugins.

## 10. Security and Privacy

- Plugin packages SHALL be treated as untrusted.
- Least privilege SHALL be mandatory.
- Personal Knowledge access SHALL require explicit capability grants.
- Master Library write access SHALL be limited to approved public authoring or administrative contracts, if any.
- Secrets SHALL not be exposed as ordinary configuration.
- Network access SHALL follow destination and protocol policy.
- Logs SHALL not include publication content, Personal Knowledge or secrets.
- Plugin telemetry SHALL be scoped and rate-limited.
- Supply-chain provenance SHALL be retained.
- Emergency revocation SHALL be supported.

## 11. Platform Integration

Desktop MAY support menus, commands, windows, panels and toolbars through declarative contributions.

Mobile SHALL expose only capabilities compatible with platform sandbox and extension policies.

Web SHALL use browser-safe isolated execution and a reduced capability set.

All UI contributions SHALL remain host-controlled and accessible.

## 12. Verification and Acceptance

- Invalid or unsigned packages fail according to trust policy.
- Incompatible plugins do not activate.
- Undeclared capabilities are denied.
- Revocation takes effect before subsequent privileged execution.
- Plugins cannot access private repositories.
- Plugin crashes do not corrupt host state.
- Resource exhaustion is bounded and isolated.
- Canonical UDM, DPM and Knowledge Graph authority remain unchanged.
- Personal Knowledge access is explicit and auditable.
- Updates preserve compatible configuration and user-owned data.
- Uninstall preserves user-owned data unless explicit deletion is approved.
- Desktop, mobile and web limitations are explicit.
- Security, isolation, migration and recovery tests pass.
- Architecture traceability is complete.

## 13. Traceability

- `00-Architecture/04-Platform/Plugin/README.md`
- `00-Architecture/05-Integration/PluginSDK/README.md`
- `00-Architecture/05-Integration/PluginSDK/Capabilities.md`
- `00-Architecture/05-Integration/PluginSDK/Contracts.md`
- `00-Architecture/05-Integration/PluginSDK/ExtensionPoints.md`
- `00-Architecture/03-Kernel/DependencyInjection.md`
- `00-Architecture/03-Kernel/WorkflowEngine.md`
- `01-Implementation/05-Shared/README.md`
- `01-Implementation/02-DesktopApplication/README.md`
- `01-Implementation/03-MobileApplication/README.md`
- `01-Implementation/04-WebApplication/README.md`
- `01-Implementation/00-Governance/DefinitionOfDone.md`

## 14. Compatibility and Migration

Plugin manifests, SDK contracts, capabilities, extension points, runtime profiles, state and migrations SHALL be versioned.

Breaking changes require compatibility analysis, migration guidance and safe disablement of incompatible plugins.

## 15. Status

This document is part of the KnowledgeOS Plugin Runtime V4 implementation baseline.
