"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ReadingStatus, SearchResult, STATUS_LABELS } from "@/lib/types";

interface BookCardProps {
  book: SearchResult;
  onAdd?: () => void;
  adding?: boolean;
  saved?: boolean;
  status?: ReadingStatus;
  onStatusChange?: (status: ReadingStatus) => void;
  currentPage?: number;
  onProgressUpdate?: (page: number) => void;
}

export function BookCard({ book, onAdd, adding, saved, status, onStatusChange, currentPage, onProgressUpdate }: BookCardProps) {
  const [inputPage, setInputPage] = useState<string>(currentPage ? String(currentPage) : "");

  useEffect(() => {
    setInputPage(currentPage ? String(currentPage) : "");
  }, [currentPage]);

  function handleUpdate() {
    const page = parseInt(inputPage, 10);
    if (!page || page < 1) return;
    onProgressUpdate?.(page);
  }

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
      {status === "currently_reading" && onProgressUpdate && (
        <div className="flex flex-col gap-1.5">
          {currentPage && book.page_count && (
            <p className="text-xs text-gray-500">
              Page {currentPage} of {book.page_count} ({Math.round((currentPage / book.page_count) * 100)}%)
            </p>
          )}
          <div className="flex gap-1">
            <input
              type="number"
              min={1}
              max={book.page_count ?? undefined}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              placeholder="Page"
              className="w-16 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 py-1.5 px-2 text-xs"
            />
            <button
              onClick={handleUpdate}
              disabled={!inputPage}
              className="flex-1 rounded-lg border border-gray-900 bg-gray-900 text-white py-1.5 text-xs font-medium disabled:opacity-50 hover:bg-gray-700 hover:border-gray-700 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      )}
      {status && onStatusChange && (
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ReadingStatus)}
          className="mt-auto w-full rounded-lg border border-gray-200 bg-gray-50 text-gray-700 py-1.5 text-xs font-medium cursor-pointer hover:border-gray-400 transition-colors"
        >
          {(Object.keys(STATUS_LABELS) as ReadingStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      )}
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
