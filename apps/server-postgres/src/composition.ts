import type {
  ContractVersion,
  CorrelationId,
  LocalLibraryId,
  VersionId,
} from "@knowledgeos/domain-types";
import {
  DomainEventFactory,
  LocalLibrary,
} from "@knowledgeos/domain";
import {
  InMemoryCommandBus,
  InMemoryEventBus,
  InMemoryQueryBus,
  MonotonicIdGenerator,
  SystemClock,
} from "@knowledgeos/kernel";
import {
  BrowseMasterCatalogHandler,
  EventBusCommittedPublisher,
  GetLocalAvailabilityHandler,
  InMemoryMasterCatalog,
  KernelLibraryIdentityService,
  ListLocalLibraryHandler,
  RegisterLocalSourceHandler,
  RequestAcquisitionHandler,
  registerLibraryHandlers,
} from "@knowledgeos/library";
import {
  PostgresAcquisitionRepository,
  PostgresKnowledgeObjectRepository,
  PostgresLocalLibraryRepository,
  PostgresPublicationVersionRepository,
  PostgresSourceItemRepository,
} from "@knowledgeos/infrastructure-postgres";
import {
  createPostgresRuntime,
  PostgresHealthCheck,
  PostgresMigrationRunner,
  type PostgresRuntime,
} from "@knowledgeos/infrastructure-postgres-node";
import {
  HealthService,
  InMemoryHttpRouter,
  registerLibraryRoutes,
  type HttpRouter,
  type ServerConfiguration,
} from "@knowledgeos/server";
import {
  NodeHttpServer,
  type BoundServerAddress,
} from "@knowledgeos/server-node";
import { libraryMigrations } from "./migrations.js";

export interface RunningPostgresServer {
  readonly address: BoundServerAddress;
  readonly defaultLocalLibraryId: LocalLibraryId;
  stop(): Promise<void>;
}

async function ensureDefaultLibrary(
  repository: PostgresLocalLibraryRepository,
  events: DomainEventFactory,
  identities: KernelLibraryIdentityService,
  ids: MonotonicIdGenerator,
): Promise<LocalLibraryId> {
  const id = "local-library:server-default" as LocalLibraryId;
  const existing = await repository.get(id);
  if (existing) return id;

  const version = identities.versionId() as VersionId;
  const correlation = ids.correlationId() as CorrelationId;
  const library = LocalLibrary.create(
    {
      id,
      name: "Server Default Local Library",
      memberships: [],
    },
    events.create(
      "local-library.created",
      id,
      version,
      correlation,
      { name: "Server Default Local Library" },
    ),
  );

  await repository.save(library);
  library.pullEvents();
  return id;
}

export async function startPostgresServer(
  configuration: ServerConfiguration,
): Promise<RunningPostgresServer> {
  const postgres = await createPostgresRuntime({
    connectionString: configuration.databaseUrl,
    application_name: "knowledgeos-server",
    max: 10,
    connectionTimeoutMillis: 5_000,
  });

  try {
    await new PostgresMigrationRunner(
      postgres.database,
    ).migrate(libraryMigrations);

    const clock = new SystemClock();
    const ids = new MonotonicIdGenerator(clock, "server");
    const contractVersion = "5.0.0" as ContractVersion;
    const commandBus = new InMemoryCommandBus();
    const queryBus = new InMemoryQueryBus();
    const eventBus = new InMemoryEventBus();
    const identities = new KernelLibraryIdentityService(ids);
    const events = new DomainEventFactory({
      eventId: () => ids.eventId(),
      now: () => clock.nowIso(),
      contractVersion,
    });

    const knowledgeObjects =
      new PostgresKnowledgeObjectRepository(
        postgres.database,
      );
    const sources = new PostgresSourceItemRepository(
      postgres.database,
    );
    const publications =
      new PostgresPublicationVersionRepository(
        postgres.database,
      );
    const localLibraries =
      new PostgresLocalLibraryRepository(
        postgres.database,
      );
    const acquisitions =
      new PostgresAcquisitionRepository(
        postgres.database,
      );
    const catalog = new InMemoryMasterCatalog();
    const publisher =
      new EventBusCommittedPublisher(eventBus);

    const defaultLocalLibraryId =
      await ensureDefaultLibrary(
        localLibraries,
        events,
        identities,
        ids,
      );

    registerLibraryHandlers(commandBus, queryBus, {
      registerLocalSource:
        new RegisterLocalSourceHandler({
          knowledgeObjects,
          sources,
          publications,
          localLibraries,
          identities,
          events,
          unitOfWork: postgres.database,
          publisher,
        }),
      requestAcquisition:
        new RequestAcquisitionHandler({
          acquisitions,
          localLibraries,
          catalog,
          identities,
          events,
          unitOfWork: postgres.database,
          publisher,
        }),
      browseMasterCatalog:
        new BrowseMasterCatalogHandler(catalog),
      getLocalAvailability:
        new GetLocalAvailabilityHandler(
          localLibraries,
        ),
      listLocalLibrary:
        new ListLocalLibraryHandler({
          libraries: localLibraries,
          knowledgeObjects,
          publications,
        }),
    });

    const router = new InMemoryHttpRouter();
    registerLibraryRoutes(router, {
      commandBus,
      queryBus,
      contractVersion,
    });

    const postgresHealth =
      new PostgresHealthCheck(postgres.database);
    const health = new HealthService([
      {
        name: "postgresql",
        async execute() {
          const result = await postgresHealth.execute();
          return {
            name: "postgresql",
            state:
              result.state === "healthy"
                ? "healthy"
                : "unhealthy",
            details: {
              latencyMilliseconds:
                result.latencyMilliseconds,
              ...(result.error === undefined
                ? {}
                : { error: result.error }),
            },
          };
        },
      },
    ]);

    router.register("GET", "/health/live", async () => ({
      status: 200,
      body: { state: "healthy" },
    }));
    router.register("GET", "/health/ready", async () => {
      const result = await health.check();
      return {
        status:
          result.state === "unhealthy" ? 503 : 200,
        body: result,
      };
    });

    const server = new NodeHttpServer(
      router,
      configuration,
    );
    const address = await server.start();

    return {
      address,
      defaultLocalLibraryId,
      async stop() {
        await server.stop();
        await postgres.close();
      },
    };
  } catch (error) {
    await postgres.close();
    throw error;
  }
}
