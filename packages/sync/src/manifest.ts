import type { ContentFingerprint } from "@knowledgeos/domain-types";
import type { MasterManifest, MasterManifestEntry } from "./model.js";
export interface ManifestHasher { hash(value: string): ContentFingerprint; }
export class ManifestBuilder {
  public constructor(private readonly hasher: ManifestHasher) {}
  build(manifestId: string, revision: number, generatedAt: string, entries: readonly MasterManifestEntry[]): MasterManifest {
    const ordered=[...entries].sort((a,b)=>String(a.publicationId).localeCompare(String(b.publicationId)) || String(a.versionId).localeCompare(String(b.versionId)));
    const canonical=ordered.map(e=>[e.knowledgeObjectId,e.publicationId,e.versionId,e.fingerprint,e.byteLength,e.mediaType]);
    return {manifestId,revision,generatedAt,entries:ordered,fingerprint:this.hasher.hash(JSON.stringify(canonical))};
  }
}
