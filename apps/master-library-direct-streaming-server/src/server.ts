import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type {
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  AcquisitionManifest,
  AcquisitionHandoffAcceptedV1,
  MasterCatalogPage,
} from "@knowledgeos/contracts";
import type {
  DirectMasterStorageReader,
} from "@knowledgeos/master-storage-node-stream";
import {
  parseByteRange,
  InvalidRangeError,
} from "@knowledgeos/master-library-streaming-server";
import type { AcquisitionReceiptRequest } from "@knowledgeos/master-storage";
import type {
  IngestAcceptedV1,
  IngestOperationStatusV1,
  IngestSourceMetadataV1,
} from "@knowledgeos/contracts";

export interface DirectStreamingServerOptions {
  readonly host: string;
  readonly port: number;
}

export interface DirectStreamingDependencies {
  readonly reader: DirectMasterStorageReader;
  readonly catalog: MasterCatalogReader;
  readonly processingRecovery?: ProcessingRecovery;
  readonly readiness?: DeliveryReadiness;
  readonly acquisitionReceipts: AcquisitionReceiptRepository;
  readonly ingest?: IngestRouteService;
  readonly delivery: DeliveryBoundaryConfiguration;
}

export type DeliveryPermission =
  | "catalog.read"
  | "catalog.write"
  | "publication.acquire";

export interface AuthenticatedPrincipal {
  readonly subject: string;
}

export interface DeliveryCredentialSource {
  authenticate(
    authorization: string | undefined,
  ): Promise<AuthenticatedPrincipal | undefined>;
}

export interface DeliveryAuthorizer {
  authorize(
    principal: AuthenticatedPrincipal,
    permission: DeliveryPermission,
  ): Promise<boolean>;
}

export interface DeliveryAuditRecord {
  readonly correlationId: string;
  readonly category: string;
  readonly outcome: "denied" | "completed" | "cancelled";
}

export interface DeliveryBoundaryConfiguration {
  readonly profile: "test" | "local" | "deployment";
  readonly publicOrigin: string;
  readonly trustedProxyAddresses: readonly string[];
  readonly tlsMaterialReference: string;
  readonly credentialSourceReference: string;
  readonly authorizationPortReference: string;
  readonly credentialSource: DeliveryCredentialSource;
  readonly authorizer: DeliveryAuthorizer;
  readonly audit: (record: DeliveryAuditRecord) => void;
}

export interface DeliveryBoundaryPorts {
  readonly credentialSource: DeliveryCredentialSource;
  readonly authorizer: DeliveryAuthorizer;
  readonly audit: (record: DeliveryAuditRecord) => void;
}

/**
 * Maps deployment-provided references to the backend boundary. Secret values
 * are resolved by injected ports; the server never reads secret material.
 */
export function deliveryBoundaryFromEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
  ports: DeliveryBoundaryPorts,
): DeliveryBoundaryConfiguration {
  if (environment.MASTER_LIBRARY_DELIVERY_PROFILE === "deployment" && Object.entries(environment).some(([key, value]) => key.startsWith("LOCAL_BROWSER_") || value?.startsWith("local://") || /(^|:)localhost(?::|$)/.test(value ?? ""))) {
    throw new Error("Deployment configuration policy failure: local development authentication is forbidden.");
  }
  const configuration: Partial<DeliveryBoundaryConfiguration> = {
    ...(environment.MASTER_LIBRARY_DELIVERY_PROFILE
      ? { profile: environment.MASTER_LIBRARY_DELIVERY_PROFILE as "test" | "local" | "deployment" }
      : {}),
    ...(environment.MASTER_LIBRARY_PUBLIC_ORIGIN
      ? { publicOrigin: environment.MASTER_LIBRARY_PUBLIC_ORIGIN }
      : {}),
    ...(environment.MASTER_LIBRARY_TRUSTED_PROXY_ADDRESSES
      ? {
          trustedProxyAddresses: environment.MASTER_LIBRARY_TRUSTED_PROXY_ADDRESSES
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        }
      : {}),
    ...(environment.MASTER_LIBRARY_TLS_MATERIAL_REF
      ? { tlsMaterialReference: environment.MASTER_LIBRARY_TLS_MATERIAL_REF }
      : {}),
    ...(environment.MASTER_LIBRARY_CREDENTIAL_SOURCE_REF
      ? { credentialSourceReference: environment.MASTER_LIBRARY_CREDENTIAL_SOURCE_REF }
      : {}),
    ...(environment.MASTER_LIBRARY_AUTHORIZATION_PORT_REF
      ? { authorizationPortReference: environment.MASTER_LIBRARY_AUTHORIZATION_PORT_REF }
      : {}),
    credentialSource: ports.credentialSource,
    authorizer: ports.authorizer,
    audit: ports.audit,
  };
  validateDeliveryConfiguration(configuration);
  return configuration;
}

export class FixtureDeliveryAuthorizer implements DeliveryAuthorizer {
  public constructor(
    private readonly permissionsByToken: Readonly<Record<string, readonly DeliveryPermission[]>>,
  ) {}

  async authorize(
    principal: AuthenticatedPrincipal,
    permission: DeliveryPermission,
  ): Promise<boolean> {
    return this.permissionsByToken[principal.subject]?.includes(permission) ?? false;
  }
}

class FixtureDeliveryCredentialSource implements DeliveryCredentialSource {
  public constructor(
    private readonly allowedTokens: ReadonlySet<string>,
  ) {}

  async authenticate(
    authorization: string | undefined): Promise<AuthenticatedPrincipal | undefined> {
    const token = authorization?.match(/^Bearer (.+)$/)?.[1];
    return token && this.allowedTokens.has(token)
      ? { subject: token }
      : undefined;
  }
}

export function createFixtureDeliveryBoundary(
  options: {
    readonly authorizer: DeliveryAuthorizer;
    readonly audit: DeliveryAuditRecord[];
    readonly trustedProxyAddresses?: readonly string[];
    readonly publicOrigin?: string;
  },
): DeliveryBoundaryConfiguration {
  return {
    profile: "test",
    publicOrigin: options.publicOrigin ?? "https://master-library.test",
    trustedProxyAddresses: options.trustedProxyAddresses ?? ["127.0.0.1", "::1"],
    tlsMaterialReference: "fixture://generated-tls",
    credentialSourceReference: "fixture://test-credentials",
    authorizationPortReference: "fixture://delivery-authorizer",
    credentialSource: new FixtureDeliveryCredentialSource(
      new Set(["fixture-acquisition-token", "fixture-catalog-token"]),
    ),
    authorizer: options.authorizer,
    audit: (record) => options.audit.push(record),
  };
}

export function validateDeliveryConfiguration(
  configuration: Partial<DeliveryBoundaryConfiguration>,
): asserts configuration is DeliveryBoundaryConfiguration {
  const required = [
    "publicOrigin",
    "trustedProxyAddresses",
    "tlsMaterialReference",
    "credentialSourceReference",
    "authorizationPortReference",
    "credentialSource",
    "authorizer",
  ] as const;
  for (const key of required) {
    const value = configuration[key];
    if (
      value === undefined ||
      (typeof value === "string" && value.trim().length === 0) ||
      (Array.isArray(value) && value.length === 0)
    ) {
      throw new Error(`Protected delivery configuration requires '${key}'.`);
    }
  }

  if (configuration.profile !== "test" && configuration.profile !== "local" && configuration.profile !== "deployment") {
    throw new Error("Protected delivery configuration requires a profile.");
  }

  let origin: URL;
  try {
    origin = new URL(configuration.publicOrigin!);
  } catch {
    throw new Error("Protected delivery configuration has an invalid publicOrigin.");
  }
  if (origin.protocol !== "https:") {
    throw new Error("Protected delivery publicOrigin must use HTTPS.");
  }
  if (configuration.profile === "deployment" && [configuration.tlsMaterialReference, configuration.credentialSourceReference, configuration.authorizationPortReference].some((reference) => reference!.startsWith("fixture://") || reference === "local-fixture")) {
    throw new Error("Deployment delivery configuration rejects fixture ports.");
  }
  if (configuration.profile === "deployment" && configuration.trustedProxyAddresses!.includes("*")) {
    throw new Error("Deployment delivery configuration rejects wildcard trusted proxies.");
  }
  if (configuration.profile === "deployment" && (Object.keys(process.env).some((key) => key.startsWith("LOCAL_BROWSER_")) || configuration.publicOrigin!.startsWith("local://") || /(^|:)localhost(?::|$)/.test(configuration.publicOrigin!))) {
    throw new Error("Deployment configuration policy failure: local development authentication is forbidden.");
  }
}

/**
 * Runs durable processing recovery before this process accepts acquisition
 * traffic. Implementations must claim leases before resuming work so a
 * recreated worker cannot promote the same operation twice.
 */
export interface ProcessingRecovery {
  recover(): Promise<void>;
}

/** Readiness is separate from liveness and must include durable prerequisites. */
export interface DeliveryReadiness {
  ready(): Promise<boolean>;
}

export interface MasterCatalogReader {
  browse(cursor?: string): Promise<MasterCatalogPage>;
  manifest(
    publicationId: PublicationId,
    versionId: VersionId,
  ): Promise<AcquisitionManifest>;
}

export interface AcquisitionReceiptRepository {
  accept(
    request: AcquisitionReceiptRequest,
    manifest: AcquisitionManifest,
  ): Promise<AcquisitionHandoffAcceptedV1>;
}

/** Boundary port: route code never chooses identities, paths, or catalog rows. */
export interface IngestRouteService {
  accept(request: {
    readonly subject: string;
    readonly correlationId: string;
    readonly idempotencyKey: string;
    readonly bytes: Uint8Array;
    readonly metadata: IngestSourceMetadataV1;
  }): Promise<IngestAcceptedV1>;
  acceptStream?(request: {
    readonly subject: string;
    readonly correlationId: string;
    readonly idempotencyKey: string;
    readonly source: AsyncIterable<Uint8Array>;
    readonly metadata: IngestSourceMetadataV1;
  }): Promise<IngestAcceptedV1>;
  status(operationId: string): Promise<IngestOperationStatusV1 | undefined>;
}

export interface BoundAddress {
  readonly host: string;
  readonly port: number;
}

function headerValue(
  request: IncomingMessage,
  name: string,
): string | undefined {
  const value = request.headers[name.toLowerCase()];
  return typeof value === "string"
    ? value
    : Array.isArray(value)
      ? value.join(",")
      : undefined;
}

function trustedProxyAddress(address: string, allowed: readonly string[]): boolean {
  return allowed.some((entry) => {
    if (entry === "*") return true;
    if (entry === address) return true;
    const cidr = /^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/.exec(entry);
    const source = /^(?:\:\:ffff:)?(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(address);
    if (!cidr || !source) return false;
    const bits = Number(cidr[5]); if (bits < 0 || bits > 32) return false;
    const toNumber = (parts: readonly string[]) => parts.reduce((value, part) => (value << 8) + Number(part), 0) >>> 0;
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
    return (toNumber(cidr.slice(1, 5)) & mask) === (toNumber(source.slice(1, 5)) & mask);
  });
}

function queryValue(
  target: string,
  name: string,
): string | undefined {
  const query = target.split("?", 2)[1];
  if (!query) return undefined;

  for (const pair of query.split("&")) {
    const [key, value = ""] = pair.split("=", 2);
    if (decodeURIComponent(key ?? "") === name) {
      return decodeURIComponent(value.replace(/\+/g, " "));
    }
  }

  return undefined;
}

async function writeChunk(
  response: ServerResponse,
  chunk: Uint8Array,
): Promise<void> {
  if (response.write(chunk)) return;
  await new Promise<void>((resolve) => {
    response.once("drain", resolve);
  });
}

function json(
  response: ServerResponse,
  status: number,
  body: unknown,
): void {
  response.statusCode = status;
  response.setHeader(
    "content-type",
    "application/json; charset=utf-8",
  );
  response.end(JSON.stringify(body));
}

async function jsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Uint8Array[] = [];
  const readable = request as unknown as {
    on(event: "data", listener: (chunk: Uint8Array | string) => void): void;
    once(event: "end" | "error", listener: (error?: Error) => void): void;
  };
  await new Promise<void>((resolve, reject) => {
    readable.on("data", (chunk: Uint8Array | string) => {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    });
    readable.once("end", () => resolve());
    readable.once("error", (error) => reject(error));
  });
  let body: unknown;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ValidationError();
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ValidationError();
  return body as Record<string, unknown>;
}

async function multipartBody(request: IncomingMessage, maximumBytes: number): Promise<{ readonly metadata: IngestSourceMetadataV1; readonly bytes: Uint8Array }> {
  const contentType = headerValue(request, "content-type");
  const boundary = contentType ? /multipart\/form-data\s*;\s*boundary=([^;]+)/i.exec(contentType)?.[1]?.replace(/^"|"$/g, "") : undefined;
  if (!boundary) throw new IngestRouteValidationError();
  const chunks: Uint8Array[] = [];
  let length = 0;
  const readable = request as unknown as { on(event: "data", listener: (chunk: Uint8Array | string) => void): void; once(event: "end" | "error", listener: (error?: Error) => void): void; destroy(error?: Error): void; };
  await new Promise<void>((resolve, reject) => {
    readable.on("data", (chunk) => {
      const bytes = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
      length += bytes.byteLength;
      if (length > maximumBytes) { readable.destroy(new IngestCapacityError()); return; }
      chunks.push(bytes);
    });
    readable.once("end", () => resolve());
    readable.once("error", (error) => reject(error));
  });
  const raw = Buffer.concat(chunks).toString("binary");
  const fields = new Map<string, { readonly headers: string; readonly value: Buffer }>();
  for (const rawSection of raw.split(`--${boundary}`)) {
    const section = rawSection.replace(/^\r\n/, "").replace(/\r\n$/, "");
    if (!section || section === "--") continue;
    const marker = section.indexOf("\r\n\r\n");
    if (marker < 0) continue;
    const headers = section.slice(0, marker);
    const name = /name="([^"]+)"/.exec(headers)?.[1];
    if (!name) continue;
    fields.set(name, { headers, value: Buffer.from(section.slice(marker + 4).replace(/\r\n$/, ""), "binary") });
  }
  const metadataField = fields.get("metadata");
  const source = fields.get("source");
  if (!metadataField || !source) throw new IngestRouteValidationError();
  let metadata: unknown;
  try { metadata = JSON.parse(metadataField.value.toString("utf8")); } catch { throw new IngestRouteValidationError(); }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) throw new IngestRouteValidationError();
  return { metadata: metadata as IngestSourceMetadataV1, bytes: source.value };
}

/** Parses control fields before yielding source chunks; the file body is never materialized. */
async function multipartStream(request: IncomingMessage, maximumControlBytes: number): Promise<{ readonly metadata: IngestSourceMetadataV1; readonly source: AsyncIterable<Uint8Array> }> {
  const contentType = headerValue(request, "content-type");
  const boundary = contentType ? /multipart\/form-data\s*;\s*boundary=([^;]+)/i.exec(contentType)?.[1]?.replace(/^"|"$/g, "") : undefined;
  if (!boundary) throw new IngestRouteValidationError();
  const iterator = (request as unknown as AsyncIterable<Uint8Array>)[Symbol.asyncIterator]();
  let pending = Buffer.alloc(0);
  const read = async () => { const next = await iterator.next(); if (next.done) throw new IngestRouteValidationError(); pending = Buffer.concat([pending, Buffer.from(next.value)]); };
  const delimiter = Buffer.from(`\r\n--${boundary}`);
  let metadata: IngestSourceMetadataV1 | undefined;
  while (!metadata) {
    if (pending.byteLength > maximumControlBytes) throw new IngestRouteValidationError();
    const nextBoundary = pending.indexOf(delimiter);
    if (nextBoundary < 0) { await read(); continue; }
    const section = pending.subarray(0, nextBoundary).toString("utf8");
    pending = pending.subarray(nextBoundary + delimiter.byteLength + 2);
    const marker = section.indexOf("\r\n\r\n");
    const name = /name="([^"]+)"/.exec(section.slice(0, Math.max(marker, 0)))?.[1];
    if (name === "metadata" && marker >= 0) {
      try { metadata = JSON.parse(section.slice(marker + 4)) as IngestSourceMetadataV1; } catch { throw new IngestRouteValidationError(); }
    }
  }
  while (pending.indexOf("\r\n\r\n") < 0) { if (pending.byteLength > maximumControlBytes) throw new IngestRouteValidationError(); await read(); }
  const sourceHeaderEnd = pending.indexOf("\r\n\r\n");
  const sourceHeaders = pending.subarray(0, sourceHeaderEnd).toString("utf8");
  if (!/name="source"/.test(sourceHeaders)) throw new IngestRouteValidationError();
  pending = pending.subarray(sourceHeaderEnd + 4);
  const source = (async function* () {
    let complete = false;
    while (!complete) {
      const end = pending.indexOf(delimiter);
      if (end >= 0) { if (end > 0) yield pending.subarray(0, end); return; }
      const retain = delimiter.byteLength + 4;
      if (pending.byteLength > retain) { yield pending.subarray(0, pending.byteLength - retain); pending = pending.subarray(pending.byteLength - retain); }
      const next = await iterator.next();
      if (next.done) throw new IngestRouteValidationError();
      pending = Buffer.concat([pending, Buffer.from(next.value)]);
      complete = false;
    }
  })();
  return { metadata, source };
}

class ValidationError extends Error {}
class IngestRouteValidationError extends Error {}
class IngestCapacityError extends Error {}

function requiredIdentity(body: Readonly<Record<string, unknown>>, key: string, prefix: string): string {
  const value = body[key];
  if (typeof value !== "string" || !new RegExp(`^${prefix}:[A-Za-z0-9][A-Za-z0-9._-]*$`).test(value)) throw new ValidationError();
  return value;
}

export class MasterDirectStreamingServer {
  private server: Server | undefined;

  public constructor(
    private readonly dependencies: DirectStreamingDependencies,
    private readonly options: DirectStreamingServerOptions,
  ) {}

  async start(): Promise<BoundAddress> {
    if (this.server) {
      throw new Error("Server already started");
    }

    validateDeliveryConfiguration(this.dependencies.delivery);
    await this.dependencies.processingRecovery?.recover();

    const server = createServer(
      async (request, response) => {
        await this.handle(request, response);
      },
    );
    this.server = server;

    await new Promise<void>((resolve) => {
      server.listen(
        this.options.port,
        this.options.host,
        resolve,
      );
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Unable to resolve server address");
    }

    return {
      host: address.address,
      port: address.port,
    };
  }

  async stop(): Promise<void> {
    const server = this.server;
    if (!server) return;

    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    this.server = undefined;
  }

  private async handle(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      const method = request.method ?? "GET";
      const target = request.url ?? "/";
      const pathname = target.split("?", 1)[0] ?? "/";
      const correlationId =
        headerValue(request, "x-correlation-id") ??
        "correlation:master-library-request";

      const permission = pathname === "/v1/master-library/catalog"
        ? "catalog.read"
        : pathname === "/v1/master-library/publications:ingest" || pathname.startsWith("/v1/master-library/ingest-operations/")
          ? "catalog.write"
          : "publication.acquire";

      if (pathname !== "/health/live" && pathname !== "/health/ready" && this.dependencies.readiness && !await this.dependencies.readiness.ready()) {
        json(response, 503, { error: { code: "infrastructure.transient", correlationId } });
        return;
      }

      if (pathname !== "/health/live" && pathname !== "/health/ready") {
        const authorized = await this.authorize(
          request,
          correlationId,
          permission,
        );
        if (!authorized) {
          json(response, 403, {
            error: {
              code: "authorization.denied",
              correlationId,
            },
          });
          return;
        }
      }

      if (pathname.includes("personal-knowledge")) {
        json(response, 403, {
          error: {
            code: "master-library.personal-knowledge-forbidden",
            correlationId,
          },
        });
        return;
      }

      if (
        method === "GET" &&
        pathname === "/v1/master-library/catalog"
      ) {
        json(
          response,
          200,
          await this.dependencies.catalog.browse(
            queryValue(target, "cursor"),
          ),
        );
        return;
      }

      if (method === "POST" && pathname === "/v1/master-library/acquisitions") {
        const idempotencyKey = headerValue(request, "idempotency-key");
        if (!idempotencyKey || idempotencyKey.trim().length === 0 || idempotencyKey.length > 256) throw new ValidationError();
        const body = await jsonBody(request);
        const publicationId = requiredIdentity(body, "publicationId", "publication");
        const versionId = requiredIdentity(body, "versionId", "version");
        const targetLocalLibraryId = requiredIdentity(body, "targetLocalLibraryId", "local-library");
        const principal = await this.dependencies.delivery.credentialSource.authenticate(
          headerValue(request, "authorization"),
        );
        if (!principal) {
          json(response, 403, { error: { code: "authorization.denied", correlationId } });
          return;
        }
        const manifest = await this.dependencies.catalog.manifest(publicationId as PublicationId, versionId as VersionId);
        const accepted = await this.dependencies.acquisitionReceipts.accept({
          subject: principal.subject,
          idempotencyKey,
          publicationId,
          versionId,
          targetLocalLibraryId,
        }, manifest);
        json(response, 202, accepted);
        return;
      }

      if (method === "POST" && pathname === "/v1/master-library/publications:ingest") {
        if (!this.dependencies.ingest) throw new Error("Ingest is not enabled.");
        const idempotencyKey = headerValue(request, "idempotency-key");
        if (!idempotencyKey || idempotencyKey.trim().length === 0 || idempotencyKey.length > 256) throw new IngestRouteValidationError();
        const streamed = this.dependencies.ingest.acceptStream ? await multipartStream(request, 64 * 1024) : undefined;
        const input = streamed ? undefined : await multipartBody(request, 104_857_600);
        const principal = await this.dependencies.delivery.credentialSource.authenticate(headerValue(request, "authorization"));
        if (!principal) { json(response, 403, { error: { code: "authorization.denied", correlationId } }); return; }
        const accepted = streamed && this.dependencies.ingest.acceptStream
          ? await this.dependencies.ingest.acceptStream({ subject: principal.subject, correlationId, idempotencyKey, ...streamed })
          : await this.dependencies.ingest.accept({ subject: principal.subject, correlationId, idempotencyKey, ...input! });
        json(response, 202, accepted);
        return;
      }

      const ingestStatus = /^\/v1\/master-library\/ingest-operations\/([^/]+)$/.exec(pathname);
      if (method === "GET" && ingestStatus) {
        if (!this.dependencies.ingest) throw new Error("Ingest is not enabled.");
        const status = await this.dependencies.ingest.status(decodeURIComponent(ingestStatus[1] ?? ""));
        if (!status) { json(response, 404, { error: { code: "catalog.not-found", correlationId } }); return; }
        json(response, 200, status);
        return;
      }

      const manifestMatch =
        /^\/v1\/master-library\/publications\/([^/]+)\/versions\/([^/]+)\/manifest$/.exec(
          pathname,
        );
      if (method === "GET" && manifestMatch) {
        json(
          response,
          200,
          await this.dependencies.catalog.manifest(
            decodeURIComponent(manifestMatch[1] ?? "") as PublicationId,
            decodeURIComponent(manifestMatch[2] ?? "") as VersionId,
          ),
        );
        return;
      }

      const aliasMatch =
        /^\/master-library\/publications\/([^/]+)\/versions\/([^/]+)\/content$/.exec(
          pathname,
        );
      if (aliasMatch && (method === "GET" || method === "HEAD")) {
        response.statusCode = 308;
        response.setHeader(
          "location",
          `/v1/master-library/publications/${aliasMatch[1]}/versions/${aliasMatch[2]}/content`,
        );
        response.end();
        return;
      }

      const match =
        /^\/v1\/master-library\/publications\/([^/]+)\/versions\/([^/]+)\/content$/.exec(
          pathname,
        );

      if (
        match &&
        (method === "GET" || method === "HEAD")
      ) {
        await this.download(
          request,
          response,
          decodeURIComponent(match[1] ?? "") as PublicationId,
          decodeURIComponent(match[2] ?? "") as VersionId,
          method === "HEAD",
          correlationId,
        );
        return;
      }

      if (method === "GET" && pathname === "/health/live") {
        json(response, 200, { state: "healthy" });
        return;
      }
      if (method === "GET" && pathname === "/health/ready") {
        const ready = await this.dependencies.readiness?.ready() ?? true;
        json(response, ready ? 200 : 503, { state: ready ? "ready" : "blocked" });
        return;
      }

      json(response, 404, {
        error: {
          code: "http.route-not-found",
          correlationId,
          message: "Route not found",
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        json(response, 400, { error: { code: "validation.failed", correlationId: "correlation:master-library-request" } });
        return;
      }
      if (error instanceof IngestCapacityError || error instanceof Error && error.name === "IngestCapacityError") {
        json(response, 413, { error: { code: "ingest.capacity-exceeded", correlationId: "correlation:master-library-request" } });
        return;
      }
      if (error instanceof IngestRouteValidationError || error instanceof Error && error.name === "IngestValidationError") {
        json(response, 400, { error: { code: "ingest.validation-failed", correlationId: "correlation:master-library-request" } });
        return;
      }
      if (error instanceof Error && error.name === "IngestIdempotencyConflictError") {
        json(response, 409, { error: { code: "ingest.idempotency-conflict", correlationId: "correlation:master-library-request" } });
        return;
      }
      if (error instanceof Error && error.name === "AcquisitionReceiptConflictError") {
        json(response, 409, { error: { code: "operation.conflict", correlationId: "correlation:master-library-request" } });
        return;
      }
      if (error instanceof InvalidRangeError) {
        this.audit("correlation:master-library-request", "range.invalid", "denied");
        response.statusCode = 416;
        response.setHeader(
          "x-correlation-id",
          "correlation:master-library-request",
        );
        response.end();
        return;
      }

      json(response, 404, {
        error: {
          code: "catalog.not-found",
          correlationId: "correlation:master-library-request",
          message:
            error instanceof Error
              ? error.message
              : "Content not found",
        },
      });
    }
  }

  private async download(
    request: IncomingMessage,
    response: ServerResponse,
    publicationId: PublicationId,
    versionId: VersionId,
    headOnly: boolean,
    correlationId: string,
  ): Promise<void> {
    const descriptor =
      await this.dependencies.reader.describe(
        publicationId,
        versionId,
      );

    const etag = `"${descriptor.contentFingerprint}"`;
    const ifNoneMatch =
      headerValue(request, "if-none-match");

    response.setHeader("etag", etag);
    response.setHeader(
      "x-content-fingerprint",
      descriptor.contentFingerprint,
    );
    response.setHeader("accept-ranges", "bytes");
    response.setHeader(
      "content-type",
      descriptor.mediaType,
    );

    if (ifNoneMatch === etag) {
      response.statusCode = 304;
      response.end();
      this.audit(correlationId, "delivery.not-modified", "completed");
      return;
    }

    const range = parseByteRange(
      headerValue(request, "range"),
      descriptor.byteLength,
    );

    const read = await this.dependencies.reader.open(
      publicationId,
      versionId,
      range,
    );

    response.statusCode = range ? 206 : 200;
    response.setHeader(
      "content-length",
      read.contentLength,
    );

    if (range) {
      response.setHeader(
        "content-range",
        `bytes ${range.start}-${range.endInclusive}/${descriptor.byteLength}`,
      );
    }

    if (headOnly) {
      response.end();
      this.audit(correlationId, "delivery.head", "completed");
      return;
    }

    let cancelled = false;
    request.once("aborted", () => { cancelled = true; });
    request.once("close", () => {
      if (!request.complete) cancelled = true;
    });
    response.once("close", () => { cancelled = true; });
    for await (const chunk of read.stream) {
      if (cancelled) break;
      await writeChunk(response, chunk);
    }
    if (!cancelled) response.end();
    this.audit(
      correlationId,
      cancelled ? "delivery.cancelled" : "delivery.completed",
      cancelled ? "cancelled" : "completed",
    );
  }

  private async authorize(
    request: IncomingMessage,
    correlationId: string,
    permission: DeliveryPermission,
  ): Promise<boolean> {
    const configuration = this.dependencies.delivery;
    const origin = new URL(configuration.publicOrigin);
    const remoteAddress = request.socket.remoteAddress;
    const forwardedProto = headerValue(request, "x-forwarded-proto");
    const forwardedHost = headerValue(request, "x-forwarded-host");
    if (
      !remoteAddress ||
      !trustedProxyAddress(remoteAddress, configuration.trustedProxyAddresses) ||
      forwardedProto !== "https" ||
      forwardedHost !== origin.host
    ) {
      this.audit(correlationId, "transport.untrusted", "denied");
      return false;
    }

    const principal = await configuration.credentialSource.authenticate(
      headerValue(request, "authorization"),
    );
    if (!principal || !await configuration.authorizer.authorize(principal, permission)) {
      this.audit(correlationId, "authorization.denied", "denied");
      return false;
    }
    return true;
  }

  private audit(
    correlationId: string,
    category: string,
    outcome: DeliveryAuditRecord["outcome"],
  ): void {
    this.dependencies.delivery.audit({ correlationId, category, outcome });
  }
}
