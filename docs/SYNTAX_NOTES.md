# Syntax Notes

A running glossary of JS/TSX/TypeScript patterns encountered while building willbook. Each entry is anchored to a real line from this repo. Grows over time — not written once.

---

## Operator quick-reference (visually similar, unrelated meanings)

| Symbol | Name | Meaning | Example |
|---|---|---|---|
| `?.` | Optional chaining | Access a property only if the thing isn't null/undefined | `v.volumeInfo.imageLinks?.thumbnail` |
| `??` | Nullish coalescing | Use the right side if the left is null or undefined | `pageCount ?? null` |
| `?:` | Ternary | If/else in one expression | `saved ? "Saved" : "Add to Shelf"` |
| `?` on a property | Optional property | This field doesn't have to be provided | `onAdd?: () => void` |
| `?` on a parameter | Optional parameter | This argument doesn't have to be passed | `function foo(x?: string)` |
| `!` | Non-null assertion | "Trust me, this isn't null" (TypeScript only) | `process.env.NEXT_PUBLIC_SUPABASE_URL!` |

---

## Topic 1 — The module system

**Covered:** 2026-06-22

Every file is a module. Everything inside a file is private by default. You explicitly share things with `export` and explicitly consume them with `import`.

### Named export
```ts
// lib/types.ts
export interface Book { ... }
export const STATUS_LABELS = { ... }
```
A file can have many named exports. The names are fixed — importers must use the same name.

### Default export
```ts
// app/shelf/page.tsx
export default function BookShelfPage() { ... }
```
A file can have only one default export. The importer can name it anything.

### Named import
```ts
import { Book, ReadingStatus } from "@/lib/types";
```
Curly braces = named import. Names must match what was exported.

### Default import
```ts
import BookShelfPage from "@/app/shelf/page";
```
No curly braces = default import. Name is yours to choose.

### `import type`
```ts
import type { NextRequest } from "next/server";
```
TypeScript-only import — stripped out before the code runs. Used for types that don't exist at runtime.

### The three path forms

| Form | Example | Points to |
|---|---|---|
| `./` or `../` | `"./BookCard"` | A file you wrote, relative to this file |
| `@/` | `"@/lib/types"` | A file you wrote, from the project root |
| No prefix | `"next/server"`, `"react"` | An external package in `node_modules` |

### Scoped packages
```ts
import { createServerClient } from "@supabase/ssr";
```
The `@supabase/` prefix is an npm organisation name — part of the package name, not a path shortcut. Unrelated to the `@/` project-root shortcut.
