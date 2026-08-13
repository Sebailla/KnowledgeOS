import assert from "node:assert/strict";
import { createLocalDevelopmentAuth, createLocalDevelopmentCredentialVerifier, validateLocalDevelopmentAuthEnvironment } from "../dist/index.js";

const now = 1_700_000_000_000;
const issued = [];
const auth = createLocalDevelopmentAuth({
  password: "temporary-password", signingSecret: "signing-secret", now: () => now,
  disclosePassword: (message) => issued.push(message), sessionTtlMs: 60_000,
});
assert.equal(issued.length, 1);
assert.equal(issued[0].includes("temporary-password"), true);
assert.equal(await auth.login("admin@knowledgeos.local", "wrong-password"), undefined);
const session = await auth.login("admin@knowledgeos.local", "temporary-password");
assert.ok(session);
assert.equal(await auth.authenticate(`Bearer ${session.credential}`), "admin@knowledgeos.local");
assert.equal(await auth.authorize("admin@knowledgeos.local", "catalog.read"), true);
assert.equal(await auth.authorize("admin@knowledgeos.local", "publication.acquire"), true);
assert.equal(await auth.authorize("admin@knowledgeos.local", "catalog.write"), true);
assert.equal(await auth.authorize("admin@knowledgeos.local", "unknown.permission"), false);
const expired = createLocalDevelopmentAuth({ password: "another-password", signingSecret: "signing-secret", now: () => now + 61_000, disclosePassword() {}, sessionTtlMs: 60_000 });
assert.equal(await expired.authenticate(`Bearer ${session.credential}`), undefined);
auth.logout(session.sessionId);
assert.equal(await auth.authenticate(`Bearer ${session.credential}`), undefined);
assert.throws(() => validateLocalDevelopmentAuthEnvironment({ MASTER_LIBRARY_DELIVERY_PROFILE: "deployment", LOCAL_BROWSER_PASSWORD_FILE: "/run/secrets/local" }), /local development authentication is forbidden/i);
assert.throws(() => validateLocalDevelopmentAuthEnvironment({ MASTER_LIBRARY_DELIVERY_PROFILE: "deployment", MASTER_LIBRARY_PUBLIC_ORIGIN: "local://browser" }), /local development authentication is forbidden/i);
assert.doesNotThrow(() => validateLocalDevelopmentAuthEnvironment({ MASTER_LIBRARY_DELIVERY_PROFILE: "local" }));

const verifier = createLocalDevelopmentCredentialVerifier({ signingSecret: "signing-secret", now: () => now });
assert.equal(await verifier.authenticate(`Bearer ${session.credential}`), "admin@knowledgeos.local");
assert.equal(await verifier.authenticate("Bearer malformed"), undefined);
