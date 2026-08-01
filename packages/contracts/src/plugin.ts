import type { PluginId } from "@knowledgeos/domain-types";
import type { Command } from "./command.js";
import type { Query } from "./query.js";

export type PluginCapability =
  | "knowledge.read"
  | "personal-knowledge.read"
  | "personal-knowledge.write"
  | "search.query"
  | "ai.request"
  | "import.register"
  | "export.register"
  | "render.register"
  | "network.request"
  | "storage.plugin-scoped"
  | "ui.contribute";

export interface InstallPluginPayload {
  readonly packageUri: string;
  readonly expectedChecksum?: string;
}

export type InstallPluginCommand = Command<
  "plugin.install",
  InstallPluginPayload
>;

export interface GrantCapabilityPayload {
  readonly pluginId: PluginId;
  readonly capability: PluginCapability;
  readonly scope?: Readonly<Record<string, string>>;
}

export type GrantCapabilityCommand = Command<
  "plugin.grant-capability",
  GrantCapabilityPayload
>;

export type ListPluginsQuery = Query<
  "plugin.list",
  { readonly includeDisabled?: boolean }
>;
