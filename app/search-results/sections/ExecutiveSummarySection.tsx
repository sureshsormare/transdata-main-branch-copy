"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExportData, formatLargeNumber } from "../SearchResultsClient";

interface ExecutiveSummarySectionProps {
  summary: any;
  aggregates: any;
  countryStats: any;
  monthlyStats: Array<{ month: string; value: number; count: number }>;
  q: string;
  formatCurrency: (value: string | number | null | undefined) => string;
  isVisible: boolean;
}



export default function ExecutiveSummarySection({
  summary,
  aggregates,
  countryStats,
  monthlyStats,
  q,
  formatCurrency,
  isVisible
}: ExecutiveSummarySectionProps) {
  if (!isVisible || !summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-3 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-3">
        <div className="grid grid-cols-1 gap-3">
          {/* Full Width Text Insights */}
          <div className="w-full">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-3 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Executive Summary
                </h3>
                {aggregates.dateRange && (
                  <span className="text-xs text-gray-500">
                    📅 {aggregates.dateRange.start} - {aggregates.dateRange.end}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-700 leading-relaxed space-y-2">
                <p>
                  Our comprehensive analysis reveals <strong className="text-blue-600">{formatLargeNumber(summary.totalRecords)} total shipments</strong> of{' '}
                  <Link href={`/product/${encodeURIComponent(summary.searchTerm)}`} className="text-blue-600 hover:text-blue-800 underline">
                    <strong>{summary.searchTerm}</strong>
                  </Link> exported from{' '}
                  <strong className="text-gray-900">{summary.dateRange}</strong> across <strong className="text-blue-600">{countryStats.topExportCountries.length} supplier countries</strong> to{' '}
                  <strong className="text-blue-600">{countryStats.topImportCountries.length} buyer countries</strong> with a total export value of{' '}
                  <strong className="text-green-600">{formatCurrency(summary.totalValue)}</strong>. The market demonstrates robust activity with an average transaction value of{' '}
                  <strong className="text-green-600">{formatCurrency(summary.avgValue)}</strong> per shipment.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mt-2 rounded-r">
                  <p className="text-xs text-blue-800">
                    <strong>📊 How we calculate this:</strong> We analyze all {formatLargeNumber(summary.totalRecords)} shipment records from our database, 
                    calculating total values, average transaction sizes, and geographic distribution to provide comprehensive market intelligence.
                  </p>
                </div>
                
                <p>
                  The trade network features <strong className="text-indigo-600">{formatLargeNumber(aggregates.uniqueSuppliers)} unique suppliers</strong> and{' '}
                  <strong className="text-indigo-600">{formatLargeNumber(aggregates.uniqueBuyers)} unique buyers</strong>, representing{' '}
                  <strong className="text-indigo-600">{summary.supplierConcentration.toFixed(1)}% supplier diversity</strong> and{' '}
                  <strong className="text-indigo-600">{summary.buyerConcentration.toFixed(1)}% buyer diversity</strong>.{' '}
                  This diverse network includes <strong className="text-purple-600">{summary.uniqueProducts} unique product variations</strong>, indicating a mature and competitive market landscape.
                </p>
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-2 mt-2 rounded-r">
                  <p className="text-xs text-indigo-800">
                    <strong>🔍 What this means:</strong> High supplier diversity ({summary.supplierConcentration.toFixed(1)}%) suggests a competitive market with multiple sourcing options. 
                    High buyer diversity ({summary.buyerConcentration.toFixed(1)}%) indicates broad market demand across different regions and industries.
                  </p>
                </div>
                
                <p>
                  Geographically, <strong className="text-blue-600">{summary.topImportCountry?.country}</strong> emerges as the leading destination with{' '}
                  <strong className="text-gray-900">{formatLargeNumber(summary.topImportCountry?.count)} shipments</strong>, while{' '}
                  <strong className="text-green-600">{summary.topExportCountry?.country}</strong> dominates as the top exporter with{' '}
                  <strong className="text-gray-900">{formatLargeNumber(summary.topExportCountry?.count)} shipments</strong>.{' '}
                  The market trend indicates{' '}
                  <strong className={`${summary.marketGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {summary.marketGrowth >= 0 ? '↗ upward growth momentum' : '↘ declining export patterns'} ({summary.marketGrowth.toFixed(1)}% growth rate)
                  </strong>,{' '}
                  providing strategic insights for market entry and expansion opportunities.
                </p>
                <div className="bg-green-50 border-l-4 border-green-400 p-2 mt-2 rounded-r">
                  <p className="text-xs text-green-800">
                    <strong>📈 Growth Analysis:</strong> We calculate market growth by comparing recent 6-month shipment averages with previous 6-month periods. 
                    A {summary.marketGrowth >= 0 ? 'positive' : 'negative'} growth rate of {Math.abs(summary.marketGrowth).toFixed(1)}% indicates 
                    {summary.marketGrowth >= 0 ? ' expanding market opportunities and increasing demand' : ' market contraction, suggesting need for strategic adjustments'}.
                  </p>
                </div>
                
                <p>
                  Price analysis reveals an average unit price of <strong className="text-orange-600">{formatCurrency(summary.avgPrice)}</strong> with{' '}
                  <strong className="text-orange-600">{summary.priceVolatility.toFixed(1)}% price volatility</strong>, ranging from{' '}
                  <strong className="text-orange-600">{formatCurrency(summary.minPrice)}</strong> to{' '}
                  <strong className="text-orange-600">{formatCurrency(summary.maxPrice)}</strong>.{' '}
                  This comprehensive trade intelligence delivers detailed supplier and buyer information, pricing trends, shipment quantities, and trade routes essential for informed business decisions.
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-2 mt-2 rounded-r">
                  <p className="text-xs text-orange-800">
                    <strong>💰 Price Intelligence:</strong> We analyze unit prices across all {formatLargeNumber(summary.totalRecords)} shipments to calculate average, 
                    minimum, and maximum prices. Price volatility of {summary.priceVolatility.toFixed(1)}% indicates 
                    {summary.priceVolatility < 20 ? ' a stable market with predictable pricing' : 
                     summary.priceVolatility < 40 ? ' moderate price fluctuations requiring careful timing' : 
                     ' high price volatility suggesting market uncertainty and opportunity for strategic pricing'}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 