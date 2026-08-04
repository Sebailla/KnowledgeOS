import type { KernelEventListener } from "../events/KernelEvents.js";

export interface KernelOptions {
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly eventListeners?: readonly KernelEventListener[];
  readonly stopOnStartFailure?: boolean;
}

export const defaultKernelOptions: Required<
  Pick<KernelOptions, "stopOnStartFailure">
> = {
  stopOnStartFailure: true,
};
