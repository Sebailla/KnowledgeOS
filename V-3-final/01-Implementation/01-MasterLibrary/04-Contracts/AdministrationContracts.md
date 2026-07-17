
# Master Library Administration Contracts

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Contracts

**Document:** Administration Contracts

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3.0 + Amendment V3.0-001

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines every administrative operation that can modify the Master Library.

Unlike the Reader API, the Administration API is **state-changing**.

Only the NAS-hosted Master Library exposes these endpoints.

No Reader client shall execute these operations.

---

# 2. Scope

This document defines:

* Master Library initialization
* Library configuration
* Device registration
* Device revocation
* Pairing management
* Publication registration
* Publication metadata update
* Cover replacement
* Source replacement
* Publication withdrawal
* Publication restoration
* Publication deletion
* Integrity validation
* Maintenance operations

---

# 3. Core Principle

> Only the Master Library modifies authoritative data.

Clients never modify:

* metadata
* covers
* publications
* source versions

Clients only consume them.

---

# 4. Administrative Roles

Supported roles:

```text
OWNER

ADMINISTRATOR
```

Future versions may include:

```text
MAINTAINER

OPERATOR

AUDITOR
```

---

# 5. Authentication

Every endpoint requires:

```text
Authorization: Bearer <credential>
```

plus:

```text
Role = OWNER
```

or

```text
Role = ADMINISTRATOR
```

---

# 6. Administrative Endpoints

```text
POST   /v1/admin/library/init

GET    /v1/admin/library

PATCH  /v1/admin/library

POST   /v1/admin/pairing

DELETE /v1/admin/pairing/{pairingId}

GET    /v1/admin/devices

DELETE /v1/admin/devices/{deviceId}

POST   /v1/admin/publications

PATCH  /v1/admin/publications/{publicationId}

POST   /v1/admin/publications/{publicationId}/cover

POST   /v1/admin/publications/{publicationId}/source

POST   /v1/admin/publications/{publicationId}/withdraw

POST   /v1/admin/publications/{publicationId}/restore

DELETE /v1/admin/publications/{publicationId}

POST   /v1/admin/integrity

POST   /v1/admin/reindex
```

---

# 7. Library Initialization

Executed only once.

Creates:

* ServerId
* MasterLibraryId
* Storage
* Catalog
* Metadata Store
* Configuration

After completion the Library becomes immutable regarding identity.

---

# 8. Pairing

Creates temporary pairing codes.

Response example:

```json
{
  "pairingCode":"ABCD-EFGH",
  "expiresAt":"2026-07-20T20:00:00Z"
}
```

---

# 9. Device Registration

Successful pairing creates:

* DeviceId
* Credential
* Device metadata

The Administration API never exposes credential secrets again.

---

# 10. Device Revocation

Revoking a device:

* blocks future requests
* invalidates credentials
* does NOT delete local libraries
* does NOT delete annotations
* does NOT delete downloaded publications

---

# 11. Publication Registration

Registers a new logical Publication.

Creates:

* PublicationId
* Metadata
* Initial SourceVersion
* Cover
* Catalog entry

---

# 12. Metadata Update

Updates only metadata.

Never creates a new SourceVersion.

Allowed fields include:

* title
* subtitle
* description
* contributors
* publisher
* subjects
* keywords

---

# 13. Cover Replacement

Replacing a cover:

* updates CoverDescriptor
* changes Cover ETag
* does NOT change SourceVersion

---

# 14. Source Replacement

Uploading a new PDF creates:

```text
SourceVersion +1
```

The previous SourceVersion remains available until the replacement is committed successfully.

---

# 15. Publication Withdrawal

Changes:

```text
Availability

↓

WITHDRAWN
```

Effects:

* Readers cannot acquire it
* Local copies remain valid
* Metadata remains available

---

# 16. Publication Restoration

Changes:

```text
WITHDRAWN

↓

AVAILABLE
```

No new PublicationId is created.

---

# 17. Publication Deletion

Permanent deletion is exceptional.

Deletion requires:

* no active maintenance
* administrator confirmation
* audit logging

Deletion removes:

* metadata
* catalog entry
* covers
* source versions

Already downloaded local copies remain untouched.

---

# 18. Integrity Validation

Administrative validation verifies:

* Catalog consistency
* Metadata consistency
* Missing covers
* Missing sources
* Invalid checksums
* Corrupted PDFs
* Orphan files

No client state is modified.

---

# 19. Reindex

Rebuilds:

* search indexes
* metadata indexes
* subject indexes

Publication identity never changes.

---

# 20. Audit Logging

Every administrative operation shall generate an immutable audit record.

Minimum fields:

```text
timestamp

administrator

operation

publicationId

result

requestId
```

---

# 21. Idempotency

Every POST operation that creates state shall support:

```text
Idempotency-Key
```

Repeated requests with the same key shall never duplicate:

* publications
* pairing codes
* source versions

---

# 22. Security Rules

Administrative endpoints shall:

* require HTTPS
* require authenticated administrators
* validate every identifier
* never expose filesystem paths
* never expose secrets
* log every mutation

---

# 23. Errors

Possible errors include:

```text
AUTHENTICATION_REQUIRED

AUTHORIZATION_DENIED

DEVICE_NOT_FOUND

PUBLICATION_NOT_FOUND

SOURCE_ALREADY_EXISTS

INVALID_METADATA

INVALID_SOURCE

CHECKSUM_MISMATCH

INTEGRITY_FAILED

PAIRING_EXPIRED

PAIRING_ALREADY_USED

MASTER_LIBRARY_LOCKED
```

---

# 24. Invariants

The following rules always apply:

* Only the Master Library modifies authoritative information.
* PublicationId never changes.
* ServerId never changes.
* MasterLibraryId never changes.
* Metadata updates never create SourceVersions.
* Source replacements always create a new SourceVersion.
* Cover replacements never create a SourceVersion.
* Withdrawal never deletes local copies.
* Restoration preserves Publication identity.
* Audit logging is mandatory.
* Administrative operations are authenticated.
* Administrative operations are fully traceable.

---

# 25. Related Documents

* Authentication.md
* ErrorContracts.md
* CatalogContracts.md
* PublicationContracts.md
* AcquisitionContracts.md
* Versioning.md
* Compatibility.md

---

# 26. Status

**Approved**

The Administration API is frozen for Version 1.0.

It defines the complete authoritative management interface for the Master Library.
