declare const brandSymbol: unique symbol;

/** Compile-time nominal typing without runtime wrappers. */
export type Brand<Value, Name extends string> = Value & {
  readonly [brandSymbol]: Name;
};

export function asBrand<Value, Name extends string>(
  value: Value,
): Brand<Value, Name> {
  return value as Brand<Value, Name>;
}
