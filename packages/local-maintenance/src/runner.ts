import type {
  LocalLibraryId,
} from "@knowledgeos/domain-types";
import type {
  LocalPublicationRepository,
} from "@knowledgeos/local-library";
import type {
  LocalIntegrityService,
  LocalEvictionService,
} from "@knowledgeos/local-library";
import type {
  LocalCachePlanner,
  LocalCachePolicy,
} from "@knowledgeos/local-cache";
import type {
  LocalRepairService,
} from "@knowledgeos/local-repair";
import type {
  LocalMaintenanceClock,
  LocalMaintenanceTaskResult,
} from "./contracts.js";

export interface LocalCheckpointService {
  checkpoint(): Promise<void> | void;
}

export interface LocalFilesystemCapacity {
  availableBytes(): Promise<number>;
}

export class LocalMaintenanceRunner {
  public constructor(
    private readonly publications:
      LocalPublicationRepository,
    private readonly integrity:
      LocalIntegrityService,
    private readonly repair:
      LocalRepairService,
    private readonly cache:
      LocalCachePlanner,
    private readonly eviction:
      LocalEvictionService,
    private readonly checkpointService:
      LocalCheckpointService,
    private readonly capacity:
      LocalFilesystemCapacity,
    private readonly clock:
      LocalMaintenanceClock,
  ) {}

  async run(
    localLibraryId: LocalLibraryId,
    policy: LocalCachePolicy,
  ): Promise<
    readonly LocalMaintenanceTaskResult[]
  > {
    const results:
      LocalMaintenanceTaskResult[] = [];

    try {
      const issues =
        await this.integrity.inspect(
          localLibraryId,
        );
      results.push({
        task: "integrity",
        status: "completed",
        details: {
          issues:
            issues.length,
          completedAt:
            this.clock.nowIso(),
        },
      });
    } catch (error) {
      results.push({
        task: "integrity",
        status: "failed",
        details: {
          error:
            error instanceof Error
              ? error.message
              : "Unknown integrity error",
        },
      });
    }

    try {
      const report =
        await this.repair.markInvalidRecords(
          localLibraryId,
        );
      results.push({
        task: "repair",
        status: "completed",
        details: {
          issues:
            report.issues.length,
          repaired:
            report.repaired.length,
        },
      });
    } catch (error) {
      results.push({
        task: "repair",
        status: "failed",
        details: {
          error:
            error instanceof Error
              ? error.message
              : "Unknown repair error",
        },
      });
    }

    try {
      const records =
        await this.publications.list(
          localLibraryId,
        );
      const available =
        await this.capacity.availableBytes();
      const plan =
        this.cache.plan(
          records,
          policy,
          available,
        );

      for (const record of plan.evict) {
        await this.eviction.evict(
          localLibraryId,
          record.publicationId,
        );
      }

      results.push({
        task: "cache",
        status: "completed",
        details: {
          evicted:
            plan.evict.length,
          projectedOfflineBytes:
            plan.projectedOfflineBytes,
        },
      });
    } catch (error) {
      results.push({
        task: "cache",
        status: "failed",
        details: {
          error:
            error instanceof Error
              ? error.message
              : "Unknown cache error",
        },
      });
    }

    try {
      await this.checkpointService.checkpoint();
      results.push({
        task: "checkpoint",
        status: "completed",
        details: {},
      });
    } catch (error) {
      results.push({
        task: "checkpoint",
        status: "failed",
        details: {
          error:
            error instanceof Error
              ? error.message
              : "Unknown checkpoint error",
        },
      });
    }

    return results;
  }
}
