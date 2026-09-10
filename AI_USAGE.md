# AI Usage & Collaboration Note

This project was conceived, architected, and implemented end-to-end by the author. AI was utilized strictly as an interactive sounding board, logic advisor, and review partner—assisting in refining design decisions, brainstorming edge cases, and sanity-checking core architectural logic.

Below is an overview of how AI was consulted for logical feedback and suggestions throughout the development process.

---

## 1. Architectural & Pattern Sounding Board

When designing the evaluation pipeline, I explored how to structure the deterministic vs. LLM evaluation components to ensure modularity and future extensibility.

* **Consultation & Brainstorming:** Discussed design pattern trade-offs for pluggable evaluators (evaluating Strategy vs. Factory/Observer patterns).
* **Logical Takeaway:** Affirmed using the **Strategy pattern** (`Evaluator` interface) for its clean separation of concerns and direct extensibility, while deliberately avoiding unnecessary creational patterns to keep the codebase clean, lean, and maintainable.

---

## 2. Async Lifecycle & Edge Case Review

The attempt submission flow required an asynchronous execution model (`pending` -> `evaluating` -> `completed` / `failed`) with real-time polling from the client and independent evaluator execution.

* **Logic Review:** Bounced off ideas on handling concurrent evaluator failures without cascading errors.
* **Refinements Made:**
  * Adopted `Promise.allSettled` to guarantee that deterministic AST checks and LLM evaluations execute independently—ensuring that an external LLM outage never prevents deterministic feedback from being delivered.
  * Structured the endpoint to acknowledge submissions immediately (`202 Accepted`) and process evaluations asynchronously so that frontend polling accurately tracks the active evaluation lifecycle without request timeouts.

---

## 3. Feedback Dimensions & Evaluation Logic

Designing meaningful evaluation heuristics for Low-Level Design problems requires balancing fast static structural analysis with qualitative design feedback.

* **Suggestions Explored:** Brainstormed key evaluation dimensions (Single Responsibility, coupling, abstraction depth, naming clarity, and extensibility) and how to handle fallback states when an LLM evaluation is unreachable.
* **Logical Takeaway:** Formulated structured prompt templates with strict schema constraints and implemented graceful fallback responses that surface deterministic findings alongside a transparent warning banner if the LLM provider fails.

---

## 4. Code & Test Logic Sanity Checks

* **Logical Review:** Reviewed test specifications and edge cases for the deterministic evaluator (e.g., AST parsing errors, malformed syntax, multiple class definitions, empty inputs).
* **Outcome:** Ensured test coverage thoroughly validates fallback paths, error propagation, and asynchronous route behavior under unexpected failure modes.

---

## Summary

All core architecture, business logic, UI design, database modeling, and code implementation were authored directly. AI served as a valuable logic partner to brainstorm trade-offs, challenge assumptions, and validate resilient design patterns.