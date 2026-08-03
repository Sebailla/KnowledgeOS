import type { SearchExecutionRequest } from "./model.js";
export class SearchBackpressureQueue {
  private readonly values: SearchExecutionRequest[]=[];
  public constructor(private readonly capacity:number){ if(capacity<1) throw new Error("capacity must be positive"); }
  enqueue(request:SearchExecutionRequest){ this.values.push(request); this.values.sort((a,b)=>b.priority-a.priority||a.sessionId.localeCompare(b.sessionId)); const dropped=this.values.length>this.capacity?this.values.pop():undefined; return dropped; }
  dequeue(){ return this.values.shift(); }
  get size(){ return this.values.length; }
}
