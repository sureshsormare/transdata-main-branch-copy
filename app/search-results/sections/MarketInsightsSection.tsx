"use client";

import { motion } from "framer-motion";

function formatLargeNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "0"
  const num = parseFloat(value.toString() || "0")
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}Bn`
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}Mn`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

interface MarketInsightsSectionProps {
  summary: any;
  isVisible: boolean;
  formatCurrency: (value: string | number | null | undefined) => string;
  aggregates?: any;
}

export default function MarketInsightsSection(props: MarketInsightsSectionProps) {
  const { summary, isVisible, formatCurrency, aggregates } = props;

  if (!isVisible || !summary) return null;

  const ProgressBar = ({ value, maxValue, color }: { value: number; maxValue: number; color: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`} 
        style={{ width: `${Math.min((value / maxValue) * 100, 100)}%` }}
      ></div>
    </div>
  );

  const TrendIndicator = ({ value, label }: { value: number; label: string }) => (
    <div className="text-right">
      <div className={`text-xs font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {value >= 0 ? '+' : ''}{value.toFixed(1)}%
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-4 bg-white rounded-xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Market Insights & Analytics
        </h3>
        {aggregates?.dateRange && (
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            📅 {aggregates.dateRange.start} - {aggregates.dateRange.end}
          </span>
        )}
      </div>
      
      {/* Key Market Metrics - Simple and Clear */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Market Value */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <TrendIndicator value={summary.marketGrowth || 0} label="vs prev period" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatCurrency(summary.totalValue)}
            </div>
            <p className="text-sm font-medium text-blue-700">Total Market Value</p>
            <p className="text-xs text-blue-600 mt-1">
              {formatLargeNumber(summary.totalRecords)} shipments
            </p>
          </div>
        </div>

        {/* Average Price */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-600">per unit</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(summary.avgPrice)}
            </div>
            <p className="text-sm font-medium text-green-700">Average Unit Price</p>
            <p className="text-xs text-green-600 mt-1">
              {summary.priceVolatility < 20 ? 'Stable pricing' : 'Variable pricing'}
            </p>
          </div>
        </div>

        {/* Top Supplier */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-xs text-purple-600">
              {summary.topSuppliers?.length || 0} suppliers
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 mb-1 truncate">
              {summary.topSuppliers?.[0]?.name || 'N/A'}
            </div>
            <p className="text-sm font-medium text-purple-700">Leading Supplier</p>
            <p className="text-xs text-purple-600 mt-1">
              {formatCurrency(summary.topSuppliers?.[0]?.value || 0)}
            </p>
          </div>
        </div>

        {/* Market Concentration */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-xs text-orange-600">
              {summary.supplierConcentration?.toFixed(1) || 0}% diversity
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {summary.topBuyers?.length || 0}
            </div>
            <p className="text-sm font-medium text-orange-700">Active Buyers</p>
            <p className="text-xs text-orange-600 mt-1">
              {summary.supplierConcentration > 50 ? 'High competition' : 'Limited competition'}
            </p>
          </div>
        </div>
      </div>

      {/* Simple Market Analysis */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Analysis</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Market Health */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Market Health</span>
              <div className={`w-3 h-3 rounded-full ${(summary.marketGrowth || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <ProgressBar 
              value={Math.abs(summary.marketGrowth || 0)} 
              maxValue={100} 
              color={(summary.marketGrowth || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'} 
            />
            <p className="text-xs text-gray-600 mt-2">
              {(summary.marketGrowth || 0) >= 0 ? 'Growing market' : 'Declining market'}
            </p>
          </div>
          
          {/* Price Stability */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Price Stability</span>
              <div className={`w-3 h-3 rounded-full ${(summary.priceVolatility || 0) < 20 ? 'bg-green-500' : (summary.priceVolatility || 0) < 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            </div>
            <ProgressBar 
              value={summary.priceVolatility || 0} 
              maxValue={100} 
              color={(summary.priceVolatility || 0) < 20 ? 'bg-green-500' : (summary.priceVolatility || 0) < 40 ? 'bg-yellow-500' : 'bg-red-500'} 
            />
            <p className="text-xs text-gray-600 mt-2">
              {(summary.priceVolatility || 0) < 20 ? 'Stable prices' : (summary.priceVolatility || 0) < 40 ? 'Moderate volatility' : 'High volatility'}
            </p>
          </div>
          
          {/* Competition Level */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Competition</span>
              <div className={`w-3 h-3 rounded-full ${(summary.supplierConcentration || 0) > 50 ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            </div>
            <ProgressBar 
              value={summary.supplierConcentration || 0} 
              maxValue={100} 
              color={(summary.supplierConcentration || 0) > 50 ? 'bg-green-500' : 'bg-blue-500'} 
            />
            <p className="text-xs text-gray-600 mt-2">
              {(summary.supplierConcentration || 0) > 50 ? 'High competition' : 'Limited competition'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">Key Insights</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-blue-800">
              <strong>Market Size:</strong> {formatCurrency(summary.totalValue)} total market value with {formatLargeNumber(summary.totalRecords)} shipments
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-sm text-green-800">
              <strong>Pricing:</strong> Average unit price of {formatCurrency(summary.avgPrice)} with {(summary.priceVolatility || 0) < 20 ? 'stable' : 'variable'} pricing
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <p className="text-sm text-purple-800">
              <strong>Competition:</strong> {(summary.supplierConcentration || 0) > 50 ? 'High' : 'Limited'} supplier diversity with {summary.topBuyers?.length || 0} active buyers
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p className="text-sm text-orange-800">
              <strong>Trend:</strong> Market is {(summary.marketGrowth || 0) >= 0 ? 'growing' : 'declining'} by {Math.abs(summary.marketGrowth || 0).toFixed(1)}% compared to previous period
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 