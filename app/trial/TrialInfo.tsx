"use client"

import { motion } from "framer-motion"
import { CheckCircle, Zap, Shield, Clock, Database, Users } from "lucide-react"

export function TrialInfo() {
  const trialFeatures = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Full Platform Access",
      description: "Access to 50M+ pharmaceutical trade records and all analytics features"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Activation",
      description: "Get started immediately with no setup fees or complex onboarding"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "No Credit Card Required",
      description: "Start your trial risk-free with no payment information needed"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "7 Full Days",
      description: "Complete access for 7 days to explore all features and capabilities"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Full Support",
      description: "Access to our customer support team during your trial period"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Easy Cancellation",
      description: "Cancel anytime during the trial with no obligations or hidden fees"
    }
  ]

  const trialBenefits = [
    "Search 50M+ pharmaceutical trade records",
    "Access real-time market intelligence",
    "Explore supplier and buyer insights",
    "Analyze pricing trends and patterns",
    "Generate custom reports and analytics",
    "Export data for further analysis"
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
          Experience TransDataNexus Risk-Free
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Join 500+ pharmaceutical companies who have discovered the power of AI-driven trade intelligence. 
          Start your free trial today and see the difference data-driven decisions can make.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {trialFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-600 text-white rounded-lg group-hover:scale-110 transition-transform duration-300">
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
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
          🚀 What You Can Do During Your Trial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trialBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-blue-800 text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-orange-600" />
          <span className="text-lg font-bold text-orange-900">Limited Time Offer</span>
        </div>
        <p className="text-orange-800 text-sm">
          Start your trial today and get exclusive access to premium features normally reserved for paid subscribers.
        </p>
      </motion.div>
    </div>
  )
} 