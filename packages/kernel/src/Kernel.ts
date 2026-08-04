import type {
  Engine,
  EngineContext,
} from "./contracts/Engine.js";
import type { Lifecycle } from "./contracts/Lifecycle.js";
import { CancellationSource } from "./cancellation.js";
import {
  defaultKernelOptions,
  type KernelOptions,
} from "./configuration/KernelOptions.js";
import { InvalidKernelStateError } from "./errors/InvalidKernelStateError.js";
import { KernelLifecycleError } from "./errors/KernelLifecycleError.js";
import type {
  KernelEvent,
  KernelEventListener,
} from "./events/KernelEvents.js";
import { KernelState } from "./lifecycle/KernelState.js";
import { EngineRegistry } from "./registry/EngineRegistry.js";

export class Kernel implements Lifecycle {
  private readonly cancellationSource = new CancellationSource();
  private readonly listeners = new Set<KernelEventListener>();
  private readonly metadata: Readonly<Record<string, unknown>>;
  private readonly stopOnStartFailure: boolean;
  private state = KernelState.Created;

  public constructor(
    private readonly registry: EngineRegistry = new EngineRegistry(),
    options: KernelOptions = {},
  ) {
    this.metadata = options.metadata ?? {};
    this.stopOnStartFailure =
      options.stopOnStartFailure ?? defaultKernelOptions.stopOnStartFailure;

    for (const listener of options.eventListeners ?? []) {
      this.listeners.add(listener);
    }
  }

  public getState(): KernelState {
    return this.state;
  }

  public getEngines(): readonly Engine[] {
    return this.registry.getAll();
  }

  public register(engine: Engine): void {
    this.assertState("register an engine", [KernelState.Created]);
    this.registry.register(engine);
    this.emit({
      type: "engine-registered",
      engineId: engine.id,
    });
  }

  public onEvent(listener: KernelEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public async initialize(): Promise<void> {
    this.assertState("initialize", [KernelState.Created]);
    this.transition(KernelState.Initializing);

    try {
      for (const engine of this.registry.getOrdered()) {
        await this.invoke(engine, "initialize");
        this.emit({
          type: "engine-initialized",
          engineId: engine.id,
        });
      }

      this.transition(KernelState.Initialized);
    } catch (error) {
      this.transition(KernelState.Failed);
      throw error;
    }
  }

  public async start(): Promise<void> {
    this.assertState("start", [KernelState.Initialized, KernelState.Stopped]);
    this.transition(KernelState.Starting);

    const started: Engine[] = [];

    try {
      for (const engine of this.registry.getOrdered()) {
        await this.invoke(engine, "start");
        started.push(engine);
        this.emit({
          type: "engine-started",
          engineId: engine.id,
        });
      }

      this.transition(KernelState.Running);
    } catch (error) {
      this.transition(KernelState.Failed);

      if (this.stopOnStartFailure) {
        await this.stopStartedEngines(started);
      }

      throw error;
    }
  }

  public async stop(): Promise<void> {
    this.assertState("stop", [KernelState.Running, KernelState.Failed]);
    this.transition(KernelState.Stopping);

    const errors: unknown[] = [];

    for (const engine of [...this.registry.getOrdered()].reverse()) {
      try {
        await this.invoke(engine, "stop");
        this.emit({
          type: "engine-stopped",
          engineId: engine.id,
        });
      } catch (error) {
        errors.push(error);
      }
    }

    this.transition(KernelState.Stopped);

    if (errors.length > 0) {
      throw new AggregateError(errors, "One or more engines failed to stop.");
    }
  }

  public async dispose(): Promise<void> {
    this.assertState("dispose", [
      KernelState.Created,
      KernelState.Initialized,
      KernelState.Stopped,
      KernelState.Failed,
    ]);

    this.transition(KernelState.Disposing);
    this.cancellationSource.cancel(new Error("Kernel disposed"));

    const errors: unknown[] = [];

    for (const engine of [...this.registry.getOrdered()].reverse()) {
      try {
        await this.invoke(engine, "dispose");
        this.emit({
          type: "engine-disposed",
          engineId: engine.id,
        });
      } catch (error) {
        errors.push(error);
      }
    }

    this.transition(KernelState.Disposed);
    this.listeners.clear();

    if (errors.length > 0) {
      throw new AggregateError(errors, "One or more engines failed to dispose.");
    }
  }

  private async stopStartedEngines(started: readonly Engine[]): Promise<void> {
    for (const engine of [...started].reverse()) {
      try {
        await this.invoke(engine, "stop");
      } catch {
        // Preserve the original startup failure.
      }
    }
  }

  private async invoke(
    engine: Engine,
    phase: "initialize" | "start" | "stop" | "dispose",
  ): Promise<void> {
    const context: EngineContext = {
      cancellation: this.cancellationSource.token,
      metadata: this.metadata,
    };

    try {
      await engine[phase](context);
    } catch (cause) {
      throw new KernelLifecycleError(phase, engine.id, cause);
    }
  }

  private assertState(
    operation: string,
    allowedStates: readonly KernelState[],
  ): void {
    if (!allowedStates.includes(this.state)) {
      throw new InvalidKernelStateError(
        operation,
        this.state,
        allowedStates,
      );
    }
  }

  private transition(nextState: KernelState): void {
    const previousState = this.state;
    this.state = nextState;

    this.emit({
      type: "kernel-state-changed",
      previousState,
      currentState: nextState,
    });
  }

  private emit(event: KernelEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
