# Known Issues

See `docs/release/KnownIssues.md`.

No open P0/P1 issue is recorded in the supplied backlog. The previously missing Local Library and Master Library workspace packages have been implemented and their integration tests pass.

Remaining release evidence:

- generate and commit `pnpm-lock.yaml` using pnpm 10.15.0 with registry access;
- verify a frozen clean install;
- validate signed Apple artifacts on macOS and physical devices;
- execute production NAS backup/restore on target infrastructure.
