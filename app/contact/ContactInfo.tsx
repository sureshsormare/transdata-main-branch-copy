"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, MessageSquare, Users, Award, Shield } from "lucide-react"

export function ContactInfo() {
  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      details: [
        "+91 9595078788"
      ],
      description: "Speak directly with our support team",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      details: [
        "info@transdatanexus.com"
      ],
      description: "Get detailed responses within 24 hours",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      details: [
        "Available 24/7",
        "Instant responses"
      ],
      description: "Chat with our AI assistant anytime",
      color: "from-purple-500 to-indigo-500"
    }
  ]

  const companyStats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: "500+",
      label: "Companies Trust Us"
    },
    {
      icon: <Award className="w-5 h-5" />,
      value: "99.9%",
      label: "Uptime Guarantee"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      value: "24/7",
      label: "Support Available"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-blue-100">
            Choose your preferred way to connect with our team
          </p>
        </div>

        <div className="space-y-4">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-gradient-to-r ${method.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {method.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {method.title}
                  </h3>
                  <div className="space-y-1 mb-2">
                    {method.details.map((detail, idx) => (
                      <p key={idx} className="text-blue-100 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-blue-200 text-sm">
                    {method.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Office Location */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Office Location
            </h3>
            <p className="text-blue-100 mb-2">
              Mumbai, Maharashtra, India
            </p>
            <p className="text-blue-200 text-sm">
              Visit our office for in-person consultations
            </p>
          </div>
        </div>
      </motion.div>

      {/* Business Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Business Hours
            </h3>
            <div className="space-y-1">
              <p className="text-blue-100">
                <span className="font-semibold">Monday - Friday:</span> 9:00 AM - 6:00 PM IST
              </p>
              <p className="text-blue-100">
                <span className="font-semibold">Saturday:</span> 10:00 AM - 2:00 PM IST
              </p>
              <p className="text-blue-100">
                <span className="font-semibold">Sunday:</span> Closed
              </p>
            </div>
            <p className="text-blue-200 text-sm mt-2">
              Emergency support available 24/7
            </p>
          </div>
        </div>
      </motion.div>

      {/* Company Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Why Choose TransDataNexus?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {companyStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-blue-300">
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold text-white">
                  {stat.value}
                </span>
              </div>
              <p className="text-blue-100 text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Response Promise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-2xl border border-green-400/30 p-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">
            Quick Response Promise
          </h3>
        </div>
        <p className="text-green-100">
          We guarantee a response within 24 hours for all inquiries. 
          Most customers hear from us within 2-4 hours during business hours.
        </p>
      </motion.div>
    </div>
  )
} 