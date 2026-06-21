# Willbook — Learning & Build Plan

**Purpose:** This document tracks the deliberate process of turning Willbook from a working demo into a product I actually understand, one phase at a time. Update the checkboxes and notes as phases complete — this is a living doc, not a one-time spec.

**Context:** I built the initial version of Willbook quickly with Claude Code to test whether I could stand up a UI + database app. It works (auth, a Postgres database with row-level security, a Google Books API integration, a working reading-status workflow), but I don't yet understand *why* it works. This plan exists so that every future feature is also a learning unit, not just a shipped diff.

---

## How to use this doc

- Each phase has a **build output** (what gets shipped) and a **understanding checkpoint** (a test of whether I could explain it to someone else).
- Don't move to the next phase until the checkpoint is genuinely true, not just checked off.
- `docs/PROJECT.md` stays the source of truth for *what the app does*. This doc is the source of truth for *how I'm learning to build it*.

---

## Phase 0 — Make the invisible visible

**Goal:** Understand the existing codebase before extending it. You can't be intentional about a system you can't picture.

**Build output:** A new `docs/HOW_IT_WORKS.md` — a plain-English mental model of the existing repo, written in my own words (with Claude's help), covering:
- What each top-level file/folder does and why it exists
- How a request flows through the app (e.g., what happens between clicking "sign in" and landing on `/shelf`)
- What Supabase Row Level Security (RLS) is doing and why it matters even though the frontend also checks auth
- Plain-language analogies for the non-obvious pieces (e.g., middleware as a "bouncer", RLS as the database's own bouncer)

**Understanding checkpoint:** I can explain, without looking at the code, what `middleware.ts`, `lib/supabase.ts`, and the RLS policies each do and why all three exist separately instead of just one of them.

**Status:** ✅ Complete (2026-06-20)

Walked the full request-flow spine with Claude in five slices: (A) login → magic link → callback → middleware → RLS, (B) shelf rendering and the data-down/actions-up pattern, (C) search proxy + the adapter pattern for external API shapes, (D) status changes and optimistic updates, (E) full synthesis. Checkpoint passed cold: traced the status-dropdown click hop-by-hop (BookCard → MyShelf → page.tsx → Supabase) from memory, no code in front of me.

---

## Phase 0.5 — File architecture and JS/TSX literacy

**Goal:** Close a gap surfaced after Phase 0's checkpoint: I can trace *what happens* (request flow, data down/actions up) but not yet *why the code is shaped the way it is* — neither the file/folder conventions Next.js imposes, nor the JavaScript/TSX syntax those files are written in. This phase exists because behavior-tracing and syntax/structure literacy turned out to be genuinely separate kinds of understanding, not the same skill at different zoom levels.

**Why this sits between Phase 0 and Phase 1, not folded into either:** Phase 0 was deliberately about behavior, not syntax — that trade-off was made on purpose but left a real gap. Phase 1 assumes I can read a diff and follow Claude Code's reasoning; that's not realistic yet without this.

**Approach:** Combined, not sequential — file architecture and JS/TSX syntax explained together, inline, anchored to real code already in the repo (not generic tutorials). Slower pace than Phase 0. Revisit the same files from Phase 0's slices, but this time stopping on syntax (`useState`, `async/await`, destructuring, `?.`/`??`, TSX itself) and structural conventions (what makes a file a "page" vs "component" vs "route handler", what `"use client"` means and why it's only on some files, what the App Router actually is) as they appear, rather than narrating behavior past them.

**Build output:** A `docs/SYNTAX_NOTES.md` (or a section in `HOW_IT_WORKS.md`) — a running glossary of JS/TSX patterns encountered, in plain language, with the actual line from this repo as the example. Grows over time rather than being written once.

**Understanding checkpoint:** Given a small unfamiliar snippet from this repo's style (not memorized, genuinely new), I can read it aloud line by line and explain what each piece does — not just what the function accomplishes overall.

**Status:** ✅ Complete (2026-06-21)

Covered: `lib/supabase.ts` line by line; full `app/shelf/page.tsx` — `useState`/`useEffect`/`useCallback` chain (including the "build vs. call" distinction and async ordering), JSX fundamentals (`{ }`, `&&`/`||` conditional rendering, `.map()`, `key`, the `0`-is-falsy gotcha), and the plain `async function` handlers (`async`/`await`, `try`/`finally`, object destructuring, template literals, the spread operator, the ternary, the functional setter form). File/folder architecture: `app/` folder-path-equals-URL-path routing, dynamic `[segment]` routes, `page.tsx` vs `route.ts`, why `middleware.ts` sits at the project root, and why `components/`/`lib/` are convention-only (no special meaning to Next.js).

Mid-phase finding: a stacked-operator snippet (`raw?.trim() ?? ""`) initially broke down — not a reasoning failure, but a missing contrastive vocabulary for `?:` / `?.` / `??` / `!`, which look related but aren't. Built a dedicated reference table (now at the top of `SYNTAX_NOTES.md`) grouping these by resemblance rather than encounter order. Retried the same snippet afterward and read it correctly end to end, including catching a self-correction on `??`'s semantics.

**Lesson for future phases:** when several new, visually-similar operators get introduced across separate moments rather than side by side, plan a deliberate contrastive recap before relying on them in combination — don't assume isolated correct usage means the symbols are securely distinguished from each other yet.

---

## Phase 1 — Working agreement with Claude Code

**Goal:** Make "explain as you build" the *default* behavior of every Claude Code session, not something I have to remember to ask for each time.

**Build output:** Updated `AGENTS.md` with rules that:
- Require Claude Code to state its approach and reasoning in plain language *before* implementing a non-trivial change
- Require a short Build Log entry appended to `docs/PROJECT.md` after each session (already informally happening — formalize it)
- Require new concepts/patterns/libraries to be flagged explicitly when first introduced, with a one-line explanation
- Bias toward boring, explainable solutions over clever ones, given the explicit goal of learning while building

**Understanding checkpoint:** I run one small change through Claude Code and the session unprompted (a) explains its approach first, (b) flags anything new, and (c) updates the Build Log — without me asking.

**Status:** 🟡 Build output complete, checkpoint pending

`AGENTS.md` updated with a `learning-mode-rules` block: explain-before-coding, calibrate against `LEARNING_PLAN.md`/`SYNTAX_NOTES.md`, prefer boring/explainable solutions, flag new syntax *and* new combinations of familiar syntax (direct lesson from the Phase 0.5 `?.`/`??` stumble), don't silently introduce new libraries, Build Log entries after non-trivial changes, flag (don't auto-edit) `HOW_IT_WORKS.md` staleness, and don't silently fix drive-by bugs — flag and ask first. A "non-trivial" carve-out excludes mechanical changes (typos, formatting, styling-only tweaks) from the ceremony.

Checkpoint not yet run — requires an actual Claude Code session on a real change to confirm the rules are followed unprompted, which can't be verified from inside this conversation. Next time Claude Code is used for a real change, check whether all three behaviors fire without being asked.

---

## Phase 2 — Re-scope the next feature as a learning unit

**Goal:** Establish the repeatable loop for every feature from here on: design → build → read → integrate.

**Candidate feature:** Per-book reading journal/notes (already scoped as "next" in `docs/PROJECT.md`).

**The loop (repeat for every feature going forward):**
1. **Design on paper first** — sketch the data model (new table? new columns? new RLS policy?) and the user flow, before any code is written. This is where I get to push back, ask "why this shape and not another," and build the muscle of thinking in data models.
2. **Build** — Claude Code implements it, following the Phase 1 working agreement.
3. **Read the diff together** — before merging, walk through what changed and why.
4. **Explain it back** — I summarize, in my own words, what the feature does end-to-end. If I can't, that's a signal to slow down, not skip ahead.
5. **Update the mental model doc** — add any new concept introduced to `docs/HOW_IT_WORKS.md`.

**Understanding checkpoint:** For the journal feature specifically, I can explain the data model decisions I made (not just what Claude Code chose) and why.

**Status:** ⬜ Not started

---

## Phase 3 — Production hygiene

**Goal:** Address the unglamorous parts a demo skips but a real product needs.

**Build output (work through as relevant, not necessarily in order):**
- [ ] Confirm environment variable / secrets handling is correct and I understand what each variable is for
- [ ] Add error handling for the non-happy-path (e.g., Google Books API is down or rate-limited)
- [ ] Set up a basic deploy pipeline (Vercel is the natural fit for Next.js) and understand what "deploying" actually does step by step
- [ ] Add lightweight testing — not full TDD, just enough coverage that I trust a change hasn't silently broken the shelf

**Understanding checkpoint:** I can explain what happens, end to end, from `git push` to the live app updating — and what would break if a step were skipped.

**Status:** ⬜ Not started

---

## Open questions / parking lot

*(Things noted along the way that don't block the current phase but shouldn't be forgotten.)*

- **Bug found during Phase 0, Slice D:** `handleStatusChange` in `app/shelf/page.tsx` has no error check on the Supabase `.update()` call before optimistically patching local state. If the write silently fails, the UI briefly shows the *correct* new status, then silently reverts to the old one on next page load/refresh — with no error message at any point. Worth fixing as part of Phase 3 (production hygiene), or as a small standalone Phase 2-style trial run if I want hands-on practice sooner.

---

## Build log

*(Append a dated entry each time a phase or sub-step completes — mirrors the Build Log style already used in `docs/PROJECT.md`.)*

- **2026-06-20** — Plan created.
- **2026-06-20** — Phase 0 complete. Walked the full app via request-flow tracing (auth → shelf render → search/add → status change → synthesis). Found and logged a real bug (silent optimistic-update failure) while tracing Slice D — caught it myself during the explain-back checkpoint, not handed to me.
- **2026-06-20** — Added Phase 0.5. Post-Phase-0 reflection surfaced a real gap: request-flow tracing didn't build file-architecture or JS/TSX syntax literacy. Inserted as its own phase rather than retrofitting Phase 0, since it's a genuinely different skill.
- **2026-06-21** — Phase 0.5 session 1. Covered `lib/supabase.ts` fully; `useState`/`useEffect`/`useCallback` chain in `app/shelf/page.tsx` (multiple corrected passes before landing the full async sequence cleanly — including a self-caught filtering error during the MyShelf trace); JSX fundamentals (`{ }`, `&&` conditional rendering, `.map()`, `key`). Created `docs/SYNTAX_NOTES.md` as the running glossary called for in the phase's build output.
- **2026-06-21** — Phase 0.5 complete. Covered plain async function handlers, full file/folder architecture (routing, dynamic segments, page.tsx vs route.ts, middleware/components/lib placement). Checkpoint snippet initially exposed a real gap — stacked unfamiliar operators (`?.`, `??`) read incorrectly on first attempt despite each being understood in isolation. Built a contrastive operator reference table to fix it; retried the same checkpoint snippet and passed cleanly.
- **2026-06-21** — Phase 1 build output complete. Updated `AGENTS.md` with a learning-mode rules block covering explain-before-coding, doc-calibrated explanations, boring-over-clever bias, new-syntax *and* new-combination flagging, no silent dependency additions, Build Log discipline, and flag-don't-fix-silently for drive-by bugs. Checkpoint itself still pending a real Claude Code session.
