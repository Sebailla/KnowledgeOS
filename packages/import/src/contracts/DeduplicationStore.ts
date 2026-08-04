export interface DeduplicationStore {
  has(fingerprint: string): Promise<boolean>;
  add(fingerprint: string): Promise<void>;
}
