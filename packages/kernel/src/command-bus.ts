import type {
  Command,
  CommandReceipt,
} from "@knowledgeos/contracts";
import type { ExecutionContext } from "./execution-context.js";
import { HandlerRegistry } from "./handler-registry.js";
import {
  composeMiddleware,
  type Middleware,
} from "./middleware.js";

export interface CommandHandler<TCommand extends Command = Command> {
  handle(
    command: TCommand,
    context: ExecutionContext,
  ): Promise<CommandReceipt>;
}

export interface CommandBus {
  execute<TCommand extends Command>(
    command: TCommand,
    context: ExecutionContext,
  ): Promise<CommandReceipt>;
}

export class InMemoryCommandBus implements CommandBus {
  private readonly handlers =
    new HandlerRegistry<CommandHandler>();
  private readonly middleware: Middleware<Command, CommandReceipt>[] = [];

  register<TCommand extends Command>(
    type: TCommand["type"],
    handler: CommandHandler<TCommand>,
  ): void {
    this.handlers.register(type, handler as CommandHandler);
  }

  use(
    middleware: Middleware<Command, CommandReceipt>,
  ): void {
    this.middleware.push(middleware);
  }

  async execute<TCommand extends Command>(
    command: TCommand,
    context: ExecutionContext,
  ): Promise<CommandReceipt> {
    context.cancellation.throwIfCancelled();
    const handler = this.handlers.resolve(command.type);

    return composeMiddleware(
      this.middleware,
      command,
      context,
      () => handler.handle(command, context),
    );
  }
}
