<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:learning-mode-rules -->
# Learning mode — this is a learning project, not just a build target

Osh (the person you're working with) is building this app as a deliberate learning exercise, not just trying to ship features fast. They have a Python/data-science background, basic HTML/CSS, and no prior JavaScript/TypeScript/software-engineering experience. The goal of every session is for Osh to understand *why* the code works, not just see it deployed. Follow these rules by default, without being asked, in every session.

## Before writing any non-trivial code change

1. **State your approach in plain language first**, before writing the code. A few sentences: what you're about to do, and why this approach over an obvious alternative (if one exists). This isn't a formal design doc — just enough that Osh could object or ask a question before the change exists, not after.
2. **Check `docs/LEARNING_PLAN.md` and `docs/SYNTAX_NOTES.md` first** to calibrate what Osh already knows. Don't re-explain concepts already marked covered in those docs (e.g. `useState`/`useEffect`/`useCallback`, JSX conditionals, the file-routing model) as if they were brand new — that reads as patronizing. Do flag anything genuinely outside what those docs cover.
3. **Prefer the boring, explainable solution over the clever one.** If there are two reasonable ways to implement something, default to whichever one is easier to explain and trace, even if it's marginally less elegant or slightly more verbose. Optimize for "Osh can read this in six months and still understand it," not for idiomatic minimalism.

## When introducing something new

4. **Flag new syntax or concepts explicitly** when first introduced in a session — name it, one line on what it does, and (when relevant) point to where it's similar to or different from something already in `docs/SYNTAX_NOTES.md`.
5. **Flag new *combinations* of familiar pieces, not just brand-new syntax.** Individually-known operators or patterns used together for the first time (e.g. optional chaining combined with nullish coalescing, a hook combined with a new dependency pattern) are a real, separate failure mode — Osh has hit this before. Don't assume "they've seen `?.` and they've seen `??`" means "they'll parse `?.` and `??` together correctly on first read." Call out the combination specifically.
6. **Don't silently introduce a new library, pattern, or dependency.** If you reach for something not already used in this repo, say so and give a one-line reason it was the right tool here, before using it.

## After a non-trivial change

7. **Append a short Build Log entry to `docs/PROJECT.md`** (matching the existing Session 1 / Session 2 format already in that file) — what changed and why, two to four lines.
8. **If the change touches request flow, data model, or architecture in a way `docs/HOW_IT_WORKS.md` describes, flag that the doc may need a corresponding update** — don't edit it automatically without being asked, just note it.

## What "non-trivial" means here

Skip the above ceremony for genuinely mechanical changes — typo fixes, formatting, renaming a variable, adjusting Tailwind classes for styling only. Apply it for anything that changes behavior, introduces a new pattern, touches the data model, or adds a new file.

## If a real bug or gap is discovered while working (not part of the current task)

Don't silently fix it inline as a drive-by change. Flag it, briefly explain what's wrong and why, and ask whether to fix it now or log it in the Parking Lot section of `docs/LEARNING_PLAN.md` for later. (See the existing optimistic-update bug entry there for the expected format.)
<!-- END:learning-mode-rules -->
