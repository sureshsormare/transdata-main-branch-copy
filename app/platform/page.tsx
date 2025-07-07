"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Package, 
  Brain, 
  Database, 
  Users, 
  Activity,
  Zap,
  Shield,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  BarChart,
  PieChart,
  LineChart,
  MapPin,
  Truck,
  Factory,
  ShoppingCart,
  FileText,
  Settings,
  Eye,
  Search,
  Filter,
  Download,
  Share2,
  RefreshCw,
  Calendar,
  TrendingDown,
  Minus
} from "lucide-react";

interface AnalyticsData {
  totalRecords: number;
  countries: number;
  suppliers: number;
  buyers: number;
  totalValue: number;
  growthRate: number;
  monthlyGrowth: number;
  dataAccuracy: number;
  updateFrequency: string;
  apiCalls: number;
  activeUsers: number;
  reportsGenerated: number;
  alertsSent: number;
}

interface MarketTrend {
  month: string;
  value: number;
  volume: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopProduct {
  name: string;
  value: number;
  volume: number;
  growth: number;
  category: string;
}

interface TopCountry {
  country: string;
  imports: number;
  exports: number;
  growth: number;
  topProducts: string[];
  marketShare: number;
  regulatoryStatus: string;
  tradePartners: number;
  avgPrice: number;
}

interface SupplyChainData {
  supplier: string;
  country: string;
  products: number;
  reliability: number;
  avgDeliveryTime: number;
  qualityRating: number;
  certifications: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface PricingData {
  product: string;
  currentPrice: number;
  historicalAvg: number;
  priceChange: number;
  volatility: number;
  forecast: number;
  marketDemand: 'high' | 'medium' | 'low';
}

interface RegulatoryData {
  country: string;
  approvalStatus: string;
  complianceScore: number;
  pendingApplications: number;
  recentChanges: string[];
  riskFactors: string[];
}

interface TradeFlowData {
  origin: string;
  destination: string;
  volume: number;
  value: number;
  frequency: number;
  route: string;
  transportMode: string;
  avgTransitTime: number;
}

interface ProductCategory {
  category: string;
  count: number;
  value: number;
  growth: number;
  marketShare: number;
}

interface PlatformData {
  analyticsData: AnalyticsData;
  marketTrends: MarketTrend[];
  topProducts: TopProduct[];
  topCountries: TopCountry[];
  supplyChainData: SupplyChainData[];
  pricingData: PricingData[];
  regulatoryData: RegulatoryData[];
  tradeFlowData: TradeFlowData[];
  productCategories: ProductCategory[];
}

export default function PlatformPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

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

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
    }
  };

  const getDemandColor = (demand: 'high' | 'medium' | 'low') => {
    switch (demand) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading platform analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">Failed to load analytics data</p>
          <button 
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Pharma Trade Analytics Platform</h1>
              <p className="text-gray-400 mt-2">Real-time insights powered by AI and big data</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchAnalyticsData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Records</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.analyticsData.totalRecords)}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Countries</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.analyticsData.countries)}</p>
              </div>
              <Globe className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Suppliers</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.analyticsData.suppliers)}</p>
              </div>
              <Factory className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Buyers</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.analyticsData.buyers)}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(data.analyticsData.totalValue)}B</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Growth Rate</p>
                <p className="text-2xl font-bold text-green-400">+{data.analyticsData.growthRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Data Accuracy</p>
                <p className="text-2xl font-bold text-blue-400">{data.analyticsData.dataAccuracy}%</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.analyticsData.activeUsers)}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
          </motion.div>
        </div>

        {/* Additional Platform Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Monthly Growth</p>
                <p className="text-xl font-bold text-green-400">+{data.analyticsData.monthlyGrowth}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Update Frequency</p>
                <p className="text-xl font-bold text-blue-400">{data.analyticsData.updateFrequency}</p>
              </div>
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">API Calls</p>
                <p className="text-xl font-bold text-white">{formatNumber(data.analyticsData.apiCalls)}</p>
              </div>
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reports Generated</p>
                <p className="text-xl font-bold text-white">{formatNumber(data.analyticsData.reportsGenerated)}</p>
              </div>
              <FileText className="w-6 h-6 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8">
          <div className="flex flex-wrap border-b border-gray-700">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "trends", label: "Market Trends", icon: TrendingUp },
              { id: "markets", label: "Markets", icon: Globe },
              { id: "products", label: "Products", icon: Package },
              { id: "supply-chain", label: "Supply Chain", icon: Truck },
              { id: "pricing", label: "Pricing", icon: DollarSign },
              { id: "regulatory", label: "Regulatory", icon: Shield },
              { id: "trade-flows", label: "Trade Flows", icon: MapPin },
              { id: "ai-insights", label: "AI Insights", icon: Brain },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-400 border-b-2 border-blue-400 bg-gray-700"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Market Trends Chart */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      Market Trends (Last 12 Months)
                    </h3>
                    <div className="space-y-3">
                      {data.marketTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-300">{trend.month}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-white font-medium">{formatCurrency(trend.value)}B</span>
                            <span className="text-gray-400">{formatNumber(trend.volume)} shipments</span>
                            {getTrendIcon(trend.trend)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-500" />
                      Top Products by Value
                    </h3>
                    <div className="space-y-3">
                      {data.topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-gray-400 text-sm">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{formatCurrency(product.value)}B</p>
                            <p className="text-green-400 text-sm">+{product.growth.toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Categories */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-purple-500" />
                    Product Categories Distribution
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.productCategories.map((category, index) => (
                      <div key={index} className="bg-gray-600 rounded-lg p-4">
                        <p className="text-white font-medium">{category.category}</p>
                        <p className="text-2xl font-bold text-blue-400">{formatCurrency(category.value)}B</p>
                        <p className="text-gray-400 text-sm">{formatNumber(category.count)} records</p>
                        <p className="text-green-400 text-sm">+{category.growth.toFixed(1)}% growth</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "trends" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Trends */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Export Trends</h3>
                    <div className="space-y-4">
                      {data.marketTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{trend.month}</p>
                            <p className="text-gray-400 text-sm">{formatNumber(trend.volume)} shipments</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{formatCurrency(trend.value)}B</p>
                            <div className="flex items-center space-x-1">
                              {getTrendIcon(trend.trend)}
                              <span className="text-sm text-gray-400">Trend</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Growth Analysis */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Growth Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                        <span className="text-gray-300">Overall Growth Rate</span>
                        <span className="text-green-400 font-bold">+{data.analyticsData.growthRate}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                        <span className="text-gray-300">Monthly Growth</span>
                        <span className="text-green-400 font-bold">+{data.analyticsData.monthlyGrowth}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                        <span className="text-gray-300">Data Accuracy</span>
                        <span className="text-blue-400 font-bold">{data.analyticsData.dataAccuracy}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "markets" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data.topCountries.map((country, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{country.country}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          country.regulatoryStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {country.regulatoryStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Imports</p>
                          <p className="text-white font-bold">{formatCurrency(country.imports)}B</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Exports</p>
                          <p className="text-white font-bold">{formatCurrency(country.exports)}B</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Growth</p>
                          <p className="text-green-400 font-bold">+{country.growth.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Market Share</p>
                          <p className="text-white font-bold">{country.marketShare.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Top Products:</p>
                        <div className="flex flex-wrap gap-1">
                          {country.topProducts.map((product, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-600 rounded text-xs">{product}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data.topProducts.map((product, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {product.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Total Value</p>
                          <p className="text-white font-bold">{formatCurrency(product.value)}B</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Volume</p>
                          <p className="text-white font-bold">{formatNumber(product.volume)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Growth</p>
                          <p className="text-green-400 font-bold">+{product.growth.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Category</p>
                          <p className="text-white font-bold">{product.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "supply-chain" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data.supplyChainData.map((supplier, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{supplier.supplier}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(supplier.riskLevel)}`}>
                          {supplier.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Country</p>
                          <p className="text-white font-bold">{supplier.country}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Products</p>
                          <p className="text-white font-bold">{formatNumber(supplier.products)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Reliability</p>
                          <p className="text-green-400 font-bold">{supplier.reliability.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Quality Rating</p>
                          <p className="text-white font-bold">{supplier.qualityRating.toFixed(1)}/5</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {supplier.certifications.map((cert, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{cert}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data.pricingData.map((item, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{item.product}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDemandColor(item.marketDemand)}`}>
                          {item.marketDemand.toUpperCase()} DEMAND
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Current Price</p>
                          <p className="text-white font-bold">{formatCurrency(item.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Historical Avg</p>
                          <p className="text-white font-bold">{formatCurrency(item.historicalAvg)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Price Change</p>
                          <p className={`font-bold ${item.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {item.priceChange >= 0 ? '+' : ''}{item.priceChange.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Volatility</p>
                          <p className="text-white font-bold">{item.volatility.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Forecast:</p>
                        <p className="text-blue-400 font-bold">{formatCurrency(item.forecast)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "regulatory" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data.regulatoryData.map((item, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{item.country}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.approvalStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.approvalStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Compliance Score</p>
                          <p className="text-green-400 font-bold">{item.complianceScore.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Pending Apps</p>
                          <p className="text-white font-bold">{formatNumber(item.pendingApplications)}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Recent Changes:</p>
                        <div className="space-y-1">
                          {item.recentChanges.map((change, idx) => (
                            <p key={idx} className="text-sm text-gray-300">• {change}</p>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <p className="text-gray-400 text-sm">Risk Factors:</p>
                        <div className="space-y-1">
                          {item.riskFactors.map((risk, idx) => (
                            <p key={idx} className="text-sm text-red-300">• {risk}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "trade-flows" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {data.tradeFlowData.map((flow, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{flow.route}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {flow.transportMode}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Volume</p>
                          <p className="text-white font-bold">{formatNumber(flow.volume)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Value</p>
                          <p className="text-white font-bold">{formatCurrency(flow.value)}M</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Frequency</p>
                          <p className="text-white font-bold">{formatNumber(flow.frequency)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Transit Time</p>
                          <p className="text-white font-bold">{flow.avgTransitTime} days</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Route Details:</p>
                        <p className="text-sm text-gray-300">From {flow.origin} to {flow.destination}</p>
                        <p className="text-sm text-gray-300">Transport: {flow.transportMode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "ai-insights" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* AI Predictions */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-500" />
                      AI Market Predictions
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-600 rounded-lg">
                        <p className="text-green-400 font-medium">↑ Market Growth Forecast</p>
                        <p className="text-gray-300 text-sm">Expected 15-20% growth in Q4 2024</p>
                      </div>
                      <div className="p-4 bg-gray-600 rounded-lg">
                        <p className="text-blue-400 font-medium">→ Supply Chain Optimization</p>
                        <p className="text-gray-300 text-sm">AI recommends 3 new supplier partnerships</p>
                      </div>
                      <div className="p-4 bg-gray-600 rounded-lg">
                        <p className="text-yellow-400 font-medium">⚠ Price Volatility Alert</p>
                        <p className="text-gray-300 text-sm">Anticipated 8% price increase in raw materials</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-red-500" />
                      Risk Assessment
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                        <span className="text-gray-300">Supply Chain Risk</span>
                        <span className="text-green-400 font-bold">Low</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                        <span className="text-gray-300">Regulatory Risk</span>
                        <span className="text-yellow-400 font-bold">Medium</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                        <span className="text-gray-300">Market Risk</span>
                        <span className="text-green-400 font-bold">Low</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-500" />
                    AI Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-600 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Market Expansion</h4>
                      <p className="text-gray-300 text-sm">Consider entering emerging markets in Southeast Asia</p>
                    </div>
                    <div className="p-4 bg-gray-600 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Supplier Diversification</h4>
                      <p className="text-gray-300 text-sm">Add 2-3 new suppliers to reduce dependency</p>
                    </div>
                    <div className="p-4 bg-gray-600 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Price Optimization</h4>
                      <p className="text-gray-300 text-sm">Adjust pricing strategy based on demand patterns</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Trade Intelligence?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get access to real-time analytics, AI-powered insights, and comprehensive market data 
            to make informed business decisions and stay ahead of the competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 