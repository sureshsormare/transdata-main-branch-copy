"use client"

import { motion } from "framer-motion"
import { Play, Users, BarChart3, Shield, Clock, Zap } from "lucide-react"

export function DemoInfo() {
  const demoFeatures = [
    {
      icon: <Play className="w-6 h-6" />,
      title: "Live Platform Walkthrough",
      description: "See our AI-powered analytics in action with real pharmaceutical trade data"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personalized Experience",
      description: "Demo tailored to your specific industry needs and use cases"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics Demo",
      description: "Explore market trends, supplier insights, and competitive intelligence"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security & Compliance",
      description: "Learn about our enterprise-grade security and data protection measures"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "30-Minute Session",
      description: "Comprehensive overview that fits your busy schedule"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Q&A Session",
      description: "Get all your questions answered by our product experts"
    }
  ]

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Experience the Power of TransDataNexus
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Join 500+ pharmaceutical companies who have transformed their trade operations with our AI-powered intelligence platform. 
          See how you can make data-driven decisions in real-time.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {demoFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center"
      >
        <h3 className="text-xl font-bold text-green-900 mb-2">
          🎯 What You'll Discover
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>Real-time market intelligence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>Supplier & buyer insights</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>Pricing & trend analysis</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 