export class HandlerRegistry<THandler> {
  private readonly handlers = new Map<string, THandler>();

  public register(type: string, handler: THandler): void {
    if (this.handlers.has(type)) {
      throw new Error(`Handler '${type}' is already registered.`);
    }

    this.handlers.set(type, handler);
  }

  public replace(type: string, handler: THandler): void {
    this.handlers.set(type, handler);
  }

  public unregister(type: string): boolean {
    return this.handlers.delete(type);
  }

  public has(type: string): boolean {
    return this.handlers.has(type);
  }

  public get(type: string): THandler {
    const handler = this.handlers.get(type);
    if (!handler) {
      throw new Error(`Handler '${type}' is not registered.`);
    }

    return handler;
  }

  public entries(): readonly (readonly [string, THandler])[] {
    return [...this.handlers.entries()];
  }
}
