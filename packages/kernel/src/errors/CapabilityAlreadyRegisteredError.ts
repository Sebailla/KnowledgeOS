import { KernelError } from "./KernelError.js";

export class CapabilityAlreadyRegisteredError extends KernelError {
  public constructor(capabilityId: string) {
    super(
      `Capability '${capabilityId}' is already registered.`,
      "CAPABILITY_ALREADY_REGISTERED",
    );
  }
}
