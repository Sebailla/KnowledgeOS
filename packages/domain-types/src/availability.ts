export type PublicationAvailability =
  | "local-available"
  | "remote-available"
  | "evicted"
  | "processing"
  | "corrupt"
  | "unavailable";

export interface AvailabilityDescriptor {
  readonly state: PublicationAvailability;
  readonly readableOffline: boolean;
  readonly acquisitionRequired: boolean;
  readonly reason?: string;
}
