# KnowledgeOS Release Engineering

This directory documents the automated build, test, security and publication foundation introduced in Sprint 043.

## Local commands

```bash
pnpm bootstrap
pnpm release:build
pnpm release:test
pnpm release:sbom
pnpm release:validate
pnpm release
```

## CI workflows

GitHub Actions validates TypeScript, Swift, E2E convergence, security, Docker images, macOS packaging, mobile builds, nightly regressions and Release Candidates.

## Required external credentials

Publishing, Apple signing, notarization and App Store delivery require repository secrets and Apple Developer credentials. They are intentionally not stored in the repository.
