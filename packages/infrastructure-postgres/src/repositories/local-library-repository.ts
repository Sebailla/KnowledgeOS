import type { LocalLibraryId } from "@knowledgeos/domain-types";
import type {
  LocalLibrary,
  LocalLibraryRepository,
} from "@knowledgeos/domain";
import {
  localLibraryFromRow,
  localLibraryToRow,
} from "../mappers.js";
import type { SqlExecutor, SqlRow } from "../sql.js";
import { BaseJsonRepository } from "./base-json-repository.js";

export class PostgresLocalLibraryRepository
  extends BaseJsonRepository<LocalLibraryId, LocalLibrary>
  implements LocalLibraryRepository {
  public constructor(sql: SqlExecutor) {
    super("local_libraries", sql);
  }

  protected toRow(value: LocalLibrary) {
    return localLibraryToRow(value);
  }

  protected fromRow(row: SqlRow): LocalLibrary {
    return localLibraryFromRow(row);
  }
}
