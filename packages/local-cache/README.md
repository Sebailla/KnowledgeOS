# @knowledgeos/local-cache

Deterministic local cache planning.

## Policy

- never evict pinned publications;
- prefer least recently accessed publications;
- preserve a configurable recently accessed set;
- enforce maximum offline bytes;
- preserve minimum filesystem free space.
