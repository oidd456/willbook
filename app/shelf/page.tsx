"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Book, ReadingProgress, ReadingStatus, SearchResult } from "@/lib/types";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { MyShelf } from "@/components/MyShelf";
import { Toast } from "@/components/Toast";

export default function BookShelfPage() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [shelf, setShelf] = useState<Book[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [addingId, setAddingId] = useState<string | null>(null);

  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const [toast, setToast] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  const loadShelf = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", userId)
      .order("added_at", { ascending: false });
    if (data) {
      setShelf(data as Book[]);
      setSavedIds(new Set(data.map((b: Book) => b.google_books_id)));
    }

    const { data: progressData } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", userId)
      .order("logged_at", { ascending: true });
    if (progressData) {
      const map: Record<string, number> = {};
      for (const row of progressData as ReadingProgress[]) {
        map[row.book_id] = row.page;
      }
      setProgressMap(map);
    }
  }, [userId]);

  useEffect(() => {
    loadShelf();
  }, [loadShelf]);

  async function handleSearch(query: string) {
    setSearching(true);
    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } finally {
      setSearching(false);
    }
  }

  async function handleAdd(book: SearchResult) {
    if (!userId || savedIds.has(book.id)) return;
    setAddingId(book.id);
    const { error } = await supabase.from("books").insert({
      user_id: userId,
      google_books_id: book.id,
      title: book.title,
      author: book.author,
      cover_url: book.cover_url,
      page_count: book.page_count,
    });
    if (!error) {
      await loadShelf();
      setToast(`"${book.title}" added to your shelf`);
    }
    setAddingId(null);
  }

  async function handleStatusChange(bookId: string, status: ReadingStatus) {
    const { error } = await supabase.from("books").update({ status }).eq("id", bookId);
    if (error) {
      setToast("Failed to update reading status — please try again");
      return;
    }
    setShelf((prev) => prev.map((b) => (b.id === bookId ? { ...b, status } : b)));
  }

  async function handleProgressUpdate(bookId: string, page: number) {
    if (!userId) return;
    const { error } = await supabase.from("reading_progress").insert({
      book_id: bookId,
      user_id: userId,
      page,
    });
    if (error) {
      setToast("Failed to update progress — please try again");
      return;
    }
    setProgressMap((prev) => ({ ...prev, [bookId]: page }));
    setToast("Progress updated");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Book Shelf</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar onSearch={handleSearch} loading={searching} />
        {searchResults.length > 0 && (
          <button
            onClick={() => setSearchResults([])}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
          >
            Clear results
          </button>
        )}
      </div>

      <SearchResults
        results={searchResults}
        savedIds={savedIds}
        addingId={addingId}
        onAdd={handleAdd}
      />

      <MyShelf books={shelf} onStatusChange={handleStatusChange} progressMap={progressMap} onProgressUpdate={handleProgressUpdate} />

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </main>
  );
}
