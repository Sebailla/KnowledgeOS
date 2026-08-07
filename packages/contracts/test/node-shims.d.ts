declare module "node:assert/strict" {
  const assert: {
    equal(actual: unknown, expected: unknown): void;
  };
  export default assert;
}

declare module "node:test" {
  type TestCallback = () => void | Promise<void>;
  function test(name: string, fn: TestCallback): void;
  export default test;
}
