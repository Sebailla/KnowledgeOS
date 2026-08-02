import { randomUUID } from "node:crypto";
import type {
  RegisterMasterArtifactInput,
  RegisterMasterArtifactResult,
} from "@knowledgeos/master-registration-workflow";
import type {
  MasterRegistrationWorkflow,
} from "@knowledgeos/master-registration-workflow";
import { sha256Hex } from "./checksum.js";
import type {
  UploadChunkRecord,
  UploadSession,
  UploadSessionMetadata,
  UploadSessionProgress,
} from "./model.js";
import type {
  UploadSessionStore,
} from "./session-store.js";

export interface ResumableUploadClock {
  nowIso(): string;
}

export class SystemResumableUploadClock
implements ResumableUploadClock {
  nowIso(): string {
    return new Date().toISOString();
  }
}

export class ResumableUploadService {
  public constructor(
    private readonly store: UploadSessionStore,
    private readonly registration: MasterRegistrationWorkflow,
    private readonly clock: ResumableUploadClock =
      new SystemResumableUploadClock(),
  ) {}

  async createSession(
    metadata: UploadSessionMetadata,
  ): Promise<UploadSession> {
    if (
      metadata.expectedByteLength < 0 ||
      !Number.isInteger(metadata.expectedByteLength)
    ) {
      throw new Error(
        "expectedByteLength must be a non-negative integer",
      );
    }

    if (
      metadata.expectedChunkCount < 1 ||
      !Number.isInteger(metadata.expectedChunkCount)
    ) {
      throw new Error(
        "expectedChunkCount must be a positive integer",
      );
    }

    const now = this.clock.nowIso();
    const session: UploadSession = {
      sessionId: randomUUID(),
      status: "open",
      metadata,
      chunks: [],
      createdAt: now,
      updatedAt: now,
    };

    await this.store.create(session);
    return session;
  }

  async putChunk(
    sessionId: string,
    index: number,
    bytes: Uint8Array,
    expectedChecksum: string,
  ): Promise<UploadSessionProgress> {
    const session = await this.requireOpenSession(
      sessionId,
    );

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= session.metadata.expectedChunkCount
    ) {
      throw new Error("Chunk index is out of range");
    }

    const checksum = sha256Hex(bytes);
    if (checksum !== expectedChecksum) {
      throw new Error("Chunk checksum mismatch");
    }

    const existing = session.chunks.find(
      (chunk) => chunk.index === index,
    );

    if (existing) {
      if (
        existing.checksum !== checksum ||
        existing.byteLength !== bytes.byteLength
      ) {
        throw new Error(
          "Chunk index already contains different content",
        );
      }
      return this.progress(session);
    }

    const record: UploadChunkRecord = {
      index,
      byteLength: bytes.byteLength,
      checksum,
      path: `chunks/${index
        .toString()
        .padStart(8, "0")}.part`,
    };

    await this.store.saveChunk(
      sessionId,
      record,
      bytes,
    );

    const updated: UploadSession = {
      ...session,
      chunks: [...session.chunks, record].sort(
        (a, b) => a.index - b.index,
      ),
      updatedAt: this.clock.nowIso(),
    };
    await this.store.save(updated);

    return this.progress(updated);
  }

  async getProgress(
    sessionId: string,
  ): Promise<UploadSessionProgress> {
    const session = await this.requireSession(
      sessionId,
    );
    return this.progress(session);
  }

  async complete(
    sessionId: string,
  ): Promise<RegisterMasterArtifactResult> {
    const session = await this.requireSession(
      sessionId,
    );

    if (session.status === "completed") {
      throw new Error(
        "Upload session is already completed",
      );
    }
    if (session.status !== "open") {
      throw new Error(
        `Upload session cannot complete from status ${session.status}`,
      );
    }

    const progress = this.progress(session);
    if (progress.missingChunkIndexes.length > 0) {
      throw new Error("Upload session is incomplete");
    }

    const assembling: UploadSession = {
      ...session,
      status: "assembling",
      updatedAt: this.clock.nowIso(),
    };
    await this.store.save(assembling);

    try {
      const chunks: Uint8Array[] = [];
      for (
        let index = 0;
        index < session.metadata.expectedChunkCount;
        index += 1
      ) {
        chunks.push(
          await this.store.readChunk(
            sessionId,
            index,
          ),
        );
      }

      const data = Buffer.concat(chunks);
      if (
        data.byteLength !==
        session.metadata.expectedByteLength
      ) {
        throw new Error(
          "Assembled upload length does not match expectation",
        );
      }

      const input: RegisterMasterArtifactInput = {
        publicationId:
          session.metadata.publicationId,
        knowledgeObjectId:
          session.metadata.knowledgeObjectId,
        sourceItemId:
          session.metadata.sourceItemId,
        versionId:
          session.metadata.versionId,
        title:
          session.metadata.title,
        authors:
          session.metadata.authors,
        mediaType:
          session.metadata.mediaType,
        data,
      };

      const result =
        await this.registration.execute(input);

      await this.store.save({
        ...assembling,
        status: "completed",
        completedPublicationId:
          result.publicationId,
        completedVersionId:
          result.versionId,
        updatedAt: this.clock.nowIso(),
      });

      return result;
    } catch (error) {
      await this.store.save({
        ...assembling,
        status: "failed",
        updatedAt: this.clock.nowIso(),
      });
      throw error;
    }
  }

  async cancel(sessionId: string): Promise<void> {
    const session = await this.requireSession(
      sessionId,
    );
    if (session.status === "completed") {
      throw new Error(
        "Completed upload cannot be cancelled",
      );
    }
    await this.store.save({
      ...session,
      status: "cancelled",
      updatedAt: this.clock.nowIso(),
    });
  }

  async deleteSession(
    sessionId: string,
  ): Promise<void> {
    await this.store.delete(sessionId);
  }

  private async requireSession(
    sessionId: string,
  ): Promise<UploadSession> {
    const session = await this.store.get(sessionId);
    if (!session) {
      throw new Error(
        `Upload session not found: ${sessionId}`,
      );
    }
    return session;
  }

  private async requireOpenSession(
    sessionId: string,
  ): Promise<UploadSession> {
    const session = await this.requireSession(
      sessionId,
    );
    if (session.status !== "open") {
      throw new Error(
        `Upload session is not open: ${session.status}`,
      );
    }
    return session;
  }

  private progress(
    session: UploadSession,
  ): UploadSessionProgress {
    const received = new Set(
      session.chunks.map((chunk) => chunk.index),
    );
    const missing: number[] = [];

    for (
      let index = 0;
      index < session.metadata.expectedChunkCount;
      index += 1
    ) {
      if (!received.has(index)) missing.push(index);
    }

    return {
      sessionId: session.sessionId,
      status: session.status,
      receivedChunks: session.chunks.length,
      expectedChunkCount:
        session.metadata.expectedChunkCount,
      receivedBytes: session.chunks.reduce(
        (sum, chunk) => sum + chunk.byteLength,
        0,
      ),
      expectedByteLength:
        session.metadata.expectedByteLength,
      missingChunkIndexes: missing,
    };
  }
}
