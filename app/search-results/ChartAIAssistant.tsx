"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'trend';
  data: any[];
  title: string;
  description?: string;
}

interface ChartAIAssistantProps {
  chartData: ChartData;
  searchTerm?: string;
  isVisible?: boolean;
  onToggle?: () => void;
  position?: 'top-right' | 'bottom-right' | 'floating';
}

interface AIInsight {
  type: 'trend' | 'anomaly' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  action?: string;
}

export default function ChartAIAssistant({ 
  chartData, 
  searchTerm = "", 
  isVisible = false,
  onToggle,
  position = 'floating'
}: ChartAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
    insights?: AIInsight[];
    error?: string;
  }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-generate insights when chart data changes
  useEffect(() => {
    if (chartData && chartData.data.length > 0) {
      generateChartInsights();
    }
  }, [chartData]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateChartInsights = async () => {
    try {
      setIsGeneratingInsights(true);
      setError(null);

      // Call the Chart AI API
      const response = await fetch('/api/chart-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartType: chartData.type,
          data: chartData.data,
          title: chartData.title
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Convert API insights to local format
      const apiInsights: AIInsight[] = result.insights.map((insight: any) => ({
        type: insight.type,
        title: insight.title,
        description: insight.description,
        confidence: insight.confidence,
        impact: insight.impact,
        action: insight.action
      }));
      
      setInsights(apiInsights);
      
      // Add system message with insights
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: result.summary || `I've analyzed the ${chartData.title} chart and found ${apiInsights.length} key insights.`,
        timestamp: new Date(),
        insights: apiInsights
      }]);

    } catch (err) {
      console.error('Error generating chart insights:', err);
      setError('Failed to analyze chart data. Please try again.');
      
      // Fallback to mock insights if API fails
      const mockInsights: AIInsight[] = generateMockInsights(chartData);
      setInsights(mockInsights);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const generateMockInsights = (data: ChartData): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    if (data.data.length === 0) return insights;

    // Analyze data patterns
    const values = data.data.map((item: any) => item.value || item.count || 0);
    const total = values.reduce((sum: number, val: number) => sum + val, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Trend analysis
    if (data.type === 'line' || data.type === 'trend') {
      const trend = values[values.length - 1] > values[0] ? 'increasing' : 'decreasing';
      insights.push({
        type: 'trend',
        title: `${trend.charAt(0).toUpperCase() + trend.slice(1)} Trend Detected`,
        description: `The data shows a ${trend} trend over time, with values ranging from ${min.toLocaleString()} to ${max.toLocaleString()}.`,
        confidence: 0.85,
        impact: trend === 'increasing' ? 'positive' : 'negative'
      });
    }

    // Anomaly detection
    const threshold = avg * 1.5;
    const anomalies = values.filter((v: number) => v > threshold);
    if (anomalies.length > 0) {
      insights.push({
        type: 'anomaly',
        title: 'Potential Anomalies Detected',
        description: `Found ${anomalies.length} data points significantly above the average (${avg.toLocaleString()}).`,
        confidence: 0.75,
        impact: 'neutral',
        action: 'Investigate these outliers for potential opportunities or issues.'
      });
    }

    // Pattern recognition
    if (data.type === 'pie' || data.type === 'bar') {
      const topItem = data.data.reduce((max: any, item: any) => 
        (item.value || item.count || 0) > (max.value || max.count || 0) ? item : max
      );
      const topValue = topItem.value || topItem.count || 0;
      const percentage = (topValue / total) * 100;

      insights.push({
        type: 'pattern',
        title: 'Dominant Category Identified',
        description: `${topItem.name || topItem.month || 'Top category'} represents ${percentage.toFixed(1)}% of total data.`,
        confidence: 0.90,
        impact: 'neutral',
        action: 'Consider diversifying or focusing strategy based on this concentration.'
      });
    }

    // Recommendations
    if (total > 1000000) {
      insights.push({
        type: 'recommendation',
        title: 'High-Value Opportunity',
        description: `Total value exceeds $1M, indicating significant market potential.`,
        confidence: 0.80,
        impact: 'positive',
        action: 'Consider expanding operations or increasing investment in this area.'
      });
    }

    return insights;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // Simulate AI response with chart context
      const response = await generateAIResponse(inputValue, chartData);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      }]);

    } catch (err) {
      console.error('Error generating AI response:', err);
      setError('Failed to get AI response. Please try again.');
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble analyzing the chart right now. Please try again in a moment.",
        timestamp: new Date(),
        error: 'Response generation failed'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (query: string, data: ChartData): Promise<string> => {
    try {
      // Call the Chart AI API with the query
      const response = await fetch('/api/chart-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartType: data.type,
          data: data.data,
          title: data.title,
          query: query
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      return result.aiResponse || `I can help you analyze the ${data.title} chart. You can ask me about trends, patterns, anomalies, or recommendations. What specific aspect would you like me to focus on?`;

    } catch (err) {
      console.error('Error generating AI response:', err);
      
      // Fallback to mock response
      const queryLower = query.toLowerCase();
      const values = data.data.map((item: any) => item.value || item.count || 0);
      const total = values.reduce((sum: number, val: number) => sum + val, 0);

      if (queryLower.includes('trend') || queryLower.includes('pattern')) {
        const trend = values[values.length - 1] > values[0] ? 'increasing' : 'decreasing';
        return `Based on the ${data.title} chart, I can see a ${trend} trend. The data shows ${values.length} data points with a total value of ${total.toLocaleString()}. The trend suggests ${trend === 'increasing' ? 'positive market momentum' : 'potential market challenges'}.`;
      }

      if (queryLower.includes('anomaly') || queryLower.includes('outlier')) {
        const avg = total / values.length;
        const anomalies = values.filter((v: number) => v > avg * 1.5);
        return `I've identified ${anomalies.length} potential anomalies in the ${data.title} data. These values are significantly above the average of ${avg.toLocaleString()}. This could indicate market opportunities or data quality issues that warrant investigation.`;
      }

      if (queryLower.includes('recommend') || queryLower.includes('suggest')) {
        return `Based on the ${data.title} analysis, I recommend: 1) Monitor the trend patterns for strategic planning, 2) Investigate any anomalies for opportunities, 3) Consider the data distribution for resource allocation decisions.`;
      }

      return `I can help you analyze the ${data.title} chart. You can ask me about trends, patterns, anomalies, or recommendations. What specific aspect would you like me to focus on?`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle();
  };

  const retryInsights = () => {
    generateChartInsights();
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'floating': 'bottom-4 right-4'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Brain className="w-6 h-6" />
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-semibold">Chart AI Assistant</h3>
                </div>
                <button
                  onClick={toggleChat}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-blue-100 mt-1">
                Analyzing: {chartData.title}
              </p>
            </div>

            {/* Insights Panel */}
            {insights.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    AI Insights
                  </h4>
                  <button
                    onClick={retryInsights}
                    disabled={isGeneratingInsights}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {insights.slice(0, 2).map((insight, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-md text-sm border-l-4 ${
                        insight.impact === 'positive' ? 'border-green-500 bg-green-50' :
                        insight.impact === 'negative' ? 'border-red-500 bg-red-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{insight.title}</div>
                      <div className="text-gray-600 text-xs">{insight.description}</div>
                      {insight.action && (
                        <div className="text-blue-600 text-xs mt-1 font-medium">
                          💡 {insight.action}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border-b border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && !isGeneratingInsights && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Ask me about this chart's trends, patterns, or insights!</p>
                </div>
              )}

              {isGeneratingInsights && (
                <div className="text-center text-gray-500 text-sm py-4">
                  <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-blue-600" />
                  <p>Analyzing chart data...</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'system'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    {message.insights && (
                      <div className="mt-2 space-y-1">
                        {message.insights.map((insight, index) => (
                          <div key={index} className="text-xs bg-white bg-opacity-50 p-1 rounded">
                            <strong>{insight.title}</strong>: {insight.description}
                          </div>
                        ))}
                      </div>
                    )}
                    {message.error && (
                      <div className="mt-2 text-xs text-red-600">
                        ⚠️ {message.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about this chart..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 