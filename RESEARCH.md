## Research Note — LLD Practice Platform

1. The Learner Problem

Practicing Low-Level Design is fundamentally different from practicing DSA. With algorithmic problems, correctness is binary — the output either matches or it doesn't. With LLD, two solutions to the same "Parking Lot" problem can both be reasonable: one with 5 classes, another with 12, using different patterns, and there's no single ground truth to check against.

This makes self-assessment hard in a specific way:

A learner can finish a design and have no reliable signal on whether their abstractions are sensible, whether they've over-engineered a simple case, or whether they've missed an obvious extension point (e.g. hardcoding a payment type instead of making it pluggable).
Judging your own design well requires already knowing the patterns and principles you're trying to learn — which is circular for someone still building that judgment.
Feedback that is available (mentors, interviewers) is qualitative, one-off, and not repeatable on demand.

The result: learners can practice LLD problems repeatedly without actually getting better, because there's no feedback loop that tells them why a design is weak and what specifically to fix.

2. Tools Researched

LeetCode / HackerRank — Strong for structured coding and interview practice; LeetCode has system-design discussion/examples, while HackerRank's prep is heavily centered on DSA topics and coding challenges. Missing: a dedicated LLD submission → evaluation → feedback loop comparable to their coding problem flow.

Educative — Grokking the Low Level Design Interview — The strongest structured LLD learning option: 215 lessons, real-world design problems, diagrams, code implementations, quizzes, and 19 interactive mock interviews. Missing: it's guided course and mock-interview learning, not an open-ended "submit your own design → get automated critique → revise → resubmit" loop.

ByteByteGo / Ashish Pratap Singh — Strong concise visual and video walkthroughs explaining design concepts and interview approaches, plus dedicated LLD tutorials and resources. Missing: content is tutorial/reference material, not a persistent submission-and-feedback workflow.

GitHub LLD repositories (e.g. "50 LLD Problems Solved") — Excellent breadth of reference implementations across dozens of real-world design problems in multiple languages. Missing: repositories are examples to study, not evaluators — nothing tells a learner why their own design is weak or what to improve.

Pramp / Interviewing.io — Solve the core feedback problem through real-time human mock interviews — Pramp via peer practice, Interviewing.io via engineer-led sessions. Missing: feedback is human-dependent and requires scheduling and availability, so it isn't an immediate, repeatable practice loop.

The gap: existing resources are good at teaching LLD, showing solutions, or providing human interviews — but none close the loop of design → automated evaluation → actionable feedback → resubmit.

3. Key Gaps
No structured, dimension-based feedback on a specific submission. Existing resources teach principles, show reference solutions, or provide interviews, but don't evaluate a learner's own design against concrete dimensions like SRP, coupling, abstraction, naming, extensibility, and over-engineering.
No fast, repeatable practice loop with visible improvement. Most tools stop at content, example comparison, or a single interview session — there's little support for resubmitting the same problem and seeing how the design improved over time.
Human feedback doesn't scale or stay on-demand. Peer and expert mocks give valuable qualitative feedback, but depend on another person's availability, making them unsuitable for frequent, iterative practice.
4. Product Direction

The product will focus narrowly on a submit → feedback → retry loop for practicing Low-Level Design, rather than becoming another course or content platform. Learners submit code, so the system can run deterministic structural checks (e.g. presence of interfaces, class responsibility counts) alongside an LLM-based evaluation of higher-level design quality. Feedback covers concrete dimensions — class responsibilities, coupling, abstraction, extensibility, naming, and over-engineering — with clear, actionable suggestions rather than a single pass/fail score. The learner can then revise and resubmit the same problem, creating a repeatable loop where improvement is visible across attempts rather than being a one-shot exerci
