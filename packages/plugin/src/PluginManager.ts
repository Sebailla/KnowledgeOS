import type { PluginContext } from "./contracts/PluginContext.js";
import type { PluginModule } from "./contracts/PluginModule.js";
import type { PluginProvider } from "./contracts/PluginProvider.js";
import { PluginCompatibility } from "./PluginCompatibility.js";
import { PluginManifestValidator } from "./PluginManifestValidator.js";
import { PluginRegistry } from "./PluginRegistry.js";
import type { PluginDescriptor } from "./model/PluginDescriptor.js";
import type { PluginManifest } from "./model/PluginManifest.js";

export interface PluginManagerDependencies {
  readonly provider: PluginProvider;
  readonly registry: PluginRegistry;
  readonly validator: PluginManifestValidator;
  readonly compatibility: PluginCompatibility;
  readonly now: () => string;
}

export class PluginManager {
  private readonly modules =
    new Map<string, PluginModule>();

  public constructor(
    private readonly dependencies:
      PluginManagerDependencies,
  ) {}

  public install(
    manifest: PluginManifest,
  ): PluginDescriptor {
    this.dependencies.validator
      .validate(manifest);

    this.dependencies.compatibility
      .assertCompatible(manifest);

    const descriptor: PluginDescriptor = {
      manifest,
      state: "installed",
      installedAt:
        this.dependencies.now(),
    };

    this.dependencies.registry
      .register(descriptor);

    return descriptor;
  }

  public async activate(
    pluginId: string,
  ): Promise<PluginDescriptor> {
    const descriptor =
      this.require(pluginId);

    const module =
      await this.dependencies.provider
        .load(descriptor.manifest);

    const context =
      createContext(
        descriptor.manifest,
      );

    try {
      await module.activate(context);

      const active: PluginDescriptor = {
        ...descriptor,
        state: "active",
        activatedAt:
          this.dependencies.now(),
      };

      this.modules.set(pluginId, module);

      this.dependencies.registry
        .update(active);

      return active;
    } catch (error) {
      const failed: PluginDescriptor = {
        ...descriptor,
        state: "failed",
        lastError:
          error instanceof Error
            ? error.message
            : String(error),
      };

      this.dependencies.registry
        .update(failed);

      throw error;
    }
  }

  public async deactivate(
    pluginId: string,
  ): Promise<PluginDescriptor> {
    const descriptor =
      this.require(pluginId);

    const module =
      this.modules.get(pluginId);

    if (module) {
      await module.deactivate(
        createContext(
          descriptor.manifest,
        ),
      );
    }

    this.modules.delete(pluginId);

    const inactive: PluginDescriptor = {
      ...descriptor,
      state: "inactive",
    };

    this.dependencies.registry
      .update(inactive);

    return inactive;
  }

  public async uninstall(
    pluginId: string,
  ): Promise<boolean> {
    const descriptor =
      this.dependencies.registry
        .get(pluginId);

    if (!descriptor) {
      return false;
    }

    if (descriptor.state === "active") {
      await this.deactivate(pluginId);
    }

    this.modules.delete(pluginId);

    return this.dependencies.registry
      .remove(pluginId);
  }

  private require(
    pluginId: string,
  ): PluginDescriptor {
    const descriptor =
      this.dependencies.registry
        .get(pluginId);

    if (!descriptor) {
      throw new Error(
        `Plugin '${pluginId}' is not installed.`,
      );
    }

    return descriptor;
  }
}

function createContext(
  manifest: PluginManifest,
): PluginContext {
  return {
    pluginId: manifest.id,
    capabilities: manifest.capabilities,
    permissions: manifest.permissions,
    metadata: manifest.metadata,
  };
}
