export interface ByteRange {
  readonly start: number;
  readonly endInclusive: number;
}

export class InvalidRangeError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidRangeError";
  }
}

export function parseByteRange(
  header: string | undefined,
  totalLength: number,
): ByteRange | undefined {
  if (!header) return undefined;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) {
    throw new InvalidRangeError("Invalid Range header");
  }

  const startText = match[1] ?? "";
  const endText = match[2] ?? "";

  if (!startText && !endText) {
    throw new InvalidRangeError("Empty Range header");
  }

  if (!startText) {
    const suffixLength = Number(endText);
    if (
      !Number.isInteger(suffixLength) ||
      suffixLength <= 0
    ) {
      throw new InvalidRangeError("Invalid suffix range");
    }
    const start = Math.max(0, totalLength - suffixLength);
    return {
      start,
      endInclusive: totalLength - 1,
    };
  }

  const start = Number(startText);
  const endInclusive = endText
    ? Number(endText)
    : totalLength - 1;

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(endInclusive) ||
    start < 0 ||
    endInclusive < start ||
    start >= totalLength
  ) {
    throw new InvalidRangeError("Unsatisfiable range");
  }

  return {
    start,
    endInclusive: Math.min(
      endInclusive,
      totalLength - 1,
    ),
  };
}
