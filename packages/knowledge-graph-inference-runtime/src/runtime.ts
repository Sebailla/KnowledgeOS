import {
  KnowledgeGraphInferenceConsistencyChecker,
  KnowledgeGraphInferenceEngine,
  KnowledgeGraphInferenceRuleValidator,
} from "@knowledgeos/knowledge-graph-inference";
import type {
  KnowledgeGraphInferenceRepository,
  KnowledgeGraphInferenceRule,
} from "@knowledgeos/knowledge-graph-inference";

export interface KnowledgeGraphInferenceRuntimeClock {
  nowIso(): string;
}

export class KnowledgeGraphInferenceRuntime {
  private readonly validator =
    new KnowledgeGraphInferenceRuleValidator();
  private readonly checker =
    new KnowledgeGraphInferenceConsistencyChecker();

  public constructor(
    private readonly repository:
      KnowledgeGraphInferenceRepository,
    private readonly clock:
      KnowledgeGraphInferenceRuntimeClock,
  ) {}

  async saveRule(
    rule: KnowledgeGraphInferenceRule,
  ): Promise<void> {
    const existing =
      await this.repository.listRules(
        rule.ontologyId,
      );

    const candidate = [
      ...existing.filter(
        (value) => value.ruleId !== rule.ruleId,
      ),
      rule,
    ];

    const issues =
      this.validator.validate(candidate);

    if (issues.length > 0) {
      throw new Error(
        issues
          .map(
            (issue) =>
              `${issue.code}: ${issue.message}`,
          )
          .join("; "),
      );
    }

    await this.repository.saveRule(rule);
  }

  async recompute(
    input: {
      readonly graphId: string;
      readonly ontologyId: string;
    },
  ): Promise<{
    readonly generated: number;
    readonly replaced: number;
  }> {
    const rules =
      await this.repository.listRules(
        input.ontologyId,
      );
    const facts =
      await this.repository.listFacts(
        input.graphId,
      );

    const engine =
      new KnowledgeGraphInferenceEngine(
        this.clock,
      );

    const derived =
      engine.infer(
        facts,
        rules,
      );

    const issues =
      this.checker.check(
        facts,
        derived,
      );

    if (issues.length > 0) {
      throw new Error(
        issues
          .map(
            (issue) =>
              `${issue.code}: ${issue.message}`,
          )
          .join("; "),
      );
    }

    let replaced = 0;

    for (const rule of rules) {
      replaced +=
        await this.repository
          .deleteDerivedFactsByRule(
            input.graphId,
            rule.ruleId,
          );
    }

    for (const fact of derived) {
      await this.repository.upsertDerivedFact(
        fact,
      );
    }

    return {
      generated: derived.length,
      replaced,
    };
  }
}
