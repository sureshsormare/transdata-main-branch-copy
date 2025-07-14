"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
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
  Star,
  Award,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface AIPrediction {
  type: string;
  value: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendation: string;
}

interface MarketAnomaly {
  type: 'price_spike' | 'volume_drop' | 'supplier_change' | 'regulatory_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  suggestedAction: string;
  confidence: number;
}

interface AISupplierRecommendation {
  supplierName: string;
  score: number;
  reliability: number;
  priceCompetitiveness: number;
  deliveryPerformance: number;
  qualityRating: number;
  riskFactors: string[];
  opportunities: string[];
  recommendation: string;
}

interface PredictiveInsight {
  category: string;
  prediction: string;
  probability: number;
  timeframe: string;
  dataPoints: number;
  methodology: string;
  businessImpact: string;
}

interface AIAnalyticsData {
  predictions: AIPrediction[];
  anomalies: MarketAnomaly[];
  supplierRecommendations: AISupplierRecommendation[];
  predictiveInsights: PredictiveInsight[];
  marketIntelligence: any;
  riskAssessment: any;
  optimizationOpportunities: any[];
}

interface AIAnalyticsPanelProps {
  searchTerm: string;
  isVisible: boolean;
  aggregates?: any;
}

export default function AIAnalyticsPanel({ searchTerm, isVisible, aggregates }: AIAnalyticsPanelProps) {
  const [aiData, setAiData] = useState<AIAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['predictions']));

  useEffect(() => {
    if (isVisible && searchTerm && !aiData) {
      fetchAIAnalytics();
    }
  }, [isVisible, searchTerm, aiData]);

  const fetchAIAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/ai-analytics?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Failed to fetch AI analytics');
      
      const data = await response.json();
      setAiData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AI analytics');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-blue-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper function to format numbers for display
  const formatNumber = (value: number, type: string = 'percentage') => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } else if (type === 'units') {
      return value.toLocaleString();
    } else if (type === 'percentage') {
      return `${value.toFixed(2)}%`;
    } else if (type === 'decimal') {
      return value.toFixed(2);
    } else if (type === 'integer') {
      return value.toLocaleString();
    } else {
      return value.toLocaleString();
    }
  };

  // Helper function to format percentages with proper sign
  const formatPercentage = (value: number, showSign: boolean = true) => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Helper function to format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Helper function to format large numbers with K, Mn, Bn suffixes
  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}Bn`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}Mn`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toLocaleString();
    }
  };

  // Helper function to create radar chart for supplier scores
  const createRadarChart = (supplier: AISupplierRecommendation) => {
    const size = 80;
    const center = size / 2;
    const radius = size / 2 - 10;
    
    const scores = [
      supplier.reliability,
      supplier.priceCompetitiveness,
      supplier.deliveryPerformance,
      supplier.qualityRating
    ];
    
    const points = scores.map((score, index) => {
      const angle = (index * 90 - 90) * (Math.PI / 180);
      const x = center + (score / 100) * radius * Math.cos(angle);
      const y = center + (score / 100) * radius * Math.sin(angle);
      return `${x},${y}`;
    });
    
    return (
      <svg width={size} height={size} className="mx-auto">
        {/* Background circles */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius * 0.75} fill="none" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius * 0.5} fill="none" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius * 0.25} fill="none" stroke="#E5E7EB" strokeWidth="1" />
        
        {/* Radar polygon */}
        <polygon
          points={points.join(' ')}
          fill="rgba(139, 92, 246, 0.2)"
          stroke="#8B5CF6"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, index) => {
          const [x, y] = point.split(',').map(Number);
          return (
            <circle
              key={`ai-panel-data-${index}`}
              cx={x}
              cy={y}
              r="3"
              fill="#8B5CF6"
            />
          );
        })}
      </svg>
    );
  };

  // Helper function to create confidence meter
  const createConfidenceMeter = (confidence: number) => {
    const width = 60;
    const height = 8;
    const fillWidth = (confidence / 100) * width;
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-15 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              confidence >= 90 ? 'bg-green-500' : 
              confidence >= 75 ? 'bg-blue-500' : 
              confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${fillWidth}px` }}
          />
        </div>
        <span className="text-xs font-semibold">{formatNumber(confidence, 'integer')}%</span>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border border-purple-200 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-900">🤖 AI-Powered Market Intelligence</h3>
              <p className="text-sm text-purple-700">Advanced predictive analytics and market insights for "{searchTerm}"</p>
              <div className="flex items-center gap-2 mt-1">
                {aggregates?.dateRange && (
                  <p className="text-xs text-purple-600 bg-white px-2 py-1 rounded-full inline-block">
                    📅 {aggregates.dateRange.start} - {aggregates.dateRange.end}
                  </p>
                )}
                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                  📊 Historical Analysis: 12 months
                </p>
                <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                  🔮 Forecast Period: 6 months
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchAIAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh AI</span>
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <span className="text-purple-700 font-medium">AI is analyzing market data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {aiData && (
          <div className="space-y-6">
            {/* AI Predictions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">AI Predictions</h4>
                </div>
                <button
                  onClick={() => toggleSection('predictions')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {expandedSections.has('predictions') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              <AnimatePresence>
                {expandedSections.has('predictions') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {aiData.predictions.map((prediction, index) => (
                      <div key={`ai-prediction-${index}`} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <Target className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-green-700">{prediction.type}</span>
                          </div>
                          {createConfidenceMeter(prediction.confidence)}
                        </div>
                        
                        <div className="text-center mb-3">
                          <div className="text-2xl font-bold text-green-800">
                            {prediction.type === "Demand Forecast" 
                              ? `${formatLargeNumber(prediction.value)} units`
                              : prediction.value >= 0 
                                ? `+${formatNumber(prediction.value, 'decimal')}%`
                                : `${formatNumber(prediction.value, 'decimal')}%`
                            }
                          </div>
                          <div className="flex flex-col gap-1 items-center">
                            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block" title={`Forecast period: ${prediction.timeframe}`}>
                              🔮 {prediction.timeframe} forecast
                            </div>
                            <div className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded inline-block">
                              Based on 12-month analysis
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-green-700 bg-white p-2 rounded border border-green-100">
                            <strong>Analysis Factors:</strong> {prediction.factors.slice(0, 2).join(', ')}
                          </div>
                          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                            💡 {prediction.recommendation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Market Anomalies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Market Anomalies</h4>
                </div>
                <button
                  onClick={() => toggleSection('anomalies')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {expandedSections.has('anomalies') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              <AnimatePresence>
                {expandedSections.has('anomalies') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {aiData.anomalies.map((anomaly, index) => (
                      <div key={`ai-anomaly-${index}`} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              anomaly.severity === 'critical' ? 'bg-red-500' :
                              anomaly.severity === 'high' ? 'bg-orange-500' :
                              anomaly.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            <span className="text-sm font-medium capitalize">{anomaly.type.replace('_', ' ')}</span>
                          </div>
                          {createConfidenceMeter(anomaly.confidence)}
                        </div>
                        
                        <div className="text-sm mb-2">{anomaly.description}</div>
                        <div className="text-xs opacity-75">
                          <strong>Impact:</strong> {anomaly.impact}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          <strong>Action:</strong> {anomaly.suggestedAction}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Supplier Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Factory className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">AI Supplier Recommendations</h4>
                </div>
                <button
                  onClick={() => toggleSection('suppliers')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {expandedSections.has('suppliers') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              <AnimatePresence>
                {expandedSections.has('suppliers') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {aiData.supplierRecommendations.map((supplier, index) => (
                      <div key={`ai-supplier-${index}`} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-blue-700">{supplier.supplierName}</span>
                          </div>
                          <div className={`text-lg font-bold ${getScoreColor(supplier.score)}`}>
                            {formatNumber(supplier.score, 'integer')}/100
                          </div>
                        </div>
                        
                        <div className="flex justify-center mb-3">
                          {createRadarChart(supplier)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">Reliability</div>
                            <div className="text-blue-800">{formatNumber(supplier.reliability, 'integer')}%</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">Price</div>
                            <div className="text-blue-800">{formatNumber(supplier.priceCompetitiveness, 'integer')}%</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">Delivery</div>
                            <div className="text-blue-800">{formatNumber(supplier.deliveryPerformance, 'integer')}%</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">Quality</div>
                            <div className="text-blue-800">{formatNumber(supplier.qualityRating, 'integer')}%</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-blue-600 mt-2">
                          {supplier.recommendation}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 