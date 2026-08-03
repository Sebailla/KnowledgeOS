import {
  access,
  mkdir,
  open,
  readFile,
  rename,
  stat,
  unlink,
} from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import type {
  ContentFingerprint,
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import {
  type MasterStorageCatalog,
} from "./catalog.js";
import { sha256 } from "./checksum.js";
import { MasterStorageError } from "./errors.js";
import type {
  StagedPublicationObject,
  StorageCommitRequest,
  StoredPublicationObject,
} from "./model.js";
import {
  createStoragePaths,
  objectRelativePath,
  type StoragePaths,
} from "./path-policy.js";

export class MasterPublicationStorage {
  private readonly paths: StoragePaths;

  public constructor(
    root: string,
    private readonly catalog: MasterStorageCatalog,
  ) {
    this.paths = createStoragePaths(root);
  }

  async initialize(): Promise<void> {
    await Promise.all([
      mkdir(this.paths.objects, { recursive: true }),
      mkdir(this.paths.staging, { recursive: true }),
      mkdir(this.paths.quarantine, { recursive: true }),
    ]);
  }

  async stage(
    data: Uint8Array,
    mediaType: string,
  ): Promise<StagedPublicationObject> {
    if (!mediaType.trim()) {
      throw new MasterStorageError(
        "master-storage.media-type-required",
        "Media type is required",
      );
    }

    await this.initialize();

    const fingerprint = sha256(data);
    const stagingId = randomUUID();
    const temporaryPath = join(
      this.paths.staging,
      `${stagingId}.part`,
    );

    const handle = await open(temporaryPath, "wx");
    try {
      await handle.writeFile(data);
      await handle.sync();
    } finally {
      await handle.close();
    }

    const metadata = await stat(temporaryPath);

    return {
      stagingId,
      temporaryPath,
      contentFingerprint: fingerprint,
      byteLength: metadata.size,
      mediaType,
    };
  }

  async commit(
    request: StorageCommitRequest,
  ): Promise<StoredPublicationObject> {
    const relativePath = objectRelativePath(
      request.staged.contentFingerprint,
    );
    const target = join(this.paths.root, relativePath);
    await mkdir(dirname(target), { recursive: true });

    const existing = await this.exists(target);
    if (existing) {
      const content = await readFile(target);
      const fingerprint = sha256(content);
      if (fingerprint !== request.staged.contentFingerprint) {
        throw new MasterStorageError(
          "master-storage.fingerprint-conflict",
          "Existing content-addressed object has an invalid checksum",
        );
      }
      await this.deleteIfExists(request.staged.temporaryPath);
    } else {
      await rename(request.staged.temporaryPath, target);
    }

    const stored: StoredPublicationObject = {
      publicationId: request.publicationId,
      versionId: request.versionId,
      sourceItemId: request.sourceItemId,
      contentFingerprint:
        request.staged.contentFingerprint,
      byteLength: request.staged.byteLength,
      relativePath,
      mediaType: request.staged.mediaType,
    };

    await this.catalog.save(stored);
    return stored;
  }

  async read(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<Uint8Array> {
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
      this.paths.root,
      stored.relativePath,
    );
    const data = await readFile(absolutePath);
    const actual = sha256(data);

    if (actual !== stored.contentFingerprint) {
      throw new MasterStorageError(
        "master-storage.integrity-failed",
        "Stored publication checksum does not match catalog",
      );
    }

    return data;
  }

  async verify(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<boolean> {
    try {
      await this.read(publicationId, versionId);
      return true;
    } catch {
      return false;
    }
  }

  async deleteCatalogReference(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<void> {
    await this.catalog.deleteByVersion(
      publicationId,
      versionId,
    );
  }

  private async exists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async deleteIfExists(path: string): Promise<void> {
    try {
      await unlink(path);
    } catch {
      return;
    }
  }
}
