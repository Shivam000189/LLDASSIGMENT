# Design Note

## 3.1 Core Entities

The MVP has six core domain concepts:

* **Problem** — The practice question being solved, such as Parking Lot or Vending Machine.
* **Attempt** — One learner's attempt at one problem and its evaluation lifecycle.
* **Submission** — The TypeScript code submitted for an attempt.
* **Evaluator** — A component that evaluates a submission; the MVP has deterministic and LLM implementations.
* **EvaluationResult** — Structured output from an evaluator containing scores/checks and explanations.
* **Feedback** — The combined learner-facing result from deterministic and LLM evaluation.

`Learner` is not a domain entity because authentication is out of scope. A learner is represented by a simple `learnerId: string`.

## 3.2 Responsibilities

* `Problem` — owns static problem data: `id`, `title`, `requirements`, `constraints`, and `expectedEntities`.
* `Attempt` — owns lifecycle state: `id`, `problemId`, `learnerId`, `status`, timestamps, and references to its submission and feedback.
* `Submission` — owns raw submitted content: `code`, fixed `language: "TS"`, and `submittedAt`.
* `Evaluator` — defines exactly one operation: `evaluate(submission, problem): EvaluationResult`.
* `DeterministicEvaluator` — owns static TypeScript analysis and objective structural checks.
* `LLMEvaluator` — owns prompt construction and the LLM API call, including one retry on failure.
* `EvaluationResult` — owns the structured dimensions/checks, scores, and explanations produced by one evaluator.
* `FeedbackAssembler` — owns merging deterministic and LLM results into learner-facing feedback.

## 3.3 Strategy Pattern

**Evaluators are pluggable via a shared `Evaluator` interface; adding a new evaluation approach (for example, a future diagram-based evaluator) means implementing the interface rather than modifying existing evaluators.**

No additional design patterns are required for the MVP. Factory or Observer would add complexity without solving a current product requirement.

## 3.4 Relationships

```text
Problem 1 ---- * Attempt
Attempt 1 ---- 1 Submission
Attempt 1 ---- 1 Feedback

Feedback
   ├── Deterministic EvaluationResult
   └── LLM EvaluationResult

Evaluator (interface)
   ├── DeterministicEvaluator
   └── LLMEvaluator
```

History requires no separate entity. Multiple `Attempt` records can exist for the same `problemId + learnerId`; history is retrieved by querying those attempts and sorting by `createdAt`.

## 3.5 MongoDB Mapping

* **`problems` collection** — read-mostly seed data containing the two predefined problems.
* **`attempts` collection** — stores attempts and embeds `submission` and `feedback` as subdocuments because they are always fetched with their attempt and are not queried independently.

This keeps the MVP schema simple while preserving the complete history of each attempt.

## 3.6 Sanity Check

* Every domain class has one clearly defined responsibility.
* Both evaluator implementations use the identical `Evaluator.evaluate(submission, problem)` contract; no deterministic-only or LLM-only parameters leak into the interface.
* `Attempt.status` explicitly supports `evaluating`, `completed`, and `failed`.
* `Submission.language` is fixed to `TS`, matching the scope contract.
* LLM failure is retried once; after the retry fails, the evaluation flow can produce deterministic-only feedback with the required visible fallback message.
