import type {
  SqliteTransactionManager,
} from "@knowledgeos/local-library-sqlite";
import type {
  PersonalKnowledgeUnitOfWork,
} from "@knowledgeos/personal-knowledge";

export class SqlitePersonalKnowledgeUnitOfWork
implements PersonalKnowledgeUnitOfWork {
  public constructor(
    private readonly transactions:
      SqliteTransactionManager,
  ) {}

  async run<T>(
    work: () => Promise<T>,
  ): Promise<T> {
    return this.transactions.run(
      async () => work(),
    );
  }
}
