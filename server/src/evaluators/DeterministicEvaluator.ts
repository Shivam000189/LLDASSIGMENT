import { Problem, Submission, EvaluationResult } from "../types";
import { Evaluator } from "./Evaluator";

export class DeterministicEvaluator implements Evaluator {
  public async evaluate(
    submission: Submission,
    problem: Problem
  ): Promise<EvaluationResult> {
    try {
      const code = submission.code || "";

      // 1. structurePresent: 1 if any class/interface keyword found, else 0
      const hasStructure = /\b(class|interface)\b/.test(code);
      const structurePresent = {
        score: hasStructure ? 1 : 0,
        explanation: hasStructure
          ? "Found class or interface declarations in submission."
          : "No class or interface declarations found.",
      };

      // 2. entityCoverage: fraction of problem.expectedEntities found as identifiers in the code
      const expected = problem.expectedEntities || [];
      const foundEntities: string[] = [];
      const missingEntities: string[] = [];

      for (const entity of expected) {
        const entityRegex = new RegExp(`\\b${entity}\\b`);
        if (entityRegex.test(code)) {
          foundEntities.push(entity);
        } else {
          missingEntities.push(entity);
        }
      }

      const entityScore =
        expected.length > 0
          ? Number((foundEntities.length / expected.length).toFixed(2))
          : 1;

      const entityCoverage = {
        score: entityScore,
        explanation:
          expected.length > 0
            ? `Identified ${foundEntities.length}/${expected.length} expected entities. Found: [${foundEntities.join(", ")}]. Missing: [${missingEntities.join(", ")}].`
            : "No specific entities expected for this problem.",
      };

      // 3. statePresent: 1 if an enum is defined, else 0
      const hasEnum = /\benum\b/.test(code);
      const statePresent = {
        score: hasEnum ? 1 : 0,
        explanation: hasEnum
          ? "Found enum definition(s) representing domain states/types."
          : "No enum definitions found.",
      };

      // 4. responsibilitySpread: score based on class count (cap benefit at 3+ classes)
      const classMatches = code.match(/\bclass\s+[A-Za-z0-9_$]+/g) || [];
      const classCount = classMatches.length;
      let spreadScore = 0;
      if (classCount >= 3) {
        spreadScore = 1;
      } else if (classCount === 2) {
        spreadScore = 0.67;
      } else if (classCount === 1) {
        spreadScore = 0.33;
      } else {
        spreadScore = 0;
      }

      const responsibilitySpread = {
        score: spreadScore,
        explanation: `Identified ${classCount} class definition(s) in the submitted code.`,
      };

      return {
        source: "deterministic",
        dimensions: {
          structurePresent,
          entityCoverage,
          statePresent,
          responsibilitySpread,
        },
      };
    } catch (error) {
      return {
        source: "deterministic",
        dimensions: {},
        parseError:
          error instanceof Error
            ? error.message
            : "Unknown error during deterministic parsing",
      };
    }
  }
}
