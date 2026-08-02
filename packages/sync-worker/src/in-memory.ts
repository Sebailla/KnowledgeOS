import type {
  PersistedSyncCheckpoint,
  PersistedSyncPlan,
  SyncPlanLease,
  SyncPlanStore,
} from "./contracts.js";

export class InMemorySyncPlanStore
implements SyncPlanStore {
  private readonly plans =
    new Map<string, PersistedSyncPlan>();
  private readonly checkpoints =
    new Map<string, PersistedSyncCheckpoint>();

  async getPlan(planId: string) {
    return this.plans.get(planId);
  }

  async savePlan(
    plan: PersistedSyncPlan,
  ): Promise<void> {
    this.plans.set(plan.planId, plan);
  }

  async getCheckpoint(transferId: string) {
    return this.checkpoints.get(transferId);
  }

  async saveCheckpoint(
    checkpoint: PersistedSyncCheckpoint,
  ): Promise<void> {
    this.checkpoints.set(
      checkpoint.transferId,
      checkpoint,
    );
  }
}

export class InMemorySyncPlanLease
implements SyncPlanLease {
  private readonly values =
    new Map<string, {
      ownerId: string;
      expiresAt: string;
    }>();

  async tryAcquire(
    planId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<boolean> {
    const existing = this.values.get(planId);
    if (
      existing &&
      Date.parse(existing.expiresAt) >= Date.now()
    ) {
      return false;
    }

    this.values.set(planId, {
      ownerId,
      expiresAt,
    });
    return true;
  }

  async renew(
    planId: string,
    ownerId: string,
    expiresAt: string,
  ): Promise<boolean> {
    const existing = this.values.get(planId);
    if (!existing || existing.ownerId !== ownerId) {
      return false;
    }

    this.values.set(planId, {
      ownerId,
      expiresAt,
    });
    return true;
  }

  async release(
    planId: string,
    ownerId: string,
  ): Promise<void> {
    const existing = this.values.get(planId);
    if (existing?.ownerId === ownerId) {
      this.values.delete(planId);
    }
  }
}
