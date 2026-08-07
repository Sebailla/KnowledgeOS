declare module "node:test" {
  type TestFunction = (name: string, fn: () => void | Promise<void>) => void;

  const test: TestFunction;
  export default test;
}

declare module "node:assert/strict" {
  interface Assert {
    doesNotThrow(block: () => unknown): void;
    equal(actual: unknown, expected: unknown): void;
    throws(block: () => unknown): void;
  }

  const assert: Assert;
  export default assert;
}
