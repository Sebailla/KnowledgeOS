import type {
  PersistedSyncCheckpoint,
  PersistedSyncPlan,
  SyncClock,
  SyncPlanLease,
  SyncPlanStore,
  SyncTransferExecutor,
} from "./contracts.js";

export interface SyncWorkerOptions {
  readonly ownerId: string;
  readonly leaseMilliseconds: number;
}

export interface SyncExecutionResult {
  readonly planId: string;
  readonly status: PersistedSyncPlan["status"];
  readonly completedTransfers: number;
  readonly totalTransfers: number;
}

export class SynchronizationWorker {
  public constructor(
    private readonly store: SyncPlanStore,
    private readonly lease: SyncPlanLease,
    private readonly executor: SyncTransferExecutor,
    private readonly clock: SyncClock,
    private readonly options: SyncWorkerOptions,
  ) {}

  async executePlan(
    planId: string,
    signal: AbortSignal = new AbortController().signal,
  ): Promise<SyncExecutionResult> {
    const plan = await this.store.getPlan(planId);
    if (!plan) {
      throw new Error(`Sync plan not found: ${planId}`);
    }

    if (plan.status === "completed") {
      return {
        planId,
        status: "completed",
        completedTransfers: plan.transferIds.length,
        totalTransfers: plan.transferIds.length,
      };
    }

    const expiresAt = new Date(
      this.clock.nowMilliseconds() +
        this.options.leaseMilliseconds,
    ).toISOString();

    const acquired = await this.lease.tryAcquire(
      planId,
      this.options.ownerId,
      expiresAt,
    );

    if (!acquired) {
      throw new Error(
        `Sync plan is leased by another worker: ${planId}`,
      );
    }

    let completedTransfers = 0;

    try {
      await this.store.savePlan({
        ...plan,
        status: "running",
        updatedAt: this.clock.nowIso(),
      });

      for (const transferId of plan.transferIds) {
        if (signal.aborted) {
          await this.store.savePlan({
            ...plan,
            status: "paused",
            updatedAt: this.clock.nowIso(),
          });

          return {
            planId,
            status: "paused",
            completedTransfers,
            totalTransfers: plan.transferIds.length,
          };
        }

        const current =
          await this.store.getCheckpoint(transferId);

        if (!current) {
          throw new Error(
            `Missing sync checkpoint: ${transferId}`,
          );
        }

        if (current.completed) {
          completedTransfers += 1;
          continue;
        }

        const renewed = await this.lease.renew(
          planId,
          this.options.ownerId,
          new Date(
            this.clock.nowMilliseconds() +
              this.options.leaseMilliseconds,
          ).toISOString(),
        );

        if (!renewed) {
          throw new Error(
            `Lost sync plan lease: ${planId}`,
          );
        }

        const updated = await this.executor.execute(
          current,
          signal,
        );

        this.assertMonotonicProgress(current, updated);
        await this.store.saveCheckpoint(updated);

        if (updated.completed) {
          if (!updated.checksumVerified) {
            throw new Error(
              `Completed transfer lacks checksum verification: ${transferId}`,
            );
          }
          completedTransfers += 1;
        }
      }

      const completedPlan: PersistedSyncPlan = {
        ...plan,
        status: "completed",
        updatedAt: this.clock.nowIso(),
      };
      await this.store.savePlan(completedPlan);

      return {
        planId,
        status: "completed",
        completedTransfers,
        totalTransfers: plan.transferIds.length,
      };
    } catch (error) {
      await this.store.savePlan({
        ...plan,
        status: signal.aborted ? "paused" : "failed",
        updatedAt: this.clock.nowIso(),
      });
      throw error;
    } finally {
      await this.lease.release(
        planId,
        this.options.ownerId,
      );
    }
  }

  private assertMonotonicProgress(
    before: PersistedSyncCheckpoint,
    after: PersistedSyncCheckpoint,
  ): void {
    if (after.transferId !== before.transferId) {
      throw new Error("Transfer identity changed");
    }
    if (after.planId !== before.planId) {
      throw new Error("Plan identity changed");
    }
    if (after.receivedBytes < before.receivedBytes) {
      throw new Error("Sync progress cannot move backwards");
    }
    if (after.totalBytes !== before.totalBytes) {
      throw new Error("Transfer total bytes changed");
    }
    if (after.receivedBytes > after.totalBytes) {
      throw new Error("Received bytes exceed total bytes");
    }
  }
}
