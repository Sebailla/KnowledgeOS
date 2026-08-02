# @knowledgeos/master-storage-node-stream

Direct Node.js filesystem streaming adapter for authoritative Master Library objects.

## Responsibilities

- resolve catalog entries to absolute object paths;
- verify file existence and byte length;
- open full-file streams;
- open bounded byte-range streams;
- avoid full publication buffering.

Checksum verification remains available through the canonical storage verification workflow and scheduled integrity jobs.
