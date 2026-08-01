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

  const dispatch = async (current: number): Promise<TOutput> => {
    if (current <= index) {
      throw new Error("Middleware invoked next() more than once");
    }
    index = current;

    const item = middleware[current];
    if (!item) {
      return terminal();
    }

    return item.invoke(
      input,
      context,
      () => dispatch(current + 1),
    );
  };

  return dispatch(0);
}
