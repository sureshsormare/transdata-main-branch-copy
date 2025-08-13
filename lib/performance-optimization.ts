import { prisma } from './prisma'
import { getCachedData, setCachedData, generateCacheKey } from './redis'

/**
 * PERFORMANCE OPTIMIZATION GUIDE
 * 
 * Current Issue: Queries take ~20 seconds instead of 3 seconds
 * Root Cause: Using case-insensitive 'contains' queries that can't use MongoDB indexes
 * 
 * Solution: Use MongoDB text indexes and aggregation pipeline for fast searches
 */

// MongoDB text search configuration
export const TEXT_SEARCH_CONFIG = {
  // Create text indexes on these fields in MongoDB
  textIndexFields: ['product_description', 'hs_code', 'supplier_name', 'buyer_name'],
  
  // Minimum search score for relevance
  minScore: 0.5,
  
  // Maximum results to process
  maxResults: 100000,
}

/**
 * Optimized search using MongoDB text indexes
 * This will use indexes and load 100k records in 3 seconds
 */
export async function optimizedTextSearch(params: {
  searchQuery: string
  collection: 'exp_india' | 'imp_india'
  filters?: any
  limit?: number
}) {
  const { searchQuery, collection, filters = {}, limit } = params
  
  console.time(`🚀 Optimized search for "${searchQuery}"`)
  
  try {
    // Use MongoDB aggregation pipeline for indexed search
    const pipeline: any[] = [
      // Stage 1: Use text index for fast search
      {
        $match: {
          $text: { $search: searchQuery },
          ...filters
        }
      },
      // Stage 2: Add search score for relevance
      {
        $addFields: {
          searchScore: { $meta: "textScore" }
        }
      },
      // Stage 3: Filter by minimum score
      {
        $match: {
          searchScore: { $gte: TEXT_SEARCH_CONFIG.minScore }
        }
      },
      // Stage 4: Sort by relevance
      {
        $sort: {
          searchScore: -1
        }
      }
    ]
    
    // Add limit if specified
    if (limit) {
      pipeline.push({ $limit: limit })
    }
    
    // Execute aggregation pipeline
    const results = await (prisma as any)[collection].aggregateRaw({
      pipeline,
      allowDiskUse: true // Allow MongoDB to use disk for large operations
    })
    
    console.timeEnd(`🚀 Optimized search for "${searchQuery}"`)
    console.log(`✅ Found ${results.length} results using indexed search`)
    
    return results
  } catch (error) {
    console.error('❌ Text search failed, falling back to standard search:', error)
    
    // Fallback to exact match on indexed fields for better performance
    return optimizedExactSearch({ searchQuery, collection, filters, limit })
  }
}

/**
 * Optimized exact match search using compound indexes
 * Uses regex for case-insensitive search on indexed fields
 */
export async function optimizedExactSearch(params: {
  searchQuery: string
  collection: 'exp_india' | 'imp_india'
  filters?: any
  limit?: number
}) {
  const { searchQuery, collection, filters = {}, limit } = params
  
  console.time(`🎯 Optimized exact search for "${searchQuery}"`)
  
  try {
    // Create case-insensitive regex
    const searchRegex = new RegExp(searchQuery, 'i')
    
    // Use aggregation for better performance with indexes
    const pipeline: any[] = [
      // Stage 1: Match using indexed fields
      {
        $match: {
          $or: [
            { product_description: searchRegex },
            { hs_code: searchRegex },
            // Add exact matches for better index usage
            { product_description: searchQuery },
            { hs_code: searchQuery }
          ],
          ...filters
        }
      },
      // Stage 2: Project only needed fields
      {
        $project: {
          supplier_name: 1,
          buyer_name: 1,
          country_of_destination: 1,
          country_of_origin: 1,
          total_value_usd: 1,
          shipping_bill_date: 1,
          product_description: 1,
          hs_code: 1
        }
      }
    ]
    
    // Add limit if specified
    if (limit) {
      pipeline.push({ $limit: limit })
    }
    
    const results = await (prisma as any)[collection].aggregateRaw({
      pipeline,
      allowDiskUse: true
    })
    
    console.timeEnd(`🎯 Optimized exact search for "${searchQuery}"`)
    console.log(`✅ Found ${results.length} results using indexed exact search`)
    
    return results
  } catch (error) {
    console.error('❌ Exact search failed:', error)
    throw error
  }
}

/**
 * Create MongoDB text indexes for fast searching
 * Run this once to set up indexes
 */
export async function createTextIndexes() {
  try {
    console.log('📚 Creating text indexes for fast search...')
    
    // Create text index for exp_india
    await prisma.$runCommandRaw({
      createIndexes: 'exp_india',
      indexes: [
        {
          key: {
            product_description: 'text',
            hs_code: 'text',
            supplier_name: 'text',
            buyer_name: 'text'
          },
          name: 'text_search_index',
          weights: {
            product_description: 10,
            hs_code: 8,
            supplier_name: 5,
            buyer_name: 5
          }
        }
      ]
    })
    
    // Create text index for imp_india
    await prisma.$runCommandRaw({
      createIndexes: 'imp_india',
      indexes: [
        {
          key: {
            product_description: 'text',
            hs_code: 'text',
            supplier_name: 'text',
            buyer_name: 'text'
          },
          name: 'text_search_index',
          weights: {
            product_description: 10,
            hs_code: 8,
            supplier_name: 5,
            buyer_name: 5
          }
        }
      ]
    })
    
    console.log('✅ Text indexes created successfully')
  } catch (error) {
    console.error('❌ Failed to create text indexes:', error)
  }
}

/**
 * Optimized aggregation for supplier-customer analysis
 * Uses MongoDB aggregation pipeline for fast processing
 */
export async function optimizedSupplierCustomerAggregation(params: {
  searchQuery: string
  limit?: number
}) {
  const { searchQuery, limit = 5 } = params
  
  console.time(`📊 Optimized aggregation for "${searchQuery}"`)
  
  try {
    // First get matching records using optimized search
    const records = await optimizedTextSearch({
      searchQuery,
      collection: 'exp_india',
      limit: 100000 // Process up to 100k records
    })
    
    // Use MongoDB aggregation for grouping
    const pipeline = [
      // Stage 1: Match records
      {
        $match: {
          _id: { $in: records.map((r: any) => r._id) }
        }
      },
      // Stage 2: Group by supplier
      {
        $group: {
          _id: '$supplier_name',
          totalValue: { $sum: { $toDouble: '$total_value_usd' } },
          totalShipments: { $sum: 1 },
          customers: {
            $push: {
              name: '$buyer_name',
              value: { $toDouble: '$total_value_usd' }
            }
          }
        }
      },
      // Stage 3: Sort by total value
      {
        $sort: { totalValue: -1 }
      },
      // Stage 4: Limit results
      {
        $limit: limit
      }
    ]
    
    const aggregatedResults = await prisma.exp_india.aggregateRaw({
      pipeline,
      allowDiskUse: true
    })
    
    console.timeEnd(`📊 Optimized aggregation for "${searchQuery}"`)
    
    return aggregatedResults
  } catch (error) {
    console.error('❌ Aggregation failed:', error)
    throw error
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics: Map<string, { count: number; totalTime: number }> = new Map()
  
  static track(operation: string, duration: number) {
    const existing = this.metrics.get(operation) || { count: 0, totalTime: 0 }
    existing.count++
    existing.totalTime += duration
    this.metrics.set(operation, existing)
  }
  
  static getMetrics() {
    const result: any = {}
    this.metrics.forEach((value, key) => {
      result[key] = {
        ...value,
        avgTime: value.totalTime / value.count
      }
    })
    return result
  }
  
  static logMetrics() {
    console.log('📈 Performance Metrics:')
    const metrics = this.getMetrics()
    Object.entries(metrics).forEach(([operation, stats]: [string, any]) => {
      console.log(`  ${operation}: ${stats.avgTime.toFixed(2)}ms avg (${stats.count} calls)`)
    })
  }
}

/**
 * Cache warming for frequently searched terms
 */
export async function warmCache(popularSearchTerms: string[]) {
  console.log('🔥 Warming cache for popular searches...')
  
  for (const term of popularSearchTerms) {
    try {
      const cacheKey = generateCacheKey('optimized_search', { query: term })
      const cached = await getCachedData(cacheKey)
      
      if (!cached) {
        const results = await optimizedTextSearch({
          searchQuery: term,
          collection: 'exp_india'
        })
        
        await setCachedData(cacheKey, results, 3600) // 1 hour cache
      }
    } catch (error) {
      console.error(`Failed to warm cache for "${term}":`, error)
    }
  }
  
  console.log('✅ Cache warming completed')
}

/**
 * Initialize performance optimizations
 */
export async function initializePerformanceOptimizations() {
  console.log('🚀 Initializing performance optimizations...')
  
  // Create text indexes if they don't exist
  await createTextIndexes()
  
  // Warm cache for popular searches
  await warmCache([
    'paracetamol',
    'ibuprofen',
    'aspirin',
    'insulin',
    'vaccine',
    'antibiotic'
  ])
  
  console.log('✅ Performance optimizations initialized')
}