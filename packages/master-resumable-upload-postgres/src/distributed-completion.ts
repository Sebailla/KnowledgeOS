import type {
  RegisterMasterArtifactResult,
} from "@knowledgeos/master-registration-workflow";
import type {
  ResumableUploadService,
} from "@knowledgeos/master-resumable-upload";
import type {
  UploadCompletionLeaseRepository,
} from "./lease-repository.js";
import type {
  UploadCompletionRepository,
} from "./idempotency-repository.js";

export interface DistributedCompletionClock {
  nowMilliseconds(): number;
  nowIso(): string;
}

export interface DistributedCompletionOptions {
  readonly ownerId: string;
  readonly leaseMilliseconds: number;
}

export class DistributedUploadCompletionService {
  public constructor(
    private readonly uploads: ResumableUploadService,
    private readonly leases: UploadCompletionLeaseRepository,
    private readonly completions: UploadCompletionRepository,
    private readonly clock: DistributedCompletionClock,
    private readonly options: DistributedCompletionOptions,
  ) {}

  async complete(
    sessionId: string,
  ): Promise<RegisterMasterArtifactResult> {
    const existing =
      await this.completions.get(sessionId);

    if (existing) {
      return {
        publicationId:
          existing.publicationId as RegisterMasterArtifactResult["publicationId"],
        versionId:
          existing.versionId as RegisterMasterArtifactResult["versionId"],
        duplicate: false,
        storage: undefined as never,
      };
    }

    const expiresAt = new Date(
      this.clock.nowMilliseconds() +
      this.options.leaseMilliseconds,
    ).toISOString();

    const acquired = await this.leases.tryAcquire(
      sessionId,
      this.options.ownerId,
      expiresAt,
    );

    if (!acquired) {
      throw new Error(
        "Upload completion is owned by another server instance",
      );
    }

    try {
      const secondCheck =
        await this.completions.get(sessionId);

      if (secondCheck) {
        return {
          publicationId:
            secondCheck.publicationId as RegisterMasterArtifactResult["publicationId"],
          versionId:
            secondCheck.versionId as RegisterMasterArtifactResult["versionId"],
          duplicate: false,
          storage: undefined as never,
        };
      }

      const result =
        await this.uploads.complete(sessionId);

      await this.completions.save({
        sessionId,
        publicationId: result.publicationId,
        versionId: result.versionId,
        completedAt: this.clock.nowIso(),
      });

      return result;
    } finally {
      await this.leases.release(
        sessionId,
        this.options.ownerId,
      );
    }
  }
}
