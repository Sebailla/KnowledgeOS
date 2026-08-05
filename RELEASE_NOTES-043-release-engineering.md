# Sprint 043 — Release Engineering & CI/CD

## Added

- Reproducible bootstrap and release scripts.
- GitHub Actions for CI, Swift, E2E, security, Docker, macOS, mobile, RC and nightly validation.
- Docker production foundations for Sync Server, Local Library and Master Library.
- CycloneDX-style SBOM generation.
- Release checksum generation and validation.
- GitHub Release publication script.
- Dependabot configuration.
- Workspace completeness audit.

## Known blocker

The input archive omits workspace packages required by the Local Library and Master Library production applications. Their full clean-machine builds remain blocked until those packages are included.
