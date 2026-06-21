# willbook — Project Context

## Vision

A book discovery and journaling app that makes it easy for readers to find books they love, build a personal shelf, and track their reading life.

## Core MVP Scope

1. **Book search** — find books via Google Books API
2. **Personal shelf** — save books to your account
3. **Reading status** — categorize books as "To Read", "Currently Reading", or "Read"
4. **Collections view** — see books grouped by status

Post-MVP:
- **Page-level reading progress tracking** *(next up — designed, not yet built)*: log the page you're on for any `currently_reading` book, enabling a progress percentage using `books.page_count`. Designed as a separate `reading_progress` history table — see Data Model below.
- **Per-book journal / notes** *(deferred)*: expected to become a natural extension of the `reading_progress` table (a richer note alongside a progress update), rather than a separate feature. Not the next thing.
- Richer discovery features (recommendations, genres, ratings)

## Tech Stack

- **Framework**: Next.js (App Router)
- **Auth**: Supabase magic link auth
- **Database**: Supabase (Postgres)
- **Book data**: Google Books API
- **Styling**: Tailwind CSS

## Data Model

### `books` table
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| google_books_id | text | unique per user |
| title | text | |
| author | text | |
| cover_url | text | nullable |
| page_count | integer | nullable |
| status | text | `to_read` \| `currently_reading` \| `read`, default `to_read` |
| added_at | timestamptz | |

RLS: users can only read/insert/update/delete their own rows.

### `reading_progress` table *(designed, not yet implemented)*
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| book_id | uuid | FK → books.id |
| user_id | uuid | FK → auth.users |
| page | integer | the page reached at this log entry |
| note | text | nullable — optional reflection alongside the update |
| logged_at | timestamptz | when this entry was recorded |

RLS: same pattern as `books` — restricted to `auth.uid() = user_id`, checked directly on this table (not via a join to `books`).

Design decisions:
- **Page-based, not chapter-based** — lets us compute a percentage using the existing `books.page_count`.
- **History table, not a single column on `books`** — tracking progress *over time* was a deliberate choice; multiple rows per book, one per logged update.
- **`user_id` duplicated here, not inferred via join** — keeps RLS self-contained, matching the `books` pattern.
- **`note` is nullable** — most updates will be quick page bumps with no commentary.
- **MVP display: latest progress only, no history view** — show the most recent row per book on the existing BookCard. "Latest per book" will be computed in application code (fetch all rows, find the latest per book in JS), not via a SQL window function — a deliberate "boring and explainable" choice.

## File Structure

```
app/
  page.tsx              — root redirect
  shelf/page.tsx        — main shelf page (authed)
  login/page.tsx        — magic link login
  auth/callback/route.ts — auth callback handler
  api/books/search/     — Google Books search proxy
components/
  BookCard.tsx          — single book card (search + shelf variant)
  MyShelf.tsx           — shelf split into status sections
  SearchBar.tsx         — search input
  SearchResults.tsx     — search result grid
  Toast.tsx             — notification toast
lib/
  supabase.ts           — browser Supabase client
  types.ts              — shared TypeScript types
middleware.ts           — route protection
supabase/migration.sql  — full DB schema
```

## Build Log

### Session 1
- Initial Next.js + Supabase scaffold
- Magic link auth with route protection
- Google Books search API route
- Add books to a flat shelf (no categories)

### Session 2
- Added `status` column to `books` table (`to_read | currently_reading | read`)
- Added UPDATE RLS policy
- Added `ReadingStatus` type and `STATUS_LABELS` to `lib/types.ts`
- `BookCard` now shows a status `<select>` dropdown when rendered on the shelf
- `MyShelf` now groups books into three sections: Currently Reading → To Read → Read (empty sections hidden)
- Status changes are persisted to Supabase and updated optimistically in local state

### Session 4
- Added page-level reading progress tracking for `currently_reading` books
- Created `reading_progress` table in Supabase (history table — one row per update, not a single column on `books`) with RLS restricted to the owning user
- Added `ReadingProgress` type to `lib/types.ts`; added `progressMap` state (`Record<string, number>`) to shelf page, populated by fetching all progress rows and reducing to latest-per-book in JS
- `BookCard` now shows a controlled page number input + Update button for `currently_reading` books, plus a "Page X of Y (Z%)" display once progress exists; `handleProgressUpdate` inserts a new row and updates local state on success

### Session 3
- Fixed bug in `handleStatusChange` (`app/shelf/page.tsx`): now checks the error returned by Supabase `.update()` before patching local state. Previously a failed write would silently show the wrong status until the next page load. On error, a toast is now shown and local state is left unchanged.
- Fixed low-contrast email input text on login page: added `text-gray-900` to the input's Tailwind classes.
- Added "Clear results" button to shelf page: appears next to the search bar when results are showing, sets `searchResults` to `[]` on click.
