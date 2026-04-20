# Project Memory Skill

Inspired by `thedotmack/claude-mem`, adapted for this repository as a lightweight, grounded memory practice rather than a background memory service.

## What This Skill Does

Helps preserve durable repo knowledge for future tasks without inventing context.

Use it to:

- capture conventions that recur across tasks
- record architecture notes and integration gotchas
- preserve verified implementation history that future work is likely to depend on
- keep repo knowledge grounded in files and verified changes

Primary memory file:

- `.codex/project-memory.md`

## When To Trigger

Use this skill when:

- a task depends on recurring repository knowledge
- you are touching auth, deployment, environment, billing, or another area with cross-file consequences
- a change creates durable new repo knowledge worth preserving
- you need to sanity-check whether prior conventions are already documented

## When NOT To Trigger

Do not use this skill when:

- the task is fully local and nearby code inspection is enough
- the information is temporary or speculative
- you do not have file-grounded evidence for a memory entry

## Required Inputs

- the relevant local files
- any verified change you made in this repo

## Expected Outputs

- a concise read of existing repo memory before work, when relevant
- a targeted update to `.codex/project-memory.md` when new durable knowledge is created
- explicit evidence references for new memory entries

## Workflow

1. Read `.codex/project-memory.md` if the task appears to depend on recurring repo context.
2. Verify the memory against current files if there is any doubt.
3. Do the task using repository files as the source of truth.
4. If the task creates durable knowledge, update `.codex/project-memory.md`.
5. Keep entries concise, factual, and evidence-backed.

## Safety and Quality Constraints

- Never invent memory.
- Never store secrets, tokens, credentials, or sensitive personal data.
- Never record preferences as facts unless the repo demonstrates them.
- Prefer “Evidence:” lines with file paths.
- If knowledge becomes stale, update or remove it instead of layering contradictory notes.
