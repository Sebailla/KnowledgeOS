declare module "node:fs/promises" {
  export function mkdir(
    path: string,
    options?: { recursive?: boolean },
  ): Promise<void>;
}

declare module "node:path" {
  export function join(...parts: readonly string[]): string;
}
