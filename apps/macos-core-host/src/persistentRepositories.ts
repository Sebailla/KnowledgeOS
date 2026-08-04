import type { Annotation, AnnotationCreateInput, AnnotationRepository, AnnotationUpdateInput, DocumentLocation, DocumentPage, DocumentReaderDescriptor, DocumentReaderRepository, DocumentSection } from "@knowledgeos/document";
import { AtomicJsonStore, defaultDataDirectory } from "./persistence.js";
import { join } from "node:path";

interface ReadingState { readonly locations: Readonly<Record<string, DocumentLocation>>; }
interface AnnotationState { readonly annotations: readonly Annotation[]; }

export class PersistentDocumentReaderRepository implements DocumentReaderRepository {
  private readonly store = new AtomicJsonStore<ReadingState>(join(defaultDataDirectory(), "reading.json"), {locations:{}});
  public constructor(private readonly base: DocumentReaderRepository) {}
  public open(id:string):Promise<DocumentReaderDescriptor|undefined>{ return this.base.open(id); }
  public page(id:string,pageNumber:number):Promise<DocumentPage|undefined>{ return this.base.page(id,pageNumber); }
  public sections(id:string):Promise<readonly DocumentSection[]>{ return this.base.sections(id); }
  public async getLocation(id:string){ return (await this.store.read()).locations[id]; }
  public async saveLocation(location:DocumentLocation){ const state=await this.store.read(); await this.store.write({locations:{...state.locations,[location.documentId]:location}}); }
  public health(){ return this.store.health(); }
  public backup(path:string){ return this.store.backup(path); }
  public restore(path:string){ return this.store.restore(path); }
}

export class PersistentAnnotationRepository implements AnnotationRepository {
  private readonly store = new AtomicJsonStore<AnnotationState>(join(defaultDataDirectory(), "annotations.json"), {annotations:[]});
  public constructor(private readonly now:()=>string=()=>new Date().toISOString()) {}
  public async list(documentId:string){ return (await this.store.read()).annotations.filter(a=>a.anchor.documentId===documentId); }
  public async get(id:string){ return (await this.store.read()).annotations.find(a=>a.id===id); }
  public async create(input:AnnotationCreateInput){ const state=await this.store.read(); if(state.annotations.some(a=>a.id===input.id)) throw new Error(`Annotation '${input.id}' already exists.`); const time=this.now(); const item:Annotation={...input,createdAt:time,updatedAt:time}; await this.store.write({annotations:[...state.annotations,item]}); return item; }
  public async update(id:string,input:AnnotationUpdateInput){ const state=await this.store.read(); const current=state.annotations.find(a=>a.id===id); if(!current)return undefined; const next:Annotation={...current,...input,updatedAt:this.now()}; await this.store.write({annotations:state.annotations.map(a=>a.id===id?next:a)}); return next; }
  public async delete(id:string){ const state=await this.store.read(); const next=state.annotations.filter(a=>a.id!==id); if(next.length===state.annotations.length)return false; await this.store.write({annotations:next}); return true; }
  public health(){ return this.store.health(); }
  public backup(path:string){ return this.store.backup(path); }
  public restore(path:string){ return this.store.restore(path); }
}
