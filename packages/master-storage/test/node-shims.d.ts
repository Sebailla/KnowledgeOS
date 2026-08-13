declare module "node:assert/strict" {
  interface Assert {
    equal(actual: unknown, expected: unknown): void;
    deepEqual(actual: unknown, expected: unknown): void;
    rejects(block: () => Promise<unknown>, error?: RegExp): Promise<void>;
  }
  const assert: Assert;
  export default assert;
}

declare module "node:test" {
  type TestFunction = (name: string, fn: () => void | Promise<void>) => void;
  const test: TestFunction;
  export default test;
}
