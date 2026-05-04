"use client";

import { SearchResult } from "@/lib/types";
import { BookCard } from "./BookCard";

interface SearchResultsProps {
  results: SearchResult[];
  savedIds: Set<string>;
  addingId: string | null;
  onAdd: (book: SearchResult) => void;
}

export function SearchResults({ results, savedIds, addingId, onAdd }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Search results
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onAdd={() => onAdd(book)}
            adding={addingId === book.id}
            saved={savedIds.has(book.id)}
          />
        ))}
      </div>
    </section>
  );
}
