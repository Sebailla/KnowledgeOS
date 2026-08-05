declare module "node:crypto" {
  export function randomUUID(): string;
  export function createHash(algorithm: string): { update(value: string): { digest(encoding: "hex"): string } };
}
declare const Buffer: { byteLength(value: string, encoding: "utf8"): number };
