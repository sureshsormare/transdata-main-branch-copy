"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Sparkles, 
  Zap, 
  CheckCircle, 
  Clock,
  Pill,
  Activity,
  BarChart3,
  Globe,
  DollarSign,
  Shield
} from 'lucide-react';

// Pharmaceutical AI Insights focused on paracetamol trade intelligence
const pharmaceuticalInsights = [
  {
    title: 'Market Opportunity: Emerging Markets',
    description: 'AI analysis reveals 23% growth potential in Southeast Asian markets for paracetamol exports. Key drivers: rising healthcare demand and regulatory approvals.',
    confidence: 94,
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-gradient-to-br from-white/80 via-blue-50/30 to-purple-50/20',
    borderColor: 'border-white/30',
    category: 'Opportunity'
  },
  {
    title: 'Supply Chain Risk: Chinese Supplier Delays',
    description: 'Detected 15-day delays from primary Chinese suppliers. AI recommends alternative suppliers in India and Brazil with 98% reliability scores.',
    confidence: 87,
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-white/80 via-blue-50/30 to-purple-50/20',
    borderColor: 'border-white/30',
    category: 'Risk Alert'
  },
  {
    title: 'Price Optimization: Regional Price Gaps',
    description: 'Identified 18% price differential between European and Asian markets. AI suggests arbitrage opportunities with $2.3M revenue potential.',
    confidence: 91,
    icon: DollarSign,
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-white/80 via-blue-50/30 to-purple-50/20',
    borderColor: 'border-white/30',
    category: 'Revenue'
  },
  {
    title: 'Regulatory Compliance: FDA Guidelines Update',
    description: 'New FDA guidelines affecting paracetamol imports from Q3 2024. AI recommends proactive compliance measures to avoid supply disruptions.',
    confidence: 96,
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-white/80 via-blue-50/30 to-purple-50/20',
    borderColor: 'border-white/30',
    category: 'Compliance'
  }
];

export default function AnimatedAIInsightsDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [showInsights, setShowInsights] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to trigger animations when component comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setShowInsights(false);
    setCurrentInsight(0);

    // Simulate AI analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowInsights(true);
    }, 3000);
  };



  const currentInsightData = pharmaceuticalInsights[currentInsight];

  return (
    <div ref={containerRef} className="relative p-6 sm:p-8 lg:p-10">
      {/* Demo Badge */}
      <div className="absolute top-6 left-6 z-30">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
          LIVE DEMO
        </span>
      </div>

      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            AI Market Intelligence
          </h3>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-4"
        >
          Real-time AI analysis of pharmaceutical trade data
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto"
        >
          Click "Start Analysis" to experience our AI generating live insights and strategic recommendations
        </motion.p>
      </div>

      {/* Start Analysis Button */}
      {!showInsights && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <motion.button
            onClick={startAnalysis}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 btn-touch relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 inline mr-3 animate-pulse" />
            Start AI Analysis
          </motion.button>
        </motion.div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8 sm:mb-10"
        >
          <Card className="bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-cyan-50/50 border border-blue-200 max-w-lg mx-auto shadow-2xl">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
                </div>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">AI Analysis in Progress</h4>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Our AI is analyzing millions of data points to generate real-time insights...
              </p>
              <div className="space-y-3">
                {[
                  'Processing trade data from 180+ countries',
                  'Analyzing supplier performance metrics',
                  'Evaluating market opportunities and risks',
                  'Generating strategic recommendations'
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="flex items-center text-sm sm:text-base text-gray-700 bg-white/50 rounded-lg p-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="font-medium">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* AI Insights Results */}
      {showInsights && currentInsightData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Current Insight */}
          <div className="relative">
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden group hover:shadow-3xl transition-all duration-500">
              {/* Modern gradient accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"></div>
              
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%), 
                                   radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 50%)`
                }}></div>
              </div>
              
              <div className="relative z-10 p-8 sm:p-10">
                {/* Header with modern layout */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                        <currentInsightData.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-lg"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-cyan-400/15 text-blue-700 rounded-xl border border-blue-200/40 backdrop-blur-sm">
                          {currentInsightData.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-semibold text-emerald-600">LIVE</span>
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                        {currentInsightData.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Modern confidence display */}
                  <div className="text-right">
                    <div className="relative">
                      <div className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-1">
                        {currentInsightData.confidence}%
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confidence</div>
                      {/* Confidence visual indicator */}
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-1000"
                          style={{ width: `${currentInsightData.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Modern description */}
                <div className="mb-8">
                  <p className="text-lg font-medium text-gray-700 leading-relaxed">
                    {currentInsightData.description}
                  </p>
                </div>
                
                {/* Modern status footer */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/60 via-blue-50/40 to-white/60 rounded-2xl border border-white/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">Updated 2m ago</div>
                      <div className="text-xs text-gray-500">Real-time data</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">AI Generated</div>
                      <div className="text-xs text-gray-500">Neural network</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Modern Insights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pharmaceuticalInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  {/* Category indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <div className={`w-10 h-10 bg-gradient-to-br ${
                        insight.color === 'text-emerald-600' ? 'from-emerald-500 to-teal-600' :
                        insight.color === 'text-orange-600' ? 'from-orange-500 to-red-600' :
                        insight.color === 'text-blue-600' ? 'from-blue-500 to-cyan-600' :
                        'from-purple-500 to-pink-600'
                      } rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <insight.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-xl border border-gray-200">
                      {insight.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-base font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
                    {insight.title}
                  </h4>
                  
                  {/* Confidence */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-black bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                        {insight.confidence}%
                      </div>
                      <div className="flex flex-col">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Confidence</div>
                        <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}


    </div>
  );
} 