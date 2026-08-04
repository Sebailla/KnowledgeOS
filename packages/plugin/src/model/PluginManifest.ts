import type { PluginCapability } from "./PluginCapability.js";
import type { PluginDependency } from "./PluginDependency.js";
import type { PluginPermission } from "./PluginPermission.js";

export interface PluginManifest {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly apiVersion: string;
  readonly entrypoint: string;
  readonly capabilities: readonly PluginCapability[];
  readonly permissions: readonly PluginPermission[];
  readonly dependencies: readonly PluginDependency[];
  readonly metadata: Readonly<Record<string, unknown>>;
}
