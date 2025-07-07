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
}

export default function AIAnalyticsPanel({ searchTerm, isVisible }: AIAnalyticsPanelProps) {
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
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900">🤖 AI-Powered Market Intelligence</h3>
              <p className="text-sm text-purple-700">Advanced analytics and predictions for "{searchTerm}"</p>
            </div>
          </div>
          <button
            onClick={fetchAIAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh AI</span>
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-purple-700">AI is analyzing market data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">Error: {error}</span>
            </div>
          </div>
        )}

        {aiData && (
          <div className="space-y-6">
            {/* AI Market Predictions */}
            <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
              <button
                onClick={() => toggleSection('predictions')}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">AI Market Predictions</h4>
                  <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    {aiData.predictions.length} predictions
                  </span>
                </div>
                {expandedSections.has('predictions') ? (
                  <ChevronUp className="w-5 h-5 text-purple-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-600" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.has('predictions') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aiData.predictions.map((prediction, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-purple-900">{prediction.type}</h5>
                            <span className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                              {prediction.confidence}%
                            </span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-bold text-purple-800">
                              {prediction.value > 0 ? '+' : ''}{prediction.value.toFixed(1)}%
                            </p>
                            <p className="text-sm text-purple-700">{prediction.timeframe}</p>
                            <div className="bg-purple-100 p-2 rounded">
                              <p className="text-xs text-purple-800">{prediction.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Market Anomalies */}
            {aiData.anomalies.length > 0 && (
              <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
                <button
                  onClick={() => toggleSection('anomalies')}
                  className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Market Anomalies Detected</h4>
                    <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
                      {aiData.anomalies.length} alerts
                    </span>
                  </div>
                  {expandedSections.has('anomalies') ? (
                    <ChevronUp className="w-5 h-5 text-red-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-red-600" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.has('anomalies') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4"
                    >
                      <div className="space-y-3">
                        {aiData.anomalies.map((anomaly, index) => (
                          <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${getSeverityColor(anomaly.severity)}`}>
                                  {anomaly.severity.toUpperCase()}
                                </span>
                                <span className="text-sm font-semibold text-red-900">{anomaly.type.replace('_', ' ')}</span>
                              </div>
                              <span className={`text-sm font-bold ${getConfidenceColor(anomaly.confidence)}`}>
                                {anomaly.confidence}%
                              </span>
                            </div>
                            <p className="text-sm text-red-800 mb-2">{anomaly.description}</p>
                            <p className="text-xs text-red-700 mb-2"><strong>Impact:</strong> {anomaly.impact}</p>
                            <div className="bg-white p-2 rounded border border-red-200">
                              <p className="text-xs text-red-800"><strong>Suggested Action:</strong> {anomaly.suggestedAction}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* AI Supplier Recommendations */}
            <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
              <button
                onClick={() => toggleSection('suppliers')}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">AI Supplier Intelligence</h4>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {aiData.supplierRecommendations.length} suppliers analyzed
                  </span>
                </div>
                {expandedSections.has('suppliers') ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.has('suppliers') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
                  >
                    <div className="space-y-4">
                      {aiData.supplierRecommendations.slice(0, 5).map((supplier, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-blue-900">{supplier.supplierName}</h5>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${getScoreColor(supplier.score)}`}>
                                {supplier.score.toFixed(0)}
                              </span>
                              <span className="text-xs text-blue-600">/100</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-center">
                              <p className="text-xs text-blue-600">Reliability</p>
                              <p className="text-sm font-bold text-blue-800">{supplier.reliability.toFixed(0)}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-blue-600">Price</p>
                              <p className="text-sm font-bold text-blue-800">{supplier.priceCompetitiveness.toFixed(0)}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-blue-600">Delivery</p>
                              <p className="text-sm font-bold text-blue-800">{supplier.deliveryPerformance.toFixed(0)}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-blue-600">Quality</p>
                              <p className="text-sm font-bold text-blue-800">{supplier.qualityRating.toFixed(0)}%</p>
                            </div>
                          </div>
                          
                          <div className="bg-white p-2 rounded border border-blue-200">
                            <p className="text-xs text-blue-800"><strong>AI Recommendation:</strong> {supplier.recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Predictive Insights */}
            <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
              <button
                onClick={() => toggleSection('insights')}
                className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Predictive Insights</h4>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                    {aiData.predictiveInsights.length} insights
                  </span>
                </div>
                {expandedSections.has('insights') ? (
                  <ChevronUp className="w-5 h-5 text-green-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-green-600" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.has('insights') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiData.predictiveInsights.map((insight, index) => (
                        <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-green-900">{insight.category}</h5>
                            <span className={`text-sm font-bold ${getConfidenceColor(insight.probability)}`}>
                              {insight.probability}%
                            </span>
                          </div>
                          <p className="text-sm text-green-800 mb-2">{insight.prediction}</p>
                          <div className="space-y-1 text-xs text-green-700">
                            <p><strong>Timeframe:</strong> {insight.timeframe}</p>
                            <p><strong>Data Points:</strong> {insight.dataPoints.toLocaleString()}</p>
                            <p><strong>Methodology:</strong> {insight.methodology}</p>
                          </div>
                          <div className="mt-3 bg-green-100 p-2 rounded">
                            <p className="text-xs text-green-800"><strong>Business Impact:</strong> {insight.businessImpact}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Optimization Opportunities */}
            {aiData.optimizationOpportunities.length > 0 && (
              <div className="bg-white rounded-lg border border-orange-200 overflow-hidden">
                <button
                  onClick={() => toggleSection('optimization')}
                  className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-900">AI Optimization Opportunities</h4>
                    <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      {aiData.optimizationOpportunities.length} opportunities
                    </span>
                  </div>
                  {expandedSections.has('optimization') ? (
                    <ChevronUp className="w-5 h-5 text-orange-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-orange-600" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.has('optimization') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4"
                    >
                      <div className="space-y-4">
                        {aiData.optimizationOpportunities.map((opportunity, index) => (
                          <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold text-orange-900">{opportunity.type}</h5>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-orange-600">{opportunity.potential.toFixed(1)}%</span>
                                <span className="text-xs text-orange-600">potential</span>
                              </div>
                            </div>
                            <p className="text-sm text-orange-800 mb-2">{opportunity.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-orange-700">
                              <div>
                                <p><strong>Implementation:</strong> {opportunity.implementation}</p>
                              </div>
                              <div>
                                <p><strong>Timeframe:</strong> {opportunity.timeframe}</p>
                              </div>
                            </div>
                            <div className="mt-3 bg-orange-100 p-2 rounded">
                              <p className="text-xs text-orange-800">
                                <strong>Confidence:</strong> {opportunity.confidence}% - {opportunity.confidence >= 80 ? 'High' : opportunity.confidence >= 60 ? 'Medium' : 'Low'} confidence
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* AI Methodology Explanation */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                🤖 AI Methodology & Data Science
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded border border-indigo-200">
                  <h5 className="font-semibold text-indigo-900 mb-2">Machine Learning Models</h5>
                  <ul className="text-indigo-800 space-y-1">
                    <li>• Time Series Analysis for trend prediction</li>
                    <li>• Anomaly Detection using statistical methods</li>
                    <li>• Supplier scoring with multi-factor analysis</li>
                    <li>• Price forecasting with volatility modeling</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded border border-indigo-200">
                  <h5 className="font-semibold text-indigo-900 mb-2">Data Science Approach</h5>
                  <ul className="text-indigo-800 space-y-1">
                    <li>• Real-time data processing and analysis</li>
                    <li>• Pattern recognition and correlation analysis</li>
                    <li>• Risk assessment using probabilistic models</li>
                    <li>• Continuous learning and model improvement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 