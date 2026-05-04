import { NextRequest, NextResponse } from "next/server";
import { SearchResult } from "@/lib/types";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query?.trim()) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", "12");
  if (apiKey) url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    return NextResponse.json({ error: "Google Books request failed" }, { status: 502 });
  }

  const data = await res.json();
  const items: SearchResult[] = (data.items ?? []).map((v: any) => ({
    id: v.id,
    title: v.volumeInfo.title ?? "Unknown title",
    author: (v.volumeInfo.authors ?? []).join(", ") || "Unknown author",
    cover_url: v.volumeInfo.imageLinks?.thumbnail ?? null,
    page_count: v.volumeInfo.pageCount ?? null,
  }));

  return NextResponse.json(items);
}
