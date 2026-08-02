import type {
  LibraryObject,
  LibraryRelationship,
  LibrarySnapshot,
} from "@knowledgeos/library-contracts";

export interface LibraryIntegrityIssue {
  readonly code: string;
  readonly subjectId: string;
  readonly message: string;
}

export class LibraryIntegrityChecker {
  check(
    objects: readonly LibraryObject[],
    relationships: readonly LibraryRelationship[],
  ): readonly LibraryIntegrityIssue[] {
    const issues: LibraryIntegrityIssue[] = [];
    const ids = new Set<string>();
    const paths = new Set<string>();

    for (const object of objects) {
      const key = `${object.identity.ownerId}::${object.identity.objectId}`;
      if (ids.has(key)) {
        issues.push({
          code: "duplicate-object-id",
          subjectId: object.identity.objectId,
          message: "Duplicate object identity",
        });
      }
      ids.add(key);

      const pathKey = `${object.identity.ownerId}::${object.logicalPath}`;
      if (paths.has(pathKey) && !object.deletedAt) {
        issues.push({
          code: "duplicate-logical-path",
          subjectId: object.identity.objectId,
          message: "Duplicate logical path",
        });
      }
      if (!object.deletedAt) paths.add(pathKey);
    }

    for (const relationship of relationships) {
      const from = `${relationship.ownerId}::${relationship.fromObjectId}`;
      const to = `${relationship.ownerId}::${relationship.toObjectId}`;

      if (!ids.has(from)) {
        issues.push({
          code: "broken-relationship-source",
          subjectId: relationship.relationshipId,
          message: "Relationship source is missing",
        });
      }
      if (!ids.has(to)) {
        issues.push({
          code: "broken-relationship-target",
          subjectId: relationship.relationshipId,
          message: "Relationship target is missing",
        });
      }
    }

    return issues;
  }

  validateSnapshot(snapshot: LibrarySnapshot): readonly LibraryIntegrityIssue[] {
    if (snapshot.sequence < 0) {
      return [{
        code: "snapshot-sequence-invalid",
        subjectId: snapshot.snapshotId,
        message: "Snapshot sequence cannot be negative",
      }];
    }

    return this.check(snapshot.objects, snapshot.relationships);
  }
}
