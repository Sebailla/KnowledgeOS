import { PluginError } from "./PluginError.js";

export class PluginValidationError extends PluginError {
  public constructor(message: string) {
    super(message, "PLUGIN_VALIDATION_ERROR");
  }
}
