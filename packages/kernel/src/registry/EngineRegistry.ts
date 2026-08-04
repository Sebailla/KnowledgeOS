import type { Engine } from "../contracts/Engine.js";
import { EngineAlreadyRegisteredError } from "../errors/EngineAlreadyRegisteredError.js";
import { EngineDependencyError } from "../errors/EngineDependencyError.js";
import { EngineNotFoundError } from "../errors/EngineNotFoundError.js";

export class EngineRegistry {
  private readonly engines = new Map<string, Engine>();

  public register(engine: Engine): void {
    if (this.engines.has(engine.id)) {
      throw new EngineAlreadyRegisteredError(engine.id);
    }

    this.engines.set(engine.id, engine);
  }

  public unregister(engineId: string): boolean {
    return this.engines.delete(engineId);
  }

  public has(engineId: string): boolean {
    return this.engines.has(engineId);
  }

  public get(engineId: string): Engine {
    const engine = this.engines.get(engineId);
    if (!engine) {
      throw new EngineNotFoundError(engineId);
    }

    return engine;
  }

  public getAll(): readonly Engine[] {
    return [...this.engines.values()];
  }

  public getOrdered(): readonly Engine[] {
    this.validateDependencies();

    const ordered: Engine[] = [];
    const permanent = new Set<string>();
    const temporary = new Set<string>();

    const visit = (engine: Engine): void => {
      if (permanent.has(engine.id)) {
        return;
      }

      if (temporary.has(engine.id)) {
        throw new EngineDependencyError(
          `Circular engine dependency detected at '${engine.id}'.`,
        );
      }

      temporary.add(engine.id);

      for (const dependencyId of engine.dependencies ?? []) {
        visit(this.get(dependencyId));
      }

      temporary.delete(engine.id);
      permanent.add(engine.id);
      ordered.push(engine);
    };

    for (const engine of this.engines.values()) {
      visit(engine);
    }

    return ordered;
  }

  private validateDependencies(): void {
    for (const engine of this.engines.values()) {
      for (const dependencyId of engine.dependencies ?? []) {
        if (!this.engines.has(dependencyId)) {
          throw new EngineDependencyError(
            `Engine '${engine.id}' depends on missing engine '${dependencyId}'.`,
          );
        }
      }
    }
  }
}
