# Migration Report

- Mobile state migrations through schema 6 are exercised by the KnowledgeOSMobile suite.
- Corrupt primary state recovery from backup passes.
- Queue idempotency passes.
- RC upgrade requires a backup before migration and service/client restart ordering documented in UpgradeGuide.md.
