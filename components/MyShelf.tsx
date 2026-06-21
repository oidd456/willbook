"use client";

import { Book, ReadingStatus, STATUS_LABELS } from "@/lib/types";
import { BookCard } from "./BookCard";

interface MyShelfProps {
  books: Book[];
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  progressMap: Record<string, number>;
  onProgressUpdate: (bookId: string, page: number) => void;
}

const SECTION_ORDER: ReadingStatus[] = ['currently_reading', 'to_read', 'read'];

export function MyShelf({ books, onStatusChange, progressMap, onProgressUpdate }: MyShelfProps) {
  if (books.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          My shelf
        </h2>
        <div className="flex items-center justify-center h-40 rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm">
          First book incoming
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      {SECTION_ORDER.map((status) => {
        const section = books.filter((b) => b.status === status);
        if (section.length === 0) return null;
        return (
          <div key={status}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {STATUS_LABELS[status]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {section.map((book) => (
                <BookCard
                  key={book.id}
                  book={{
                    id: book.google_books_id,
                    title: book.title,
                    author: book.author,
                    cover_url: book.cover_url,
                    page_count: book.page_count,
                  }}
                  status={book.status}
                  onStatusChange={(s) => onStatusChange(book.id, s)}
                  currentPage={progressMap[book.id]}
                  onProgressUpdate={(page) => onProgressUpdate(book.id, page)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
