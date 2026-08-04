import type {
  Engine,
  EngineContext,
} from "@knowledgeos/kernel";

import type { PluginProvider } from "./contracts/PluginProvider.js";
import { PluginCompatibility } from "./PluginCompatibility.js";
import { PluginManager } from "./PluginManager.js";
import { PluginManifestValidator } from "./PluginManifestValidator.js";
import { PluginRegistry } from "./PluginRegistry.js";

export class PluginEngine implements Engine {
  public readonly id = "plugin";
  public readonly name = "Plugin Engine";
  public readonly version = "1.0.0";
  public readonly dependencies = [
    "workspace",
  ] as const;

  public readonly registry =
    new PluginRegistry();

  public readonly manager:
    PluginManager;

  private running = false;

  public constructor(
    provider: PluginProvider,
    supportedApiVersion = "1.0.0",
    now: () => string =
      () => new Date().toISOString(),
  ) {
    this.manager =
      new PluginManager({
        provider,
        registry: this.registry,
        validator:
          new PluginManifestValidator(),
        compatibility:
          new PluginCompatibility(
            supportedApiVersion,
          ),
        now,
      });
  }

  public async initialize(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation
      .throwIfCancellationRequested();
  }

  public async start(
    context: EngineContext,
  ): Promise<void> {
    context.cancellation
      .throwIfCancellationRequested();

    this.running = true;
  }

  public async stop(
    _context: EngineContext,
  ): Promise<void> {
    this.running = false;
  }

  public async dispose(
    _context: EngineContext,
  ): Promise<void> {
    for (
      const descriptor
      of this.registry.list()
    ) {
      if (
        descriptor.state === "active"
      ) {
        await this.manager.deactivate(
          descriptor.manifest.id,
        );
      }
    }

    this.running = false;
  }

  public assertRunning(): void {
    if (!this.running) {
      throw new Error(
        "Plugin Engine is not running.",
      );
    }
  }
}
