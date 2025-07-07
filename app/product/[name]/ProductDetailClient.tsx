"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

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

interface ProductDetailClientProps {
  productName: string;
}

export default function ProductDetailClient({ productName }: ProductDetailClientProps) {
  const router = useRouter();
  const [results, setResults] = useState<ExportData[]>([]);
  const [aggregates, setAggregates] = useState({
    totalRecords: 0,
    uniqueBuyers: 0,
    uniqueSuppliers: 0,
    totalValueUSD: 0,
  });
  const [loading, setLoading] = useState(true);
  const [countryStats, setCountryStats] = useState({
    topImportCountries: [] as Array<{ country: string; count: number }>,
    topExportCountries: [] as Array<{ country: string; count: number }>,
    topUniqueExporters: [] as Array<{ exporter: string; count: number }>,
    topUniqueImporters: [] as Array<{ importer: string; count: number }>,
  });
  const [monthlyStats, setMonthlyStats] = useState<Array<{ month: string; value: number; count: number }>>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('q', productName);
      
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      
      if (data.results && Array.isArray(data.results)) {
        const resultsArray = data.results.sort((a: ExportData, b: ExportData) => {
          const yearA = Number(a.year) || 0;
          const yearB = Number(b.year) || 0;
          return yearB - yearA;
        });
        setResults(resultsArray);
        
        if (data.aggregates) {
          setAggregates(data.aggregates);
        }
        
        if (data.countryStats) {
          setCountryStats(data.countryStats);
        }

        if (data.monthlyStats) {
          setMonthlyStats(data.monthlyStats);
        }
      }

      setLoading(false);
    };

    fetchProductData();
  }, [productName]);

  const formatCurrency = (value: string) => {
    const num = parseFloat(value || "0");
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const generateSummary = () => {
    if (!results.length) return null;

    const years = results.map(r => r.year).filter(y => y && y !== "N/A");
    const uniqueYears = [...new Set(years)].sort((a, b) => Number(b) - Number(a));
    
    const recentYear = uniqueYears[0];
    const oldestYear = uniqueYears[uniqueYears.length - 1];
    
    const dateData = results
      .filter(r => r.shipping_bill_date && r.shipping_bill_date !== "N/A")
      .map(r => {
        const date = new Date(r.shipping_bill_date!);
        return isNaN(date.getTime()) ? null : date;
      })
      .filter((date): date is Date => date !== null)
      .sort((a, b) => a.getTime() - b.getTime());
    
    const oldestDate = dateData[0];
    const recentDate = dateData[dateData.length - 1];

    const formatDateRange = () => {
      if (oldestDate && recentDate) {
        const formatDate = (date: Date) => {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear();
          return `${month} ${year}`;
        };
        return `${formatDate(oldestDate)} to ${formatDate(recentDate)}`;
      }
      return `${oldestYear} to ${recentYear}`;
    };

    const totalValue = results.reduce((sum, r) => sum + parseFloat(r.total_value_usd || "0"), 0);
    const avgValue = totalValue / results.length;

    const topImportCountry = countryStats.topImportCountries[0];
    const topExportCountry = countryStats.topExportCountries[0];

    return {
      totalRecords: aggregates.totalRecords,
      recentYear,
      oldestYear,
      yearSpan: uniqueYears.length,
      totalValue,
      avgValue,
      topImportCountry,
      topExportCountry,
      dateRange: formatDateRange()
    };
  };

  const summary = generateSummary();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading product details...</span>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">No data found for "{productName}"</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{productName}</h1>
              <p className="text-sm text-gray-600">Product Analysis & Market Intelligence</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Get Full Access
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Product Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
              <h2 className="text-xl font-bold mb-2">Product Overview</h2>
              <p className="text-blue-100">
                Comprehensive analysis of {productName} export data
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{summary.totalRecords.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Shipments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalValue.toString())}</div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{aggregates.uniqueSuppliers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Unique Suppliers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{aggregates.uniqueBuyers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Unique Buyers</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Market Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Suppliers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Suppliers</h3>
            <div className="space-y-3">
              {countryStats.topUniqueExporters.slice(0, 5).map((supplier, index) => (
                <div key={supplier.exporter} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-900 truncate">{supplier.exporter}</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{supplier.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Buyers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Buyers</h3>
            <div className="space-y-3">
              {countryStats.topUniqueImporters.slice(0, 5).map((buyer, index) => (
                <div key={buyer.importer} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-900 truncate">{buyer.importer}</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">{buyer.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Export Countries</h4>
                <div className="space-y-2">
                  {countryStats.topExportCountries.slice(0, 3).map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{country.country}</span>
                      <span className="text-sm font-medium text-blue-600">{country.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Import Countries</h4>
                <div className="space-y-2">
                  {countryStats.topImportCountries.slice(0, 3).map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{country.country}</span>
                      <span className="text-sm font-medium text-green-600">{country.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Shipments</h3>
            <p className="text-sm text-gray-600">Latest export data for {productName}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.slice(0, 10).map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(shipment.shipping_bill_date || "")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="truncate max-w-xs" title={shipment.supplier_name}>
                        {shipment.supplier_name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="truncate max-w-xs" title={shipment.buyer_name}>
                        {shipment.buyer_name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.country_of_origin || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.country_of_destination || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.quantity || "N/A"} {shipment.uqc || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(shipment.total_value_usd || "0")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing 10 of {results.length} shipments. 
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 ml-1">
                Get full access to view all shipments
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 