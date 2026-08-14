declare module "node:crypto" {
  export function createHash(name: string): { update(data: string): { digest(encoding: "hex"): string } };
  export function createHmac(name: string, key: string): { update(data: string): { digest(encoding: "base64url"): string } };
  export function randomUUID(): string;
  export function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean;
}
declare const Buffer: { from(value: string): Uint8Array; };
