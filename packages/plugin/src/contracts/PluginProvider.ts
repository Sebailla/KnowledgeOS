import type { PluginManifest } from "../model/PluginManifest.js";
import type { PluginModule } from "./PluginModule.js";

export interface PluginProvider {
  load(manifest: PluginManifest): Promise<PluginModule>;
}
