import type { AcquisitionId } from "@knowledgeos/domain-types";
import type {
  Acquisition,
  AcquisitionRepository,
} from "@knowledgeos/domain";
import {
  acquisitionFromRow,
  acquisitionToRow,
} from "../mappers.js";
import type { SqlExecutor, SqlRow } from "../sql.js";
import { BaseJsonRepository } from "./base-json-repository.js";

export class PostgresAcquisitionRepository
  extends BaseJsonRepository<AcquisitionId, Acquisition>
  implements AcquisitionRepository {
  public constructor(sql: SqlExecutor) {
    super("acquisitions", sql);
  }

  protected toRow(value: Acquisition) {
    return acquisitionToRow(value);
  }

  protected fromRow(row: SqlRow): Acquisition {
    return acquisitionFromRow(row);
  }
}
