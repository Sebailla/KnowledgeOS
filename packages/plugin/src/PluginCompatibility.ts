import { PluginValidationError } from "./errors/PluginValidationError.js";
import type { PluginManifest } from "./model/PluginManifest.js";

export class PluginCompatibility {
  public constructor(
    private readonly supportedApiVersion: string,
  ) {}

  public assertCompatible(
    manifest: PluginManifest,
  ): void {
    const supportedMajor =
      this.supportedApiVersion.split(".")[0];

    const pluginMajor =
      manifest.apiVersion.split(".")[0];

    if (supportedMajor !== pluginMajor) {
      throw new PluginValidationError(
        `Plugin '${manifest.id}' targets API ${manifest.apiVersion}, ` +
        `but runtime supports ${this.supportedApiVersion}.`,
      );
    }
  }
}
