import type { KnowledgeObjectId } from "@knowledgeos/domain-types";
import type {
  KnowledgeObject,
  KnowledgeObjectRepository,
} from "@knowledgeos/domain";
import {
  knowledgeObjectFromRow,
  knowledgeObjectToRow,
} from "../mappers.js";
import type { SqlExecutor, SqlRow } from "../sql.js";
import { BaseJsonRepository } from "./base-json-repository.js";

export class PostgresKnowledgeObjectRepository
  extends BaseJsonRepository<KnowledgeObjectId, KnowledgeObject>
  implements KnowledgeObjectRepository {
  public constructor(sql: SqlExecutor) {
    super("knowledge_objects", sql);
  }

  protected toRow(value: KnowledgeObject) {
    return knowledgeObjectToRow(value);
  }

  protected fromRow(row: SqlRow): KnowledgeObject {
    return knowledgeObjectFromRow(row);
  }
}
