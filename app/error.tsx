"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>

      <p className="text-gray-500">
        An unexpected error occurred. Please try again. ({error.message})
      </p>

      <button onClick={reset} className="px-4 py-2 bg-black text-white rounded">
        Goi
      </button>
    </div>
  );
}
