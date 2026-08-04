export interface PluginDependency {
  readonly pluginId: string;
  readonly versionRange: string;
  readonly optional?: boolean;
}
