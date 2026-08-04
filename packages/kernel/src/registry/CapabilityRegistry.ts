import type { Capability } from "../contracts/Capability.js";
import { CapabilityAlreadyRegisteredError } from "../errors/CapabilityAlreadyRegisteredError.js";

export class CapabilityRegistry {
  private readonly capabilities = new Map<string, Capability>();
  private readonly byProvider = new Map<string, Set<string>>();

  public register(capability: Capability): void {
    if (this.capabilities.has(capability.id)) {
      throw new CapabilityAlreadyRegisteredError(capability.id);
    }

    this.capabilities.set(capability.id, capability);

    const providerCapabilities =
      this.byProvider.get(capability.providerEngineId) ?? new Set<string>();

    providerCapabilities.add(capability.id);
    this.byProvider.set(
      capability.providerEngineId,
      providerCapabilities,
    );
  }

  public unregister(capabilityId: string): boolean {
    const capability = this.capabilities.get(capabilityId);
    if (!capability) {
      return false;
    }

    this.capabilities.delete(capabilityId);

    const providerCapabilities =
      this.byProvider.get(capability.providerEngineId);

    providerCapabilities?.delete(capabilityId);

    if (providerCapabilities?.size === 0) {
      this.byProvider.delete(capability.providerEngineId);
    }

    return true;
  }

  public has(capabilityId: string): boolean {
    return this.capabilities.has(capabilityId);
  }

  public get(capabilityId: string): Capability | undefined {
    return this.capabilities.get(capabilityId);
  }

  public getAll(): readonly Capability[] {
    return [...this.capabilities.values()];
  }

  public getByProvider(engineId: string): readonly Capability[] {
    return [...(this.byProvider.get(engineId) ?? [])]
      .map((capabilityId) => this.capabilities.get(capabilityId))
      .filter(
        (capability): capability is Capability =>
          capability !== undefined,
      );
  }
}
