export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(cause?: unknown): Promise<void>;
}

export async function withinUnitOfWork<TResult>(
  unitOfWork: UnitOfWork,
  operation: () => Promise<TResult>,
): Promise<TResult> {
  await unitOfWork.begin();

  try {
    const result = await operation();
    await unitOfWork.commit();
    return result;
  } catch (error) {
    await unitOfWork.rollback(error);
    throw error;
  }
}
