import { Document } from "./model/Document.js";
import type { DocumentMetadata } from "./model/DocumentMetadata.js";
import type { DocumentRepository } from "./contracts/DocumentRepository.js";
import { DocumentError } from "./errors/DocumentError.js";

export interface DocumentManagerDependencies {
  readonly repository: DocumentRepository;
  readonly now: () => string;
  readonly checksum: (content: string) => string;
}

export class DocumentManager {
  public constructor(private readonly dependencies: DocumentManagerDependencies) {}

  public async create(id: string, content: string, metadata: DocumentMetadata, authorId?: string): Promise<Document> {
    if (await this.dependencies.repository.get(id)) throw new DocumentError(`Document '${id}' already exists.`, "DOCUMENT_ALREADY_EXISTS");
    const now = this.dependencies.now();
    const document = Document.create(id, content, metadata, now, this.dependencies.checksum(content), authorId);
    await this.dependencies.repository.save(document.snapshot());
    return document;
  }

  public async open(id: string): Promise<Document> {
    const snapshot = await this.dependencies.repository.get(id);
    if (!snapshot) throw new DocumentError(`Document '${id}' does not exist.`, "DOCUMENT_NOT_FOUND");
    return Document.rehydrate(snapshot);
  }

  public async save(document: Document, expectedVersion?: number): Promise<void> {
    await this.dependencies.repository.save(document.snapshot(), expectedVersion);
  }

  public async revise(id: string, content: string, metadata: DocumentMetadata, authorId?: string): Promise<Document> {
    const document = await this.open(id);
    const previousVersion = document.version;
    document.revise(content, metadata, this.dependencies.now(), this.dependencies.checksum(content), authorId);
    await this.save(document, previousVersion);
    return document;
  }

  public async restore(id: string, revision: number): Promise<Document> {
    const document = await this.open(id);
    const previousVersion = document.version;
    document.restore(revision, this.dependencies.now());
    await this.save(document, previousVersion);
    return document;
  }
}
