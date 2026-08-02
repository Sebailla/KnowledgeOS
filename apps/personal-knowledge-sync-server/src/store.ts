import type {
  PersonalKnowledgeSyncEnvelope,
} from "@knowledgeos/personal-knowledge-sync";

export interface PersonalKnowledgeSyncEnvelopeStore {
  push(
    envelope: PersonalKnowledgeSyncEnvelope,
  ): Promise<number>;

  pull(
    ownerId: string,
    excludingDeviceId: string,
  ): Promise<PersonalKnowledgeSyncEnvelope>;
}

export class InMemoryPersonalKnowledgeSyncEnvelopeStore
implements PersonalKnowledgeSyncEnvelopeStore {
  private readonly records =
    new Map<string, Map<string, PersonalKnowledgeSyncEnvelope["records"][number]>>();

  async push(
    envelope: PersonalKnowledgeSyncEnvelope,
  ): Promise<number> {
    const owner =
      this.records.get(envelope.ownerId) ??
      new Map();

    for (const record of envelope.records) {
      owner.set(
        `${record.item.itemId}::${envelope.sourceDeviceId}`,
        record,
      );
    }

    this.records.set(
      envelope.ownerId,
      owner,
    );

    return envelope.records.length;
  }

  async pull(
    ownerId: string,
    excludingDeviceId: string,
  ): Promise<PersonalKnowledgeSyncEnvelope> {
    const owner =
      this.records.get(ownerId) ??
      new Map();

    return {
      ownerId,
      sourceDeviceId:
        "server",
      generatedAt:
        new Date().toISOString(),
      records:
        [...owner.entries()]
          .filter(
            ([key]) =>
              !key.endsWith(
                `::${excludingDeviceId}`,
              ),
          )
          .map(
            ([, record]) =>
              record,
          ),
    };
  }
}
