import type { ProgressiveSearchConsumer, SearchExecutionEngine, SearchRuntimeClock, SearchTelemetrySink } from "./contracts.js";
import type { SearchExecutionRequest, SearchEngineStage } from "./model.js";
import { SearchCancellationToken } from "./cancellation.js";

const order: readonly SearchEngineStage[]=["lexical","semantic","graph"];
export class UnifiedSearchExecutionRuntime {
  private readonly tokens=new Map<string,SearchCancellationToken>();
  public constructor(private readonly engines: readonly SearchExecutionEngine[],private readonly telemetry:SearchTelemetrySink,private readonly clock:SearchRuntimeClock){}
  cancel(sessionId:string){ this.tokens.get(sessionId)?.cancel(); }
  async execute(request:SearchExecutionRequest,consumer:ProgressiveSearchConsumer){
    if(!request.query.trim()) throw new Error("Search query is required");
    const token=new SearchCancellationToken(); this.tokens.set(request.sessionId,token);
    const started=this.clock.nowMilliseconds();
    await this.telemetry.append({sessionId:request.sessionId,event:"started",occurredAt:this.clock.nowIso()});
    try{
      for(const stage of order){
        token.throwIfCancelled();
        const engine=this.engines.find(e=>e.stage===stage); if(!engine) continue;
        const stageStart=this.clock.nowMilliseconds();
        const budget=request.budgets[stage];
        let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
        const timeout=new Promise<never>((_,reject)=>{ timeoutHandle=setTimeout(()=>reject(new Error("stage-timeout")),budget); });
        try{
          const results=await Promise.race([engine.execute(request,token),timeout]);
          if(timeoutHandle) clearTimeout(timeoutHandle);
          token.throwIfCancelled();
          const elapsed=this.clock.nowMilliseconds()-stageStart;
          await consumer.publish({sessionId:request.sessionId,stage,results,elapsedMilliseconds:elapsed,timedOut:false,final:stage==="graph"});
          await this.telemetry.append({sessionId:request.sessionId,event:"stage-completed",stage,occurredAt:this.clock.nowIso(),durationMilliseconds:elapsed});
        }catch(error){
          if(timeoutHandle) clearTimeout(timeoutHandle);
          if(error instanceof Error && error.message==="stage-timeout"){
            await consumer.publish({sessionId:request.sessionId,stage,results:[],elapsedMilliseconds:budget,timedOut:true,final:stage==="graph"});
            await this.telemetry.append({sessionId:request.sessionId,event:"stage-timeout",stage,occurredAt:this.clock.nowIso(),durationMilliseconds:budget});
            continue;
          }
          throw error;
        }
      }
      await this.telemetry.append({sessionId:request.sessionId,event:"completed",occurredAt:this.clock.nowIso(),durationMilliseconds:this.clock.nowMilliseconds()-started});
    }catch(error){
      const cancelled=token.cancelled || (error instanceof Error && error.message==="Search cancelled");
      await this.telemetry.append({sessionId:request.sessionId,event:cancelled?"cancelled":"failed",occurredAt:this.clock.nowIso(),durationMilliseconds:this.clock.nowMilliseconds()-started});
      if(!cancelled) throw error;
    }finally{ this.tokens.delete(request.sessionId); }
  }
}
