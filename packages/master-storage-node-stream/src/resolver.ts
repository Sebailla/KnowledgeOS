import { stat } from "node:fs/promises";
import { join } from "node:path";
import type {
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  MasterStorageCatalog,
} from "@knowledgeos/master-storage";
import {
  MasterStorageError,
} from "@knowledgeos/master-storage";
import type {
  DirectFileRead,
  DirectReadRange,
  DirectStoredObjectDescriptor,
} from "./model.js";
import { createReadStream } from "node:fs";

export class DirectMasterStorageReader {
  public constructor(
    private readonly root: string,
    private readonly catalog: MasterStorageCatalog,
  ) {}

  async describe(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<DirectStoredObjectDescriptor> {
    const stored = await this.catalog.getByVersion(
      publicationId,
      versionId,
    );
    if (!stored) {
      throw new MasterStorageError(
        "master-storage.object-not-found",
        "Stored publication object was not found",
      );
    }

    const absolutePath = join(
      this.root,
      stored.relativePath,
    );
    const metadata = await stat(absolutePath);

    if (!metadata.isFile()) {
      throw new MasterStorageError(
        "master-storage.not-a-file",
        "Stored publication path is not a regular file",
      );
    }

    if (metadata.size !== stored.byteLength) {
      throw new MasterStorageError(
        "master-storage.length-mismatch",
        "Stored publication byte length does not match catalog",
      );
    }

    return {
      publicationId,
      versionId,
      contentFingerprint:
        stored.contentFingerprint,
      mediaType: stored.mediaType,
      byteLength: stored.byteLength,
      absolutePath,
    };
  }

  async open(
    publicationId: PublicationId,
    versionId: VersionId,
    range?: DirectReadRange,
  ): Promise<DirectFileRead> {
    const descriptor = await this.describe(
      publicationId,
      versionId,
    );

    if (
      range &&
      (
        range.start < 0 ||
        range.endInclusive < range.start ||
        range.start >= descriptor.byteLength
      )
    ) {
      throw new RangeError("Invalid direct file range");
    }

    const normalizedRange = range
      ? {
          start: range.start,
          endInclusive: Math.min(
            range.endInclusive,
            descriptor.byteLength - 1,
          ),
        }
      : undefined;

    const stream = createReadStream(
      descriptor.absolutePath,
      normalizedRange
        ? {
            start: normalizedRange.start,
            end: normalizedRange.endInclusive,
          }
        : undefined,
    );

    return {
      descriptor,
      ...(normalizedRange === undefined
        ? {}
        : { range: normalizedRange }),
      contentLength: normalizedRange
        ? normalizedRange.endInclusive -
          normalizedRange.start +
          1
        : descriptor.byteLength,
      stream,
    };
  }
}
