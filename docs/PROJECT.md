# willbook — Project Context

## Vision

A book discovery and journaling app that makes it easy for readers to find books they love, build a personal shelf, and track their reading life.

## Core MVP Scope

1. **Book search** — find books via Google Books API
2. **Personal shelf** — save books to your account
3. **Reading status** — categorize books as "To Read", "Currently Reading", or "Read"
4. **Collections view** — see books grouped by status

Post-MVP (not yet started):
- Per-book reading journal / notes
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
