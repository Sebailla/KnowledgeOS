export interface StorageRecord<TValue> {
  readonly key: string;
  readonly value: TValue;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}
