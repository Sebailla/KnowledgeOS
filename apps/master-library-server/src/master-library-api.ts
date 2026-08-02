import type {
  PublicationId,
  VersionId,
} from "@knowledgeos/domain-types";
import type {
  AddMasterPublicationVersionService,
  MasterPublicationRepository,
  MasterPublicationVersionRepository,
} from "@knowledgeos/master-library";
import type {
  MasterPublicationStorage,
} from "@knowledgeos/master-storage";
import type {
  MasterRegistrationWorkflow,
} from "@knowledgeos/master-registration-workflow";
import type {
  HttpResponse,
  HttpRouter,
} from "@knowledgeos/server";
import type {
  AddMasterPublicationVersionBody,
  RegisterMasterPublicationBody,
} from "./contracts.js";

export interface MasterLibraryApiDependencies {
  readonly registration: MasterRegistrationWorkflow;
  readonly addVersion: AddMasterPublicationVersionService;
  readonly publications: MasterPublicationRepository;
  readonly versions: MasterPublicationVersionRepository;
  readonly storage: MasterPublicationStorage;
}

function objectBody(
  body: unknown,
): Readonly<Record<string, unknown>> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Request body must be an object");
  }
  return body as Readonly<Record<string, unknown>>;
}

function stringField(
  value: Readonly<Record<string, unknown>>,
  key: string,
): string {
  const field = value[key];
  if (typeof field !== "string" || !field.trim()) {
    throw new Error(`${key} is required`);
  }
  return field;
}

function stringArray(
  value: unknown,
): readonly string[] {
  if (!Array.isArray(value) || !value.every(
    (item) => typeof item === "string",
  )) {
    throw new Error("Expected an array of strings");
  }
  return value;
}

function publicationIdFromPath(path: string): PublicationId {
  return decodeURIComponent(
    path.split("/")[4] ?? "",
  ) as PublicationId;
}

function versionIdFromPath(path: string): VersionId {
  return decodeURIComponent(
    path.split("/")[6] ?? "",
  ) as VersionId;
}

function safeError(error: unknown): HttpResponse {
  return {
    status: 400,
    body: {
      error: {
        code: "master-library.invalid-request",
        message:
          error instanceof Error
            ? error.message
            : "Invalid request",
      },
    },
  };
}

export function registerMasterLibraryRoutes(
  router: HttpRouter,
  dependencies: MasterLibraryApiDependencies,
): void {
  router.register(
    "POST",
    "/v1/master-library/publications",
    async (request): Promise<HttpResponse> => {
      try {
        const body = objectBody(request.body);

        const input: RegisterMasterPublicationBody = {
          publicationId: stringField(
            body,
            "publicationId",
          ) as RegisterMasterPublicationBody["publicationId"],
          knowledgeObjectId: stringField(
            body,
            "knowledgeObjectId",
          ) as RegisterMasterPublicationBody["knowledgeObjectId"],
          sourceItemId: stringField(
            body,
            "sourceItemId",
          ) as RegisterMasterPublicationBody["sourceItemId"],
          versionId: stringField(
            body,
            "versionId",
          ) as RegisterMasterPublicationBody["versionId"],
          title: stringField(body, "title"),
          authors: stringArray(body.authors),
          mediaType: stringField(body, "mediaType"),
          contentBase64: stringField(
            body,
            "contentBase64",
          ),
          ...(body.metadata &&
          typeof body.metadata === "object" &&
          !Array.isArray(body.metadata)
            ? {
                metadata:
                  body.metadata as Readonly<
                    Record<string, string>
                  >,
              }
            : {}),
        };

        const result = await dependencies.registration.execute({
          ...input,
          data: Buffer.from(
            input.contentBase64,
            "base64",
          ),
        });

        return {
          status: result.duplicate ? 200 : 201,
          body: result,
        };
      } catch (error) {
        return safeError(error);
      }
    },
  );

  router.register(
    "GET",
    "/v1/master-library/publications/:publicationId",
    async (request): Promise<HttpResponse> => {
      const id = publicationIdFromPath(request.path);
      const publication =
        await dependencies.publications.getById(id);

      return publication
        ? { status: 200, body: publication }
        : {
            status: 404,
            body: {
              error: {
                code: "master-library.publication-not-found",
                message: "Publication not found",
              },
            },
          };
    },
  );

  router.register(
    "GET",
    "/v1/master-library/publications/:publicationId/versions",
    async (request): Promise<HttpResponse> => {
      const id = publicationIdFromPath(request.path);
      return {
        status: 200,
        body: {
          items:
            await dependencies.versions.listByPublication(
              id,
            ),
        },
      };
    },
  );

  router.register(
    "GET",
    "/v1/master-library/publications/:publicationId/versions/:versionId/content",
    async (request): Promise<HttpResponse> => {
      try {
        const publicationId =
          publicationIdFromPath(request.path);
        const versionId =
          versionIdFromPath(request.path);
        const data = await dependencies.storage.read(
          publicationId,
          versionId,
        );

        return {
          status: 200,
          headers: {
            "content-type": "application/octet-stream",
          },
          body: {
            publicationId,
            versionId,
            contentBase64:
              Buffer.from(data).toString("base64"),
          },
        };
      } catch (error) {
        return {
          status: 404,
          body: {
            error: {
              code: "master-library.content-not-found",
              message:
                error instanceof Error
                  ? error.message
                  : "Content not found",
            },
          },
        };
      }
    },
  );
}
