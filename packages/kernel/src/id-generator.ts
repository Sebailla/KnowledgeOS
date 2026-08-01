import type {
  CorrelationId,
  EventId,
  JobId,
  OperationId,
  WorkflowId,
} from "@knowledgeos/domain-types";
import type { Clock } from "./clock.js";

export interface IdGenerator {
  operationId(): OperationId;
  correlationId(): CorrelationId;
  eventId(): EventId;
  workflowId(): WorkflowId;
  jobId(): JobId;
}

export class MonotonicIdGenerator implements IdGenerator {
  private sequence = 0;

  public constructor(
    private readonly clock: Clock,
    private readonly nodeId = "local",
  ) {}

  private create(prefix: string): string {
    this.sequence += 1;
    const time = this.clock.now().getTime().toString(36);
    const sequence = this.sequence.toString(36).padStart(6, "0");
    return `${prefix}:${this.nodeId}:${time}:${sequence}`;
  }

  operationId(): OperationId {
    return this.create("operation") as OperationId;
  }

  correlationId(): CorrelationId {
    return this.create("correlation") as CorrelationId;
  }

  eventId(): EventId {
    return this.create("event") as EventId;
  }

  workflowId(): WorkflowId {
    return this.create("workflow") as WorkflowId;
  }

  jobId(): JobId {
    return this.create("job") as JobId;
  }
}
