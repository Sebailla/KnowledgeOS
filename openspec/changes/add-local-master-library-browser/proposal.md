# Proposal: Add Local Master Library Browser

## Intent

Make the Master Catalog usable locally: browsing, protected download, and explicit acquisition initiation. This is development support, never NAS readiness.

## Scope

### In Scope
- Local HTTPS panel: login, catalog, download, initiation, error states.
- Development-only `admin@knowledgeos.local`, with a temporary password disclosed once at local startup.
- Short-lived local sessions mapped to `catalog.read` and `publication.acquire` authorization.
- Versioned command: publication/version plus target Local Library identity returns acceptance; it performs no Local Library write.
- Docker E2E: login, browse, download, command, expiry, and profile rejection.

### Out of Scope
- NAS issuer/enrollment, rotation/revocation, user administration, production sessions, or a production claim.
- Local Library persistence/processing; Personal Knowledge and annotations.
- Changes to Master authority or protected-server authorization semantics.

## Capabilities

### New Capabilities
- `local-master-library-browser`: Local HTTPS client for authorized v1 catalog, download, and acquisition initiation.
- `local-master-library-development-auth`: Local-only identity/session adapter, rejected by deployment configuration.
- `master-library-acquisition-initiation`: v1 command accepting a Master publication/version for a named Local Library; client owns execution and state.

### Modified Capabilities
None; `openspec/specs/` has no existing capability specifications.

## Approach

Add a local client and adapter behind the proxy. It calls protected endpoints only—no bypass token, PostgreSQL, or filesystem access. The command is a client handoff, not NAS-side Local Library work. Fail closed outside local profile. Reveal the password only to the initiating terminal; exclude it from audits.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `apps/` | New | Panel and local session adapter |
| `apps/master-library-direct-streaming-server/` | Modified | Session bridge, command route, profile guards |
| `packages/contracts/src/library.ts` | Modified | Acquisition command contract |
| `deployment/production/`, `scripts/deployment/` | Modified | Local Compose and E2E |
| `01-Implementation/01-MasterLibrary/` | Modified | Local boundary documentation |

## Risks

| Risk | Mitigation |
|---|---|
| Local credentials reach deployment | Fail closed; test rejection |
| Browser bypasses authorization | Protected HTTPS contracts only; E2E denial |
| NAS owns client data | Client handoff; no Local Library/Personal Knowledge persistence |
| Password reaches logs | One-time terminal output; redaction tests |

## Rollback Plan

Remove panel/profile wiring and sessions; retain API, catalog, volumes, and migrations. No data migration is required.

## Dependencies

- Existing Docker protected composition, TLS proxy, and catalog endpoint.
- G0 NAS identity remains release work.

## Success Criteria

- [ ] Local operator signs in, browses, and downloads authorized publications.
- [ ] Authorized initiation returns acceptance for a named Local Library without persisting Local Library or Personal Knowledge state on NAS.
- [ ] Unauthorized, expired, and deployment-profile local-auth requests are denied.
- [ ] Docker evidence and documentation make no NAS production-readiness claim.
