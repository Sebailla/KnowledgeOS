# KnowledgeOS Closed Alpha Installation Guide

Version: `0.45.0-alpha.1`

## macOS

1. Obtain the signed Alpha archive from the private release channel.
2. Verify the SHA-256 checksum against `Checksums.txt`.
3. Move `KnowledgeOS.app` to `/Applications`.
4. Start the NAS services before opening the application.
5. Confirm that the application reports USP `1.0` and the configured Sync Server.

## iPhone and iPad

1. Install the build from the private TestFlight group.
2. Accept the Alpha participation notice.
3. Configure the Sync Server URL supplied by the evaluator coordinator.
4. Diagnostics remain disabled until explicit consent is granted.

## NAS

1. Copy `deployment/production/env.example` to `.env`.
2. Configure strong database credentials and persistent volume locations.
3. Run `scripts/deployment/validate-production.sh`.
4. Run `scripts/deployment/start-production.sh`.
5. Confirm PostgreSQL, Sync Server and Master Library health.
