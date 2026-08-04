import {
  mkdir,
} from "node:fs/promises";
import {
  CommitLocalAcquisitionService,
} from "@knowledgeos/local-library";
import {
  SqliteLocalPublicationRepository,
  localLibraryMigrations,
} from "@knowledgeos/local-library-sqlite";
import {
  NodeSqliteDatabase,
} from "@knowledgeos/local-sqlite-node";
import {
  LocalFilesystemContentStore,
} from "@knowledgeos/local-storage";
import {
  SyncToLocalTransferExecutor,
} from "@knowledgeos/sync-local-runtime";
import {
  SqliteTransferDescriptorRepository,
  SqliteTransferStateRepository,
  syncLocalSqliteMigrations,
} from "@knowledgeos/sync-local-sqlite";
import {
  FilesystemResumableLocalStaging,
} from "@knowledgeos/sync-staging-node";
import {
  MasterHttpRangeClient,
} from "@knowledgeos/sync-master-http";
import {
  SyncScheduler,
} from "@knowledgeos/sync-scheduler";
import type {
  MasterTransferDescriptor,
} from "@knowledgeos/sync-local-runtime";
import type {
  SyncLocalProductionConfiguration,
} from "./config.js";

export interface RunningSyncLocalProduction {
  registerTransfer(
    descriptor: MasterTransferDescriptor,
  ): Promise<void>;
  enqueue(
    job: {
      readonly jobId: string;
      readonly planId: string;
      readonly transferId: string;
      readonly priority: number;
    },
  ): void;
  drain(): Promise<void>;
  getState(
    transferId: string,
  ): Promise<unknown>;
  close(): void;
}

export async function startSyncLocalProduction(
  configuration:
    SyncLocalProductionConfiguration,
): Promise<RunningSyncLocalProduction> {
  await Promise.all([
    mkdir(
      configuration.root,
      { recursive: true },
    ),
    mkdir(
      configuration.localStoragePath,
      { recursive: true },
    ),
    mkdir(
      configuration.stagingPath,
      { recursive: true },
    ),
  ]);

  const database =
    new NodeSqliteDatabase({
      path:
        configuration.databasePath,
    });

  database.migrate([
    ...localLibraryMigrations,
    ...syncLocalSqliteMigrations,
  ]);

  const publications =
    new SqliteLocalPublicationRepository(
      database,
    );
  const descriptors =
    new SqliteTransferDescriptorRepository(
      database,
    );
  const states =
    new SqliteTransferStateRepository(
      database,
    );
  const content =
    new LocalFilesystemContentStore(
      configuration.localStoragePath,
    );
  await content.initialize();

  const acquisition =
    new CommitLocalAcquisitionService(
      publications,
      content,
      () =>
        new Date().toISOString(),
    );

  const executor =
    new SyncToLocalTransferExecutor(
      descriptors,
      states,
      new MasterHttpRangeClient({
        baseUrl:
          configuration.masterBaseUrl,
        ...(configuration
          .masterAuthorizationHeader
          ? {
              authorizationHeader:
                configuration
                  .masterAuthorizationHeader,
            }
          : {}),
      }),
      new FilesystemResumableLocalStaging(
        configuration.stagingPath,
      ),
      acquisition,
      {
        nowIso() {
          return new Date().toISOString();
        },
      },
      {
        chunkBytes:
          configuration.chunkBytes,
      },
    );

  const transferByPlan =
    new Map<string, string>();

  const scheduler =
    new SyncScheduler(
      configuration.maximumConcurrency,
      {
        async execute(planId) {
          const transferId =
            transferByPlan.get(planId);

          if (!transferId) {
            throw new Error(
              `Transfer not registered for plan ${planId}`,
            );
          }

          await executor.execute(
            transferId,
          );
        },
      },
    );

  return {
    async registerTransfer(
      descriptor,
    ) {
      await descriptors.save(
        descriptor,
      );
      transferByPlan.set(
        descriptor.planId,
        descriptor.transferId,
      );
    },
    enqueue(job) {
      transferByPlan.set(
        job.planId,
        job.transferId,
      );

      scheduler.enqueue({
        jobId: job.jobId,
        planId: job.planId,
        priority: job.priority,
        enqueuedAt:
          new Date().toISOString(),
        status: "queued",
        attempts: 0,
      });
    },
    async drain() {
      await scheduler.drain();
    },
    async getState(
      transferId,
    ) {
      return states.get(
        transferId,
      );
    },
    close() {
      database.checkpoint();
      database.close();
    },
  };
}
