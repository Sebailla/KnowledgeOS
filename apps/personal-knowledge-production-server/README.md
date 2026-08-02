# @knowledgeos/personal-knowledge-production-server

Production HTTP surface for Personal Knowledge synchronization.

Endpoints:

- register/list/revoke devices;
- push/pull incremental events;
- list conflicts;
- resolve conflicts.

Authentication is delegated to a principal resolver. Owner, device and scope enforcement remain inside the runtime.
