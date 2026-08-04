import type { PluginDescriptor } from "./model/PluginDescriptor.js";

export class PluginRegistry {
  private readonly plugins =
    new Map<string, PluginDescriptor>();

  public register(
    descriptor: PluginDescriptor,
  ): void {
    if (
      this.plugins.has(
        descriptor.manifest.id,
      )
    ) {
      throw new Error(
        `Plugin '${descriptor.manifest.id}' is already registered.`,
      );
    }

    this.plugins.set(
      descriptor.manifest.id,
      descriptor,
    );
  }

  public update(
    descriptor: PluginDescriptor,
  ): void {
    this.plugins.set(
      descriptor.manifest.id,
      descriptor,
    );
  }

  public get(
    pluginId: string,
  ): PluginDescriptor | undefined {
    return this.plugins.get(pluginId);
  }

  public remove(
    pluginId: string,
  ): boolean {
    return this.plugins.delete(pluginId);
  }

  public list():
  readonly PluginDescriptor[] {
    return [...this.plugins.values()]
      .sort((left, right) =>
        left.manifest.id.localeCompare(
          right.manifest.id,
        ),
      );
  }
}
