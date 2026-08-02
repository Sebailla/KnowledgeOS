import {
  createServerApplication,
  loadConfiguration,
  type ServerConfiguration,
} from "@knowledgeos/server";
import {
  NodeHttpServer,
  type BoundServerAddress,
} from "./node-http-server.js";

export interface RunningServer {
  readonly address: BoundServerAddress;
  readonly defaultLocalLibraryId: string;
  stop(): Promise<void>;
}

export async function startKnowledgeOSServer(
  configuration: ServerConfiguration,
): Promise<RunningServer> {
  const application = createServerApplication();
  const transport = new NodeHttpServer(
    application.router,
    configuration,
  );
  const address = await transport.start();

  return {
    address,
    defaultLocalLibraryId:
      application.defaultLocalLibraryId,
    stop: () => transport.stop(),
  };
}

export async function startFromEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
): Promise<RunningServer> {
  return startKnowledgeOSServer(
    loadConfiguration(environment),
  );
}
