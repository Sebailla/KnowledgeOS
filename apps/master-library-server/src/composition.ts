import type {
  MasterPublicationRepository,
  MasterPublicationVersionRepository,
  AddMasterPublicationVersionService,
} from "@knowledgeos/master-library";
import type {
  MasterPublicationStorage,
} from "@knowledgeos/master-storage";
import type {
  MasterRegistrationWorkflow,
} from "@knowledgeos/master-registration-workflow";
import {
  registerMasterLibraryRoutes,
} from "./master-library-api.js";
import { PatternHttpRouter } from "./router.js";

export interface MasterLibraryApplicationDependencies {
  readonly registration: MasterRegistrationWorkflow;
  readonly addVersion: AddMasterPublicationVersionService;
  readonly publications: MasterPublicationRepository;
  readonly versions: MasterPublicationVersionRepository;
  readonly storage: MasterPublicationStorage;
}

export function createMasterLibraryApplication(
  dependencies: MasterLibraryApplicationDependencies,
) {
  const router = new PatternHttpRouter();

  registerMasterLibraryRoutes(
    router,
    dependencies,
  );

  router.register("GET", "/health/live", async () => ({
    status: 200,
    body: { state: "healthy" },
  }));

  return { router };
}
