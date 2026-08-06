# Validation — Workspace Reproducibility Fix

## Fixed

- Replaced invalid `typescript: workspace:^` declarations in 31 manifests with `typescript: ^5.9.0`.
- Added workspace-manifest validation.
- Added deterministic pnpm lockfile generation using pnpm 10.15.0.
- Added clean frozen-lockfile installation validation.

## Validation performed

- 32 package manifests parsed successfully.
- 32 named workspace packages detected.
- No unresolved `workspace:` dependencies remain.
- No missing `@knowledgeos/*` package references remain.
- 27 TypeScript packages compile.
- `apps/macos-core-host` compiles.
- `apps/sync-server` compiles.
- `apps/local-library-production` compiles.
- `apps/master-library-direct-streaming-server` compiles.

## Environment limitation

`pnpm-lock.yaml` was not generated in this validation environment because pnpm is not installed and outbound access to `registry.npmjs.org` is unavailable. Run `scripts/reproducibility/generate-lockfile.sh` on a machine with network access. The script then verifies a frozen-lockfile install.
