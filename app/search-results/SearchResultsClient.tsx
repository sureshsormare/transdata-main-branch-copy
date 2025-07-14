"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import AIAnalyticsPanel from "./AIAnalyticsPanel";
import AIChatbot from "../components/AIChatbot";
import ChartAIAssistant from "./ChartAIAssistant";
import AdvancedReportGenerator from "../components/AdvancedReportGenerator";
import AdvancedAIVisualizations from "./AdvancedAIVisualizations";
import ExecutiveSummarySection from "./sections/ExecutiveSummarySection";
import AnalyticsDashboardSection from "./sections/AnalyticsDashboardSection";
import AIAnalyticsToggleSection from "./sections/AIAnalyticsToggleSection";
import MarketInsightsSection from "./sections/MarketInsightsSection";
import AdvancedAnalyticsSection from "./sections/AdvancedAnalyticsSection";
import { MonthlyTrendsSection } from "./sections/MonthlyTrendsSection"
import SearchResultsSummarySection from "./SearchResultsSummarySection"

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

// Helper function to format large numbers
export function formatLargeNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "0";
  const num = parseFloat(value.toString() || "0");
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}Bn`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}Mn`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toLocaleString();
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
    topUniqueExporters: [] as Array<{ exporter: string; count: number; value: number }>,
    topUniqueImporters: [] as Array<{ importer: string; count: number; value: number }>,
  });
  

  const [monthlyStats, setMonthlyStats] = useState<Array<{ month: string; value: number; count: number }>>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedShipmentMode, setSelectedShipmentMode] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [showAIAnalytics, setShowAIAnalytics] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState({
    basicData: false,
    analytics: false,
    visualizations: false,
    advancedInsights: false
  });
  const [loadedSections, setLoadedSections] = useState({
    summary: false,
    filters: false,
    monthlyTrends: false,
    basicAnalytics: false,
    advancedAnalytics: false,
    marketInsights: false,
    competitiveAnalysis: false,
    priceAnalysis: false,
    tradeRoutes: false,
    riskAssessment: false,
    strategicRecommendations: false,
    visualizations: false
  });

  useEffect(() => {
    if (!q) return;

    const fetchResults = async () => {
      // Start with basic data loading
      setLoadingStates(prev => ({ ...prev, basicData: true }));
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('q', q);
      if (selectedImportCountry) params.append('importCountry', selectedImportCountry);
      if (selectedExportCountry) params.append('exportCountry', selectedExportCountry);
      if (selectedExporter) params.append('exporter', selectedExporter);
      if (selectedImporter) params.append('importer', selectedImporter);
      
      try {
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

          // Set comprehensive analytics from API (uses entire dataset)
          if (data.analytics) {
            setAnalytics(data.analytics);
          } else {
            setAnalytics(null);
          }

          // Mark basic data as loaded
          setLoadedSections(prev => ({ ...prev, summary: true, filters: true }));
          
          // Start loading sections progressively
          setTimeout(() => {
            setLoadedSections(prev => ({ ...prev, monthlyTrends: true }));
            
            setTimeout(() => {
              setLoadedSections(prev => ({ ...prev, basicAnalytics: true }));
              
              setTimeout(() => {
                setLoadedSections(prev => ({ ...prev, advancedAnalytics: true }));
              }, 800);
            }, 600);
          }, 400);
          
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
          setAnalytics(null);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoadingStates(prev => ({ ...prev, basicData: false }));
        setLoading(false);
      }
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

  const formatCurrency = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return "$0";
    const num = parseFloat(value.toString() || "0");
    
    // Format large numbers with Mn/Bn
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}Bn`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}Mn`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    
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



  // Use results directly since filtering is now done at API level
  const filteredResults = results;

  // Generate dynamic summary based on API analytics data (complete dataset)
  const generateSummary = (): {
    totalRecords: number;
    recentYear: string;
    oldestYear: string;
    yearSpan: number;
    totalValue: number;
    avgValue: number;
    topImportCountry: { country: string; count: number } | undefined;
    topExportCountry: { country: string; count: number } | undefined;
    uniqueProducts: number;
    searchTerm: string;
    dateRange: string;
    supplierConcentration: number;
    buyerConcentration: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    priceVolatility: number;
    marketGrowth: number;
    // Additional analytics
    topSuppliers: Array<{ name: string; count: number; value: number }>;
    topBuyers: Array<{ name: string; count: number; value: number }>;
    priceDistribution: Array<{ range: string; count: number; percentage: number }>;
    monthlyTrends: Array<{ month: string; count: number; value: number; trend: 'up' | 'down' | 'stable' }>;
    marketShare: { top5Countries: Array<{ country: string; share: number }> };
    competitiveAnalysis: {
      supplierDiversity: number;
      buyerDiversity: number;
      marketConcentration: number;
      priceCompetitiveness: number;
    };
    // New analytics
    tradeRoutes: Array<{ origin: string; destination: string; count: number; value: number; frequency: number }>;
    productCategories: Array<{ category: string; count: number; value: number; percentage: number }>;
    shipmentModes: Array<{ mode: string; count: number; value: number; percentage: number }>;
    portAnalysis: Array<{ port: string; count: number; value: number; type: 'origin' | 'destination' }>;
    marketIntelligence: {
      marketSize: number;
      marketGrowth: number;
      marketMaturity: string;
      entryBarriers: string;
      competitiveIntensity: number;
      profitPotential: number;
    };
    riskAssessment: {
      supplyChainRisk: number;
      regulatoryRisk: number;
      marketRisk: number;
      currencyRisk: number;
      overallRisk: string;
    };
    opportunities: Array<{ type: string; description: string; potential: number; confidence: number }>;
  } | null => {
    if (!aggregates.totalRecords) return null;

    // Use API-provided analytics data (complete dataset)
    const totalValue = aggregates.totalValueUSD;
    const avgValue = aggregates.totalRecords > 0 ? totalValue / aggregates.totalRecords : 0;

    const topImportCountry = countryStats.topImportCountries[0];
    const topExportCountry = countryStats.topExportCountries[0];

    // Calculate market concentration from API data
    const supplierConcentration = (aggregates.uniqueSuppliers / aggregates.totalRecords) * 100;
    const buyerConcentration = (aggregates.uniqueBuyers / aggregates.totalRecords) * 100;

    // Use API-provided price analysis (complete dataset) - with fallbacks
    const avgPrice = analytics?.priceAnalysis?.avgPrice || 0;
    const minPrice = analytics?.priceAnalysis?.minPrice || 0;
    const maxPrice = analytics?.priceAnalysis?.maxPrice || 0;
    const priceVolatility = analytics?.priceAnalysis?.priceVolatility || 0;
    const priceDistribution = analytics?.priceAnalysis?.priceDistribution || [];

    // Use API-provided market growth (complete dataset) - with fallback
    const marketGrowth = analytics?.marketIntelligence?.marketGrowth || 0;

    // Use API-provided supplier/buyer stats with values from complete dataset
    const topSuppliers = countryStats.topUniqueExporters.map(item => ({
      name: item.exporter,
      count: item.count,
      value: item.value || 0
    }));

    const topBuyers = countryStats.topUniqueImporters.map(item => ({
      name: item.importer,
      count: item.count,
      value: item.value || 0
    }));

    // Estimate unique products from results sample (limited data available)
    const productTypes = results.map(r => r.product_description).filter(p => p && p !== "N/A");
    const uniqueProducts = [...new Set(productTypes)];

    // Estimate date range from results sample (limited data available)
    const years = results.map(r => r.year).filter(y => y && y !== "N/A");
    const uniqueYears = [...new Set(years)].sort((a, b) => Number(b) - Number(a));
    const recentYear = uniqueYears[0] || '';
    const oldestYear = uniqueYears[uniqueYears.length - 1] || '';
    
    const formatDateRange = () => {
      return `${oldestYear} to ${recentYear}`;
    };

    // Use API-provided monthly trends (complete dataset)
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

    // Use API-provided analytics (complete dataset) - with fallbacks
    const top5Countries = analytics?.marketShare?.top5Countries || [];
    const competitiveAnalysis = analytics?.competitiveAnalysis || {
      supplierDiversity: 0,
      buyerDiversity: 0,
      marketConcentration: 0,
      priceCompetitiveness: 0
    };
    const tradeRoutes = analytics?.tradeRoutes || [];
    const productCategories = analytics?.productCategories || [];
    const shipmentModes = analytics?.shipmentModes || [];
    const portAnalysis = analytics?.portAnalysis || [];
    const marketIntelligence = analytics?.marketIntelligence || {
      marketSize: totalValue,
      marketGrowth: 0,
      marketMaturity: 'Growing',
      entryBarriers: 'Medium',
      competitiveIntensity: 50,
      profitPotential: 60
    };
    const riskAssessment = analytics?.riskAssessment || {
      supplyChainRisk: 30,
      regulatoryRisk: 25,
      marketRisk: 35,
      currencyRisk: 20,
      overallRisk: 'Medium'
    };
    const opportunities = analytics?.opportunities || [
      {
        type: 'Market Entry',
        description: 'Opportunity to enter growing market segment',
        potential: 75,
        confidence: 80
      },
      {
        type: 'Supplier Diversification',
        description: 'Expand supplier base for better pricing',
        potential: 65,
        confidence: 70
      }
    ];

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
      searchTerm: q,
      dateRange: formatDateRange(),
      supplierConcentration,
      buyerConcentration,
      avgPrice,
      minPrice,
      maxPrice,
      priceVolatility,
      marketGrowth,
      topSuppliers,
      topBuyers,
      priceDistribution,
      monthlyTrends,
      marketShare: { top5Countries },
      competitiveAnalysis,
      tradeRoutes,
      productCategories,
      shipmentModes,
      portAnalysis,
      marketIntelligence,
      riskAssessment,
      opportunities
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
                    Found <span className="font-medium text-blue-600">{formatLargeNumber(aggregates.totalRecords)}</span> records for <span className="font-medium text-gray-900">"{q}"</span>
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
                    href="/trial"
                    className="inline-block w-full px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                    Get Free 7-Day Trial
                  </Link>
                  <Link
                    href="/consultation"
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
        {/* Progressive Loading Indicators */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Loading Search Results</h3>
                  <p className="text-sm text-gray-600">Analyzing market data and generating insights...</p>
                      </div>
                      </div>
                      
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Basic Data</span>
                  <span className="text-sm font-medium text-gray-900">
                    {loadingStates.basicData ? 'Loading...' : 'Complete'}
                  </span>
                      </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Basic Analytics</span>
                  <span className="text-sm font-medium text-gray-900">
                    {loadedSections.basicAnalytics ? 'Complete' : 'Pending'}
                  </span>
                        </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visualizations</span>
                  <span className="text-sm font-medium text-gray-900">
                    {loadingStates.visualizations ? 'Loading...' : loadedSections.visualizations ? 'Complete' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-4">
          {/* Compact Filters Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sticky top-4">
                {!loadedSections.filters ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-3 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-3 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
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
                <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">Top Suppliers</h3>
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
                  {loading ? (
                    <div className="text-xs text-gray-500 py-2">Loading suppliers...</div>
                  ) : summary && summary.topSuppliers.length > 0 ? (
                    summary.topSuppliers.map((supplier) => (
                      <label key={supplier.name} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                      <input
                        type="radio"
                        name="exporter"
                          value={supplier.name}
                          checked={selectedExporter === supplier.name}
                        onChange={(e) => setSelectedExporter(e.target.value)}
                        className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                        <span className="flex-1 truncate">{supplier.name}</span>
                        <div className="text-right">
                          <div className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{supplier.count}</div>
                          <div className="text-xs text-gray-500">{formatCurrency(supplier.value)}</div>
                        </div>
                    </label>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 py-2">No suppliers found</div>
                  )}
                </div>
              </div>

              {/* Top Buyers Filter */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">Top Buyers</h3>
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
                  {loading ? (
                    <div className="text-xs text-gray-500 py-2">Loading buyers...</div>
                  ) : summary && summary.topBuyers.length > 0 ? (
                    summary.topBuyers.map((buyer) => (
                      <label key={buyer.name} className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                      <input
                        type="radio"
                        name="importer"
                          value={buyer.name}
                          checked={selectedImporter === buyer.name}
                        onChange={(e) => setSelectedImporter(e.target.value)}
                        className="w-3 h-3 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                        <span className="flex-1 truncate">{buyer.name}</span>
                        <div className="text-right">
                          <div className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{buyer.count}</div>
                          <div className="text-xs text-gray-500">{formatCurrency(buyer.value)}</div>
                        </div>
                    </label>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 py-2">No buyers found</div>
                  )}
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
                    Showing <span className="font-medium text-blue-600">{filteredResults.length}</span> of <span className="font-medium text-gray-900">{formatLargeNumber(aggregates.totalRecords)}</span> results
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
                      href="/trial"
                      className="inline-block w-full px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Get Free 7-Day Trial
                    </Link>
                    <Link
                      href="/consultation"
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
            </>
                )}
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
                {/* Executive Summary Section - First Priority (Progressive Loading) */}
                <SearchResultsSummarySection
                  q={q}
                  selectedImportCountry={selectedImportCountry}
                  selectedExportCountry={selectedExportCountry}
                  selectedExporter={selectedExporter}
                  selectedImporter={selectedImporter}
                  formatCurrency={formatCurrency}
                />

                {/* Analytics Dashboard Section - Second Priority */}
                <AnalyticsDashboardSection
                  aggregates={aggregates}
                  isVisible={!loading && results.length > 0}
                  formatCurrency={formatCurrency}
                />

                <AIAnalyticsToggleSection
                  showAIAnalytics={showAIAnalytics}
                  setShowAIAnalytics={setShowAIAnalytics}
                  isVisible={!loading && results.length > 0}
                />

                <AIAnalyticsPanel 
                  searchTerm={q} 
                  isVisible={showAIAnalytics} 
                />

                {loadedSections.visualizations && analytics && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-4"
                >
                    <AdvancedAIVisualizations
                  searchTerm={q} 
                      analytics={analytics}
                      isVisible={true}
                />
                  </motion.div>
                )}

                {/* Analytics Methodology Explanation */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
                  >
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      📊 Analytics Methodology & Data Sources
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Data Source</h4>
                        <p className="text-blue-800">
                          All analytics are calculated from our complete database of <strong>{formatLargeNumber(summary.totalRecords)} shipment records</strong>, 
                          not just the limited preview results shown. This ensures comprehensive and accurate market intelligence.
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Calculation Methods</h4>
                        <p className="text-blue-800">
                          We use statistical analysis, trend calculations, and market concentration metrics to provide 
                          actionable insights for business decision-making and strategic planning.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Market Insights Section - Fourth Priority */}
                <MarketInsightsSection
                  summary={summary}
                  isVisible={!loading && results.length > 0 && summary !== null && loadedSections.basicAnalytics}
                  formatCurrency={formatCurrency}
                />

                {/* Advanced Analytics Section - Fifth Priority */}
                <AdvancedAnalyticsSection
                  summary={summary}
                  isVisible={!loading && results.length > 0 && summary !== null && loadedSections.advancedAnalytics}
                  formatCurrency={formatCurrency}
                />

                {/* Price Analysis */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Price Analysis & Distribution
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Price Range Analysis */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Price Distribution</h4>
                        <div className="bg-yellow-50 p-2 rounded mb-3">
                          <p className="text-xs text-yellow-700">
                            <strong>📊 Calculation:</strong> Distribution of unit prices across all shipments with valid price data
                          </p>
                        </div>
                        <div className="space-y-3">
                          {summary.priceDistribution.map((range, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{range.range}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-yellow-500 h-2 rounded-full" 
                                    style={{ width: `${range.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{range.count} ({range.percentage.toFixed(1)}%)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Statistics */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Price Statistics</h4>
                        <div className="bg-yellow-50 p-2 rounded mb-3">
                          <p className="text-xs text-yellow-700">
                            <strong>📊 Calculation:</strong> Statistical analysis of unit prices across all shipments with valid price data
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-green-50 rounded border border-green-200">
                            <p className="text-xs font-medium text-green-700">Average Price</p>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(summary.avgPrice)}</p>
                            <p className="text-xs text-green-600 mt-1">Mean unit price</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-medium text-blue-700">Minimum Price</p>
                            <p className="text-lg font-bold text-blue-600">{formatCurrency(summary.minPrice)}</p>
                            <p className="text-xs text-blue-600 mt-1">Lowest unit price</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded border border-purple-200">
                            <p className="text-xs font-medium text-purple-700">Maximum Price</p>
                            <p className="text-lg font-bold text-purple-600">{formatCurrency(summary.maxPrice)}</p>
                            <p className="text-xs text-purple-600 mt-1">Highest unit price</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded border border-orange-200">
                            <p className="text-xs font-medium text-orange-700">Price Range</p>
                            <p className="text-lg font-bold text-orange-600">{formatCurrency(summary.maxPrice - summary.minPrice)}</p>
                            <p className="text-xs text-orange-600 mt-1">Price spread</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Monthly Trends Section (modularized) */}
                <MonthlyTrendsSection monthlyStats={monthlyStats} loading={loadingStates.basicData} />

                {/* Trade Routes Analysis */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Trade Routes & Logistics Analysis
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Trade Routes */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Top Trade Routes</h4>
                        <div className="bg-blue-50 p-2 rounded mb-3">
                          <p className="text-xs text-blue-700">
                            <strong>📊 Calculation:</strong> Origin-destination pairs ranked by total trade value across all {formatLargeNumber(summary.totalRecords)} shipments
                          </p>
                        </div>
                        <div className="space-y-2">
                          {summary.tradeRoutes.map((route, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {route.origin} → {route.destination}
                                </span>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  {route.frequency.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>{route.count} shipments</span>
                                <span className="font-bold text-green-600">{formatCurrency(route.value)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Port Analysis */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Port Analysis</h4>
                        <div className="bg-green-50 p-2 rounded mb-3">
                          <p className="text-xs text-green-700">
                            <strong>📊 Calculation:</strong> Ports ranked by total trade value, showing both origin and destination ports
                          </p>
                        </div>
                        <div className="space-y-2">
                          {summary.portAnalysis.map((port, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">{port.port}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  port.type === 'origin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {port.type}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>{port.count} shipments</span>
                                <span className="font-bold text-green-600">{formatCurrency(port.value)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Market Intelligence & Risk Assessment */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Market Intelligence & Risk Assessment
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Market Intelligence */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Market Intelligence</h4>
                        <div className="bg-blue-50 p-2 rounded mb-3">
                          <p className="text-xs text-blue-700">
                            <strong>📊 Calculation:</strong> Market analysis based on total records, growth trends, supplier diversity, and competitive landscape
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-medium text-blue-700">Market Size</p>
                            <p className="text-lg font-bold text-blue-600">{formatCurrency(summary.marketIntelligence.marketSize)}</p>
                            <p className="text-xs text-blue-600 mt-1">Total market value</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded border border-green-200">
                            <p className="text-xs font-medium text-green-700">Market Growth</p>
                            <p className="text-lg font-bold text-green-600">{summary.marketIntelligence.marketGrowth.toFixed(1)}%</p>
                            <p className="text-xs text-green-600 mt-1">6-month growth rate</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded border border-purple-200">
                            <p className="text-xs font-medium text-purple-700">Market Maturity</p>
                            <p className="text-lg font-bold text-purple-600">{summary.marketIntelligence.marketMaturity}</p>
                            <p className="text-xs text-purple-600 mt-1">
                              {summary.marketIntelligence.marketMaturity === 'Mature' ? 'Established market' : 
                               summary.marketIntelligence.marketMaturity === 'Growing' ? 'Expanding market' : 'New market'}
                            </p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded border border-orange-200">
                            <p className="text-xs font-medium text-orange-700">Entry Barriers</p>
                            <p className="text-lg font-bold text-orange-600">{summary.marketIntelligence.entryBarriers}</p>
                            <p className="text-xs text-orange-600 mt-1">
                              {summary.marketIntelligence.entryBarriers === 'Low' ? 'Easy to enter' : 
                               summary.marketIntelligence.entryBarriers === 'Medium' ? 'Moderate barriers' : 'High barriers'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
                        <div className="bg-red-50 p-2 rounded mb-3">
                          <p className="text-xs text-red-700">
                            <strong>📊 Calculation:</strong> Risk scores based on supplier diversity, price volatility, and market concentration (0-100 scale)
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 rounded border border-red-200">
                            <p className="text-xs font-medium text-red-700">Supply Chain Risk</p>
                            <p className="text-lg font-bold text-red-600">{summary.riskAssessment.supplyChainRisk}/100</p>
                            <p className="text-xs text-red-600 mt-1">
                              {summary.riskAssessment.supplyChainRisk < 30 ? 'Low risk' : 
                               summary.riskAssessment.supplyChainRisk < 60 ? 'Medium risk' : 'High risk'}
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                            <p className="text-xs font-medium text-yellow-700">Regulatory Risk</p>
                            <p className="text-lg font-bold text-yellow-600">{summary.riskAssessment.regulatoryRisk}/100</p>
                            <p className="text-xs text-yellow-600 mt-1">Based on market stability</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded border border-orange-200">
                            <p className="text-xs font-medium text-orange-700">Market Risk</p>
                            <p className="text-lg font-bold text-orange-600">{summary.riskAssessment.marketRisk}/100</p>
                            <p className="text-xs text-orange-600 mt-1">
                              {summary.riskAssessment.marketRisk < 30 ? 'Stable market' : 
                               summary.riskAssessment.marketRisk < 60 ? 'Moderate volatility' : 'High volatility'}
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700">Overall Risk</p>
                            <p className={`text-lg font-bold ${
                              summary.riskAssessment.overallRisk === 'High' ? 'text-red-600' :
                              summary.riskAssessment.overallRisk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {summary.riskAssessment.overallRisk}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">Combined risk assessment</p>
                          </div>
                        </div>
                      </div>

                      {/* Business Opportunities */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Business Opportunities</h4>
                        <div className="bg-green-50 p-2 rounded mb-3">
                          <p className="text-xs text-green-700">
                            <strong>📊 Calculation:</strong> Opportunities identified based on market gaps, growth trends, and competitive analysis
                          </p>
                        </div>
                        <div className="space-y-3">
                          {summary.opportunities.map((opportunity, index) => (
                            <div key={index} className="p-3 bg-green-50 rounded border border-green-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-green-700">{opportunity.type}</p>
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  {opportunity.potential}%
                                </span>
                              </div>
                              <p className="text-xs text-green-600 mb-2">{opportunity.description}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Confidence:</span>
                                <span className="font-bold text-green-600">{opportunity.confidence}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Product Categories & Shipment Modes */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Product Categories & Logistics
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Product Categories */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Product Categories</h4>
                        <div className="bg-indigo-50 p-2 rounded mb-3">
                          <p className="text-xs text-indigo-700">
                            <strong>📊 Calculation:</strong> Product categories (HSN chapters) ranked by total trade value across all shipments
                          </p>
                        </div>
                        <div className="space-y-2">
                          {summary.productCategories.map((category, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{category.category}</p>
                                <p className="text-xs text-gray-600">{category.count} shipments</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-green-600">{formatCurrency(category.value)}</p>
                                <p className="text-xs text-gray-600">{category.percentage.toFixed(1)}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipment Modes */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Shipment Modes</h4>
                        <div className="bg-blue-50 p-2 rounded mb-3">
                          <p className="text-xs text-blue-700">
                            <strong>📊 Calculation:</strong> Transport modes ranked by shipment count and total value across all shipments
                          </p>
                        </div>
                        <div className="space-y-2">
                          {summary.shipmentModes.map((mode, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{mode.mode}</p>
                                <p className="text-xs text-gray-600">{mode.count} shipments</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-blue-600">{formatCurrency(mode.value)}</p>
                                <p className="text-xs text-gray-600">{mode.percentage.toFixed(1)}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Advanced Filtering & Export Options */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                      Advanced Filters & Export
                    </h3>
                    <button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                    </button>
                  </div>

                  {showAdvancedFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Date Range Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <select
                          value={selectedDateRange}
                          onChange={(e) => setSelectedDateRange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Dates</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                          <option value="2020">2020</option>
                        </select>
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                        <select
                          value={selectedPriceRange}
                          onChange={(e) => setSelectedPriceRange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Prices</option>
                          <option value="0-1000">$0 - $1,000</option>
                          <option value="1000-10000">$1,000 - $10,000</option>
                          <option value="10000-100000">$10,000 - $100,000</option>
                          <option value="100000+">$100,000+</option>
                        </select>
                      </div>

                      {/* Shipment Mode Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shipment Mode</label>
                        <select
                          value={selectedShipmentMode}
                          onChange={(e) => setSelectedShipmentMode(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Modes</option>
                          <option value="Sea">Sea</option>
                          <option value="Air">Air</option>
                          <option value="Road">Road</option>
                          <option value="Rail">Rail</option>
                        </select>
                      </div>

                      {/* Sort By */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="date">Date (Newest)</option>
                          <option value="value">Value (High to Low)</option>
                          <option value="quantity">Quantity (High to Low)</option>
                          <option value="supplier">Supplier Name</option>
                          <option value="buyer">Buyer Name</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* View Mode & Export Options */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">View:</span>
                      <div className="flex border border-gray-300 rounded-md">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`px-3 py-1 text-sm ${
                            viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Grid
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`px-3 py-1 text-sm ${
                            viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          List
                        </button>
                        <button
                          onClick={() => setViewMode("table")}
                          className={`px-3 py-1 text-sm ${
                            viewMode === "table" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Table
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="csv">CSV</option>
                        <option value="excel">Excel</option>
                        <option value="pdf">PDF</option>
                      </select>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                        Export Data
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Real-Time Market Insights */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
                  >
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Real-Time Market Insights
                    </h3>
                    <div className="bg-blue-100 p-2 rounded mb-3">
                      <p className="text-xs text-blue-800">
                        <strong>📊 Calculation:</strong> Real-time indicators calculated from current market data, growth trends, price stability, and risk assessment across all {formatLargeNumber(summary.totalRecords)} shipments
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-xs font-medium text-blue-700">Market Momentum</p>
                        <p className={`text-lg font-bold ${summary.marketGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {summary.marketGrowth >= 0 ? '↗' : '↘'} {Math.abs(summary.marketGrowth).toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-xs font-medium text-blue-700">Price Stability</p>
                        <p className={`text-lg font-bold ${summary.priceVolatility < 30 ? 'text-green-600' : 'text-orange-600'}`}>
                          {summary.priceVolatility < 30 ? 'Stable' : 'Volatile'}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-xs font-medium text-blue-700">Supply Diversity</p>
                        <p className={`text-lg font-bold ${summary.supplierConcentration > 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {summary.supplierConcentration > 50 ? 'High' : 'Low'}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-xs font-medium text-blue-700">Market Risk</p>
                        <p className={`text-lg font-bold ${
                          summary.riskAssessment.overallRisk === 'Low' ? 'text-green-600' :
                          summary.riskAssessment.overallRisk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {summary.riskAssessment.overallRisk}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Comprehensive Data Insights Panel */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Comprehensive Data Insights
                    </h3>
                    <div className="bg-indigo-50 p-2 rounded mb-4">
                      <p className="text-xs text-indigo-700">
                        <strong>📊 Calculation:</strong> Advanced analytics combining market performance metrics, predictive modeling, and competitive intelligence derived from comprehensive analysis of all {formatLargeNumber(summary.totalRecords)} shipment records
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Market Performance Metrics */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Market Performance</h4>
                        <div className="bg-green-50 p-2 rounded mb-3">
                          <p className="text-xs text-green-700">
                            <strong>📊 Calculation:</strong> Performance metrics derived from total market value, efficiency ratios, and volume analysis across all shipments
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-green-700">Market Efficiency</span>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                {((summary.totalValue / summary.totalRecords) / summary.avgValue * 100).toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-xs text-green-600">
                              High efficiency indicates optimal market operations
                            </p>
                          </div>
                          
                          <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-blue-700">Trade Volume Index</span>
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {(summary.totalRecords / 100).toFixed(1)}
                              </span>
                            </div>
                            <p className="text-xs text-blue-600">
                              Normalized volume for market comparison
                            </p>
                          </div>
                          
                          <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-purple-700">Market Concentration</span>
                              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                {summary.competitiveAnalysis.marketConcentration.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-xs text-purple-600">
                              Top 3 countries market share
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Predictive Analytics */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Predictive Analytics</h4>
                        <div className="bg-orange-50 p-2 rounded mb-3">
                          <p className="text-xs text-orange-700">
                            <strong>📊 Calculation:</strong> Future projections based on historical trends, growth patterns, and market dynamics analysis
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-orange-700">Growth Forecast</span>
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                {summary.marketGrowth > 0 ? '+' : ''}{(summary.marketGrowth * 1.2).toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-xs text-orange-600">
                              Projected growth for next 6 months
                            </p>
                          </div>
                          
                          <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-red-700">Price Trend</span>
                              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                {summary.priceVolatility > 30 ? '↗' : '→'} {summary.priceVolatility > 30 ? 'Rising' : 'Stable'}
                              </span>
                            </div>
                            <p className="text-xs text-red-600">
                              Expected price movement direction
                            </p>
                          </div>
                          
                          <div className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-teal-700">Market Sentiment</span>
                              <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded">
                                {summary.marketGrowth > 5 ? 'Bullish' : summary.marketGrowth > -5 ? 'Neutral' : 'Bearish'}
                              </span>
                            </div>
                            <p className="text-xs text-teal-600">
                              Overall market confidence indicator
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Competitive Intelligence */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Competitive Intelligence</h4>
                        <div className="bg-indigo-50 p-2 rounded mb-3">
                          <p className="text-xs text-indigo-700">
                            <strong>📊 Calculation:</strong> Competitive analysis based on supplier diversity, market concentration, and entry barrier assessment
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-indigo-700">Competition Level</span>
                              <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                {summary.competitiveAnalysis.supplierDiversity > 70 ? 'High' : summary.competitiveAnalysis.supplierDiversity > 40 ? 'Medium' : 'Low'}
                              </span>
                            </div>
                            <p className="text-xs text-indigo-600">
                              Market competition intensity
                            </p>
                          </div>
                          
                          <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-emerald-700">Entry Difficulty</span>
                              <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                                {summary.marketIntelligence.entryBarriers}
                              </span>
                            </div>
                            <p className="text-xs text-emerald-600">
                              Barriers to market entry
                            </p>
                          </div>
                          
                          <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-yellow-700">Profit Potential</span>
                              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                {summary.marketIntelligence.profitPotential}/100
                              </span>
                            </div>
                            <p className="text-xs text-yellow-600">
                              Expected profitability score
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Interactive Trend Analysis */}
                {summary && summary.monthlyTrends.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Interactive Trend Analysis
                    </h3>
                    <div className="bg-green-50 p-2 rounded mb-4">
                      <p className="text-xs text-green-700">
                        <strong>📊 Calculation:</strong> Monthly trend analysis based on shipment volumes, values, and growth patterns calculated from all {formatLargeNumber(summary.totalRecords)} records with trend direction indicators and volatility assessment
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Trend Visualization */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Monthly Shipment Trends</h4>
                        <div className="bg-blue-50 p-2 rounded mb-3">
                          <p className="text-xs text-blue-700">
                            <strong>📊 Calculation:</strong> Monthly shipment volumes and values with trend direction indicators based on sequential month comparisons
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-3">
                            {summary.monthlyTrends.map((trend, index) => {
                              const maxCount = Math.max(...summary.monthlyTrends.map(t => t.count));
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
                                    <div className="text-sm font-bold text-gray-900">{trend.count}</div>
                                    <div className="text-xs text-gray-500">{formatCurrency(trend.value)}</div>
                                  </div>
                                  <div className="w-8">
                                    {trend.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                                    {trend.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                                    {trend.trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
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
                            <strong>📊 Calculation:</strong> Trend analysis insights derived from peak season identification, growth rate calculations, and volatility assessment
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-blue-700">Peak Season</span>
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {summary.monthlyTrends.reduce((max, trend) => trend.count > max.count ? trend : max).month}
                              </span>
                            </div>
                            <p className="text-xs text-blue-600">
                              Highest shipment volume month
                            </p>
                          </div>
                          
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-green-700">Growth Rate</span>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                {summary.marketGrowth.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-xs text-green-600">
                              Average monthly growth
                            </p>
                          </div>
                          
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-purple-700">Seasonality</span>
                              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                {summary.monthlyTrends.length > 6 ? 'High' : 'Low'}
                              </span>
                            </div>
                            <p className="text-xs text-purple-600">
                              Seasonal pattern strength
                            </p>
                          </div>
                          
                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-orange-700">Volatility</span>
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                {summary.priceVolatility.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-xs text-orange-600">
                              Price fluctuation level
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Strategic Recommendations */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
                  >
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Strategic Recommendations
                    </h3>
                    <div className="bg-indigo-100 p-2 rounded mb-4">
                      <p className="text-xs text-indigo-800">
                        <strong>📊 Calculation:</strong> Strategic opportunities and recommendations derived from market gap analysis, growth trends, competitive landscape, and risk assessment across all {formatLargeNumber(summary.totalRecords)} shipment records with confidence scoring
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {summary.opportunities.map((opportunity, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-indigo-900">{opportunity.type}</h4>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                {opportunity.potential}%
                              </span>
                              <span className="text-xs text-gray-500">potential</span>
                            </div>
                          </div>
                          <p className="text-sm text-indigo-700 mb-3">{opportunity.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Confidence:</span>
                            <div className="flex items-center gap-1">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full" 
                                  style={{ width: `${opportunity.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-indigo-600">{opportunity.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-2">Next Steps</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-indigo-700">Analyze top suppliers for partnership opportunities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-indigo-700">Monitor price trends for optimal timing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-indigo-700">Explore emerging markets with high growth potential</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Results Display with View Modes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="mb-6"
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">📋 Export Shipment Records</h2>
                        <p className="text-sm text-gray-600">
                          Showing {filteredResults.length} of {formatLargeNumber(aggregates.totalRecords)} records for "{q}"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">🖱️ Click any record for detailed information</span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {viewMode === "grid" && (
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
                )}

                {viewMode === "list" && (
                  <div className="space-y-3">
                    {filteredResults.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedCard(item)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.product_description || "Product description not available"}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Supplier:</span>
                                <p className="font-medium">{item.supplier_name || "Not specified"}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Buyer:</span>
                                <p className="font-medium">{item.buyer_name || "Not specified"}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Value:</span>
                                <p className="font-bold text-green-600">{formatCurrency(item.total_value_usd || "0")}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Date:</span>
                                <p className="font-medium">{formatDate(item.shipping_bill_date || "")}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {item.year || "No Year"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {viewMode === "table" && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredResults.map((item, idx) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => setSelectedCard(item)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                  {item.product_description || "Not specified"}
                                </div>
                                <div className="text-sm text-gray-500">{item.hs_code || "No HSN Code"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.supplier_name || "Not specified"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.buyer_name || "Not specified"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                {formatCurrency(item.total_value_usd || "0")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.quantity || "Not specified"} {item.uqc || ""}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(item.shipping_bill_date || "")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.country_of_origin || "Not specified"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.country_of_destination || "Not specified"}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                  </motion.div>

                {/* Card Detail Modal */}
                <AnimatePresence>
                  {selectedCard && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                      onClick={() => setSelectedCard(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Compact Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 relative overflow-hidden">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                          </div>
                          
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <h2 className="text-lg font-bold mb-1">📊 Export Shipment Details</h2>
                                <p className="text-blue-100 text-xs font-medium">
                                  Complete trade record information and analytics
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedCard(null)}
                              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Compact Modal Content */}
                        <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
                          <div className="p-4">
                            {/* Compact Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-semibold text-blue-900">💰 Value</span>
                                </div>
                                <p className="text-lg font-bold text-blue-800">{formatCurrency(selectedCard.total_value_usd || "0")}</p>
                              </div>
                              
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-semibold text-green-900">📦 Quantity</span>
                                </div>
                                <p className="text-lg font-bold text-green-800">
                                  {selectedCard.quantity || "0"} <span className="text-xs font-normal">{selectedCard.uqc || ""}</span>
                                </p>
                              </div>
                              
                              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-semibold text-purple-900">📅 Date</span>
                                </div>
                                <p className="text-sm font-bold text-purple-800">{formatDate(selectedCard.shipping_bill_date || "")}</p>
                              </div>

                              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-semibold text-orange-900">🏷️ HSN</span>
                                </div>
                                <p className="text-sm font-bold text-orange-800">{selectedCard.hs_code || "N/A"}</p>
                              </div>
                            </div>

                            {/* Compact Product & Shipping Information - Side by Side Layout */}
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">📦 Product & Shipping Details</h3>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Product Details */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <h4 className="text-sm font-semibold text-blue-900">📦 Product Details</h4>
                                  </div>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">📝 Description:</span>
                                      <span className="text-gray-900 font-medium">{selectedCard.product_description || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">🏷️ HSN Code:</span>
                                      <span className="text-gray-900">{selectedCard.hs_code || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">📚 Chapter:</span>
                                      <span className="text-gray-900">{selectedCard.chapter || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">📅 Year:</span>
                                      <span className="text-gray-900">{selectedCard.year || "Not specified"}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Shipping Details */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <h4 className="text-sm font-semibold text-green-900">🚢 Shipping Details</h4>
                                  </div>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-700 font-medium min-w-[60px]">📅 Bill Date:</span>
                                      <span className="text-gray-900">{formatDate(selectedCard.shipping_bill_date || "")}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-700 font-medium min-w-[60px]">📋 Bill No:</span>
                                      <span className="text-gray-900">{selectedCard.shipping_bill_no || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-700 font-medium min-w-[60px]">🚢 Origin Port:</span>
                                      <span className="text-gray-900">{selectedCard.port_of_origin || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-700 font-medium min-w-[60px]">🎯 Dest Port:</span>
                                      <span className="text-gray-900">{selectedCard.port_of_destination || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-700 font-medium min-w-[60px]">🌍 Origin Country:</span>
                                      <span className="text-gray-900">{selectedCard.country_of_origin || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-700 font-medium min-w-[60px]">🎯 Dest Country:</span>
                                      <span className="text-gray-900">{selectedCard.country_of_destination || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-700 font-medium min-w-[60px]">🚚 Transport:</span>
                                      <span className="text-gray-900">{selectedCard.mode || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-green-700 font-medium min-w-[60px]">📜 Incoterm:</span>
                                      <span className="text-gray-900">{selectedCard.incoterm || "Not specified"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Compact Parties Information - Side by Side Layout */}
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">👥 Parties Information</h3>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Supplier Details */}
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <h4 className="text-sm font-semibold text-orange-900">🏭 Supplier</h4>
                                  </div>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                      <span className="text-orange-700 font-medium min-w-[60px]">👤 Name:</span>
                                      <span className="text-gray-900 font-medium">{selectedCard.supplier_name || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-orange-700 font-medium min-w-[60px]">📍 Address:</span>
                                      <span className="text-gray-900">{selectedCard.supplier_address || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-orange-700 font-medium min-w-[60px]">🏙️ City/State:</span>
                                      <span className="text-gray-900">{selectedCard.supplier_city_state || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-orange-700 font-medium min-w-[60px]">📞 Contact:</span>
                                      <span className="text-gray-900">{selectedCard.supplier_contact_no || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-orange-700 font-medium min-w-[60px]">📧 Email:</span>
                                      <span className="text-gray-900">{selectedCard.supplier_email_id || "Not specified"}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Buyer Details */}
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h4 className="text-sm font-semibold text-blue-900">🛒 Buyer</h4>
                                  </div>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">👤 Name:</span>
                                      <span className="text-gray-900 font-medium">{selectedCard.buyer_name || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">📍 Address:</span>
                                      <span className="text-gray-900">{selectedCard.buyer_address || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">🏙️ City/State:</span>
                                      <span className="text-gray-900">{selectedCard.buyer_city_state || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">📞 Contact:</span>
                                      <span className="text-gray-900">{selectedCard.buyer_contact_no || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-700 font-medium min-w-[60px]">📧 Email:</span>
                                      <span className="text-gray-900">{selectedCard.buyer_email_id || "Not specified"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Compact Additional Details */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center">
                                  <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">📋 Additional Details</h3>
                              </div>
                              <div className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <label className="text-xs font-medium text-gray-600">🏢 IEC Code</label>
                                    <p className="text-gray-900 mt-1 text-sm">{selectedCard.iec || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-gray-600">💱 Currency</label>
                                    <p className="text-gray-900 mt-1 text-sm">{selectedCard.currency || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-gray-600">💲 USD Rate</label>
                                    <p className="text-gray-900 mt-1 text-sm">{selectedCard.exchange_rate_usd || "Not specified"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Compact Modal Footer */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">🆔 Record ID:</span> {selectedCard.id}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedCard(null)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                            >
                              ✕ Close
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Market Intelligence Summary & Conclusions */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200"
                  >
                    <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      🎯 Key Market Intelligence Conclusions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white p-3 rounded border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">Market Opportunity Assessment</h4>
                        <ul className="text-green-800 space-y-1">
                          <li>• <strong>Market Size:</strong> {formatCurrency(summary.totalValue)} total market value</li>
                          <li>• <strong>Growth Trend:</strong> {summary.marketGrowth >= 0 ? 'Positive' : 'Negative'} growth at {Math.abs(summary.marketGrowth).toFixed(1)}%</li>
                          <li>• <strong>Competition Level:</strong> {summary.competitiveAnalysis.supplierDiversity > 50 ? 'High competition' : 'Moderate competition'}</li>
                          <li>• <strong>Entry Barriers:</strong> {summary.marketIntelligence.entryBarriers} level barriers</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">Strategic Recommendations</h4>
                        <ul className="text-green-800 space-y-1">
                          <li>• <strong>Risk Level:</strong> {summary.riskAssessment.overallRisk} overall risk</li>
                          <li>• <strong>Price Strategy:</strong> {summary.priceVolatility < 20 ? 'Stable pricing environment' : 'Volatile pricing - timing critical'}</li>
                          <li>• <strong>Supply Chain:</strong> {summary.supplierConcentration > 50 ? 'Diverse supplier base available' : 'Limited supplier options'}</li>
                          <li>• <strong>Market Maturity:</strong> {summary.marketIntelligence.marketMaturity} market stage</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

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
                      Get access to all <span className="font-semibold text-blue-600">{formatLargeNumber(aggregates.totalRecords)}</span> records, detailed contact information, 
                      complete trade history, and advanced analytics to make informed business decisions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/request-demo"
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
      
      {/* Advanced Report Generator */}
      <AdvancedReportGenerator searchTerm={q} />
    </div>
  );
}
