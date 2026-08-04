import { AIEngine } from "@knowledgeos/ai";
import { DocumentEngine,InMemoryDocumentLockManager,InMemoryDocumentRepository } from "@knowledgeos/document";
import { ExportEngine,InMemoryExportProvider } from "@knowledgeos/export";
import { DefaultFormatDetector,ImportEngine,ImportPipeline,InMemoryDeduplicationStore,InMemoryImportProvider,InMemoryImportSink,JsonTransformer,MarkdownTransformer,TextTransformer } from "@knowledgeos/import";
import { InMemoryGraphProvider,KnowledgeGraphEngine } from "@knowledgeos/knowledge-graph";
import { InMemoryOCRProvider,OCREngine } from "@knowledgeos/ocr";
import { InMemoryPluginProvider,PluginEngine } from "@knowledgeos/plugin";
import { InMemorySearchProvider,SearchEngine } from "@knowledgeos/search";
import { InMemoryStorageProvider,StorageEngine } from "@knowledgeos/storage";
import { InMemorySyncProvider,SyncEngine } from "@knowledgeos/sync";
import { InMemoryWorkspacePersistence,WorkspaceEngine } from "@knowledgeos/workspace";
import type { Engine,EngineContext } from "@knowledgeos/kernel";
import { CoreRuntime } from "./CoreRuntime.js";
class LibraryRuntimeEngine implements Engine{public readonly id="library";public readonly name="Library Runtime";public readonly version="1.0.0";public readonly dependencies=[] as const;public async initialize(c:EngineContext){c.cancellation.throwIfCancellationRequested();}public async start(c:EngineContext){c.cancellation.throwIfCancellationRequested();}public async stop(_c:EngineContext){}public async dispose(_c:EngineContext){}}
export interface InMemoryCore {readonly runtime:CoreRuntime;readonly storage:StorageEngine;readonly search:SearchEngine;readonly graph:KnowledgeGraphEngine;readonly sync:SyncEngine;readonly importer:ImportEngine;readonly exporter:ExportEngine;readonly ocr:OCREngine;readonly ai:AIEngine;readonly workspace:WorkspaceEngine;readonly plugin:PluginEngine;readonly document:DocumentEngine;}
export function createInMemoryCore():InMemoryCore{
 const storage=new StorageEngine(new InMemoryStorageProvider());
 const search=new SearchEngine(new InMemorySearchProvider());
 const graph=new KnowledgeGraphEngine(new InMemoryGraphProvider());
 const sync=new SyncEngine(new InMemorySyncProvider());
 const importer=new ImportEngine(new ImportPipeline(new InMemoryImportProvider(),new DefaultFormatDetector(),new InMemoryDeduplicationStore(),new InMemoryImportSink(),undefined,[new TextTransformer(),new MarkdownTransformer(),new JsonTransformer()]));
 const exporter=new ExportEngine(new InMemoryExportProvider());
 const ocr=new OCREngine(new InMemoryOCRProvider());
 const ai=new AIEngine();
 const workspace=new WorkspaceEngine(new InMemoryWorkspacePersistence());
 const plugin=new PluginEngine(new InMemoryPluginProvider());
 const document=new DocumentEngine(new InMemoryDocumentRepository(),new InMemoryDocumentLockManager());
 const libraryRuntime=new LibraryRuntimeEngine();
 const runtime=new CoreRuntime([libraryRuntime,storage,search,graph,sync,importer,exporter,ocr,ai,workspace,plugin,document]);
 return {runtime,storage,search,graph,sync,importer,exporter,ocr,ai,workspace,plugin,document};
}
