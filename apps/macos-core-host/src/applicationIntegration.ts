import { env, platform, arch, version } from "node:process";
import { PROTOCOL_VERSION } from "./protocol.js";
import { syncCoordinator } from "./syncCoordinator.js";
import { localSearchIndex } from "./localSearchIndex.js";
import { localKnowledgeGraph } from "./localKnowledgeGraph.js";
import { importJobManager } from "./importManager.js";
import { exportJobManager } from "./exportManager.js";
import { localAIRuntime } from "./localAIRuntime.js";

const startedAt = new Date().toISOString();

export function applicationStatus() {
  const sync = syncCoordinator.status();
  const search = localSearchIndex.status();
  const graph = localKnowledgeGraph.statistics();
  const ai = localAIRuntime.health();

  return {
    status: "ok",
    phase: "ready",
    protocolVersion: PROTOCOL_VERSION,
    hostVersion: "1.0.0",
    startedAt,
    uptimeMilliseconds:
      Date.now() - Date.parse(startedAt),
    services: [
      {
        id: "library",
        status: "ready",
      },
      {
        id: "document",
        status: "ready",
      },
      {
        id: "search",
        status: search.state,
        detail:
          `${search.documentCount} documents`,
      },
      {
        id: "knowledge-graph",
        status: "ready",
        detail:
          `${graph.nodeCount} nodes`,
      },
      {
        id: "ai",
        status: ai.status,
        detail:
          ai.selectedModelId ?? "no model",
      },
      {
        id: "sync",
        status: sync.phase,
        detail:
          `${sync.pending} pending`,
      },
      {
        id: "import",
        status: "ready",
        detail:
          `${importJobManager.history().length} jobs`,
      },
      {
        id: "export",
        status: "ready",
        detail:
          `${exportJobManager.history().length} jobs`,
      },
    ],
  };
}

export function applicationDiagnostics() {
  return {
    ...applicationStatus(),
    environment: {
      platform: platform,
      architecture: arch,
      nodeVersion: version,
      dataDirectory:
        env.KNOWLEDGEOS_DATA_DIR ??
        "default",
    },
    configuration: validateConfiguration(),
  };
}

export function validateConfiguration() {
  const issues: {
    readonly severity:
      "warning" | "error";
    readonly code: string;
    readonly message: string;
  }[] = [];

  const masterLibraryURL =
    env
      .KNOWLEDGEOS_MASTER_LIBRARY_URL;

  if (!masterLibraryURL) {
    issues.push({
      severity: "warning",
      code:
        "MASTER_LIBRARY_URL_DEFAULTED",
      message:
        "Master Library URL uses the local default.",
    });
  } else {
    try {
      const parsed = masterLibraryURL.match(/^https?:\/\/[^\s]+$/);
      if (!parsed) throw new Error("invalid");
    } catch {
      issues.push({
        severity: "error",
        code:
          "MASTER_LIBRARY_URL_INVALID",
        message:
          "Master Library URL is invalid.",
      });
    }
  }

  return {
    valid:
      !issues.some(
        (issue) =>
          issue.severity === "error",
      ),
    issues,
  };
}
