# Execution Momentum Skill

Inspired by `gsd-build/get-shit-done`, adapted as a lightweight execution discipline for broad or ambiguous tasks in this repository.

## What This Skill Does

Turns fuzzy requests into a practical sequence that still ships.

Use it to:

- decompose broad tasks into concrete implementation slices
- keep momentum on multi-step work
- prevent context sprawl
- preserve a reasonable verification bar without ceremony overload

## When To Trigger

Use this skill when:

- the request is broad, vague, or “productionize this”
- the work spans analysis, implementation, and verification
- there are several moving parts and an obvious execution order is not given

## When NOT To Trigger

Do not use this skill when:

- the task is already crisp and single-step
- planning overhead would exceed the work itself

## Required Inputs

- the user’s goal
- relevant code entry points
- repo constraints from `AGENTS.md` and `SKILLS.md`

## Expected Outputs

- a short actionable breakdown
- a sensible execution order
- incremental progress through analysis, edits, verification, and wrap-up

## Workflow

1. Clarify the actual success condition from the user’s request.
2. Inspect the minimum repo context needed to avoid thrashing.
3. Slice the task into a few concrete steps.
4. Execute rather than over-planning.
5. Re-check the result against the original goal before finishing.

## Default Breakdown Pattern

Use this pattern when helpful:

1. Inspect the relevant code paths.
2. Identify the minimal viable change.
3. Implement the change.
4. Run the most relevant verification.
5. Update durable docs/memory if the task changed repo knowledge.

## Safety and Quality Constraints

- Do not import heavyweight planning artifacts unless they clearly help.
- Do not fake certainty; document assumptions.
- Do not let workflow theater replace implementation.
- Keep the plan proportional to the task.

## Notes on Adaptation

The source repository includes a large command-and-artifact planning framework. This adaptation keeps the strongest part for this repo: disciplined slicing, progress tracking, and follow-through without bringing in the full external command system.
