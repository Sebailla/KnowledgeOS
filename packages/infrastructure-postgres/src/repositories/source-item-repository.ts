import type { SourceItemId } from "@knowledgeos/domain-types";
import type {
  SourceItem,
  SourceItemRepository,
} from "@knowledgeos/domain";
import {
  sourceItemFromRow,
  sourceItemToRow,
} from "../mappers.js";
import type { SqlExecutor, SqlRow } from "../sql.js";
import { BaseJsonRepository } from "./base-json-repository.js";

export class PostgresSourceItemRepository
  extends BaseJsonRepository<SourceItemId, SourceItem>
  implements SourceItemRepository {
  public constructor(sql: SqlExecutor) {
    super("source_items", sql);
  }

  protected toRow(value: SourceItem) {
    return sourceItemToRow(value);
  }

  protected fromRow(row: SqlRow): SourceItem {
    return sourceItemFromRow(row);
  }
}
