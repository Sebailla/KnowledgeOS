# @knowledgeos/domain-types

Foundational, immutable, dependency-free value types shared by TypeScript services and serialized contracts.

## Owns

- branded identities;
- versions and fingerprints;
- authority and privacy descriptors;
- provenance;
- stable error categories;
- pagination;
- availability;
- generic `Result`.

## Does not own

- entities;
- repositories;
- business rules;
- transport;
- persistence;
- provider types.

This package MUST remain dependency-free.
