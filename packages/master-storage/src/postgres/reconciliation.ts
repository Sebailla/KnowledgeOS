import type { JournalOperation } from "./operations.js";
export interface AuthorityPresence { readonly staged: boolean; readonly published: boolean; readonly catalog: boolean; readonly fingerprint?: string; }
export type ReconciliationDecision = "promote-catalog" | "report-orphan" | "report-mismatch" | "retain-staged" | "consistent";
export function reconcileOperation(operation: JournalOperation, presence: AuthorityPresence): ReconciliationDecision { if (presence.catalog && presence.published && presence.fingerprint && presence.fingerprint !== operation.fingerprint) return "report-mismatch"; if (presence.catalog && !presence.published) return "report-orphan"; if (!presence.catalog && presence.published) return "promote-catalog"; if (presence.staged) return "retain-staged"; return "consistent"; }

export interface AuthorityInspector { inspect(operation: JournalOperation): Promise<AuthorityPresence>; }
export interface RecoverableOperationJournal { record(operation: JournalOperation): Promise<void>; }

export class AuthorityReconciler {
  public constructor(private readonly inspector: AuthorityInspector, private readonly journal: RecoverableOperationJournal) {}
  public async recover(operation: JournalOperation): Promise<ReconciliationDecision> {
    const decision = reconcileOperation(operation, await this.inspector.inspect(operation));
    if (decision === "report-orphan" || decision === "report-mismatch") {
      await this.journal.record({ ...operation, state: "reconciliation-required" });
    }
    return decision;
  }
}
