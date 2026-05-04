"use client";

import { Book } from "@/lib/types";
import { BookCard } from "./BookCard";

interface MyShelfProps {
  books: Book[];
}

export function MyShelf({ books }: MyShelfProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        My shelf
      </h2>
      {books.length === 0 ? (
        <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm">
          First book incoming
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={{
                id: book.google_books_id,
                title: book.title,
                author: book.author,
                cover_url: book.cover_url,
                page_count: book.page_count,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
