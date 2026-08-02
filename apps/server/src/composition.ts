import type {
  ContractVersion,
  CorrelationId,
  LocalLibraryId,
  VersionId,
} from "@knowledgeos/domain-types";
import {
  InMemoryCommandBus,
  InMemoryEventBus,
  InMemoryQueryBus,
  MonotonicIdGenerator,
  PassthroughUnitOfWork,
  SystemClock,
} from "@knowledgeos/kernel";
import {
  DomainEventFactory,
  LocalLibrary,
} from "@knowledgeos/domain";
import {
  BrowseMasterCatalogHandler,
  EventBusCommittedPublisher,
  GetLocalAvailabilityHandler,
  InMemoryAcquisitionRepository,
  InMemoryKnowledgeObjectRepository,
  InMemoryLocalLibraryRepository,
  InMemoryMasterCatalog,
  InMemoryPublicationVersionRepository,
  InMemorySourceItemRepository,
  KernelLibraryIdentityService,
  ListLocalLibraryHandler,
  RegisterLocalSourceHandler,
  RequestAcquisitionHandler,
  registerLibraryHandlers,
} from "@knowledgeos/library";
import {
  InMemoryHttpRouter,
  type HttpRouter,
} from "./http.js";
import { HealthService } from "./health.js";
import { registerLibraryRoutes } from "./library-api.js";

export interface ServerApplication {
  readonly router: HttpRouter;
  readonly health: HealthService;
  readonly defaultLocalLibraryId: LocalLibraryId;
}

export function createServerApplication(): ServerApplication {
  const clock = new SystemClock();
  const ids = new MonotonicIdGenerator(clock, "server");
  const contractVersion = "5.0.0" as ContractVersion;

  const commandBus = new InMemoryCommandBus();
  const queryBus = new InMemoryQueryBus();
  const eventBus = new InMemoryEventBus();

  const knowledgeObjects =
    new InMemoryKnowledgeObjectRepository();
  const sources = new InMemorySourceItemRepository();
  const publications =
    new InMemoryPublicationVersionRepository();
  const localLibraries =
    new InMemoryLocalLibraryRepository();
  const acquisitions =
    new InMemoryAcquisitionRepository();
  const catalog = new InMemoryMasterCatalog();

  const identities = new KernelLibraryIdentityService(ids);
  const events = new DomainEventFactory({
    eventId: () => ids.eventId(),
    now: () => clock.nowIso(),
    contractVersion,
  });
  const publisher = new EventBusCommittedPublisher(eventBus);
  const unitOfWork = new PassthroughUnitOfWork();

  const defaultLocalLibraryId =
    "local-library:server-default" as LocalLibraryId;
  const initialVersionId =
    identities.versionId() as VersionId;
  const initialCorrelationId =
    ids.correlationId() as CorrelationId;
  const initialLibrary = LocalLibrary.create(
    {
      id: defaultLocalLibraryId,
      name: "Server Default Local Library",
      memberships: [],
    },
    events.create(
      "local-library.created",
      defaultLocalLibraryId,
      initialVersionId,
      initialCorrelationId,
      { name: "Server Default Local Library" },
    ),
  );
  void localLibraries.save(initialLibrary);
  initialLibrary.pullEvents();

  const handlers = {
    registerLocalSource: new RegisterLocalSourceHandler({
      knowledgeObjects,
      sources,
      publications,
      localLibraries,
      identities,
      events,
      unitOfWork,
      publisher,
    }),
    requestAcquisition: new RequestAcquisitionHandler({
      acquisitions,
      localLibraries,
      catalog,
      identities,
      events,
      unitOfWork,
      publisher,
    }),
    browseMasterCatalog:
      new BrowseMasterCatalogHandler(catalog),
    getLocalAvailability:
      new GetLocalAvailabilityHandler(localLibraries),
    listLocalLibrary: new ListLocalLibraryHandler({
      libraries: localLibraries,
      knowledgeObjects,
      publications,
    }),
  };

  registerLibraryHandlers(commandBus, queryBus, handlers);

  const router = new InMemoryHttpRouter();
  const health = new HealthService([
    {
      name: "application",
      async execute() {
        return {
          name: "application",
          state: "healthy",
        };
      },
    },
  ]);

  registerLibraryRoutes(router, {
    commandBus,
    queryBus,
    contractVersion,
  });

  router.register("GET", "/health/live", async () => ({
    status: 200,
    body: { state: "healthy" },
  }));

  router.register("GET", "/health/ready", async () => {
    const result = await health.check();
    return {
      status: result.state === "unhealthy" ? 503 : 200,
      body: result,
    };
  });

  return {
    router,
    health,
    defaultLocalLibraryId,
  };
}
