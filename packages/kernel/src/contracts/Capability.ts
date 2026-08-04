export interface Capability {
  readonly id: string;
  readonly version: string;
  readonly providerEngineId: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
