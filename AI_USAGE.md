# AI Usage

AI (Claude) was used throughout this project as a design partner and implementation accelerator, not as an autopilot. Below are the meaningful decisions — what was suggested, what was accepted, rejected, or corrected, and why.

## 1. Scoping via a structured elicitation process, not a single prompt

Rather than asking for "an MVP scope" in one shot, the scope was built incrementally: submission format, problem set, evaluator split, execution model, and explicit out-of-scope items were each decided one at a time and written down as a "scope contract" before any code was written. This surfaced ambiguities early — for example, an initial phrasing of the evaluator rule ("run both / fallback") could have been misread as "only run the LLM evaluator if deterministic checks pass," which was caught and corrected before it became a design flaw baked into code.

**Accepted:** the discipline of finalizing scope as an explicit, unambiguous bulleted contract before building.
**Rejected:** none of the scoping suggestions were rejected outright, but several were tightened for precision (e.g., adding a `failed` terminal status alongside `completed`, which the first draft of the lifecycle omitted).

## 2. The Strategy pattern for evaluators, and *not* adding others

AI suggested modeling `DeterministicEvaluator` and `LLMEvaluator` behind a shared `Evaluator` interface (Strategy pattern), directly extensibility question in the brief. It also explicitly suggested *not* using Factory or Observer patterns, on the basis that they wouldn't solve a current requirement.

**Accepted:** the Strategy pattern — it was the correct fit and made the "add a new evaluation approach later" requirement trivial to satisfy on paper.
**Accepted the restraint too:** deliberately not reaching for extra patterns to "show pattern knowledge" was a good call — it kept the domain model reviewable in one sitting instead of padded with unused abstractions.

## 3. AI-driven code audit caught two real architectural bugs before they shipped

After generating the backend scaffold from the locked design, a structured audit prompt was run against the actual repo files (not a description of them) to check for drift between the design doc and the real code. It found two genuine issues:

- **`FeedbackAssembler` had an unguarded sequential await** on `DeterministicEvaluator.evaluate()`, meaning an unexpected (non-parseError) crash there would have silently prevented `LLMEvaluator` from ever running — breaking the "evaluators run independently" design guarantee.
- **`POST /api/attempts` was awaiting the full evaluation pipeline before responding**, meaning the attempt was already `"completed"` by the time the HTTP response returned — so the `"evaluating"` status existed in the database but the frontend's poll-based design would never actually observe it, silently breaking the submit → evaluating → poll → results flow from the design note.

**Accepted:** both fixes, exactly as proposed (`Promise.allSettled` for evaluator independence; fire-and-forget evaluation with a separate `createPending` / `runEvaluationAndUpdate` / `markFailed` split in `AttemptService`).
**Verified, not trusted blindly:** rather than accepting the audit's "all fixed" report at face value, both fixes were manually tested with real `curl` requests — submitting an attempt and immediately polling it to confirm `"evaluating"` was genuinely observable, and later deliberately breaking the Anthropic API key to confirm the fallback path produced `usedFallback: true` with the deterministic feedback still intact. This distinction mattered: the AI's own verification step (`tsc --noEmit` passing) only proved the code compiled, not that the described behavior was actually true at runtime.

## 4. Caught a stale model identifier during README review

An AI-generated README listed `ANTHROPIC_MODEL=claude-3-5-sonnet-20241022` as the default — an outdated model string. This was flagged during review rather than left in, and corrected in both the `.env.example` and the actual `LLMEvaluator` code before the LLM integration was tested for real. This is a concrete example of not assuming AI-generated documentation or config defaults are current without checking.

## 5. Test suite generated against a fixed contract, then validated by reading output

The Jest test suite (deterministic evaluator edge cases, `FeedbackAssembler` fallback behavior, and the async `202`-response route test) was generated from an explicit spec describing exactly what each test needed to prove — in particular, a regression test written specifically to fail if the `Promise.allSettled` fix were ever reverted. Test output was read manually rather than trusting a pass/fail summary alone, to confirm the tests were genuinely exercising the intended behavior rather than passing due to an overly permissive mock.

## Summary

AI was most useful for: turning a locked design into working code quickly, and auditing that code against the design to catch drift. It was least reliable for: confirming its own output actually worked at runtime (compiling ≠ correct) and for defaults/config values (the stale model string) — both of which needed manual verification rather than trust.