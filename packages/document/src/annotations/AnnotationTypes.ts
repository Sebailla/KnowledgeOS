export type AnnotationKind = "highlight" | "note" | "bookmark";
export type AnnotationColor = "yellow" | "green" | "blue" | "pink" | "purple";
export interface AnnotationAnchor { readonly documentId:string; readonly pageNumber:number; readonly startOffset?:number; readonly endOffset?:number; readonly selectedText?:string; }
export interface Annotation { readonly id:string; readonly kind:AnnotationKind; readonly anchor:AnnotationAnchor; readonly color?:AnnotationColor; readonly body?:string; readonly createdAt:string; readonly updatedAt:string; }
export interface AnnotationCreateInput { readonly id:string; readonly kind:AnnotationKind; readonly anchor:AnnotationAnchor; readonly color?:AnnotationColor; readonly body?:string; }
export interface AnnotationUpdateInput { readonly color?:AnnotationColor; readonly body?:string; }
