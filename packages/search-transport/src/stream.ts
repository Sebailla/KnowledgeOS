import type { ProgressiveSearchBatch } from "@knowledgeos/search-execution-runtime";
export function encodeSearchBatchNdjson(batch:ProgressiveSearchBatch):string { return `${JSON.stringify(batch)}\n`; }
export async function* decodeSearchBatchNdjson(chunks:AsyncIterable<string>):AsyncGenerator<ProgressiveSearchBatch>{ let buffer=""; for await(const chunk of chunks){buffer+=chunk; while(true){const i=buffer.indexOf("\n");if(i<0)break;const line=buffer.slice(0,i);buffer=buffer.slice(i+1);if(line.trim())yield JSON.parse(line);}} if(buffer.trim())yield JSON.parse(buffer); }
