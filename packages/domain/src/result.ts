export type DomainResult<TValue, TError extends Error = Error> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: TError };

export function success<TValue>(
  value: TValue,
): DomainResult<TValue, never> {
  return { ok: true, value };
}

export function failure<TError extends Error>(
  error: TError,
): DomainResult<never, TError> {
  return { ok: false, error };
}

export function unwrap<TValue, TError extends Error>(
  result: DomainResult<TValue, TError>,
): TValue {
  if (result.ok) {
    return result.value;
  }

  throw result.error;
}
