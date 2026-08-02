export interface SearchPerformanceBudget {
  readonly lexicalMilliseconds: number;
  readonly semanticMilliseconds: number;
  readonly graphMilliseconds: number;
  readonly totalMilliseconds: number;
}

export function validateSearchPerformanceBudget(
  budget: SearchPerformanceBudget,
): void {
  for (const [name, value] of Object.entries(budget)) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`${name} must be positive`);
    }
  }

  const stages =
    budget.lexicalMilliseconds +
    budget.semanticMilliseconds +
    budget.graphMilliseconds;

  if (stages > budget.totalMilliseconds) {
    throw new Error(
      "Stage budgets cannot exceed total budget",
    );
  }
}
