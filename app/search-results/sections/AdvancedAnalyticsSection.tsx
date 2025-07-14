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

interface AdvancedAnalyticsSectionProps {
  summary: any;
  isVisible: boolean;
  formatCurrency: (value: string | number | null | undefined) => string;
}

export default function AdvancedAnalyticsSection(props: AdvancedAnalyticsSectionProps) {
  const { summary, isVisible, formatCurrency } = props;

  if (!isVisible || !summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Advanced Analytics
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers Analysis */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Top Suppliers by Value</h4>
          <div className="space-y-3">
            {summary.topSuppliers?.slice(0, 5).map((supplier: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {supplier.name || 'Unknown Supplier'}
                    </p>
                    <p className="text-xs text-gray-600">{formatLargeNumber(supplier.count)} shipments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{formatCurrency(supplier.value)}</p>
                  <p className="text-xs text-gray-500">
                    {((supplier.value / summary.totalValue) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Buyers Analysis */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Top Buyers by Value</h4>
          <div className="space-y-3">
            {summary.topBuyers?.slice(0, 5).map((buyer: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {buyer.name || 'Unknown Buyer'}
                    </p>
                    <p className="text-xs text-gray-600">{formatLargeNumber(buyer.count)} shipments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{formatCurrency(buyer.value)}</p>
                  <p className="text-xs text-gray-500">
                    {((buyer.value / summary.totalValue) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Concentration Analysis */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
        <h4 className="font-semibold text-indigo-900 mb-3">Market Concentration Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-indigo-700">Supplier Diversity</p>
            <p className="text-lg font-bold text-indigo-600">{summary.supplierConcentration?.toFixed(1)}%</p>
            <p className="text-xs text-indigo-600">
              {summary.supplierConcentration > 50 ? 'High diversity' : 'Low diversity'}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-indigo-700">Buyer Diversity</p>
            <p className="text-lg font-bold text-indigo-600">{summary.buyerConcentration?.toFixed(1)}%</p>
            <p className="text-xs text-indigo-600">
              {summary.buyerConcentration > 50 ? 'High diversity' : 'Low diversity'}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-indigo-700">Market Concentration</p>
            <p className="text-lg font-bold text-indigo-600">
              {summary.competitiveAnalysis?.marketConcentration?.toFixed(1) || 0}%
            </p>
            <p className="text-xs text-indigo-600">
              {summary.competitiveAnalysis?.marketConcentration > 70 ? 'High concentration' : 'Low concentration'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 