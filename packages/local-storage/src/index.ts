import { mkdir, access, rm, readdir } from "node:fs/promises"; import { resolve } from "node:path";
function safe(root:string,rel:string){const target=resolve(root,rel); if(target!==resolve(root)&&!target.startsWith(resolve(root)+"/")) throw new Error("Path traversal rejected"); return target;}
export class LocalFilesystemContentStore { constructor(private readonly root:string){} async initialize(){await mkdir(this.root,{recursive:true});} async exists(rel:string){try{await access(safe(this.root,rel));return true}catch{return false}} async remove(rel:string){if(rel) await rm(safe(this.root,rel),{force:true});} }
export class LocalStorageScanner { constructor(private readonly root:string){} async scan(){await mkdir(this.root,{recursive:true}); return readdir(this.root,{recursive:true});} }
