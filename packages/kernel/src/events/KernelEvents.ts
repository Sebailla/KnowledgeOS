import type { KernelState } from "../lifecycle/KernelState.js";

export type KernelEvent =
  | {
      readonly type: "kernel-state-changed";
      readonly previousState: KernelState;
      readonly currentState: KernelState;
    }
  | {
      readonly type: "engine-registered";
      readonly engineId: string;
    }
  | {
      readonly type: "engine-initialized";
      readonly engineId: string;
    }
  | {
      readonly type: "engine-started";
      readonly engineId: string;
    }
  | {
      readonly type: "engine-stopped";
      readonly engineId: string;
    }
  | {
      readonly type: "engine-disposed";
      readonly engineId: string;
    };

export type KernelEventListener = (event: KernelEvent) => void;
