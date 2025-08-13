"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp, Users, Globe, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface SearchResult {
  id: string
  supplier: string
  buyer: string
  product: string
  value: string
  date: string
  country: string
}

const sampleResults: SearchResult[] = [
  {
    id: '1',
    supplier: 'ABC Pharmaceuticals Ltd',
    buyer: 'United Health Systems',
    product: 'Paracetamol 500mg',
    value: '$2.4M',
    date: '2025-01-15',
    country: 'United States'
  },
  {
    id: '2',
    supplier: 'XYZ Pharma Solutions',
    buyer: 'MediCare International',
    product: 'Paracetamol Tablets',
    value: '$1.8M',
    date: '2025-01-20',
    country: 'Germany'
  },
  {
    id: '3',
    supplier: 'Global Med Corp',
    buyer: 'Asia Pacific Medical',
    product: 'Paracetamol 250mg',
    value: '$1.2M',
    date: '2025-01-25',
    country: 'Singapore'
  },
  {
    id: '4',
    supplier: 'Prime Healthcare',
    buyer: 'PharmaCorp Europe',
    product: 'Paracetamol Syrup',
    value: '$900K',
    date: '2025-01-30',
    country: 'Netherlands'
  }
]

const searchSuggestions = [
  'Paracetamol',
  'Cisplatin',
  'Albumin',
  'Metformin',
  'Levofloxacin'
]

export default function AnimatedSearchDemo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] = useState(0)
  const [selectedResult, setSelectedResult] = useState<string | null>(null)

  // Simulate typing animation
  useEffect(() => {
    if (!isTyping) return

    const typeText = async () => {
      const text = 'paracetamol'
      for (let i = 0; i <= text.length; i++) {
        setSearchQuery(text.slice(0, i))
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      setIsTyping(false)
      setTimeout(() => setShowResults(true), 500)
    }

    typeText()
  }, [isTyping])

  // Auto-rotate suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion(prev => (prev + 1) % searchSuggestions.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSearchClick = () => {
    setIsTyping(true)
    setShowResults(false)
    setSelectedResult(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Search Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="flex items-center bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-600/30 p-4">
            <Search className="w-5 h-5 text-blue-300 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, suppliers, or buyers..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              disabled={isTyping}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearchClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Search
            </motion.button>
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {!isTyping && !showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-600/30 p-4"
              >
                <div className="text-sm text-gray-300 mb-2">Popular Searches:</div>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setIsTyping(true)
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition-all ${
                        index === currentSuggestion
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700/50 text-blue-300 hover:bg-gray-600/50'
                      }`}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="text-white">
                <span className="text-2xl font-bold">{sampleResults.length}</span>
                <span className="text-gray-300 ml-2">trade records found</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Total Value: $6.3M</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>4 Suppliers</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  <span>4 Countries</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid gap-4">
              {sampleResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedResult(selectedResult === result.id ? null : result.id)}
                  className="cursor-pointer"
                >
                  <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-600/30 hover:border-gray-500/50 transition-all">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-white font-semibold">{result.supplier}</h3>
                            <span className="text-gray-400">→</span>
                            <h4 className="text-blue-300 font-medium">{result.buyer}</h4>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{result.product}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{result.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              <span>{result.country}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-lg">{result.value}</div>
                          <div className="text-xs text-gray-400">Trade Value</div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {selectedResult === result.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-600/30"
                          >
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Supplier Details:</span>
                                <p className="text-white">ABC Pharmaceuticals Ltd</p>
                                <p className="text-gray-300">Est. 1995 • 500+ Employees</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Buyer Details:</span>
                                <p className="text-white">United Health Systems</p>
                                <p className="text-gray-300">Healthcare • Fortune 500</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Product Category:</span>
                                <p className="text-white">Pharmaceuticals</p>
                                <p className="text-gray-300">HS Code: 3004.90</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Market Share:</span>
                                <p className="text-white">15.2%</p>
                                <p className="text-gray-300">Top 3 Supplier</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg border border-gray-600/30 transition-all"
              >
                Load More Results
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 