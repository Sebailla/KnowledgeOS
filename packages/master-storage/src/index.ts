import { mkdir, writeFile, rename } from "node:fs/promises"; import { join } from "node:path"; import { createHash } from "node:crypto";
export * from "./ingest.js";
export * from "./postgres/client.js";
export * from "./postgres/migrations.js";
export * from "./postgres/catalog.js";
export * from "./postgres/operations.js";
export * from "./postgres/jobs.js";
export * from "./postgres/reconciliation.js";
export * from "./postgres/ingest.js";
export interface StoredDescriptor {readonly publicationId:string;readonly versionId:string;readonly sourceItemId:string;readonly mediaType:string;readonly byteLength:number;readonly contentFingerprint:string;readonly relativePath:string;}
export class InMemoryMasterStorageCatalog { private readonly map=new Map<string,StoredDescriptor>(); save(v:StoredDescriptor){this.map.set(`${v.publicationId}:${v.versionId}`,v);} get(p:string,v:string){const x=this.map.get(`${p}:${v}`); if(!x) throw new Error("Master content not found"); return x;} }
export class MasterPublicationStorage { constructor(private readonly root:string,private readonly catalog:InMemoryMasterStorageCatalog){} async stage(bytes:Uint8Array,mediaType:string){await mkdir(join(this.root,"staging"),{recursive:true});const fingerprint=`sha256:${createHash("sha256").update(bytes).digest("hex")}`;const temp=join(this.root,"staging",fingerprint.replace(":","-"));await writeFile(temp,bytes);return {temp,mediaType,byteLength:bytes.byteLength,contentFingerprint:fingerprint};} async commit(input:any){const rel=join("publications",input.publicationId,input.versionId,"content");const target=join(this.root,rel);await mkdir(join(this.root,"publications",input.publicationId,input.versionId),{recursive:true});await rename(input.staged.temp,target);const d={publicationId:input.publicationId,versionId:input.versionId,sourceItemId:input.sourceItemId,mediaType:input.staged.mediaType,byteLength:input.staged.byteLength,contentFingerprint:input.staged.contentFingerprint,relativePath:rel};this.catalog.save(d);return d;} }
