# Apply Progress: Add Local Master Library Browser

## Completed Work Units

- PR1 — acquisition contract and durable receipt: completed before this work unit.
- PR2 — local development authentication and browser BFF: completed; browser HTML/CSS/JS is deliberately deferred to PR3 by assigned scope.

## PR2 Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test | `pnpm --filter @knowledgeos/master-library-local-development-auth test` — passed; wrong password, signed expiry, permission checks, logout, and deployment redaction. |
| Focused test | `pnpm --filter @knowledgeos/master-library-local-browser test` — passed; cookie flags, origin denial, catalog/download/acquisition forwarding, 403 clear, no retry, logout. |
| Safety net | `pnpm --filter @knowledgeos/master-library-direct-streaming-server build && pnpm --filter @knowledgeos/master-library-direct-streaming-server test` — passed. |
| Runtime harness | BFF integration harness runs an ephemeral loopback HTTP server and validates login/cookie/protected forwarding. Docker TLS remains PR3 scope. |
| Rollback boundary | `packages/master-library-local-development-auth/`, `apps/master-library-local-browser/`, profile-validation additions, and local runtime wiring can be reverted without affecting receipts/catalog/migrations. |

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 2.1–2.2 | `packages/master-library-local-development-auth/test/local-development-auth.test.mjs` | Unit | N/A (new) | Missing source/build failed | Passed | Valid/invalid password, expiry, logout, permissions, profile modes | Hash/signature helpers extracted |
| 2.3–2.4 | `apps/master-library-local-browser/test/local-browser.test.mjs` | Integration | N/A (new) | Missing source/build failed | Passed | Wrong origin/password, catalog, unavailable, acquisition, 403, logout | Endpoint forwarding centralized |
| 2.5 | `apps/master-library-direct-streaming-server/test/local-profile.integration.mjs` | Integration | Existing suite passed | Deployment/local config assertion failed | Passed | Fixture and deployment validation paths | Profile validation isolated |

## PR3 Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test | `pnpm --filter @knowledgeos/master-library-local-browser test` — passed; BFF UI assets, cookie/session forwarding, and Compose route contract. |
| Focused test | `pnpm --filter @knowledgeos/master-library-local-development-auth test` — passed; local credential verifier validates signed BFF credentials in the isolated API process. |
| Safety net | `pnpm --filter @knowledgeos/master-library-direct-streaming-server test` — passed; protected HTTP delivery/profile suite. |
| Runtime harness | `node scripts/deployment/test-local-master-library-browser.mjs` — passed; disposable Docker Desktop TLS panel, one-time password, mode-0600 secrets, login/catalog/download, acquisition replay/conflict, logout/expiry, no authoritative data mounts, redacted logs, and cleanup. |
| Rollback boundary | Browser public assets/BFF static serving, local browser runtime, local Compose/proxy routes, launcher/E2E script, and local-only operations documentation. Reverting this boundary leaves contracts, durable receipts, catalog data, and Master files intact. |

## PR3 TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|---|---|---|---|---|---|---|---|
| 3.1 | `apps/master-library-local-browser/test/local-compose.test.mjs`, `scripts/deployment/test-local-master-library-browser.mjs` | Integration/E2E | N/A (new) | Compose assertion failed before local profile/browser route existed | Passed | Password, file mode, no data mounts, logs, replay/conflict, logout and expiry | Separate browser runtime avoids authoritative mounts |
| 3.2 | `apps/master-library-local-browser/test/local-browser.test.mjs` | Integration | PR2 BFF suite baseline | Root panel assertion failed with 404 | Passed | HTML and script asset responses; protected paths retain BFF behavior | Static asset resolver restricts the served asset set |
| 3.3–3.4 | `scripts/deployment/test-local-master-library-browser.mjs` | Docker TLS E2E | Existing unit suites passed | Missing launcher/runtime failed composition requirements | Passed | Login/catalog/download/acquisition/replay/conflict/logout/expiry | Readiness waits for both API and browser before deleting the password file |
| 3.5 | `apps/master-library-local-browser/test/local-compose.test.mjs` | Documentation/config | N/A | N/A — documentation-only | Passed | N/A | Operations boundary remains explicit |
