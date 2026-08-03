import type {
  KnowledgeObjectId,
} from "@knowledgeos/domain-types";
import type {
  PersonalKnowledgeAnchor,
  PersonalKnowledgeItem,
  PersonalKnowledgeItemType,
  PersonalKnowledgeRevision,
} from "./model.js";
import type {
  PersonalKnowledgeRepository,
  PersonalKnowledgeRevisionRepository,
  PersonalKnowledgeUnitOfWork,
} from "./repositories.js";

export interface PersonalKnowledgeClock {
  nowIso(): string;
}

export interface CreatePersonalKnowledgeInput {
  readonly itemId: string;
  readonly ownerId: string;
  readonly knowledgeObjectId: KnowledgeObjectId;
  readonly type: PersonalKnowledgeItemType;
  readonly anchor?: PersonalKnowledgeAnchor;
  readonly body: string;
  readonly tags?: readonly string[];
  readonly color?: string;
}

export interface UpdatePersonalKnowledgeInput {
  readonly itemId: string;
  readonly ownerId: string;
  readonly expectedRevision: number;
  readonly body?: string;
  readonly tags?: readonly string[];
  readonly color?: string;
  readonly anchor?: PersonalKnowledgeAnchor;
}

export class PersonalKnowledgeService {
  public constructor(
    private readonly items: PersonalKnowledgeRepository,
    private readonly revisions: PersonalKnowledgeRevisionRepository,
    private readonly unitOfWork: PersonalKnowledgeUnitOfWork,
    private readonly clock: PersonalKnowledgeClock,
  ) {}

  async create(
    input: CreatePersonalKnowledgeInput,
  ): Promise<PersonalKnowledgeItem> {
    const existing =
      await this.items.get(input.itemId);

    if (existing) {
      throw new Error(
        `Personal Knowledge item already exists: ${input.itemId}`,
      );
    }

    this.validateAnchor(input.anchor);

    const now = this.clock.nowIso();
    const item: PersonalKnowledgeItem = {
      itemId: input.itemId,
      ownerId: input.ownerId,
      knowledgeObjectId: input.knowledgeObjectId,
      type: input.type,
      ...(input.anchor ? { anchor: input.anchor } : {}),
      body: input.body,
      tags: [...(input.tags ?? [])],
      ...(input.color ? { color: input.color } : {}),
      revision: 1,
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };

    await this.unitOfWork.run(async () => {
      await this.items.save(item);
      await this.revisions.append(
        this.toRevision(item, input.ownerId),
      );
    });

    return item;
  }

  async update(
    input: UpdatePersonalKnowledgeInput,
  ): Promise<PersonalKnowledgeItem> {
    const current =
      await this.requireOwned(
        input.itemId,
        input.ownerId,
      );

    if (
      current.revision !==
      input.expectedRevision
    ) {
      throw new Error(
        "Personal Knowledge revision conflict",
      );
    }

    this.validateAnchor(input.anchor);

    const updated: PersonalKnowledgeItem = {
      ...current,
      ...(input.body !== undefined
        ? { body: input.body }
        : {}),
      ...(input.tags !== undefined
        ? { tags: [...input.tags] }
        : {}),
      ...(input.color !== undefined
        ? { color: input.color }
        : {}),
      ...(input.anchor !== undefined
        ? { anchor: input.anchor }
        : {}),
      revision: current.revision + 1,
      updatedAt: this.clock.nowIso(),
    };

    await this.unitOfWork.run(async () => {
      await this.items.save(updated);
      await this.revisions.append(
        this.toRevision(
          updated,
          input.ownerId,
        ),
      );
    });

    return updated;
  }

  async remove(
    itemId: string,
    ownerId: string,
    expectedRevision: number,
  ): Promise<PersonalKnowledgeItem> {
    const current =
      await this.requireOwned(
        itemId,
        ownerId,
      );

    if (
      current.revision !==
      expectedRevision
    ) {
      throw new Error(
        "Personal Knowledge revision conflict",
      );
    }

    const deleted: PersonalKnowledgeItem = {
      ...current,
      revision: current.revision + 1,
      deleted: true,
      updatedAt: this.clock.nowIso(),
    };

    await this.unitOfWork.run(async () => {
      await this.items.save(deleted);
      await this.revisions.append(
        this.toRevision(
          deleted,
          ownerId,
        ),
      );
    });

    return deleted;
  }

  private async requireOwned(
    itemId: string,
    ownerId: string,
  ): Promise<PersonalKnowledgeItem> {
    const item =
      await this.items.get(itemId);

    if (!item) {
      throw new Error(
        `Personal Knowledge item not found: ${itemId}`,
      );
    }

    if (item.ownerId !== ownerId) {
      throw new Error(
        "Personal Knowledge owner mismatch",
      );
    }

    return item;
  }

  private toRevision(
    item: PersonalKnowledgeItem,
    changedBy: string,
  ): PersonalKnowledgeRevision {
    return {
      itemId: item.itemId,
      revision: item.revision,
      snapshot: item,
      changedAt: item.updatedAt,
      changedBy,
    };
  }

  private validateAnchor(
    anchor: PersonalKnowledgeAnchor | undefined,
  ): void {
    if (!anchor) return;

    if (anchor.kind === "text") {
      if (
        anchor.startOffset < 0 ||
        anchor.endOffset < anchor.startOffset
      ) {
        throw new Error(
          "Invalid text anchor offsets",
        );
      }
      return;
    }

    if (anchor.pageNumber < 1) {
      throw new Error(
        "Invalid page anchor",
      );
    }
  }
}
