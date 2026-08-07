# Validation — Release Provenance v5

- Deterministic source archive creation passed.
- Embedded source manifest generated with path, type, byte size and SHA-256.
- 4,178 source entries verified.
- Missing, modified and undeclared archive entries are release blockers.
- External archive SHA-256 validation passed.
- Two independent source archives produced the same SHA-256.
- Relative output paths are normalized to absolute paths before archive creation.
- Release provenance workflow YAML is valid.
- Release and reproducibility scripts pass Bash syntax validation.
- No files from cumulative v4 were removed.
