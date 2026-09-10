import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { Problem, Submission, EvaluationResult, DimensionResult } from "../types";
import { Evaluator } from "./Evaluator";

export class LLMEvaluator implements Evaluator {
  private anthropicClient?: Anthropic;
  private geminiClient?: GoogleGenAI;
  private anthropicModel: string;
  private geminiModel: string;

  constructor(apiKey?: string, model?: string) {
    const anthropicKey = apiKey || process.env.ANTHROPIC_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (anthropicKey) {
      this.anthropicClient = new Anthropic({ apiKey: anthropicKey });
    }

    if (geminiKey) {
      this.geminiClient = new GoogleGenAI({ apiKey: geminiKey });
    }

    this.anthropicModel = model || process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
    this.geminiModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  }

  public async evaluate(
    submission: Submission,
    problem: Problem
  ): Promise<EvaluationResult> {
    let lastError: Error | null = null;

    // Retry exactly once on any failure (total 2 attempts)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await this.callLLM(submission, problem);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `[LLMEvaluator] Attempt ${attempt}/2 failed: ${lastError.message}`
        );

        if (attempt === 1) {
          // Brief pause before single retry
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    // After retry also fails, throw error for FeedbackAssembler to catch
    throw new Error(
      `LLM evaluation failed after retry: ${lastError?.message || "Unknown error"}`
    );
  }

  private async callLLM(
    submission: Submission,
    problem: Problem
  ): Promise<EvaluationResult> {
    const prompt = this.buildPrompt(submission, problem);
    let rawText = "";

    // 1. Prioritize Google Gemini (Free Tier API Key) if available
    if (this.geminiClient || process.env.GEMINI_API_KEY) {
      const gemini = this.geminiClient || new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await gemini.models.generateContent({
        model: this.geminiModel,
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert Low-Level Design (LLD) evaluator. You must evaluate the code and respond with ONLY a valid, raw JSON object. Do not include markdown code fences, backticks, comments, or surrounding text.",
          responseMimeType: "application/json",
          maxOutputTokens: 1024,
        },
      });

      rawText = response.text?.trim() || "";
    } else if (this.anthropicClient || process.env.ANTHROPIC_API_KEY) {
      // 2. Otherwise use Anthropic API
      const anthropic = this.anthropicClient || new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create(
        {
          model: this.anthropicModel,
          max_tokens: 1024,
          system:
            "You are an expert Low-Level Design (LLD) evaluator. You must evaluate the code and respond with ONLY a valid, raw JSON object. Do not include markdown code fences, backticks, comments, or any surrounding text.",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        { timeout: 15000 } // 15s timeout
      );

      const firstBlock = response.content[0];
      if (!firstBlock || firstBlock.type !== "text") {
        throw new Error("No text block returned in Anthropic API response.");
      }
      rawText = firstBlock.text.trim();
    } else {
      throw new Error(
        "No LLM API key configured. Set GEMINI_API_KEY (Free at aistudio.google.com) or ANTHROPIC_API_KEY in .env"
      );
    }

    // Strip markdown code fences if present
    if (rawText.startsWith("```")) {
      rawText = rawText
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "")
        .trim();
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      throw new Error(`Failed to parse LLM response as JSON: ${rawText}`);
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Parsed LLM output is not a JSON object.");
    }

    const obj = parsed as Record<string, unknown>;
    const dimensions: Record<string, DimensionResult> = {};
    const expectedKeys = ["srp", "coupling", "extensibility", "naming"];

    for (const key of expectedKeys) {
      const dim = obj[key] as Record<string, unknown> | undefined;
      if (!dim || typeof dim !== "object" || Array.isArray(dim)) {
        throw new Error(`Missing required dimension '${key}' in LLM response.`);
      }

      if (dim.score === undefined || dim.score === null) {
        throw new Error(`Missing 'score' field for dimension '${key}'.`);
      }

      const scoreNum = Number(dim.score);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 1) {
        throw new Error(
          `Score for dimension '${key}' must be a number between 0.0 and 1.0. Received: ${dim.score}`
        );
      }

      const explanationStr = String(dim.explanation || "").trim();
      if (!explanationStr) {
        throw new Error(`Missing or empty 'explanation' for dimension '${key}'.`);
      }

      dimensions[key] = {
        score: Number(scoreNum.toFixed(2)),
        explanation: explanationStr,
      };
    }

    return {
      source: "llm",
      dimensions,
    };
  }

  private buildPrompt(submission: Submission, problem: Problem): string {
    return `
Evaluate the following TypeScript Low-Level Design (LLD) submission for the problem "${problem.title}".

Problem Requirements:
${problem.requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Problem Constraints:
${problem.constraints.map((c, i) => `- ${c}`).join("\n")}

Submitted TypeScript Code:
\`\`\`typescript
${submission.code}
\`\`\`

Evaluate the submission against these 4 dimensions:
- srp: Single Responsibility Principle adherence
- coupling: coupling/cohesion/abstraction quality
- extensibility: how easily the design accommodates new requirements (Open/Closed)
- naming: domain-appropriate, readable naming

Respond with ONLY valid JSON with this exact schema:
{
  "srp": { "score": 0.85, "explanation": "Short explanation of SRP adherence..." },
  "coupling": { "score": 0.80, "explanation": "Short explanation of coupling and abstractions..." },
  "extensibility": { "score": 0.90, "explanation": "Short explanation of extensibility..." },
  "naming": { "score": 0.85, "explanation": "Short explanation of naming quality..." }
}
`.trim();
  }
}
