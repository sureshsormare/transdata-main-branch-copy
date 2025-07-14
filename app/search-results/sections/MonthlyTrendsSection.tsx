"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MonthlyTrendsSectionProps {
  monthlyStats: Array<{ month: string; value: number; count: number }>;
  loading: boolean;
}

export function MonthlyTrendsSection({ monthlyStats, loading }: MonthlyTrendsSectionProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!monthlyStats || monthlyStats.length === 0) {
    return null;
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    // Format large numbers with Mn/Bn
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}Bn`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}Mn`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}Bn`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}Mn`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const monthlyTrends = monthlyStats.map((monthData, index, array) => {
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (index > 0) {
      const prevData = array[index - 1];
      if (monthData.count > prevData.count) trend = 'up';
      else if (monthData.count < prevData.count) trend = 'down';
    }
    
    return {
      month: monthData.month,
      count: monthData.count,
      value: monthData.value,
      trend
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Monthly Trends Analysis
      </h3>
      
      <div className="bg-green-50 p-2 rounded mb-4">
        <p className="text-xs text-green-700">
          <strong>📊 Calculation:</strong> Monthly shipment trends based on volume and value analysis across all records
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Visualization */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Monthly Shipment Trends</h4>
          <div className="bg-blue-50 p-2 rounded mb-3">
            <p className="text-xs text-blue-700">
              <strong>📊 Calculation:</strong> Monthly shipment volumes and values with trend direction indicators
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              {monthlyTrends.map((trend, index) => {
                const maxCount = Math.max(...monthlyTrends.map(t => t.count));
                const percentage = maxCount > 0 ? (trend.count / maxCount) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium text-gray-700">{trend.month}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-right">
                      <div className="text-sm font-bold text-gray-900">{formatLargeNumber(trend.count)}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(trend.value)}</div>
                    </div>
                    <div className="w-8">
                      {getTrendIcon(trend.trend)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trend Insights */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Trend Insights</h4>
          <div className="bg-green-50 p-2 rounded mb-3">
            <p className="text-xs text-green-700">
              <strong>📊 Calculation:</strong> Trend analysis insights derived from peak season identification and growth patterns
            </p>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Peak Season</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {monthlyTrends.reduce((max, trend) => trend.count > max.count ? trend : max).month}
                </span>
              </div>
              <p className="text-xs text-blue-600">
                Highest shipment volume month
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Total Shipments</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  {formatLargeNumber(monthlyTrends.reduce((sum, trend) => sum + trend.count, 0))}
                </span>
              </div>
              <p className="text-xs text-green-600">
                Combined shipment count
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">Total Value</span>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  {formatCurrency(monthlyTrends.reduce((sum, trend) => sum + trend.value, 0))}
                </span>
              </div>
              <p className="text-xs text-purple-600">
                Combined trade value
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 