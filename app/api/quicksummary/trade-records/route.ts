import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Cache for performance optimization
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface TradeRecord {
  id: string
  supplier_name: string
  buyer_name: string
  product_description: string
  hs_code: string
  total_value_usd: string
  shipping_bill_date: string
  country_of_destination: string
  quantity: string
  uqc: string
}

interface TradeRecordsResponse {
  records: TradeRecord[]
  summary: {
    totalRecords: number
    totalValue: number
    averageValue: number
    uniqueSuppliers: number
    uniqueBuyers: number
  }
  dateRange: string
}

// Safe database query wrapper
async function safeDatabaseQuery<T>(queryFn: () => Promise<T>): Promise<T> {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Create optimized date range for database queries
function createOptimizedDateRange(startDateParam: string, endDateParam: string) {
  const startYear = parseInt(startDateParam.split('-')[0])
  const startMonth = parseInt(startDateParam.split('-')[1])
  const endYear = parseInt(endDateParam.split('-')[0])
  const endMonth = parseInt(endDateParam.split('-')[1])
  
  if (!startYear || !startMonth || !endYear || !endMonth) {
    // Default to 2025-01 to 2025-05 if date parsing fails
    return {
      startDate: new Date(2025, 0, 1), // January 1, 2025
      endDate: new Date(2025, 4, 31)   // May 31, 2025
    }
  }
  
  return {
    startDate: new Date(startYear, startMonth - 1, 1),
    endDate: new Date(endYear, endMonth, 0) // Last day of end month
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const { searchParams } = new URL(request.url)
  
  const searchQuery = searchParams.get('q') || ''
  // Increase default limit to show more comprehensive data
  const limit = parseInt(searchParams.get('limit') || '1000')
  // Remove date range parameter - show all data from database
  
  // Remove date range parsing - no longer needed
  
  // Create readable date range for all data
  const readableDateRange = 'All available data'

  console.log(`🚀 Trade Records API called for: "${searchQuery}" at ${new Date().toISOString()}`)

  // Check cache first
  const cacheKey = `${searchQuery.toLowerCase().trim()}_${limit}_all_data`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    const cacheTime = Date.now() - startTime
    console.log(`⚡ Cache hit for: "${searchQuery}" - Response time: ${cacheTime}ms`)
    return NextResponse.json(cached.data)
  }

  // If no search query, return empty result
  if (!searchQuery || searchQuery.trim() === '') {
    const emptyResponse: TradeRecordsResponse = {
      records: [],
      summary: {
        totalRecords: 0,
        totalValue: 0,
        averageValue: 0,
        uniqueSuppliers: 0,
        uniqueBuyers: 0
      },
      dateRange: readableDateRange
    }
    return NextResponse.json(emptyResponse)
  }

  // OPTIMIZED VERSION - Using composite index (product_description, shipping_bill_date)
  let records: any[] = []
  try {
    // Remove optimized date range - show all data
    console.log(`📅 Using all available data - no date restrictions`)
    
    records = await safeDatabaseQuery(async () => {
      return await prisma.exp_india.findMany({
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
            // Remove year filtering - show all data
          ]
        },
        select: {
          supplier_name: true,
          buyer_name: true,
          product_description: true,
          hs_code: true,
          total_value_usd: true,
          shipping_bill_date: true,
          country_of_destination: true,
          quantity: true,
          uqc: true
        },
        take: limit,
        orderBy: {
          total_value_usd: 'desc'
        }
      })
    })
  } catch (dbError) {
    console.error(`❌ Database query failed for "${searchQuery}":`, dbError)
    
    const emptyResponse: TradeRecordsResponse = {
      records: [],
      summary: {
        totalRecords: 0,
        totalValue: 0,
        averageValue: 0,
        uniqueSuppliers: 0,
        uniqueBuyers: 0
      },
      dateRange: readableDateRange
    }
    
    cache.set(cacheKey, { data: emptyResponse, timestamp: Date.now() })
    
    const totalTime = Date.now() - startTime
    console.log(`✅ Empty response returned for "${searchQuery}" due to database query issue`)
    console.log(`⏱️ Total API response time: ${totalTime}ms`)
    
    return NextResponse.json(emptyResponse, { status: 200 })
  }

  console.log(`📊 Fetched ${records.length} records from database (using composite index product_date_idx)`)
  
  // Check the actual date format in the first few records
  if (records.length > 0) {
    console.log(`📅 Sample date formats from database:`)
    records.slice(0, 3).forEach((record, index) => {
      console.log(`  Record ${index + 1}: shipping_bill_date = "${record.shipping_bill_date}"`)
    })
    console.log(`📅 Total records with dates: ${records.filter(r => r.shipping_bill_date).length}`)
    console.log(`📅 Records without dates: ${records.filter(r => !r.shipping_bill_date).length}`)
  }
  
  // Remove date filtering - show all available data
  let filteredRecords = records.filter(record => {
    // Only filter out records without dates
    return record.shipping_bill_date && record.shipping_bill_date !== 'Not Released'
  })
  
  console.log(`📅 Found ${filteredRecords.length} records with valid dates (${records.length} total records available)`)
  
  // If no records with valid dates, but we have data, show what's available
  if (filteredRecords.length === 0 && records.length > 0) {
    console.log(`📅 No records with valid dates, but ${records.length} records available. Showing all available data.`)
    filteredRecords = records
  }

  // Calculate summary statistics
  const totalRecords = filteredRecords.length
  const totalValue = filteredRecords.reduce((sum, record) => sum + (parseFloat(record.total_value_usd || '0') || 0), 0)
  const averageValue = totalRecords > 0 ? totalValue / totalRecords : 0
  const uniqueSuppliers = new Set(filteredRecords.map(r => r.supplier_name).filter(Boolean)).size
  const uniqueBuyers = new Set(filteredRecords.map(r => r.buyer_name).filter(Boolean)).size

  // Transform records to match expected format
  const transformedRecords: TradeRecord[] = filteredRecords.map((record, index) => ({
    id: `record-${index + 1}`,
    supplier_name: record.supplier_name || 'Unknown Supplier',
    buyer_name: record.buyer_name || 'Unknown Buyer',
    product_description: record.product_description || 'Unknown Product',
    hs_code: record.hs_code || 'Unknown HS Code',
    total_value_usd: record.total_value_usd || '0',
    shipping_bill_date: record.shipping_bill_date || 'Unknown Date',
    country_of_destination: record.country_of_destination || 'Unknown Country',
    quantity: record.quantity || '0',
    uqc: record.uqc || 'Unknown UQC'
  }))

  const response: TradeRecordsResponse = {
    records: transformedRecords,
    summary: {
      totalRecords,
      totalValue,
      averageValue,
      uniqueSuppliers,
      uniqueBuyers
    },
    dateRange: readableDateRange
  }

  // Cache the response
  cache.set(cacheKey, { data: response, timestamp: Date.now() })
  
  const totalTime = Date.now() - startTime
  console.log(`✅ Trade records response generated for "${searchQuery}"`)
  console.log(`📊 Records: ${totalRecords}, Value: $${totalValue.toLocaleString()}, Suppliers: ${uniqueSuppliers}, Buyers: ${uniqueBuyers}`)
  console.log(`⏱️ Total API response time: ${totalTime}ms`)
  
  return NextResponse.json(response)
}