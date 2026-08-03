import type { ExecutionContext } from "./execution-context.js";

export type Next<TOutput> = () => Promise<TOutput>;

export interface Middleware<TInput, TOutput> {
  invoke(
    input: TInput,
    context: ExecutionContext,
    next: Next<TOutput>,
  ): Promise<TOutput>;
}

export async function composeMiddleware<TInput, TOutput>(
  middleware: readonly Middleware<TInput, TOutput>[],
  input: TInput,
  context: ExecutionContext,
  terminal: Next<TOutput>,
): Promise<TOutput> {
  let index = -1;

  const dispatch = async (position: number): Promise<TOutput> => {
    if (position <= index) {
      throw new Error("Middleware called next() more than once.");
    }

    index = position;
    const current = middleware[position];

    if (!current) {
      return terminal();
    }

    return current.invoke(
      input,
      context,
      () => dispatch(position + 1),
    );
  };

  return dispatch(0);
}
