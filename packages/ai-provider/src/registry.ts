import type {
  AiProvider,
  AiProviderHealth,
} from "@knowledgeos/ai-contracts";

export class AiProviderRegistry {
  private readonly providers =
    new Map<string, AiProvider>();

  register(provider: AiProvider): void {
    if (
      this.providers.has(
        provider.providerId,
      )
    ) {
      throw new Error(
        `AI provider already registered: ${provider.providerId}`,
      );
    }

    this.providers.set(
      provider.providerId,
      provider,
    );
  }

  get(providerId: string): AiProvider {
    const provider =
      this.providers.get(providerId);

    if (!provider) {
      throw new Error(
        `AI provider not found: ${providerId}`,
      );
    }

    return provider;
  }

  async health(): Promise<
    readonly AiProviderHealth[]
  > {
    const values =
      await Promise.all(
        [...this.providers.values()]
          .sort(
            (a, b) =>
              a.providerId.localeCompare(
                b.providerId,
              ),
          )
          .map(
            (provider) =>
              provider.health(),
          ),
      );

    return values;
  }
}
