import assert from "node:assert/strict";
import {
  PersonalKnowledgeProductionRuntime,
} from "../dist/index.js";

class Store {
  constructor() {
    this.devices = new Map();
    this.events = [];
    this.cursors = new Map();
    this.conflicts = new Map();
    this.audit = [];
  }

  key(ownerId, deviceId) {
    return `${ownerId}::${deviceId}`;
  }

  async register(device) {
    this.devices.set(
      this.key(
        device.ownerId,
        device.deviceId,
      ),
      device,
    );
  }

  async get(ownerId, id) {
    return (
      this.devices.get(
        this.key(ownerId, id),
      ) ??
      this.conflicts.get(
        `${ownerId}::${id}`,
      )
    );
  }

  async list(ownerId) {
    return [
      ...this.devices.values(),
    ].filter(
      (device) =>
        device.ownerId ===
        ownerId,
    );
  }

  async revoke(
    ownerId,
    deviceId,
    revokedAt,
  ) {
    const key =
      this.key(ownerId, deviceId);
    const current =
      this.devices.get(key);

    if (!current) return false;

    this.devices.set(key, {
      ...current,
      revokedAt,
    });
    return true;
  }

  async touch(
    ownerId,
    deviceId,
    lastSeenAt,
  ) {
    const key =
      this.key(ownerId, deviceId);
    const current =
      this.devices.get(key);
    if (current) {
      this.devices.set(key, {
        ...current,
        lastSeenAt,
      });
    }
  }

  async append(values) {
    return values.map(
      (value) => {
        const event = {
          ...value,
          cursor:
            this.events.length + 1,
        };
        this.events.push(event);
        return event;
      },
    );
  }

  async listAfter(
    ownerId,
    cursor,
    limit,
  ) {
    return this.events
      .filter(
        (event) =>
          event.ownerId ===
            ownerId &&
          event.cursor > cursor,
      )
      .slice(0, limit);
  }

  async save(
    ownerId,
    deviceId,
    cursor,
  ) {
    this.cursors.set(
      this.key(
        ownerId,
        deviceId,
      ),
      cursor,
    );
  }

  async listOpen(ownerId) {
    return [
      ...this.conflicts.values(),
    ].filter(
      (conflict) =>
        conflict.ownerId ===
          ownerId &&
        !conflict.resolvedAt,
    );
  }

  async resolve(
    ownerId,
    conflictId,
    resolvedAt,
    payload,
  ) {
    const key =
      `${ownerId}::${conflictId}`;
    const conflict =
      this.conflicts.get(key);

    if (!conflict) {
      return false;
    }

    this.conflicts.set(key, {
      ...conflict,
      resolvedAt,
      resolutionPayload:
        payload,
    });

    return true;
  }

  async appendAudit(entry) {
    this.audit.push(entry);
  }
}

const store = new Store();

const runtime =
  new PersonalKnowledgeProductionRuntime(
    store,
    store,
    store,
    store,
    {
      append:
        store.appendAudit.bind(store),
    },
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
  );

const principal = {
  ownerId: "owner:1",
  deviceId: "device:mac",
  scopes: [
    "devices:read",
    "devices:write",
    "sync:read",
    "sync:write",
    "conflicts:read",
    "conflicts:write",
  ],
};

await runtime.registerDevice(
  principal,
  {
    deviceId:
      principal.deviceId,
    platform:
      "macOS",
    applicationVersion:
      "5.0.0-dev.14",
    capabilities:
      ["sync", "conflicts"],
  },
);

const pushed =
  await runtime.pushEvents(
    principal,
    [{
      itemId:
        "pk:runtime-1",
      operation:
        "upsert",
      payload: {
        body:
          "runtime event",
      },
    }],
  );

assert.equal(
  pushed.acceptedEvents,
  1,
);
assert.equal(
  pushed.cursor,
  1,
);

const pulled =
  await runtime.pullEvents(
    principal,
    0,
    100,
  );

assert.equal(
  pulled.events.length,
  1,
);
assert.equal(
  pulled.nextCursor,
  1,
);

assert.equal(
  (await runtime.listDevices(
    principal,
  )).length,
  1,
);

assert.equal(
  store.audit.length >= 3,
  true,
);

console.log(JSON.stringify({
  flow:
    "personal-knowledge-production-runtime-devices-events-cursors-audit",
  status:
    "passed",
}));
