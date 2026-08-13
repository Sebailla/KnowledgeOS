import type { StoredDescriptor } from "../index.js";
import type { SqlClient } from "./client.js";
import type { AcquisitionManifest, MasterCatalogPage } from "@knowledgeos/contracts";
import type { KnowledgeObjectId, PublicationId, VersionId } from "@knowledgeos/domain-types";
interface DescriptorRow { readonly publication_id: string; readonly version_id: string; readonly source_item_id: string; readonly media_type: string; readonly byte_length: string | number; readonly content_fingerprint: string; readonly relative_path: string; }
export class PostgresMasterStorageCatalog {
  public constructor(private readonly client: SqlClient) {}
  public async save(descriptor: StoredDescriptor): Promise<void> { await this.client.query("INSERT INTO master_publications (publication_id, version_id, source_item_id, media_type, byte_length, content_fingerprint, relative_path) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (publication_id, version_id) DO UPDATE SET source_item_id = EXCLUDED.source_item_id, media_type = EXCLUDED.media_type, byte_length = EXCLUDED.byte_length, content_fingerprint = EXCLUDED.content_fingerprint, relative_path = EXCLUDED.relative_path", [descriptor.publicationId, descriptor.versionId, descriptor.sourceItemId, descriptor.mediaType, descriptor.byteLength, descriptor.contentFingerprint, descriptor.relativePath]); }
  public async get(publicationId: string, versionId: string): Promise<StoredDescriptor | undefined> { const result = await this.client.query<DescriptorRow>("SELECT publication_id, version_id, source_item_id, media_type, byte_length, content_fingerprint, relative_path FROM master_publications WHERE publication_id = $1 AND version_id = $2", [publicationId, versionId]); const row = result.rows[0]; return row ? { publicationId: row.publication_id, versionId: row.version_id, sourceItemId: row.source_item_id, mediaType: row.media_type, byteLength: Number(row.byte_length), contentFingerprint: row.content_fingerprint, relativePath: row.relative_path } : undefined; }
}

interface CatalogRow extends DescriptorRow { readonly knowledge_object_id: string; readonly title: string; readonly authors: readonly string[] | string; }

/** PostgreSQL-backed public view. Rows without registered public metadata are deliberately invisible. */
export class PostgresMasterCatalogReader {
  public constructor(private readonly client: SqlClient) {}
  public async browse(cursor?: string): Promise<MasterCatalogPage> {
    const [afterPublication = "", afterVersion = ""] = cursor ? cursor.split("|", 2) : [];
    const result = await this.client.query<CatalogRow>("SELECT publication_id, version_id, knowledge_object_id, title, authors FROM master_publications WHERE knowledge_object_id IS NOT NULL AND title IS NOT NULL AND authors IS NOT NULL AND (publication_id, version_id) > ($1, $2) ORDER BY publication_id, version_id LIMIT 51", [afterPublication, afterVersion]);
    const rows = result.rows.slice(0, 50); const last = rows.at(-1);
    return { protocolVersion: "v1", items: rows.map((row) => ({ publicationId: row.publication_id as PublicationId, knowledgeObjectId: row.knowledge_object_id as KnowledgeObjectId, title: row.title, authors: typeof row.authors === "string" ? JSON.parse(row.authors) : row.authors, versionId: row.version_id as VersionId, availability: { kind: "master-library" } as never })), ...(result.rows.length > 50 && last ? { nextCursor: `${last.publication_id}|${last.version_id}` } : {}) };
  }
  public async manifest(publicationId: PublicationId, versionId: VersionId): Promise<AcquisitionManifest> {
    const result = await this.client.query<CatalogRow>("SELECT publication_id, version_id, knowledge_object_id, byte_length, content_fingerprint, media_type, title, authors, source_item_id, relative_path FROM master_publications WHERE publication_id = $1 AND version_id = $2 AND knowledge_object_id IS NOT NULL AND title IS NOT NULL AND authors IS NOT NULL", [publicationId, versionId]); const row = result.rows[0];
    if (!row) throw new Error("Master catalog metadata has not been registered.");
    return { protocolVersion: "v1", publicationId: row.publication_id as PublicationId, knowledgeObjectId: row.knowledge_object_id as KnowledgeObjectId, versionId: row.version_id as VersionId, contentFingerprint: row.content_fingerprint, byteLength: Number(row.byte_length), mediaType: row.media_type };
  }
}
