# @knowledgeos/sync-local-runtime

End-to-end Master → Local transfer execution.

## Guarantees

- validates immutable Master descriptor before transfer;
- downloads byte ranges from the persisted offset;
- appends only at the expected staging offset;
- persists checkpoints after staging writes;
- resumes after interruption;
- verifies complete SHA-256 and byte length through Local Acquisition;
- marks content offline-readable only after verified commit;
- discards temporary staging after success;
- integrates with `@knowledgeos/sync-worker`;
- excludes Personal Knowledge.
