import assert from "node:assert/strict";
import {
  PersonalKnowledgeProductionRuntime,
} from "@knowledgeos/personal-knowledge-sync-runtime";
import {
  PersonalKnowledgeProductionServer,
} from "../dist/index.js";

class Store {
  constructor() {
    this.devices = new Map();
    this.events = [];
    this.conflicts = new Map();
  }

  key(ownerId, id) {
    return `${ownerId}::${id}`;
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
        this.key(ownerId, id),
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

  async touch() {}

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
          event.ownerId === ownerId &&
          event.cursor > cursor,
      )
      .slice(0, limit);
  }

  async save() {}

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

  async resolve() {
    return false;
  }

  async audit() {}
}

const store = new Store();

const runtime =
  new PersonalKnowledgeProductionRuntime(
    store,
    store,
    store,
    store,
    {
      async append() {},
    },
    {
      nowIso() {
        return "2026-08-01T00:00:00.000Z";
      },
    },
  );

const scopes = [
  "devices:read",
  "devices:write",
  "sync:read",
  "sync:write",
  "conflicts:read",
  "conflicts:write",
];

const running =
  await new PersonalKnowledgeProductionServer(
    runtime,
    {
      async resolve(header) {
        if (
          header !==
          "Bearer production-token"
        ) {
          throw new Error(
            "unauthorized",
          );
        }

        return {
          ownerId:
            "owner:1",
          deviceId:
            "device:mac",
          scopes,
        };
      },
    },
    {
      host:
        "127.0.0.1",
      port:
        0,
      maximumBodyBytes:
        1024 * 1024,
    },
  ).start();

try {
  const base =
    `http://127.0.0.1:${running.port}`;

  const register =
    await fetch(
      `${base}/v1/personal-knowledge/devices`,
      {
        method: "POST",
        headers: {
          authorization:
            "Bearer production-token",
          "content-type":
            "application/json",
        },
        body: JSON.stringify({
          deviceId:
            "device:mac",
          platform:
            "macOS",
          applicationVersion:
            "5.0.0-dev.14",
          capabilities:
            ["sync"],
        }),
      },
    );

  assert.equal(
    register.status,
    201,
  );

  const push =
    await fetch(
      `${base}/v1/personal-knowledge/events`,
      {
        method: "POST",
        headers: {
          authorization:
            "Bearer production-token",
          "content-type":
            "application/json",
        },
        body: JSON.stringify({
          events: [{
            itemId:
              "pk:server-1",
            operation:
              "upsert",
            payload: {
              body:
                "server event",
            },
          }],
        }),
      },
    );

  assert.equal(
    push.status,
    200,
  );

  const pull =
    await fetch(
      `${base}/v1/personal-knowledge/events?after=0&limit=100`,
      {
        headers: {
          authorization:
            "Bearer production-token",
        },
      },
    );

  const pulled =
    await pull.json();

  assert.equal(
    pulled.events.length,
    1,
  );
  assert.equal(
    pulled.nextCursor,
    1,
  );

  const devices =
    await (
      await fetch(
        `${base}/v1/personal-knowledge/devices`,
        {
          headers: {
            authorization:
              "Bearer production-token",
          },
        },
      )
    ).json();

  assert.equal(
    devices.length,
    1,
  );

  console.log(JSON.stringify({
    flow:
      "personal-knowledge-production-http-devices-events",
    status:
      "passed",
  }));
} finally {
  await running.stop();
}
