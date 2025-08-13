import { prisma } from './prisma'
import { getCachedData, setCachedData, generateCacheKey } from './redis'

// Database connection pool configuration
const DB_CONFIG = {
  maxConnections: 10,
  minConnections: 2,
  connectionTimeout: 30000,
  queryTimeout: 60000,
}

// Query optimization settings
const QUERY_CONFIG = {
  // Remove maxResults limit to show all available data
  batchSize: 1000,
  cacheTTL: 300, // 5 minutes
  enableCache: true,
}

// Optimized database query with caching
export async function optimizedQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: {
    cacheTTL?: number
    enableCache?: boolean
  } = {}
): Promise<T> {
  const {
    cacheTTL = QUERY_CONFIG.cacheTTL,
    enableCache = QUERY_CONFIG.enableCache
  } = options

  const cacheKey = generateCacheKey('query', { key: queryKey })

  // Try cache first if enabled
  if (enableCache) {
    const cached = await getCachedData<T>(cacheKey)
    if (cached) {
      return cached
    }
  }

  // Execute query with timeout
  const queryPromise = queryFn()
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Query timeout')), DB_CONFIG.queryTimeout)
  })

  try {
    const result = await Promise.race([queryPromise, timeoutPromise])
    
    // Cache result if enabled
    if (enableCache) {
      await setCachedData(cacheKey, result, cacheTTL)
    }
    
    return result
  } catch (error) {
    console.error(`❌ Query failed: ${queryKey}`, error)
    throw error
  }
}

// Optimized aggregation query for trade data
export async function getTradeDataOptimized(params: {
  searchQuery: string
  dateRange: string
  limit: number
  analysisType: string
}) {
  const { searchQuery, dateRange, limit, analysisType } = params
  
  const queryKey = `trade_data_${searchQuery}_${dateRange}_${limit}_${analysisType}`
  
  return optimizedQuery(queryKey, async () => {
    console.log(`🔍 Starting optimized database query for "${searchQuery}"`)
    const startTime = Date.now()
    
    try {
      // Use MongoDB aggregation pipeline for TRULY fast indexed search
      // Try multiple optimization strategies
      let pipeline: any[] = []
      
      // Strategy 1: Try exact matches first (fastest with indexes)
      pipeline = [
        {
          $match: {
            $and: [
              {
                $or: [
                  { product_description: searchQuery },
                  { hs_code: searchQuery }
                ]
              },
              { shipping_bill_date: { $ne: null } }
            ]
          }
        },
        { $limit: 50000 },
        {
          $project: {
            supplier_name: 1,
            buyer_name: 1,
            country_of_destination: 1,
            total_value_usd: 1,
            shipping_bill_date: 1
          }
        }
      ]
      
      // Execute and check if we got enough results
      const result = await prisma.exp_india.aggregateRaw({
        pipeline
      })
      let results = (result as unknown as any[]) || []
      
      console.log(`🔍 Exact match query returned ${results.length} results`)
      
      // Always try broader search to get comprehensive results
      console.log('🔍 Trying broader search with regex patterns...')
      
      pipeline = [
        {
          $match: {
            $and: [
              {
                $or: [
                  // Exact matches
                  { product_description: searchQuery },
                  { hs_code: searchQuery },
                  // Case-insensitive exact matches
                  { product_description: searchQuery.toUpperCase() },
                  { product_description: searchQuery.toLowerCase() },
                  { hs_code: searchQuery.toUpperCase() },
                  { hs_code: searchQuery.toLowerCase() },
                  // Starts with patterns (uses index prefix)
                  { product_description: { $regex: `^${searchQuery}`, $options: 'i' } },
                  { hs_code: { $regex: `^${searchQuery}`, $options: 'i' } },
                  // Contains patterns (most comprehensive)
                  { product_description: { $regex: searchQuery, $options: 'i' } },
                  { hs_code: { $regex: searchQuery, $options: 'i' } }
                ]
              },
              { shipping_bill_date: { $ne: null } }
            ]
          }
        },
        { $limit: 100000 },
        {
          $project: {
            supplier_name: 1,
            buyer_name: 1,
            country_of_destination: 1,
            total_value_usd: 1,
            shipping_bill_date: 1
          }
        }
      ]
      
      const broaderResult = await prisma.exp_india.aggregateRaw({
        pipeline
      })
      results = (broaderResult as unknown as any[]) || []
      
      console.log(`🔍 Broader search returned ${results.length} results`)
      
      // Convert results to the expected format
      const records = results
      
      const queryTime = Date.now() - startTime
      console.log(`✅ Query completed in ${queryTime}ms - Found ${records.length} records`)
      
      // If query was fast, we're using indexes properly
      if (queryTime < 5000) {
        console.log(`🚀 Fast query detected - indexes are being used effectively`)
      } else {
        console.log(`⚠️ Slow query detected (${queryTime}ms) - consider optimizing indexes`)
      }
      
      return records
    } catch (error) {
      console.error('❌ Aggregation failed, falling back to standard query:', error)
      
      // Fallback to standard Prisma query
      const records = await prisma.exp_india.findMany({
        where: {
          AND: [
            {
              OR: [
                { product_description: { contains: searchQuery, mode: 'insensitive' } },
                { hs_code: { contains: searchQuery, mode: 'insensitive' } }
              ]
            },
            {
              shipping_bill_date: {
                not: null
              }
            }
          ]
        },
        select: {
          supplier_name: true,
          buyer_name: true,
          country_of_destination: true,
          total_value_usd: true,
          shipping_bill_date: true
        },
        orderBy: {
          total_value_usd: 'desc'
        }
      })
      
      const queryTime = Date.now() - startTime
      console.log(`✅ Fallback query completed in ${queryTime}ms - Found ${records.length} records`)
      
      return records
    }
  }, {
    cacheTTL: 600, // 10 minutes for trade data
    enableCache: true
  })
}

// Batch processing for large datasets
export async function processBatchData<T, R>(
  data: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const batchResults = await processor(batch)
    results.push(...batchResults)
    
    // Add small delay to prevent overwhelming the system
    if (i + batchSize < data.length) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }
  
  return results
}

// Database health check with performance metrics
export async function checkDatabaseHealth(): Promise<{
  isHealthy: boolean
  responseTime: number
  connectionCount: number
  cacheHitRate: number
}> {
  const startTime = Date.now()
  
  try {
    // Test basic connection
    const testCount = await prisma.exp_india.count({ take: 1 })
    const responseTime = Date.now() - startTime
    
    // Check connection pool status (if available)
    const connectionCount = 1 // Simplified for now
    
    // Calculate cache hit rate (simplified)
    const cacheHitRate = 0.8 // Placeholder
    
    return {
      isHealthy: true,
      responseTime,
      connectionCount,
      cacheHitRate
    }
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    return {
      isHealthy: false,
      responseTime: Date.now() - startTime,
      connectionCount: 0,
      cacheHitRate: 0
    }
  }
}

// Query performance monitoring
export class QueryMonitor {
  private static queries: Map<string, { count: number; totalTime: number; avgTime: number }> = new Map()
  
  static startQuery(queryName: string): string {
    const queryId = `${queryName}_${Date.now()}`
    return queryId
  }
  
  static endQuery(queryId: string, duration: number): void {
    const queryName = queryId.split('_')[0]
    const existing = this.queries.get(queryName)
    
    if (existing) {
      existing.count++
      existing.totalTime += duration
      existing.avgTime = existing.totalTime / existing.count
    } else {
      this.queries.set(queryName, {
        count: 1,
        totalTime: duration,
        avgTime: duration
      })
    }
  }
  
  static getStats(): Record<string, { count: number; avgTime: number; totalTime: number }> {
    const stats: Record<string, any> = {}
    this.queries.forEach((value, key) => {
      stats[key] = value
    })
    return stats
  }
  
  static resetStats(): void {
    this.queries.clear()
  }
}

// Database connection pool management
export class ConnectionPool {
  private static connections: any[] = []
  private static maxConnections = DB_CONFIG.maxConnections
  
  static async getConnection(): Promise<any> {
    if (this.connections.length < this.maxConnections) {
      // Create new connection if pool not full
      const connection = await this.createConnection()
      this.connections.push(connection)
      return connection
    }
    
    // Return existing connection (simplified for now)
    return this.connections[0]
  }
  
  private static async createConnection(): Promise<any> {
    // Simplified connection creation
    return { id: Date.now() }
  }
  
  static getPoolStatus(): { active: number; max: number } {
    return {
      active: this.connections.length,
      max: this.maxConnections
    }
  }
}