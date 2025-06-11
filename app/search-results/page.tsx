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
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="mb-4">
            Try checking your spelling or searching something else.
          </p>
          <Link
            href='/'
            className='px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            Back to Home
          </Link>
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
