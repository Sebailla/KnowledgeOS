import type { SyncJob } from "./model/SyncJob.js";
export class SyncQueue { private readonly jobs: SyncJob[]=[]; enqueue(job:SyncJob):void{this.jobs.push(job);} dequeue():SyncJob|undefined{return this.jobs.shift();} peek():SyncJob|undefined{return this.jobs[0];} get size():number{return this.jobs.length;} list():readonly SyncJob[]{return [...this.jobs];} }
