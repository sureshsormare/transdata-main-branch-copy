"use client"

import { motion } from "framer-motion"
import { Users, Target, BarChart3, MessageSquare, Clock, Award } from "lucide-react"

export function ConsultationInfo() {
  const consultationBenefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Team",
      description: "Consult with our pharmaceutical trade intelligence specialists with 10+ years of industry experience"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Strategy",
      description: "Get customized recommendations tailored to your specific business needs and challenges"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Data-Driven Insights",
      description: "Learn how to leverage our 50M+ trade records for strategic decision making"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Interactive Session",
      description: "Ask questions, discuss challenges, and explore solutions in real-time"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Scheduling",
      description: "Book a consultation at your convenience with our flexible scheduling options"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Proven Results",
      description: "Learn from success stories of 500+ companies who transformed their operations"
    }
  ]

  const consultationTopics = [
    "Market entry strategies and opportunities",
    "Supplier and buyer identification",
    "Pricing optimization and competitive analysis",
    "Risk assessment and compliance",
    "Technology integration and automation",
    "ROI optimization and cost reduction"
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
          Get Expert Guidance for Your Business
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Connect with our pharmaceutical trade intelligence experts for personalized advice on how to leverage 
          data-driven insights to grow your business, optimize operations, and stay ahead of the competition.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {consultationBenefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-600 text-white rounded-lg group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">
          💡 Consultation Topics We Cover
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {consultationTopics.map((topic, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-indigo-800 text-sm">{topic}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-5 h-5 text-yellow-600" />
          <span className="text-lg font-bold text-yellow-900">Free Consultation</span>
        </div>
        <p className="text-yellow-800 text-sm">
          Our initial consultation is completely free. No obligations, no pressure - just expert advice to help you make informed decisions.
        </p>
      </motion.div>
    </div>
  )
} 