import type {
  LibraryObject,
  LibraryRelationship,
} from "@knowledgeos/library-contracts";

export class LibraryObjectValidator {
  validate(object: LibraryObject): readonly string[] {
    const issues: string[] = [];

    if (!object.identity.objectId.trim()) {
      issues.push("object-id-required");
    }
    if (!object.identity.ownerId.trim()) {
      issues.push("owner-id-required");
    }
    if (!object.logicalPath.startsWith("/")) {
      issues.push("logical-path-must-be-absolute");
    }
    if (!object.title.trim()) {
      issues.push("title-required");
    }
    if (!object.contentHash.trim()) {
      issues.push("content-hash-required");
    }
    if (!Number.isInteger(object.version) || object.version < 1) {
      issues.push("version-invalid");
    }

    return issues;
  }
}

export class LibraryRelationshipValidator {
  validate(
    relationship: LibraryRelationship,
    objects: readonly LibraryObject[],
  ): readonly string[] {
    const issues: string[] = [];
    const ids = new Set(
      objects
        .filter((object) => object.identity.ownerId === relationship.ownerId)
        .map((object) => object.identity.objectId),
    );

    if (!ids.has(relationship.fromObjectId)) {
      issues.push("relationship-source-missing");
    }
    if (!ids.has(relationship.toObjectId)) {
      issues.push("relationship-target-missing");
    }
    if (relationship.fromObjectId === relationship.toObjectId) {
      issues.push("relationship-self-loop");
    }

    return issues;
  }
}

export function canonicalizeLibraryObject(
  object: LibraryObject,
): LibraryObject {
  return {
    ...object,
    logicalPath:
      object.logicalPath
        .normalize("NFKC")
        .replace(/\/+/g, "/"),
    title:
      object.title
        .normalize("NFKC")
        .replace(/\s+/g, " ")
        .trim(),
    tags:
      [...new Set(
        object.tags
          .map((tag) => tag.normalize("NFKC").trim().toLowerCase())
          .filter(Boolean),
      )].sort(),
    metadata:
      Object.fromEntries(
        Object.entries(object.metadata)
          .sort(([a], [b]) => a.localeCompare(b)),
      ),
  };
}
