export class DuplicateHandlerError extends Error {
  public constructor(type: string) {
    super(`Handler already registered for ${type}`);
    this.name = "DuplicateHandlerError";
  }
}

export class MissingHandlerError extends Error {
  public constructor(type: string) {
    super(`No handler registered for ${type}`);
    this.name = "MissingHandlerError";
  }
}

export class HandlerRegistry<Handler> {
  private readonly handlers = new Map<string, Handler>();

  register(type: string, handler: Handler): void {
    if (this.handlers.has(type)) {
      throw new DuplicateHandlerError(type);
    }
    this.handlers.set(type, handler);
  }

  replace(type: string, handler: Handler): void {
    this.handlers.set(type, handler);
  }

  resolve(type: string): Handler {
    const handler = this.handlers.get(type);
    if (!handler) {
      throw new MissingHandlerError(type);
    }
    return handler;
  }

  has(type: string): boolean {
    return this.handlers.has(type);
  }

  listTypes(): readonly string[] {
    return [...this.handlers.keys()].sort();
  }
}
