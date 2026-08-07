# Reproducible Builds

KnowledgeOS 1.0 RC requires a committed `pnpm-lock.yaml` generated with `pnpm 10.15.0`.

## Generate the lockfile

Run on a machine with access to the npm registry:

```bash
scripts/reproducibility/generate-lockfile.sh
```

## Verify a clean installation

```bash
scripts/reproducibility/verify-clean-install.sh
```

## Release gate

`scripts/release-1.0/prepare-1.0-rc.sh` now stops before release preparation when the lockfile is missing, inconsistent, or cannot complete a frozen installation.

A release shall not be marked reproducible based only on successful local TypeScript compilation using previously available global tooling.
