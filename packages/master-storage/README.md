# @knowledgeos/master-storage

Authoritative publication-file storage for the NAS-hosted Master Library.

## Includes

- content-addressed object paths;
- staging;
- checksum calculation;
- atomic commit;
- read-time integrity verification;
- catalog references;
- orphan scanning;
- registration integration with Master Library.

PostgreSQL stores catalog state only. Publication bytes remain in the dedicated files volume.
