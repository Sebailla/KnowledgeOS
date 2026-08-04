export type PrivacyClass =
  | "public"
  | "publication"
  | "personal"
  | "sensitive"
  | "secret";

export type DataResidency =
  | "device-local"
  | "nas-local"
  | "icloud"
  | "approved-remote";

export interface PrivacyDescriptor {
  readonly privacyClass: PrivacyClass;
  readonly residency: readonly DataResidency[];
  readonly remoteProcessingAllowed: boolean;
}

export const PERSONAL_LOCAL_ONLY: PrivacyDescriptor = {
  privacyClass: "personal",
  residency: ["device-local", "icloud"],
  remoteProcessingAllowed: false,
};
