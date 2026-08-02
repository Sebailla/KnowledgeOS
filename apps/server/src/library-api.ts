import type {
  BrowseMasterCatalogQuery,
  GetLocalAvailabilityQuery,
  ListLocalLibraryQuery,
  RegisterLocalSourceCommand,
  RequestAcquisitionCommand,
} from "@knowledgeos/contracts";
import type {
  ContractVersion,
  KnowledgeObjectId,
  LocalLibraryId,
  PublicationId,
  SourceItemId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  InMemoryCommandBus,
  InMemoryQueryBus,
} from "@knowledgeos/kernel";
import { toHttpError } from "./errors.js";
import type {
  HttpResponse,
  HttpRouter,
} from "./http.js";
import { createExecutionContext } from "./request-context.js";

export interface LibraryApiDependencies {
  readonly commandBus: InMemoryCommandBus;
  readonly queryBus: InMemoryQueryBus;
  readonly contractVersion: ContractVersion;
}

function requireObject(
  body: unknown,
): Readonly<Record<string, unknown>> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Request body must be an object");
  }
  return body as Readonly<Record<string, unknown>>;
}

function requireString(
  object: Readonly<Record<string, unknown>>,
  key: string,
): string {
  const value = object[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value;
}

function requireQueryString(
  query: Readonly<Record<string, string | undefined>> | undefined,
  key: string,
): string {
  const value = query?.[key];
  if (!value?.trim()) {
    throw new Error(`${key} query parameter is required`);
  }
  return value;
}

function optionalString(
  object: Readonly<Record<string, unknown>>,
  key: string,
): Readonly<Record<string, string>> {
  const value = object[key];
  return typeof value === "string" && value.trim()
    ? { [key]: value }
    : {};
}

function optionalNumber(
  object: Readonly<Record<string, unknown>>,
  key: string,
): Readonly<Record<string, number>> {
  const value = object[key];
  return typeof value === "number" && Number.isFinite(value)
    ? { [key]: value }
    : {};
}

function requestContext(
  context: ReturnType<typeof createExecutionContext>,
) {
  return {
    operationId: context.operationId,
    correlationId: context.correlationId,
    requestedAt: context.clock.nowIso(),
    privacyClass: context.privacyClass,
  };
}

export function registerLibraryRoutes(
  router: HttpRouter,
  dependencies: LibraryApiDependencies,
): void {
  router.register(
    "POST",
    "/v1/library/local-sources",
    async (request): Promise<HttpResponse> => {
      try {
        const body = requireObject(request.body);
        const context = createExecutionContext(request);

        const command: RegisterLocalSourceCommand = {
          type: "library.register-local-source",
          commandId: context.operationId,
          contractVersion: dependencies.contractVersion,
          context: requestContext(context),
          payload: {
            localLibraryId: requireString(
              body,
              "localLibraryId",
            ) as LocalLibraryId,
            sourceItemId: requireString(
              body,
              "sourceItemId",
            ) as SourceItemId,
            contentFingerprint: requireString(
              body,
              "contentFingerprint",
            ),
            ...optionalString(body, "originalFilename"),
            ...optionalString(body, "title"),
            ...optionalString(body, "mediaType"),
            ...optionalNumber(body, "byteLength"),
            ...(typeof body.sourceVersionId === "string"
              ? {
                  sourceVersionId:
                    body.sourceVersionId as VersionId,
                }
              : {}),
          },
          ...(request.headers["idempotency-key"] === undefined
            ? {}
            : {
                idempotencyKey:
                  request.headers["idempotency-key"],
              }),
        };

        const receipt = await dependencies.commandBus.execute(
          command,
          context,
        );

        return {
          status: receipt.accepted ? 202 : 409,
          body: receipt,
        };
      } catch (error) {
        return toHttpError(error as Error);
      }
    },
  );

  router.register(
    "POST",
    "/v1/library/acquisitions",
    async (request): Promise<HttpResponse> => {
      try {
        const body = requireObject(request.body);
        const context = createExecutionContext(request);

        const command: RequestAcquisitionCommand = {
          type: "library.request-acquisition",
          commandId: context.operationId,
          contractVersion: dependencies.contractVersion,
          context: requestContext(context),
          payload: {
            publicationId: requireString(
              body,
              "publicationId",
            ) as PublicationId,
            targetLocalLibraryId: requireString(
              body,
              "targetLocalLibraryId",
            ) as LocalLibraryId,
            ...(typeof body.requestedVersionId === "string"
              ? {
                  requestedVersionId:
                    body.requestedVersionId as VersionId,
                }
              : {}),
          },
          ...(request.headers["idempotency-key"] === undefined
            ? {}
            : {
                idempotencyKey:
                  request.headers["idempotency-key"],
              }),
        };

        const receipt = await dependencies.commandBus.execute(
          command,
          context,
        );

        return {
          status: receipt.accepted ? 202 : 409,
          body: receipt,
        };
      } catch (error) {
        return toHttpError(error as Error);
      }
    },
  );

  router.register(
    "GET",
    "/v1/library/master-catalog",
    async (request): Promise<HttpResponse> => {
      try {
        const context = createExecutionContext(request);
        const query: BrowseMasterCatalogQuery = {
          type: "library.browse-master-catalog",
          queryId: context.operationId,
          contractVersion: dependencies.contractVersion,
          context: requestContext(context),
          parameters: {
            limit: Number(request.query?.limit ?? "50"),
            ...(request.query?.search === undefined
              ? {}
              : { search: request.query.search }),
            ...(request.query?.cursor === undefined
              ? {}
              : { cursor: request.query.cursor as never }),
          },
        };

        return {
          status: 200,
          body: await dependencies.queryBus.execute(
            query,
            context,
          ),
        };
      } catch (error) {
        return toHttpError(error as Error);
      }
    },
  );

  router.register(
    "GET",
    "/v1/library/local-library",
    async (request): Promise<HttpResponse> => {
      try {
        const context = createExecutionContext(request);
        const query: ListLocalLibraryQuery = {
          type: "library.list-local-library",
          queryId: context.operationId,
          contractVersion: dependencies.contractVersion,
          context: requestContext(context),
          parameters: {
            localLibraryId: requireQueryString(
              request.query,
              "localLibraryId",
            ) as LocalLibraryId,
            limit: Number(request.query?.limit ?? "50"),
            ...(request.query?.cursor === undefined
              ? {}
              : { cursor: request.query.cursor as never }),
          },
        };

        return {
          status: 200,
          body: await dependencies.queryBus.execute(
            query,
            context,
          ),
        };
      } catch (error) {
        return toHttpError(error as Error);
      }
    },
  );

  router.register(
    "GET",
    "/v1/library/local-availability",
    async (request): Promise<HttpResponse> => {
      try {
        const context = createExecutionContext(request);
        const query: GetLocalAvailabilityQuery = {
          type: "library.get-local-availability",
          queryId: context.operationId,
          contractVersion: dependencies.contractVersion,
          context: requestContext(context),
          parameters: {
            localLibraryId: requireQueryString(
              request.query,
              "localLibraryId",
            ) as LocalLibraryId,
            knowledgeObjectId: requireQueryString(
              request.query,
              "knowledgeObjectId",
            ) as KnowledgeObjectId,
          },
        };

        return {
          status: 200,
          body: await dependencies.queryBus.execute(
            query,
            context,
          ),
        };
      } catch (error) {
        return toHttpError(error as Error);
      }
    },
  );
}
