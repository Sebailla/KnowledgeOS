export interface LocalLibraryProductionConfiguration {
  readonly root: string;
  readonly databasePath: string;
  readonly storagePath: string;
  readonly localLibraryId: string;
  readonly maximumOfflineBytes: number;
  readonly minimumFreeBytes: number;
  readonly preserveRecentlyAccessedCount: number;
}

function integer(
  value: string | undefined,
  fallback: number,
  name: string,
): number {
  const parsed = Number(
    value ?? fallback,
  );

  if (
    !Number.isInteger(parsed) ||
    parsed < 0
  ) {
    throw new Error(
      `${name} must be a non-negative integer`,
    );
  }

  return parsed;
}

export function loadLocalLibraryConfiguration(
  environment:
    Readonly<Record<string, string | undefined>>,
): LocalLibraryProductionConfiguration {
  const root =
    environment.LOCAL_LIBRARY_ROOT;
  const localLibraryId =
    environment.LOCAL_LIBRARY_ID;

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

  return {
    root,
    databasePath:
      environment.LOCAL_LIBRARY_DATABASE ??
      `${root}/local-library.sqlite`,
    storagePath:
      environment.LOCAL_LIBRARY_STORAGE ??
      `${root}/storage`,
    localLibraryId,
    maximumOfflineBytes:
      integer(
        environment.MAXIMUM_OFFLINE_BYTES,
        20 * 1024 * 1024 * 1024,
        "MAXIMUM_OFFLINE_BYTES",
      ),
    minimumFreeBytes:
      integer(
        environment.MINIMUM_FREE_BYTES,
        5 * 1024 * 1024 * 1024,
        "MINIMUM_FREE_BYTES",
      ),
    preserveRecentlyAccessedCount:
      integer(
        environment.PRESERVE_RECENT_COUNT,
        20,
        "PRESERVE_RECENT_COUNT",
      ),
  };
}
