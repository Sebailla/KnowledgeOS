import type {
  LocalPublicationRecord,
} from "@knowledgeos/local-library";
import type {
  LocalCacheDecision,
  LocalCachePolicy,
} from "./model.js";

function accessTime(
  value: LocalPublicationRecord,
): number {
  const parsed = value.lastAccessedAt
    ? Date.parse(value.lastAccessedAt)
    : 0;

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

export class LocalCachePlanner {
  public plan(
    records:
      readonly LocalPublicationRecord[],
    policy:
      LocalCachePolicy,
    availableFilesystemBytes:
      number,
  ): LocalCacheDecision {
    const offline =
      records.filter(
        (record) =>
          record.readableOffline,
      );

    const total =
      offline.reduce(
        (sum, record) =>
          sum + record.byteLength,
        0,
      );

    const targetByCapacity =
      policy.maximumOfflineBytes;
    const targetByFreeSpace =
      Math.max(
        0,
        total +
          availableFilesystemBytes -
          policy.minimumFreeBytes,
      );

    const target =
      Math.min(
        targetByCapacity,
        targetByFreeSpace,
      );

    if (total <= target) {
      return {
        keep: offline,
        evict: [],
        projectedOfflineBytes:
          total,
      };
    }

    const pinned =
      offline.filter(
        (record) => record.pinned,
      );
    const candidates =
      offline
        .filter(
          (record) => !record.pinned,
        )
        .sort(
          (a, b) =>
            accessTime(a) -
            accessTime(b),
        );

    const recentlyAccessed =
      new Set(
        (
          policy.preserveRecentlyAccessedCount > 0
            ? candidates.slice(
                -policy.preserveRecentlyAccessedCount,
              )
            : []
        ).map(
          (record) =>
            record.publicationId,
        ),
      );

    const evict:
      LocalPublicationRecord[] = [];
    let projected = total;

    for (const record of candidates) {
      if (projected <= target) {
        break;
      }

      if (
        recentlyAccessed.has(
          record.publicationId,
        )
      ) {
        continue;
      }

      evict.push(record);
      projected -= record.byteLength;
    }

    return {
      keep:
        offline.filter(
          (record) =>
            !evict.some(
              (candidate) =>
                candidate.publicationId ===
                record.publicationId,
            ),
        ),
      evict,
      projectedOfflineBytes:
        projected,
    };
  }
}
