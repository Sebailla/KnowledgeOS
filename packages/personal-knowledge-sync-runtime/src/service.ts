import type {
  PersonalKnowledgeAuditRepository,
  PersonalKnowledgeConflictStore,
  PersonalKnowledgeCursorRepository,
  PersonalKnowledgeDevice,
  PersonalKnowledgeDeviceRepository,
  PersonalKnowledgeEventRepository,
  PersonalKnowledgeSyncEvent,
} from "./contracts.js";

export interface RuntimeClock {
  nowIso(): string;
}

export interface AuthenticatedPersonalKnowledgePrincipal {
  readonly ownerId: string;
  readonly deviceId: string;
  readonly scopes: readonly string[];
}

export class PersonalKnowledgeProductionRuntime {
  public constructor(
    private readonly devices:
      PersonalKnowledgeDeviceRepository,
    private readonly events:
      PersonalKnowledgeEventRepository,
    private readonly cursors:
      PersonalKnowledgeCursorRepository,
    private readonly conflicts:
      PersonalKnowledgeConflictStore,
    private readonly audit:
      PersonalKnowledgeAuditRepository,
    private readonly clock:
      RuntimeClock,
  ) {}

  async registerDevice(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
    input: Omit<
      PersonalKnowledgeDevice,
      "ownerId" |
      "createdAt" |
      "lastSeenAt"
    >,
  ): Promise<PersonalKnowledgeDevice> {
    this.requireScope(
      principal,
      "devices:write",
    );

    if (
      input.deviceId !==
      principal.deviceId
    ) {
      throw new Error(
        "Cannot register another device identity",
      );
    }

    const now =
      this.clock.nowIso();

    const device:
      PersonalKnowledgeDevice = {
        ...input,
        ownerId:
          principal.ownerId,
        createdAt:
          now,
        lastSeenAt:
          now,
      };

    await this.devices.register(
      device,
    );
    await this.audit.append({
      ownerId:
        principal.ownerId,
      deviceId:
        principal.deviceId,
      action:
        "device.register",
      subjectId:
        input.deviceId,
      result:
        "success",
      occurredAt:
        now,
    });

    return device;
  }

  async listDevices(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
  ) {
    this.requireScope(
      principal,
      "devices:read",
    );

    return this.devices.list(
      principal.ownerId,
    );
  }

  async revokeDevice(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
    deviceId: string,
  ): Promise<boolean> {
    this.requireScope(
      principal,
      "devices:write",
    );

    const revoked =
      await this.devices.revoke(
        principal.ownerId,
        deviceId,
        this.clock.nowIso(),
      );

    await this.audit.append({
      ownerId:
        principal.ownerId,
      deviceId:
        principal.deviceId,
      action:
        "device.revoke",
      subjectId:
        deviceId,
      result:
        revoked
          ? "success"
          : "failure",
      occurredAt:
        this.clock.nowIso(),
    });

    return revoked;
  }

  async pushEvents(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
    input:
      readonly Omit<
        PersonalKnowledgeSyncEvent,
        "cursor" |
        "ownerId" |
        "deviceId" |
        "occurredAt"
      >[],
  ) {
    this.requireScope(
      principal,
      "sync:write",
    );
    await this.requireActiveDevice(
      principal,
    );

    const now =
      this.clock.nowIso();

    const appended =
      await this.events.append(
        input.map(
          (event) => ({
            ...event,
            ownerId:
              principal.ownerId,
            deviceId:
              principal.deviceId,
            occurredAt:
              now,
          }),
        ),
      );

    const maximumCursor =
      appended.reduce(
        (maximum, event) =>
          Math.max(
            maximum,
            event.cursor,
          ),
        0,
      );

    if (maximumCursor > 0) {
      await this.cursors.save(
        principal.ownerId,
        principal.deviceId,
        maximumCursor,
        now,
      );
    }

    await this.devices.touch(
      principal.ownerId,
      principal.deviceId,
      now,
    );

    await this.audit.append({
      ownerId:
        principal.ownerId,
      deviceId:
        principal.deviceId,
      action:
        "sync.push",
      result:
        "success",
      occurredAt:
        now,
      metadata: {
        events:
          appended.length,
        maximumCursor,
      },
    });

    return {
      acceptedEvents:
        appended.length,
      cursor:
        maximumCursor,
    };
  }

  async pullEvents(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
    afterCursor: number,
    limit: number,
  ) {
    this.requireScope(
      principal,
      "sync:read",
    );
    await this.requireActiveDevice(
      principal,
    );

    if (
      !Number.isInteger(afterCursor) ||
      afterCursor < 0
    ) {
      throw new Error(
        "afterCursor must be a non-negative integer",
      );
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 1000
    ) {
      throw new Error(
        "limit must be between 1 and 1000",
      );
    }

    const events =
      await this.events.listAfter(
        principal.ownerId,
        afterCursor,
        limit,
      );

    const nextCursor =
      events.reduce(
        (maximum, event) =>
          Math.max(
            maximum,
            event.cursor,
          ),
        afterCursor,
      );

    await this.cursors.save(
      principal.ownerId,
      principal.deviceId,
      nextCursor,
      this.clock.nowIso(),
    );

    await this.audit.append({
      ownerId:
        principal.ownerId,
      deviceId:
        principal.deviceId,
      action:
        "sync.pull",
      result:
        "success",
      occurredAt:
        this.clock.nowIso(),
      metadata: {
        afterCursor,
        nextCursor,
        events:
          events.length,
      },
    });

    return {
      events,
      nextCursor,
      hasMore:
        events.length === limit,
    };
  }

  async listConflicts(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
  ) {
    this.requireScope(
      principal,
      "conflicts:read",
    );

    return this.conflicts.listOpen(
      principal.ownerId,
    );
  }

  async resolveConflict(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
    conflictId: string,
    resolutionPayload: unknown,
  ): Promise<boolean> {
    this.requireScope(
      principal,
      "conflicts:write",
    );

    const conflict =
      await this.conflicts.get(
        principal.ownerId,
        conflictId,
      );

    if (!conflict) {
      return false;
    }

    const resolvedAt =
      this.clock.nowIso();

    const resolved =
      await this.conflicts.resolve(
        principal.ownerId,
        conflictId,
        resolvedAt,
        resolutionPayload,
      );

    if (resolved) {
      await this.events.append([{
        ownerId:
          principal.ownerId,
        deviceId:
          principal.deviceId,
        itemId:
          conflict.itemId,
        operation:
          "resolve-conflict",
        payload:
          resolutionPayload,
        occurredAt:
          resolvedAt,
      }]);
    }

    await this.audit.append({
      ownerId:
        principal.ownerId,
      deviceId:
        principal.deviceId,
      action:
        "conflict.resolve",
      subjectId:
        conflictId,
      result:
        resolved
          ? "success"
          : "failure",
      occurredAt:
        resolvedAt,
    });

    return resolved;
  }

  private async requireActiveDevice(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
  ): Promise<void> {
    const device =
      await this.devices.get(
        principal.ownerId,
        principal.deviceId,
      );

    if (!device) {
      throw new Error(
        "Device is not registered",
      );
    }

    if (device.revokedAt) {
      throw new Error(
        "Device is revoked",
      );
    }
  }

  private requireScope(
    principal:
      AuthenticatedPersonalKnowledgePrincipal,
    scope: string,
  ): void {
    if (
      !principal.scopes.includes(
        scope,
      )
    ) {
      throw new Error(
        `Missing scope: ${scope}`,
      );
    }
  }
}
