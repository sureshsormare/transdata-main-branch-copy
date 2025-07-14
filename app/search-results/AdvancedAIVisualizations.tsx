"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Globe, 
  Target, 
  Zap,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface AIVisualizationProps {
  searchTerm: string;
  analytics: any;
  isVisible: boolean;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }>;
}

export default function AdvancedAIVisualizations({ searchTerm, analytics, isVisible }: AIVisualizationProps) {
  const [activeTab, setActiveTab] = useState('market-trends');
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);

  useEffect(() => {
    if (isVisible && analytics) {
      generateAIInsights();
    }
  }, [isVisible, analytics]);

  const generateAIInsights = async () => {
    setIsLoading(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = [
      {
        id: 1,
        type: 'opportunity',
        title: 'Market Expansion Opportunity',
        description: 'High growth potential in emerging markets with 25% YoY increase',
        confidence: 0.92,
        impact: 'high',
        recommendation: 'Consider expanding to Southeast Asian markets',
        icon: TrendingUp,
        color: 'green'
      },
      {
        id: 2,
        type: 'risk',
        title: 'Supply Chain Concentration Risk',
        description: 'Top 3 suppliers control 65% of market share',
        confidence: 0.88,
        impact: 'medium',
        recommendation: 'Diversify supplier base to reduce dependency',
        icon: AlertTriangle,
        color: 'orange'
      },
      {
        id: 3,
        type: 'trend',
        title: 'Price Volatility Trend',
        description: 'Price fluctuations increased by 15% in last quarter',
        confidence: 0.85,
        impact: 'medium',
        recommendation: 'Implement price hedging strategies',
        icon: Activity,
        color: 'blue'
      },
      {
        id: 4,
        type: 'opportunity',
        title: 'Technology Adoption Gap',
        description: 'Digital transformation opportunities in supply chain',
        confidence: 0.78,
        impact: 'high',
        recommendation: 'Invest in blockchain and IoT solutions',
        icon: Zap,
        color: 'purple'
      }
    ];
    
    setAiInsights(insights);
    setIsLoading(false);
  };

  const tabs = [
    { id: 'market-trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'competitive-analysis', label: 'Competitive Analysis', icon: Target },
    { id: 'geographic-insights', label: 'Geographic Insights', icon: Globe },
    { id: 'ai-predictions', label: 'AI Predictions', icon: Brain },
    { id: 'risk-assessment', label: 'Risk Assessment', icon: AlertTriangle }
  ];

  const renderMarketTrendsChart = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        Market Growth Trends
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Rate Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-700">Growth Rate</span>
            <span className={`text-lg font-bold ${analytics?.marketGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics?.marketGrowth >= 0 ? '+' : ''}{analytics?.marketGrowth?.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(Math.abs(analytics?.marketGrowth || 0), 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            {analytics?.marketGrowth >= 0 ? 'Expanding market' : 'Declining market'}
          </p>
        </div>

        {/* Price Volatility Chart */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-orange-700">Price Volatility</span>
            <span className="text-lg font-bold text-orange-600">
              {analytics?.priceVolatility?.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(analytics?.priceVolatility || 0, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-orange-600 mt-2">
            {analytics?.priceVolatility < 20 ? 'Stable pricing' : 'High volatility'}
          </p>
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Monthly Trend Analysis</h4>
        <div className="relative h-32">
          <svg className="w-full h-full">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={`ai-grid-${i}`}
                x1="0"
                y1={i * 32}
                x2="100%"
                y2={i * 32}
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Trend line */}
            <polyline
              points="0,96 20,80 40,64 60,48 80,32 100,16"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              opacity="0.8"
            />
            
            {/* Data points */}
            {[0, 20, 40, 60, 80, 100].map((x, i) => (
              <circle
                key={`ai-data-${i}`}
                cx={`${x}%`}
                cy={96 - i * 16}
                r="3"
                fill="#3B82F6"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );

  const renderCompetitiveAnalysisChart = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-600" />
        Competitive Landscape
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Share Pie Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-700 mb-3">Market Share Distribution</h4>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Pie chart segments */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="20"
                strokeDasharray="251.2"
                strokeDashoffset="75.36"
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#EC4899"
                strokeWidth="20"
                strokeDasharray="251.2"
                strokeDashoffset="125.6"
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="20"
                strokeDasharray="251.2"
                strokeDashoffset="175.84"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-purple-700">65%</span>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Top 3 Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded"></div>
              <span>Mid-tier Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Others</span>
            </div>
          </div>
        </div>

        {/* Competitive Intensity */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-green-700 mb-3">Competitive Intensity</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-600">Supplier Diversity</span>
                <span className="text-xs font-bold text-green-700">
                  {analytics?.competitiveAnalysis?.supplierDiversity?.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${analytics?.competitiveAnalysis?.supplierDiversity || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-600">Market Concentration</span>
                <span className="text-xs font-bold text-green-700">
                  {analytics?.competitiveAnalysis?.marketConcentration?.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${analytics?.competitiveAnalysis?.marketConcentration || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeographicInsightsChart = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-indigo-600" />
        Geographic Market Analysis
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Export Countries */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-indigo-700 mb-3">Top Export Countries</h4>
          <div className="space-y-2">
            {analytics?.marketShare?.top5Countries?.slice(0, 5).map((country: any, index: number) => (
              <div key={`ai-country-${index}`} className="flex items-center justify-between">
                <span className="text-xs text-indigo-600">{country.country}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-indigo-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${country.share}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700">{country.share.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trade Routes */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-teal-700 mb-3">Key Trade Routes</h4>
          <div className="space-y-2">
            {analytics?.tradeRoutes?.slice(0, 5).map((route: any, index: number) => (
              <div key={`ai-route-${index}`} className="flex items-center justify-between p-2 bg-white rounded border border-teal-200">
                <div className="text-xs text-teal-700">
                  <div className="font-medium">{route.origin} → {route.destination}</div>
                  <div className="text-teal-600">{route.count} shipments</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-teal-700">
                    ${(route.value / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-teal-600">{route.frequency.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIPredictionsChart = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-violet-600" />
        AI-Powered Predictions
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Forecast */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-violet-700 mb-3">6-Month Growth Forecast</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-violet-600">Predicted Growth</span>
              <span className="text-lg font-bold text-violet-700">
                +{(analytics?.marketGrowth * 1.2).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-violet-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(analytics?.marketGrowth * 1.2 || 0, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-violet-600">
              Based on historical trends and market indicators
            </p>
          </div>
        </div>

        {/* Risk Predictions */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-red-700 mb-3">Risk Assessment</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-red-600">Supply Chain Risk</span>
              <span className="text-xs font-bold text-red-700">
                {analytics?.riskAssessment?.supplyChainRisk}/100
              </span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${analytics?.riskAssessment?.supplyChainRisk || 0}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-red-600">Market Risk</span>
              <span className="text-xs font-bold text-red-700">
                {analytics?.riskAssessment?.marketRisk}/100
              </span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${analytics?.riskAssessment?.marketRisk || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRiskAssessmentChart = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        Risk Assessment Matrix
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Matrix */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-red-700 mb-3">Risk Categories</h4>
          <div className="space-y-3">
            {[
              { name: 'Supply Chain', value: analytics?.riskAssessment?.supplyChainRisk, color: 'red' },
              { name: 'Regulatory', value: analytics?.riskAssessment?.regulatoryRisk, color: 'orange' },
              { name: 'Market', value: analytics?.riskAssessment?.marketRisk, color: 'yellow' },
              { name: 'Currency', value: analytics?.riskAssessment?.currencyRisk, color: 'green' }
            ].map((risk, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-red-600">{risk.name}</span>
                  <span className="text-xs font-bold text-red-700">{risk.value}/100</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div 
                    className={`bg-${risk.color}-500 h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${risk.value || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Risk Score */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Overall Risk Score</h4>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              analytics?.riskAssessment?.overallRisk === 'Low' ? 'text-green-600' :
              analytics?.riskAssessment?.overallRisk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analytics?.riskAssessment?.overallRisk}
            </div>
            <p className="text-xs text-gray-600">
              {analytics?.riskAssessment?.overallRisk === 'Low' ? 'Low risk environment' :
               analytics?.riskAssessment?.overallRisk === 'Medium' ? 'Moderate risk level' : 'High risk environment'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        AI-Generated Insights
      </h3>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Generating AI insights...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.color === 'green' ? 'border-green-500 bg-green-50' :
                  insight.color === 'orange' ? 'border-orange-500 bg-orange-50' :
                  insight.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                  'border-purple-500 bg-purple-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${
                    insight.color === 'green' ? 'text-green-600' :
                    insight.color === 'orange' ? 'text-orange-600' :
                    insight.color === 'blue' ? 'text-blue-600' :
                    'text-purple-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Confidence: {insight.confidence * 100}%</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mt-2 font-medium">
                      💡 {insight.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'market-trends' && renderMarketTrendsChart()}
          {activeTab === 'competitive-analysis' && renderCompetitiveAnalysisChart()}
          {activeTab === 'geographic-insights' && renderGeographicInsightsChart()}
          {activeTab === 'ai-predictions' && renderAIPredictionsChart()}
          {activeTab === 'risk-assessment' && renderRiskAssessmentChart()}
        </motion.div>
      </AnimatePresence>

      {/* AI Insights Section */}
      {renderAIInsights()}
    </motion.div>
  );
} 