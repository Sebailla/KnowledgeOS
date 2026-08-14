import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PgSqlClient } from '/app/workspace/packages/master-storage/dist/index.js';

const url = new URL(process.env.DATABASE_URL);
const password = (await readFile(process.env.POSTGRES_PASSWORD_FILE ?? '/run/secrets/postgres_password', 'utf8')).trim();
const client = new PgSqlClient({ host: url.hostname, port: Number(url.port || 5432), database: url.pathname.slice(1), user: decodeURIComponent(url.username), password });
try {
  const bytes = await readFile('/var/lib/knowledgeos/master-library/publication.txt');
  const fingerprint = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
  await client.query("INSERT INTO master_publications (publication_id, version_id, source_item_id, media_type, byte_length, content_fingerprint, relative_path, knowledge_object_id, title, authors) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb) ON CONFLICT (publication_id,version_id) DO UPDATE SET knowledge_object_id=EXCLUDED.knowledge_object_id,title=EXCLUDED.title,authors=EXCLUDED.authors,content_fingerprint=EXCLUDED.content_fingerprint,byte_length=EXCLUDED.byte_length", ['publication:fixture-0001', 'version:fixture-0001', 'source-item:fixture-0001', 'text/plain', bytes.byteLength, fingerprint, 'publication.txt', 'knowledge-object:fixture-0001', 'Fixture publication', JSON.stringify(['KnowledgeOS'])]);
} finally { await client.close(); }
