import type { Query } from "@knowledgeos/contracts";
import type { ExecutionContext } from "./execution-context.js";
import { HandlerRegistry } from "./handler-registry.js";
import {
  composeMiddleware,
  type Middleware,
} from "./middleware.js";

export interface QueryHandler<
  TQuery extends Query = Query,
  TResult = unknown,
> {
  handle(
    query: TQuery,
    context: ExecutionContext,
  ): Promise<TResult>;
}

export interface QueryBus {
  execute<TResult>(
    query: Query,
    context: ExecutionContext,
  ): Promise<TResult>;
}

export class InMemoryQueryBus implements QueryBus {
  private readonly handlers =
    new HandlerRegistry<QueryHandler>();
  private readonly middleware: Middleware<Query, unknown>[] = [];

  register<TQuery extends Query, TResult>(
    type: TQuery["type"],
    handler: QueryHandler<TQuery, TResult>,
  ): void {
    this.handlers.register(type, handler as QueryHandler);
  }

  use(middleware: Middleware<Query, unknown>): void {
    this.middleware.push(middleware);
  }

  async execute<TResult>(
    query: Query,
    context: ExecutionContext,
  ): Promise<TResult> {
    context.cancellation.throwIfCancelled();
    const handler = this.handlers.resolve(query.type);

    return composeMiddleware(
      this.middleware,
      query,
      context,
      () => handler.handle(query, context),
    ) as Promise<TResult>;
  }
}
