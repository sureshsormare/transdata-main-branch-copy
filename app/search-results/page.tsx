"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    const fetchResults = async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    };

    fetchResults();
  }, [q]);

  // Aggregate statistics
  const summary = useMemo(() => {
    const buyers = new Set();
    const suppliers = new Set();
    let totalQty = 0;

    for (const item of results) {
      if (item.buyer_name) buyers.add(item.buyer_name.trim());
      if (item.supplier_name) suppliers.add(item.supplier_name.trim());

      const qty = parseFloat(item.quantity?.replace(/,/g, "") || "0");
      totalQty += isNaN(qty) ? 0 : qty;
    }

    return {
      total: results.length,
      uniqueBuyers: buyers.size,
      uniqueSuppliers: suppliers.size,
      totalQuantity: totalQty.toLocaleString(),
    };
  }, [results]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Search Results for: <span className="text-blue-600">{q}</span>
      </h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {!loading && results.length > 0 && (
        <>
          {/* Summary Box */}
          {/* Redesigned Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <p className="text-sm">Total Records</p>
              <p className="text-2xl font-bold mt-1">{summary.total}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <p className="text-sm">Unique Buyers</p>
              <p className="text-2xl font-bold mt-1">{summary.uniqueBuyers}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <p className="text-sm">Unique Suppliers</p>
              <p className="text-2xl font-bold mt-1">
                {summary.uniqueSuppliers}
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <p className="text-sm">Total Quantity</p>
              <p className="text-2xl font-bold mt-1">{summary.totalQuantity}</p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-5 transition-transform transform hover:scale-[1.02] hover:shadow-xl"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {item.product_description || "No Description"}
                </h2>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>HS Code:</strong> {item.hs_code || "N/A"}
                  </p>
                  <p>
                    <strong>Buyer:</strong> {item.buyer_name || "N/A"}
                  </p>
                  <p>
                    <strong>Supplier:</strong> {item.supplier_name || "N/A"}
                  </p>
                  <p>
                    <strong>Invoice No:</strong> {item.invoice_no || "N/A"}
                  </p>
                  <p>
                    <strong>Country:</strong>{" "}
                    {item.country_of_destination || "N/A"}
                  </p>
                  <p>
                    <strong>Shipping Bill:</strong>{" "}
                    {item.shipping_bill_no || "N/A"} on{" "}
                    {item.shipping_bill_date || "N/A"}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity || "N/A"}{" "}
                    {item.uqc || ""}
                  </p>
                  <p>
                    <strong>Total USD:</strong> ${item.total_value_usd || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Login prompt button for more */}
          <div className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Login to See More Details
            </Link>
          </div>
        </>
      )}

      {!loading && results.length === 0 && q && (
        <div className="flex flex-col items-center justify-center mt-16 text-center text-gray-600">
          <img
            src="/not-found.svg"
            alt="No results"
            className="w-52 h-52 mb-6 opacity-80"
          />
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="mb-4">
            We couldn't find anything matching <strong>{q}</strong>. Try
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
