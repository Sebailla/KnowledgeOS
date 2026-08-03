import { StorageError } from "./StorageError.js";

export class StorageConflictError extends StorageError {
  public constructor(message: string) {
    super(message, "STORAGE_CONFLICT");
  }
}
