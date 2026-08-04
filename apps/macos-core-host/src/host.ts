import { syncCoordinator } from "./syncCoordinator.js";

import {
  createInterface,
  type Interface,
} from "node:readline";
import { stdin, stdout } from "node:process";

import {
  createInMemoryCore,
} from "@knowledgeos/core";
import {
  CancellationNone,
} from "@knowledgeos/kernel";
import {
  InMemoryAIProvider,
} from "@knowledgeos/ai";

import {
  PROTOCOL_VERSION,
  type RequestEnvelope,
  type ResponseEnvelope,
} from "./protocol.js";
import {
  CoreRouter,
  HostError,
} from "./router.js";

export class MacOSCoreHost {
  private readonly core =
    createInMemoryCore();

  private readonly router =
    new CoreRouter(this.core);

  private input:
    Interface | undefined;

  public async start(): Promise<void> {
    await syncCoordinator.initialize();
    await this.core.ai.registerProvider(
      new InMemoryAIProvider(),
    );

    const context = {
      cancellation: CancellationNone,
      metadata: {},
    };

    await this.core.runtime.initialize(context);
    await this.core.runtime.start(context);

    this.input = createInterface({
      input: stdin,
      crlfDelay: Infinity,
    });

    this.input.on(
      "line",
      (line) => void this.handle(line),
    );
  }

  public async stop(): Promise<void> {
    this.input?.close();

    const context = {
      cancellation: CancellationNone,
      metadata: {},
    };

    if (
      this.core.runtime.currentState ===
      "running"
    ) {
      await this.core.runtime.stop(context);
    }

    await this.core.runtime.dispose(context);
  }

  private async handle(
    line: string,
  ): Promise<void> {
    let request: RequestEnvelope;

    try {
      request = JSON.parse(line) as
        RequestEnvelope;
    } catch {
      this.write({
        version: PROTOCOL_VERSION,
        id: "unknown",
        error: {
          code: "INVALID_JSON",
          message: "Invalid JSON.",
        },
      });
      return;
    }

    if (
      request.version !==
      PROTOCOL_VERSION
    ) {
      this.write({
        version: PROTOCOL_VERSION,
        id: request.id,
        error: {
          code:
            "PROTOCOL_VERSION_UNSUPPORTED",
          message:
            "Unsupported protocol version.",
        },
      });
      return;
    }

    try {
      this.write({
        version: PROTOCOL_VERSION,
        id: request.id,
        result:
          await this.router.dispatch(
            request.method,
            request.params,
          ),
      });
    } catch (error) {
      const hostError =
        error instanceof HostError
          ? error
          : new HostError(
              "INTERNAL_ERROR",
              error instanceof Error
                ? error.message
                : String(error),
            );

      this.write({
        version: PROTOCOL_VERSION,
        id: request.id,
        error: {
          code: hostError.code,
          message: hostError.message,
        },
      });
    }
  }

  private write(
    response: ResponseEnvelope,
  ): void {
    stdout.write(
      `${JSON.stringify(response)}\n`,
    );
  }
}
