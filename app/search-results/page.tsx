// app/search-results/page.tsx
import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center mt-16 text-center text-gray-600">
          <Image
            src="/not-found.svg"
            alt="No results"
            width={208}
            height={208}
            className="mb-6 opacity-80"
          />
          <h2 className="text-xl font-semibold mb-2">Loading search results...</h2>
          <p className="mb-4">
            Please wait while we fetch your results.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
