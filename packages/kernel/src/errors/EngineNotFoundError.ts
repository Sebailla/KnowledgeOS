import { KernelError } from "./KernelError.js";

export class EngineNotFoundError extends KernelError {
  public constructor(engineId: string) {
    super(
      `Engine '${engineId}' is not registered.`,
      "ENGINE_NOT_FOUND",
    );
  }
}
