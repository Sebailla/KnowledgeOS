import { createHash } from "node:crypto";
import type { ContentFingerprint } from "@knowledgeos/domain-types";

export function sha256(
  data: Uint8Array,
): ContentFingerprint {
  const digest = createHash("sha256")
    .update(data)
    .digest("hex");
  return `sha256:${digest}` as ContentFingerprint;
}
