# Repo Superpowers Skill

Inspired by `obra/superpowers`, adapted into a disciplined engineering leverage skill for this codebase without importing its full mandatory workflow system.

## What This Skill Does

Helps with high-leverage engineering work:

- repo understanding
- architecture tracing
- debugging across boundaries
- safer refactor planning
- search strategy for large or messy changes

## When To Trigger

Use this skill when:

- the change spans multiple directories or layers
- you need to understand existing architecture before editing
- the bug crosses UI, auth, API, state, or deployment concerns
- a refactor could introduce regression risk

## When NOT To Trigger

Do not use this skill when:

- the task is a small isolated edit
- the path is already obvious from nearby code

## Required Inputs

- relevant entry points and adjacent files
- the current task goal
- any observable failures, errors, or regressions

## Expected Outputs

- a focused search/inspection plan
- a clear articulation of the current architecture slice
- a minimal, low-risk implementation approach
- verification thinking matched to the affected area

## Workflow

1. Start with entry points, not random file hopping.
2. Trace the smallest architecture slice that explains the behavior.
3. Identify constraints before proposing abstractions.
4. Prefer a minimal change set over framework-level rewrites.
5. Verify the highest-risk paths before calling work complete.

## Heuristics for This Repo

- For auth issues, inspect `src/App.tsx`, auth pages, Supabase client setup, and redirect helpers together.
- For data issues, inspect `src/lib/api.ts`, query usage, and the relevant page/widget.
- For backend/integration issues, inspect the matching `supabase/functions/*` entry point and config.
- For UI issues, trace from page -> section/component -> shared UI primitive -> tokens in `src/index.css`.

## Safety and Quality Constraints

- Avoid overcomplicated methodology for simple tasks.
- Do not assume missing architecture; inspect first.
- Prefer evidence from code over confidence from pattern recognition.
- Keep refactors bounded and explain why the chosen slice is sufficient.

## Notes on Adaptation

The source repository includes strong opinions about mandatory workflows, subagents, TDD, and worktrees. This adaptation keeps the useful reasoning patterns while remaining compatible with practical day-to-day Codex use in this repo.
