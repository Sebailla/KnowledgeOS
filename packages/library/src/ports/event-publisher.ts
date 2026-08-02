import type { DomainEvent } from "@knowledgeos/contracts";
import type { ExecutionContext } from "@knowledgeos/kernel";

export interface CommittedEventPublisher {
  publish(
    events: readonly DomainEvent[],
    context: ExecutionContext,
  ): Promise<void>;
}
