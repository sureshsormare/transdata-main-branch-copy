"use client"

import { motion } from 'framer-motion'
import { BarChart3, Brain, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import AnimatedSankeyDemo from './charts/AnimatedSankeyDemo'
import AnimatedAnalyticsDemo from './charts/AnimatedAnalyticsDemo'
import AnimatedAIInsightsDemo from './charts/AnimatedAIInsightsDemo'

export default function HomepageDemoSection() {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8">
      <div className="container-responsive">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-block'
          >
            <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm mb-6'>
              📊 Interactive Demos
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See Our Platform in{" "}
            <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'>
              Action
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore interactive demos of our pharmaceutical trade intelligence platform
          </p>
        </motion.div>

        {/* Trade Flow Analysis Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 lg:mb-16"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  India's Paracetamol Export
                </motion.span>{" "}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className='bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent'
                >
                  Flow Network
                </motion.span>
              </h3>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Interactive visualization of India's paracetamol export supply chain - from Indian manufacturers to global importers across key markets
            </p>
          </div>

          {/* Interactive Dashboard - Above Sankey */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/40">
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-t-2xl"></div>

              {/* Dashboard Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                
                {/* Key Metrics */}
                <div className="lg:col-span-4">
                  <div className="grid grid-cols-2 gap-2">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/70 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-xl font-bold text-blue-800">$1.5Bn</div>
                      <div className="text-xs text-blue-600 font-medium">Market Value</div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100/70 rounded-xl border border-purple-200/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-xl font-bold text-purple-800">47.2K</div>
                      <div className="text-xs text-purple-600 font-medium">Total Shipments</div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-center p-3 bg-gradient-to-br from-cyan-50 to-cyan-100/70 rounded-xl border border-cyan-200/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-xl font-bold text-cyan-800">6</div>
                      <div className="text-xs text-cyan-600 font-medium">Top Suppliers</div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-center p-3 bg-gradient-to-br from-indigo-50 to-indigo-100/70 rounded-xl border border-indigo-200/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-xl font-bold text-indigo-800">$31.6K</div>
                      <div className="text-xs text-indigo-600 font-medium">Avg. Value</div>
                    </motion.div>
                  </div>
                </div>

                {/* Top Suppliers List */}
                <div className="lg:col-span-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                      <span className="text-xs font-semibold text-gray-900">Complete Market Coverage (100%)</span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { name: "Ipca Laboratories Limited", value: "$284.9Mn", share: "19.1%" },
                        { name: "Adcock Ingram Limited", value: "$69.4Mn", share: "4.6%" },
                        { name: "Fourrts (India) Laboratories Private Limited", value: "$68.9Mn", share: "4.6%" },
                        { name: "Sanofi India Limited", value: "$67.6Mn", share: "4.5%" },
                        { name: "Lincoln Pharmaceuticals LTD", value: "$54.3Mn", share: "3.6%" },
                        { name: "Other Suppliers", value: "$947.5Mn", share: "63.5%" }
                      ].map((supplier, index) => (
                        <motion.div 
                          key={supplier.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * index }}
                          className="flex items-center text-xs hover:bg-gray-50 rounded-lg p-1 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-900 truncate max-w-[220px]">
                              {supplier.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-semibold text-xs">{supplier.value}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{supplier.share}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Market Insights */}
                <div className="lg:col-span-3">
                  <div className="space-y-2">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-200/50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-900">Market Coverage</span>
                      </div>
                      <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                        100%
                      </div>
                      <div className="text-xs text-gray-600">Complete market</div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl p-3 border border-purple-200/50"
                    >
                      <div className="text-xl font-bold bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">19.1%</div>
                      <div className="text-xs text-gray-600 font-medium">Top Supplier Share</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <Card className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <AnimatedSankeyDemo />
          </Card>
        </motion.section>

        {/* Analytics Dashboard Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 lg:mb-16"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Global Market
                </motion.span>{" "}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'
                >
                  Intelligence
                </motion.span>
              </h3>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Deep analytics on India's paracetamol export performance - key importing countries, market shares, and strategic insights for global trade intelligence
            </p>
          </div>
          
          <Card className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <AnimatedAnalyticsDemo />
          </Card>
        </motion.section>

        {/* AI Insights Section (standalone) */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 lg:mb-16"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm mb-6'>
                🤖 AI Intelligence
              </span>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AI-Powered
              </motion.span>{" "}
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'
              >
                Market Intelligence
              </motion.span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Experience the future of pharmaceutical trade intelligence with our advanced AI that analyzes millions of data points to provide real-time market opportunities, risk alerts, and strategic recommendations.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-400/10 rounded-2xl blur-3xl"></div>
            <Card className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-200/60 hover:shadow-3xl transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500"></div>
              <AnimatedAIInsightsDemo />
            </Card>
          </motion.div>
        </motion.section>

        {/* Success Stories Section (separate) */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 lg:mb-16"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm mb-6'>
                💬 Success Stories
              </span>
            </motion.div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className=''>What Our Clients Say</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how leading pharmaceutical companies are transforming their trade operations
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            {[
              {
                name: 'Dr. Sarah Johnson',
                role: 'Procurement Director',
                company: 'PharmaCorp International',
                testimonial: "TransDataNexus has revolutionized our supplier sourcing process. We've identified 15 new reliable suppliers and reduced our procurement costs by 23%.",
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Supply Chain Manager',
                company: 'GlobalMed Solutions',
                testimonial: 'The real-time market insights have given us a competitive edge. We can now make data-driven decisions that directly impact our bottom line.',
                rating: 5
              },
              {
                name: 'Dr. Emily Rodriguez',
                role: 'Business Development',
                company: 'BioTech Innovations',
                testimonial: 'The comprehensive trade data helped us expand into 8 new markets within 6 months. The ROI has been exceptional.',
                rating: 5
              }
            ].map((t, idx) => (
              <Card key={idx} className='bg-white rounded-2xl shadow-xl border border-gray-200 p-6'>
                <div className='flex items-center justify-center mb-3'>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className='text-yellow-400 text-xl'>⭐</span>
                  ))}
                </div>
                <p className='text-gray-700 italic text-center mb-4'>“{t.testimonial}”</p>
                <div className='flex items-center justify-center gap-3'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-sm font-bold'>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold text-gray-900'>{t.name}</div>
                    <div className='text-sm text-gray-600'>{t.role}</div>
                    <div className='text-sm bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent font-semibold'>{t.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>


      </div>
    </div>
  )
} 