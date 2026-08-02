import type { LocalManifest, MasterManifest, SyncDifference } from "./model.js";
export class ManifestDiffService {
  compare(master: MasterManifest, local: LocalManifest): readonly SyncDifference[] {
    const localByPublication=new Map(local.entries.map(e=>[String(e.publicationId),e]));
    return master.entries.map(entry=>{
      const current=localByPublication.get(String(entry.publicationId));
      if(!current) return {state:"missing" as const,master:entry};
      if(current.versionId!==entry.versionId || current.fingerprint!==entry.fingerprint || !current.availableOffline) return {state:"outdated" as const,master:entry,local:current};
      return {state:"current" as const,master:entry,local:current};
    });
  }
}
