# Lockfile Bootstrap and Attestation

KnowledgeOS RC1 requires a committed `pnpm-lock.yaml` generated with pnpm 10.15.0. The lockfile is not accepted by presence alone: it must be linked cryptographically to every workspace `package.json` through `LockfileAttestation.json`.

## Local execution

```bash
scripts/reproducibility/bootstrap-lockfile-ci.sh
```

This command validates workspace manifests, generates the lockfile, performs a frozen installation, creates the attestation, verifies it and repeats a clean frozen installation.

## GitHub Actions

Run **Lockfile Bootstrap** manually. The workflow uploads the generated files and can optionally create a pull request. Review dependency changes before merging.

## Release gate

The RC pipeline requires:

- pnpm 10.15.0;
- a valid lockfile;
- a successful frozen install;
- matching hashes for all workspace manifests;
- a valid lockfile attestation.
