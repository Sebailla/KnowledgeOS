# Validation — Complete Cumulative v3 Release Engineering

- Release scripts pass Bash syntax validation.
- `.github/workflows/release-rc.yml` parses as valid YAML.
- Workspace license declaration validation passes for 32 manifests.
- SPDX 2.3 SBOM generated for 32 components.
- CycloneDX 1.5 SBOM generated for 32 components.
- Both SBOM files parse as valid JSON.
- Canonical reproducible RC pipeline added.
- SHA-256 artifact checksum generation added.
- Optional GPG detached signing prepared.
- Existing lockfile gate remains mandatory.

## Expected current gate result

Until `pnpm-lock.yaml` is generated and verified, RC preparation remains blocked intentionally by `verify-lockfile-integrity.sh`.
