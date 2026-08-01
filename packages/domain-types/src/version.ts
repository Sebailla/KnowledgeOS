import type { Brand } from "./brand.js";

export type VersionId = Brand<string, "VersionId">;
export type SchemaVersion = Brand<string, "SchemaVersion">;
export type ContractVersion = Brand<string, "ContractVersion">;
export type ConfigurationFingerprint = Brand<string, "ConfigurationFingerprint">;
export type ContentFingerprint = Brand<string, "ContentFingerprint">;

export interface VersionReference {
  readonly versionId: VersionId;
  readonly schemaVersion: SchemaVersion;
  readonly parentVersionIds: readonly VersionId[];
}

export interface Versioned<T> {
  readonly version: VersionReference;
  readonly value: T;
}

export interface ExpectedVersion {
  readonly expectedVersionId?: VersionId;
}

export const INITIAL_SCHEMA_VERSION =
  "5.0.0" as SchemaVersion;
