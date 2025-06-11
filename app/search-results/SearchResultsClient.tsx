"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const q = searchParams.get("q") ?? "";

  const [results, setResults] = useState<ExportData[]>([]);
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 rounded-xl shadow">
              <p className="text-sm">Records</p>
              <h2 className="text-xl font-bold">{results.length}</h2>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-4 rounded-xl shadow">
              <p className="text-sm">Unique Buyers</p>
              <h2 className="text-xl font-bold">
                {new Set(results.map((r) => r.buyer_name)).size}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-4 rounded-xl shadow">
              <p className="text-sm">Unique Suppliers</p>
              <h2 className="text-xl font-bold">
                {new Set(results.map((r) => r.supplier_name)).size}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-700 text-white p-4 rounded-xl shadow">
              <p className="text-sm">Total USD</p>
              <h2 className="text-xl font-bold">
                $
                {results
                  .reduce(
                    (sum, r) => sum + parseFloat(r.total_value_usd || "0"),
                    0
                  )
                  .toFixed(2)}
              </h2>
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
                  <p>
                    <strong>Port:</strong> {item.port_of_destination || "N/A"}
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
