"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import UnifiedSankeyDiagram from '../../components/charts/UnifiedSankeyDiagram'

interface SupplierCustomerData {
  supplier: {
    name: string
    totalValue: number
    totalShipments: number
    marketShare: number
    totalCustomers: number
  }
  customers: Array<{
    name: string
    value: number
    shipments: number
    percentage: number
  }>
}

interface GeographicData {
  country: {
    name: string
    totalValue: number
    totalShipments: number
    marketShare: number
    totalImporters: number
  }
  importers: Array<{
    name: string
    value: number
    shipments: number
    percentage: number
  }>
}

interface QuickSummaryResponse {
  type: string
  dateRange: string
  topSuppliers?: SupplierCustomerData[]
  topCountries?: GeographicData[]
  summary: {
    totalValue: number
    totalShipments: number
    averageValue: number
    supplierCount?: number
    countryCount?: number
  }
}

export default function SupplierCustomerSummary() {
  const [data, setData] = useState<QuickSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStage, setCurrentStage] = useState(0)
  // const [stageDuration, setStageDuration] = useState(5000) // Default 5 seconds
  const [showSupplierDiagram, setShowSupplierDiagram] = useState(false)
  const [showGeographicDiagram, setShowGeographicDiagram] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(searchQuery)

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Update search input when URL parameter changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Format currency function
  const formatCurrency = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return "$0"
    const num = parseFloat(value.toString() || "0")
    
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}Bn`
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}Mn`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  // Format large numbers function
  const formatLargeNumber = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return "0"
    const num = parseFloat(value.toString() || "0")
    
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}Bn`
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}Mn`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    
    return num.toLocaleString()
  }

  useEffect(() => {
    const fetchData = async () => {
      const componentStartTime = Date.now()
      console.log(`🎯 Quick Summary Component started for: "${searchQuery}"`)
      
      // Declare timers in function scope for cleanup
      let stageTimer: NodeJS.Timeout | undefined
      let animationStartTime: number
      
      try {
        setLoading(true)
        setError(null)
        setCurrentStage(0)
        setShowSupplierDiagram(false)
        setShowGeographicDiagram(false)
        animationStartTime = Date.now()
        
        // Calculate dynamic stage duration for 20-second total animation
        const totalAnimationTime = 20000 // 20 seconds total
        const totalStages = 8
        const calculatedStageDuration = totalAnimationTime / totalStages // 2.5 seconds per stage
        
        stageTimer = setInterval(() => {
          setCurrentStage(prev => {
            if (prev < totalStages - 1) {
              return prev + 1
            }
            return prev
          })
        }, calculatedStageDuration) // Dynamic stage duration
        

        
        // Check for cached data first
        const cacheCheckStartTime = Date.now()
        const cachedData = localStorage.getItem('quickSummaryData')
        const cachedTimestamp = localStorage.getItem('quickSummaryTimestamp')
        const cacheAge = cachedTimestamp ? Date.now() - parseInt(cachedTimestamp) : 0
        const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
        
        const cacheCheckTime = Date.now() - cacheCheckStartTime
        console.log(`🔍 Cache check time: ${cacheCheckTime}ms`)
        
                  // If we have fresh cached data, use it
          if (cachedData && cacheAge < CACHE_DURATION) {
            try {
              const parsedData = JSON.parse(cachedData)
              // Verify the cached data is for the current search query
              if (parsedData.searchQuery === searchQuery) {
                const cacheHitTime = Date.now() - componentStartTime
                console.log(`⚡ Cache hit for: "${searchQuery}" - Total time: ${cacheHitTime}ms`)
                setData(parsedData)
                setLoading(false)
                clearInterval(stageTimer)
                return
              }
            } catch {
              // If parsing fails, continue with API call
              console.log(`❌ Cached data parsing failed, fetching fresh data`)
            }
          }
        
        // If no cached data or cache is stale, fetch from API immediately
        const apiCallStartTime = Date.now()
        
        // Create parameters for both supplier and geographic analysis
        const supplierParams = new URLSearchParams({
          type: 'supplier-customer',
          // Remove date range parameter - show all data from database
          limit: '5'
        })
        
        const geographicParams = new URLSearchParams({
          type: 'geographic',
          // Remove date range parameter - show all data from database
          limit: '5'
        })
        
        if (searchQuery) {
          supplierParams.append('q', searchQuery)
          geographicParams.append('q', searchQuery)
        }
        
        console.log(`🌐 Making parallel API calls for: "${searchQuery}"`)
        
        try {
          // Fetch both analyses in parallel
          const [supplierResponse, geographicResponse] = await Promise.all([
            fetch(`/api/quicksummary/supplier-customer-summary?${supplierParams}`),
            fetch(`/api/quicksummary/supplier-customer-summary?${geographicParams}`)
          ])
          
          const apiCallTime = Date.now() - apiCallStartTime
          console.log(`📡 Parallel API calls completed in: ${apiCallTime}ms`)
          
          if (!supplierResponse.ok) {
            throw new Error(`Supplier API HTTP ${supplierResponse.status}: ${supplierResponse.statusText}`)
          }
          
          if (!geographicResponse.ok) {
            throw new Error(`Geographic API HTTP ${geographicResponse.status}: ${geographicResponse.statusText}`)
          }
          
          const [supplierResult, geographicResult] = await Promise.all([
            supplierResponse.json(),
            geographicResponse.json()
          ])
          
          // Combine both results
          const result: QuickSummaryResponse & { searchQuery: string } = {
            type: 'combined-analysis',
            dateRange: supplierResult.dateRange,
            topSuppliers: supplierResult.topSuppliers || [],
            topCountries: geographicResult.topCountries || [],
            summary: {
              totalValue: supplierResult.summary.totalValue,
              totalShipments: supplierResult.summary.totalShipments,
              averageValue: supplierResult.summary.averageValue,
              supplierCount: supplierResult.summary.supplierCount,
              countryCount: geographicResult.summary.countryCount
            },
            searchQuery: searchQuery
          }
          
          const totalTime = Date.now() - componentStartTime
          console.log(`✅ Quick Summary Component completed for: "${searchQuery}" - Total time: ${totalTime}ms`)
          console.log(`📊 Parallel performance breakdown:`)
          console.log(`   - Cache check: ${cacheCheckTime}ms`)
          console.log(`   - API calls: ${apiCallTime}ms`)
          console.log(`   - Total: ${totalTime}ms`)
          
          setData(result)
          
          // Calculate actual API time and adjust animation if needed
          const actualApiTime = Date.now() - animationStartTime
          const expectedTotalTime = totalAnimationTime
          
          console.log(`⏱️ API completed in ${actualApiTime}ms, expected ${expectedTotalTime}ms`)
          
          // If API completed faster than expected, show final stage briefly then stop
          if (actualApiTime < expectedTotalTime) {
            setCurrentStage(totalStages - 1) // Jump to final stage
            // Wait a brief moment to show the final stage, then stop loading
            setTimeout(() => {
              setLoading(false)
              // Start rendering diagrams after loading is complete with staggered timing
              setTimeout(() => setShowSupplierDiagram(true), 100) // Show first diagram after 100ms
              setTimeout(() => setShowGeographicDiagram(true), 500) // Show second diagram after 500ms
            }, 400) // Show final stage for 400ms
          } else {
            // If API took longer, stop loading immediately
            setLoading(false)
            // Start rendering diagrams immediately with staggered timing
            setTimeout(() => setShowSupplierDiagram(true), 100)
            setTimeout(() => setShowGeographicDiagram(true), 500)
          }
          
          // Clear timers when data is loaded
          clearInterval(stageTimer)
        } catch (fetchError) {
          throw fetchError // Re-throw errors for proper handling
        }
      } catch (err) {
        const errorTime = Date.now() - componentStartTime
        console.error(`❌ Quick Summary Component error after ${errorTime}ms:`, err)
        
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
        // Timers may not be defined if an error occurred before their initialization
        if (typeof stageTimer !== 'undefined') clearInterval(stageTimer)
      }
    }

    // Fetch data immediately when component mounts or searchQuery changes
    fetchData()
  }, [searchQuery])

  // Cleanup effect to clear timers when component unmounts
  useEffect(() => {
    return () => {
      // This will be called when component unmounts
      // The stageTimer is cleared in the fetchData function when data loads
    }
  }, [])

  if (loading) {
    const stages = [
      {
        message: `🔍 Querying trade database for "${searchQuery}"...`,
        detail: "Searching through product descriptions and HS codes"
      },
      {
        message: `📊 Filtering records by date range and relevance...`,
        detail: "Applying date filters and relevance scoring"
      },
      {
        message: `🏭 Analyzing supplier profiles...`,
        detail: "Calculating market shares and trade volumes"
      },
      {
        message: `👥 Mapping customer relationships and trade patterns...`,
        detail: "Identifying key customers and purchase patterns"
      },
      {
        message: `🌍 Analyzing trade flows across countries...`,
        detail: "Mapping import-export relationships by country"
      },
      {
        message: `📈 Calculating market shares and value distributions...`,
        detail: "Computing percentages and market dominance"
      },
      {
        message: `⚡ Optimizing data for visualization...`,
        detail: "Preparing data structures for Sankey diagrams"
      },
      {
        message: `🎯 Finalizing interactive diagrams...`,
        detail: "Rendering proportional flows and dynamic labels"
      }
    ]

    const currentStageData = stages[currentStage]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white via-blue-50/40 to-purple-50/30 backdrop-blur-xl border border-white/40 rounded-2xl p-8 mb-6 shadow-2xl"
      >
        {/* AI Platform Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Quick Market Summary</h3>
              <p className="text-blue-600 text-sm">Analyzing trade patterns...</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Independent Load</span>
          </div>
        </div>
        
        {/* Modern Circular Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
            <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDelay: '-1s' }}></div>
          </div>
        </div>
        
        {/* Current Stage Display */}
        <div className="space-y-4">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-sm"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">Processing...</span>
              </div>
              <p className="text-gray-800 font-medium text-lg mb-3">
                {currentStageData.message}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentStageData.detail}
              </p>
            </div>
          </motion.div>



          {/* Global Database Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-blue-700">Global Database Intelligence</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-black text-blue-600">50M+</div>
                <div className="text-sm font-bold text-blue-600">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-indigo-600">180+</div>
                <div className="text-sm font-bold text-indigo-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-purple-600">10K+</div>
                <div className="text-sm font-bold text-purple-600">Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-cyan-600">$500B+</div>
                <div className="text-sm font-bold text-cyan-600">Trade Value</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Performance & AI Capabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-blue-700">Performance Optimized</span>
            </div>
            <p className="text-xs text-gray-600">
              ⚡ This analysis typically takes 15-20 seconds. We&apos;re processing large datasets and generating comprehensive visualizations.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Real-time Intelligence</span>
            </div>
            <p className="text-xs text-gray-600">
              🧠 Processing large datasets and generating comprehensive visualizations
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-purple-700">Predictive Analytics</span>
            </div>
            <p className="text-xs text-gray-600">
              📊 Mapping import-export relationships with AI-driven insights
            </p>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm">Failed to load supplier-customer summary</p>
          <p className="text-xs text-gray-400 mt-1">{error}</p>
        </div>
      </motion.div>
    )
  }

  if (!data || !data.topSuppliers || data.topSuppliers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Market Summary</h3>
          <div className="text-sm text-gray-500 mb-4">
            Analysis period: {data?.dateRange || "All available data"}
          </div>
          <p className="text-sm text-gray-500">
            No supplier data found for &quot;{searchQuery}&quot; in the specified time period.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This could mean no shipments were recorded for this product in the available data.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-cyan-100/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-cyan-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        <div className="mb-6 bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/40"
        >
      {/* Simple Search Header */}
      <div className="mb-6 bg-white/90 backdrop-blur-lg border-b border-blue-200/50 pb-4 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section - Title and Search */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Link
                href="/"
                className="flex items-center justify-center w-8 h-8 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Quick Market Analysis
                </h1>
                <p className="text-xs text-gray-600">
                  Search for <span className="font-medium text-gray-900">&quot;{searchQuery}&quot;</span>
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="flex items-center p-3">
                    {/* Search Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Search Input */}
                    <div className="flex-1 px-4">
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search finished formulations, APIs, or pharmaceutical products..."
                        className="w-full text-base text-gray-900 bg-transparent border-none outline-none placeholder-gray-500"
                      />
                    </div>
                    
                    {/* Search Button */}
                    <div className="flex-shrink-0 mr-2">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white px-6 py-2.5 rounded-2xl font-medium hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 transition-all duration-300 text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <span>Search</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Right Section - Action Buttons */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 max-w-sm">
            <div className="text-center">
              <div className="space-y-2">
                <Link
                  href="/trial"
                  className="inline-block w-full px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-2xl hover:bg-blue-700 transition-colors"
                >
                  Get Free 7-Day Trial
                </Link>
                <Link
                  href="/consultation"
                  className="inline-block w-full px-3 py-2 bg-white text-blue-600 text-xs font-medium rounded-2xl border border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  Consult an Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Market Analysis Dashboard */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">📊 Market Analysis: Top Suppliers & Customer Networks</h2>
              <p className="text-sm text-gray-600">Comprehensive market intelligence dashboard</p>
            </div>
          </div>

          {/* Single Row Comprehensive Dashboard */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Market Overview Metrics */}
              <div className="lg:col-span-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-800">{formatCurrency(data.summary.totalValue)}</div>
                    <div className="text-xs text-blue-600 font-medium">Market Value</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                    <div className="text-2xl font-bold text-green-800">{formatLargeNumber(data.summary.totalShipments)}</div>
                    <div className="text-xs text-green-600 font-medium">Total Shipments</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <div className="text-2xl font-bold text-purple-800">{data.topSuppliers?.length || 0}</div>
                    <div className="text-xs text-purple-600 font-medium">Top Suppliers</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                    <div className="text-2xl font-bold text-orange-800">{formatCurrency(data.summary.averageValue)}</div>
                    <div className="text-xs text-orange-600 font-medium">Avg. Value</div>
                  </div>
                </div>
              </div>

              {/* Complete Supplier Breakdown - Including Other Suppliers */}
              <div className="lg:col-span-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-900">Complete Market Coverage (100%)</span>
                  </div>
                  <div className="space-y-1">
                    {data.topSuppliers?.map((supplier, index) => (
                      <div key={supplier.supplier.name} className="flex items-center text-xs">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900 truncate max-w-[320px]">
                            {supplier.supplier.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 ml-5">
                          <span className="font-semibold">{formatCurrency(supplier.supplier.totalValue)}</span>
                          <span className="text-xs">{supplier.supplier.marketShare.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market Insights & Actions */}
              <div className="lg:col-span-3">
                <div className="space-y-3">
                  {/* Market Coverage */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-3 border border-indigo-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      <span className="text-xs font-semibold text-indigo-900">Market Coverage</span>
                    </div>
                    <div className="text-sm font-bold text-indigo-800">
                      100%
                    </div>
                    <div className="text-xs text-indigo-600">Complete market</div>
                  </div>

                  {/* Additional Market Metrics */}
                  <div className="space-y-2">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-2 border border-indigo-200">
                      <div className="text-lg font-bold text-indigo-800">{data.topSuppliers?.[0]?.supplier.marketShare.toFixed(1) || '0'}%</div>
                      <div className="text-xs text-indigo-600 font-medium">Top Supplier Share</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Period */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <span>📅 Analysis Period: {data.dateRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Live Data
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Market Analysis: Top Suppliers & Their Customer Networks
        </h2>
        <p className="text-sm text-gray-600">
          Analysis period: {data.dateRange} • Total market value: {formatCurrency(data.summary.totalValue)} • {formatLargeNumber(data.summary.totalShipments)} total shipments
        </p>
      </div>



      {/* Narrative Summary */}
      <div className="space-y-6 text-gray-700 leading-relaxed">
        
        {/* Market Overview */}
        <div className="bg-blue-50 p-4 rounded-2xl border-l-4 border-blue-400">
          <p className="text-sm">
            <strong className="text-blue-900">Market Overview:</strong> During the analysis period from {data.dateRange}, 
            the market for {searchQuery || 'pharmaceutical products'} witnessed significant activity with a total market value of {formatCurrency(data.summary.totalValue)} 
            across {formatLargeNumber(data.summary.totalShipments)} shipments. The market is characterized by a diverse supplier base, 
            with the top 5 suppliers collectively representing a substantial portion of the market activity.
          </p>
        </div>

        {/* Top Suppliers Analysis */}
        {data.topSuppliers && data.topSuppliers.map((supplierData, index) => {
          const supplier = supplierData.supplier
          const customers = supplierData.customers
          const position = index + 1
          const positionText = position === 1 ? 'first' : position === 2 ? 'second' : position === 3 ? 'third' : position === 4 ? 'fourth' : 'fifth'
          
          return (
            <div key={supplier.name} className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {position}
                  </span>
                  {supplier.name}
                </h3>
                
                <div className="space-y-3 text-sm">
                  <p>
                    <strong className="text-blue-900">{supplier.name}</strong> emerges as the {positionText} largest supplier in the market,{' '}
                    achieving a total trade value of <strong className="text-green-600">{formatCurrency(supplier.totalValue)}</strong>{' '}
                    through <strong className="text-purple-600">{formatLargeNumber(supplier.totalShipments)} shipments</strong>.{' '}
                    This represents a market share of <strong className="text-orange-600">{supplier.marketShare.toFixed(1)}%</strong>{' '}
                    of the total market activity, demonstrating their significant presence in the industry.
                  </p>
                  
                                          {customers.length > 0 && (
                          <div className="mt-4">
                            <p className="mb-2">
                              <strong className="text-gray-900">Customer Network:</strong> {supplier.name} serves a diverse customer base, 
                              with their top customers including:
                            </p>
                            <div className="pl-4 space-y-2">
                              {customers.map((customer) => (
                                <p key={customer.name} className="text-sm">
                                  • <strong className="text-gray-800">{customer.name}</strong> -{' '}
                                  {formatCurrency(customer.value)} across {formatLargeNumber(customer.shipments)} shipments{' '}
                                  ({customer.percentage.toFixed(1)}% of supplier&apos;s total business)
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>Key Insight:</strong> {supplier.name} demonstrates strong market positioning with an average shipment value of {formatCurrency(supplier.totalValue / supplier.totalShipments)}, 
                      indicating {supplier.totalValue / supplier.totalShipments > data.summary.averageValue ? 'premium' : 'competitive'} pricing strategy 
                      compared to the market average of {formatCurrency(data.summary.averageValue)}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Unified Sankey Diagram - Supplier-Customer Analysis */}
        {showSupplierDiagram && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="-mt-8"
          >
            <UnifiedSankeyDiagram 
              width={800} 
              height={750} 
              data={data?.topSuppliers ? {
                topSuppliers: data.topSuppliers,
                summary: {
                  totalValue: data.summary.totalValue,
                  totalShipments: data.summary.totalShipments
                }
              } : undefined}
              type="supplier-customer"
              title="Enterprise Trade Flow Analysis"
              subtitle="Top Suppliers → Global Customers"
              leftLabel="Suppliers"
              rightLabel="Customers"
            />
          </motion.div>
        )}

        {/* CTA after Supplier Analysis */}
        <div className="mb-0 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Detailed Supplier Contact Information</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Access complete supplier profiles, contact details, and historical trade data to build your supplier network.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="px-4 py-2 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition-colors text-sm"
              >
                Contact Sales Team
              </Link>
              <Link
                href="/trial"
                className="px-4 py-2 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Start Free Trial
              </Link>
              <Link
                href="/request-demo"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Comprehensive Geographic Market Analysis Dashboard */}
        {data.topCountries && data.topCountries.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 border border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🌍 Market Analysis: Top Importing Countries & Importers</h2>
                  <p className="text-sm text-gray-600">Comprehensive geographic market intelligence dashboard</p>
                </div>
              </div>

              {/* Single Row Comprehensive Geographic Dashboard */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  
                  {/* Geographic Market Overview Metrics */}
                  <div className="lg:col-span-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                        <div className="text-2xl font-bold text-green-800">{formatCurrency(data.summary.totalValue)}</div>
                        <div className="text-xs text-green-600 font-medium">Market Value</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                        <div className="text-2xl font-bold text-blue-800">{formatLargeNumber(data.summary.totalShipments)}</div>
                        <div className="text-xs text-blue-600 font-medium">Total Shipments</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                        <div className="text-2xl font-bold text-purple-800">{data.topCountries?.length || 0}</div>
                        <div className="text-xs text-purple-600 font-medium">Top Countries</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                        <div className="text-2xl font-bold text-orange-800">{formatCurrency(data.summary.averageValue)}</div>
                        <div className="text-xs text-orange-600 font-medium">Avg. Value</div>
                      </div>
                    </div>
                  </div>

                  {/* Complete Country Breakdown - Including Other Countries */}
                  <div className="lg:col-span-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-900">Complete Geographic Coverage (100%)</span>
                      </div>
                      <div className="space-y-1">
                        {data.topCountries?.map((country, index) => (
                          <div key={country.country.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <span className="font-medium text-gray-900 truncate max-w-[320px]">
                                {country.country.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                              <span className="font-semibold">{formatCurrency(country.country.totalValue)}</span>
                              <span className="text-xs">{country.country.marketShare.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Geographic Market Insights & Actions */}
                  <div className="lg:col-span-3">
                    <div className="space-y-3">
                      {/* Geographic Market Coverage */}
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-3 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                          <span className="text-xs font-semibold text-emerald-900">Geographic Coverage</span>
                        </div>
                        <div className="text-sm font-bold text-emerald-800">
                          100%
                        </div>
                        <div className="text-xs text-emerald-600">Complete market</div>
                      </div>

                      {/* Additional Geographic Metrics */}
                      <div className="space-y-2">
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-2 border border-teal-200">
                          <div className="text-lg font-bold text-teal-800">{data.topCountries?.[0]?.country.marketShare.toFixed(1) || '0'}%</div>
                          <div className="text-xs text-teal-600 font-medium">Top Country Share</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Period */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>📅 Analysis Period: {data.dateRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Live Data
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Geographic Analysis Section */}
        {data.topCountries && data.topCountries.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Market Analysis: Top Importing Countries & Their Importers
              </h3>
              
              {data.topCountries.map((countryData, index) => {
                const country = countryData.country
                const importers = countryData.importers
                const position = index + 1
                const positionText = position === 1 ? 'first' : position === 2 ? 'second' : position === 3 ? 'third' : position === 4 ? 'fourth' : 'fifth'
                
                return (
                  <div key={country.name} className="space-y-4">
                    <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-2xl border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {position}
                        </span>
                        {country.name}
                      </h4>
                      
                      <div className="space-y-3 text-sm">
                        <p>
                          <strong className="text-green-900">{country.name}</strong> emerges as the {positionText} largest importing country,{' '}
                          achieving a total trade value of <strong className="text-green-600">{formatCurrency(country.totalValue)}</strong>{' '}
                          through <strong className="text-purple-600">{formatLargeNumber(country.totalShipments)} shipments</strong>.{' '}
                          This represents a market share of <strong className="text-orange-600">{country.marketShare.toFixed(1)}%</strong>{' '}
                          of the total market activity, demonstrating their significant presence in the industry.
                        </p>
                        
                        {importers.length > 0 && (
                          <div className="mt-4">
                            <p className="mb-2">
                              <strong className="text-gray-900">Top Importers:</strong> {country.name} has a diverse importer base, 
                              with their top importers including:
                            </p>
                            <div className="pl-4 space-y-2">
                              {importers.map((importer) => (
                                <p key={importer.name} className="text-sm">
                                  • <strong className="text-gray-800">{importer.name}</strong> -{' '}
                                  {formatCurrency(importer.value)} across {formatLargeNumber(importer.shipments)} shipments{' '}
                                  ({importer.percentage.toFixed(1)}% of country&apos;s total business)
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            <strong>Key Insight:</strong> {country.name} demonstrates strong market positioning with an average shipment value of {formatCurrency(country.totalValue / country.totalShipments)}, 
                            indicating {country.totalValue / country.totalShipments > data.summary.averageValue ? 'premium' : 'competitive'} pricing strategy 
                            compared to the market average of {formatCurrency(data.summary.averageValue)}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Unified Sankey Diagram - Geographic Analysis */}
        {data.topCountries && data.topCountries.length > 0 && showGeographicDiagram && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="-mt-8"
          >
            <UnifiedSankeyDiagram
              width={800}
              height={750}
              data={{
                topCountries: data.topCountries,
                summary: {
                  totalValue: data.summary.totalValue,
                  totalShipments: data.summary.totalShipments
                }
              }}
              type="geographic"
              title="Geographic Market Flow Analysis"
              subtitle="Top Countries → Global Importers"
              leftLabel="Countries"
              rightLabel="Importers"
            />
          </motion.div>
        )}


      </div>
      
      {/* Final Comprehensive CTA */}
      <div className="mb-8 bg-gradient-to-br from-white via-blue-50/40 to-purple-50/30 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-2xl">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Transform Your Business Intelligence?</h3>
          <p className="text-gray-600 mb-6 text-sm max-w-2xl mx-auto">
            You&apos;ve seen a glimpse of our powerful market intelligence platform. Get complete access to detailed supplier profiles, 
            contact information, historical trade data, and advanced analytics to make informed business decisions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/90 backdrop-blur-lg p-4 rounded-xl border border-white/40 shadow-lg">
              <div className="text-blue-600 mb-2">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Free Trial</h4>
              <p className="text-xs text-gray-600">7-day free trial with full access</p>
            </div>
            <div className="bg-white/90 backdrop-blur-lg p-4 rounded-xl border border-white/40 shadow-lg">
              <div className="text-green-600 mb-2">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Live Demo</h4>
              <p className="text-xs text-gray-600">Personalized platform walkthrough</p>
            </div>
            <div className="bg-white/90 backdrop-blur-lg p-4 rounded-xl border border-white/40 shadow-lg">
              <div className="text-purple-600 mb-2">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Expert Consultation</h4>
              <p className="text-xs text-gray-600">One-on-one strategy session</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/trial"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              href="/request-demo"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white rounded-xl font-medium hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
            >
              Request Demo
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-700 hover:via-purple-700 hover:to-blue-600 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
            >
              Contact Sales
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 border-2 border-blue-300/50 bg-white/50 backdrop-blur-lg text-blue-700 rounded-xl font-medium hover:bg-blue-50/80 hover:border-blue-400/60 transition-all duration-300 text-sm shadow-lg"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
      </div>
      </motion.div>
    </div>
  )
} 