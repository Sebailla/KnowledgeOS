import type { ExecutionContext } from "./execution-context.js";
import { HandlerRegistry } from "./handler-registry.js";
import {
  composeMiddleware,
  type Middleware,
} from "./middleware.js";

export interface Command<TResult = void> {
  readonly type: string;
}

export interface CommandHandler<
  TCommand extends Command<TResult>,
  TResult = void,
> {
  execute(
    command: TCommand,
    context: ExecutionContext,
  ): Promise<TResult>;
}

export class CommandBus {
  private readonly handlers =
    new HandlerRegistry<CommandHandler<Command<unknown>, unknown>>();
  private readonly middleware:
    Middleware<Command<unknown>, unknown>[] = [];

  public register<TCommand extends Command<TResult>, TResult>(
    type: TCommand["type"],
    handler: CommandHandler<TCommand, TResult>,
  ): void {
    this.handlers.register(
      type,
      handler as CommandHandler<Command<unknown>, unknown>,
    );
  }

  public use(
    middleware: Middleware<Command<unknown>, unknown>,
  ): void {
    this.middleware.push(middleware);
  }

  public async execute<TCommand extends Command<TResult>, TResult>(
    command: TCommand,
    context: ExecutionContext,
  ): Promise<TResult> {
    context.cancellation.throwIfCancellationRequested();

    const handler = this.handlers.get(command.type);

    return composeMiddleware(
      this.middleware,
      command,
      context,
      async () => {
        context.cancellation.throwIfCancellationRequested();
        return handler.execute(command, context);
      },
    ) as Promise<TResult>;
  }
}
