import type { AnnotationId } from "@knowledgeos/domain-types";
import type {
  Annotation,
  AnnotationRepository,
} from "@knowledgeos/domain";
import {
  annotationFromRow,
  annotationToRow,
} from "../mappers.js";
import type { SqlExecutor, SqlRow } from "../sql.js";
import { BaseJsonRepository } from "./base-json-repository.js";

export class PostgresAnnotationRepository
  extends BaseJsonRepository<AnnotationId, Annotation>
  implements AnnotationRepository {
  public constructor(sql: SqlExecutor) {
    super("annotations", sql);
  }

  protected toRow(value: Annotation) {
    return annotationToRow(value);
  }

  protected fromRow(row: SqlRow): Annotation {
    return annotationFromRow(row);
  }
}
