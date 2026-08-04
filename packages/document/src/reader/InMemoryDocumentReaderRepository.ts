import type { DocumentReaderRepository } from "./DocumentReaderRepository.js";
import type { DocumentLocation, DocumentPage, DocumentReaderDescriptor } from "./DocumentReaderTypes.js";
export interface InMemoryReadableDocument { readonly descriptor:DocumentReaderDescriptor; readonly pages:readonly string[]; }
export class InMemoryDocumentReaderRepository implements DocumentReaderRepository {
  private readonly locations=new Map<string,DocumentLocation>();
  public constructor(private readonly documents:readonly InMemoryReadableDocument[]=[]){ }
  public async open(id:string){ return this.documents.find(d=>d.descriptor.id===id)?.descriptor; }
  public async page(id:string,pageNumber:number):Promise<DocumentPage|undefined>{ const d=this.documents.find(x=>x.descriptor.id===id); const content=d?.pages[pageNumber-1]; if(!d||content===undefined)return undefined; return {documentId:id,pageNumber,pageCount:d.descriptor.pageCount,content,format:d.descriptor.format}; }
  public async sections(id:string){ return (await this.open(id))?.sections ?? []; }
  public async getLocation(id:string){ return this.locations.get(id); }
  public async saveLocation(location:DocumentLocation){ this.locations.set(location.documentId,location); }
}
