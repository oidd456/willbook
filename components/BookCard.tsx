"use client";

import Image from "next/image";
import { SearchResult } from "@/lib/types";

interface BookCardProps {
  book: SearchResult;
  onAdd?: () => void;
  adding?: boolean;
  saved?: boolean;
}

export function BookCard({ book, onAdd, adding, saved }: BookCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 p-3 bg-white shadow-sm">
      <div className="relative h-40 w-full bg-gray-100 rounded-md overflow-hidden">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            No cover
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
        <p className="text-sm font-semibold leading-tight line-clamp-2 text-gray-900">{book.title}</p>
        <p className="text-xs text-gray-700 line-clamp-1">{book.author}</p>
        {book.page_count && (
          <p className="text-xs text-gray-500">{book.page_count} pages</p>
        )}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          disabled={adding || saved}
          className="mt-auto w-full rounded-lg border border-gray-900 bg-gray-900 text-white py-1.5 text-xs font-medium disabled:opacity-50 hover:bg-gray-700 hover:border-gray-700 transition-colors"
        >
          {saved ? "Saved" : adding ? "Adding…" : "Add to Shelf"}
        </button>
      )}
    </div>
  );
}
