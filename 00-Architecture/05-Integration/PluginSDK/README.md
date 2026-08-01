# Plugin SDK Integration

**Project:** KnowledgeOS  
**Section:** Integration  
**Document:** README  
**Version:** 4.0  
**Status:** Release Candidate  
**Author:** KnowledgeOS Team  

---

## 1. Purpose

Defines the rector boundary for versioned plugin manifests, capabilities, contracts, extension points and compatibility. Plugins use public contracts only; private Engine implementations remain inaccessible.

## 2. Requirements

- Integration contracts SHALL be versioned.
- Providers and transports SHALL remain replaceable.
- Domain identity and authority SHALL be preserved.
- Business policy SHALL remain in Platform Engines.
- Authentication, authorization and privacy SHALL be enforced at the boundary.
- Retryable effects SHALL be idempotent.
- Provider-specific types SHALL NOT leak into public Platform contracts.
- Failures SHALL map to stable common categories.
- Telemetry SHALL not expose publication content, Personal Knowledge or secrets.

## 3. Compatibility

Breaking changes require a major contract version, migration guidance and architecture review.

## 4. Status

This document is part of the KnowledgeOS Integration V4 baseline.
