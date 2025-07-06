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

// Compact Chart Dashboard Component
function ExportChart({ data }: { data: Array<{ month: string; value: number; count: number }> }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const maxCount = Math.max(...data.map(d => d.count));
  const chartHeight = 80;
  const chartWidth = 150;

  // Enhanced Analytics Calculations
  const totalShipments = data.reduce((sum, d) => sum + d.count, 0);
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const avgShipments = Math.round(totalShipments / data.length);
  const avgValue = Math.round(totalValue / data.length);

  // Growth Analysis
  const currentPeriod = data.slice(-6);
  const previousPeriod = data.slice(-12, -6);
  const currentAvg = currentPeriod.reduce((sum, d) => sum + d.count, 0) / currentPeriod.length;
  const previousAvg = previousPeriod.reduce((sum, d) => sum + d.count, 0) / previousPeriod.length;
  const growthRate = previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0;

  // Trend Analysis
  const recentTrend = data.slice(-3).reduce((sum, d) => sum + d.count, 0) / 3;
  const earlierTrend = data.slice(-6, -3).reduce((sum, d) => sum + d.count, 0) / 3;
  const trendDirection = recentTrend > earlierTrend ? 'up' : 'down';

  // Peak Analysis
  const peakMonth = data.reduce((max, d) => d.count > max.count ? d : max);
  const lowMonth = data.reduce((min, d) => d.count < min.count ? d : min);

  // Volatility Analysis
  const values = data.map(d => d.count);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const volatility = Math.sqrt(variance) / mean * 100;

  // Calculate trend line points
  const getTrendLinePoints = (counts: number[]) => {
    const points = counts.map((count, index) => {
      const x = (index / (counts.length - 1)) * chartWidth;
      const y = chartHeight - (count / maxCount) * (chartHeight * 0.7) - 10;
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-blue-50 px-2 py-1 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900">Export Trends</h3>
          <span className={`text-xs font-semibold px-1 py-0.5 rounded ${
            growthRate >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="p-2">
        {/* Enhanced Metrics Row */}
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div className="bg-purple-50 p-1 rounded text-center">
            <div className="text-xs text-purple-600">Avg/Month</div>
            <div className="text-xs font-bold text-purple-900">{avgShipments.toLocaleString()}</div>
          </div>
          <div className="bg-orange-50 p-1 rounded text-center">
            <div className="text-xs text-orange-600">Volatility</div>
            <div className="text-xs font-bold text-orange-900">{volatility.toFixed(1)}%</div>
          </div>
        </div>

        {/* Compact Chart */}
        <div className="bg-gray-50 p-1 rounded mb-2">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-gray-900">Monthly Trends</h4>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">Shipments</span>
            </div>
          </div>

          <div className="relative h-20">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-500 pr-1">
              <span>{maxCount.toLocaleString()}</span>
              <span>{Math.round(maxCount * 0.75).toLocaleString()}</span>
              <span>{Math.round(maxCount * 0.5).toLocaleString()}</span>
              <span>{Math.round(maxCount * 0.25).toLocaleString()}</span>
              <span>0</span>
            </div>

            {/* Chart Area with Padding for Y-axis */}
            <div className="absolute left-8 right-0 top-0 h-full">
              {/* Y-Axis Line */}
              <svg className="absolute inset-0 w-full h-full">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="#D1D5DB"
                  strokeWidth="1"
                />
              </svg>

              {/* Grid Lines */}
              <svg className="absolute inset-0 w-full h-full">
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 20}
                    x2="100%"
                    y2={i * 20}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                ))}
              </svg>

              {/* Trend Line */}
              <svg className="absolute inset-0 w-full h-full">
                <polyline
                  points={getTrendLinePoints(data.map(d => d.count))}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  opacity="0.8"
                />
              </svg>

              {/* Data Points and Bars */}
              <div className="absolute inset-0 flex items-end justify-between px-1 pb-4">
                {data.map((item, index) => {
                  const height = (item.count / maxCount) * (chartHeight * 0.5);
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-1.5 bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ height: `${height}px` }}
                        title={`${item.month}: ${item.count} shipments | $${item.value.toLocaleString()}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[8px] text-gray-500">
              {data.map((item, index) => (
                <span key={index} className="transform -rotate-45 origin-left">
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Analysis */}
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-white border border-gray-200 rounded p-1">
            <div className="text-xs font-semibold text-gray-900">Peak: {peakMonth.month}</div>
            <div className="text-xs text-gray-600">{peakMonth.count.toLocaleString()}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-1">
            <div className="text-xs font-semibold text-gray-900">Trend</div>
            <div className={`text-xs ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trendDirection === 'up' ? '↗' : '↘'} {trendDirection}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";

  const [results, setResults] = useState<ExportData[]>([]);
  const [aggregates, setAggregates] = useState({
    totalRecords: 0,
    uniqueBuyers: 0,
    uniqueSuppliers: 0,
    totalValueUSD: 0,
  });
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<ExportData | null>(null);
  const [searchInput, setSearchInput] = useState(q);
  const [selectedImportCountry, setSelectedImportCountry] = useState<string>("");
  const [selectedExportCountry, setSelectedExportCountry] = useState<string>("");
  const [selectedExporter, setSelectedExporter] = useState<string>("");
  const [selectedImporter, setSelectedImporter] = useState<string>("");
  const [countryStats, setCountryStats] = useState({
    topImportCountries: [] as Array<{ country: string; count: number }>,
    topExportCountries: [] as Array<{ country: string; count: number }>,
    topUniqueExporters: [] as Array<{ exporter: string; count: number }>,
    topUniqueImporters: [] as Array<{ importer: string; count: number }>,
  });
  

  const [monthlyStats, setMonthlyStats] = useState<Array<{ month: string; value: number; count: number }>>([]);

  useEffect(() => {
    if (!q) return;

    const fetchResults = async () => {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('q', q);
      if (selectedImportCountry) params.append('importCountry', selectedImportCountry);
      if (selectedExportCountry) params.append('exportCountry', selectedExportCountry);
      if (selectedExporter) params.append('exporter', selectedExporter);
      if (selectedImporter) params.append('importer', selectedImporter);
      
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      
      if (data.results && Array.isArray(data.results)) {
        // Sort by year descending (most recent first)
        const resultsArray = data.results.sort((a: ExportData, b: ExportData) => {
          const yearA = Number(a.year) || 0;
          const yearB = Number(b.year) || 0;
          return yearB - yearA;
        });
        setResults(resultsArray);
        
        // Set aggregates if available
        if (data.aggregates) {
          setAggregates(data.aggregates);
        }
        
        // Set country stats if available
        if (data.countryStats) {
          setCountryStats(data.countryStats);
        }

        // Set monthly statistics from API (uses entire dataset)
        if (data.monthlyStats) {
          setMonthlyStats(data.monthlyStats);
        } else {
          setMonthlyStats([]);
        }
      } else {
        setResults([]);
        setAggregates({
          totalRecords: 0,
          uniqueBuyers: 0,
          uniqueSuppliers: 0,
          totalValueUSD: 0,
        });
        setCountryStats({
          topImportCountries: [],
          topExportCountries: [],
          topUniqueExporters: [],
          topUniqueImporters: [],
        });
        setMonthlyStats([]);
      }

      setLoading(false);
    };

    fetchResults();
  }, [q, selectedImportCountry, selectedExportCountry, selectedExporter, selectedImporter]);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(
        `/search-results?q=${encodeURIComponent(searchInput.trim())}`
      );
    }
  };

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

  // Use results directly since filtering is now done at API level
  const filteredResults = results;

  // Generate dynamic summary based on search results
  const generateSummary = () => {
    if (!results.length) return null;

    // Calculate key insights
    const years = results.map(r => r.year).filter(y => y && y !== "N/A");
    const uniqueYears = [...new Set(years)].sort((a, b) => Number(b) - Number(a));
    const recentYear = uniqueYears[0];
    const oldestYear = uniqueYears[uniqueYears.length - 1];

    const totalValue = results.reduce((sum, r) => sum + parseFloat(r.total_value_usd || "0"), 0);
    const avgValue = totalValue / results.length;

    const topImportCountry = countryStats.topImportCountries[0];
    const topExportCountry = countryStats.topExportCountries[0];

    const productTypes = results.map(r => r.product_description).filter(p => p && p !== "N/A");
    const uniqueProducts = [...new Set(productTypes)];

    return {
      totalRecords: aggregates.totalRecords,
      recentYear,
      oldestYear,
      yearSpan: uniqueYears.length,
      totalValue,
      avgValue,
      topImportCountry,
      topExportCountry,
      uniqueProducts: uniqueProducts.length,
      searchTerm: q
    };
  };

  const summary = generateSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Section - Title and Search */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Link
                  href="/"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Search Results
                  </h1>
                  <p className="text-xs text-gray-600">
                    Found <span className="font-medium text-blue-600">{aggregates.totalRecords.toLocaleString()}</span> records for <span className="font-medium text-gray-900">"{q}"</span>
                  </p>
                </div>
              </div>

              {/* Horizontal Finished Formulation Search Bar */}
              <div className="max-w-4xl">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="flex items-center p-3">
                      {/* Search Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Search Input */}
                      <div className="flex-1 px-4">
                        <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          placeholder="Search finished formulations, APIs, or pharmaceutical products..."
                          className="w-full text-base text-gray-900 bg-transparent border-none outline-none placeholder-gray-500"
                        />
                      </div>
                      
                      {/* Search Button */}
                      <div className="flex-shrink-0 mr-2">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <span>Search</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>


              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 max-w-sm">
              <div className="text-center">
                <div className="space-y-2">
                  <Link
                    href="/contact"
                    className="inline-block w-full px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Get Free 7-Day Trial
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-block w-full px-3 py-2 bg-white text-blue-600 text-xs font-medium rounded-md border border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    Consult an Expert
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Summary Section - Half Page */}
        {!loading && results.length > 0 && summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-3">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {/* Left Column - Text Insights (75% width) */}
                <div className="lg:col-span-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Executive Summary
                    </h3>
                    <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                      <p>
                        Our comprehensive analysis reveals <strong className="text-blue-600">{summary.totalRecords.toLocaleString()} total shipments</strong> of 
                        <strong className="text-blue-600"> {summary.searchTerm}</strong> exported from 
                        <strong className="text-gray-900"> {summary.oldestYear}</strong> to <strong className="text-gray-900">{summary.recentYear}</strong>, 
                        spanning {summary.yearSpan} years with a total export value of 
                        <strong className="text-green-600">{formatCurrency(summary.totalValue.toString())}</strong>. The market demonstrates robust activity with an average transaction value of 
                        <strong className="text-green-600">{formatCurrency(summary.avgValue.toString())}</strong> per shipment.
                      </p>
                      
                      <p>
                        The trade network features <strong className="text-indigo-600">{aggregates.uniqueSuppliers.toLocaleString()} unique suppliers</strong> and 
                        <strong className="text-indigo-600">{aggregates.uniqueBuyers.toLocaleString()} unique buyers</strong>, representing 
                        <strong className="text-indigo-600">{((aggregates.uniqueSuppliers / summary.totalRecords) * 100).toFixed(1)}% supplier diversity</strong> and 
                        <strong className="text-indigo-600">{((aggregates.uniqueBuyers / summary.totalRecords) * 100).toFixed(1)}% buyer diversity</strong>. 
                        This diverse network includes <strong className="text-purple-600">{summary.uniqueProducts} unique product variations</strong>, indicating a mature and competitive market landscape.
                      </p>
                      
                      <p>
                        Geographically, <strong className="text-blue-600">{summary.topImportCountry?.country}</strong> emerges as the leading destination with 
                        <strong className="text-gray-900">{summary.topImportCountry?.count.toLocaleString()} shipments</strong>, while 
                        <strong className="text-green-600">{summary.topExportCountry?.country}</strong> dominates as the top exporter with 
                        <strong className="text-gray-900">{summary.topExportCountry?.count.toLocaleString()} shipments</strong>. 
                        The market trend indicates 
                        <strong className="text-green-600">{monthlyStats.length > 0 ? (monthlyStats[monthlyStats.length - 1].count > monthlyStats[0].count ? '↗ upward growth momentum' : '↘ declining export patterns') : 'stable market conditions'}</strong>, 
                        providing strategic insights for market entry and expansion opportunities.
                      </p>
                      
                      <p>
                        This comprehensive trade intelligence delivers detailed supplier and buyer information, pricing trends, shipment quantities, and trade routes essential for informed business decisions. With complete market coverage of 
                        <strong className="text-orange-600">{summary.totalRecords.toLocaleString()} shipments</strong> valued at 
                        <strong className="text-orange-600">{formatCurrency(summary.totalValue.toString())}</strong>, 
                        businesses can identify lucrative opportunities, understand competitive dynamics, and make strategic export decisions backed by data-driven insights.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Compact Export Chart (25% width) */}
                <div className="lg:col-span-1 flex items-center justify-center">
                  <div className="w-full">
                    <ExportChart data={monthlyStats} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-4">
          {/* Compact Filters Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sticky top-4">
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Top Importing Countries Filter */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">Top Importing Countries</h3>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                    <input
                      type="radio"
                      name="importCountry"
                      value=""
                      checked={selectedImportCountry === ""}
                      onChange={(e) => setSelectedImportCountry(e.target.value)}
                      className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span>All Countries</span>
                  </label>
                  {(countryStats.topImportCountries || []).map((item) => (
                    <label key={item.country} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                      <input
                        type="radio"
                        name="importCountry"
                        value={item.country}
                        checked={selectedImportCountry === item.country}
                        onChange={(e) => setSelectedImportCountry(e.target.value)}
                        className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="flex-1 truncate">{item.country}</span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Top Exporting Countries Filter */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">Top Exporting Countries</h3>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                    <input
                      type="radio"
                      name="exportCountry"
                      value=""
                      checked={selectedExportCountry === ""}
                      onChange={(e) => setSelectedExportCountry(e.target.value)}
                      className="w-3 h-3 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span>All Countries</span>
                  </label>
                  {(countryStats.topExportCountries || []).map((item) => (
                    <label key={item.country} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                      <input
                        type="radio"
                        name="exportCountry"
                        value={item.country}
                        checked={selectedExportCountry === item.country}
                        onChange={(e) => setSelectedExportCountry(e.target.value)}
                        className="w-3 h-3 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="flex-1 truncate">{item.country}</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Top Unique Suppliers Filter */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">Top Unique Suppliers</h3>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                    <input
                      type="radio"
                      name="exporter"
                      value=""
                      checked={selectedExporter === ""}
                      onChange={(e) => setSelectedExporter(e.target.value)}
                      className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <span>All Suppliers</span>
                  </label>
                  {(countryStats.topUniqueExporters || []).map((item) => (
                    <label key={item.exporter} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                      <input
                        type="radio"
                        name="exporter"
                        value={item.exporter}
                        checked={selectedExporter === item.exporter}
                        onChange={(e) => setSelectedExporter(e.target.value)}
                        className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="flex-1 truncate">{item.exporter}</span>
                      <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Top Unique Buyers Filter */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">Top Unique Buyers</h3>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                    <input
                      type="radio"
                      name="importer"
                      value=""
                      checked={selectedImporter === ""}
                      onChange={(e) => setSelectedImporter(e.target.value)}
                      className="w-3 h-3 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span>All Buyers</span>
                  </label>
                  {(countryStats.topUniqueImporters || []).map((item) => (
                    <label key={item.importer} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                      <input
                        type="radio"
                        name="importer"
                        value={item.importer}
                        checked={selectedImporter === item.importer}
                        onChange={(e) => setSelectedImporter(e.target.value)}
                        className="w-3 h-3 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="flex-1 truncate">{item.importer}</span>
                      <span className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedImportCountry || selectedExportCountry || selectedExporter || selectedImporter) && (
                <button
                  onClick={() => {
                    setSelectedImportCountry("");
                    setSelectedExportCountry("");
                    setSelectedExporter("");
                    setSelectedImporter("");
                  }}
                  className="w-full mb-3 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              )}

              {/* Results Count */}
              <div className="pt-2 border-t border-gray-200 mb-4">
                <div className="bg-gray-50 p-2 rounded-md">
                  <p className="text-xs text-gray-700 mb-1">
                    Showing <span className="font-medium text-blue-600">{filteredResults.length}</span> of <span className="font-medium text-gray-900">{aggregates.totalRecords.toLocaleString()}</span> results
                  </p>
                  <p className="text-xs text-blue-600">
                    Limited to {(selectedImportCountry || selectedExportCountry || selectedExporter || selectedImporter) ? '3' : '10'} results for preview
                  </p>
                </div>
              </div>

              {/* Call to Action - Grow Your Export Business */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Grow Your Export Business</h4>
                  <p className="text-xs text-blue-700 mb-3 leading-tight">
                    Our Big Data technology scans over 2 billion export shipment records to identify new buyers, profitable markets, reliable suppliers, and promising products.
                  </p>
                  
                  <div className="space-y-2 mb-3">
                    <Link
                      href="/contact"
                      className="inline-block w-full px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Get Free 7-Day Trial
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-block w-full px-3 py-2 bg-white text-blue-600 text-xs font-medium rounded-md border border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      Consult an Expert
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-block w-full px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                      YouTube Video Preview
                    </Link>
                  </div>
                  
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-blue-900">Suresh</p>
                        <p className="text-xs text-blue-700">Sales Representative</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-blue-700">
                      <p className="flex items-center gap-1 justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        info@transdatanexus.com
                      </p>
                      <p className="flex items-center gap-1 justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        +91 9595078788
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="flex-1">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 text-sm">Loading results...</span>
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                {/* Compact Analytics Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Total Records</p>
                        <p className="text-lg font-semibold text-gray-900">{aggregates.totalRecords.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-md">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Unique Buyers</p>
                        <p className="text-lg font-semibold text-gray-900">{aggregates.uniqueBuyers.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-md">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Unique Suppliers</p>
                        <p className="text-lg font-semibold text-gray-900">{aggregates.uniqueSuppliers.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-md">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Total Value</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(aggregates.totalValueUSD.toString())}</p>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded-md">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Compact Professional Results Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredResults.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`group relative bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 cursor-pointer ${
                        hoveredIndex === idx 
                          ? 'shadow-lg border-blue-400 scale-[1.02] bg-blue-50' 
                          : 'border-gray-200 hover:shadow-md hover:border-blue-300'
                      }`}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => setSelectedCard(item)}
                    >
                      {/* Status Bar */}
                      <div className={`absolute top-0 left-0 w-full h-0.5 transition-colors duration-300 ${
                        hoveredIndex === idx ? 'bg-blue-600' : 'bg-blue-500'
                      }`}></div>
                      
                      <div className="p-3">
                        {/* Product Header */}
                        <div className="mb-3">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors flex-1 mr-2">
                              {item.product_description || "Product description not available"}
                            </h3>
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {item.year || "No Year"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {item.hs_code || "No HSN Code"}
                            </span>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-gray-50 p-2 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600">Quantity</span>
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              {item.quantity || "Not specified"} <span className="text-xs font-normal text-gray-500">{item.uqc || ""}</span>
                            </p>
                          </div>
                          <div className="bg-green-50 p-2 rounded border border-green-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-green-700">Value</span>
                              <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <p className="text-sm font-bold text-green-800">
                              {formatCurrency(item.total_value_usd || "0")}
                            </p>
                          </div>
                        </div>

                        {/* Trade Details */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between py-1 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Buyer</span>
                            </div>
                            <span className="text-xs text-gray-900 truncate max-w-[100px]" title={item.buyer_name || "Buyer name not available"}>
                              {item.buyer_name || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Supplier</span>
                            </div>
                            <span className="text-xs text-gray-900 truncate max-w-[100px]" title={item.supplier_name || "Supplier name not available"}>
                              {item.supplier_name || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Origin</span>
                            </div>
                            <span className="text-xs text-gray-900 truncate max-w-[80px]">{item.country_of_origin || "Not specified"}</span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Destination</span>
                            </div>
                            <span className="text-xs text-gray-900 truncate max-w-[80px]">{item.country_of_destination || "Not specified"}</span>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600">Date</span>
                            </div>
                            <span className="text-xs text-gray-900">{formatDate(item.shipping_bill_date || "")}</span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Card Detail Modal */}
                <AnimatePresence>
                  {selectedCard && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                      onClick={() => setSelectedCard(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-xl font-bold mb-2">Export Shipment Details</h2>
                              <p className="text-blue-100 text-sm">
                                Complete information for this trade record
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedCard(null)}
                              className="text-white hover:text-blue-200 transition-colors"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                          {/* Product Information */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              Product Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">Product Description</label>
                                <p className="text-gray-900 mt-1">{selectedCard.product_description || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">HSN Code</label>
                                <p className="text-gray-900 mt-1">{selectedCard.hs_code || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Chapter</label>
                                <p className="text-gray-900 mt-1">{selectedCard.chapter || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Year</label>
                                <p className="text-gray-900 mt-1">{selectedCard.year || "Not specified"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Trade Details */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              Trade Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-gray-600">Quantity</label>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                  {selectedCard.quantity || "Not specified"} {selectedCard.uqc || ""}
                                </p>
                              </div>
                              <div className="bg-green-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-green-700">Total Value (USD)</label>
                                <p className="text-xl font-bold text-green-800 mt-1">
                                  {formatCurrency(selectedCard.total_value_usd || "0")}
                                </p>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <label className="text-sm font-medium text-blue-700">Unit Rate (USD)</label>
                                <p className="text-xl font-bold text-blue-800 mt-1">
                                  {formatCurrency(selectedCard.unit_rate_usd || "0")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Parties Information */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Parties Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Supplier Details */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  Supplier
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <label className="text-gray-600">Name:</label>
                                    <p className="text-gray-900 font-medium">{selectedCard.supplier_name || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-600">Address:</label>
                                    <p className="text-gray-900">{selectedCard.supplier_address || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-600">City/State:</label>
                                    <p className="text-gray-900">{selectedCard.supplier_city_state || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-600">Contact:</label>
                                    <p className="text-gray-900">{selectedCard.supplier_contact_no || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-600">Email:</label>
                                    <p className="text-gray-900">{selectedCard.supplier_email_id || "Not specified"}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Buyer Details */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  Buyer
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <label className="text-gray-600">Name:</label>
                                    <p className="text-gray-900 font-medium">{selectedCard.buyer_name || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-600">Address:</label>
                                    <p className="text-gray-900">{selectedCard.buyer_address || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-600">City/State:</label>
                                    <p className="text-gray-900">{selectedCard.buyer_city_state || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-600">Contact:</label>
                                    <p className="text-gray-900">{selectedCard.buyer_contact_no || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-600">Email:</label>
                                    <p className="text-gray-900">{selectedCard.buyer_email_id || "Not specified"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Information */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              Shipping Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">Shipping Bill Date</label>
                                <p className="text-gray-900 mt-1">{formatDate(selectedCard.shipping_bill_date || "")}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Shipping Bill No</label>
                                <p className="text-gray-900 mt-1">{selectedCard.shipping_bill_no || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Port of Origin</label>
                                <p className="text-gray-900 mt-1">{selectedCard.port_of_origin || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Port of Destination</label>
                                <p className="text-gray-900 mt-1">{selectedCard.port_of_destination || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Country of Origin</label>
                                <p className="text-gray-900 mt-1">{selectedCard.country_of_origin || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Country of Destination</label>
                                <p className="text-gray-900 mt-1">{selectedCard.country_of_destination || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Mode of Transport</label>
                                <p className="text-gray-900 mt-1">{selectedCard.mode || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Incoterm</label>
                                <p className="text-gray-900 mt-1">{selectedCard.incoterm || "Not specified"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Additional Details */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Additional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">IEC Code</label>
                                <p className="text-gray-900 mt-1">{selectedCard.iec || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Currency</label>
                                <p className="text-gray-900 mt-1">{selectedCard.currency || "Not specified"}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Exchange Rate (USD)</label>
                                <p className="text-gray-900 mt-1">{selectedCard.exchange_rate_usd || "Not specified"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end">
                          <button
                            onClick={() => setSelectedCard(null)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Compact Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8"
                >
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Complete Market Intelligence</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Get access to all <span className="font-semibold text-blue-600">{aggregates.totalRecords.toLocaleString()}</span> records, detailed contact information, 
                      complete trade history, and advanced analytics to make informed business decisions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/contact"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
                      >
                        Contact Sales Team
                      </Link>
                      <Link
                        href="/pricing"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        View Pricing Plans
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {!loading && results.length === 0 && q && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-md">
                  <Image
                    src="/not-found.svg"
                    alt="No results"
                    width={80}
                    height={80}
                    className="mx-auto mb-4 opacity-80"
                  />
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    No results found
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    We couldn't find any matches for <strong>"{q}"</strong>. 
                    Try different keywords or check your spelling.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
