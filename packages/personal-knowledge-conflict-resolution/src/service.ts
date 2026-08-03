import type {
  PersonalKnowledgeItem,
} from "@knowledgeos/personal-knowledge";
import type {
  ConflictResolutionClock,
  ConflictResolutionItemRepository,
  ConflictResolutionRepository,
  ConflictResolutionUnitOfWork,
} from "./contracts.js";
import type {
  ResolveConflictCommand,
  ResolvedConflict,
} from "./model.js";

export class PersonalKnowledgeConflictResolutionService {
  public constructor(
    private readonly conflicts:
      ConflictResolutionRepository,
    private readonly items:
      ConflictResolutionItemRepository,
    private readonly unitOfWork:
      ConflictResolutionUnitOfWork,
    private readonly clock:
      ConflictResolutionClock,
  ) {}

  async resolve(
    command: ResolveConflictCommand,
  ): Promise<ResolvedConflict> {
    const conflict =
      await this.conflicts.get(
        command.conflictId,
      );

    if (!conflict) {
      throw new Error(
        `Conflict not found: ${command.conflictId}`,
      );
    }

    if (
      conflict.resolvedAt !== undefined
    ) {
      throw new Error(
        "Conflict is already resolved",
      );
    }

    if (
      conflict.local.revision !==
        command.expectedLocalRevision ||
      conflict.remote.revision !==
        command.expectedRemoteRevision
    ) {
      throw new Error(
        "Conflict revisions changed",
      );
    }

    const selected =
      this.selectItem(
        command,
        conflict.local,
        conflict.remote,
      );

    const resolvedItem:
      PersonalKnowledgeItem = {
        ...selected,
        revision:
          Math.max(
            conflict.local.revision,
            conflict.remote.revision,
          ) + 1,
        updatedAt:
          this.clock.nowIso(),
      };

    const result:
      ResolvedConflict = {
        conflictId:
          conflict.conflictId,
        item:
          resolvedItem,
        strategy:
          command.strategy,
        resolvedBy:
          command.resolvedBy,
        resolvedAt:
          resolvedItem.updatedAt,
      };

    await this.unitOfWork.run(
      async () => {
        await this.items.save(
          resolvedItem,
        );
        await this.conflicts.saveResolved(
          result,
        );
      },
    );

    return result;
  }

  private selectItem(
    command: ResolveConflictCommand,
    local: PersonalKnowledgeItem,
    remote: PersonalKnowledgeItem,
  ): PersonalKnowledgeItem {
    if (
      command.strategy ===
      "use-local"
    ) {
      return local;
    }

    if (
      command.strategy ===
      "use-remote"
    ) {
      return remote;
    }

    if (!command.manualItem) {
      throw new Error(
        "Manual merge requires manualItem",
      );
    }

    if (
      command.manualItem.itemId !==
      local.itemId
    ) {
      throw new Error(
        "Manual merge item identity mismatch",
      );
    }

    return command.manualItem;
  }
}
