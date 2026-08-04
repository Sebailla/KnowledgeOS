import type { PluginProvider } from "../contracts/PluginProvider.js";
import type { PluginModule } from "../contracts/PluginModule.js";
import type { PluginManifest } from "../model/PluginManifest.js";

export class InMemoryPluginProvider
implements PluginProvider {
  private readonly modules =
    new Map<string, PluginModule>();

  public register(
    pluginId: string,
    module: PluginModule,
  ): void {
    this.modules.set(pluginId, module);
  }

  public async load(
    manifest: PluginManifest,
  ): Promise<PluginModule> {
    const module =
      this.modules.get(manifest.id);

    if (!module) {
      throw new Error(
        `Plugin module '${manifest.id}' is unavailable.`,
      );
    }

    return module;
  }
}
