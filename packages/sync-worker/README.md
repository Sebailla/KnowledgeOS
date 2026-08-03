# @knowledgeos/sync-worker

Persistent execution worker for Master → Local synchronization plans.

## Guarantees

- acquires one distributed lease per plan;
- resumes from persisted checkpoints;
- renews the lease before every transfer;
- forbids progress rollback;
- requires checksum verification before completion;
- pauses on cancellation;
- releases the lease on every exit path;
- never touches Personal Knowledge.
