import { PluginValidationError } from "./errors/PluginValidationError.js";
import type { PluginManifest } from "./model/PluginManifest.js";

export class PluginDependencyResolver {
  public resolve(
    manifests: readonly PluginManifest[],
  ): readonly PluginManifest[] {
    const byId = new Map(
      manifests.map(
        (manifest) => [manifest.id, manifest],
      ),
    );

    const temporary = new Set<string>();
    const permanent = new Set<string>();
    const result: PluginManifest[] = [];

    const visit = (
      manifest: PluginManifest,
    ): void => {
      if (permanent.has(manifest.id)) {
        return;
      }

      if (temporary.has(manifest.id)) {
        throw new PluginValidationError(
          `Circular plugin dependency detected at '${manifest.id}'.`,
        );
      }

      temporary.add(manifest.id);

      for (
        const dependency
        of manifest.dependencies
      ) {
        const dependencyManifest =
          byId.get(dependency.pluginId);

        if (!dependencyManifest) {
          if (dependency.optional) {
            continue;
          }

          throw new PluginValidationError(
            `Plugin '${manifest.id}' requires missing dependency ` +
            `'${dependency.pluginId}'.`,
          );
        }

        visit(dependencyManifest);
      }

      temporary.delete(manifest.id);
      permanent.add(manifest.id);
      result.push(manifest);
    };

    for (const manifest of manifests) {
      visit(manifest);
    }

    return result;
  }
}
