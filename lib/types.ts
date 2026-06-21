export type ReadingStatus = 'to_read' | 'currently_reading' | 'read';

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  to_read: 'To Read',
  currently_reading: 'Currently Reading',
  read: 'Read',
};

export interface Book {
  id: string;
  user_id: string;
  google_books_id: string;
  title: string;
  author: string;
  cover_url: string | null;
  page_count: number | null;
  added_at: string;
  status: ReadingStatus;
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

export interface ReadingProgress {
  id: string;
  book_id: string;
  user_id: string;
  page: number;
  note: string | null;
  logged_at: string;
}

export interface SearchResult {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  page_count: number | null;
}
