export interface OcrPageRequest {
  readonly documentId: string;
  readonly page: number;
  readonly imageBytes: Uint8Array;
  readonly languageHints: readonly string[];
}

export interface OcrPageResult {
  readonly documentId: string;
  readonly page: number;
  readonly text: string;
  readonly confidence: number;
  readonly engineId: string;
}

export interface OcrEngine {
  readonly engineId: string;
  recognize(
    request: OcrPageRequest,
  ): Promise<OcrPageResult>;
}

export class DeterministicOcrEngine
implements OcrEngine {
  readonly engineId = "deterministic-ocr";

  async recognize(
    request: OcrPageRequest,
  ): Promise<OcrPageResult> {
    return {
      documentId: request.documentId,
      page: request.page,
      text: decodeUtf8(request.imageBytes),
      confidence: 1,
      engineId: this.engineId,
    };
  }
}

function decodeUtf8(bytes: Uint8Array): string {
  let output = "";
  for (let index = 0; index < bytes.length; index += 1) {
    const first = bytes[index] ?? 0;
    if (first < 0x80) {
      output += String.fromCodePoint(first);
      continue;
    }
    if ((first & 0xe0) === 0xc0) {
      const second = bytes[++index] ?? 0;
      output += String.fromCodePoint(((first & 0x1f) << 6) | (second & 0x3f));
      continue;
    }
    if ((first & 0xf0) === 0xe0) {
      const second = bytes[++index] ?? 0;
      const third = bytes[++index] ?? 0;
      output += String.fromCodePoint(((first & 0x0f) << 12) | ((second & 0x3f) << 6) | (third & 0x3f));
      continue;
    }
    const second = bytes[++index] ?? 0;
    const third = bytes[++index] ?? 0;
    const fourth = bytes[++index] ?? 0;
    output += String.fromCodePoint(((first & 0x07) << 18) | ((second & 0x3f) << 12) | ((third & 0x3f) << 6) | (fourth & 0x3f));
  }
  return output;
}
