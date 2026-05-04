"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search books…"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
