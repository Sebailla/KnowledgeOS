import type { SyncJob } from "./model/SyncJob.js";
import { SyncQueue } from "./SyncQueue.js";
export class SyncScheduler { private sequence=0; public constructor(private readonly queue:SyncQueue,private readonly now:()=>string){} public schedule():SyncJob{this.sequence+=1;const job:SyncJob={id:`sync-job:${this.sequence}`,createdAt:this.now(),state:'queued',attempts:0};this.queue.enqueue(job);return job;} }
