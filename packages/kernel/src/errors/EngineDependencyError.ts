import { KernelError } from "./KernelError.js";

export class EngineDependencyError extends KernelError {
  public constructor(message: string) {
    super(message, "ENGINE_DEPENDENCY_ERROR");
  }
}
