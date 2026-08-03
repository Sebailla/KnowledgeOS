import type { KernelState } from "../lifecycle/KernelState.js";
import { KernelError } from "./KernelError.js";

export class InvalidKernelStateError extends KernelError {
  public constructor(
    operation: string,
    state: KernelState,
    allowedStates: readonly KernelState[],
  ) {
    super(
      `Cannot ${operation} while kernel is '${state}'. Allowed states: ${allowedStates.join(", ")}.`,
      "INVALID_KERNEL_STATE",
    );
  }
}
