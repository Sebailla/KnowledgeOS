export type DocumentContentFormat = "plain-text" | "markdown" | "pdf";
export interface DocumentSection { readonly id:string; readonly title:string; readonly pageNumber:number; readonly level:number; }
export interface DocumentPage { readonly documentId:string; readonly pageNumber:number; readonly pageCount:number; readonly content:string; readonly format:DocumentContentFormat; }
export interface DocumentReaderDescriptor { readonly id:string; readonly title:string; readonly authors:readonly string[]; readonly pageCount:number; readonly format:DocumentContentFormat; readonly sections:readonly DocumentSection[]; readonly metadata:Readonly<Record<string,unknown>>; }
export interface DocumentLocation { readonly documentId:string; readonly pageNumber:number; readonly progress:number; readonly updatedAt:string; }
