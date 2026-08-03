import type {
  KnowledgeGraphInferenceIssue,
  KnowledgeGraphInferenceRule,
} from "./model.js";

export class KnowledgeGraphInferenceRuleValidator {
  validate(
    rules: readonly KnowledgeGraphInferenceRule[],
  ): readonly KnowledgeGraphInferenceIssue[] {
    const issues: KnowledgeGraphInferenceIssue[] = [];
    const ids = new Set<string>();

    for (const rule of rules) {
      if (ids.has(rule.ruleId)) {
        issues.push({
          code: "rule-id-duplicate",
          message: `Duplicate rule ID: ${rule.ruleId}`,
          subjectId: rule.ruleId,
        });
      }
      ids.add(rule.ruleId);

      if (rule.sourceRelationshipTypeIds.length === 0) {
        issues.push({
          code: "rule-source-empty",
          message: "At least one source relationship is required",
          subjectId: rule.ruleId,
        });
      }

      if (!rule.targetRelationshipTypeId.trim()) {
        issues.push({
          code: "rule-target-empty",
          message: "Target relationship is required",
          subjectId: rule.ruleId,
        });
      }

      const expected =
        rule.kind === "chain" ? 2 : 1;

      if (
        rule.sourceRelationshipTypeIds.length !== expected
      ) {
        issues.push({
          code: "rule-source-count-invalid",
          message:
            `${rule.kind} rules require ${expected} source relationship type(s)`,
          subjectId: rule.ruleId,
        });
      }

      if (!Number.isInteger(rule.priority)) {
        issues.push({
          code: "rule-priority-invalid",
          message: "Rule priority must be an integer",
          subjectId: rule.ruleId,
        });
      }
    }

    return issues;
  }
}
