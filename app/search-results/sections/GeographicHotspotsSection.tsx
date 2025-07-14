"use client";

import { motion } from "framer-motion";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip, VictoryLabel, VictoryLine } from 'victory';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';

interface GeographicHotspotsSectionProps {
  summary: any;
  isVisible: boolean;
  formatCurrency: (value: string | number | null | undefined) => string;
  aggregates?: any;
}

export default function GeographicHotspotsSection(props: GeographicHotspotsSectionProps) {
  const { summary, isVisible, formatCurrency, aggregates } = props;
  if (!isVisible || !summary) return null;

  // Professional data formatting functions
  const formatCompactNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Enterprise color palette - Professional B2B
  const enterpriseColors = [
    '#1f77b4', // Primary blue
    '#ff7f0e', // Orange
    '#2ca02c', // Green
    '#d62728', // Red
    '#9467bd', // Purple
    '#8c564b', // Brown
    '#e377c2', // Pink
    '#7f7f7f', // Gray
    '#bcbd22', // Olive
    '#17becf'  // Cyan
  ];

  // Mock geographic data for demonstration
  const geographicData = [
    { country: "India", suppliers: 45, value: 2500000, imports: 1200000, exports: 1300000, growth: 12.5, color: "#1f77b4" },
    { country: "China", suppliers: 38, value: 2100000, imports: 900000, exports: 1200000, growth: 8.2, color: "#ff7f0e" },
    { country: "Germany", suppliers: 32, value: 1800000, imports: 800000, exports: 1000000, growth: 15.3, color: "#2ca02c" },
    { country: "USA", suppliers: 28, value: 1600000, imports: 700000, exports: 900000, growth: 6.8, color: "#d62728" },
    { country: "Japan", suppliers: 25, value: 1400000, imports: 600000, exports: 800000, growth: 9.1, color: "#9467bd" },
    { country: "France", suppliers: 22, value: 1200000, imports: 500000, exports: 700000, growth: 11.4, color: "#8c564b" },
    { country: "UK", suppliers: 20, value: 1100000, imports: 450000, exports: 650000, growth: 7.6, color: "#e377c2" },
    { country: "Italy", suppliers: 18, value: 950000, imports: 400000, exports: 550000, growth: 13.2, color: "#7f7f7f" }
  ];

  // Prepare data for enterprise charts
  const prepareSupplierChartData = () => {
    return geographicData
      .sort((a, b) => b.suppliers - a.suppliers)
      .slice(0, 8)
      .map((item, index) => ({
        country: item.country,
        suppliers: item.suppliers,
        color: item.color,
        formattedValue: formatCompactNumber(item.value),
        growth: item.growth
      }));
  };

  const prepareValueChartData = () => {
    return geographicData
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
      .map((item, index) => ({
        country: item.country,
        value: item.value / 1000000, // Convert to millions
        color: item.color,
        formattedValue: formatCompactNumber(item.value),
        growth: item.growth
      }));
  };

  const prepareGrowthData = () => {
    return geographicData
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 8)
      .map((item, index) => ({
        country: item.country,
        growth: item.growth,
        color: item.color,
        suppliers: item.suppliers
      }));
  };

  const supplierChartData = prepareSupplierChartData();
  const valueChartData = prepareValueChartData();
  const growthData = prepareGrowthData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      {/* Enterprise Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Geographic Market Analysis</h3>
              <p className="text-sm text-gray-500">Supplier distribution and market hotspots</p>
            </div>
          </div>
          {aggregates?.dateRange && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Analysis Period</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(aggregates.dateRange.start)} - {formatDate(aggregates.dateRange.end)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enterprise Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b border-gray-200">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">Hotspots</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-900 mb-1">
              {geographicData.length}
            </div>
            <p className="text-sm font-medium text-red-800">Active Markets</p>
            <p className="text-xs text-red-600 mt-1">
              With approved suppliers
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Growth</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {geographicData.reduce((sum, item) => sum + item.suppliers, 0)}
            </div>
            <p className="text-sm font-medium text-blue-800">Total Suppliers</p>
            <p className="text-xs text-blue-600 mt-1">
              Across all markets
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">Value</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-900 mb-1">
              {formatCompactNumber(geographicData.reduce((sum, item) => sum + item.value, 0))}
            </div>
            <p className="text-sm font-medium text-green-800">Total Market</p>
            <p className="text-xs text-green-600 mt-1">
              Global value
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">Balance</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-900 mb-1">
              {formatCompactNumber(geographicData.reduce((sum, item) => sum + (item.exports - item.imports), 0))}
            </div>
            <p className="text-sm font-medium text-purple-800">Net Export</p>
            <p className="text-xs text-purple-600 mt-1">
              Trade balance
            </p>
          </div>
        </div>
      </div>

      {/* Enterprise Charts Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Supplier Distribution - Professional Bar Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Supplier Distribution by Country</h4>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveBar
                data={supplierChartData}
                keys={['suppliers']}
                indexBy="country"
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Country',
                  legendOffset: 40,
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Suppliers',
                  legendOffset: -40,
                  legendPosition: 'middle'
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                tooltip={({ data }) => (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{data.country}</p>
                    <p className="text-red-600 font-bold">{data.suppliers} suppliers</p>
                    <p className="text-xs text-gray-600">{data.formattedValue} market value</p>
                    <p className="text-xs text-gray-600">{data.growth}% growth</p>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Market Value - Professional Bar Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Market Value by Country (Millions)</h4>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveBar
                data={valueChartData}
                keys={['value']}
                indexBy="country"
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Country',
                  legendOffset: 40,
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Value (M)',
                  legendOffset: -40,
                  legendPosition: 'middle'
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                tooltip={({ data }) => (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{data.country}</p>
                    <p className="text-green-600 font-bold">${data.value}M</p>
                    <p className="text-xs text-gray-600">{data.formattedValue} total value</p>
                    <p className="text-xs text-gray-600">{data.growth}% growth</p>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Markets Table */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Pharmaceutical Markets</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 font-semibold text-gray-700">Country</th>
                <th className="text-left py-3 font-semibold text-gray-700">Suppliers</th>
                <th className="text-left py-3 font-semibold text-gray-700">Market Value</th>
                <th className="text-left py-3 font-semibold text-gray-700">Growth</th>
                <th className="text-left py-3 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {geographicData.slice(0, 8).map((market, index) => (
                <tr key={market.country} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 font-medium text-gray-900">{market.country}</td>
                  <td className="py-3 text-gray-700">{market.suppliers}</td>
                  <td className="py-3 font-semibold text-blue-600">{formatCompactNumber(market.value)}</td>
                  <td className="py-3 text-gray-700">{market.growth}%</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      market.exports > market.imports 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {market.exports > market.imports ? 'Net Exporter' : 'Net Importer'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise Insights Panel */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Geographic Intelligence Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Top Market:</strong> {geographicData[0]?.country || 'India'} leads with {geographicData[0]?.suppliers || 0} suppliers and {formatCompactNumber(geographicData[0]?.value || 0)} market value
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Supplier Density:</strong> {geographicData.reduce((sum, item) => sum + item.suppliers, 0)} total suppliers across {geographicData.length} active markets
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Market Opportunity:</strong> {geographicData.filter(m => m.exports > m.imports).length} countries are net exporters, indicating strong supplier networks
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Global Reach:</strong> Total market value of {formatCompactNumber(geographicData.reduce((sum, item) => sum + item.value, 0))} across all markets
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 