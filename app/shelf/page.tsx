"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Book, SearchResult } from "@/lib/types";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "@/components/SearchResults";
import { MyShelf } from "@/components/MyShelf";
import { Toast } from "@/components/Toast";

export default function BookShelfPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [shelf, setShelf] = useState<Book[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [addingId, setAddingId] = useState<string | null>(null);

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

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
      <h1 className="text-2xl font-bold">My Book Shelf</h1>

      <SearchBar onSearch={handleSearch} loading={searching} />

      <SearchResults
        results={searchResults}
        savedIds={savedIds}
        addingId={addingId}
        onAdd={handleAdd}
      />

      <MyShelf books={shelf} />

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </main>
  );
}
