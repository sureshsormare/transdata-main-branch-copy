"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Target, 
  Activity, 
  BarChart3, 
  MapPin, 
  Pill,
  DollarSign,
  Globe,
  Truck,
  Shield
} from 'lucide-react';

// Real Paracetamol Trade Intelligence Analytics
const paracetamolAnalytics = {
  name: "Paracetamol Trade Intelligence",
  description: "Real pharmaceutical trade analytics and market insights",
  metrics: [
    {
      title: 'Market Value',
      value: '$1.5Bn',
      change: 'Live Data',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      description: 'Total paracetamol market value'
    },
    {
      title: 'Total Shipments',
      value: '47.2K',
      change: 'Real-time',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600',
      description: 'Total shipments across all countries'
    },
    {
      title: 'Top Countries',
      value: '6',
      change: 'Coverage',
      trend: 'up',
      icon: Globe,
      color: 'text-cyan-600',
      description: 'Major importing countries tracked'
    },
    {
      title: 'Avg. Shipment Value',
      value: '$31.6K',
      change: 'Premium',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-indigo-600',
      description: 'Average value per shipment'
    }
  ],
  marketTrends: [
    { label: 'United Kingdom', value: 16.2, color: '#3B82F6', description: '$241.9Mn across 4.2K shipments' },
    { label: 'Australia', value: 8.0, color: '#8B5CF6', description: '$119.6Mn across 2.2K shipments' },
    { label: 'New Zealand', value: 7.0, color: '#06B6D4', description: '$105.2Mn across 334 shipments' },
    { label: 'South Africa', value: 5.2, color: '#6366F1', description: '$77.0Mn across 3.1K shipments' }
  ],
  geographicData: [
    { label: 'United Kingdom', value: 16.2, color: '#3B82F6', description: 'Top importing country' },
    { label: 'Australia', value: 8.0, color: '#8B5CF6', description: 'Second largest market' },
    { label: 'New Zealand', value: 7.0, color: '#06B6D4', description: 'Premium pricing market' },
    { label: 'South Africa', value: 5.2, color: '#6366F1', description: 'Emerging market' },
    { label: 'Tanzania', value: 4.7, color: '#3B82F6', description: 'African market' },
    { label: 'Other Countries', value: 58.9, color: '#8B5CF6', description: 'Remaining markets' }
  ],
  supplierPerformance: [
    { label: 'Alloga Uk Ap7', value: 28.6, color: '#3B82F6', status: 'Market Leader' },
    { label: 'Wockhardt Uk Limited', value: 21.6, color: '#8B5CF6', status: 'Strong Player' },
    { label: 'Adcock Ingram Limited', value: 79.6, color: '#06B6D4', status: 'Regional Dominance' },
    { label: 'Heko Pharmacy LTD', value: 62.3, color: '#6366F1', status: 'Local Leader' }
  ]
};

// Donut Chart Component
function DonutChart({ data, size = 200, strokeWidth = 20 }: { 
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let currentAngle = 0;
  
  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          
          // Calculate start and end points for the arc
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const startX = size / 2 + radius * Math.cos((startAngle * Math.PI) / 180);
          const startY = size / 2 + radius * Math.sin((startAngle * Math.PI) / 180);
          const endX = size / 2 + radius * Math.cos((endAngle * Math.PI) / 180);
          const endY = size / 2 + radius * Math.sin((endAngle * Math.PI) / 180);
          
          // Create the arc path
          const largeArcFlag = angle > 180 ? 1 : 0;
          const pathData = [
            `M ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
          ].join(' ');
          
          currentAngle += angle;
          
          return (
            <motion.path
              key={index}
              d={pathData}
              stroke={item.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 text-metrics">{total}%</div>
          <div className="text-sm text-gray-600">Total Market</div>
        </div>
      </div>
    </div>
  );
}

export default function AnimatedAnalyticsDemo() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
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

  const handleMetricClick = (title: string) => {
    setSelectedMetric(selectedMetric === title ? null : title);
  };

  return (
    <div ref={containerRef} className="relative bg-gradient-to-br from-white via-blue-50/40 to-purple-50/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-3 sm:p-4 lg:p-5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
          }}
        ></div>
      </div>
      
      {/* Demo Badge */}
      <div className="absolute top-4 left-4 z-30">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
          ✨ LIVE DEMO
        </span>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-4 sm:mb-5">
        <div className="flex items-center justify-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
            India's Export Market Intelligence
          </h3>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-gray-700 max-w-2xl mx-auto font-medium">
          Strategic insights into India's paracetamol export destinations, market penetration, and key trading relationships
        </p>
      </div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5"
      >
        {paracetamolAnalytics.metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.5, delay: isInView ? index * 0.1 : 0 }}
            className="cursor-pointer"
            onClick={() => handleMetricClick(metric.title)}
          >
            <Card className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300 group ${
              selectedMetric === metric.title ? 'ring-2 ring-blue-400 shadow-blue-500/25' : ''
            }`}>
              <div className="p-3 sm:p-4 relative overflow-hidden">
                {/* Card gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      index === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-500' :
                      index === 1 ? 'bg-gradient-to-r from-purple-600 to-purple-500' :
                      index === 2 ? 'bg-gradient-to-r from-cyan-600 to-cyan-500' :
                      'bg-gradient-to-r from-indigo-600 to-indigo-500'
                    } shadow-lg`}>
                      <metric.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className={`flex items-center text-xs sm:text-sm font-bold px-2 py-1 rounded-full ${
                      metric.trend === 'up' 
                        ? 'text-blue-700 bg-blue-100 border border-blue-200' 
                        : 'text-red-700 bg-red-100 border border-red-200'
                    }`}>
                      {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-1">{metric.value}</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">{metric.title}</div>
                  <div className="text-xs text-gray-600 font-medium">{metric.description}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: isInView ? 0.5 : 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5"
      >
        {/* Market Trends Chart */}
        <Card className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/40">
          <div className="p-3 sm:p-4">
            <div className="flex items-center mb-3 sm:mb-4">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">India's Export Destinations</h3>
            </div>
            <div className="space-y-2">
              {paracetamolAnalytics.marketTrends.map((trend, index) => (
                <motion.div
                  key={trend.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                  transition={{ duration: 0.5, delay: isInView ? index * 0.1 : 0 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-gray-700">{trend.label}</div>
                    <div className="text-xs font-bold text-gray-900">{trend.value}%</div>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isInView ? `${trend.value}%` : "0%" }}
                      transition={{ duration: 1, delay: isInView ? index * 0.1 : 0 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: trend.color }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{trend.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Donut Chart */}
        <Card className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/40">
          <div className="p-3 sm:p-4">
            <div className="flex items-center mb-3 sm:mb-4">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">Export Market Share</h3>
            </div>
            <div className="flex justify-center mb-4">
              <DonutChart data={paracetamolAnalytics.geographicData} size={180} strokeWidth={16} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {paracetamolAnalytics.geographicData.map((region, index) => (
                <motion.div
                  key={region.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                  transition={{ duration: 0.5, delay: isInView ? index * 0.1 : 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-xs font-medium text-gray-700">{region.label}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-900">{region.value}%</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* UK Market Breakdown */}
        <Card className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/40">
          <div className="p-3 sm:p-4">
            <div className="flex items-center mb-3 sm:mb-4">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">India → UK Exports</h3>
            </div>
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-800 mb-1">Top UK Importers of Indian Paracetamol</div>
              <div className="text-xs text-gray-600 mb-1">Total: $241.9Mn • 4.2K shipments • 16.2% of India's exports</div>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Alloga Uk Ap7', value: '$69.3Mn', description: '411 shipments', color: '#3B82F6', percentage: 28.6 },
                { label: 'Wockhardt Uk Limited', value: '$52.3Mn', description: '127 shipments', color: '#8B5CF6', percentage: 21.6 },
                { label: 'Bells Healthcare', value: '$34.8Mn', description: '366 shipments', color: '#06B6D4', percentage: 14.4 },
                { label: 'Confidential Importer', value: '$28.1Mn', description: '657 shipments', color: '#6366F1', percentage: 11.6 },
                { label: 'Ipca Laboratories Uk Ltd', value: '$8.8Mn', description: '170 shipments', color: '#10B981', percentage: 3.7 },
                { label: 'Other UK Importers', value: '$48.6Mn', description: '2.4K shipments', color: '#9CA3AF', percentage: 20.1 }
              ].map((importer, index) => (
                <motion.div
                  key={importer.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                  transition={{ duration: 0.5, delay: isInView ? index * 0.1 : 0 }}
                  className="space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-gray-700 truncate max-w-[110px]">{importer.label}</div>
                    <div className="text-xs font-bold text-gray-900">{importer.value}</div>
                  </div>
                  <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isInView ? `${importer.percentage}%` : "0%" }}
                      transition={{ duration: 1, delay: isInView ? index * 0.1 : 0 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: importer.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{importer.description}</p>
                    <span className="text-xs text-gray-600 font-medium">{importer.percentage}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Top Market Players */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: isInView ? 1 : 0 }}
        className="mb-4 sm:mb-5"
      >
        <Card className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/40">
          <div className="p-2 sm:p-3">
            <div className="flex items-center mb-2 sm:mb-3">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2" />
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">Leading Importers</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {paracetamolAnalytics.supplierPerformance.map((supplier, index) => (
                <motion.div
                  key={supplier.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: isInView ? index * 0.1 : 0 }}
                  className="space-y-1 sm:space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-gray-700 truncate max-w-[120px]">{supplier.label}</div>
                    <div className="text-xs font-bold text-gray-900">{supplier.value}%</div>
                  </div>
                  <div className="relative h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isInView ? `${supplier.value}%` : "0%" }}
                      transition={{ duration: 1, delay: isInView ? index * 0.1 : 0 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: supplier.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Share</span>
                    <span className={`text-xs font-medium ${
                      supplier.status === 'Market Leader' || supplier.status === 'Regional Dominance' ? 'text-blue-600' : 'text-purple-600'
                    }`}>
                      {supplier.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>


    </div>
  );
} 