import { KernelError } from "./KernelError.js";

export class EngineAlreadyRegisteredError extends KernelError {
  public constructor(engineId: string) {
    super(
      `Engine '${engineId}' is already registered.`,
      "ENGINE_ALREADY_REGISTERED",
    );
  }
}
