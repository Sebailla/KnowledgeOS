export const PROTOCOL_VERSION = "1.0";
export interface RequestEnvelope {
  readonly version: string;
  readonly id: string;
  readonly method: string;
  readonly params?: unknown;
}
export interface ResponseEnvelope {
  readonly version: string;
  readonly id: string;
  readonly result?: unknown;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}
