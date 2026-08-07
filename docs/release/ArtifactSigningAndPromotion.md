# Artifact Signing and Release Promotion

KnowledgeOS separates RC validation from promotion to `stable`.

## RC

An RC may be built and validated without a private signing key. The release attestation still binds the Release Manifest, SBOMs, Source Manifest, checksums and validation reports by SHA-256.

## Stable

Promotion to `stable` requires:

1. a valid signed `ReleaseAttestation.json`;
2. a matching public verification key;
3. `ReleaseApproval.json` naming the approver and decision;
4. every gate listed in `PromotionPolicy.json`.

Supported signing paths are Cosign and Ed25519 through OpenSSL. Private keys are never stored in the repository.
