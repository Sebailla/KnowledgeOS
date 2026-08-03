import { createPostgresRuntime, PostgresMigrationRunner } from "@knowledgeos/infrastructure-postgres-node";
import { MonotonicIdGenerator, SystemClock } from "@knowledgeos/kernel";
import { RegisterMasterPublicationService } from "@knowledgeos/master-library";
import { PostgresMasterPublicationRepository, PostgresMasterPublicationVersionRepository } from "@knowledgeos/master-library-postgres";
import { MasterPublicationStorage } from "@knowledgeos/master-storage";
import { MasterRegistrationWorkflow, PostgresMasterRegistrationEventSink, PostgresMasterStorageCatalog } from "@knowledgeos/master-registration-workflow";
import { ResumableUploadService } from "@knowledgeos/master-resumable-upload";
import { DistributedUploadCompletionService, PostgresUploadCompletionLeaseRepository, PostgresUploadCompletionRepository, PostgresUploadSessionStore } from "@knowledgeos/master-resumable-upload-postgres";
import { FilesystemChunkBlobStore } from "@knowledgeos/master-upload-chunk-store";

export interface ProductionConfig { readonly databaseUrl:string; readonly masterStorageRoot:string; readonly uploadChunkRoot:string; readonly instanceId:string; readonly leaseMilliseconds:number; }
export const productionMigration = { id:"0005_master_runtime", checksum:"sha256:master-runtime-0005", sql:`create table if not exists master_runtime_health(instance_id text primary key, started_at timestamptz not null default now())` } as const;

export async function createProductionRuntime(config: ProductionConfig) {
  const postgres = await createPostgresRuntime({ connectionString: config.databaseUrl, application_name:"knowledgeos-master-library" });
  await new PostgresMigrationRunner(postgres.database).migrate([productionMigration]);
  const publications = new PostgresMasterPublicationRepository(postgres.database);
  const versions = new PostgresMasterPublicationVersionRepository(postgres.database);
  const storage = new MasterPublicationStorage(config.masterStorageRoot, new PostgresMasterStorageCatalog(postgres.database));
  const clock = new SystemClock(); const ids = new MonotonicIdGenerator(clock,"master-production");
  const workflow = new MasterRegistrationWorkflow(storage, new RegisterMasterPublicationService(publications,versions,versions), postgres.database, new PostgresMasterRegistrationEventSink(postgres.database,clock,ids));
  const uploads = new ResumableUploadService(new PostgresUploadSessionStore(postgres.database,new FilesystemChunkBlobStore(config.uploadChunkRoot)),workflow);
  const completion = new DistributedUploadCompletionService(uploads,new PostgresUploadCompletionLeaseRepository(postgres.database),new PostgresUploadCompletionRepository(postgres.database),{nowMilliseconds:()=>Date.now(),nowIso:()=>clock.nowIso()},{ownerId:config.instanceId,leaseMilliseconds:config.leaseMilliseconds});
  return { uploads, completion, close:()=>postgres.close() };
}
