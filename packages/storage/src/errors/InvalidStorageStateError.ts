import { StorageError } from "./StorageError.js";

export class InvalidStorageStateError extends StorageError {
  public constructor(message: string) {
    super(message, "INVALID_STORAGE_STATE");
  }
}
