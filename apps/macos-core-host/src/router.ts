import type { InMemoryCore } from "@knowledgeos/core";
import type { LibraryQuery } from "@knowledgeos/library";
import { libraryCatalog } from "./libraryCatalog.js";
import { documentReaderCatalog } from "./documentReaderCatalog.js";
import { annotationCatalog } from "./annotationCatalog.js";
import { syncCoordinator } from "./syncCoordinator.js";

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
  ) {}

  public async dispatch(
    method: string,
    params: unknown,
  ): Promise<unknown> {
    const record = asRecord(params);

    switch (method) {
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
      case "sync.status": return syncCoordinator.status();
      case "sync.health": return {status:"ok",...syncCoordinator.status()};
      case "sync.start": return syncCoordinator.start();
      case "sync.pause": return syncCoordinator.pause();
      case "sync.resume": return syncCoordinator.resume();
      case "sync.cancel": return syncCoordinator.cancel();
      case "sync.offline": return syncCoordinator.setOffline();
      case "sync.conflicts": return {conflicts:syncCoordinator.conflicts()};
      case "sync.enqueue": { const id=stringParam(record,"id"); await syncCoordinator.enqueue({id,entityType:syncEntityType(record.entityType),entityId:stringParam(record,"entityId"),action:syncAction(record.action),payload:record.payload ?? null,createdAt:new Date().toISOString()}); return syncCoordinator.status(); }
      case "search.query":
        return this.core.search.search(
          stringParam(record, "query"),
        );

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
