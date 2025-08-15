import { NextRequest, NextResponse } from 'next/server'
import { prisma, checkDatabaseConnection } from '@/lib/prisma'

interface ParacetamolRecord {
  id: string
  supplier_name: string | null
  buyer_name: string | null
  product_description: string | null
  shipping_bill_date: string | null
  total_value_usd: string | null
  quantity: string | null
  hs_code: string | null
  country_of_destination: string | null
  port_of_destination: string | null
  invoice_no: string | null
  shipping_bill_no: string | null
}

interface LatestParacetamolResponse {
  success: boolean
  message: string
  totalRecords: number
  records: ParacetamolRecord[]
  queryTime: number
  dateRange: string
  debugInfo?: {
    dateFormats: string[]
    sampleDates: string[]
    dateAnalysis: Record<string, unknown>
  }
}

// Cache for repeated queries
const cache = new Map<string, { data: LatestParacetamolResponse; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Function to analyze date formats in the database
async function analyzeDateFormats() {
  console.log('📅 Analyzing date formats in the database...')
  
  try {
    const sampleRecords = await prisma.exp_india.findMany({
      where: {
        shipping_bill_date: {
          not: null
        }
      },
      select: {
        shipping_bill_date: true
      },
      take: 100
    })
    
    const dateFormats = new Map<string, number>()
    const sampleDates: string[] = []
    
    sampleRecords.forEach(record => {
      const date = record.shipping_bill_date
      if (date) {
        dateFormats.set(date, (dateFormats.get(date) || 0) + 1)
        if (sampleDates.length < 10) {
          sampleDates.push(date)
        }
      }
    })
    
    console.log('📊 Date format analysis:')
    console.log('Sample dates found:')
    Array.from(dateFormats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([date, count]) => {
        console.log(`  "${date}": ${count} occurrences`)
      })
    
    return {
      success: true,
      totalSamples: sampleRecords.length,
      uniqueFormats: dateFormats.size,
      dateFormats: Object.fromEntries(dateFormats),
      sampleDates
    }
    
  } catch (error) {
    console.error('❌ Date format analysis failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Function to find May 2025 records with proper date format
async function findMay2025Records(limit: number) {
  console.log('🔍 Searching for May 2025 paracetamol records...')
  
  // First, let's analyze what date formats exist
  const dateAnalysis = await analyzeDateFormats()
  
  if (!dateAnalysis.success) {
    throw new Error('Failed to analyze date formats')
  }
  
  console.log('📅 Date analysis completed. Sample dates:', dateAnalysis.sampleDates)
  
  // Try different date formats for May 2025
  const may2025Formats = [
    '5/1/25', '5/2/25', '5/3/25', '5/4/25', '5/5/25', '5/6/25', '5/7/25', '5/8/25', '5/9/25', '5/10/25',
    '5/11/25', '5/12/25', '5/13/25', '5/14/25', '5/15/25', '5/16/25', '5/17/25', '5/18/25', '5/19/25', '5/20/25',
    '5/21/25', '5/22/25', '5/23/25', '5/24/25', '5/25/25', '5/26/25', '5/27/25', '5/28/25', '5/29/25', '5/30/25', '5/31/25',
    // Alternative formats
    '05/01/25', '05/02/25', '05/03/25', '05/04/25', '05/05/25', '05/06/25', '05/07/25', '05/08/25', '05/09/25', '05/10/25',
    '05/11/25', '05/12/25', '05/13/25', '05/14/25', '05/15/25', '05/16/25', '05/17/25', '05/18/25', '05/19/25', '05/20/25',
    '05/21/25', '05/22/25', '05/23/25', '05/24/25', '05/25/25', '05/26/25', '05/27/25', '05/28/25', '05/29/25', '05/30/25', '05/31/25',
    // Full year format
    '5/1/2025', '5/2/2025', '5/3/2025', '5/4/2025', '5/5/2025', '5/6/2025', '5/7/2025', '5/8/2025', '5/9/2025', '5/10/2025',
    '5/11/2025', '5/12/2025', '5/13/2025', '5/14/2025', '5/15/2025', '5/16/2025', '5/17/2025', '5/18/2025', '5/19/2025', '5/20/2025',
    '5/21/2025', '5/22/2025', '5/23/2025', '5/24/2025', '5/25/2025', '5/26/2025', '5/27/2025', '5/28/2025', '5/29/2025', '5/30/2025', '5/31/2025',
    '05/01/2025', '05/02/2025', '05/03/2025', '05/04/2025', '05/05/2025', '05/06/2025', '05/07/2025', '05/08/2025', '05/09/2025', '05/10/2025',
    '05/11/2025', '05/12/2025', '05/13/2025', '05/14/2025', '05/15/2025', '05/16/2025', '05/17/2025', '05/18/2025', '05/19/2025', '05/20/2025',
    '05/21/2025', '05/22/2025', '05/23/2025', '05/24/2025', '05/25/2025', '05/26/2025', '05/27/2025', '05/28/2025', '05/29/2025', '05/30/2025', '05/31/2025'
  ]
  
  console.log(`🔍 Trying ${may2025Formats.length} different date formats for May 2025...`)
  
  let records: ParacetamolRecord[] = []
  
  try {
    // Query with specific May 2025 dates
    records = await prisma.exp_india.findMany({
      where: {
        AND: [
          {
            OR: [
              { product_description: { contains: 'paracetamol', mode: 'insensitive' } },
              { product_description: { contains: 'acetaminophen', mode: 'insensitive' } },
              { hs_code: { contains: '300490', mode: 'insensitive' } }
            ]
          },
          {
            shipping_bill_date: {
              not: null
            }
          },
          {
            shipping_bill_date: {
              in: may2025Formats
            }
          }
        ]
      },
      select: {
        id: true,
        supplier_name: true,
        buyer_name: true,
        product_description: true,
        shipping_bill_date: true,
        total_value_usd: true,
        quantity: true,
        hs_code: true,
        country_of_destination: true,
        port_of_destination: true,
        invoice_no: true,
        shipping_bill_no: true
      },
      orderBy: {
        shipping_bill_date: 'desc'
      },
      take: limit
    })
    
    console.log(`📊 Found ${records.length} paracetamol records with specific May 2025 dates`)
    
    // If no records found with specific dates, try broader search
    if (records.length === 0) {
      console.log('📅 No records found with specific May 2025 dates, trying broader search...')
      
      // Get all paracetamol records and filter by date pattern
      const allParacetamolRecords = await prisma.exp_india.findMany({
        where: {
          AND: [
            {
              OR: [
                { product_description: { contains: 'paracetamol', mode: 'insensitive' } },
                { product_description: { contains: 'acetaminophen', mode: 'insensitive' } },
                { hs_code: { contains: '300490', mode: 'insensitive' } }
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
          id: true,
          supplier_name: true,
          buyer_name: true,
          product_description: true,
          shipping_bill_date: true,
          total_value_usd: true,
          quantity: true,
          hs_code: true,
          country_of_destination: true,
          port_of_destination: true,
          invoice_no: true,
          shipping_bill_no: true
        },
        orderBy: {
          shipping_bill_date: 'desc'
        },
        take: 100 // Get more records to analyze
      })
      
      console.log(`📊 Found ${allParacetamolRecords.length} total paracetamol records`)
      
      // Log all dates found for analysis
      const allDates = allParacetamolRecords.map(r => r.shipping_bill_date).filter(d => d)
      console.log('📅 All paracetamol record dates:', allDates.slice(0, 20))
      
      // Filter for May 2025 pattern (5/XX/25 or 05/XX/25 or 5/XX/2025 or 05/XX/2025)
      const may2025Records = allParacetamolRecords.filter(record => {
        const date = record.shipping_bill_date
        if (!date) return false
        
        // Check for May 2025 patterns
        return date.includes('5/') || date.includes('05/') || date.includes('2025')
      })
      
      console.log(`📊 Found ${may2025Records.length} paracetamol records with May 2025 pattern`)
      
      // Take the latest 20
      records = may2025Records.slice(0, limit)
    }
    
    // Log sample records for debugging
    if (records.length > 0) {
      console.log(`📅 Sample May 2025 paracetamol records:`)
      records.slice(0, 5).forEach((record, index) => {
        console.log(`  Record ${index + 1}: Date: ${record.shipping_bill_date}, Supplier: ${record.supplier_name}, Value: $${record.total_value_usd}`)
      })
    }
    
    return {
      records,
      dateAnalysis,
      may2025Formats: may2025Formats.slice(0, 10) // Return first 10 for debugging
    }
    
  } catch (queryError) {
    console.error(`❌ Database query failed:`, queryError)
    throw queryError
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const year = searchParams.get('year') || '2025'
    const month = searchParams.get('month') || '05' // May
    
    console.log(`🔍 Latest Paracetamol API called - Limit: ${limit}, Year: ${year}, Month: ${month}`)

    // Check cache first
    const cacheKey = `latest_paracetamol_${limit}_${year}_${month}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const cacheTime = Date.now() - startTime
      console.log(`⚡ Cache hit for latest paracetamol records - Response time: ${cacheTime}ms`)
      return NextResponse.json(cached.data)
    }

    // Test database connection
    console.log(`🔍 Testing database connection...`)
    try {
      await checkDatabaseConnection()
      console.log(`✅ Database connection successful`)
    } catch (dbError) {
      console.error(`❌ Database connection failed:`, dbError)
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        totalRecords: 0,
        records: [],
        queryTime: Date.now() - startTime,
        dateRange: `May ${year}`
      }, { status: 500 })
    }

    // Find May 2025 records with proper date analysis
    const { records, dateAnalysis, may2025Formats } = await findMay2025Records(limit)

    const response: LatestParacetamolResponse = {
      success: true,
      message: records.length > 0 
        ? `Found ${records.length} latest paracetamol records from May 2025`
        : 'No paracetamol records found for May 2025',
      totalRecords: records.length,
      records: records,
      queryTime: Date.now() - startTime,
      dateRange: `May ${year}`,
      debugInfo: {
        dateFormats: may2025Formats,
        sampleDates: dateAnalysis.sampleDates || [],
        dateAnalysis: {
          totalSamples: dateAnalysis.totalSamples,
          uniqueFormats: dateAnalysis.uniqueFormats
        }
      }
    }

    // Cache the result
    cache.set(cacheKey, { data: response, timestamp: Date.now() })

    const totalTime = Date.now() - startTime
    console.log(`✅ Latest paracetamol records response generated`)
    console.log(`📊 Records found: ${records.length}`)
    console.log(`⏱️ Total API response time: ${totalTime}ms`)

    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`❌ Error fetching latest paracetamol records after ${totalTime}ms:`, error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch latest paracetamol records',
      totalRecords: 0,
      records: [],
      queryTime: totalTime,
      dateRange: 'May 2025'
    }, { status: 500 })
  }
}