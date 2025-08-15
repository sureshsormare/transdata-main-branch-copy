import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCachedData, setCachedData, generateCacheKey, checkRedisHealth } from '@/lib/redis'
import { getTradeDataOptimized, QueryMonitor, checkDatabaseHealth } from '@/lib/database-optimization'

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
  performance?: {
    queryTime: number
    cacheHit: boolean
    recordCount: number
    redisHealth: boolean
    dbHealth: boolean
  }
}

// Performance monitoring
const performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  totalQueries: 0,
  averageResponseTime: 0
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  let queryId: string | null = null
  
  try {
    // Initialize query monitor
    try {
      queryId = QueryMonitor.startQuery('supplier_customer_summary')
    } catch (monitorError) {
      console.error('❌ Failed to start query monitor:', monitorError)
    }
    
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '5')
    // Remove date range parameter - show all data from database
    const analysisType = searchParams.get('type') || 'supplier-customer'
    
    // Check Redis health with error handling
    let redisHealth = false
    try {
      redisHealth = await checkRedisHealth()
    } catch (redisError) {
      console.error('❌ Redis health check failed:', redisError)
      redisHealth = false
    }

    // Check database health with error handling
    let dbHealth = { isHealthy: false }
    try {
      dbHealth = await checkDatabaseHealth()
    } catch (dbError) {
      console.error('❌ Database health check failed:', dbError)
      dbHealth = { isHealthy: false }
    }

    // Generate cache key
    const cacheKey = generateCacheKey('supplier_customer_summary', {
      searchQuery: searchQuery.toLowerCase().trim(),
      limit,
      dateRange: 'all_data', // Update cache key for all data
      analysisType
    })

    // Try Redis cache first
    const cacheStartTime = Date.now()
    let cachedData: QuickSummaryResponse | null = null
    
    if (redisHealth) {
      cachedData = await getCachedData<QuickSummaryResponse>(cacheKey)
      // Cache timing tracked for performance metrics
      
      if (cachedData) {
        performanceMetrics.cacheHits++
        performanceMetrics.totalQueries++
        const totalTime = Date.now() - startTime
        
        // Add performance metrics to response
        cachedData.performance = {
          queryTime: totalTime,
          cacheHit: true,
          recordCount: 0, // Not available from cache
          redisHealth,
          dbHealth: dbHealth.isHealthy
        }
        
        if (queryId) {
          try {
            QueryMonitor.endQuery(queryId, totalTime)
          } catch (monitorError) {
            console.error('❌ Failed to end query monitor:', monitorError)
          }
        }
        return NextResponse.json(cachedData)
      }
    }

    // If no search query, return empty result
    if (!searchQuery || searchQuery.trim() === '') {
      // Debug: Check database content
      const totalRecords = await prisma.exp_india.count()
      const sampleRecords = await prisma.exp_india.findMany({
        take: 3,
        select: {
          supplier_name: true,
          buyer_name: true,
          product_description: true,
          total_value_usd: true,
          shipping_bill_date: true
        }
      })
      
      console.log(`🔍 DEBUG: Database has ${totalRecords} total records`)
      console.log(`🔍 DEBUG: Sample records:`, sampleRecords)
      
      const emptyResponse: QuickSummaryResponse = {
        type: 'supplier-customer',
        dateRange: 'All available data', // Update date range text
        topSuppliers: [],
        summary: {
          totalValue: 0,
          totalShipments: 0,
          averageValue: 0,
          supplierCount: 0
        },
        performance: {
          queryTime: Date.now() - startTime,
          cacheHit: false,
          recordCount: 0,
          redisHealth,
          dbHealth: dbHealth.isHealthy
        }
      }
      return NextResponse.json(emptyResponse)
    }

    // Use optimized database query with aggregation pipeline
    const dbQueryStartTime = Date.now()
    
    console.log('🚀 Using optimized aggregation pipeline...')
    let records: Record<string, unknown>[] = []
    
    try {
      records = await getTradeDataOptimized({
        searchQuery,
        dateRange: 'all_data',
        limit: 100000, // Process up to 100k records
        analysisType
      })
    } catch (dbError) {
      console.error('❌ Database query failed:', dbError)
      console.error('Query parameters:', { searchQuery, dateRange: 'all_data', limit: 100000, analysisType })
      
      // Try to provide a more user-friendly error message
      if (dbError instanceof Error) {
        if (dbError.message.includes('timeout')) {
          throw new Error('Database query timed out. Please try a more specific search term.')
        } else if (dbError.message.includes('connection')) {
          throw new Error('Database connection failed. Please try again in a moment.')
        }
      }
      throw dbError
    }
    
    // Database query timing tracked for performance metrics
    
    // Debug logging to see actual data
    console.log(`🔍 DEBUG: Found ${records.length} records for query "${searchQuery}"`)
    console.log(`🔍 DEBUG: Date range: ${'all_data'}`)
    if (records.length > 0) {
      console.log(`🔍 DEBUG: Sample record:`, records[0])
      console.log(`🔍 DEBUG: Sample supplier: ${records[0].supplier_name}`)
      console.log(`🔍 DEBUG: Sample buyer: ${records[0].buyer_name}`)
      console.log(`🔍 DEBUG: Sample value: ${records[0].total_value_usd}`)
    }

    // Process data based on analysis type
    let response: QuickSummaryResponse
    
    if (analysisType === 'geographic') {
      response = await processGeographicData(records, limit, 'all_data')
    } else {
      response = await processSupplierCustomerData(records, limit, 'all_data')
    }

    // Add performance metrics
    response.performance = {
      queryTime: Date.now() - startTime,
      cacheHit: false,
      recordCount: records.length,
      redisHealth,
      dbHealth: dbHealth.isHealthy
    }

    // Cache the result in Redis
    if (redisHealth) {
      await setCachedData(cacheKey, response, 600) // 10 minutes TTL
    }

    performanceMetrics.cacheMisses++
    performanceMetrics.totalQueries++
    const totalTime = Date.now() - startTime

    if (queryId) {
      try {
        QueryMonitor.endQuery(queryId, totalTime)
      } catch (monitorError) {
        console.error('❌ Failed to end query monitor:', monitorError)
      }
    }
    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`❌ Error in optimized API after ${totalTime}ms:`, error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    if (queryId) {
      try {
        QueryMonitor.endQuery(queryId, totalTime)
      } catch (monitorError) {
        console.error('❌ Failed to end query monitor:', monitorError)
      }
    }
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorDetails = {
      message: errorMessage,
      type: error?.constructor?.name || 'UnknownError',
      searchQuery: request.nextUrl.searchParams.get('q') || '',
      analysisType: request.nextUrl.searchParams.get('type') || 'supplier-customer'
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch supplier-customer summary',
        details: errorDetails,
        performance: {
          queryTime: totalTime,
          cacheHit: false,
          recordCount: 0,
          redisHealth: false,
          dbHealth: false
        }
      },
      { status: 500 }
    )
  }
}

// Helper function to get readable date range
function getReadableDateRange(dateRange: string): string {
  // Handle the case where we're showing all available data
  if (dateRange === 'all_data') {
    return 'All available data'
  }
  
  const [startDateParam, endDateParam] = dateRange.split(':')
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const startYear = startDateParam.split('-')[0]
  const endYear = endDateParam.split('-')[0]
  const startMonth = parseInt(startDateParam.split('-')[1] || '1')
  const endMonth = parseInt(endDateParam.split('-')[1] || '12')
  const startMonthName = monthNames[startMonth - 1]
  const endMonthName = monthNames[endMonth - 1]
  
  return startYear === endYear 
    ? `${startMonthName} to ${endMonthName} ${startYear}`
    : `${startMonthName} ${startYear} to ${endMonthName} ${endYear}`
}

// Helper function to generate dynamic "Others" labels
function generateDynamicOthersLabel(parentName: string, type: 'supplier' | 'country'): string {
  // Clean up the parent name for better readability
  let cleanName = parentName.trim()
  
  // Handle common company suffixes
  const suffixes = [' Ltd', ' Limited', ' Inc', ' Corporation', ' Corp', ' Company', ' Co', ' Pvt', ' Private']
  for (const suffix of suffixes) {
    if (cleanName.endsWith(suffix)) {
      cleanName = cleanName.slice(0, -suffix.length)
    }
  }
  
  // Handle country names
  if (type === 'country') {
    // Handle common country variations
    const countryMappings: { [key: string]: string } = {
      'United States': 'US',
      'United Kingdom': 'UK',
      'United Arab Emirates': 'UAE',
      'South Africa': 'SA',
      'New Zealand': 'NZ'
    }
    
    if (countryMappings[cleanName]) {
      cleanName = countryMappings[cleanName]
    }
    
    return `Rest of ${cleanName}'s importers`
  } else {
    // For suppliers, use possessive form
    if (cleanName.endsWith('s')) {
      return `Rest of ${cleanName}' customers`
    } else {
      return `Rest of ${cleanName}'s customers`
    }
  }
}

// Helper function to normalize country names
function normalizeCompanyName(companyName: string): string {
  if (!companyName || companyName.trim() === '') {
    return 'Unknown Company';
  }

  // Step 1: Remove extra spaces and trim
  let normalized = companyName.trim().replace(/\s+/g, ' ');
  
  // Step 2: Remove trailing punctuation (periods, commas, apostrophes)
  normalized = normalized.replace(/[.,'"]+$/, '');
  
  // Step 3: Standardize legal entity abbreviations
  const legalEntityMappings: { [key: string]: string } = {
    // Private Limited variations
    'PVT LTD': 'PRIVATE LIMITED',
    'PVT. LTD': 'PRIVATE LIMITED',
    'PVT. LTD.': 'PRIVATE LIMITED',
    'PRIVATE LTD': 'PRIVATE LIMITED',
    'PRIVATE LTD.': 'PRIVATE LIMITED',
    'PRIVATE LIMITED.': 'PRIVATE LIMITED',
    
    // Limited variations
    'LTD.': 'LTD',
    'LTD.,': 'LTD',
    'LIMITED.': 'LIMITED',
    'LIMITED.,': 'LIMITED',
    
    // Inc variations
    'INC.': 'INC',
    'INC.,': 'INC',
    'INCORPORATED': 'INC',
    'INCORPORATED.': 'INC',
    
    // Corp variations
    'CORP.': 'CORP',
    'CORP.,': 'CORP',
    'CORPORATION': 'CORP',
    'CORPORATION.': 'CORP',
    
    // LLC variations
    'LLC.': 'LLC',
    'LLC.,': 'LLC',
    'L.L.C.': 'LLC',
    'L.L.C': 'LLC',
    
    // Co variations
    'CO.': 'CO',
    'CO.,': 'CO',
    'COMPANY': 'CO',
    'COMPANY.': 'CO',
    
    // Pty variations
    'PTY LTD': 'PTY LIMITED',
    'PTY. LTD': 'PTY LIMITED',
    'PTY. LTD.': 'PTY LIMITED',
    'PTY LIMITED.': 'PTY LIMITED',
    
         // International variations
     'GMBH': 'GMBH',
     'GMBH.': 'GMBH',
     'AG': 'AG',
     'AG.': 'AG',
     'SA': 'SA',
     'SA.': 'SA',
     'SAS': 'SAS',
     'SAS.': 'SAS',
     'SPA': 'SPA',
     'SPA.': 'SPA',
     'SRL': 'SRL',
     'SRL.': 'SRL',
     'BV': 'BV',
     'BV.': 'BV',
     'NV': 'NV',
     'NV.': 'NV',
     'AB': 'AB',
     'AB.': 'AB',
     'OY': 'OY',
     'OY.': 'OY',
     'AS': 'AS',
     'AS.': 'AS',
     'KK': 'KK',
     'KK.': 'KK',
     'PT': 'PT',
     'PT.': 'PT',
     'TBK': 'TBK',
     'TBK.': 'TBK',
     'PJSC': 'PJSC',
     'PJSC.': 'PJSC',
     'JSC': 'JSC',
     'JSC.': 'JSC',
     'LLP': 'LLP',
     'LLP.': 'LLP',
     'PLC': 'PLC',
     'PLC.': 'PLC',
     'LP': 'LP',
     'LP.': 'LP',
     'GP': 'GP',
     'GP.': 'GP'
  };

  // Apply legal entity standardization
  Object.entries(legalEntityMappings).forEach(([oldKey, newValue]) => {
    const regex = new RegExp(`\\b${oldKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    normalized = normalized.replace(regex, newValue);
  });

  // Step 4: Convert to Title Case for consistency
  normalized = normalized.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  
  // Step 5: Handle special cases (acronyms, proper nouns)
  const acronyms = ['INC', 'CORP', 'LLC', 'LTD', 'CO', 'GMBH', 'AG', 'SA', 'SAS', 'SPA', 'SRL', 'BV', 'NV', 'AB', 'OY', 'AS', 'KK', 'PT', 'TBK', 'PJSC', 'JSC', 'LLP', 'PLC', 'LP', 'GP'];
  acronyms.forEach(acronym => {
    const regex = new RegExp(`\\b${acronym}\\b`, 'gi');
    normalized = normalized.replace(regex, acronym);
  });

  return normalized;
}

function normalizeCountryName(countryName: string): string {
  if (!countryName) return countryName;
  
  // Remove extra spaces and line breaks - more aggressive cleaning
  const normalized = countryName
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n/g, '') // Remove line breaks
    .trim(); // Trim again after replacements
  
  // Common country name mappings - comprehensive list to eliminate duplicates
  const countryMappings: { [key: string]: string } = {
    // United Kingdom variations
    'UNITED KINGDOM': 'UNITED KINGDOM',
    'UK': 'UNITED KINGDOM',
    'U.K.': 'UNITED KINGDOM',
    'U.K': 'UNITED KINGDOM',
    'United Kingdom': 'UNITED KINGDOM',
    'UNITED KINGDOM ': 'UNITED KINGDOM',
    ' UK': 'UNITED KINGDOM',
    ' UK ': 'UNITED KINGDOM',
    ' UNITED KINGDOM': 'UNITED KINGDOM',
    ' UNITED KINGDOM ': 'UNITED KINGDOM',
    
    // United States variations
    'UNITED STATES': 'UNITED STATES',
    'USA': 'UNITED STATES',
    'US': 'UNITED STATES',
    'U.S.': 'UNITED STATES',
    'U.S': 'UNITED STATES',
    'United States': 'UNITED STATES',
    'UNITED STATES ': 'UNITED STATES',
    ' USA': 'UNITED STATES',
    ' USA ': 'UNITED STATES',
    'U.S.A.': 'UNITED STATES',
    'U.S.A': 'UNITED STATES',
    ' UNITED STATES': 'UNITED STATES',
    ' UNITED STATES ': 'UNITED STATES',
    
    // Russia variations
    'RUSSIA': 'RUSSIA',
    'Russia': 'RUSSIA',
    'Russian Federation': 'RUSSIA',
    'RUSSIA ': 'RUSSIA',
    ' Russia': 'RUSSIA',
    ' RUSSIA': 'RUSSIA',
    ' RUSSIA ': 'RUSSIA',
    
    // Australia variations
    'AUSTRALIA': 'AUSTRALIA',
    'Australia': 'AUSTRALIA',
    'AUSTRALIA ': 'AUSTRALIA',
    ' Australia': 'AUSTRALIA',
    ' AUSTRALIA': 'AUSTRALIA',
    ' AUSTRALIA ': 'AUSTRALIA',
    
    // Mauritius variations
    'MAURITIUS': 'MAURITIUS',
    'Mauritius': 'MAURITIUS',
    'MAURITIUS ': 'MAURITIUS',
    ' Mauritius': 'MAURITIUS',
    ' MAURITIUS': 'MAURITIUS',
    ' MAURITIUS ': 'MAURITIUS',
    
    // Austria variations
    'AUSTRIA': 'AUSTRIA',
    'Austria': 'AUSTRIA',
    'AUSTRIA ': 'AUSTRIA',
    ' Austria': 'AUSTRIA',
    ' AUSTRIA': 'AUSTRIA',
    ' AUSTRIA ': 'AUSTRIA',
    
    // Cyprus variations
    'CYPRUS': 'CYPRUS',
    'Cyprus': 'CYPRUS',
    'CYPRUS ': 'CYPRUS',
    ' Cyprus': 'CYPRUS',
    ' CYPRUS': 'CYPRUS',
    ' CYPRUS ': 'CYPRUS',
    
    // Belarus variations
    'BELARUS': 'BELARUS',
    'Belarus': 'BELARUS',
    'BELARUS ': 'BELARUS',
    ' Belarus': 'BELARUS',
    ' BELARUS': 'BELARUS',
    ' BELARUS ': 'BELARUS',
    
    // South Korea variations
    'SOUTH KOREA': 'KOREA',
    'KOREA': 'KOREA',
    'KOREA, REPUBLIC OF': 'KOREA',
    'KOREA,REPUBLIC OF': 'KOREA',
    'REPUBLIC OF KOREA': 'KOREA',
    'KOREA REPUBLIC OF': 'KOREA',
    'KOREA, REPUBLIC OF ': 'KOREA',
    'KOREA ': 'KOREA',
    ' KOREA': 'KOREA',
    ' KOREA ': 'KOREA',
    
    // United Arab Emirates variations
    'UNITED ARAB EMIRATES': 'UNITED ARAB EMIRATES',
    'UAE': 'UNITED ARAB EMIRATES',
    'U.A.E.': 'UNITED ARAB EMIRATES',
    'U.A.E': 'UNITED ARAB EMIRATES',
    'UNITED ARAB EMIRATES ': 'UNITED ARAB EMIRATES',
    ' UAE': 'UNITED ARAB EMIRATES',
    ' UAE ': 'UNITED ARAB EMIRATES',
    ' UNITED ARAB EMIRATES': 'UNITED ARAB EMIRATES',
    ' UNITED ARAB EMIRATES ': 'UNITED ARAB EMIRATES',
    
    // Eswatini variations
    'SWAZILAND': 'ESWATINI',
    'ESWATINI': 'ESWATINI',
    'ESWATINI ': 'ESWATINI',
    ' ESWATINI': 'ESWATINI',
    ' ESWATINI ': 'ESWATINI',
    
    // Hong Kong variations
    'HONG KONG': 'HONG KONG',
    'Hong Kong': 'HONG KONG',
    'HONG KONG ': 'HONG KONG',
    ' Hong Kong': 'HONG KONG',
    ' HONG KONG': 'HONG KONG',
    ' HONG KONG ': 'HONG KONG',
    
    // Netherlands Antilles variations
    'NETHERLANDS ANTILLES': 'NETHERLANDS ANTILLES',
    'NETHERLANDS ANTILLES ': 'NETHERLANDS ANTILLES',
    ' Netherlands Antilles': 'NETHERLANDS ANTILLES',
    ' NETHERLANDS ANTILLES': 'NETHERLANDS ANTILLES',
    ' NETHERLANDS ANTILLES ': 'NETHERLANDS ANTILLES',
    
    // Turks & Caicos variations
    'TURKS & CAICOS ISLANDS': 'TURKS & CAICOS ISLANDS',
    'TURKS AND CAICOS ISLANDS': 'TURKS & CAICOS ISLANDS',
    'TURKS & CAICOS': 'TURKS & CAICOS ISLANDS',
    'TURKS AND CAICOS': 'TURKS & CAICOS ISLANDS',
    'TURKS & CAICOS ISLANDS ': 'TURKS & CAICOS ISLANDS',
    ' TURKS & CAICOS ISLANDS': 'TURKS & CAICOS ISLANDS',
    ' TURKS & CAICOS ISLANDS ': 'TURKS & CAICOS ISLANDS',
    
    // Nepal variations (from logs)
    'NEPAL': 'NEPAL',
    'NEPAL ': 'NEPAL',
    ' Nepal': 'NEPAL',
    ' NEPAL': 'NEPAL',
    ' NEPAL ': 'NEPAL',
    
    // Lebanon variations (from logs)
    'LEBANON': 'LEBANON',
    'Lebanon': 'LEBANON',
    'LEBANON ': 'LEBANON',
    ' Lebanon': 'LEBANON',
    ' LEBANON': 'LEBANON',
    ' LEBANON ': 'LEBANON',
    
    // Mali variations (from logs)
    'MALI': 'MALI',
    'Mali': 'MALI',
    'MALI ': 'MALI',
    ' Mali': 'MALI',
    ' MALI': 'MALI',
    ' MALI ': 'MALI',
    
    // Germany variations
    'GERMANY': 'GERMANY',
    'Germany': 'GERMANY',
    'DEUTSCHLAND': 'GERMANY',
    'GERMANY ': 'GERMANY',
    ' Germany': 'GERMANY',
    ' GERMANY': 'GERMANY',
    ' GERMANY ': 'GERMANY',
    
    // France variations
    'FRANCE': 'FRANCE',
    'France': 'FRANCE',
    'FRANCE ': 'FRANCE',
    ' France': 'FRANCE',
    ' FRANCE': 'FRANCE',
    ' FRANCE ': 'FRANCE',
    
    // Italy variations
    'ITALY': 'ITALY',
    'Italy': 'ITALY',
    'ITALY ': 'ITALY',
    ' Italy': 'ITALY',
    ' ITALY': 'ITALY',
    ' ITALY ': 'ITALY',
    
    // Spain variations
    'SPAIN': 'SPAIN',
    'Spain': 'SPAIN',
    'SPAIN ': 'SPAIN',
    ' Spain': 'SPAIN',
    ' SPAIN': 'SPAIN',
    ' SPAIN ': 'SPAIN',
    
    // Netherlands variations
    'NETHERLANDS': 'NETHERLANDS',
    'Netherlands': 'NETHERLANDS',
    'HOLLAND': 'NETHERLANDS',
    'NETHERLANDS ': 'NETHERLANDS',
    ' Netherlands': 'NETHERLANDS',
    ' NETHERLANDS': 'NETHERLANDS',
    ' NETHERLANDS ': 'NETHERLANDS',
    
    // Belgium variations
    'BELGIUM': 'BELGIUM',
    'Belgium': 'BELGIUM',
    'BELGIUM ': 'BELGIUM',
    ' Belgium': 'BELGIUM',
    ' BELGIUM': 'BELGIUM',
    ' BELGIUM ': 'BELGIUM',
    
    // Switzerland variations
    'SWITZERLAND': 'SWITZERLAND',
    'Switzerland': 'SWITZERLAND',
    'SWITZERLAND ': 'SWITZERLAND',
    ' Switzerland': 'SWITZERLAND',
    ' SWITZERLAND': 'SWITZERLAND',
    ' SWITZERLAND ': 'SWITZERLAND',
    
    // Sweden variations
    'SWEDEN': 'SWEDEN',
    'Sweden': 'SWEDEN',
    'SWEDEN ': 'SWEDEN',
    ' Sweden': 'SWEDEN',
    ' SWEDEN': 'SWEDEN',
    ' SWEDEN ': 'SWEDEN',
    
    // Norway variations
    'NORWAY': 'NORWAY',
    'Norway': 'NORWAY',
    'NORWAY ': 'NORWAY',
    ' Norway': 'NORWAY',
    ' NORWAY': 'NORWAY',
    ' NORWAY ': 'NORWAY',
    
    // Denmark variations
    'DENMARK': 'DENMARK',
    'Denmark': 'DENMARK',
    'DENMARK ': 'DENMARK',
    ' Denmark': 'DENMARK',
    ' DENMARK': 'DENMARK',
    ' DENMARK ': 'DENMARK',
    
    // Finland variations
    'FINLAND': 'FINLAND',
    'Finland': 'FINLAND',
    'FINLAND ': 'FINLAND',
    ' Finland': 'FINLAND',
    ' FINLAND': 'FINLAND',
    ' FINLAND ': 'FINLAND',
    
    // Poland variations
    'POLAND': 'POLAND',
    'Poland': 'POLAND',
    'POLAND ': 'POLAND',
    ' Poland': 'POLAND',
    ' POLAND': 'POLAND',
    ' POLAND ': 'POLAND',
    
    // Czech Republic variations
    'CZECH REPUBLIC': 'CZECH REPUBLIC',
    'Czech Republic': 'CZECH REPUBLIC',
    'CZECHIA': 'CZECH REPUBLIC',
    'CZECH REPUBLIC ': 'CZECH REPUBLIC',
    ' Czech Republic': 'CZECH REPUBLIC',
    ' CZECH REPUBLIC': 'CZECH REPUBLIC',
    ' CZECH REPUBLIC ': 'CZECH REPUBLIC',
    
    // Hungary variations
    'HUNGARY': 'HUNGARY',
    'Hungary': 'HUNGARY',
    'HUNGARY ': 'HUNGARY',
    ' Hungary': 'HUNGARY',
    ' HUNGARY': 'HUNGARY',
    ' HUNGARY ': 'HUNGARY',
    
    // Romania variations
    'ROMANIA': 'ROMANIA',
    'Romania': 'ROMANIA',
    'ROMANIA ': 'ROMANIA',
    ' Romania': 'ROMANIA',
    ' ROMANIA': 'ROMANIA',
    ' ROMANIA ': 'ROMANIA',
    
    // Bulgaria variations
    'BULGARIA': 'BULGARIA',
    'Bulgaria': 'BULGARIA',
    'BULGARIA ': 'BULGARIA',
    ' Bulgaria': 'BULGARIA',
    ' BULGARIA': 'BULGARIA',
    ' BULGARIA ': 'BULGARIA',
    
    // Greece variations
    'GREECE': 'GREECE',
    'Greece': 'GREECE',
    'GREECE ': 'GREECE',
    ' Greece': 'GREECE',
    ' GREECE': 'GREECE',
    ' GREECE ': 'GREECE',
    
    // Portugal variations
    'PORTUGAL': 'PORTUGAL',
    'Portugal': 'PORTUGAL',
    'PORTUGAL ': 'PORTUGAL',
    ' Portugal': 'PORTUGAL',
    ' PORTUGAL': 'PORTUGAL',
    ' PORTUGAL ': 'PORTUGAL',
    
    // Ireland variations
    'IRELAND': 'IRELAND',
    'Ireland': 'IRELAND',
    'IRELAND ': 'IRELAND',
    ' Ireland': 'IRELAND',
    ' IRELAND': 'IRELAND',
    ' IRELAND ': 'IRELAND',
    
    // Canada variations
    'CANADA': 'CANADA',
    'Canada': 'CANADA',
    'CANADA ': 'CANADA',
    ' Canada': 'CANADA',
    ' CANADA': 'CANADA',
    ' CANADA ': 'CANADA',
    
    // Mexico variations
    'MEXICO': 'MEXICO',
    'Mexico': 'MEXICO',
    'MEXICO ': 'MEXICO',
    ' Mexico': 'MEXICO',
    ' MEXICO': 'MEXICO',
    ' MEXICO ': 'MEXICO',
    
    // Brazil variations
    'BRAZIL': 'BRAZIL',
    'Brazil': 'BRAZIL',
    'BRAZIL ': 'BRAZIL',
    ' Brazil': 'BRAZIL',
    ' BRAZIL': 'BRAZIL',
    ' BRAZIL ': 'BRAZIL',
    
    // Argentina variations
    'ARGENTINA': 'ARGENTINA',
    'Argentina': 'ARGENTINA',
    'ARGENTINA ': 'ARGENTINA',
    ' Argentina': 'ARGENTINA',
    ' ARGENTINA': 'ARGENTINA',
    ' ARGENTINA ': 'ARGENTINA',
    
    // Chile variations
    'CHILE': 'CHILE',
    'Chile': 'CHILE',
    'CHILE ': 'CHILE',
    ' Chile': 'CHILE',
    ' CHILE': 'CHILE',
    ' CHILE ': 'CHILE',
    
    // Colombia variations
    'COLOMBIA': 'COLOMBIA',
    'Colombia': 'COLOMBIA',
    'COLOMBIA ': 'COLOMBIA',
    ' Colombia': 'COLOMBIA',
    ' COLOMBIA': 'COLOMBIA',
    ' COLOMBIA ': 'COLOMBIA',
    
    // Peru variations
    'PERU': 'PERU',
    'Peru': 'PERU',
    'PERU ': 'PERU',
    ' Peru': 'PERU',
    ' PERU': 'PERU',
    ' PERU ': 'PERU',
    
    // Venezuela variations
    'VENEZUELA': 'VENEZUELA',
    'Venezuela': 'VENEZUELA',
    'VENEZUELA ': 'VENEZUELA',
    ' Venezuela': 'VENEZUELA',
    ' VENEZUELA': 'VENEZUELA',
    ' VENEZUELA ': 'VENEZUELA',
    
    // Ecuador variations
    'ECUADOR': 'ECUADOR',
    'Ecuador': 'ECUADOR',
    'ECUADOR ': 'ECUADOR',
    ' Ecuador': 'ECUADOR',
    ' ECUADOR': 'ECUADOR',
    ' ECUADOR ': 'ECUADOR',
    
    // Uruguay variations
    'URUGUAY': 'URUGUAY',
    'Uruguay': 'URUGUAY',
    'URUGUAY ': 'URUGUAY',
    ' Uruguay': 'URUGUAY',
    ' URUGUAY': 'URUGUAY',
    ' URUGUAY ': 'URUGUAY',
    
    // Paraguay variations
    'PARAGUAY': 'PARAGUAY',
    'Paraguay': 'PARAGUAY',
    'PARAGUAY ': 'PARAGUAY',
    ' Paraguay': 'PARAGUAY',
    ' PARAGUAY': 'PARAGUAY',
    ' PARAGUAY ': 'PARAGUAY',
    
    // Bolivia variations
    'BOLIVIA': 'BOLIVIA',
    'Bolivia': 'BOLIVIA',
    'BOLIVIA ': 'BOLIVIA',
    ' Bolivia': 'BOLIVIA',
    ' BOLIVIA': 'BOLIVIA',
    ' BOLIVIA ': 'BOLIVIA',
    
    // China variations
    'CHINA': 'CHINA',
    'China': 'CHINA',
    'PEOPLE\'S REPUBLIC OF CHINA': 'CHINA',
    'CHINA ': 'CHINA',
    ' China': 'CHINA',
    ' CHINA': 'CHINA',
    ' CHINA ': 'CHINA',
    
    // Japan variations
    'JAPAN': 'JAPAN',
    'Japan': 'JAPAN',
    'JAPAN ': 'JAPAN',
    ' Japan': 'JAPAN',
    ' JAPAN': 'JAPAN',
    ' JAPAN ': 'JAPAN',
    
    // India variations
    'INDIA': 'INDIA',
    'India': 'INDIA',
    'INDIA ': 'INDIA',
    ' India': 'INDIA',
    ' INDIA': 'INDIA',
    ' INDIA ': 'INDIA',
    
    // Indonesia variations
    'INDONESIA': 'INDONESIA',
    'Indonesia': 'INDONESIA',
    'INDONESIA ': 'INDONESIA',
    ' Indonesia': 'INDONESIA',
    ' INDONESIA': 'INDONESIA',
    ' INDONESIA ': 'INDONESIA',
    
    // Malaysia variations
    'MALAYSIA': 'MALAYSIA',
    'Malaysia': 'MALAYSIA',
    'MALAYSIA ': 'MALAYSIA',
    ' Malaysia': 'MALAYSIA',
    ' MALAYSIA': 'MALAYSIA',
    ' MALAYSIA ': 'MALAYSIA',
    
    // Singapore variations
    'SINGAPORE': 'SINGAPORE',
    'Singapore': 'SINGAPORE',
    'SINGAPORE ': 'SINGAPORE',
    ' Singapore': 'SINGAPORE',
    ' SINGAPORE': 'SINGAPORE',
    ' SINGAPORE ': 'SINGAPORE',
    
    // Thailand variations
    'THAILAND': 'THAILAND',
    'Thailand': 'THAILAND',
    'THAILAND ': 'THAILAND',
    ' Thailand': 'THAILAND',
    ' THAILAND': 'THAILAND',
    ' THAILAND ': 'THAILAND',
    
    // Vietnam variations
    'VIETNAM': 'VIETNAM',
    'Vietnam': 'VIETNAM',
    'VIETNAM ': 'VIETNAM',
    ' Vietnam': 'VIETNAM',
    ' VIETNAM': 'VIETNAM',
    ' VIETNAM ': 'VIETNAM',
    
    // Philippines variations
    'PHILIPPINES': 'PHILIPPINES',
    'Philippines': 'PHILIPPINES',
    'PHILIPPINES ': 'PHILIPPINES',
    ' Philippines': 'PHILIPPINES',
    ' PHILIPPINES': 'PHILIPPINES',
    ' PHILIPPINES ': 'PHILIPPINES',
    
    // Pakistan variations
    'PAKISTAN': 'PAKISTAN',
    'Pakistan': 'PAKISTAN',
    'PAKISTAN ': 'PAKISTAN',
    ' Pakistan': 'PAKISTAN',
    ' PAKISTAN': 'PAKISTAN',
    ' PAKISTAN ': 'PAKISTAN',
    
    // Bangladesh variations
    'BANGLADESH': 'BANGLADESH',
    'Bangladesh': 'BANGLADESH',
    'BANGLADESH ': 'BANGLADESH',
    ' Bangladesh': 'BANGLADESH',
    ' BANGLADESH': 'BANGLADESH',
    ' BANGLADESH ': 'BANGLADESH',
    
    // Sri Lanka variations
    'SRI LANKA': 'SRI LANKA',
    'Sri Lanka': 'SRI LANKA',
    'SRI LANKA ': 'SRI LANKA',
    ' Sri Lanka': 'SRI LANKA',
    ' SRI LANKA': 'SRI LANKA',
    ' SRI LANKA ': 'SRI LANKA',
    
    // Iran variations
    'IRAN': 'IRAN',
    'Iran': 'IRAN',
    'IRAN ': 'IRAN',
    ' Iran': 'IRAN',
    ' IRAN': 'IRAN',
    ' IRAN ': 'IRAN',
    
    // Iraq variations
    'IRAQ': 'IRAQ',
    'Iraq': 'IRAQ',
    'IRAQ ': 'IRAQ',
    ' Iraq': 'IRAQ',
    ' IRAQ': 'IRAQ',
    ' IRAQ ': 'IRAQ',
    
    // Saudi Arabia variations
    'SAUDI ARABIA': 'SAUDI ARABIA',
    'Saudi Arabia': 'SAUDI ARABIA',
    'SAUDI ARABIA ': 'SAUDI ARABIA',
    ' Saudi Arabia': 'SAUDI ARABIA',
    ' SAUDI ARABIA': 'SAUDI ARABIA',
    ' SAUDI ARABIA ': 'SAUDI ARABIA',
    
    // Egypt variations
    'EGYPT': 'EGYPT',
    'Egypt': 'EGYPT',
    'EGYPT ': 'EGYPT',
    ' Egypt': 'EGYPT',
    ' EGYPT': 'EGYPT',
    ' EGYPT ': 'EGYPT',
    
    // South Africa variations
    'SOUTH AFRICA': 'SOUTH AFRICA',
    'South Africa': 'SOUTH AFRICA',
    'SOUTH AFRICA ': 'SOUTH AFRICA',
    ' South Africa': 'SOUTH AFRICA',
    ' SOUTH AFRICA': 'SOUTH AFRICA',
    ' SOUTH AFRICA ': 'SOUTH AFRICA',
    
    // Nigeria variations
    'NIGERIA': 'NIGERIA',
    'Nigeria': 'NIGERIA',
    'NIGERIA ': 'NIGERIA',
    ' Nigeria': 'NIGERIA',
    ' NIGERIA': 'NIGERIA',
    ' NIGERIA ': 'NIGERIA',
    
    // Kenya variations
    'KENYA': 'KENYA',
    'Kenya': 'KENYA',
    'KENYA ': 'KENYA',
    ' Kenya': 'KENYA',
    ' KENYA': 'KENYA',
    ' KENYA ': 'KENYA',
    
    // Ghana variations
    'GHANA': 'GHANA',
    'Ghana': 'GHANA',
    'GHANA ': 'GHANA',
    ' Ghana': 'GHANA',
    ' GHANA': 'GHANA',
    ' GHANA ': 'GHANA',
    
    // Morocco variations
    'MOROCCO': 'MOROCCO',
    'Morocco': 'MOROCCO',
    'MOROCCO ': 'MOROCCO',
    ' Morocco': 'MOROCCO',
    ' MOROCCO': 'MOROCCO',
    ' MOROCCO ': 'MOROCCO',
    
    // Algeria variations
    'ALGERIA': 'ALGERIA',
    'Algeria': 'ALGERIA',
    'ALGERIA ': 'ALGERIA',
    ' Algeria': 'ALGERIA',
    ' ALGERIA': 'ALGERIA',
    ' ALGERIA ': 'ALGERIA',
    
    // Tunisia variations
    'TUNISIA': 'TUNISIA',
    'Tunisia': 'TUNISIA',
    'TUNISIA ': 'TUNISIA',
    ' Tunisia': 'TUNISIA',
    ' TUNISIA': 'TUNISIA',
    ' TUNISIA ': 'TUNISIA',
    
    // Turkey variations
    'TURKEY': 'TURKEY',
    'Turkey': 'TURKEY',
    'TURKEY ': 'TURKEY',
    ' Turkey': 'TURKEY',
    ' TURKEY': 'TURKEY',
    ' TURKEY ': 'TURKEY',
    
    // Israel variations
    'ISRAEL': 'ISRAEL',
    'Israel': 'ISRAEL',
    'ISRAEL ': 'ISRAEL',
    ' Israel': 'ISRAEL',
    ' ISRAEL': 'ISRAEL',
    ' ISRAEL ': 'ISRAEL',
    
    // Jordan variations
    'JORDAN': 'JORDAN',
    'Jordan': 'JORDAN',
    'JORDAN ': 'JORDAN',
    ' Jordan': 'JORDAN',
    ' JORDAN': 'JORDAN',
    ' JORDAN ': 'JORDAN',
    
    // Kuwait variations
    'KUWAIT': 'KUWAIT',
    'Kuwait': 'KUWAIT',
    'KUWAIT ': 'KUWAIT',
    ' Kuwait': 'KUWAIT',
    ' KUWAIT': 'KUWAIT',
    ' KUWAIT ': 'KUWAIT',
    
    // Qatar variations
    'QATAR': 'QATAR',
    'Qatar': 'QATAR',
    'QATAR ': 'QATAR',
    ' Qatar': 'QATAR',
    ' QATAR': 'QATAR',
    ' QATAR ': 'QATAR',
    
    // Oman variations
    'OMAN': 'OMAN',
    'Oman': 'OMAN',
    'OMAN ': 'OMAN',
    ' Oman': 'OMAN',
    ' OMAN': 'OMAN',
    ' OMAN ': 'OMAN',
    
    // Bahrain variations
    'BAHRAIN': 'BAHRAIN',
    'Bahrain': 'BAHRAIN',
    'BAHRAIN ': 'BAHRAIN',
    ' Bahrain': 'BAHRAIN',
    ' BAHRAIN': 'BAHRAIN',
    ' BAHRAIN ': 'BAHRAIN',
    
    // Yemen variations
    'YEMEN': 'YEMEN',
    'Yemen': 'YEMEN',
    'YEMEN ': 'YEMEN',
    ' Yemen': 'YEMEN',
    ' YEMEN': 'YEMEN',
    ' YEMEN ': 'YEMEN',
    
    // Syria variations
    'SYRIA': 'SYRIA',
    'Syria': 'SYRIA',
    'SYRIA ': 'SYRIA',
    ' Syria': 'SYRIA',
    ' SYRIA': 'SYRIA',
    ' SYRIA ': 'SYRIA',
    
    // Libya variations
    'LIBYA': 'LIBYA',
    'Libya': 'LIBYA',
    'LIBYA ': 'LIBYA',
    ' Libya': 'LIBYA',
    ' LIBYA': 'LIBYA',
    ' LIBYA ': 'LIBYA',
    
    // Sudan variations
    'SUDAN': 'SUDAN',
    'Sudan': 'SUDAN',
    'SUDAN ': 'SUDAN',
    ' Sudan': 'SUDAN',
    ' SUDAN': 'SUDAN',
    ' SUDAN ': 'SUDAN',
    
    // Ethiopia variations
    'ETHIOPIA': 'ETHIOPIA',
    'Ethiopia': 'ETHIOPIA',
    'ETHIOPIA ': 'ETHIOPIA',
    ' Ethiopia': 'ETHIOPIA',
    ' ETHIOPIA': 'ETHIOPIA',
    ' ETHIOPIA ': 'ETHIOPIA',
    
    // Tanzania variations
    'TANZANIA': 'TANZANIA',
    'Tanzania': 'TANZANIA',
    'TANZANIA ': 'TANZANIA',
    ' Tanzania': 'TANZANIA',
    ' TANZANIA': 'TANZANIA',
    ' TANZANIA ': 'TANZANIA',
    
    // Uganda variations
    'UGANDA': 'UGANDA',
    'Uganda': 'UGANDA',
    'UGANDA ': 'UGANDA',
    ' Uganda': 'UGANDA',
    ' UGANDA': 'UGANDA',
    ' UGANDA ': 'UGANDA',
    
    // Cameroon variations
    'CAMEROON': 'CAMEROON',
    'Cameroon': 'CAMEROON',
    'CAMEROON ': 'CAMEROON',
    ' Cameroon': 'CAMEROON',
    ' CAMEROON': 'CAMEROON',
    ' CAMEROON ': 'CAMEROON',
    
    // Ivory Coast variations
    'IVORY COAST': 'IVORY COAST',
    'Ivory Coast': 'IVORY COAST',
    'COTE D\'IVOIRE': 'IVORY COAST',
    'IVORY COAST ': 'IVORY COAST',
    ' Ivory Coast': 'IVORY COAST',
    ' IVORY COAST': 'IVORY COAST',
    ' IVORY COAST ': 'IVORY COAST',
    
    // Senegal variations
    'SENEGAL': 'SENEGAL',
    'Senegal': 'SENEGAL',
    'SENEGAL ': 'SENEGAL',
    ' Senegal': 'SENEGAL',
    ' SENEGAL': 'SENEGAL',
    ' SENEGAL ': 'SENEGAL',
    
    // Burkina Faso variations
    'BURKINA FASO': 'BURKINA FASO',
    'Burkina Faso': 'BURKINA FASO',
    'BURKINA FASO ': 'BURKINA FASO',
    ' Burkina Faso': 'BURKINA FASO',
    ' BURKINA FASO': 'BURKINA FASO',
    ' BURKINA FASO ': 'BURKINA FASO',
    
    // Niger variations
    'NIGER': 'NIGER',
    'Niger': 'NIGER',
    'NIGER ': 'NIGER',
    ' Niger': 'NIGER',
    ' NIGER': 'NIGER',
    ' NIGER ': 'NIGER',
    
    // Chad variations
    'CHAD': 'CHAD',
    'Chad': 'CHAD',
    'CHAD ': 'CHAD',
    ' Chad': 'CHAD',
    ' CHAD': 'CHAD',
    ' CHAD ': 'CHAD',
    
    // Central African Republic variations
    'CENTRAL AFRICAN REPUBLIC': 'CENTRAL AFRICAN REPUBLIC',
    'Central African Republic': 'CENTRAL AFRICAN REPUBLIC',
    'CENTRAL AFRICAN REPUBLIC ': 'CENTRAL AFRICAN REPUBLIC',
    ' Central African Republic': 'CENTRAL AFRICAN REPUBLIC',
    ' CENTRAL AFRICAN REPUBLIC': 'CENTRAL AFRICAN REPUBLIC',
    ' CENTRAL AFRICAN REPUBLIC ': 'CENTRAL AFRICAN REPUBLIC',
    
    // Democratic Republic of Congo variations
    'DEMOCRATIC REPUBLIC OF CONGO': 'DEMOCRATIC REPUBLIC OF CONGO',
    'Democratic Republic of Congo': 'DEMOCRATIC REPUBLIC OF CONGO',
    'DR CONGO': 'DEMOCRATIC REPUBLIC OF CONGO',
    'DEMOCRATIC REPUBLIC OF CONGO ': 'DEMOCRATIC REPUBLIC OF CONGO',
    ' Democratic Republic of Congo': 'DEMOCRATIC REPUBLIC OF CONGO',
    ' DEMOCRATIC REPUBLIC OF CONGO': 'DEMOCRATIC REPUBLIC OF CONGO',
    ' DEMOCRATIC REPUBLIC OF CONGO ': 'DEMOCRATIC REPUBLIC OF CONGO',
    
    // Republic of Congo variations
    'REPUBLIC OF CONGO': 'REPUBLIC OF CONGO',
    'Republic of Congo': 'REPUBLIC OF CONGO',
    'CONGO': 'REPUBLIC OF CONGO',
    'REPUBLIC OF CONGO ': 'REPUBLIC OF CONGO',
    ' Republic of Congo': 'REPUBLIC OF CONGO',
    ' REPUBLIC OF CONGO': 'REPUBLIC OF CONGO',
    ' REPUBLIC OF CONGO ': 'REPUBLIC OF CONGO',
    
    // Gabon variations
    'GABON': 'GABON',
    'Gabon': 'GABON',
    'GABON ': 'GABON',
    ' Gabon': 'GABON',
    ' GABON': 'GABON',
    ' GABON ': 'GABON',
    
    // Equatorial Guinea variations
    'EQUATORIAL GUINEA': 'EQUATORIAL GUINEA',
    'Equatorial Guinea': 'EQUATORIAL GUINEA',
    'EQUATORIAL GUINEA ': 'EQUATORIAL GUINEA',
    ' Equatorial Guinea': 'EQUATORIAL GUINEA',
    ' EQUATORIAL GUINEA': 'EQUATORIAL GUINEA',
    ' EQUATORIAL GUINEA ': 'EQUATORIAL GUINEA',
    
    // Sao Tome and Principe variations
    'SAO TOME AND PRINCIPE': 'SAO TOME AND PRINCIPE',
    'Sao Tome and Principe': 'SAO TOME AND PRINCIPE',
    'SAO TOME AND PRINCIPE ': 'SAO TOME AND PRINCIPE',
    ' Sao Tome and Principe': 'SAO TOME AND PRINCIPE',
    ' SAO TOME AND PRINCIPE': 'SAO TOME AND PRINCIPE',
    ' SAO TOME AND PRINCIPE ': 'SAO TOME AND PRINCIPE',
    
    // Angola variations
    'ANGOLA': 'ANGOLA',
    'Angola': 'ANGOLA',
    'ANGOLA ': 'ANGOLA',
    ' Angola': 'ANGOLA',
    ' ANGOLA': 'ANGOLA',
    ' ANGOLA ': 'ANGOLA',
    
    // Zambia variations
    'ZAMBIA': 'ZAMBIA',
    'Zambia': 'ZAMBIA',
    'ZAMBIA ': 'ZAMBIA',
    ' Zambia': 'ZAMBIA',
    ' ZAMBIA': 'ZAMBIA',
    ' ZAMBIA ': 'ZAMBIA',
    
    // Zimbabwe variations
    'ZIMBABWE': 'ZIMBABWE',
    'Zimbabwe': 'ZIMBABWE',
    'ZIMBABWE ': 'ZIMBABWE',
    ' Zimbabwe': 'ZIMBABWE',
    ' ZIMBABWE': 'ZIMBABWE',
    ' ZIMBABWE ': 'ZIMBABWE',
    
    // Botswana variations
    'BOTSWANA': 'BOTSWANA',
    'Botswana': 'BOTSWANA',
    'BOTSWANA ': 'BOTSWANA',
    ' Botswana': 'BOTSWANA',
    ' BOTSWANA': 'BOTSWANA',
    ' BOTSWANA ': 'BOTSWANA',
    
    // Namibia variations
    'NAMIBIA': 'NAMIBIA',
    'Namibia': 'NAMIBIA',
    'NAMIBIA ': 'NAMIBIA',
    ' Namibia': 'NAMIBIA',
    ' NAMIBIA': 'NAMIBIA',
    ' NAMIBIA ': 'NAMIBIA',
    
    // Lesotho variations
    'LESOTHO': 'LESOTHO',
    'Lesotho': 'LESOTHO',
    'LESOTHO ': 'LESOTHO',
    ' Lesotho': 'LESOTHO',
    ' LESOTHO': 'LESOTHO',
    ' LESOTHO ': 'LESOTHO',
    
    // Madagascar variations
    'MADAGASCAR': 'MADAGASCAR',
    'Madagascar': 'MADAGASCAR',
    'MADAGASCAR ': 'MADAGASCAR',
    ' Madagascar': 'MADAGASCAR',
    ' MADAGASCAR': 'MADAGASCAR',
    ' MADAGASCAR ': 'MADAGASCAR',
    

    
    // Seychelles variations
    'SEYCHELLES': 'SEYCHELLES',
    'Seychelles': 'SEYCHELLES',
    'SEYCHELLES ': 'SEYCHELLES',
    ' Seychelles': 'SEYCHELLES',
    ' SEYCHELLES': 'SEYCHELLES',
    ' SEYCHELLES ': 'SEYCHELLES',
    
    // Comoros variations
    'COMOROS': 'COMOROS',
    'Comoros': 'COMOROS',
    'COMOROS ': 'COMOROS',
    ' Comoros': 'COMOROS',
    ' COMOROS': 'COMOROS',
    ' COMOROS ': 'COMOROS',
    
    // Djibouti variations
    'DJIBOUTI': 'DJIBOUTI',
    'Djibouti': 'DJIBOUTI',
    'DJIBOUTI ': 'DJIBOUTI',
    ' Djibouti': 'DJIBOUTI',
    ' DJIBOUTI': 'DJIBOUTI',
    ' DJIBOUTI ': 'DJIBOUTI',
    
    // Somalia variations
    'SOMALIA': 'SOMALIA',
    'Somalia': 'SOMALIA',
    'SOMALIA ': 'SOMALIA',
    ' Somalia': 'SOMALIA',
    ' SOMALIA': 'SOMALIA',
    ' SOMALIA ': 'SOMALIA',
    
    // Eritrea variations
    'ERITREA': 'ERITREA',
    'Eritrea': 'ERITREA',
    'ERITREA ': 'ERITREA',
    ' Eritrea': 'ERITREA',
    ' ERITREA': 'ERITREA',
    ' ERITREA ': 'ERITREA',
    
    // South Sudan variations
    'SOUTH SUDAN': 'SOUTH SUDAN',
    'South Sudan': 'SOUTH SUDAN',
    'SOUTH SUDAN ': 'SOUTH SUDAN',
    ' South Sudan': 'SOUTH SUDAN',
    ' SOUTH SUDAN': 'SOUTH SUDAN',
    ' SOUTH SUDAN ': 'SOUTH SUDAN',
    
    // Burundi variations
    'BURUNDI': 'BURUNDI',
    'Burundi': 'BURUNDI',
    'BURUNDI ': 'BURUNDI',
    ' Burundi': 'BURUNDI',
    ' BURUNDI': 'BURUNDI',
    ' BURUNDI ': 'BURUNDI',
    
    // Rwanda variations
    'RWANDA': 'RWANDA',
    'Rwanda': 'RWANDA',
    'RWANDA ': 'RWANDA',
    ' Rwanda': 'RWANDA',
    ' RWANDA': 'RWANDA',
    ' RWANDA ': 'RWANDA',
    
    // Malawi variations
    'MALAWI': 'MALAWI',
    'Malawi': 'MALAWI',
    'MALAWI ': 'MALAWI',
    ' Malawi': 'MALAWI',
    ' MALAWI': 'MALAWI',
    ' MALAWI ': 'MALAWI',
    
    // Mozambique variations
    'MOZAMBIQUE': 'MOZAMBIQUE',
    'Mozambique': 'MOZAMBIQUE',
    'MOZAMBIQUE ': 'MOZAMBIQUE',
    ' Mozambique': 'MOZAMBIQUE',
    ' MOZAMBIQUE': 'MOZAMBIQUE',
    ' MOZAMBIQUE ': 'MOZAMBIQUE',
    
    // Guinea variations
    'GUINEA': 'GUINEA',
    'Guinea': 'GUINEA',
    'GUINEA ': 'GUINEA',
    ' Guinea': 'GUINEA',
    ' GUINEA': 'GUINEA',
    ' GUINEA ': 'GUINEA',
    
    // Guinea-Bissau variations
    'GUINEA-BISSAU': 'GUINEA-BISSAU',
    'Guinea-Bissau': 'GUINEA-BISSAU',
    'GUINEA-BISSAU ': 'GUINEA-BISSAU',
    ' Guinea-Bissau': 'GUINEA-BISSAU',
    ' GUINEA-BISSAU': 'GUINEA-BISSAU',
    ' GUINEA-BISSAU ': 'GUINEA-BISSAU',
    
    // Sierra Leone variations
    'SIERRA LEONE': 'SIERRA LEONE',
    'Sierra Leone': 'SIERRA LEONE',
    'SIERRA LEONE ': 'SIERRA LEONE',
    ' Sierra Leone': 'SIERRA LEONE',
    ' SIERRA LEONE': 'SIERRA LEONE',
    ' SIERRA LEONE ': 'SIERRA LEONE',
    
    // Liberia variations
    'LIBERIA': 'LIBERIA',
    'Liberia': 'LIBERIA',
    'LIBERIA ': 'LIBERIA',
    ' Liberia': 'LIBERIA',
    ' LIBERIA': 'LIBERIA',
    ' LIBERIA ': 'LIBERIA',
    
    // Togo variations
    'TOGO': 'TOGO',
    'Togo': 'TOGO',
    'TOGO ': 'TOGO',
    ' Togo': 'TOGO',
    ' TOGO': 'TOGO',
    ' TOGO ': 'TOGO',
    
    // Benin variations
    'BENIN': 'BENIN',
    'Benin': 'BENIN',
    'BENIN ': 'BENIN',
    ' Benin': 'BENIN',
    ' BENIN': 'BENIN',
    ' BENIN ': 'BENIN',
    
    // Gambia variations
    'GAMBIA': 'GAMBIA',
    'Gambia': 'GAMBIA',
    'GAMBIA ': 'GAMBIA',
    ' Gambia': 'GAMBIA',
    ' GAMBIA': 'GAMBIA',
    ' GAMBIA ': 'GAMBIA',
    
    // Cape Verde variations
    'CAPE VERDE': 'CAPE VERDE',
    'Cape Verde': 'CAPE VERDE',
    'CAPE VERDE ': 'CAPE VERDE',
    ' Cape Verde': 'CAPE VERDE',
    ' CAPE VERDE': 'CAPE VERDE',
    ' CAPE VERDE ': 'CAPE VERDE',
    
    // Croatia variations
    'CROATIA': 'CROATIA',
    'Croatia': 'CROATIA',
    'CROATIA ': 'CROATIA',
    ' Croatia': 'CROATIA',
    ' CROATIA': 'CROATIA',
    ' CROATIA ': 'CROATIA',
    
    // Slovenia variations
    'SLOVENIA': 'SLOVENIA',
    'Slovenia': 'SLOVENIA',
    'SLOVENIA ': 'SLOVENIA',
    ' Slovenia': 'SLOVENIA',
    ' SLOVENIA': 'SLOVENIA',
    ' SLOVENIA ': 'SLOVENIA',
    
    // Slovakia variations
    'SLOVAKIA': 'SLOVAKIA',
    'Slovakia': 'SLOVAKIA',
    'SLOVAKIA ': 'SLOVAKIA',
    ' Slovakia': 'SLOVAKIA',
    ' SLOVAKIA': 'SLOVAKIA',
    ' SLOVAKIA ': 'SLOVAKIA',
    
    // Estonia variations
    'ESTONIA': 'ESTONIA',
    'Estonia': 'ESTONIA',
    'ESTONIA ': 'ESTONIA',
    ' Estonia': 'ESTONIA',
    ' ESTONIA': 'ESTONIA',
    ' ESTONIA ': 'ESTONIA',
    
    // Latvia variations
    'LATVIA': 'LATVIA',
    'Latvia': 'LATVIA',
    'LATVIA ': 'LATVIA',
    ' Latvia': 'LATVIA',
    ' LATVIA': 'LATVIA',
    ' LATVIA ': 'LATVIA',
    
    // Lithuania variations
    'LITHUANIA': 'LITHUANIA',
    'Lithuania': 'LITHUANIA',
    'LITHUANIA ': 'LITHUANIA',
    ' Lithuania': 'LITHUANIA',
    ' LITHUANIA': 'LITHUANIA',
    ' LITHUANIA ': 'LITHUANIA',
    
    // Malta variations
    'MALTA': 'MALTA',
    'Malta': 'MALTA',
    'MALTA ': 'MALTA',
    ' Malta': 'MALTA',
    ' MALTA': 'MALTA',
    ' MALTA ': 'MALTA',
    
    // Luxembourg variations
    'LUXEMBOURG': 'LUXEMBOURG',
    'Luxembourg': 'LUXEMBOURG',
    'LUXEMBOURG ': 'LUXEMBOURG',
    ' Luxembourg': 'LUXEMBOURG',
    ' LUXEMBOURG': 'LUXEMBOURG',
    ' LUXEMBOURG ': 'LUXEMBOURG',
    
    // Iceland variations
    'ICELAND': 'ICELAND',
    'Iceland': 'ICELAND',
    'ICELAND ': 'ICELAND',
    ' Iceland': 'ICELAND',
    ' ICELAND': 'ICELAND',
    ' ICELAND ': 'ICELAND',
    
    // Ukraine variations
    'UKRAINE': 'UKRAINE',
    'Ukraine': 'UKRAINE',
    'UKRAINE ': 'UKRAINE',
    ' Ukraine': 'UKRAINE',
    ' UKRAINE': 'UKRAINE',
    ' UKRAINE ': 'UKRAINE',
    
    // Moldova variations
    'MOLDOVA': 'MOLDOVA',
    'Moldova': 'MOLDOVA',
    'MOLDOVA ': 'MOLDOVA',
    ' Moldova': 'MOLDOVA',
    ' MOLDOVA': 'MOLDOVA',
    ' MOLDOVA ': 'MOLDOVA',
    
    // Georgia variations
    'GEORGIA': 'GEORGIA',
    'Georgia': 'GEORGIA',
    'GEORGIA ': 'GEORGIA',
    ' Georgia': 'GEORGIA',
    ' GEORGIA': 'GEORGIA',
    ' GEORGIA ': 'GEORGIA',
    
    // Armenia variations
    'ARMENIA': 'ARMENIA',
    'Armenia': 'ARMENIA',
    'ARMENIA ': 'ARMENIA',
    ' Armenia': 'ARMENIA',
    ' ARMENIA': 'ARMENIA',
    ' ARMENIA ': 'ARMENIA',
    
    // Azerbaijan variations
    'AZERBAIJAN': 'AZERBAIJAN',
    'Azerbaijan': 'AZERBAIJAN',
    'AZERBAIJAN ': 'AZERBAIJAN',
    ' Azerbaijan': 'AZERBAIJAN',
    ' AZERBAIJAN': 'AZERBAIJAN',
    ' AZERBAIJAN ': 'AZERBAIJAN',
    
    // Kazakhstan variations
    'KAZAKHSTAN': 'KAZAKHSTAN',
    'Kazakhstan': 'KAZAKHSTAN',
    'KAZAKHSTAN ': 'KAZAKHSTAN',
    ' Kazakhstan': 'KAZAKHSTAN',
    ' KAZAKHSTAN': 'KAZAKHSTAN',
    ' KAZAKHSTAN ': 'KAZAKHSTAN',
    
    // Uzbekistan variations
    'UZBEKISTAN': 'UZBEKISTAN',
    'Uzbekistan': 'UZBEKISTAN',
    'UZBEKISTAN ': 'UZBEKISTAN',
    ' Uzbekistan': 'UZBEKISTAN',
    ' UZBEKISTAN': 'UZBEKISTAN',
    ' UZBEKISTAN ': 'UZBEKISTAN',
    
    // Kyrgyzstan variations
    'KYRGYZSTAN': 'KYRGYZSTAN',
    'Kyrgyzstan': 'KYRGYZSTAN',
    'KYRGYZSTAN ': 'KYRGYZSTAN',
    ' Kyrgyzstan': 'KYRGYZSTAN',
    ' KYRGYZSTAN': 'KYRGYZSTAN',
    ' KYRGYZSTAN ': 'KYRGYZSTAN',
    
    // Tajikistan variations
    'TAJIKISTAN': 'TAJIKISTAN',
    'Tajikistan': 'TAJIKISTAN',
    'TAJIKISTAN ': 'TAJIKISTAN',
    ' Tajikistan': 'TAJIKISTAN',
    ' TAJIKISTAN': 'TAJIKISTAN',
    ' TAJIKISTAN ': 'TAJIKISTAN',
    
    // Turkmenistan variations
    'TURKMENISTAN': 'TURKMENISTAN',
    'Turkmenistan': 'TURKMENISTAN',
    'TURKMENISTAN ': 'TURKMENISTAN',
    ' Turkmenistan': 'TURKMENISTAN',
    ' TURKMENISTAN': 'TURKMENISTAN',
    ' TURKMENISTAN ': 'TURKMENISTAN',
    
    // Mongolia variations
    'MONGOLIA': 'MONGOLIA',
    'Mongolia': 'MONGOLIA',
    'MONGOLIA ': 'MONGOLIA',
    ' Mongolia': 'MONGOLIA',
    ' MONGOLIA': 'MONGOLIA',
    ' MONGOLIA ': 'MONGOLIA',
    
    // Bhutan variations
    'BHUTAN': 'BHUTAN',
    'Bhutan': 'BHUTAN',
    'BHUTAN ': 'BHUTAN',
    ' Bhutan': 'BHUTAN',
    ' BHUTAN': 'BHUTAN',
    ' BHUTAN ': 'BHUTAN',
    
    // Myanmar variations
    'MYANMAR': 'MYANMAR',
    'Myanmar': 'MYANMAR',
    'BURMA': 'MYANMAR',
    'MYANMAR ': 'MYANMAR',
    ' Myanmar': 'MYANMAR',
    ' MYANMAR': 'MYANMAR',
    ' MYANMAR ': 'MYANMAR',
    
    // Cambodia variations
    'CAMBODIA': 'CAMBODIA',
    'Cambodia': 'CAMBODIA',
    'CAMBODIA ': 'CAMBODIA',
    ' Cambodia': 'CAMBODIA',
    ' CAMBODIA': 'CAMBODIA',
    ' CAMBODIA ': 'CAMBODIA',
    
    // Laos variations
    'LAOS': 'LAOS',
    'Laos': 'LAOS',
    'LAOS ': 'LAOS',
    ' Laos': 'LAOS',
    ' LAOS': 'LAOS',
    ' LAOS ': 'LAOS',
    
    // Brunei variations
    'BRUNEI': 'BRUNEI',
    'Brunei': 'BRUNEI',
    'BRUNEI ': 'BRUNEI',
    ' Brunei': 'BRUNEI',
    ' BRUNEI': 'BRUNEI',
    ' BRUNEI ': 'BRUNEI',
    
    // East Timor variations
    'EAST TIMOR': 'EAST TIMOR',
    'East Timor': 'EAST TIMOR',
    'TIMOR-LESTE': 'EAST TIMOR',
    'EAST TIMOR ': 'EAST TIMOR',
    ' East Timor': 'EAST TIMOR',
    ' EAST TIMOR': 'EAST TIMOR',
    ' EAST TIMOR ': 'EAST TIMOR',
    
    // Papua New Guinea variations
    'PAPUA NEW GUINEA': 'PAPUA NEW GUINEA',
    'Papua New Guinea': 'PAPUA NEW GUINEA',
    'PAPUA NEW GUINEA ': 'PAPUA NEW GUINEA',
    ' Papua New Guinea': 'PAPUA NEW GUINEA',
    ' PAPUA NEW GUINEA': 'PAPUA NEW GUINEA',
    ' PAPUA NEW GUINEA ': 'PAPUA NEW GUINEA',
    
    // Fiji variations
    'FIJI': 'FIJI',
    'Fiji': 'FIJI',
    'FIJI ': 'FIJI',
    ' Fiji': 'FIJI',
    ' FIJI': 'FIJI',
    ' FIJI ': 'FIJI',
    
    // Vanuatu variations
    'VANUATU': 'VANUATU',
    'Vanuatu': 'VANUATU',
    'VANUATU ': 'VANUATU',
    ' Vanuatu': 'VANUATU',
    ' VANUATU': 'VANUATU',
    ' VANUATU ': 'VANUATU',
    
    // Solomon Islands variations
    'SOLOMON ISLANDS': 'SOLOMON ISLANDS',
    'Solomon Islands': 'SOLOMON ISLANDS',
    'SOLOMON ISLANDS ': 'SOLOMON ISLANDS',
    ' Solomon Islands': 'SOLOMON ISLANDS',
    ' SOLOMON ISLANDS': 'SOLOMON ISLANDS',
    ' SOLOMON ISLANDS ': 'SOLOMON ISLANDS',
    
    // New Caledonia variations
    'NEW CALEDONIA': 'NEW CALEDONIA',
    'New Caledonia': 'NEW CALEDONIA',
    'NEW CALEDONIA ': 'NEW CALEDONIA',
    ' New Caledonia': 'NEW CALEDONIA',
    ' NEW CALEDONIA': 'NEW CALEDONIA',
    ' NEW CALEDONIA ': 'NEW CALEDONIA',
    
    // French Polynesia variations
    'FRENCH POLYNESIA': 'FRENCH POLYNESIA',
    'French Polynesia': 'FRENCH POLYNESIA',
    'FRENCH POLYNESIA ': 'FRENCH POLYNESIA',
    ' French Polynesia': 'FRENCH POLYNESIA',
    ' FRENCH POLYNESIA': 'FRENCH POLYNESIA',
    ' FRENCH POLYNESIA ': 'FRENCH POLYNESIA',
    
    // Samoa variations
    'SAMOA': 'SAMOA',
    'Samoa': 'SAMOA',
    'SAMOA ': 'SAMOA',
    ' Samoa': 'SAMOA',
    ' SAMOA': 'SAMOA',
    ' SAMOA ': 'SAMOA',
    
    // Tonga variations
    'TONGA': 'TONGA',
    'Tonga': 'TONGA',
    'TONGA ': 'TONGA',
    ' Tonga': 'TONGA',
    ' TONGA': 'TONGA',
    ' TONGA ': 'TONGA',
    
    // Kiribati variations
    'KIRIBATI': 'KIRIBATI',
    'Kiribati': 'KIRIBATI',
    'KIRIBATI ': 'KIRIBATI',
    ' Kiribati': 'KIRIBATI',
    ' KIRIBATI': 'KIRIBATI',
    ' KIRIBATI ': 'KIRIBATI',
    
    // Tuvalu variations
    'TUVALU': 'TUVALU',
    'Tuvalu': 'TUVALU',
    'TUVALU ': 'TUVALU',
    ' Tuvalu': 'TUVALU',
    ' TUVALU': 'TUVALU',
    ' TUVALU ': 'TUVALU',
    
    // Nauru variations
    'NAURU': 'NAURU',
    'Nauru': 'NAURU',
    'NAURU ': 'NAURU',
    ' Nauru': 'NAURU',
    ' NAURU': 'NAURU',
    ' NAURU ': 'NAURU',
    
    // Palau variations
    'PALAU': 'PALAU',
    'Palau': 'PALAU',
    'PALAU ': 'PALAU',
    ' Palau': 'PALAU',
    ' PALAU': 'PALAU',
    ' PALAU ': 'PALAU',
    
    // Marshall Islands variations
    'MARSHALL ISLANDS': 'MARSHALL ISLANDS',
    'Marshall Islands': 'MARSHALL ISLANDS',
    'MARSHALL ISLANDS ': 'MARSHALL ISLANDS',
    ' Marshall Islands': 'MARSHALL ISLANDS',
    ' MARSHALL ISLANDS': 'MARSHALL ISLANDS',
    ' MARSHALL ISLANDS ': 'MARSHALL ISLANDS',
    
    // Micronesia variations (mapped to Federated States of Micronesia)
    'MICRONESIA': 'FEDERATED STATES OF MICRONESIA',
    'Micronesia': 'FEDERATED STATES OF MICRONESIA',
    'MICRONESIA ': 'FEDERATED STATES OF MICRONESIA',
    ' Micronesia': 'FEDERATED STATES OF MICRONESIA',
    ' MICRONESIA': 'FEDERATED STATES OF MICRONESIA',
    ' MICRONESIA ': 'FEDERATED STATES OF MICRONESIA',
    
    // Northern Mariana Islands variations
    'NORTHERN MARIANA ISLANDS': 'NORTHERN MARIANA ISLANDS',
    'Northern Mariana Islands': 'NORTHERN MARIANA ISLANDS',
    'NORTHERN MARIANA ISLANDS ': 'NORTHERN MARIANA ISLANDS',
    ' Northern Mariana Islands': 'NORTHERN MARIANA ISLANDS',
    ' NORTHERN MARIANA ISLANDS': 'NORTHERN MARIANA ISLANDS',
    ' NORTHERN MARIANA ISLANDS ': 'NORTHERN MARIANA ISLANDS',
    
    // Guam variations
    'GUAM': 'GUAM',
    'Guam': 'GUAM',
    'GUAM ': 'GUAM',
    ' Guam': 'GUAM',
    ' GUAM': 'GUAM',
    ' GUAM ': 'GUAM',
    
    // American Samoa variations
    'AMERICAN SAMOA': 'AMERICAN SAMOA',
    'American Samoa': 'AMERICAN SAMOA',
    'AMERICAN SAMOA ': 'AMERICAN SAMOA',
    ' American Samoa': 'AMERICAN SAMOA',
    ' AMERICAN SAMOA': 'AMERICAN SAMOA',
    ' AMERICAN SAMOA ': 'AMERICAN SAMOA',
    
    // Cook Islands variations
    'COOK ISLANDS': 'COOK ISLANDS',
    'Cook Islands': 'COOK ISLANDS',
    'COOK ISLANDS ': 'COOK ISLANDS',
    ' Cook Islands': 'COOK ISLANDS',
    ' COOK ISLANDS': 'COOK ISLANDS',
    ' COOK ISLANDS ': 'COOK ISLANDS',
    
    // Niue variations
    'NIUE': 'NIUE',
    'Niue': 'NIUE',
    'NIUE ': 'NIUE',
    ' Niue': 'NIUE',
    ' NIUE': 'NIUE',
    ' NIUE ': 'NIUE',
    
    // Tokelau variations
    'TOKELAU': 'TOKELAU',
    'Tokelau': 'TOKELAU',
    'TOKELAU ': 'TOKELAU',
    ' Tokelau': 'TOKELAU',
    ' TOKELAU': 'TOKELAU',
    ' TOKELAU ': 'TOKELAU',
    
    // Pitcairn Islands variations
    'PITCAIRN ISLANDS': 'PITCAIRN ISLANDS',
    'Pitcairn Islands': 'PITCAIRN ISLANDS',
    'PITCAIRN ISLANDS ': 'PITCAIRN ISLANDS',
    ' Pitcairn Islands': 'PITCAIRN ISLANDS',
    ' PITCAIRN ISLANDS': 'PITCAIRN ISLANDS',
    ' PITCAIRN ISLANDS ': 'PITCAIRN ISLANDS',
    
    // Wallis and Futuna variations
    'WALLIS AND FUTUNA': 'WALLIS AND FUTUNA',
    'Wallis and Futuna': 'WALLIS AND FUTUNA',
    'WALLIS AND FUTUNA ': 'WALLIS AND FUTUNA',
    ' Wallis and Futuna': 'WALLIS AND FUTUNA',
    ' WALLIS AND FUTUNA': 'WALLIS AND FUTUNA',
    ' WALLIS AND FUTUNA ': 'WALLIS AND FUTUNA',
    
    // French Guiana variations
    'FRENCH GUIANA': 'FRENCH GUIANA',
    'French Guiana': 'FRENCH GUIANA',
    'FRENCH GUIANA ': 'FRENCH GUIANA',
    ' French Guiana': 'FRENCH GUIANA',
    ' FRENCH GUIANA': 'FRENCH GUIANA',
    ' FRENCH GUIANA ': 'FRENCH GUIANA',
    
    // Suriname variations
    'SURINAME': 'SURINAME',
    'Suriname': 'SURINAME',
    'SURINAME ': 'SURINAME',
    ' Suriname': 'SURINAME',
    ' SURINAME': 'SURINAME',
    ' SURINAME ': 'SURINAME',
    
    // Guyana variations
    'GUYANA': 'GUYANA',
    'Guyana': 'GUYANA',
    'GUYANA ': 'GUYANA',
    ' Guyana': 'GUYANA',
    ' GUYANA': 'GUYANA',
    ' GUYANA ': 'GUYANA',
    
    // Falkland Islands variations
    'FALKLAND ISLANDS': 'FALKLAND ISLANDS',
    'Falkland Islands': 'FALKLAND ISLANDS',
    'FALKLAND ISLANDS ': 'FALKLAND ISLANDS',
    ' Falkland Islands': 'FALKLAND ISLANDS',
    ' FALKLAND ISLANDS': 'FALKLAND ISLANDS',
    ' FALKLAND ISLANDS ': 'FALKLAND ISLANDS',
    
    // South Georgia and South Sandwich Islands variations
    'SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS': 'SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS',
    'South Georgia and South Sandwich Islands': 'SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS',
    'SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS ': 'SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS',
    ' South Georgia and South Sandwich Islands': 'SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS',
    ' SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS': 'SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS',
    ' SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS ': 'SOUTH GEORGIA AND SOUTH SANDWICH ISLANDS',
    
    // Bouvet Island variations
    'BOUVET ISLAND': 'BOUVET ISLAND',
    'Bouvet Island': 'BOUVET ISLAND',
    'BOUVET ISLAND ': 'BOUVET ISLAND',
    ' Bouvet Island': 'BOUVET ISLAND',
    ' BOUVET ISLAND': 'BOUVET ISLAND',
    ' BOUVET ISLAND ': 'BOUVET ISLAND',
    
    // Heard Island and McDonald Islands variations
    'HEARD ISLAND AND MCDONALD ISLANDS': 'HEARD ISLAND AND MCDONALD ISLANDS',
    'Heard Island and McDonald Islands': 'HEARD ISLAND AND MCDONALD ISLANDS',
    'HEARD ISLAND AND MCDONALD ISLANDS ': 'HEARD ISLAND AND MCDONALD ISLANDS',
    ' Heard Island and McDonald Islands': 'HEARD ISLAND AND MCDONALD ISLANDS',
    ' HEARD ISLAND AND MCDONALD ISLANDS': 'HEARD ISLAND AND MCDONALD ISLANDS',
    ' HEARD ISLAND AND MCDONALD ISLANDS ': 'HEARD ISLAND AND MCDONALD ISLANDS',
    
    // French Southern Territories variations
    'FRENCH SOUTHERN TERRITORIES': 'FRENCH SOUTHERN TERRITORIES',
    'French Southern Territories': 'FRENCH SOUTHERN TERRITORIES',
    'FRENCH SOUTHERN TERRITORIES ': 'FRENCH SOUTHERN TERRITORIES',
    ' French Southern Territories': 'FRENCH SOUTHERN TERRITORIES',
    ' FRENCH SOUTHERN TERRITORIES': 'FRENCH SOUTHERN TERRITORIES',
    ' FRENCH SOUTHERN TERRITORIES ': 'FRENCH SOUTHERN TERRITORIES',
    
    // British Indian Ocean Territory variations
    'BRITISH INDIAN OCEAN TERRITORY': 'BRITISH INDIAN OCEAN TERRITORY',
    'British Indian Ocean Territory': 'BRITISH INDIAN OCEAN TERRITORY',
    'BRITISH INDIAN OCEAN TERRITORY ': 'BRITISH INDIAN OCEAN TERRITORY',
    ' British Indian Ocean Territory': 'BRITISH INDIAN OCEAN TERRITORY',
    ' BRITISH INDIAN OCEAN TERRITORY': 'BRITISH INDIAN OCEAN TERRITORY',
    ' BRITISH INDIAN OCEAN TERRITORY ': 'BRITISH INDIAN OCEAN TERRITORY',
    
    // Christmas Island variations
    'CHRISTMAS ISLAND': 'CHRISTMAS ISLAND',
    'Christmas Island': 'CHRISTMAS ISLAND',
    'CHRISTMAS ISLAND ': 'CHRISTMAS ISLAND',
    ' Christmas Island': 'CHRISTMAS ISLAND',
    ' CHRISTMAS ISLAND': 'CHRISTMAS ISLAND',
    ' CHRISTMAS ISLAND ': 'CHRISTMAS ISLAND',
    
    // Cocos Islands variations
    'COCOS ISLANDS': 'COCOS ISLANDS',
    'Cocos Islands': 'COCOS ISLANDS',
    'COCOS ISLANDS ': 'COCOS ISLANDS',
    ' Cocos Islands': 'COCOS ISLANDS',
    ' COCOS ISLANDS': 'COCOS ISLANDS',
    ' COCOS ISLANDS ': 'COCOS ISLANDS',
    
    // Norfolk Island variations
    'NORFOLK ISLAND': 'NORFOLK ISLAND',
    'Norfolk Island': 'NORFOLK ISLAND',
    'NORFOLK ISLAND ': 'NORFOLK ISLAND',
    ' Norfolk Island': 'NORFOLK ISLAND',
    ' NORFOLK ISLAND': 'NORFOLK ISLAND',
    ' NORFOLK ISLAND ': 'NORFOLK ISLAND',
    
    // Ashmore and Cartier Islands variations
    'ASHMORE AND CARTIER ISLANDS': 'ASHMORE AND CARTIER ISLANDS',
    'Ashmore and Cartier Islands': 'ASHMORE AND CARTIER ISLANDS',
    'ASHMORE AND CARTIER ISLANDS ': 'ASHMORE AND CARTIER ISLANDS',
    ' Ashmore and Cartier Islands': 'ASHMORE AND CARTIER ISLANDS',
    ' ASHMORE AND CARTIER ISLANDS': 'ASHMORE AND CARTIER ISLANDS',
    ' ASHMORE AND CARTIER ISLANDS ': 'ASHMORE AND CARTIER ISLANDS',
    
    // Coral Sea Islands variations
    'CORAL SEA ISLANDS': 'CORAL SEA ISLANDS',
    'Coral Sea Islands': 'CORAL SEA ISLANDS',
    'CORAL SEA ISLANDS ': 'CORAL SEA ISLANDS',
    ' Coral Sea Islands': 'CORAL SEA ISLANDS',
    ' CORAL SEA ISLANDS': 'CORAL SEA ISLANDS',
    ' CORAL SEA ISLANDS ': 'CORAL SEA ISLANDS',
    
    // Antarctica variations
    'ANTARCTICA': 'ANTARCTICA',
    'Antarctica': 'ANTARCTICA',
    'ANTARCTICA ': 'ANTARCTICA',
    ' Antarctica': 'ANTARCTICA',
    ' ANTARCTICA': 'ANTARCTICA',
    ' ANTARCTICA ': 'ANTARCTICA',
    
    // Albania variations
    'ALBANIA': 'ALBANIA',
    'Albania': 'ALBANIA',
    'ALBANIA ': 'ALBANIA',
    ' Albania': 'ALBANIA',
    ' ALBANIA': 'ALBANIA',
    ' ALBANIA ': 'ALBANIA',
    
    // Andorra variations
    'ANDORRA': 'ANDORRA',
    'Andorra': 'ANDORRA',
    'ANDORRA ': 'ANDORRA',
    ' Andorra': 'ANDORRA',
    ' ANDORRA': 'ANDORRA',
    ' ANDORRA ': 'ANDORRA',
    
    // Bosnia and Herzegovina variations
    'BOSNIA AND HERZEGOVINA': 'BOSNIA AND HERZEGOVINA',
    'Bosnia and Herzegovina': 'BOSNIA AND HERZEGOVINA',
    'BOSNIA': 'BOSNIA AND HERZEGOVINA',
    'BOSNIA AND HERZEGOVINA ': 'BOSNIA AND HERZEGOVINA',
    ' Bosnia and Herzegovina': 'BOSNIA AND HERZEGOVINA',
    ' BOSNIA AND HERZEGOVINA': 'BOSNIA AND HERZEGOVINA',
    ' BOSNIA AND HERZEGOVINA ': 'BOSNIA AND HERZEGOVINA',
    
    // Kosovo variations
    'KOSOVO': 'KOSOVO',
    'Kosovo': 'KOSOVO',
    'KOSOVO ': 'KOSOVO',
    ' Kosovo': 'KOSOVO',
    ' KOSOVO': 'KOSOVO',
    ' KOSOVO ': 'KOSOVO',
    
    // Liechtenstein variations
    'LIECHTENSTEIN': 'LIECHTENSTEIN',
    'Liechtenstein': 'LIECHTENSTEIN',
    'LIECHTENSTEIN ': 'LIECHTENSTEIN',
    ' Liechtenstein': 'LIECHTENSTEIN',
    ' LIECHTENSTEIN': 'LIECHTENSTEIN',
    ' LIECHTENSTEIN ': 'LIECHTENSTEIN',
    
    // Monaco variations
    'MONACO': 'MONACO',
    'Monaco': 'MONACO',
    'MONACO ': 'MONACO',
    ' Monaco': 'MONACO',
    ' MONACO': 'MONACO',
    ' MONACO ': 'MONACO',
    
    // Montenegro variations
    'MONTENEGRO': 'MONTENEGRO',
    'Montenegro': 'MONTENEGRO',
    'MONTENEGRO ': 'MONTENEGRO',
    ' Montenegro': 'MONTENEGRO',
    ' MONTENEGRO': 'MONTENEGRO',
    ' MONTENEGRO ': 'MONTENEGRO',
    
    // North Macedonia variations
    'NORTH MACEDONIA': 'NORTH MACEDONIA',
    'North Macedonia': 'NORTH MACEDONIA',
    'MACEDONIA': 'NORTH MACEDONIA',
    'NORTH MACEDONIA ': 'NORTH MACEDONIA',
    ' North Macedonia': 'NORTH MACEDONIA',
    ' NORTH MACEDONIA': 'NORTH MACEDONIA',
    ' NORTH MACEDONIA ': 'NORTH MACEDONIA',
    
    // San Marino variations
    'SAN MARINO': 'SAN MARINO',
    'San Marino': 'SAN MARINO',
    'SAN MARINO ': 'SAN MARINO',
    ' San Marino': 'SAN MARINO',
    ' SAN MARINO': 'SAN MARINO',
    ' SAN MARINO ': 'SAN MARINO',
    
    // Vatican City variations
    'VATICAN CITY': 'VATICAN CITY',
    'Vatican City': 'VATICAN CITY',
    'HOLY SEE': 'VATICAN CITY',
    'VATICAN CITY ': 'VATICAN CITY',
    ' Vatican City': 'VATICAN CITY',
    ' VATICAN CITY': 'VATICAN CITY',
    ' VATICAN CITY ': 'VATICAN CITY',
    
    // Afghanistan variations
    'AFGHANISTAN': 'AFGHANISTAN',
    'Afghanistan': 'AFGHANISTAN',
    'AFGHANISTAN ': 'AFGHANISTAN',
    ' Afghanistan': 'AFGHANISTAN',
    ' AFGHANISTAN': 'AFGHANISTAN',
    ' AFGHANISTAN ': 'AFGHANISTAN',
    
    // North Korea variations
    'NORTH KOREA': 'NORTH KOREA',
    'North Korea': 'NORTH KOREA',
    'KOREA, DEMOCRATIC PEOPLE\'S REPUBLIC OF': 'NORTH KOREA',
    'DPRK': 'NORTH KOREA',
    'NORTH KOREA ': 'NORTH KOREA',
    ' North Korea': 'NORTH KOREA',
    ' NORTH KOREA': 'NORTH KOREA',
    ' NORTH KOREA ': 'NORTH KOREA',
    
    // Taiwan variations
    'TAIWAN': 'TAIWAN',
    'Taiwan': 'TAIWAN',
    'TAIWAN ': 'TAIWAN',
    ' Taiwan': 'TAIWAN',
    ' TAIWAN': 'TAIWAN',
    ' TAIWAN ': 'TAIWAN',
    
    // Maldives variations
    'MALDIVES': 'MALDIVES',
    'Maldives': 'MALDIVES',
    'MALDIVES ': 'MALDIVES',
    ' Maldives': 'MALDIVES',
    ' MALDIVES': 'MALDIVES',
    ' MALDIVES ': 'MALDIVES',
    
    // Mauritania variations
    'MAURITANIA': 'MAURITANIA',
    'Mauritania': 'MAURITANIA',
    'MAURITANIA ': 'MAURITANIA',
    ' Mauritania': 'MAURITANIA',
    ' MAURITANIA': 'MAURITANIA',
    ' MAURITANIA ': 'MAURITANIA',
    
    // Antigua and Barbuda variations
    'ANTIGUA AND BARBUDA': 'ANTIGUA AND BARBUDA',
    'Antigua and Barbuda': 'ANTIGUA AND BARBUDA',
    'ANTIGUA AND BARBUDA ': 'ANTIGUA AND BARBUDA',
    ' Antigua and Barbuda': 'ANTIGUA AND BARBUDA',
    ' ANTIGUA AND BARBUDA': 'ANTIGUA AND BARBUDA',
    ' ANTIGUA AND BARBUDA ': 'ANTIGUA AND BARBUDA',
    
    // Bahamas variations
    'BAHAMAS': 'BAHAMAS',
    'Bahamas': 'BAHAMAS',
    'BAHAMAS ': 'BAHAMAS',
    ' Bahamas': 'BAHAMAS',
    ' BAHAMAS': 'BAHAMAS',
    ' BAHAMAS ': 'BAHAMAS',
    
    // Barbados variations
    'BARBADOS': 'BARBADOS',
    'Barbados': 'BARBADOS',
    'BARBADOS ': 'BARBADOS',
    ' Barbados': 'BARBADOS',
    ' BARBADOS': 'BARBADOS',
    ' BARBADOS ': 'BARBADOS',
    
    // Belize variations
    'BELIZE': 'BELIZE',
    'Belize': 'BELIZE',
    'BELIZE ': 'BELIZE',
    ' Belize': 'BELIZE',
    ' BELIZE': 'BELIZE',
    ' BELIZE ': 'BELIZE',
    
    // Dominica variations
    'DOMINICA': 'DOMINICA',
    'Dominica': 'DOMINICA',
    'DOMINICA ': 'DOMINICA',
    ' Dominica': 'DOMINICA',
    ' DOMINICA': 'DOMINICA',
    ' DOMINICA ': 'DOMINICA',
    
    // Dominican Republic variations
    'DOMINICAN REPUBLIC': 'DOMINICAN REPUBLIC',
    'Dominican Republic': 'DOMINICAN REPUBLIC',
    'DOMINICAN REPUBLIC ': 'DOMINICAN REPUBLIC',
    ' Dominican Republic': 'DOMINICAN REPUBLIC',
    ' DOMINICAN REPUBLIC': 'DOMINICAN REPUBLIC',
    ' DOMINICAN REPUBLIC ': 'DOMINICAN REPUBLIC',
    
    // El Salvador variations
    'EL SALVADOR': 'EL SALVADOR',
    'El Salvador': 'EL SALVADOR',
    'EL SALVADOR ': 'EL SALVADOR',
    ' El Salvador': 'EL SALVADOR',
    ' EL SALVADOR': 'EL SALVADOR',
    ' EL SALVADOR ': 'EL SALVADOR',
    
    // Grenada variations
    'GRENADA': 'GRENADA',
    'Grenada': 'GRENADA',
    'GRENADA ': 'GRENADA',
    ' Grenada': 'GRENADA',
    ' GRENADA': 'GRENADA',
    ' GRENADA ': 'GRENADA',
    
    // Guatemala variations
    'GUATEMALA': 'GUATEMALA',
    'Guatemala': 'GUATEMALA',
    'GUATEMALA ': 'GUATEMALA',
    ' Guatemala': 'GUATEMALA',
    ' GUATEMALA': 'GUATEMALA',
    ' GUATEMALA ': 'GUATEMALA',
    
    // Haiti variations
    'HAITI': 'HAITI',
    'Haiti': 'HAITI',
    'HAITI ': 'HAITI',
    ' Haiti': 'HAITI',
    ' HAITI': 'HAITI',
    ' HAITI ': 'HAITI',
    
    // Honduras variations
    'HONDURAS': 'HONDURAS',
    'Honduras': 'HONDURAS',
    'HONDURAS ': 'HONDURAS',
    ' Honduras': 'HONDURAS',
    ' HONDURAS': 'HONDURAS',
    ' HONDURAS ': 'HONDURAS',
    
    // Jamaica variations
    'JAMAICA': 'JAMAICA',
    'Jamaica': 'JAMAICA',
    'JAMAICA ': 'JAMAICA',
    ' Jamaica': 'JAMAICA',
    ' JAMAICA': 'JAMAICA',
    ' JAMAICA ': 'JAMAICA',
    
    // Nicaragua variations
    'NICARAGUA': 'NICARAGUA',
    'Nicaragua': 'NICARAGUA',
    'NICARAGUA ': 'NICARAGUA',
    ' Nicaragua': 'NICARAGUA',
    ' NICARAGUA': 'NICARAGUA',
    ' NICARAGUA ': 'NICARAGUA',
    
    // Panama variations
    'PANAMA': 'PANAMA',
    'Panama': 'PANAMA',
    'PANAMA ': 'PANAMA',
    ' Panama': 'PANAMA',
    ' PANAMA': 'PANAMA',
    ' PANAMA ': 'PANAMA',
    
    // Saint Kitts and Nevis variations
    'SAINT KITTS AND NEVIS': 'SAINT KITTS AND NEVIS',
    'Saint Kitts and Nevis': 'SAINT KITTS AND NEVIS',
    'SAINT KITTS AND NEVIS ': 'SAINT KITTS AND NEVIS',
    ' Saint Kitts and Nevis': 'SAINT KITTS AND NEVIS',
    ' SAINT KITTS AND NEVIS': 'SAINT KITTS AND NEVIS',
    ' SAINT KITTS AND NEVIS ': 'SAINT KITTS AND NEVIS',
    
    // Saint Lucia variations
    'SAINT LUCIA': 'SAINT LUCIA',
    'Saint Lucia': 'SAINT LUCIA',
    'SAINT LUCIA ': 'SAINT LUCIA',
    ' Saint Lucia': 'SAINT LUCIA',
    ' SAINT LUCIA': 'SAINT LUCIA',
    ' SAINT LUCIA ': 'SAINT LUCIA',
    
    // Saint Vincent and the Grenadines variations
    'SAINT VINCENT AND THE GRENADINES': 'SAINT VINCENT AND THE GRENADINES',
    'Saint Vincent and the Grenadines': 'SAINT VINCENT AND THE GRENADINES',
    'SAINT VINCENT AND THE GRENADINES ': 'SAINT VINCENT AND THE GRENADINES',
    ' Saint Vincent and the Grenadines': 'SAINT VINCENT AND THE GRENADINES',
    ' SAINT VINCENT AND THE GRENADINES': 'SAINT VINCENT AND THE GRENADINES',
    ' SAINT VINCENT AND THE GRENADINES ': 'SAINT VINCENT AND THE GRENADINES',
    
    // Trinidad and Tobago variations
    'TRINIDAD AND TOBAGO': 'TRINIDAD AND TOBAGO',
    'Trinidad and Tobago': 'TRINIDAD AND TOBAGO',
    'TRINIDAD AND TOBAGO ': 'TRINIDAD AND TOBAGO',
    ' Trinidad and Tobago': 'TRINIDAD AND TOBAGO',
    ' TRINIDAD AND TOBAGO': 'TRINIDAD AND TOBAGO',
    ' TRINIDAD AND TOBAGO ': 'TRINIDAD AND TOBAGO',
    
    // New Zealand variations (fix the existing NZ mapping)
    'NZ': 'NEW ZEALAND',
    'NEW ZEALAND': 'NEW ZEALAND',
    'New Zealand': 'NEW ZEALAND',
    'NEW ZEALAND ': 'NEW ZEALAND',
    ' New Zealand': 'NEW ZEALAND',
    ' NEW ZEALAND': 'NEW ZEALAND',
    ' NEW ZEALAND ': 'NEW ZEALAND',
    
    // Federated States of Micronesia variations (fix existing mapping)
    'FEDERATED STATES OF MICRONESIA': 'FEDERATED STATES OF MICRONESIA',
    'Federated States of Micronesia': 'FEDERATED STATES OF MICRONESIA',
    'FEDERATED STATES OF MICRONESIA ': 'FEDERATED STATES OF MICRONESIA',
    ' Federated States of Micronesia': 'FEDERATED STATES OF MICRONESIA',
    ' FEDERATED STATES OF MICRONESIA': 'FEDERATED STATES OF MICRONESIA',
    ' FEDERATED STATES OF MICRONESIA ': 'FEDERATED STATES OF MICRONESIA',
    
    // Additional Caribbean territories
    // Aruba variations
    'ARUBA': 'ARUBA',
    'Aruba': 'ARUBA',
    'ARUBA ': 'ARUBA',
    ' Aruba': 'ARUBA',
    ' ARUBA': 'ARUBA',
    ' ARUBA ': 'ARUBA',
    
    // Curaçao variations
    'CURAÇAO': 'CURAÇAO',
    'Curaçao': 'CURAÇAO',
    'CURACAO': 'CURAÇAO',
    'CURAÇAO ': 'CURAÇAO',
    ' Curaçao': 'CURAÇAO',
    ' CURAÇAO': 'CURAÇAO',
    ' CURAÇAO ': 'CURAÇAO',
    
    // Sint Maarten variations
    'SINT MAARTEN': 'SINT MAARTEN',
    'Sint Maarten': 'SINT MAARTEN',
    'SINT MAARTEN ': 'SINT MAARTEN',
    ' Sint Maarten': 'SINT MAARTEN',
    ' SINT MAARTEN': 'SINT MAARTEN',
    ' SINT MAARTEN ': 'SINT MAARTEN',
    
    // Cayman Islands variations
    'CAYMAN ISLANDS': 'CAYMAN ISLANDS',
    'Cayman Islands': 'CAYMAN ISLANDS',
    'CAYMAN ISLANDS ': 'CAYMAN ISLANDS',
    ' Cayman Islands': 'CAYMAN ISLANDS',
    ' CAYMAN ISLANDS': 'CAYMAN ISLANDS',
    ' CAYMAN ISLANDS ': 'CAYMAN ISLANDS',
    
    // Bermuda variations
    'BERMUDA': 'BERMUDA',
    'Bermuda': 'BERMUDA',
    'BERMUDA ': 'BERMUDA',
    ' Bermuda': 'BERMUDA',
    ' BERMUDA': 'BERMUDA',
    ' BERMUDA ': 'BERMUDA',
    
    // British Virgin Islands variations
    'BRITISH VIRGIN ISLANDS': 'BRITISH VIRGIN ISLANDS',
    'British Virgin Islands': 'BRITISH VIRGIN ISLANDS',
    'BRITISH VIRGIN ISLANDS ': 'BRITISH VIRGIN ISLANDS',
    ' British Virgin Islands': 'BRITISH VIRGIN ISLANDS',
    ' BRITISH VIRGIN ISLANDS': 'BRITISH VIRGIN ISLANDS',
    ' BRITISH VIRGIN ISLANDS ': 'BRITISH VIRGIN ISLANDS',
    
    // US Virgin Islands variations
    'US VIRGIN ISLANDS': 'US VIRGIN ISLANDS',
    'US Virgin Islands': 'US VIRGIN ISLANDS',
    'U.S. VIRGIN ISLANDS': 'US VIRGIN ISLANDS',
    'US VIRGIN ISLANDS ': 'US VIRGIN ISLANDS',
    ' US Virgin Islands': 'US VIRGIN ISLANDS',
    ' US VIRGIN ISLANDS': 'US VIRGIN ISLANDS',
    ' US VIRGIN ISLANDS ': 'US VIRGIN ISLANDS',
    
    // Puerto Rico variations
    'PUERTO RICO': 'PUERTO RICO',
    'Puerto Rico': 'PUERTO RICO',
    'PUERTO RICO ': 'PUERTO RICO',
    ' Puerto Rico': 'PUERTO RICO',
    ' PUERTO RICO': 'PUERTO RICO',
    ' PUERTO RICO ': 'PUERTO RICO',
    
    // Greenland variations
    'GREENLAND': 'GREENLAND',
    'Greenland': 'GREENLAND',
    'GREENLAND ': 'GREENLAND',
    ' Greenland': 'GREENLAND',
    ' GREENLAND': 'GREENLAND',
    ' GREENLAND ': 'GREENLAND',
    
    // Faroe Islands variations
    'FAROE ISLANDS': 'FAROE ISLANDS',
    'Faroe Islands': 'FAROE ISLANDS',
    'FAROE ISLANDS ': 'FAROE ISLANDS',
    ' Faroe Islands': 'FAROE ISLANDS',
    ' FAROE ISLANDS': 'FAROE ISLANDS',
    ' FAROE ISLANDS ': 'FAROE ISLANDS',
    
    // Additional Pacific territories
    // French Polynesia already exists, but adding more variations
    'TAHITI': 'FRENCH POLYNESIA',
    'Tahiti': 'FRENCH POLYNESIA',
    'TAHITI ': 'FRENCH POLYNESIA',
    ' Tahiti': 'FRENCH POLYNESIA',
    ' TAHITI': 'FRENCH POLYNESIA',
    ' TAHITI ': 'FRENCH POLYNESIA',
    
    // New Caledonia already exists, but adding more variations
    'NOUVELLE-CALEDONIE': 'NEW CALEDONIA',
    'Nouvelle-Caledonie': 'NEW CALEDONIA',
    'NOUVELLE-CALEDONIE ': 'NEW CALEDONIA',
    ' Nouvelle-Caledonie': 'NEW CALEDONIA',
    ' NOUVELLE-CALEDONIE': 'NEW CALEDONIA',
    ' NOUVELLE-CALEDONIE ': 'NEW CALEDONIA',
    
    // Additional African territories
    // Réunion variations
    'REUNION': 'REUNION',
    'Réunion': 'REUNION',
    'REUNION ': 'REUNION',
    ' Réunion': 'REUNION',
    ' REUNION': 'REUNION',
    ' REUNION ': 'REUNION',
    
    // Mayotte variations
    'MAYOTTE': 'MAYOTTE',
    'Mayotte': 'MAYOTTE',
    'MAYOTTE ': 'MAYOTTE',
    ' Mayotte': 'MAYOTTE',
    ' MAYOTTE': 'MAYOTTE',
    ' MAYOTTE ': 'MAYOTTE',
    
    // Additional Asian territories
    // Macau variations
    'MACAU': 'MACAU',
    'Macau': 'MACAU',
    'MACAU ': 'MACAU',
    ' Macau': 'MACAU',
    ' MACAU': 'MACAU',
    ' MACAU ': 'MACAU',
    
    // Additional European territories
    // Gibraltar variations
    'GIBRALTAR': 'GIBRALTAR',
    'Gibraltar': 'GIBRALTAR',
    'GIBRALTAR ': 'GIBRALTAR',
    ' Gibraltar': 'GIBRALTAR',
    ' GIBRALTAR': 'GIBRALTAR',
    ' GIBRALTAR ': 'GIBRALTAR',
    
    // Isle of Man variations
    'ISLE OF MAN': 'ISLE OF MAN',
    'Isle of Man': 'ISLE OF MAN',
    'ISLE OF MAN ': 'ISLE OF MAN',
    ' Isle of Man': 'ISLE OF MAN',
    ' ISLE OF MAN': 'ISLE OF MAN',
    ' ISLE OF MAN ': 'ISLE OF MAN',
    
    // Jersey variations
    'JERSEY': 'JERSEY',
    'Jersey': 'JERSEY',
    'JERSEY ': 'JERSEY',
    ' Jersey': 'JERSEY',
    ' JERSEY': 'JERSEY',
    ' JERSEY ': 'JERSEY',
    
    // Guernsey variations
    'GUERNSEY': 'GUERNSEY',
    'Guernsey': 'GUERNSEY',
    'GUERNSEY ': 'GUERNSEY',
    ' Guernsey': 'GUERNSEY',
    ' GUERNSEY': 'GUERNSEY',
    ' GUERNSEY ': 'GUERNSEY',
    

  };
  
  // Check if we have a mapping for this country
  const upperCountry = normalized.toUpperCase();
  if (countryMappings[upperCountry]) {
    return countryMappings[upperCountry];
  }
  
  // Standardize capitalization (first letter of each word)
  return normalized.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

// Process supplier-customer data
async function processSupplierCustomerData(records: any[], limit: number, dateRange: string): Promise<QuickSummaryResponse> {
  const supplierMap = new Map<string, { 
    value: number; 
    shipments: number; 
    customers: Map<string, { value: number; shipments: number }> 
  }>()
  
  records.forEach(record => {
    const supplierName = normalizeCompanyName(record.supplier_name || 'Unknown Supplier')
    let customerName = normalizeCompanyName(record.buyer_name || 'Unknown Customer')
    
    // Clean up customer names
    const invalidCustomerNames = [
      'na', 'n/a', 'null', 'undefined', 'to', 'to order of', 'to order', 'order of',
      'unknown', 'unknown customer', 'customer', 'buyer', 'client', 'end user',
      'end-user', 'enduser', 'recipient', 'consignee', 'importer', 'purchaser'
    ]
    
    if (!customerName || 
        customerName.trim() === '' || 
        customerName.length < 2 ||
        invalidCustomerNames.includes(customerName.toLowerCase().trim())) {
      customerName = 'Unknown Customer'
    }
    
    const value = parseFloat(record.total_value_usd || '0') || 0
    
    // Debug: Log suspicious values
    if (value > 1000000) {
      console.log(`🔍 DEBUG: High value detected: ${value} for supplier ${supplierName}`)
    }
    
    if (!supplierMap.has(supplierName)) {
      supplierMap.set(supplierName, {
        value: 0,
        shipments: 0,
        customers: new Map()
      })
    }
    
    const supplier = supplierMap.get(supplierName)!
    supplier.value += value
    supplier.shipments += 1
    
    if (!supplier.customers.has(customerName)) {
      supplier.customers.set(customerName, { value: 0, shipments: 0 })
    }
    
    const customer = supplier.customers.get(customerName)!
    customer.value += value
    customer.shipments += 1
  })

  const suppliersArray = Array.from(supplierMap.entries())
    .map(([name, data]) => ({
      name,
      totalValue: data.value,
      totalShipments: data.shipments,
      customers: data.customers
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
  
  const totalMarketValue = suppliersArray.reduce((sum, supplier) => sum + supplier.totalValue, 0)
  const totalMarketShipments = suppliersArray.reduce((sum, supplier) => sum + supplier.totalShipments, 0)
  
  // Debug: Log processed data
  console.log(`🔍 DEBUG: Processed ${suppliersArray.length} suppliers`)
  if (suppliersArray.length > 0) {
    console.log(`🔍 DEBUG: Top supplier: ${suppliersArray[0].name} with value: ${suppliersArray[0].totalValue}`)
    console.log(`🔍 DEBUG: Total market value: ${totalMarketValue}`)
  }
  
  const top5Suppliers = suppliersArray.slice(0, limit)
  
  const suppliersWithMarketShare = top5Suppliers.map(supplier => {
      const customerArray = Array.from(supplier.customers.entries())
        .map(([name, data]) => ({
          name,
          value: data.value,
          shipments: data.shipments,
          percentage: supplier.totalValue > 0 ? (data.value / supplier.totalValue) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
      
      if (supplier.customers.size > 5) {
        const top5CustomerValue = customerArray.reduce((sum, customer) => sum + customer.value, 0)
        const top5CustomerShipments = customerArray.reduce((sum, customer) => sum + customer.shipments, 0)
        const othersCustomerValue = supplier.totalValue - top5CustomerValue
        const othersCustomerShipments = supplier.totalShipments - top5CustomerShipments
        
        if (othersCustomerValue > 0) {
          customerArray.push({
            name: generateDynamicOthersLabel(supplier.name, 'supplier'),
            value: othersCustomerValue,
            shipments: othersCustomerShipments,
            percentage: supplier.totalValue > 0 ? (othersCustomerValue / supplier.totalValue) * 100 : 0
          })
        }
      }
      
      return {
        supplier: {
          name: supplier.name,
          totalValue: supplier.totalValue,
          totalShipments: supplier.totalShipments,
          marketShare: totalMarketValue > 0 ? (supplier.totalValue / totalMarketValue) * 100 : 0,
          totalCustomers: supplier.customers.size
        },
        customers: customerArray
      }
  })

  return {
    type: 'supplier-customer',
    dateRange: getReadableDateRange(dateRange),
    topSuppliers: suppliersWithMarketShare,
    summary: {
      totalValue: totalMarketValue,
      totalShipments: totalMarketShipments,
      averageValue: totalMarketShipments > 0 ? totalMarketValue / totalMarketShipments : 0,
      supplierCount: suppliersArray.length
    }
  }
}

// Process geographic data
async function processGeographicData(records: any[], limit: number, dateRange: string): Promise<QuickSummaryResponse> {
  const countryMap = new Map<string, { 
    value: number; 
    shipments: number; 
    importers: Map<string, { value: number; shipments: number }> 
  }>()
  
  records.forEach(record => {
    const countryName = record.country_of_destination || 'Unknown Country'
    const importerName = record.buyer_name || 'Unknown Importer'
    const value = parseFloat(record.total_value_usd || '0') || 0
    
    // Use normalized country name to eliminate duplicates
    let cleanCountryName = normalizeCountryName(countryName)
    let cleanImporterName = normalizeCompanyName(importerName)
    
    const invalidNames = [
      'na', 'n/a', 'null', 'undefined', 'to', 'to order of', 'to order', 'order of',
      'unknown', 'unknown customer', 'customer', 'buyer', 'client', 'end user',
      'end-user', 'enduser', 'recipient', 'consignee', 'importer', 'purchaser'
    ]
    
    if (!cleanCountryName || 
        cleanCountryName.trim() === '' || 
        cleanCountryName.length < 2 ||
        invalidNames.includes(cleanCountryName.toLowerCase().trim())) {
      cleanCountryName = 'Unknown Country'
    }
    
    if (!cleanImporterName || 
        cleanImporterName.trim() === '' || 
        cleanImporterName.length < 2 ||
        invalidNames.includes(cleanImporterName.toLowerCase().trim())) {
      cleanImporterName = 'Unknown Importer'
    }
    
    if (!countryMap.has(cleanCountryName)) {
      countryMap.set(cleanCountryName, {
        value: 0,
        shipments: 0,
        importers: new Map()
      })
    }
    
    const country = countryMap.get(cleanCountryName)!
    country.value += value
    country.shipments += 1
    
    if (!country.importers.has(cleanImporterName)) {
      country.importers.set(cleanImporterName, { value: 0, shipments: 0 })
    }
    
    const importer = country.importers.get(cleanImporterName)!
    importer.value += value
    importer.shipments += 1
  })

  const countriesArray = Array.from(countryMap.entries())
    .map(([name, data]) => ({
      name,
      totalValue: data.value,
      totalShipments: data.shipments,
      importers: data.importers
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
  
  const totalMarketValue = countriesArray.reduce((sum, country) => sum + country.totalValue, 0)
  const totalMarketShipments = countriesArray.reduce((sum, country) => sum + country.totalShipments, 0)
  
  const top5Countries = countriesArray.slice(0, limit)
  
  const countriesWithMarketShare = top5Countries.map(country => {
      const importerArray = Array.from(country.importers.entries())
        .map(([name, data]) => ({
          name,
          value: data.value,
          shipments: data.shipments,
          percentage: country.totalValue > 0 ? (data.value / country.totalValue) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
      
      if (country.importers.size > 5) {
        const top5ImporterValue = importerArray.reduce((sum, importer) => sum + importer.value, 0)
        const top5ImporterShipments = importerArray.reduce((sum, importer) => sum + importer.shipments, 0)
        const othersImporterValue = country.totalValue - top5ImporterValue
        const othersImporterShipments = country.totalShipments - top5ImporterShipments
        
        if (othersImporterValue > 0) {
          importerArray.push({
            name: generateDynamicOthersLabel(country.name, 'country'),
            value: othersImporterValue,
            shipments: othersImporterShipments,
            percentage: country.totalValue > 0 ? (othersImporterValue / country.totalValue) * 100 : 0
          })
        }
      }
      
      return {
        country: {
          name: country.name,
          totalValue: country.totalValue,
          totalShipments: country.totalShipments,
          marketShare: totalMarketValue > 0 ? (country.totalValue / totalMarketValue) * 100 : 0,
          totalImporters: country.importers.size
        },
        importers: importerArray
      }
  })

  return {
    type: 'geographic',
    dateRange: getReadableDateRange(dateRange),
    topCountries: countriesWithMarketShare,
    summary: {
      totalValue: totalMarketValue,
      totalShipments: totalMarketShipments,
      averageValue: totalMarketShipments > 0 ? totalMarketValue / totalMarketShipments : 0,
      countryCount: countriesArray.length
    }
  }
} 