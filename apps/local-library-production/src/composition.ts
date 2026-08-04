import {
  mkdir,
  statfs,
} from "node:fs/promises";
import { join } from "node:path";
import {
  LocalEvictionService,
  LocalIntegrityService,
  LocalManifestService,
} from "@knowledgeos/local-library";
import {
  SqliteLocalManifestRepository,
  SqliteLocalPublicationRepository,
  SqliteLocalStatisticsRepository,
  localLibraryMigrations,
} from "@knowledgeos/local-library-sqlite";
import {
  NodeSqliteDatabase,
} from "@knowledgeos/local-sqlite-node";
import {
  LocalFilesystemContentStore,
  LocalStorageScanner,
} from "@knowledgeos/local-storage";
import {
  LocalRepairService,
} from "@knowledgeos/local-repair";
import {
  LocalCachePlanner,
} from "@knowledgeos/local-cache";
import {
  LocalMaintenanceRunner,
} from "@knowledgeos/local-maintenance";
import type {
  LocalLibraryProductionConfiguration,
} from "./config.js";

export interface RunningLocalLibrary {
  readonly database:
    NodeSqliteDatabase;
  readonly publications:
    SqliteLocalPublicationRepository;
  readonly manifests:
    SqliteLocalManifestRepository;
  readonly statistics:
    SqliteLocalStatisticsRepository;
  runMaintenance(): Promise<
    readonly unknown[]
  >;
  close(): void;
}

export async function startLocalLibrary(
  configuration:
    LocalLibraryProductionConfiguration,
): Promise<RunningLocalLibrary> {
  await mkdir(
    configuration.root,
    { recursive: true },
  );
  await mkdir(
    configuration.storagePath,
    { recursive: true },
  );

  const database =
    new NodeSqliteDatabase({
      path:
        configuration.databasePath,
    });

  database.migrate(
    localLibraryMigrations,
  );

  const publications =
    new SqliteLocalPublicationRepository(
      database,
    );
  const manifests =
    new SqliteLocalManifestRepository(
      database,
    );
  const statistics =
    new SqliteLocalStatisticsRepository(
      database,
    );

  const content =
    new LocalFilesystemContentStore(
      configuration.storagePath,
    );
  await content.initialize();

  const scanner =
    new LocalStorageScanner(
      configuration.storagePath,
    );
  const integrity =
    new LocalIntegrityService(
      publications,
      content,
    );
  const repair =
    new LocalRepairService(
      publications,
      content,
      scanner,
    );
  const eviction =
    new LocalEvictionService(
      publications,
      content,
    );

  const maintenance =
    new LocalMaintenanceRunner(
      publications,
      integrity,
      repair,
      new LocalCachePlanner(),
      eviction,
      {
        checkpoint() {
          database.checkpoint();
        },
      },
      {
        async availableBytes() {
          const values =
            await statfs(
              configuration.storagePath,
            );
          return (
            Number(values.bavail) *
            Number(values.bsize)
          );
        },
      },
      {
        nowIso() {
          return new Date().toISOString();
        },
      },
    );

  return {
    database,
    publications,
    manifests,
    statistics,
    async runMaintenance() {
      const results =
        await maintenance.run(
          configuration.localLibraryId as never,
          {
            maximumOfflineBytes:
              configuration.maximumOfflineBytes,
            minimumFreeBytes:
              configuration.minimumFreeBytes,
            preserveRecentlyAccessedCount:
              configuration.preserveRecentlyAccessedCount,
          },
        );

      const manifest =
        await new LocalManifestService(
          publications,
          () =>
            new Date().toISOString(),
        ).create(
          configuration.localLibraryId as never,
        );

      await manifests.save(manifest);

      return results;
    },
    close() {
      database.checkpoint();
      database.close();
    },
  };
}
