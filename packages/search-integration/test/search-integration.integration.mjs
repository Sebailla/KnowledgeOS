import assert from "node:assert/strict";
import {
  DefaultSearchPluginCapability,
  KnowledgeOsSearchMcpHandler,
  knowledgeOsSearchMcpTool,
} from "../dist/index.js";

const execute =
  async (request) => ({
    query:
      request.query,
    mode:
      request.mode,
    results:
      [],
    total:
      0,
    durationMilliseconds:
      1,
  });

const plugin =
  new DefaultSearchPluginCapability(
    execute,
  );

assert.equal(
  plugin.capabilityId,
  "knowledgeos.search",
);
assert.equal(
  plugin.modes.includes(
    "graph",
  ),
  true,
);

const mcp =
  new KnowledgeOsSearchMcpHandler(
    execute,
  );

const response =
  await mcp.invoke({
    query:
      "heart attack",
    mode:
      "semantic",
    limit:
      5,
  });

assert.equal(
  response.mode,
  "semantic",
);
assert.equal(
  knowledgeOsSearchMcpTool.name,
  "knowledgeos_search",
);

console.log(JSON.stringify({
  flow:
    "search-plugin-capability-mcp-tool",
  status:
    "passed",
}));
