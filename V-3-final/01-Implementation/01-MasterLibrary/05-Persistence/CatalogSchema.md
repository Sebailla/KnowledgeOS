
# Master Library Catalog Schema

**Project:** KnowledgeOS

**Section:** Implementation

**Module:** Master Library

**Layer:** Persistence

**Document:** Catalog Schema

**Version:** 1.0

**Status:** Approved

**Architecture Baseline:** KnowledgeOS Architecture V3

**Catalog Baseline:** PostgreSQL Authoritative Catalog Storage

**Scale Baseline:** More Than 2,000,000 Publications at Initial Deployment

**Author:** KnowledgeOS Team

---

# 1. Purpose

This document defines the relational persistence model of the KnowledgeOS Master Library Catalog.

It establishes the formal bridge between:

```text
Domain Model
    ↓
Aggregate Persistence Model
    ↓
Relational Model
    ↓
PostgreSQL Physical Schema
```

The document defines:

* aggregate-to-relational mapping;
* PostgreSQL schema organization;
* tables;
* columns;
* primary keys;
* foreign keys;
* unique constraints;
* check constraints;
* revision models;
* lifecycle models;
* provenance models;
* indexes;
* views;
* partition candidates;
* naming conventions;
* migration boundaries;
* relational invariants.

The schema is designed to support more than two million Publications from initial deployment and continued growth without fundamental redesign.

---

# 2. Scope

This document covers the structured authoritative state of the Master Library.

It includes:

* Master Library identity;
* server identity;
* Publications;
* publication metadata;
* metadata revisions;
* SourceVersions;
* CoverRevisions;
* Assets;
* Contributors;
* contributor aliases;
* contributor credits;
* Subjects;
* classifications;
* Collections;
* collection membership;
* external identifiers;
* provenance;
* relationships;
* Devices;
* credentials;
* roles;
* permissions;
* audit records;
* operations;
* jobs;
* leases;
* outbox records;
* migrations;
* backups;
* restores;
* reconciliation;
* persistent configuration.

---

# 3. Explicit Exclusions

This document does not define:

* binary file contents;
* physical filesystem paths beyond logical storage keys;
* final SQL migration scripts;
* ORM models;
* repository implementation code;
* PostgreSQL runtime configuration;
* backup schedules;
* search-engine internal indexes;
* Reader SQLite schemas;
* CloudKit schemas;
* personal Reader state;
* public API payloads.

Concrete SQL is produced by implementation migrations derived from this model.

---

# 4. Schema Design Goals

The relational schema shall provide:

* stable domain identity;
* relational integrity;
* aggregate consistency;
* immutable source history;
* immutable cover history;
* metadata provenance;
* deterministic revisioning;
* recoverable cross-store operations;
* scalable reads;
* scalable bulk ingestion;
* safe concurrent modification;
* explicit lifecycle state;
* append-only auditability;
* replaceable derived projections;
* migration compatibility;
* bounded operational complexity.

---

# 5. Schema Design Principles

The following principles govern the schema:

1. Domain concepts precede tables.
2. Aggregate boundaries precede foreign-key convenience.
3. Stable domain identifiers are primary identities.
4. Authoritative relationships are relational.
5. Core catalog state is not hidden inside JSONB.
6. Historical revisions are append-oriented.
7. Current-state references are explicit.
8. Binary content remains outside PostgreSQL.
9. Referential integrity is enforced by PostgreSQL.
10. Frequently queried tables remain narrow.
11. Large optional payloads are separated.
12. Deep pagination uses stable indexed cursors.
13. Search projections are derived.
14. Personal Reader state is excluded.
15. Physical optimizations shall not alter domain semantics.

---

# 6. Mapping Layers

Each major concept is documented through four layers.

## 6.1 Domain Aggregate

Defines identity, behavior, ownership and invariants.

## 6.2 Persistence Model

Defines which state must survive and how aggregate state is decomposed.

## 6.3 Relational Model

Defines entities, relationships, constraints and normalized structures.

## 6.4 PostgreSQL Physical Model

Defines schemas, tables, column types, indexes and technical constraints.

---

# 7. PostgreSQL Schema Organization

The authoritative database uses the following PostgreSQL schemas:

```text
catalog
identity
security
audit
operations
configuration
maintenance
```

The `public` schema shall not contain KnowledgeOS application tables.

---

# 8. General Naming Conventions

Database identifiers use:

```text
snake_case
lowercase ASCII
singular table names
explicit constraint names
explicit index names
```

Examples:

```text
catalog.publication
catalog.source_version
catalog.publication_contributor
operations.operation
audit.audit_entry
```

---

# 9. Table Naming

Tables use singular domain-oriented names.

Approved:

```text
publication
source_version
cover_revision
contributor
collection
operation
```

Avoid:

```text
publications
tbl_publication
publication_table
data_publication
```

---

# 10. Column Naming

Primary identities use the entity name followed by `_id`.

Examples:

```text
publication_id
contributor_id
collection_id
operation_id
```

Foreign-key columns use the same name as the referenced identity.

Revision columns use explicit names:

```text
source_version
cover_revision
metadata_revision
aggregate_version
```

---

# 11. Primary Key Convention

Domain aggregate roots use their stable UUID identity as the primary key.

Example:

```text
publication_id uuid primary key
```

Dependent revision entities may use composite primary keys.

Example:

```text
primary key (publication_id, source_version)
```

---

# 12. Technical Metadata Columns

Mutable authoritative aggregate tables generally contain:

```text
created_at
updated_at
aggregate_version
```

Append-only tables generally contain:

```text
created_at
```

Soft-deletable entities may additionally contain:

```text
deleted_at
deleted_by
deletion_operation_id
```

---

# 13. Timestamp Types

All authoritative instant timestamps use:

```text
timestamp with time zone
```

Date-only domain values use:

```text
date
```

Time values without a date shall be used only when the domain explicitly requires them.

---

# 14. Identity Aggregate

The Identity aggregate establishes the persistent identity of the deployed Master Library and its server installation.

Its core persistence model includes:

```text
Master Library
Server Instance
Database Instance
Device
Identity Binding
```

---

# 15. Master Library Entity

The Master Library entity identifies the authoritative catalog and binary library as one logical system.

## Table

```text
identity.master_library
```

## Columns

```text
master_library_id       uuid
display_name            text
created_at              timestamptz
updated_at              timestamptz
catalog_format_version  integer
storage_layout_version  integer
state                    text
aggregate_version        bigint
```

## Primary Key

```text
master_library_id
```

## Invariants

* Exactly one active Master Library exists in a Version 1 deployment.
* `catalog_format_version` is positive.
* `storage_layout_version` is positive.
* `aggregate_version` is positive.
* State belongs to the approved lifecycle set.

---

# 16. Server Instance Entity

The Server Instance entity identifies the KnowledgeOS Server installation.

## Table

```text
identity.server_instance
```

## Columns

```text
server_id               uuid
master_library_id       uuid
instance_name           text
created_at              timestamptz
updated_at              timestamptz
state                    text
software_version        text
last_started_at         timestamptz
aggregate_version       bigint
```

## Constraints

```text
primary key (server_id)
foreign key (master_library_id)
    references identity.master_library(master_library_id)
```

A deployment may retain historical server-instance records, but only one may be active for a given role according to deployment policy.

---

# 17. Database Instance Entity

The Database Instance entity allows startup validation against accidental database replacement.

## Table

```text
identity.database_instance
```

## Columns

```text
database_instance_id    uuid
master_library_id       uuid
created_at              timestamptz
postgres_version        text
schema_version          integer
state                    text
last_migrated_at        timestamptz
```

---

# 18. Device Entity

Device represents an authorized Reader or administrative client installation.

## Table

```text
identity.device
```

## Columns

```text
device_id               uuid
master_library_id       uuid
device_name             text
device_type             text
platform                text
platform_version        text
application_version     text
registered_at           timestamptz
last_seen_at            timestamptz
revoked_at              timestamptz
state                    text
aggregate_version       bigint
```

Device identity does not imply access authorization by itself.

---

# 19. Publication Aggregate

Publication is the principal catalog aggregate.

It owns or coordinates:

* stable identity;
* lifecycle;
* canonical metadata;
* metadata revisions;
* SourceVersions;
* CoverRevisions;
* visibility;
* current-version references;
* selected external identifiers;
* deletion state.

---

# 20. Publication Persistence Model

The Publication aggregate maps to:

```text
catalog.publication
catalog.publication_metadata_revision
catalog.publication_title
catalog.publication_description
catalog.publication_language
catalog.publication_date
catalog.source_version
catalog.cover_revision
catalog.publication_external_identifier
catalog.publication_provenance
```

Relationships to independent aggregates use separate relation tables.

---

# 21. Publication Table

## Table

```text
catalog.publication
```

## Purpose

Stores the current authoritative identity and lifecycle state of a Publication.

## Columns

```text
publication_id                   uuid
master_library_id                uuid
publication_type                 text
lifecycle_state                  text
visibility_state                 text
current_metadata_revision        integer
current_source_version           integer
current_cover_revision           integer
created_at                       timestamptz
updated_at                       timestamptz
published_at                     timestamptz
deleted_at                       timestamptz
deletion_operation_id            uuid
aggregate_version                bigint
```

## Primary Key

```text
publication_id
```

## Foreign Keys

```text
master_library_id
    → identity.master_library.master_library_id

deletion_operation_id
    → operations.operation.operation_id
```

Current revision foreign keys may be added after dependent tables exist to avoid circular migration ordering.

---

# 22. Publication Type

`publication_type` identifies the high-level publication category.

Examples may include:

```text
book
article
paper
magazine
journal_issue
document
comic
manual
report
thesis
web_archive
other
```

The exact domain vocabulary is governed by the Domain model.

The relational column uses constrained text or a reference table according to vocabulary stability.

---

# 23. Publication Lifecycle State

Recommended lifecycle states:

```text
draft
active
unavailable
archived
deleted
recovery_required
```

State transitions are governed by the Domain and Application layers.

The database enforces only valid stored values and state-dependent consistency where practical.

---

# 24. Publication Visibility State

Visibility is separate from lifecycle.

Recommended values:

```text
visible
hidden
restricted
administrative_only
```

Personal Reader visibility preferences do not belong here.

---

# 25. Publication Aggregate Version

`aggregate_version` supports optimistic concurrency.

Every authoritative aggregate mutation increments this value.

Revision insertion that materially changes the Publication aggregate also increments it.

---

# 26. Publication Metadata Revision Entity

Publication metadata is revisioned.

## Table

```text
catalog.publication_metadata_revision
```

## Columns

```text
publication_id           uuid
metadata_revision        integer
created_at               timestamptz
created_by               uuid
operation_id             uuid
change_reason            text
provenance_id            uuid
is_complete              boolean
format_version           integer
```

## Primary Key

```text
(publication_id, metadata_revision)
```

## Constraints

```text
metadata_revision > 0
format_version > 0
```

Metadata revisions are immutable after commit.

---

# 27. Current Metadata Revision

`catalog.publication.current_metadata_revision` points to the current accepted metadata revision.

The reference shall match:

```text
(publication_id, current_metadata_revision)
```

in `catalog.publication_metadata_revision`.

A Publication may temporarily have no accepted metadata revision only during explicitly supported creation workflows.

---

# 28. Publication Title Entity

Titles are revision-scoped.

## Table

```text
catalog.publication_title
```

## Columns

```text
publication_id          uuid
metadata_revision       integer
title_kind              text
language_code           text
display_value           text
normalized_value        text
sort_value              text
sequence                 integer
is_primary               boolean
```

## Primary Key

A generated technical key is not required.

Recommended composite key:

```text
(
    publication_id,
    metadata_revision,
    title_kind,
    language_code,
    sequence
)
```

---

# 29. Title Kinds

Examples:

```text
main
subtitle
alternative
translated
short
series
uniform
```

At most one primary main title shall exist per metadata revision and applicable language policy.

---

# 30. Publication Description Entity

## Table

```text
catalog.publication_description
```

## Columns

```text
publication_id          uuid
metadata_revision       integer
description_kind        text
language_code           text
content                  text
sequence                 integer
```

Description kinds may include:

```text
summary
abstract
publisher_description
editorial_note
catalog_note
```

Large descriptions are separated from the hot `publication` row.

---

# 31. Publication Language Entity

## Table

```text
catalog.publication_language
```

## Columns

```text
publication_id          uuid
metadata_revision       integer
language_code           text
role                     text
sequence                 integer
```

Roles may include:

```text
primary
original
translated
parallel
unknown
```

Language codes shall use the canonical language vocabulary defined by the contracts.

---

# 32. Publication Date Entity

Publication dates may be uncertain or partially known.

## Table

```text
catalog.publication_date
```

## Columns

```text
publication_id          uuid
metadata_revision       integer
date_kind                text
date_value               date
year_value               integer
precision                 text
display_value            text
sequence                  integer
```

## Precision Values

```text
day
month
year
approximate
range
unknown
```

The model shall not fabricate month or day components when only a year is known.

---

# 33. Publication Extent Entity

Optional physical or logical extent metadata is stored separately.

## Table

```text
catalog.publication_extent
```

## Columns

```text
publication_id          uuid
metadata_revision       integer
extent_kind              text
numeric_value            bigint
unit                      text
display_value             text
sequence                  integer
```

Examples:

```text
pages
volumes
duration_seconds
file_count
```

---

# 34. Publication Publisher Entity

Publishers are initially modeled as revision-scoped credited entities unless promoted to an independent Organization aggregate.

## Table

```text
catalog.publication_publisher
```

## Columns

```text
publication_id          uuid
metadata_revision       integer
publisher_name           text
normalized_name          text
place_name               text
sequence                 integer
external_identifier_id  uuid
```

A future independent Organization aggregate may replace or complement this structure.

---

# 35. SourceVersion Entity

SourceVersion represents one immutable committed source binary version.

## Table

```text
catalog.source_version
```

## Columns

```text
publication_id          uuid
source_version          integer
storage_space           text
logical_storage_key     text
media_type              text
canonical_extension     text
original_filename       text
byte_length             bigint
checksum_algorithm      text
checksum_value          text
source_state            text
provenance_id           uuid
operation_id            uuid
created_at              timestamptz
committed_at            timestamptz
superseded_at           timestamptz
format_version          integer
```

## Primary Key

```text
(publication_id, source_version)
```

---

# 36. SourceVersion Constraints

Mandatory checks:

```text
source_version > 0
byte_length >= 0
format_version > 0
logical_storage_key <> ''
checksum_value <> ''
```

Committed source versions require:

```text
committed_at is not null
source_state = 'committed'
```

A committed SourceVersion is immutable.

---

# 37. Source State

Recommended values:

```text
prepared
committed
superseded
unavailable
quarantined
recovery_required
deleted
```

`prepared` is normally operationally transient.

Only committed or explicitly permitted historical states may be selected as current.

---

# 38. Current SourceVersion

`catalog.publication.current_source_version` references the selected current SourceVersion.

The selected row must:

* belong to the same Publication;
* exist;
* be committed;
* not be hard-deleted;
* satisfy current-source policy.

---

# 39. Source Binary Reference

The combination:

```text
storage_space
logical_storage_key
```

shall be unique for committed authoritative binary objects.

The catalog shall not persist absolute filesystem paths.

---

# 40. Source Checksum

Checksums use explicit algorithm and value columns.

Recommended initial algorithm:

```text
sha256
```

A uniqueness constraint on checksum alone is not required because duplicate content may intentionally exist under different identities.

---

# 41. CoverRevision Entity

CoverRevision represents one immutable authoritative cover revision.

## Table

```text
catalog.cover_revision
```

## Columns

```text
publication_id          uuid
cover_revision          integer
storage_space           text
logical_storage_key     text
media_type              text
canonical_extension     text
byte_length             bigint
checksum_algorithm      text
checksum_value          text
width_pixels            integer
height_pixels           integer
cover_state             text
origin_kind             text
provenance_id           uuid
operation_id            uuid
created_at              timestamptz
committed_at            timestamptz
superseded_at           timestamptz
format_version          integer
```

## Primary Key

```text
(publication_id, cover_revision)
```

---

# 42. CoverRevision Constraints

```text
cover_revision > 0
byte_length >= 0
width_pixels > 0 when not null
height_pixels > 0 when not null
format_version > 0
```

Committed cover revisions are immutable.

---

# 43. Cover Origin

Recommended values:

```text
provided
extracted
generated
scanned
imported
administrative
```

Generated does not imply derived once explicitly accepted as an authoritative CoverRevision.

---

# 44. Current CoverRevision

`catalog.publication.current_cover_revision` references the active accepted CoverRevision.

A Publication may have no cover.

---

# 45. Asset Aggregate

Asset represents an authoritative auxiliary binary object.

## Table

```text
catalog.asset
```

## Columns

```text
asset_id                uuid
master_library_id       uuid
asset_type              text
lifecycle_state         text
current_asset_version   integer
created_at              timestamptz
updated_at              timestamptz
deleted_at              timestamptz
aggregate_version       bigint
```

---

# 46. AssetVersion Entity

## Table

```text
catalog.asset_version
```

## Columns

```text
asset_id                uuid
asset_version           integer
storage_space           text
logical_storage_key     text
media_type              text
canonical_extension     text
byte_length             bigint
checksum_algorithm      text
checksum_value          text
provenance_id           uuid
operation_id            uuid
state                    text
created_at              timestamptz
committed_at            timestamptz
format_version          integer
```

## Primary Key

```text
(asset_id, asset_version)
```

---

# 47. Publication Asset Relationship

## Table

```text
catalog.publication_asset
```

## Columns

```text
publication_id          uuid
asset_id                uuid
relationship_type       text
sequence                 integer
created_at              timestamptz
created_by              uuid
operation_id            uuid
```

## Primary Key

```text
(publication_id, asset_id, relationship_type)
```

Assets remain independent aggregate roots.

Deleting a Publication shall not automatically delete a shared Asset.

---

# 48. Contributor Aggregate

Contributor represents a stable person or credited entity.

## Table

```text
catalog.contributor
```

## Columns

```text
contributor_id          uuid
contributor_type        text
preferred_name          text
normalized_name         text
sort_name               text
lifecycle_state         text
created_at              timestamptz
updated_at              timestamptz
deleted_at              timestamptz
aggregate_version       bigint
```

---

# 49. Contributor Type

Recommended initial values:

```text
person
organization
collective
unknown
```

An independent Organization aggregate may be introduced later if domain requirements justify it.

---

# 50. Contributor Alias Entity

## Table

```text
catalog.contributor_alias
```

## Columns

```text
contributor_alias_id    uuid
contributor_id          uuid
alias_kind              text
display_value           text
normalized_value        text
language_code           text
is_preferred            boolean
created_at              timestamptz
provenance_id           uuid
```

Aliases are not independent aggregate roots.

---

# 51. Publication Contributor Relationship

A Publication credit is not merely a Contributor foreign key.

It includes role, sequence and display context.

## Table

```text
catalog.publication_contributor
```

## Columns

```text
publication_id          uuid
metadata_revision       integer
contributor_id          uuid
role                     text
credit_text              text
sequence                 integer
is_primary               boolean
provenance_id           uuid
```

## Primary Key

```text
(
    publication_id,
    metadata_revision,
    contributor_id,
    role,
    sequence
)
```

---

# 52. Contributor Roles

Examples:

```text
author
editor
translator
illustrator
narrator
compiler
photographer
foreword_author
introduction_author
contributor
unknown
```

Roles are controlled vocabulary values.

---

# 53. Contributor Identity Resolution

Textual similarity shall not automatically merge Contributors.

Potential duplicates may be recorded separately for review.

---

# 54. Contributor External Identifiers

Contributor external identifiers use the generic external identifier model.

Examples:

```text
ORCID
VIAF
ISNI
Wikidata
Library of Congress authority identifier
```

---

# 55. Subject Aggregate

Subject represents a stable catalog classification concept.

## Table

```text
catalog.subject
```

## Columns

```text
subject_id              uuid
preferred_label         text
normalized_label        text
language_code           text
subject_scheme          text
lifecycle_state         text
created_at              timestamptz
updated_at              timestamptz
aggregate_version       bigint
```

---

# 56. Subject Label Entity

## Table

```text
catalog.subject_label
```

## Columns

```text
subject_label_id        uuid
subject_id              uuid
label_kind              text
language_code           text
display_value           text
normalized_value        text
created_at              timestamptz
provenance_id           uuid
```

Label kinds may include:

```text
preferred
alternative
deprecated
translated
```

---

# 57. Subject Hierarchy

## Table

```text
catalog.subject_relationship
```

## Columns

```text
parent_subject_id       uuid
child_subject_id        uuid
relationship_type       text
created_at              timestamptz
provenance_id           uuid
```

## Primary Key

```text
(parent_subject_id, child_subject_id, relationship_type)
```

Cycles shall be rejected by application validation and periodically verified by integrity processes.

---

# 58. Publication Subject Relationship

## Table

```text
catalog.publication_subject
```

## Columns

```text
publication_id          uuid
metadata_revision       integer
subject_id              uuid
assignment_kind         text
confidence              numeric
sequence                 integer
provenance_id           uuid
```

Assignment kinds may include:

```text
authoritative
imported
administrative
inferred
suggested
```

Derived suggestions shall not become authoritative assignments without explicit promotion.

---

# 59. Collection Aggregate

Collection represents a server-managed grouping.

## Table

```text
catalog.collection
```

## Columns

```text
collection_id           uuid
master_library_id       uuid
parent_collection_id    uuid
collection_type         text
display_name            text
normalized_name         text
description             text
lifecycle_state         text
created_at              timestamptz
updated_at              timestamptz
deleted_at              timestamptz
aggregate_version       bigint
```

---

# 60. Collection Hierarchy

`parent_collection_id` may reference another Collection.

Hierarchy validation shall prevent:

* self-parenting;
* cycles;
* invalid cross-library parenting.

The database enforces self-parent prohibition.

Cycle detection remains an Application and Integrity responsibility.

---

# 61. Collection Membership

## Table

```text
catalog.collection_publication
```

## Columns

```text
collection_id           uuid
publication_id          uuid
sequence                 bigint
added_at                 timestamptz
added_by                 uuid
operation_id             uuid
membership_metadata      jsonb
```

## Primary Key

```text
(collection_id, publication_id)
```

Personal Reader collections are not stored here.

---

# 62. Collection Sequence

`sequence` supports explicit ordering.

It may be sparse to reduce frequent rewrites.

Ordering strategy is defined by the Collection service.

---

# 63. External Identifier Model

External identifiers are normalized through namespaces.

The model separates:

```text
Identifier Namespace
Identifier Value
Entity Assignment
```

---

# 64. External Identifier Namespace

## Table

```text
catalog.external_identifier_namespace
```

## Columns

```text
namespace_id            uuid
namespace_code          text
display_name            text
entity_scope            text
case_sensitive          boolean
normalization_rule      text
validation_pattern      text
is_unique_per_entity    boolean
is_globally_unique      boolean
created_at              timestamptz
updated_at              timestamptz
```

Examples:

```text
isbn10
isbn13
doi
issn
orcid
viaf
isni
oclc
wikidata
provider_record_id
```

---

# 65. External Identifier

## Table

```text
catalog.external_identifier
```

## Columns

```text
external_identifier_id  uuid
namespace_id            uuid
display_value           text
normalized_value        text
created_at              timestamptz
```

## Constraints

```text
unique (namespace_id, normalized_value)
```

This uniqueness may be relaxed for namespaces whose semantics are not globally unique.

The namespace policy determines enforcement.

---

# 66. Publication External Identifier

## Table

```text
catalog.publication_external_identifier
```

## Columns

```text
publication_id          uuid
external_identifier_id  uuid
metadata_revision       integer
assignment_state        text
is_primary               boolean
provenance_id           uuid
created_at              timestamptz
```

---

# 67. Contributor External Identifier

## Table

```text
catalog.contributor_external_identifier
```

## Columns

```text
contributor_id          uuid
external_identifier_id  uuid
assignment_state        text
provenance_id           uuid
created_at              timestamptz
```

Equivalent assignment tables may be introduced for Subjects, Assets or Collections when required.

---

# 68. Provenance Aggregate

Provenance records where information originated.

## Table

```text
catalog.provenance
```

## Columns

```text
provenance_id           uuid
provenance_type         text
source_system           text
source_record_key       text
source_uri              text
provider_name           text
provider_version        text
import_batch_id         uuid
operation_id            uuid
captured_at              timestamptz
payload_format_version  integer
raw_payload_reference   text
metadata                 jsonb
```

---

# 69. Provenance Types

Examples:

```text
manual
import
provider
file_embedded
derived
administrative
migration
recovery
```

Derived provenance does not imply authoritative acceptance.

---

# 70. Raw Provider Payloads

Large provider payloads should not be embedded in hot provenance rows.

They may be stored in:

* a separate payload table;
* Binary Storage;
* operational import archives.

The provenance row stores the stable reference.

---

# 71. Provenance Payload Table

Optional table:

```text
catalog.provenance_payload
```

Columns:

```text
provenance_id           uuid
payload_format          text
payload_version         integer
payload                  jsonb
byte_length             bigint
created_at              timestamptz
```

This table shall remain outside high-frequency query paths.

---

# 72. Generic Catalog Relationships

Only relationships with stable domain semantics should use generic relationship storage.

## Table

```text
catalog.catalog_relationship
```

## Columns

```text
relationship_id         uuid
source_entity_type      text
source_entity_id        uuid
target_entity_type      text
target_entity_id        uuid
relationship_type       text
sequence                 integer
provenance_id           uuid
created_at              timestamptz
deleted_at              timestamptz
```

---

# 73. Generic Relationship Restrictions

Generic relationships shall not replace specialized relational tables for:

* Publication Contributors;
* Publication Subjects;
* Collection membership;
* current SourceVersion;
* current CoverRevision;
* security grants;
* aggregate ownership.

Generic relationships are reserved for extensible graph-like associations whose semantics do not require specialized columns.

---

# 74. Publication Relationship

Publication-to-Publication relationships may use a specialized table.

## Table

```text
catalog.publication_relationship
```

## Columns

```text
source_publication_id   uuid
target_publication_id   uuid
relationship_type       text
sequence                 integer
metadata_revision       integer
provenance_id           uuid
created_at              timestamptz
```

Examples:

```text
edition_of
translation_of
part_of
continues
continued_by
supplement_to
references
related
```

---

# 75. Edition and Work Modeling

The initial schema does not require a separate abstract Work aggregate unless the Domain model explicitly freezes it.

Publication relationships allow later migration toward:

```text
Work
Edition
Manifestation
Item
```

without using mutable title matching as identity.

---

# 76. Classification Model

Formal classification schemes may be represented separately from Subjects.

## Table

```text
catalog.classification_scheme
```

## Columns

```text
classification_scheme_id    uuid
scheme_code                 text
display_name                text
version                     text
created_at                  timestamptz
updated_at                  timestamptz
```

---

# 77. Classification Entry

## Table

```text
catalog.classification_entry
```

## Columns

```text
classification_entry_id     uuid
classification_scheme_id    uuid
code                         text
label                        text
normalized_label             text
parent_entry_id              uuid
created_at                   timestamptz
updated_at                   timestamptz
```

---

# 78. Publication Classification

## Table

```text
catalog.publication_classification
```

## Columns

```text
publication_id              uuid
metadata_revision           integer
classification_entry_id     uuid
assignment_kind             text
provenance_id               uuid
created_at                  timestamptz
```

---

# 79. Security Model

Security data is stored under the `security` schema.

It includes:

```text
principal
role
permission
principal_role
role_permission
credential
credential_revocation
access_grant
```

The exact authentication protocol is defined elsewhere.

---

# 80. Principal Entity

## Table

```text
security.principal
```

## Columns

```text
principal_id            uuid
principal_type          text
display_name            text
state                    text
created_at              timestamptz
updated_at              timestamptz
aggregate_version       bigint
```

Principals may represent:

```text
user
device
service
administrator
```

---

# 81. Role Entity

## Table

```text
security.role
```

## Columns

```text
role_id                 uuid
role_code               text
display_name            text
description             text
is_system               boolean
created_at              timestamptz
updated_at              timestamptz
```

`role_code` is unique.

---

# 82. Permission Entity

## Table

```text
security.permission
```

## Columns

```text
permission_id           uuid
permission_code         text
display_name            text
description             text
created_at              timestamptz
```

`permission_code` is unique.

---

# 83. Principal Role Assignment

## Table

```text
security.principal_role
```

## Columns

```text
principal_id            uuid
role_id                 uuid
granted_at              timestamptz
granted_by              uuid
expires_at              timestamptz
revoked_at              timestamptz
```

---

# 84. Role Permission Assignment

## Table

```text
security.role_permission
```

## Columns

```text
role_id                 uuid
permission_id           uuid
created_at              timestamptz
```

---

# 85. Credential Entity

## Table

```text
security.credential
```

## Columns

```text
credential_id           uuid
principal_id            uuid
credential_type         text
credential_fingerprint  text
secret_hash             text
public_material         text
state                    text
created_at              timestamptz
expires_at              timestamptz
last_used_at            timestamptz
revoked_at              timestamptz
aggregate_version       bigint
```

Raw reusable secrets shall not be stored.

---

# 86. Credential Fingerprint

Credential fingerprints support:

* duplicate detection;
* revocation;
* lookup;
* audit.

Fingerprint values shall not expose the original secret.

---

# 87. Audit Aggregate

Audit history is append-only.

## Table

```text
audit.audit_entry
```

## Columns

```text
audit_id                uuid
master_library_id       uuid
operation_id            uuid
correlation_id          uuid
actor_principal_id      uuid
action_code             text
target_type             text
target_id               uuid
target_revision         bigint
occurred_at             timestamptz
recorded_at             timestamptz
outcome                  text
summary                  text
details                  jsonb
```

---

# 88. Audit Entry Primary Key

```text
audit_id
```

Audit IDs are globally stable and independently generated.

---

# 89. Audit Append-Only Rule

Runtime roles shall receive:

```text
INSERT
SELECT
```

as required.

They shall not receive ordinary:

```text
UPDATE
DELETE
```

permissions on committed audit entries.

---

# 90. Audit Detail Size

Large audit payloads shall not be embedded indiscriminately.

`details` contains bounded structured context.

Large evidence belongs in audit archives or referenced Binary Storage.

---

# 91. Operation Aggregate

## Table

```text
operations.operation
```

## Columns

```text
operation_id            uuid
master_library_id       uuid
operation_type          text
operation_state         text
target_type             text
target_id               uuid
correlation_id          uuid
requested_by            uuid
created_at              timestamptz
started_at              timestamptz
updated_at              timestamptz
completed_at            timestamptz
failed_at               timestamptz
cancelled_at            timestamptz
attempt_count           integer
progress_current        bigint
progress_total          bigint
last_error_code         text
last_error_message      text
checkpoint               jsonb
aggregate_version       bigint
```

---

# 92. Operation State Constraints

State-dependent checks should ensure:

* completed operations have `completed_at`;
* failed operations have `failed_at`;
* cancelled operations have `cancelled_at`;
* progress values are non-negative;
* current progress does not exceed total when total is known;
* attempt count is non-negative.

---

# 93. Operation Event

## Table

```text
operations.operation_event
```

## Columns

```text
operation_event_id      uuid
operation_id            uuid
sequence                 bigint
event_type              text
event_time              timestamptz
state_before            text
state_after             text
details                  jsonb
```

## Constraint

```text
unique (operation_id, sequence)
```

Operation events are append-only.

---

# 94. Job Entity

## Table

```text
operations.job
```

## Columns

```text
job_id                   uuid
operation_id             uuid
job_type                 text
job_state                text
priority                 integer
available_at             timestamptz
attempt_count            integer
max_attempts             integer
lease_owner              text
lease_acquired_at        timestamptz
lease_expires_at         timestamptz
created_at               timestamptz
updated_at               timestamptz
completed_at             timestamptz
last_error_code          text
last_error_message       text
payload                  jsonb
aggregate_version        bigint
```

---

# 95. Job Indexing

Critical indexes include:

```text
(job_state, available_at, priority, job_id)
(operation_id)
(lease_expires_at)
```

Partial indexes should target runnable jobs.

Example predicate:

```text
job_state in ('pending', 'retry')
```

---

# 96. Durable Lease Entity

Where leases require independent modeling:

## Table

```text
operations.lease
```

## Columns

```text
lease_key                text
owner_id                 text
acquired_at              timestamptz
expires_at               timestamptz
renewed_at               timestamptz
fencing_token            bigint
metadata                 jsonb
```

## Primary Key

```text
lease_key
```

Fencing tokens shall increase monotonically.

---

# 97. Transactional Outbox

## Table

```text
operations.outbox_message
```

## Columns

```text
outbox_message_id       uuid
aggregate_type          text
aggregate_id            uuid
aggregate_version       bigint
message_type            text
message_version         integer
occurred_at             timestamptz
recorded_at             timestamptz
available_at            timestamptz
published_at            timestamptz
attempt_count           integer
last_error_code         text
payload                  jsonb
headers                  jsonb
```

---

# 98. Outbox Constraints

```text
message_version > 0
attempt_count >= 0
aggregate_version > 0 when applicable
```

An outbox message is immutable except for delivery state fields.

---

# 99. Outbox Indexes

Recommended indexes:

```text
(published_at, available_at, recorded_at, outbox_message_id)
(aggregate_type, aggregate_id, aggregate_version)
```

A partial index should cover unpublished messages.

---

# 100. Inbox Deduplication

## Table

```text
operations.inbox_message
```

## Columns

```text
consumer_id             text
message_id              uuid
received_at             timestamptz
processed_at            timestamptz
processing_state        text
attempt_count           integer
last_error_code         text
```

## Primary Key

```text
(consumer_id, message_id)
```

---

# 101. Import Batch Entity

## Table

```text
operations.import_batch
```

## Columns

```text
import_batch_id         uuid
operation_id            uuid
source_type             text
source_reference        text
batch_state             text
source_checksum         text
records_discovered      bigint
records_processed       bigint
records_accepted        bigint
records_rejected        bigint
records_duplicate       bigint
created_at              timestamptz
started_at              timestamptz
completed_at            timestamptz
checkpoint              jsonb
aggregate_version       bigint
```

---

# 102. Import Record Staging

Staging tables may be created under `operations` or a dedicated transient schema.

Recommended names:

```text
operations.import_publication_stage
operations.import_contributor_stage
operations.import_relationship_stage
operations.import_error
```

Staging structures are not authoritative until merged.

---

# 103. Import Error Table

## Table

```text
operations.import_error
```

## Columns

```text
import_error_id         uuid
import_batch_id         uuid
record_number           bigint
entity_type             text
error_code              text
error_message           text
raw_reference           text
details                  jsonb
created_at              timestamptz
```

---

# 104. Configuration Model

Persistent server configuration belongs under `configuration`.

## Table

```text
configuration.setting
```

## Columns

```text
setting_key             text
setting_value           jsonb
value_format_version    integer
updated_at              timestamptz
updated_by              uuid
aggregate_version       bigint
```

## Primary Key

```text
setting_key
```

Secrets shall not be stored in this table.

---

# 105. Feature State

Optional table:

```text
configuration.feature_state
```

Columns:

```text
feature_code            text
state                   text
configuration           jsonb
updated_at              timestamptz
aggregate_version       bigint
```

This is for persistent server capability state, not experimental client flags.

---

# 106. Migration Model

## Table

```text
maintenance.schema_migration
```

## Columns

```text
migration_id            text
version                 integer
checksum                text
description             text
applied_at              timestamptz
applied_by              text
execution_duration_ms   bigint
outcome                  text
compatibility_min       text
compatibility_max       text
```

## Constraints

```text
primary key (migration_id)
unique (version)
```

Applied migration content is immutable.

---

# 107. Storage Migration Model

Filesystem or cross-store migrations use:

```text
maintenance.storage_migration
```

Columns:

```text
storage_migration_id    uuid
operation_id            uuid
migration_code          text
from_layout_version     integer
to_layout_version       integer
state                   text
checkpoint              jsonb
created_at              timestamptz
started_at              timestamptz
completed_at            timestamptz
aggregate_version       bigint
```

---

# 108. Backup Model

## Table

```text
maintenance.backup
```

## Columns

```text
backup_id               uuid
master_library_id       uuid
backup_type             text
backup_state            text
catalog_method          text
catalog_reference       text
binary_reference        text
database_schema_version integer
storage_layout_version  integer
consistency_reference   text
started_at              timestamptz
completed_at            timestamptz
verified_at             timestamptz
verification_state      text
retention_until         timestamptz
aggregate_version       bigint
```

---

# 109. Backup Component

A coordinated backup may contain multiple components.

## Table

```text
maintenance.backup_component
```

## Columns

```text
backup_component_id     uuid
backup_id               uuid
component_type          text
storage_reference       text
checksum_algorithm      text
checksum_value          text
byte_length             bigint
state                    text
created_at              timestamptz
verified_at             timestamptz
```

---

# 110. Restore Model

## Table

```text
maintenance.restore
```

## Columns

```text
restore_id              uuid
backup_id               uuid
operation_id            uuid
restore_state           text
target_server_id        uuid
target_master_library_id uuid
started_at              timestamptz
completed_at            timestamptz
validation_report       jsonb
aggregate_version       bigint
```

---

# 111. Integrity Run

## Table

```text
maintenance.integrity_run
```

## Columns

```text
integrity_run_id        uuid
operation_id            uuid
run_type                text
run_state               text
scope_type              text
scope_reference         text
started_at              timestamptz
completed_at            timestamptz
objects_checked         bigint
errors_found            bigint
warnings_found          bigint
report_reference        text
aggregate_version       bigint
```

---

# 112. Integrity Finding

## Table

```text
maintenance.integrity_finding
```

## Columns

```text
integrity_finding_id    uuid
integrity_run_id        uuid
severity                text
finding_type            text
entity_type             text
entity_id               uuid
storage_reference       text
expected_value          text
actual_value            text
resolution_state        text
details                  jsonb
created_at              timestamptz
resolved_at             timestamptz
```

---

# 113. Reconciliation Run

## Table

```text
maintenance.reconciliation_run
```

## Columns

```text
reconciliation_run_id   uuid
operation_id            uuid
run_state               text
scope                    text
catalog_count           bigint
binary_count            bigint
missing_binary_count    bigint
orphan_binary_count     bigint
checksum_mismatch_count bigint
started_at              timestamptz
completed_at            timestamptz
report_reference        text
aggregate_version       bigint
```

---

# 114. Read Projection Views

The schema may define stable read views.

Recommended initial views:

```text
catalog.publication_current_view
catalog.publication_search_projection_view
catalog.publication_contributor_view
catalog.collection_publication_view
operations.active_operation_view
maintenance.backup_status_view
```

Views are not authoritative entities.

---

# 115. Publication Current View

`catalog.publication_current_view` may join:

* Publication identity;
* current metadata revision;
* primary title;
* current SourceVersion;
* current CoverRevision;
* lifecycle state;
* visibility state.

It exists to simplify high-frequency reads.

---

# 116. Search Projection View

`catalog.publication_search_projection_view` may expose:

* PublicationId;
* accepted titles;
* contributors;
* subjects;
* classifications;
* identifiers;
* descriptions;
* language;
* updated timestamp;
* aggregate version.

This view feeds Search Storage.

---

# 117. Materialized Views

Materialized views are optional.

Potential candidates:

* large administrative summary;
* contributor publication counts;
* collection statistics;
* catalog health summaries.

They remain derived and rebuildable.

---

# 118. Publication Index Strategy

Recommended core indexes:

```text
publication(master_library_id, publication_id)

publication(lifecycle_state, publication_id)

publication(updated_at, publication_id)

publication(created_at, publication_id)

publication(current_source_version)
    where current_source_version is not null

publication(current_cover_revision)
    where current_cover_revision is not null
```

The primary key already indexes `publication_id`.

---

# 119. Title Index Strategy

Recommended indexes:

```text
publication_title(normalized_value, publication_id)

publication_title(sort_value, publication_id)

publication_title(publication_id, metadata_revision)

publication_title(language_code, normalized_value)
```

A partial index may target primary titles.

---

# 120. Contributor Index Strategy

Recommended indexes:

```text
contributor(normalized_name, contributor_id)

contributor(sort_name, contributor_id)

contributor_alias(normalized_value, contributor_id)

publication_contributor(contributor_id, publication_id)

publication_contributor(publication_id, metadata_revision, sequence)
```

---

# 121. Subject Index Strategy

Recommended indexes:

```text
subject(normalized_label, subject_id)

subject_label(normalized_value, subject_id)

publication_subject(subject_id, publication_id)

publication_subject(publication_id, metadata_revision)
```

---

# 122. Collection Index Strategy

Recommended indexes:

```text
collection(master_library_id, normalized_name, collection_id)

collection(parent_collection_id, collection_id)

collection_publication(collection_id, sequence, publication_id)

collection_publication(publication_id, collection_id)
```

---

# 123. SourceVersion Index Strategy

Recommended indexes:

```text
source_version(publication_id, source_version desc)

source_version(checksum_algorithm, checksum_value)

source_version(storage_space, logical_storage_key)

source_version(source_state, committed_at, publication_id)
```

The binary storage key should be unique when committed.

---

# 124. CoverRevision Index Strategy

Recommended indexes:

```text
cover_revision(publication_id, cover_revision desc)

cover_revision(storage_space, logical_storage_key)

cover_revision(checksum_algorithm, checksum_value)
```

---

# 125. External Identifier Index Strategy

Recommended indexes:

```text
external_identifier(namespace_id, normalized_value)

publication_external_identifier(
    external_identifier_id,
    publication_id
)

publication_external_identifier(
    publication_id,
    metadata_revision
)
```

---

# 126. Audit Index Strategy

Audit is append-heavy.

Recommended indexes:

```text
audit_entry(recorded_at, audit_id)

audit_entry(target_type, target_id, recorded_at)

audit_entry(operation_id, recorded_at)

audit_entry(actor_principal_id, recorded_at)

audit_entry(correlation_id)
```

A BRIN index on `recorded_at` may be evaluated at high volume.

---

# 127. Operation Index Strategy

Recommended indexes:

```text
operation(operation_state, updated_at, operation_id)

operation(operation_type, operation_state, created_at)

operation(target_type, target_id, created_at)

operation(correlation_id)

operation(requested_by, created_at)
```

---

# 128. Partial Indexes

Recommended partial indexes include:

```text
publication
where deleted_at is null

operation
where operation_state not in (
    'completed',
    'failed',
    'cancelled'
)

outbox_message
where published_at is null

job
where job_state in ('pending', 'retry')

credential
where revoked_at is null
```

---

# 129. Full-Text Search Projection

The PostgreSQL lexical search implementation may use a dedicated table.

## Table

```text
catalog.publication_search_document
```

## Columns

```text
publication_id          uuid
aggregate_version       bigint
language_code           text
search_vector           tsvector
normalized_title        text
updated_at              timestamptz
```

## Primary Key

```text
publication_id
```

This table is derived.

---

# 130. Search Document Indexes

Recommended indexes:

```text
GIN(search_vector)

btree(normalized_title, publication_id)

btree(updated_at, publication_id)
```

A trigram index may support fuzzy title matching when operationally justified.

---

# 131. Search Projection Rebuild

The search document can be rebuilt from authoritative catalog tables.

Its loss does not represent catalog loss.

---

# 132. Partitioning Policy

Core Publication, Contributor, Subject and Collection tables are not partitioned by default.

Partitioning candidates include:

```text
audit.audit_entry
operations.operation_event
operations.outbox_message history
operations.inbox_message history
maintenance.integrity_finding
```

Partitioning shall be introduced only with measured benefit.

---

# 133. Audit Partition Candidate

Audit may be range-partitioned by `recorded_at`.

Potential granularity:

```text
monthly
quarterly
yearly
```

The decision depends on volume, retention and query behavior.

---

# 134. Outbox Retention

Published outbox messages may be archived or removed according to retention policy.

Active and unpublished messages shall remain in the operational table.

A future split may use:

```text
outbox_message
outbox_message_archive
```

---

# 135. Soft Deletion Model

Soft-deletable aggregate roots contain:

```text
deleted_at
deletion_operation_id
lifecycle_state
```

Dependent historical records are not automatically deleted.

Default read projections exclude deleted entities unless requested administratively.

---

# 136. Hard Deletion Model

Hard deletion shall occur only after:

* domain authorization;
* dependency analysis;
* audit creation;
* Binary Storage coordination;
* Search Storage cleanup;
* backup-retention evaluation;
* recovery evidence creation.

Foreign-key cascades shall not perform uncontrolled cross-aggregate deletion.

---

# 137. Constraint Naming

Constraint names follow:

```text
pk_<table>
fk_<table>__<referenced_table>
uq_<table>__<columns>
ck_<table>__<rule>
```

Examples:

```text
pk_publication
fk_source_version__publication
uq_source_version__storage_key
ck_source_version__positive_version
```

---

# 138. Index Naming

Indexes follow:

```text
ix_<table>__<columns_or_purpose>
```

Examples:

```text
ix_publication__updated_at_id
ix_title__normalized_value
ix_operation__active
ix_outbox__unpublished
```

---

# 139. Foreign-Key Deletion Rules

Default foreign-key action:

```text
ON DELETE RESTRICT
```

or PostgreSQL default equivalent.

`ON DELETE CASCADE` is reserved for:

* immutable aggregate-owned children;
* value-like dependent rows;
* revision-scoped metadata owned exclusively by the parent.

Independent aggregates use restrictive deletion.

---

# 140. Publication-Owned Cascades

Potential cascade-owned structures:

```text
publication_metadata_revision
publication_title
publication_description
publication_language
publication_date
publication_extent
```

Hard deletion of Publication remains a controlled workflow even if internal dependents cascade.

---

# 141. Independent Aggregate Restrictions

The following shall not cascade from Publication:

```text
contributor
subject
collection
asset
external_identifier namespace
principal
operation
audit_entry
```

Relationship rows may be removed according to workflow, but independent entities remain.

---

# 142. Revision Immutability

Committed rows in:

```text
publication_metadata_revision
source_version
cover_revision
asset_version
operation_event
audit_entry
```

are append-only.

Ordinary application updates are prohibited except for explicitly mutable operational state fields.

---

# 143. Current Reference Integrity

The database shall ensure that:

```text
current_metadata_revision
current_source_version
current_cover_revision
```

refer to rows owned by the same Publication.

Composite foreign keys are preferred.

---

# 144. Circular Foreign-Key Migration

Current revision references may require staged migrations:

1. Create parent table without current-reference foreign keys.
2. Create revision tables.
3. Add composite unique constraints.
4. Add current-reference foreign keys.
5. Validate constraints.

---

# 145. Aggregate Version Constraints

Aggregate versions shall satisfy:

```text
aggregate_version > 0
```

Optimistic updates use:

```text
where aggregate_id = ?
and aggregate_version = expected_version
```

and increment atomically.

---

# 146. Metadata Revision Allocation

Metadata revisions are allocated per Publication.

Allocation shall be serialized through:

* row lock;
* aggregate update;
* deterministic repository operation.

`max(metadata_revision) + 1` without locking is prohibited.

---

# 147. SourceVersion Allocation

SourceVersion allocation is scoped to Publication.

The repository shall lock or update the Publication aggregate consistently before selecting the next revision number.

---

# 148. CoverRevision Allocation

CoverRevision follows the same allocation rule as SourceVersion.

---

# 149. Sequence Fields

Sequence fields shall satisfy:

```text
sequence >= 0
```

unless the specialized contract defines positive-only values.

Sequences are ordering aids, not stable entity identities.

---

# 150. Confidence Values

Confidence values use a constrained numeric range.

Recommended:

```text
0.0 <= confidence <= 1.0
```

Null indicates no confidence value was supplied.

---

# 151. Normalized Values

Normalized columns are generated by Application or Infrastructure normalization services.

The normalization algorithm shall be versioned when changes could alter uniqueness or search behavior.

---

# 152. Normalization Version

Where required, normalized records may include:

```text
normalization_version integer
```

A normalization migration shall not silently mix incompatible algorithms.

---

# 153. JSONB Boundaries

JSONB is approved for:

* extensible operation checkpoints;
* bounded audit details;
* provider metadata;
* configuration values;
* processing headers;
* maintenance reports.

JSONB is prohibited as the sole representation of core catalog aggregates.

---

# 154. JSONB Indexing

GIN indexes on JSONB require a documented query workload.

No generic GIN index shall be added to every JSONB column.

---

# 155. Large Text Boundaries

Large text fields belong outside hot aggregate tables.

Examples:

```text
publication_description
provenance_payload
audit archive
provider payload
processing diagnostics
```

---

# 156. Database Views as Contracts

Views may provide persistence-facing compatibility contracts during migrations.

A view shall not be exposed as a permanent substitute for a missing domain model.

---

# 157. Repository Mapping

Primary repositories map as follows:

| Repository            | Principal Tables                                                       |
| --------------------- | ---------------------------------------------------------------------- |
| PublicationRepository | `publication`, metadata revision tables, source and cover references |
| ContributorRepository | `contributor`, `contributor_alias`, external identifiers           |
| SubjectRepository     | `subject`, `subject_label`, relationships                          |
| CollectionRepository  | `collection`, `collection_publication`                             |
| AssetRepository       | `asset`, `asset_version`, relationships                            |
| OperationRepository   | `operation`, `operation_event`, `job`                            |
| CredentialRepository  | `credential`, role assignments                                       |
| BackupRepository      | `backup`, `backup_component`, `restore`                          |

Repositories may use multiple tables while preserving aggregate boundaries.

---

# 158. No Table Repository Rule

The architecture prohibits one generic repository per table.

Examples of prohibited abstractions:

```text
PublicationTitleRepository
PublicationDateRepository
SourceVersionRowRepository
GenericCrudRepository<T>
```

unless they are internal implementation helpers invisible outside Infrastructure.

---

# 159. Bulk Import Mapping

Bulk import proceeds through:

```text
Raw Staging
    ↓
Normalized Staging
    ↓
Validation
    ↓
Identity Resolution
    ↓
Authoritative Merge
    ↓
Audit and Outbox
```

Staging rows are never visible as committed Publications.

---

# 160. Bulk Merge Rules

Authoritative merge shall:

* preserve stable identities;
* enforce unique constraints;
* detect conflicts;
* record provenance;
* use bounded batches;
* create audit evidence;
* emit derived-processing events;
* support restart.

---

# 161. Initial Population Strategy

The initial population of more than two million Publications should:

* load namespaces and controlled vocabularies first;
* load identity candidates;
* normalize staging data;
* resolve external identifiers;
* create Publications in batches;
* create dependent revisions;
* create relationships in batches;
* defer search and derived processing;
* analyze tables after major phases;
* validate constraints before completion.

---

# 162. Migration Rules

Every relational change requires a versioned migration.

Migrations shall not infer schema automatically from ORM models in production.

---

# 163. Additive Migration Preference

Prefer:

* adding nullable columns;
* adding new tables;
* adding unvalidated constraints;
* adding concurrent indexes;
* backfilling in batches;
* validating later;
* removing obsolete structures only after compatibility windows.

---

# 164. Column Removal

Column removal requires:

1. Stop writes to the column.
2. Deploy readers compatible without it.
3. Backfill replacement state if necessary.
4. Verify no dependency remains.
5. Remove in a later migration.

---

# 165. Column Type Changes

Large in-place type rewrites should be avoided.

Prefer:

```text
add replacement column
→ backfill
→ dual-read or dual-write temporarily
→ switch
→ remove old column
```

---

# 166. Index Migration

Large indexes should be created concurrently where supported and appropriate.

Failed concurrent indexes shall be detected and removed through maintenance workflow.

---

# 167. Constraint Validation

Large foreign keys and checks may be introduced as:

```text
NOT VALID
```

only temporarily.

They shall be validated before the migration sequence is considered complete.

---

# 168. Schema Completion Validation

A deployed catalog schema is valid only when:

* expected migrations are present;
* migration checksums match;
* required constraints are validated;
* required indexes exist;
* MasterLibraryId is valid;
* no incompatible migration remains active;
* no required backfill is incomplete.

---

# 169. Performance Validation

Representative performance validation shall include:

* Publication lookup;
* current Publication projection;
* SourceVersion history;
* external identifier resolution;
* contributor traversal;
* subject traversal;
* collection pagination;
* active operation polling;
* outbox dequeue;
* large audit insertion;
* bulk import merge.

---

# 170. Scale Assumptions

The schema shall remain operational with at least:

```text
2,000,000+ Publications
2,000,000+ current SourceVersions
millions of historical SourceVersions
millions of CoverRevisions
10,000,000+ contributor relationships
millions of subject relationships
millions of external identifier assignments
large append-only audit history
continuous outbox and operation activity
```

---

# 171. Integrity Queries

Maintenance shall support queries detecting:

* Publication current metadata reference missing;
* current SourceVersion missing;
* current CoverRevision missing;
* duplicate storage keys;
* invalid revision ordering;
* orphan relationship rows;
* invalid subject cycles;
* collection cycles;
* expired active leases;
* unpublished outbox backlog;
* operation state/timestamp contradictions;
* binary reference conflicts.

---

# 172. Catalog Schema Invariants

The following invariants are mandatory:

* `publication_id` is the stable Publication identity.
* Domain identities use UUID-compatible values.
* Publication binaries are not stored in PostgreSQL.
* SourceVersions are immutable after commit.
* CoverRevisions are immutable after commit.
* Metadata revisions are immutable after commit.
* Current revision references are explicit.
* Current references point to rows owned by the same Publication.
* Aggregate roots use optimistic concurrency versions.
* Core relationships use foreign keys.
* Core aggregate data is relational, not JSON-only.
* Personal Reader state is absent.
* Search projections are derived.
* Audit records are append-only.
* Operation events are append-only.
* Runtime roles cannot alter the schema.
* Independent aggregates do not cascade-delete each other.
* External identifiers use explicit namespaces.
* Provenance is retained for accepted imported metadata.
* Logical storage keys never contain absolute physical paths.
* Binary references include checksums and byte lengths.
* Bulk staging is not authoritative.
* Published outbox records remain operational history according to retention policy.
* Applied migrations are immutable.
* Required constraints remain validated.
* Deep pagination is supported by stable composite indexes.
* Two million Publications do not require automatic partitioning.
* Physical optimization never changes domain identity.

---

# 173. Prohibited Schema Designs

The schema shall not:

* use serial integers as public Publication identity;
* store Publications as one large JSONB document;
* store source binaries in `bytea`;
* store absolute NAS paths;
* use titles as identities;
* use original filenames as storage identities;
* merge Contributors solely by normalized name;
* store contributor lists as JSON arrays;
* store collection membership as arrays;
* store current source state only in the filesystem;
* store current revision numbers without relational references;
* use generic relationships for all domain relations;
* use unrestricted cascade deletion;
* expose audit tables to ordinary update or delete operations;
* place application tables in `public`;
* create one PostgreSQL schema per Publication type;
* partition every table prematurely;
* use unbounded text states without validation;
* hide business state transitions in triggers;
* allow runtime ORM auto-migration;
* use one repository per table as the architectural model;
* store personal annotations or reading progress;
* make materialized views authoritative;
* require search indexes for catalog recovery.

---

# 174. Catalog Schema Completion Gate

This document is complete when:

```text
[ ] PostgreSQL schemas are defined
[ ] Naming conventions are defined
[ ] Primary key strategy is defined
[ ] Identity tables are defined
[ ] Publication aggregate mapping is defined
[ ] Metadata revision model is defined
[ ] Title model is defined
[ ] Description model is defined
[ ] Language model is defined
[ ] Publication date model is defined
[ ] SourceVersion model is defined
[ ] CoverRevision model is defined
[ ] Asset model is defined
[ ] Contributor model is defined
[ ] Contributor credit model is defined
[ ] Subject model is defined
[ ] Collection model is defined
[ ] External identifier model is defined
[ ] Provenance model is defined
[ ] Publication relationship model is defined
[ ] Classification model is defined
[ ] Security model is defined
[ ] Audit model is defined
[ ] Operation model is defined
[ ] Job and lease models are defined
[ ] Outbox and inbox models are defined
[ ] Import batch model is defined
[ ] Configuration model is defined
[ ] Migration model is defined
[ ] Backup and restore models are defined
[ ] Integrity and reconciliation models are defined
[ ] Read projections are defined
[ ] Index strategy is defined
[ ] Partition candidates are defined
[ ] Foreign-key policy is defined
[ ] Cascade policy is defined
[ ] Revision allocation is defined
[ ] JSONB boundaries are defined
[ ] Repository mapping is defined
[ ] Bulk import mapping is defined
[ ] Migration rules are defined
[ ] Scale assumptions are defined
[ ] Integrity queries are defined
[ ] No SQLite catalog model remains
[ ] No binary-in-database design remains
[ ] No personal Reader state is included
[ ] No architectural contradiction remains
```

---

# 175. Related Documents

## Persistence

* `README.md`
* `StorageArchitecture.md`
* `DirectoryLayout.md`
* `CatalogDatabase.md`
* `SourceStorage.md`
* `CoverStorage.md`
* `Manifest.md`
* `IdentityStorage.md`
* `CredentialStorage.md`
* `AuditStorage.md`
* `Migrations.md`
* `BackupRestore.md`
* `Recovery.md`
* `Transactions.md`
* `Locking.md`
* `Consistency.md`
* `Integrity.md`
* `Checksums.md`
* `StagingStorage.md`

## Domain

* `../../../00-Architecture/02-Domain/DomainModel.md`
* `../../../00-Architecture/02-Domain/KnowledgeObject/KnowledgeObject.md`
* `../../../00-Architecture/02-Domain/KnowledgeObject/Metadata.md`
* `../../../00-Architecture/02-Domain/KnowledgeObject/Provenance.md`
* `../../../00-Architecture/02-Domain/KnowledgeObject/Relationships.md`
* `../../../00-Architecture/02-Domain/KnowledgeObject/Sources.md`
* `../../../00-Architecture/02-Domain/KnowledgeObject/Versioning.md`
* `../../../00-Architecture/02-Domain/Identity/README.md`

## Contracts

* `../04-Contracts/CommonTypes.md`
* `../04-Contracts/PublicationContracts.md`
* `../04-Contracts/AcquisitionContracts.md`
* `../04-Contracts/AdministrationContracts.md`
* `../04-Contracts/Versioning.md`
* `../04-Contracts/Compatibility.md`

---

# 176. Status

**Approved**

The Master Library relational catalog schema is frozen as:

```text
domain-first aggregate mapping
+
PostgreSQL bounded technical schemas
+
UUID-compatible stable identities
+
revisioned Publication metadata
+
immutable SourceVersions
+
immutable CoverRevisions
+
independent Contributor, Subject, Collection and Asset aggregates
+
relational external identifiers and provenance
+
append-only audit and operation history
+
transactional outbox
+
bulk-import staging
+
stable cursor indexes
+
measured partitioning
+
scale beyond two million Publications
```

The next document is:

```text
01-MasterLibrary/05-Persistence/SourceStorage.md
```

It shall define the complete authoritative lifecycle, contracts, commit protocol, immutable versioning, integrity, recovery, retention and access model for Publication source binaries.
