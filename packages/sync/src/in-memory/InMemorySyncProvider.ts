import type { SyncProvider } from "../contracts/SyncProvider.js";
import type { SyncSession } from "../contracts/SyncSession.js";
import { InMemorySyncSession } from "./InMemorySyncSession.js";
export class InMemorySyncProvider implements SyncProvider { public readonly id='in-memory';private closed=false;public constructor(private readonly session=new InMemorySyncSession()){} async openSession():Promise<SyncSession>{if(this.closed)throw new Error('Sync provider is closed.');return this.session;} async close():Promise<void>{this.closed=true;} }
