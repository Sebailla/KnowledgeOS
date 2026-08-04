import { GraphError } from "./GraphError.js";

export class GraphIntegrityError extends GraphError {
  public constructor(message: string) {
    super(message, "GRAPH_INTEGRITY_ERROR");
  }
}
