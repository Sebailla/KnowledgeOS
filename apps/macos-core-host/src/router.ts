import type { InMemoryCore } from "@knowledgeos/core";
import { PROTOCOL_VERSION } from "./protocol.js";
import type { LibraryQuery } from "@knowledgeos/library";
import { libraryCatalog } from "./libraryCatalog.js";
import { documentReaderCatalog } from "./documentReaderCatalog.js";
import { annotationCatalog } from "./annotationCatalog.js";
import { syncCoordinator } from "./syncCoordinator.js";
import { masterLibraryTransport, saveTransportConfiguration, transportConfiguration } from "./masterLibraryTransport.js";
import { conflictEngine, operationFrom, resolution } from "./conflictCatalog.js";
import { localSearchIndex } from "./localSearchIndex.js";
import { localKnowledgeGraph } from "./localKnowledgeGraph.js";
import { localAIRuntime, buildAIContext } from "./localAIRuntime.js";
import { importJobManager } from "./importManager.js";
import { exportJobManager } from "./exportManager.js";
import { applicationDiagnostics, applicationStatus, validateConfiguration } from "./applicationIntegration.js";
import { StagedSourceResolver } from "./stagedSourceResolver.js";
import type { StagedImportRequestV2 } from "@knowledgeos/contracts";

export class HostError extends Error {
  public constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export class CoreRouter {
  public constructor(
    private readonly core: InMemoryCore,
    private readonly stagedSources = new StagedSourceResolver(process.env.KNOWLEDGEOS_IMPORT_DIR ?? ".knowledgeos-import/Staging"),
  ) {}

  public async dispatch(
    method: string,
    params: unknown,
  ): Promise<unknown> {
    const record = asRecord(params);

    switch (method) {

      case "application.status":
        return applicationStatus();

      case "application.diagnostics":
        return applicationDiagnostics();

      case "application.configuration.validate":
        return validateConfiguration();

      case "application.about":
        return {
          name: "KnowledgeOS",
          applicationVersion: "0.31.0",
          hostVersion: "1.0.0",
          protocolVersion: PROTOCOL_VERSION,
          copyright:
            "KnowledgeOS Team",
        };

      case "core.health":
        return {
          status: "ok",
          runtimeState:
            this.core.runtime.currentState,
          persistence: { reading: documentReaderCatalog.health(), annotations: annotationCatalog.health() },
          engines:
            this.core.runtime.listEngines()
              .map((engine) => ({
                id: engine.id,
                name: engine.name,
                version: engine.version,
              })),
        };

      case "library.list":
      case "library.search":
        return libraryCatalog.list(
          toLibraryQuery(record),
        );

      case "library.get": {
        const item = await libraryCatalog.get(
          stringParam(record, "id"),
        );

        if (!item) {
          throw new HostError(
            "LIBRARY_ITEM_NOT_FOUND",
            "Library item was not found.",
          );
        }

        return item;
      }

      case "library.recent":
        return {
          items: await libraryCatalog.recent(
            numberParam(record, "limit", 12),
          ),
        };

      case "library.favorites":
        return {
          items: await libraryCatalog.favorites(
            numberParam(record, "limit", 100),
          ),
        };

      case "document.open": { const id=stringParam(record,"id"); const d=await documentReaderCatalog.open(id); if(!d) throw new HostError("DOCUMENT_NOT_FOUND","Document was not found."); return d; }
      case "document.page": { const id=stringParam(record,"id"); const pageNumber=numberParam(record,"pageNumber",1); const page=await documentReaderCatalog.page(id,pageNumber); if(!page) throw new HostError("DOCUMENT_PAGE_NOT_FOUND","Document page was not found."); return page; }
      case "document.sections": return {sections:await documentReaderCatalog.sections(stringParam(record,"id"))};
      case "document.location.get": return {location:(await documentReaderCatalog.getLocation(stringParam(record,"id"))) ?? null};
      case "document.location.save": { const id=stringParam(record,"id"); const pageNumber=numberParam(record,"pageNumber",1); const progress=Math.min(1,Math.max(0,numberParam(record,"progress",0))); const location={documentId:id,pageNumber,progress,updatedAt:new Date().toISOString()}; await documentReaderCatalog.saveLocation(location); return location; }
      case "annotation.list": return {annotations:await annotationCatalog.list(stringParam(record,"documentId"))};
      case "annotation.get": { const item=await annotationCatalog.get(stringParam(record,"id")); if(!item) throw new HostError("ANNOTATION_NOT_FOUND","Annotation was not found."); return item; }
      case "annotation.create": return annotationCatalog.create({id:stringParam(record,"id"),kind:annotationKind(record.kind),anchor:{documentId:stringParam(record,"documentId"),pageNumber:numberParam(record,"pageNumber",1),...(typeof record.startOffset==="number"?{startOffset:record.startOffset}:{}),...(typeof record.endOffset==="number"?{endOffset:record.endOffset}:{}),...(typeof record.selectedText==="string"?{selectedText:record.selectedText}:{})},...(typeof record.color==="string"?{color:record.color as any}:{}),...(typeof record.body==="string"?{body:record.body}:{})});
      case "annotation.update": { const item=await annotationCatalog.update(stringParam(record,"id"),{...(typeof record.color==="string"?{color:record.color as any}:{}),...(typeof record.body==="string"?{body:record.body}:{})}); if(!item) throw new HostError("ANNOTATION_NOT_FOUND","Annotation was not found."); return item; }
      case "annotation.delete": return {deleted:await annotationCatalog.delete(stringParam(record,"id"))};
      case "bookmark.create": return annotationCatalog.create({id:stringParam(record,"id"),kind:"bookmark",anchor:{documentId:stringParam(record,"documentId"),pageNumber:numberParam(record,"pageNumber",1)}});
      case "bookmark.delete": return {deleted:await annotationCatalog.delete(stringParam(record,"id"))};
      case "persistence.health": return { reading: documentReaderCatalog.health(), annotations: annotationCatalog.health() };
      case "persistence.backup": { const directory=stringParam(record,"directory"); return { reading:await documentReaderCatalog.backup(`${directory}/reading.json`), annotations:await annotationCatalog.backup(`${directory}/annotations.json`) }; }
      case "persistence.restore": { const directory=stringParam(record,"directory"); await documentReaderCatalog.restore(`${directory}/reading.json`); await annotationCatalog.restore(`${directory}/annotations.json`); return {restored:true}; }
      case "transport.configuration.get":
        return transportConfiguration();

      case "transport.configuration.save":
        return saveTransportConfiguration({
          baseURL:
            stringParam(record, "baseURL"),
          ...(typeof record.token === "string" &&
          record.token.length > 0
            ? { token: record.token }
            : {}),
          timeoutMilliseconds:
            numberParam(
              record,
              "timeoutMilliseconds",
              10_000,
            ),
          maxAttempts:
            numberParam(
              record,
              "maxAttempts",
              3,
            ),
        });

      case "transport.health":
      case "transport.test":
        return masterLibraryTransport()
          .health();

      case "conflict.detect": { const conflict=await conflictEngine.detect(operationFrom(record,"local"),operationFrom(record,"remote")); return { conflict: conflict ?? null }; }
      case "conflict.list": return { conflicts: await conflictEngine.list(typeof record.status === "string" ? record.status as any : undefined) };
      case "conflict.get": { const conflict=await conflictEngine.get(stringParam(record,"id")); if(!conflict) throw new HostError("CONFLICT_NOT_FOUND","Conflict was not found."); return conflict; }
      case "conflict.preview": return conflictEngine.preview(stringParam(record,"id"));
      case "conflict.resolve": return conflictEngine.resolve(stringParam(record,"id"), resolution(record.strategy));
      case "conflict.ignore": return conflictEngine.ignore(stringParam(record,"id"));
      case "conflict.statistics": { const conflicts=await conflictEngine.list(); return { total:conflicts.length, pending:conflicts.filter(c=>c.status==="pending").length, resolved:conflicts.filter(c=>c.status!=="pending").length }; }
      case "sync.status": return syncCoordinator.status();
      case "sync.health": return {status:"ok",...syncCoordinator.status()};
      case "sync.start": return syncCoordinator.start();
      case "sync.pause": return syncCoordinator.pause();
      case "sync.resume": return syncCoordinator.resume();
      case "sync.cancel": return syncCoordinator.cancel();
      case "sync.offline": return syncCoordinator.setOffline();
      case "sync.conflicts": return {conflicts:syncCoordinator.conflicts()};
      case "sync.enqueue": { const id=stringParam(record,"id"); await syncCoordinator.enqueue({id,entityType:syncEntityType(record.entityType),entityId:stringParam(record,"entityId"),action:syncAction(record.action),payload:record.payload ?? null,createdAt:new Date().toISOString()}); return syncCoordinator.status(); }
      case "search.index.status":
        return localSearchIndex.status();

      case "search.index.rebuild":
        return localSearchIndex.status();

      case "search.index.clear":
        localSearchIndex.clear();
        return localSearchIndex.status();

      case "search.index.enqueue":
        localSearchIndex.upsert({
          id: stringParam(record, "id"),
          title: stringParam(record, "title"),
          body:
            typeof record.body === "string"
              ? record.body
              : "",
          kind:
            searchKind(record.kind),
          authors:
            stringArray(record.authors),
          tags:
            stringArray(record.tags),
          ...(typeof record.availability ===
            "string"
            ? {
                availability:
                  record.availability,
              }
            : {}),
          updatedAt:
            typeof record.updatedAt === "string"
              ? record.updatedAt
              : new Date().toISOString(),
          metadata:
            typeof record.metadata === "object" &&
            record.metadata !== null &&
            !Array.isArray(record.metadata)
              ? record.metadata as
                  Record<string, unknown>
              : {},
        });
        return localSearchIndex.status();

      case "search.query":
        return localSearchIndex.search({
          text:
            stringParam(record, "query"),
          page:
            numberParam(record, "page", 1),
          pageSize:
            numberParam(record, "pageSize", 20),
          ...(Array.isArray(record.kinds)
            ? {
                kinds:
                  record.kinds.map(
                    searchKind,
                  ),
              }
            : {}),
          ...(Array.isArray(record.authors)
            ? {
                authors:
                  stringArray(record.authors),
              }
            : {}),
          ...(Array.isArray(record.tags)
            ? {
                tags:
                  stringArray(record.tags),
              }
            : {}),
          ...(Array.isArray(
            record.availability,
          )
            ? {
                availability:
                  stringArray(
                    record.availability,
                  ),
              }
            : {}),
        });

      case "search.suggest":
        return {
          suggestions:
            localSearchIndex.suggest(
              stringParam(record, "query"),
              numberParam(record, "limit", 8),
            ),
        };

      case "graph.node.get": { const node=localKnowledgeGraph.getNode(stringParam(record,"id")); if(!node) throw new HostError("GRAPH_NODE_NOT_FOUND","Graph node was not found."); return node; }
      case "graph.node.upsert": return localKnowledgeGraph.upsertNode({id:stringParam(record,"id"),type:stringParam(record,"type"),label:stringParam(record,"label"),properties:objectParam(record.properties)});
      case "graph.node.delete": return {deleted:localKnowledgeGraph.deleteNode(stringParam(record,"id"))};
      case "graph.edge.upsert": return localKnowledgeGraph.upsertEdge({id:stringParam(record,"id"),type:stringParam(record,"type"),sourceId:stringParam(record,"sourceId"),targetId:stringParam(record,"targetId"),directed:typeof record.directed==="boolean"?record.directed:true,properties:objectParam(record.properties)});
      case "graph.edge.delete": return {deleted:localKnowledgeGraph.deleteEdge(stringParam(record,"id"))};
      case "graph.neighbors": return localKnowledgeGraph.neighbors(stringParam(record,"nodeId"),graphDirection(record.direction));
      case "graph.expand": return localKnowledgeGraph.expand(stringParam(record,"nodeId"),numberParam(record,"depth",1));
      case "graph.path": return {path:localKnowledgeGraph.shortestPath(stringParam(record,"sourceId"),stringParam(record,"targetId")) ?? null};
      case "graph.search": return {nodes:localKnowledgeGraph.search(typeof record.query==="string"?record.query:"",stringArray(record.types))};
      case "graph.statistics": return localKnowledgeGraph.statistics();
      case "graph.rebuild": return localKnowledgeGraph.statistics();



      case "export.formats": return { formats: exportJobManager.formats() };
      case "export.preview": return exportJobManager.preview(exportFormat(record.format), exportSources(record.sources), exportOptions(record));
      case "export.start": return exportJobManager.start(exportFormat(record.format), exportSources(record.sources), exportOptions(record));
      case "export.history": return { jobs: exportJobManager.history() };
      case "export.status": { const job=exportJobManager.status(stringParam(record,"id")); if(!job) throw new HostError("EXPORT_JOB_NOT_FOUND","Export job was not found."); return job; }
      case "export.result": { const result=exportJobManager.result(stringParam(record,"id")); if(!result) throw new HostError("EXPORT_RESULT_NOT_FOUND","Export result was not found."); return result; }
      case "export.cancel": { const job=exportJobManager.cancel(stringParam(record,"id")); if(!job) throw new HostError("EXPORT_JOB_NOT_FOUND","Export job was not found."); return job; }
      case "export.retry": { const job=exportJobManager.retry(stringParam(record,"id")); if(!job) throw new HostError("EXPORT_JOB_NOT_FOUND","Export job was not found."); return job; }

      case "import.detect":
      case "import.preview":
      case "import.start": {
        const request = stagedImportRequest(record);
        const lease = await this.stagedSources.accept(request);
        return importJobManager.queueStaged(request.operationId, lease);
      }

      case "import.release":
        await this.stagedSources.release(stringParam(record, "leaseId"));
        return { released: true };

      case "import.status": {
        const job =
          importJobManager.status(
            stringParam(record, "id"),
          );

        if (!job) {
          throw new HostError(
            "IMPORT_JOB_NOT_FOUND",
            "Import job was not found.",
          );
        }

        return job;
      }

      case "import.cancel": {
        const job =
          importJobManager.cancel(
            stringParam(record, "id"),
          );

        if (!job) {
          throw new HostError(
            "IMPORT_JOB_NOT_FOUND",
            "Import job was not found.",
          );
        }

        return job;
      }

      case "import.retry": {
        const job =
          importJobManager.retry(
            stringParam(record, "id"),
          );

        if (!job) {
          throw new HostError(
            "IMPORT_JOB_NOT_FOUND",
            "Import job was not found.",
          );
        }

        return job;
      }

      case "import.history":
        return {
          jobs:
            importJobManager.history(),
        };

      case "ai.models.list": return { models: localAIRuntime.listModels() };
      case "ai.model.select": return localAIRuntime.selectModel(stringParam(record,"modelId"));
      case "ai.health": return localAIRuntime.health();
      case "ai.context.build": return { sources: buildAIContext(stringParam(record,"query")) };
      case "ai.chat": return localAIRuntime.chat({ message:stringParam(record,"message"), ...(typeof record.conversationId==="string"?{conversationId:record.conversationId}:{}), ...(typeof record.modelId==="string"?{modelId:record.modelId}:{}), context:buildAIContext(typeof record.contextQuery==="string"?record.contextQuery:stringParam(record,"message")) });
      case "ai.conversation.list": return { conversations: localAIRuntime.listConversations() };
      case "ai.conversation.get": { const conversation=localAIRuntime.getConversation(stringParam(record,"id")); if(!conversation) throw new HostError("AI_CONVERSATION_NOT_FOUND","Conversation was not found."); return conversation; }
      case "ai.conversation.delete": return { deleted: localAIRuntime.deleteConversation(stringParam(record,"id")) };
      case "ai.generate": return this.core.ai.generate({messages:[{role:"user",content:stringParam(record,"prompt")}]});

      case "workspace.list":
        return {
          workspaces:
            await this.core.workspace.manager.list(),
        };

      case "ai.generate":
        return this.core.ai.generate({
          messages: [{
            role: "user",
            content:
              stringParam(record, "prompt"),
          }],
        });

      default:
        throw new HostError(
          "METHOD_NOT_FOUND",
          `Unknown method '${method}'.`,
        );
    }
  }
}

function asRecord(
  value: unknown,
): Record<string, unknown> {
  if (value == null) return {};

  if (
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new HostError(
      "INVALID_PARAMS",
      "Params must be an object.",
    );
  }

  return value as Record<string, unknown>;
}

function stringParam(
  record: Record<string, unknown>,
  key: string,
): string {
  const value = record[key];

  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    throw new HostError(
      "INVALID_PARAMS",
      `'${key}' must be a string.`,
    );
  }

  return value;
}

function numberParam(
  record: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const value = record[key];

  if (value === undefined) {
    return fallback;
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    throw new HostError(
      "INVALID_PARAMS",
      `'${key}' must be a number.`,
    );
  }

  return value;
}

function toLibraryQuery(
  record: Record<string, unknown>,
): LibraryQuery {
  return {
    ...(typeof record.text === "string"
      ? { text: record.text }
      : {}),
    ...(typeof record.page === "number"
      ? { page: record.page }
      : {}),
    ...(typeof record.pageSize === "number"
      ? { pageSize: record.pageSize }
      : {}),
    ...(typeof record.sort === "string"
      ? {
          sort:
            record.sort as
              NonNullable<LibraryQuery["sort"]>,
        }
      : {}),
    ...(typeof record.favoritesOnly ===
      "boolean"
      ? {
          favoritesOnly:
            record.favoritesOnly,
        }
      : {}),
    ...(Array.isArray(record.kinds)
      ? {
          kinds:
            record.kinds.filter(
              (value): value is
                NonNullable<
                  LibraryQuery["kinds"]
                >[number] =>
                  typeof value === "string",
            ),
        }
      : {}),
    ...(Array.isArray(record.availability)
      ? {
          availability:
            record.availability.filter(
              (value): value is
                NonNullable<
                  LibraryQuery[
                    "availability"
                  ]
                >[number] =>
                  typeof value === "string",
            ),
        }
      : {}),
  };
}

function annotationKind(value:unknown): "highlight"|"note"|"bookmark" { if(value==="highlight"||value==="note"||value==="bookmark") return value; throw new HostError("INVALID_PARAMS","Invalid annotation kind."); }

function syncEntityType(value:unknown): "reading-location"|"annotation"|"bookmark"|"workspace" { if(value==="reading-location"||value==="annotation"||value==="bookmark"||value==="workspace") return value; throw new HostError("INVALID_PARAMS","Invalid sync entity type."); }
function syncAction(value:unknown): "upsert"|"delete" { if(value==="upsert"||value==="delete") return value; throw new HostError("INVALID_PARAMS","Invalid sync action."); }

function stringArray(
  value: unknown,
): readonly string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string",
      )
    : [];
}

function searchKind(
  value: unknown,
):
  | "document"
  | "book"
  | "paper"
  | "note"
  | "annotation"
  | "bookmark"
  | "workspace" {
  switch (value) {
    case "book":
    case "paper":
    case "note":
    case "annotation":
    case "bookmark":
    case "workspace":
      return value;
    default:
      return "document";
  }
}

function objectParam(value: unknown): Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function graphDirection(value: unknown): "in" | "out" | "both" { return value === "in" || value === "out" ? value : "both"; }

function stagedImportRequest(record: Record<string, unknown>): StagedImportRequestV2 {
  if (record.contractVersion !== 2) throw new HostError("IMPORT_CONTRACT_VERSION_UNSUPPORTED", "Only import contract version 2 is supported.");
  if ("content" in record || "bytes" in record || "path" in record) throw new HostError("INVALID_IMPORT_REQUEST", "Import payload must not include bytes or paths.");
  const source = objectParam(record.source);
  if (source.kind !== "staged-file" || typeof source.capability !== "string" || typeof record.operationId !== "string" || typeof record.idempotencyKey !== "string" || typeof record.name !== "string" || typeof record.byteLength !== "number" || !Number.isSafeInteger(record.byteLength) || record.byteLength < 0 || typeof record.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(record.sha256)) throw new HostError("INVALID_IMPORT_REQUEST", "Invalid staged import request.");
  return { contractVersion: 2, operationId: record.operationId, idempotencyKey: record.idempotencyKey, source: { kind: "staged-file", capability: source.capability }, name: record.name, byteLength: record.byteLength, sha256: record.sha256, ...(typeof record.mediaType === "string" ? { mediaType: record.mediaType } : {}), ...(typeof record.extension === "string" ? { extension: record.extension } : {}), ...(typeof record.runOCR === "boolean" ? { runOCR: record.runOCR } : {}) };
}

function exportFormat(value: unknown): "markdown"|"html"|"pdf"|"epub"|"text"|"knowledge-package" {
  switch(value){ case "markdown":case "html":case "pdf":case "epub":case "text":case "knowledge-package":return value; default:throw new HostError("INVALID_EXPORT_FORMAT","Unsupported export format."); }
}
function exportSources(value: unknown) {
  if(!Array.isArray(value)) throw new HostError("INVALID_PARAMS","sources must be an array.");
  return value.map((item)=>{ const record=asRecord(item); return { id:stringParam(record,"id"), title:stringParam(record,"title"), body:typeof record.body==="string"?record.body:"", metadata:objectParam(record.metadata), annotations:stringArray(record.annotations), bookmarks:stringArray(record.bookmarks), assets:stringArray(record.assets), graphRelations:stringArray(record.graphRelations), provenance:stringArray(record.provenance) }; });
}
function exportOptions(record: Record<string, unknown>) { return { includeMetadata:record.includeMetadata===true, includeAnnotations:record.includeAnnotations===true, includeBookmarks:record.includeBookmarks===true, includeAssets:record.includeAssets===true, includeGraph:record.includeGraph===true, includeProvenance:record.includeProvenance===true }; }
