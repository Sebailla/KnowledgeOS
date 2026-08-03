import type { DomainEvent } from "@knowledgeos/contracts";
import type { ErrorCategory } from "@knowledgeos/domain-types";

export class DomainError extends Error {
  constructor(public readonly code:string, public readonly category:ErrorCategory, message:string){super(message);this.name="DomainError";}
}
export abstract class Entity<Id>{protected constructor(public readonly id:Id){} equals(other:Entity<Id>):boolean{return this.constructor===other.constructor&&this.id===other.id;}}
export abstract class AggregateRoot<Id> extends Entity<Id>{private readonly events:DomainEvent[]=[]; protected raise(event:DomainEvent):void{this.events.push(event);} pullEvents():readonly DomainEvent[]{const out=[...this.events];this.events.length=0;return out;} peekEvents():readonly DomainEvent[]{return [...this.events];}}
