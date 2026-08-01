# AGENTS

This file applies to `01-Implementation/14-PersonalKnowledgeSync`.

- Only Personal Knowledge SHALL synchronize.
- Publication payloads, Master Catalog records and Local Library membership SHALL NOT use this module.
- The NAS Master Library SHALL NOT be a synchronization peer.
- Stable Personal Knowledge identity SHALL be preserved across devices.
- Conflicts SHALL preserve competing versions until merge.
- Tombstones SHALL support convergence and SHALL NOT silently reuse identities.
- CloudKit is the approved Apple provider profile, but provider contracts SHALL remain replaceable.
