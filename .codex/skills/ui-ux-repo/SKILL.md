# UI/UX Repo Skill

Inspired by `nextlevelbuilder/ui-ux-pro-max-skill`, adapted to this repository’s actual product language and frontend stack.

## What This Skill Does

Provides a practical UI/UX lens for this repo’s React + Tailwind + shadcn-style frontend.

Use it to:

- improve landing pages, dashboards, forms, pricing, onboarding, and empty states
- sharpen visual hierarchy and conversion clarity
- tighten responsive behavior and spacing
- align new UI with existing tokens, surfaces, typography, and motion

## When To Trigger

Use this skill when a task touches:

- landing pages or marketing sections
- dashboard layout, data density, cards, tables, widgets, or navigation
- auth screens, forms, onboarding, empty states, or CTA flow
- responsiveness, polish, readability, accessibility, or conversion improvements

## When NOT To Trigger

Do not use this skill when:

- the task is backend-only
- the task is purely about deployment, infrastructure, or scraping
- the change is a tiny non-visual fix with no UI implications

## Required Inputs

- the relevant page/component files
- `src/index.css`
- nearby components that establish current visual patterns

## Expected Outputs

- UI changes that look native to this product
- concise rationale tied to this repo’s design language
- preserved or improved accessibility and responsiveness

## Repo-Specific Design Guidance

- Keep the existing restrained blue primary and clean card surfaces unless the local feature clearly needs a stronger direction.
- Prefer subtle polish over stylistic churn.
- Reuse CSS variables and utilities such as `surface-raised`, `focus-ring`, `pressable`, and existing font utilities.
- Respect the difference between marketing UI and dashboard UI, but keep them in the same brand family.
- Use motion deliberately; match current Framer Motion timing/easing where possible.
- Favor clarity, conversion, and information hierarchy over novelty.

## Workflow

1. Inspect the current page/component and adjacent UI.
2. Identify the existing visual and interaction pattern.
3. Improve the experience using current tokens and component patterns first.
4. Verify mobile and desktop implications.
5. Avoid importing a generic design system that fights the repo.

## Safety and Quality Constraints

- Do not force a random external aesthetic onto the project.
- Do not add decorative complexity without a product reason.
- Keep keyboard focus, contrast, and readable states intact.
- Prefer incremental visual improvements over broad rewrites.

## Notes on Adaptation

The source repository includes large style/catalog datasets and generators. For this repo, the useful adaptation is the reasoning discipline, anti-pattern awareness, and design-system alignment, not the entire external generation stack.
