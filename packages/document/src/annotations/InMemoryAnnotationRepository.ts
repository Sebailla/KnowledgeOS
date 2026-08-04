import type { AnnotationRepository } from "./AnnotationRepository.js";
import type { Annotation, AnnotationCreateInput, AnnotationUpdateInput } from "./AnnotationTypes.js";
export class InMemoryAnnotationRepository implements AnnotationRepository {
 private readonly items=new Map<string,Annotation>();
 public constructor(private readonly now:()=>string=()=>new Date().toISOString()){}
 async list(documentId:string){return [...this.items.values()].filter(x=>x.anchor.documentId===documentId).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));}
 async get(id:string){return this.items.get(id);}
 async create(input:AnnotationCreateInput){if(this.items.has(input.id)) throw new Error(`Annotation '${input.id}' already exists.`); const t=this.now(); const item:Annotation={...input,createdAt:t,updatedAt:t}; this.items.set(item.id,item); return item;}
 async update(id:string,input:AnnotationUpdateInput){const current=this.items.get(id); if(!current)return undefined; const next:Annotation={...current,...input,updatedAt:this.now()}; this.items.set(id,next); return next;}
 async delete(id:string){return this.items.delete(id);}
}
