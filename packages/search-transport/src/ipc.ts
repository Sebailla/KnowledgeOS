import { EventEmitter } from "node:events";
import type { ProgressiveSearchBatch, SearchExecutionRequest } from "@knowledgeos/search-execution-runtime";
export class LocalSearchIpcBus {
 private readonly events=new EventEmitter();
 publishRequest(request:SearchExecutionRequest){this.events.emit("request",request)}
 onRequest(listener:(request:SearchExecutionRequest)=>void){this.events.on("request",listener);return()=>this.events.off("request",listener)}
 publishBatch(batch:ProgressiveSearchBatch){this.events.emit(`batch:${batch.sessionId}`,batch)}
 onBatch(sessionId:string,listener:(batch:ProgressiveSearchBatch)=>void){const key=`batch:${sessionId}`;this.events.on(key,listener);return()=>this.events.off(key,listener)}
 cancel(sessionId:string){this.events.emit("cancel",sessionId)}
 onCancel(listener:(id:string)=>void){this.events.on("cancel",listener);return()=>this.events.off("cancel",listener)}
}
