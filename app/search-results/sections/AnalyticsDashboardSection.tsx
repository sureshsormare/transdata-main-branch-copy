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

interface AnalyticsDashboardSectionProps {
  aggregates: any;
  isVisible: boolean;
  formatCurrency: (value: string | number | null | undefined) => string;
}

export default function AnalyticsDashboardSection(props: AnalyticsDashboardSectionProps) {
  const { aggregates, isVisible, formatCurrency } = props;

  if (!isVisible || !aggregates) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Analytics Dashboard
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Records */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Total</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{formatLargeNumber(props.aggregates.totalRecords)}</p>
          <p className="text-sm text-gray-600">Total Records</p>
        </div>

        {/* Unique Buyers */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Buyers</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{formatLargeNumber(props.aggregates.uniqueBuyers)}</p>
          <p className="text-sm text-gray-600">Unique Buyers</p>
        </div>

        {/* Unique Suppliers */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Suppliers</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{formatLargeNumber(props.aggregates.uniqueSuppliers)}</p>
          <p className="text-sm text-gray-600">Unique Suppliers</p>
        </div>
      </div>
    </motion.div>
  );
} 