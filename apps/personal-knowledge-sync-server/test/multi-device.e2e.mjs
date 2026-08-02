import assert from "node:assert/strict";
import {
  InMemoryPersonalKnowledgeSyncEnvelopeStore,
  PersonalKnowledgeSyncServer,
} from "../dist/index.js";
import {
  PersonalKnowledgeSyncHttpClient,
} from "@knowledgeos/personal-knowledge-sync-http";

const running =
  await new PersonalKnowledgeSyncServer(
    new InMemoryPersonalKnowledgeSyncEnvelopeStore(),
    {
      host:
        "127.0.0.1",
      port:
        0,
      authorizationHeader:
        "Bearer sync-token",
    },
  ).start();

try {
  const mac =
    new PersonalKnowledgeSyncHttpClient({
      baseUrl:
        `http://127.0.0.1:${running.port}`,
      authorizationHeader:
        "Bearer sync-token",
    });

  const iphone =
    new PersonalKnowledgeSyncHttpClient({
      baseUrl:
        `http://127.0.0.1:${running.port}`,
      authorizationHeader:
        "Bearer sync-token",
    });

  await mac.push({
    ownerId:
      "user:1",
    sourceDeviceId:
      "device:mac",
    generatedAt:
      "2026-08-01T00:00:00.000Z",
    records: [{
      item: {
        itemId:
          "pk:device-sync-1",
        ownerId:
          "user:1",
        knowledgeObjectId:
          "knowledge-object:1",
        type:
          "note",
        body:
          "created on mac",
        tags:
          [],
        revision:
          1,
        deleted:
          false,
        createdAt:
          "2026-08-01T00:00:00.000Z",
        updatedAt:
          "2026-08-01T00:00:00.000Z",
      },
      vector: {
        "device:mac":
          1,
      },
      deviceId:
        "device:mac",
    }],
  });

  const pulled =
    await iphone.pull(
      "user:1",
      "device:iphone",
    );

  assert.equal(
    pulled.records.length,
    1,
  );
  assert.equal(
    pulled.records[0].item.body,
    "created on mac",
  );

  console.log(JSON.stringify({
    flow:
      "personal-knowledge-multi-device-http-server",
    status:
      "passed",
  }));
} finally {
  await running.stop();
}
