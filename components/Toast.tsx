"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm">
      {message}
    </div>
  );
}
