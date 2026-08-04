import type { PluginCapability } from "../model/PluginCapability.js";
import type { PluginPermission } from "../model/PluginPermission.js";

export interface PluginContext {
  readonly pluginId: string;
  readonly capabilities: readonly PluginCapability[];
  readonly permissions: readonly PluginPermission[];
  readonly metadata: Readonly<Record<string, unknown>>;
}
