export type OCRJobState =
  | "queued"
  | "running"
  | "completed"
  | "completed-with-errors"
  | "failed"
  | "cancelled";

export interface OCRJob {
  readonly id: string;
  readonly createdAt: string;
  readonly state: OCRJobState;
  readonly processed: number;
  readonly total: number;
  readonly errors: readonly string[];
}
