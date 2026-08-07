# KnowledgeOS 1.0 Reproducible Release Pipeline

The canonical RC pipeline is `scripts/release-1.0/run-reproducible-rc-pipeline.sh`.

It enforces, in order:

1. lockfile integrity and pnpm 10.15.0;
2. version and feature-freeze consistency;
3. license and security gates;
4. migrations, tests, performance and distribution validation;
5. SPDX 2.3 and CycloneDX 1.5 SBOM generation;
6. release manifest and evidence collection;
7. SHA-256 checksums and optional detached GPG signature;
8. final artifact validation.

The pipeline intentionally fails when `pnpm-lock.yaml` is missing or stale. Signing is optional during local preparation and becomes mandatory for a distributable stable release.
