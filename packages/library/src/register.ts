import type {
  BrowseMasterCatalogQuery,
  GetLocalAvailabilityQuery,
  ListLocalLibraryQuery,
  RegisterLocalSourceCommand,
  RequestAcquisitionCommand,
} from "@knowledgeos/contracts";
import type { InMemoryCommandBus, InMemoryQueryBus } from "@knowledgeos/kernel";
import type { BrowseMasterCatalogHandler } from "./handlers/browse-master-catalog.js";
import type { GetLocalAvailabilityHandler } from "./handlers/get-local-availability.js";
import type { ListLocalLibraryHandler } from "./handlers/list-local-library.js";
import type { RegisterLocalSourceHandler } from "./handlers/register-local-source.js";
import type { RequestAcquisitionHandler } from "./handlers/request-acquisition.js";

export interface LibraryHandlers {
  readonly registerLocalSource: RegisterLocalSourceHandler;
  readonly requestAcquisition: RequestAcquisitionHandler;
  readonly browseMasterCatalog: BrowseMasterCatalogHandler;
  readonly getLocalAvailability: GetLocalAvailabilityHandler;
  readonly listLocalLibrary: ListLocalLibraryHandler;
}

export function registerLibraryHandlers(
  commands: InMemoryCommandBus,
  queries: InMemoryQueryBus,
  handlers: LibraryHandlers,
): void {
  commands.register<RegisterLocalSourceCommand>(
    "library.register-local-source",
    handlers.registerLocalSource,
  );
  commands.register<RequestAcquisitionCommand>(
    "library.request-acquisition",
    handlers.requestAcquisition,
  );
  queries.register<BrowseMasterCatalogQuery, Awaited<ReturnType<BrowseMasterCatalogHandler["handle"]>>>(
    "library.browse-master-catalog",
    handlers.browseMasterCatalog,
  );
  queries.register<GetLocalAvailabilityQuery, Awaited<ReturnType<GetLocalAvailabilityHandler["handle"]>>>(
    "library.get-local-availability",
    handlers.getLocalAvailability,
  );
  queries.register<ListLocalLibraryQuery, Awaited<ReturnType<ListLocalLibraryHandler["handle"]>>>(
    "library.list-local-library",
    handlers.listLocalLibrary,
  );
}
