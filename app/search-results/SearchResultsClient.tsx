"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface ExportData {
  id: string;
  buyer_address?: string;
  buyer_city_state?: string;
  buyer_contact_no?: string;
  buyer_email_id?: string;
  buyer_name?: string;
  chapter?: string;
  country_of_destination?: string;
  country_of_origin?: string;
  currency?: string;
  cush?: string;
  drawback?: string;
  exchange_rate_usd?: string;
  exporter_pin?: string;
  hs_code?: string;
  iec?: string;
  incoterm?: string;
  incoterm_value?: string;
  invoice_no?: string;
  invoice_serial_number?: string;
  item_number?: string;
  item_rate?: string;
  mode?: string;
  month?: string;
  port_code?: string;
  port_of_destination?: string;
  port_of_origin?: string;
  product_description?: string;
  quantity?: string;
  shipping_bill_date?: string;
  shipping_bill_no?: string;
  state?: string;
  supplier_address?: string;
  supplier_city_state?: string;
  supplier_contact_no?: string;
  supplier_email_id?: string;
  supplier_name?: string;
  total_amount_fc?: string;
  total_value_usd?: string;
  unit_rate_usd?: string;
  unit_value_inr?: string;
  uqc?: string;
  year?: string;
}

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";

  const [results, setResults] = useState<ExportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    if (!q) return;

    const fetchResults = async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      let resultsArray = Array.isArray(data) ? data : data.results;

      if (Array.isArray(resultsArray)) {
        // Sort by year descending (most recent first)
        resultsArray = resultsArray.sort((a: ExportData, b: ExportData) => {
          const yearA = Number(a.year) || 0;
          const yearB = Number(b.year) || 0;
          return yearB - yearA;
        });
        setResults(resultsArray);
      } else {
        setResults([]);
      }

      setLoading(false);
    };

    fetchResults();
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(
        `/search-results?q=${encodeURIComponent(searchInput.trim())}`
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Search Results for: <span className="text-blue-600">{q}</span>
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search again..."
          className="flex-1 px-4 py-2 border border-blue-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-r-full font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && results.length > 0 && (
        <>
          {/* Summary Box */}
          {/* Redesigned Summary Box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center justify-between bg-gradient-to-br bg-blue-200 text-blue-700 hover:bg-blue-300 hover:cursor-pointer p-4 rounded-xl shadow">
              <p className="text-base font-semibold">Records</p>
              <h2 className="text-2xl font-bold">{results.length}</h2>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-br bg-blue-200 text-blue-700 hover:bg-blue-300 hover:cursor-pointer p-4 rounded-xl shadow">
              <p className="text-base font-semibold">Unique Buyers</p>
              <h2 className="text-2xl font-bold">
                {new Set(results.map((r) => r.buyer_name)).size}
              </h2>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-br bg-blue-200 text-blue-700 hover:bg-blue-300 hover:cursor-pointer p-4 rounded-xl shadow">
              <p className="text-base font-semibold">Unique Suppliers</p>
              <h2 className="text-2xl font-bold">
                {new Set(results.map((r) => r.supplier_name)).size}
              </h2>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-br bg-blue-200 text-blue-700 hover:bg-blue-300 hover: p-4 rounded-xl shadow">
              <p className="text-base font-semibold">Total USD</p>
              <h2 className="text-2xl font-bold">
                $
                {results
                  .reduce(
                    (sum, r) => sum + parseFloat(r.total_value_usd || "0"),
                    0
                  )
                  .toFixed(0)}
              </h2>
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-2 hover:cursor-pointer">
            {results.map((item, idx) => (
              <div
                key={item.id}
                className="relative group block p-2 h-full w-full"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-zinc-500/20 dark:bg-slate-800/[0.8] block rounded-3xl"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <div className="relative bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 flex flex-col gap-2 transition group z-10">
                  {/* Product Description */}
                  <h2 className="text-lg font-bold mb-2 text-blue-900 group-hover:text-blue-700 transition h-24">
                    {item.product_description || "No Description"}
                  </h2>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold">
                        {" "}
                        Shipping Bill Date:
                      </span>{" "}
                      {item.shipping_bill_date || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold"> HS Code:</span>{" "}
                      {item.hs_code || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold"> Buyer:</span>{" "}
                      {item.buyer_name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold"> Supplier:</span>{" "}
                      {item.supplier_name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold"> Country of Origin:</span>{" "}
                      {item.country_of_origin || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {" "}
                        Country of Destination:
                      </span>{" "}
                      {item.country_of_destination || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold"> Quantity:</span>{" "}
                      {item.quantity || "N/A"} {item.uqc || ""}
                    </p>
                    <p>
                      <span className="font-semibold"> Total Value (USD):</span>{" "}
                      ${item.total_value_usd || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold"> Unit Rate (USD):</span> $
                      {item.unit_rate_usd || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold"> Mode:</span>{" "}
                      {item.mode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Login prompt button for more */}
          <div className="flex flex-col items-center justify-center mt-16 gap-3 text-center text-gray-600">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Login to See More Details
            </Link>
            <Link
              href="/"
              className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </>
      )}

      {!loading && results.length === 0 && q && (
        <div className="flex flex-col items-center justify-center mt-16 text-center text-gray-600">
          <Image
            src="/not-found.svg"
            alt="No results"
            width={208}
            height={208}
            className="mb-6 opacity-80"
          />
          <h2 className="text-xl font-semibold mb-2">
            No results found for {q}
          </h2>
          <p className="mb-4">
            We couldn&rsquo;t find anything matching <strong>{q}</strong>. Try
            checking your spelling or searching something else.
          </p>
          <Link
            href="/"
            className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
