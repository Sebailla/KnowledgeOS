import type { PluginContext } from "./PluginContext.js";

export interface PluginModule {
  activate(context: PluginContext): Promise<void>;
  deactivate(context: PluginContext): Promise<void>;
}
