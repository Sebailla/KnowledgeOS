export interface SyncLocalProductionConfiguration {
  readonly root: string;
  readonly localLibraryId: string;
  readonly masterBaseUrl: string;
  readonly masterAuthorizationHeader?: string;
  readonly databasePath: string;
  readonly localStoragePath: string;
  readonly stagingPath: string;
  readonly chunkBytes: number;
  readonly maximumConcurrency: number;
}

function positiveInteger(
  value: string | undefined,
  fallback: number,
  name: string,
): number {
  const parsed =
    Number(value ?? fallback);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1
  ) {
    throw new Error(
      `${name} must be a positive integer`,
    );
  }

  return parsed;
}

export function loadSyncLocalConfiguration(
  environment:
    Readonly<Record<string, string | undefined>>,
): SyncLocalProductionConfiguration {
  const root =
    environment.LOCAL_LIBRARY_ROOT;
  const localLibraryId =
    environment.LOCAL_LIBRARY_ID;
  const masterBaseUrl =
    environment.MASTER_LIBRARY_BASE_URL;

  if (!root) {
    throw new Error(
      "LOCAL_LIBRARY_ROOT is required",
    );
  }
  if (!localLibraryId) {
    throw new Error(
      "LOCAL_LIBRARY_ID is required",
    );
  }
  if (!masterBaseUrl) {
    throw new Error(
      "MASTER_LIBRARY_BASE_URL is required",
    );
  }

  return {
    root,
    localLibraryId,
    masterBaseUrl,
    ...(environment.MASTER_AUTHORIZATION
      ? {
          masterAuthorizationHeader:
            environment.MASTER_AUTHORIZATION,
        }
      : {}),
    databasePath:
      environment.LOCAL_LIBRARY_DATABASE ??
      `${root}/local-library.sqlite`,
    localStoragePath:
      environment.LOCAL_LIBRARY_STORAGE ??
      `${root}/storage`,
    stagingPath:
      environment.SYNC_STAGING_ROOT ??
      `${root}/sync-staging`,
    chunkBytes:
      positiveInteger(
        environment.SYNC_CHUNK_BYTES,
        1024 * 1024,
        "SYNC_CHUNK_BYTES",
      ),
    maximumConcurrency:
      positiveInteger(
        environment.SYNC_MAXIMUM_CONCURRENCY,
        3,
        "SYNC_MAXIMUM_CONCURRENCY",
      ),
  };
}
