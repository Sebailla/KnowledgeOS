import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export type LocalPermission = "catalog.read" | "catalog.write" | "publication.acquire";
export interface LocalSession { readonly sessionId: string; readonly credential: string; readonly expiresAt: number; }
export interface LocalDevelopmentAuth {
  login(email: string, password: string): Promise<LocalSession | undefined>;
  authenticate(authorization: string | undefined): Promise<string | undefined>;
  authorize(subject: string, permission: string): Promise<boolean>;
  logout(sessionId: string): void;
}
export interface LocalDevelopmentCredentialVerifier { authenticate(authorization: string | undefined): Promise<string | undefined>; }
export interface LocalDevelopmentAuthOptions {
  readonly password: string;
  readonly signingSecret: string;
  readonly disclosePassword: (message: string) => void;
  readonly now?: () => number;
  readonly sessionTtlMs?: number;
}
interface StoredSession { readonly expiresAt: number; readonly signature: string; }
const admin = "admin@knowledgeos.local";
const permissions = new Set<LocalPermission>(["catalog.read", "catalog.write", "publication.acquire"]);
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const signature = (secret: string, value: string) => createHmac("sha256", secret).update(value).digest("base64url");
const equal = (left: string, right: string) => {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};
const verifiedSubject = (authorization: string | undefined, signingSecret: string, now: () => number): string | undefined => {
  const credential = authorization?.match(/^Bearer ([A-Za-z0-9._-]+)$/)?.[1];
  const [sessionId, expiresText, signed, ...rest] = credential?.split(".") ?? [];
  if (!sessionId || !expiresText || !signed || rest.length > 0) return undefined;
  const expiresAt = Number(expiresText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now()) return undefined;
  return equal(signature(signingSecret, `${sessionId}.${expiresText}`), signed) ? admin : undefined;
};

/** Validates a short-lived BFF credential in the isolated local API process. */
export function createLocalDevelopmentCredentialVerifier(options: Pick<LocalDevelopmentAuthOptions, "signingSecret" | "now">): LocalDevelopmentCredentialVerifier {
  return { async authenticate(authorization) { return verifiedSubject(authorization, options.signingSecret, options.now ?? Date.now); } };
}

export function createLocalDevelopmentAuth(options: LocalDevelopmentAuthOptions): LocalDevelopmentAuth {
  const passwordHash = hash(options.password);
  const now = options.now ?? Date.now;
  const ttl = options.sessionTtlMs ?? 15 * 60 * 1000;
  const sessions = new Map<string, StoredSession>();
  options.disclosePassword(`Local development operator ${admin} temporary password: ${options.password}`);
  return {
    async login(email, password) {
      if (email !== admin || !equal(passwordHash, hash(password))) return undefined;
      const sessionId = randomUUID(); const expiresAt = now() + ttl;
      const payload = `${sessionId}.${expiresAt}`; const signed = signature(options.signingSecret, payload);
      sessions.set(sessionId, { expiresAt, signature: signed });
      return { sessionId, expiresAt, credential: `${payload}.${signed}` };
    },
    async authenticate(authorization) {
      const credential = authorization?.match(/^Bearer ([A-Za-z0-9._-]+)$/)?.[1];
      const [sessionId, expiresText, signed] = credential?.split(".") ?? [];
      const stored = sessionId ? sessions.get(sessionId) : undefined;
      return stored && Number(expiresText) === stored.expiresAt && signed === stored.signature ? verifiedSubject(authorization, options.signingSecret, now) : undefined;
    },
    async authorize(subject, permission) { return subject === admin && permissions.has(permission as LocalPermission); },
    logout(sessionId) { sessions.delete(sessionId); },
  };
}

export function validateLocalDevelopmentAuthEnvironment(environment: Readonly<Record<string, string | undefined>>): void {
  if (environment.MASTER_LIBRARY_DELIVERY_PROFILE === "deployment") {
    const local = Object.entries(environment).some(([key, value]) => key.startsWith("LOCAL_BROWSER_") || value?.startsWith("local://") || /(^|:)localhost(?::|$)/.test(value ?? ""));
    if (local) throw new Error("Deployment configuration policy failure: local development authentication is forbidden.");
  }
}
