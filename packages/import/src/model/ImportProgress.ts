export interface ImportProgress {
  readonly total: number;
  readonly completed: number;
  readonly failed: number;
  readonly skipped: number;
}
