declare const process: {
  readonly env: Readonly<Record<string, string | undefined>>;
  exitCode?: number;
  on(event: "SIGINT" | "SIGTERM", listener: () => void): void;
};

declare const console: {
  log(...values: readonly unknown[]): void;
  error(...values: readonly unknown[]): void;
};
