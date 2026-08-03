import type { PublicationId } from "@knowledgeos/domain-types";
import type {
  PublicationVersion,
  PublicationVersionRepository,
} from "@knowledgeos/domain";
import {
  publicationVersionFromRow,
  publicationVersionToRow,
} from "../mappers.js";
import type { SqlExecutor, SqlRow } from "../sql.js";
import { BaseJsonRepository } from "./base-json-repository.js";

export class PostgresPublicationVersionRepository
  extends BaseJsonRepository<PublicationId, PublicationVersion>
  implements PublicationVersionRepository {
  public constructor(sql: SqlExecutor) {
    super("publication_versions", sql);
  }

  protected toRow(value: PublicationVersion) {
    return publicationVersionToRow(value);
  }

  protected fromRow(row: SqlRow): PublicationVersion {
    return publicationVersionFromRow(row);
  }
}
