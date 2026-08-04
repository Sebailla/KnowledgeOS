import type { DocumentLocation, DocumentPage, DocumentReaderDescriptor, DocumentSection } from "./DocumentReaderTypes.js";
export interface DocumentReaderRepository {
  open(id:string):Promise<DocumentReaderDescriptor|undefined>;
  page(id:string,pageNumber:number):Promise<DocumentPage|undefined>;
  sections(id:string):Promise<readonly DocumentSection[]>;
  getLocation(id:string):Promise<DocumentLocation|undefined>;
  saveLocation(location:DocumentLocation):Promise<void>;
}
