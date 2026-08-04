declare namespace NodeJS {
  interface ReadableStream {}
}

declare module "node:process" {
  export const stdin:
    NodeJS.ReadableStream;
  export const stdout: {
    write(value: string): void;
  };
}

declare const process: {
  once(
    event: string,
    listener: () => void,
  ): void;
  exit(code?: number): never;
};

declare module "node:readline" {
  export interface Interface {
    on(
      event: "line",
      listener: (line: string) => void,
    ): void;
    close(): void;
  }

  export function createInterface(
    options: {
      readonly input:
        NodeJS.ReadableStream;
      readonly crlfDelay?: number;
    },
  ): Interface;
}
