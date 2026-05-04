export interface Book {
  id: string;
  user_id: string;
  google_books_id: string;
  title: string;
  author: string;
  cover_url: string | null;
  page_count: number | null;
  added_at: string;
}

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
    pageCount?: number;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  page_count: number | null;
}
