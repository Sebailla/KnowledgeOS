# Validation — Lockfile Bootstrap v7

- Lockfile policy JSON parses and matches `packageManager: pnpm@10.15.0`.
- Bootstrap script validates workspace manifests before dependency resolution.
- Generated lockfiles require a frozen clean installation.
- Lockfile attestation binds the lockfile digest to every workspace `package.json` digest and size.
- RC pipeline now requires policy, lockfile integrity and attestation verification.
- GitHub workflow can generate artifacts or create a reviewable pull request.
- No lockfile was fabricated in the offline build environment.
- Expected current result remains: `BLOCKED: pnpm-lock.yaml is missing.`
