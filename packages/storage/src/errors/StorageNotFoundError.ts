import { StorageError } from "./StorageError.js";

export class StorageNotFoundError extends StorageError {
  public constructor(resource: string, id: string) {
    super(
      `${resource} '${id}' was not found.`,
      "STORAGE_NOT_FOUND",
    );
  }
}
