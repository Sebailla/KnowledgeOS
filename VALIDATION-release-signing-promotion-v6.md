# Validation — Release Signing and Promotion v6

- Release attestation generated as an in-toto Statement v1.
- Nine release subjects are bound by SHA-256 and byte size.
- RC validation succeeds without a private key, as allowed by policy.
- Stable promotion fails when the signed attestation is absent.
- Stable promotion requires a valid signature and `ReleaseApproval.json`.
- Cosign and Ed25519/OpenSSL signing paths are supported.
- Private keys are not stored in the repository.
- Bash scripts and GitHub Actions YAML pass syntax validation.
