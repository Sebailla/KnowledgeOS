# Installation Guide — KnowledgeOS 1.0 RC1

KnowledgeOS 1.0 RC1 consists of the macOS application, iOS/iPadOS clients, Sync Server and NAS-hosted Master Library.

## Prerequisites

- macOS 14 or later for the desktop application and Apple builds.
- iOS/iPadOS 17 or later.
- Node.js 22 and pnpm 10 for source builds.
- Docker Engine with Compose for NAS deployment.
- Persistent volumes for PostgreSQL and authoritative library files.

Run `scripts/release-1.0/prepare-1.0-rc.sh` to validate a source checkout. Signed Apple distribution requires valid Apple credentials.
