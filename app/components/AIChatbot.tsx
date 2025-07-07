"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  BarChart3,
  Globe,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  insights?: any[];
  recommendations?: string[];
}

interface AIChatbotProps {
  searchTerm?: string;
  analyticsData?: any;
}

export default function AIChatbot({ searchTerm, analyticsData }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        content: `Hello! I'm your AI trade intelligence assistant. I can help you analyze market trends, identify opportunities, and provide insights about pharmaceutical trade data.${searchTerm ? ` I see you're researching "${searchTerm}" - I can provide specific insights about this product.` : ''} What would you like to know?`,
        timestamp: new Date(),
        insights: [
          { type: 'market_trend', value: 'Ask me about market trends and predictions' },
          { type: 'supplier_analysis', value: 'Get supplier recommendations and analysis' },
          { type: 'price_intelligence', value: 'Understand pricing trends and volatility' },
          { type: 'risk_assessment', value: 'Assess market and supply chain risks' }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, searchTerm]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    setIsTyping(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let insights: any[] = [];
    let recommendations: string[] = [];

    // AI Response Logic based on user input
    if (lowerMessage.includes('trend') || lowerMessage.includes('growth') || lowerMessage.includes('market')) {
      response = `Based on the market data, I can see several key trends:${searchTerm ? `\n\nFor "${searchTerm}":` : ''}\n\n📈 **Market Growth**: The market shows ${analyticsData?.marketGrowth > 0 ? 'positive' : 'negative'} growth momentum\n📊 **Volume Trends**: Shipment volumes are ${analyticsData?.monthlyTrends?.[analyticsData.monthlyTrends.length - 1]?.trend === 'up' ? 'increasing' : 'decreasing'}\n💰 **Price Movement**: Average prices are ${analyticsData?.priceVolatility > 20 ? 'volatile' : 'stable'}\n\nWould you like me to dive deeper into any specific aspect?`;
      
      insights = [
        { type: 'growth', icon: TrendingUp, value: `${analyticsData?.marketGrowth?.toFixed(1) || 'N/A'}% growth rate`, color: 'text-green-600' },
        { type: 'volume', icon: BarChart3, value: `${analyticsData?.monthlyTrends?.length || 0} months of data`, color: 'text-blue-600' },
        { type: 'price', icon: DollarSign, value: `${analyticsData?.priceVolatility?.toFixed(1) || 'N/A'}% volatility`, color: 'text-orange-600' }
      ];
    }
    else if (lowerMessage.includes('supplier') || lowerMessage.includes('vendor') || lowerMessage.includes('manufacturer')) {
      response = `Here's my analysis of suppliers in this market:\n\n🏭 **Supplier Diversity**: ${analyticsData?.supplierConcentration?.toFixed(1) || 'N/A'}% supplier concentration\n⭐ **Top Suppliers**: ${analyticsData?.topSuppliers?.slice(0, 3).map((s: any) => s.name).join(', ') || 'N/A'}\n⚠️ **Risk Assessment**: ${analyticsData?.riskAssessment?.supplyChainRisk || 'N/A'}/100 supply chain risk\n\nI can help you identify the best suppliers based on reliability, pricing, and performance metrics.`;
      
      recommendations = [
        "Consider diversifying your supplier base to reduce risk",
        "Evaluate suppliers based on reliability scores and track records",
        "Monitor supplier performance and maintain backup options"
      ];
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('value')) {
      response = `Let me break down the pricing intelligence for you:\n\n💵 **Average Price**: $${analyticsData?.avgPrice?.toLocaleString() || 'N/A'}\n📊 **Price Range**: $${analyticsData?.minPrice?.toLocaleString() || 'N/A'} - $${analyticsData?.maxPrice?.toLocaleString() || 'N/A'}\n📈 **Price Volatility**: ${analyticsData?.priceVolatility?.toFixed(1) || 'N/A'}%\n\n${analyticsData?.priceVolatility > 30 ? '⚠️ High price volatility detected - consider timing your purchases carefully.' : '✅ Stable pricing environment - good for planning.'}`;
      
      insights = [
        { type: 'avg_price', icon: DollarSign, value: `$${analyticsData?.avgPrice?.toLocaleString() || 'N/A'}`, color: 'text-green-600' },
        { type: 'volatility', icon: TrendingUp, value: `${analyticsData?.priceVolatility?.toFixed(1) || 'N/A'}%`, color: 'text-orange-600' },
        { type: 'range', icon: BarChart3, value: `${analyticsData?.minPrice?.toLocaleString() || 'N/A'} - $${analyticsData?.maxPrice?.toLocaleString() || 'N/A'}`, color: 'text-blue-600' }
      ];
    }
    else if (lowerMessage.includes('risk') || lowerMessage.includes('danger') || lowerMessage.includes('threat')) {
      response = `Here's my risk assessment for this market:\n\n⚠️ **Overall Risk**: ${analyticsData?.riskAssessment?.overallRisk || 'N/A'}\n🔗 **Supply Chain Risk**: ${analyticsData?.riskAssessment?.supplyChainRisk || 'N/A'}/100\n📊 **Market Risk**: ${analyticsData?.riskAssessment?.marketRisk || 'N/A'}/100\n🌍 **Regulatory Risk**: ${analyticsData?.riskAssessment?.regulatoryRisk || 'N/A'}/100\n\n${analyticsData?.riskAssessment?.overallRisk === 'High' ? '🚨 High risk detected - implement comprehensive risk mitigation strategies.' : '✅ Risk levels are manageable with standard precautions.'}`;
      
      recommendations = [
        "Implement supplier diversification strategies",
        "Monitor market conditions regularly",
        "Develop contingency plans for supply disruptions",
        "Stay updated on regulatory changes"
      ];
    }
    else if (lowerMessage.includes('opportunity') || lowerMessage.includes('chance') || lowerMessage.includes('potential')) {
      response = `I've identified several business opportunities:\n\n🎯 **Market Expansion**: ${analyticsData?.opportunities?.[0]?.potential || 'N/A'}% potential\n💡 **Supplier Diversification**: ${analyticsData?.opportunities?.[1]?.potential || 'N/A'}% potential\n💰 **Price Optimization**: ${analyticsData?.opportunities?.[2]?.potential || 'N/A'}% potential\n\nThese opportunities are based on market gaps, growth trends, and competitive analysis.`;
      
      insights = [
        { type: 'expansion', icon: Globe, value: `${analyticsData?.opportunities?.[0]?.potential || 'N/A'}%`, color: 'text-green-600' },
        { type: 'diversification', icon: Package, value: `${analyticsData?.opportunities?.[1]?.potential || 'N/A'}%`, color: 'text-blue-600' },
        { type: 'optimization', icon: Target, value: `${analyticsData?.opportunities?.[2]?.potential || 'N/A'}%`, color: 'text-purple-600' }
      ];
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('capabilities')) {
      response = `I'm your AI trade intelligence assistant! Here's what I can help you with:\n\n🤖 **Market Analysis**: Trends, growth patterns, and market dynamics\n🏭 **Supplier Intelligence**: Recommendations, reliability scores, and risk assessment\n💰 **Price Intelligence**: Pricing trends, volatility analysis, and optimization\n⚠️ **Risk Assessment**: Supply chain, market, and regulatory risks\n🎯 **Opportunity Identification**: Market gaps and business opportunities\n📊 **Data Insights**: Detailed analytics and predictive modeling\n\nJust ask me about any aspect of pharmaceutical trade data!`;
      
      insights = [
        { type: 'market', icon: BarChart3, value: 'Market Analysis', color: 'text-blue-600' },
        { type: 'supplier', icon: Package, value: 'Supplier Intelligence', color: 'text-green-600' },
        { type: 'price', icon: DollarSign, value: 'Price Intelligence', color: 'text-orange-600' },
        { type: 'risk', icon: AlertTriangle, value: 'Risk Assessment', color: 'text-red-600' }
      ];
    }
    else {
      response = `I understand you're asking about "${userMessage}". Let me provide some general insights:\n\n📊 **Market Overview**: This market shows ${analyticsData?.marketGrowth > 0 ? 'positive' : 'negative'} growth trends\n🏭 **Supplier Landscape**: ${analyticsData?.uniqueSuppliers || 'N/A'} unique suppliers identified\n💰 **Price Environment**: ${analyticsData?.priceVolatility > 20 ? 'Volatile' : 'Stable'} pricing conditions\n\nCould you be more specific? I can help with:\n• Market trends and predictions\n• Supplier analysis and recommendations\n• Price intelligence and optimization\n• Risk assessment and mitigation\n• Business opportunities`;
    }

    setIsTyping(false);
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      insights,
      recommendations
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Generate AI response
    const aiResponse = await generateAIResponse(userMessage.content);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'growth': return TrendingUp;
      case 'volume': return BarChart3;
      case 'price': return DollarSign;
      case 'avg_price': return DollarSign;
      case 'volatility': return TrendingUp;
      case 'range': return BarChart3;
      case 'expansion': return Globe;
      case 'diversification': return Package;
      case 'optimization': return Target;
      case 'market': return BarChart3;
      case 'supplier': return Package;
      case 'risk': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Trade Assistant</h3>
                  <p className="text-xs text-purple-100">Powered by advanced analytics</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3`}>
                    <div className="flex items-start gap-2">
                      {message.type === 'ai' && (
                        <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* AI Insights */}
                        {message.insights && message.insights.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.insights.map((insight, index) => {
                              const IconComponent = getInsightIcon(insight.type);
                              return (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                  <IconComponent className={`w-3 h-3 ${insight.color}`} />
                                  <span className={insight.color}>{insight.value}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Recommendations */}
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {message.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-start gap-2 text-xs">
                                <Lightbulb className="w-3 h-3 mt-0.5 text-yellow-600 flex-shrink-0" />
                                <span className="text-gray-700">{rec}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
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
                  placeholder="Ask me about market trends, suppliers, pricing..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 