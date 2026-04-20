# SKILLS.md

## Purpose

This repository uses a small Codex-facing local skill layer to make recurring tasks more consistent without dragging in unnecessary prompt weight.

These skills are grounded in this repo first and inspired by external systems second.

## Available Local Skills

### `project-memory`

- Location: `.codex/skills/project-memory/SKILL.md`
- Use when: a task depends on repo conventions, recurring decisions, architecture notes, deployment/auth gotchas, or previously documented implementation history
- Do not use when: the task is self-contained and nearby code inspection is enough

### `ui-ux-repo`

- Location: `.codex/skills/ui-ux-repo/SKILL.md`
- Use when: working on landing pages, dashboards, design-system alignment, forms, onboarding, empty states, responsive layout, visual hierarchy, or conversion-facing polish
- Do not use when: the task is backend-only, infra-only, or purely mechanical

### `repo-superpowers`

- Location: `.codex/skills/repo-superpowers/SKILL.md`
- Use when: debugging, refactoring, understanding architecture, planning high-leverage search paths, or reducing risk in broad engineering changes
- Do not use when: the task is tiny and obvious

### `execution-momentum`

- Location: `.codex/skills/execution-momentum/SKILL.md`
- Use when: a task is vague, broad, multi-step, or likely to sprawl without clear slicing
- Do not use when: the task is already sharply scoped and can be executed directly

## Trigger Guidance

Use skills only when context matches.

- If the task touches UI, strongly consider `ui-ux-repo`.
- If the task is broad or execution-heavy, strongly consider `execution-momentum`.
- If the task relies on recurring repo knowledge or prior decisions, use `project-memory`.
- If the task needs deeper debugging, refactoring strategy, or architecture reasoning, use `repo-superpowers`.

## Examples

Use `project-memory` when:

- updating auth and needing current redirect/domain gotchas
- touching Supabase or Vercel conventions repeatedly
- making a change that should update durable repo notes

Do not use `project-memory` when:

- renaming a local variable in one component
- fixing a typo in one file

Use `ui-ux-repo` when:

- improving the landing page hero or pricing presentation
- tightening dashboard density, readability, or responsive behavior
- cleaning up form states, empty states, or onboarding flows

Do not use `ui-ux-repo` when:

- editing a Supabase function
- debugging a scraper or provider integration

Use `repo-superpowers` when:

- tracing a bug across UI, API, and auth boundaries
- planning a refactor across pages, contexts, and shared utilities
- deciding the safest search strategy before changing a risky subsystem

Do not use `repo-superpowers` when:

- the change is confined to one obvious JSX class list

Use `execution-momentum` when:

- the request is “make this production-ready”
- the task spans analysis, implementation, verification, and follow-through
- there are multiple non-obvious subtasks to order

Do not use `execution-momentum` when:

- the request is already a single-file fix with a clear path

## Combining Skills

Useful combinations:

- `project-memory` + `ui-ux-repo`: UI work that must respect established product language
- `project-memory` + `repo-superpowers`: risky refactors that depend on existing architecture decisions
- `ui-ux-repo` + `execution-momentum`: broad frontend improvements that need disciplined slicing
- `repo-superpowers` + `execution-momentum`: ambiguous debugging or architecture tasks

Avoid loading all skills by default. Use the smallest set that materially improves the task.

## Context Hygiene

- Prefer repo inspection before loading skills.
- Load only the skill files relevant to the current task.
- Prefer concise local references and notes over large external frameworks.
- Do not overload context with generic methodology when the repo already answers the question.

## Grounding Rule

When a skill suggests an action, the repository remains the source of truth.

- Prefer nearby code over generic advice.
- Prefer existing architecture over imported patterns.
- Prefer documented repo memory over inferred history.
- If a skill conflicts with the current codebase, follow the codebase and document the mismatch.
