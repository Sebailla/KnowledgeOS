import { KernelError } from "./KernelError.js";

export class KernelLifecycleError extends KernelError {
  public constructor(
    phase: string,
    engineId: string,
    cause: unknown,
  ) {
    super(
      `Kernel lifecycle phase '${phase}' failed for engine '${engineId}'.`,
      "KERNEL_LIFECYCLE_ERROR",
      { cause },
    );
  }
}
