import type { Engine } from "../contracts/Engine.js";
import type { KernelOptions } from "../configuration/KernelOptions.js";
import { Kernel } from "../Kernel.js";
import { EngineRegistry } from "../registry/EngineRegistry.js";

export class KernelBuilder {
  private readonly registry = new EngineRegistry();
  private options: KernelOptions = {};

  public withOptions(options: KernelOptions): this {
    this.options = options;
    return this;
  }

  public addEngine(engine: Engine): this {
    this.registry.register(engine);
    return this;
  }

  public build(): Kernel {
    return new Kernel(this.registry, this.options);
  }
}
