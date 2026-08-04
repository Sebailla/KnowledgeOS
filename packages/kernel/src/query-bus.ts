import type { ExecutionContext } from "./execution-context.js";
import { HandlerRegistry } from "./handler-registry.js";
import {
  composeMiddleware,
  type Middleware,
} from "./middleware.js";

export interface Query<TResult> {
  readonly type: string;
}

export interface QueryHandler<
  TQuery extends Query<TResult>,
  TResult,
> {
  execute(
    query: TQuery,
    context: ExecutionContext,
  ): Promise<TResult>;
}

export class QueryBus {
  private readonly handlers =
    new HandlerRegistry<QueryHandler<Query<unknown>, unknown>>();
  private readonly middleware:
    Middleware<Query<unknown>, unknown>[] = [];

  public register<TQuery extends Query<TResult>, TResult>(
    type: TQuery["type"],
    handler: QueryHandler<TQuery, TResult>,
  ): void {
    this.handlers.register(
      type,
      handler as QueryHandler<Query<unknown>, unknown>,
    );
  }

  public use(
    middleware: Middleware<Query<unknown>, unknown>,
  ): void {
    this.middleware.push(middleware);
  }

  public async execute<TQuery extends Query<TResult>, TResult>(
    query: TQuery,
    context: ExecutionContext,
  ): Promise<TResult> {
    context.cancellation.throwIfCancellationRequested();

    const handler = this.handlers.get(query.type);

    return composeMiddleware(
      this.middleware,
      query,
      context,
      async () => {
        context.cancellation.throwIfCancellationRequested();
        return handler.execute(query, context);
      },
    ) as Promise<TResult>;
  }
}
