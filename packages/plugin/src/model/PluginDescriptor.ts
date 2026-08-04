import type { PluginManifest } from "./PluginManifest.js";
import type { PluginState } from "./PluginState.js";

export interface PluginDescriptor {
  readonly manifest: PluginManifest;
  readonly state: PluginState;
  readonly installedAt: string;
  readonly activatedAt?: string;
  readonly lastError?: string;
}
