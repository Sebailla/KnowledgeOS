import { PluginValidationError } from "./errors/PluginValidationError.js";
import type { PluginManifest } from "./model/PluginManifest.js";

export class PluginManifestValidator {
  public validate(manifest: PluginManifest): void {
    if (manifest.id.trim().length === 0) {
      throw new PluginValidationError(
        "Plugin id cannot be empty.",
      );
    }

    if (manifest.name.trim().length === 0) {
      throw new PluginValidationError(
        "Plugin name cannot be empty.",
      );
    }

    if (!isSemver(manifest.version)) {
      throw new PluginValidationError(
        `Plugin version '${manifest.version}' is invalid.`,
      );
    }

    if (!isSemver(manifest.apiVersion)) {
      throw new PluginValidationError(
        `Plugin API version '${manifest.apiVersion}' is invalid.`,
      );
    }

    if (manifest.entrypoint.trim().length === 0) {
      throw new PluginValidationError(
        "Plugin entrypoint cannot be empty.",
      );
    }

    const dependencyIds =
      manifest.dependencies.map(
        (dependency) => dependency.pluginId,
      );

    if (
      new Set(dependencyIds).size !==
      dependencyIds.length
    ) {
      throw new PluginValidationError(
        "Plugin dependencies must be unique.",
      );
    }

    if (
      dependencyIds.includes(manifest.id)
    ) {
      throw new PluginValidationError(
        "Plugin cannot depend on itself.",
      );
    }
  }
}

function isSemver(value: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(value);
}
