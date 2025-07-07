"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  Share2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Shield,
  Target,
  Zap,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  Percent,
  Activity,
  MapPin,
  Building,
  Clock,
  Star,
  Award,
  TrendingDown,
  Minus,
  Plus,
  Search,
  Filter,
  BookOpen,
  FileBarChart,
  PieChart,
  LineChart,
  BarChart,
  // Scatter,
  AreaChart
} from "lucide-react";

interface ReportViewerProps {
  fileId: string;
  searchTerm: string;
  onClose: () => void;
}

interface ReportData {
  executiveSummary: {
    keyFindings: string[];
    marketOverview: string;
    strategicRecommendations: string[];
    riskAssessment: string;
  };
  marketIntelligence: {
    marketSize: number;
    growthRate: number;
    marketMaturity: string;
    keyDrivers: string[];
    barriers: string[];
    opportunities: string[];
  };
  competitiveLandscape: {
    topSuppliers: Array<{
      name: string;
      marketShare: number;
      totalValue: number;
      transactionCount: number;
      growthRate: number;
      strengths: string[];
      weaknesses: string[];
    }>;
    topBuyers: Array<{
      name: string;
      purchaseVolume: number;
      totalSpent: number;
      transactionCount: number;
      preferences: string[];
      opportunities: string[];
    }>;
    marketConcentration: {
      hhi: number;
      interpretation: string;
      riskLevel: 'low' | 'medium' | 'high';
    };
  };
  trendAnalysis: {
    historical: any[];
    current: any[];
    forecast: any;
  };
  regionalAnalysis: Array<{
    region: string;
    marketShare: number;
    growthRate: number;
    keyPlayers: string[];
    opportunities: string[];
    challenges: string[];
  }>;
  regulatoryEnvironment: {
    currentRegulations: string[];
    upcomingChanges: string[];
    complianceRequirements: string[];
    impactAssessment: string;
  };
  supplyChainAnalysis: {
    routes: Array<{
      origin: string;
      destination: string;
      volume: number;
      efficiency: number;
      risks: string[];
    }>;
    bottlenecks: string[];
    optimizationOpportunities: string[];
  };
  pricingAnalysis: {
    priceTrends: any[];
    priceVolatility: number;
    competitivePricing: any[];
    pricingStrategies: string[];
  };
  aiInsights: Array<{
    type: string;
    title: string;
    description: string;
    impact: string;
    confidence: number;
    dataPoints: string[];
    recommendations: string[];
    visualizations: string[];
  }>;
  strategicRecommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    implementation: string[];
  };
}

interface ReportMetadata {
  searchTerm: string;
  format: string;
  fileName: string;
  createdAt: string;
  expiresAt: string;
}

export default function ReportViewer({ fileId, searchTerm, onClose }: ReportViewerProps) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [metadata, setMetadata] = useState<ReportMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/view-report/${fileId}`);
        const data = await response.json();

        if (data.success) {
          setReport(data.report);
          setMetadata(data.metadata);
        } else {
          setError(data.error || 'Failed to load report');
        }
      } catch (err) {
        setError('Failed to load report');
        console.error('Report loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [fileId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const sections = [
    { id: 'executive-summary', title: 'Executive Summary', icon: FileText },
    { id: 'market-intelligence', title: 'Market Intelligence', icon: BarChart3 },
    { id: 'competitive-landscape', title: 'Competitive Landscape', icon: Users },
    { id: 'trend-analysis', title: 'Trend Analysis', icon: TrendingUp },
    { id: 'regional-analysis', title: 'Regional Analysis', icon: Globe },
    { id: 'regulatory-environment', title: 'Regulatory Environment', icon: Shield },
    { id: 'supply-chain', title: 'Supply Chain Analysis', icon: Target },
    { id: 'pricing-analysis', title: 'Pricing Analysis', icon: DollarSign },
    { id: 'ai-insights', title: 'AI Insights', icon: Zap },
    { id: 'strategic-recommendations', title: 'Strategic Recommendations', icon: Lightbulb }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Error Loading Report</h3>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report || !metadata) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Global Pharmaceutical Trade Report
              </h1>
              <p className="text-gray-600">
                Product: {metadata.searchTerm} • Generated: {new Date(metadata.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(`/api/download-report/${fileId}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 280 }}
                exit={{ width: 0 }}
                className="border-r border-gray-200 bg-gray-50 overflow-y-auto"
              >
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Report Sections</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeSection === section.id
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{section.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                {/* Executive Summary */}
                {activeSection === 'executive-summary' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Executive Summary</h2>
                      <p className="text-gray-600">Comprehensive market analysis for {metadata.searchTerm}</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-6 h-6 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">Market Size</h3>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatCurrency(report.marketIntelligence.marketSize)}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                          <h3 className="font-semibold text-green-900">Growth Rate</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-900">
                          {formatPercentage(report.marketIntelligence.growthRate)}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-6 h-6 text-purple-600" />
                          <h3 className="font-semibold text-purple-900">Suppliers</h3>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">
                          {report.competitiveLandscape.topSuppliers.length}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Activity className="w-6 h-6 text-orange-600" />
                          <h3 className="font-semibold text-orange-900">Market Maturity</h3>
                        </div>
                        <p className="text-2xl font-bold text-orange-900">
                          {report.marketIntelligence.marketMaturity}
                        </p>
                      </div>
                    </div>

                    {/* Key Findings */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Key Findings
                      </h3>
                      <ul className="space-y-3">
                        {report.executiveSummary.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Market Overview */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        Market Overview
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {report.executiveSummary.marketOverview}
                      </p>
                    </div>

                    {/* Strategic Recommendations */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Strategic Recommendations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {report.strategicRecommendations.immediate.map((rec, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Immediate</h4>
                            <p className="text-blue-800 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Market Intelligence */}
                {activeSection === 'market-intelligence' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Market Intelligence</h2>
                      <p className="text-gray-600">Comprehensive market analysis and insights</p>
                    </div>

                    {/* Market Drivers */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Key Market Drivers
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.marketIntelligence.keyDrivers.map((driver, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <span className="text-green-800">{driver}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Opportunities */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Market Opportunities
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.marketIntelligence.opportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                            <span className="text-blue-800">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Barriers */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Market Barriers
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.marketIntelligence.barriers.map((barrier, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                            <X className="w-5 h-5 text-red-600 mt-0.5" />
                            <span className="text-red-800">{barrier}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Competitive Landscape */}
                {activeSection === 'competitive-landscape' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Competitive Landscape</h2>
                      <p className="text-gray-600">Market competition analysis and key players</p>
                    </div>

                    {/* Top Suppliers */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        Top Suppliers
                      </h3>
                      <div className="space-y-4">
                        {report.competitiveLandscape.topSuppliers.slice(0, 5).map((supplier, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                              <span className="text-sm font-medium text-blue-600">
                                {formatPercentage(supplier.marketShare)} market share
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Total Value:</span>
                                <p className="font-medium">{formatCurrency(supplier.totalValue)}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Transactions:</span>
                                <p className="font-medium">{supplier.transactionCount}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Growth Rate:</span>
                                <p className="font-medium">{formatPercentage(supplier.growthRate)}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Risk Level:</span>
                                <p className={`font-medium ${getRiskColor(supplier.marketShare > 20 ? 'high' : supplier.marketShare > 10 ? 'medium' : 'low').split(' ')[0]}`}>
                                  {supplier.marketShare > 20 ? 'High' : supplier.marketShare > 10 ? 'Medium' : 'Low'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Market Concentration */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Market Concentration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-600">
                            {report.competitiveLandscape.marketConcentration.hhi.toFixed(0)}
                          </p>
                          <p className="text-gray-600">HHI Index</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-lg font-semibold ${getRiskColor(report.competitiveLandscape.marketConcentration.riskLevel).split(' ')[0]}`}>
                            {report.competitiveLandscape.marketConcentration.riskLevel.toUpperCase()}
                          </p>
                          <p className="text-gray-600">Risk Level</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">
                            {report.competitiveLandscape.marketConcentration.interpretation}
                          </p>
                          <p className="text-gray-600">Interpretation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Continue with other sections... */}
                {activeSection !== 'executive-summary' && 
                 activeSection !== 'market-intelligence' && 
                 activeSection !== 'competitive-landscape' && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {sections.find(s => s.id === activeSection)?.title}
                    </h3>
                    <p className="text-gray-600">
                      This section is being developed. Please check back soon for comprehensive {activeSection.replace('-', ' ')} insights.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 