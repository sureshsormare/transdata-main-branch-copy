// File: app/api/search/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Function to calculate monthly statistics from the complete dataset
function calculateMonthlyStats(records: any[]) {
  if (!records || records.length === 0) {
    return [];
  }

  // Group records by year and month
  const monthlyGroups = new Map<string, any[]>();
  
  records.forEach(record => {
    if (!record.shipping_bill_date) return;
    
    const recordDate = new Date(record.shipping_bill_date);
    if (isNaN(recordDate.getTime())) return;
    
    const year = recordDate.getFullYear();
    const month = recordDate.getMonth(); // 0-11
    const key = `${year}-${month.toString().padStart(2, '0')}`;
    
    if (!monthlyGroups.has(key)) {
      monthlyGroups.set(key, []);
    }
    monthlyGroups.get(key)!.push(record);
  });

  if (monthlyGroups.size === 0) {
    return [];
  }

  // Get all year-month combinations and sort them
  const sortedKeys = Array.from(monthlyGroups.keys()).sort();
  
  // Take the most recent 12 months
  const recentKeys = sortedKeys.slice(-12);
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthlyData = recentKeys.map(key => {
    const [year, monthStr] = key.split('-');
    const monthIndex = parseInt(monthStr);
    const monthName = monthNames[monthIndex];
    
    const monthRecords = monthlyGroups.get(key) || [];
    
    const totalValue = monthRecords.reduce((sum, record) => {
      const value = parseFloat(record.total_value_usd || "0");
      return isNaN(value) ? sum : sum + value;
    }, 0);
    
    const count = monthRecords.length;
    
    return {
      month: monthName,
      value: totalValue,
      count
    };
  });

  return monthlyData;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const importCountry = searchParams.get("importCountry");
  const exportCountry = searchParams.get("exportCountry");
  const exporter = searchParams.get("exporter");
  const importer = searchParams.get("importer");

  if (!query || query.trim() === "") {
    return NextResponse.json(
      { error: "Query parameter 'q' is required." },
      { status: 400 }
    );
  }

  try {
    // Build where clause for filtering
    const whereClause: any = {
      OR: [
        { product_description: { contains: query, mode: "insensitive" } },
        { hs_code: { contains: query, mode: "insensitive" } },
      ],
    };

    // Add country filters if provided
    if (importCountry && importCountry.trim() !== "") {
      whereClause.country_of_destination = importCountry;
    }
    if (exportCountry && exportCountry.trim() !== "") {
      whereClause.country_of_origin = exportCountry;
    }
    
    // Add supplier and buyer filters if provided
    if (exporter && exporter.trim() !== "") {
      whereClause.supplier_name = exporter;
    }
    if (importer && importer.trim() !== "") {
      whereClause.buyer_name = importer;
    }

    // Determine result limit based on whether filters are applied
    const hasFilters = importCountry || exportCountry || exporter || importer;
    const resultLimit = hasFilters ? 3 : 10;
    
    // Get filtered results (limited based on filter usage)
    const results = await prisma.exp_india.findMany({
      where: whereClause,
      take: resultLimit,
    });

    // Get all matching records for aggregation calculations (without country filters)
    const allMatchingRecords = await prisma.exp_india.findMany({
      where: {
        OR: [
          { product_description: { contains: query, mode: "insensitive" } },
          { hs_code: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    // Calculate aggregates from the complete dataset
    const totalRecords = allMatchingRecords.length;
    
    // Get unique buyers (excluding null/empty values)
    const uniqueBuyers = new Set(
      allMatchingRecords
        .map(record => record.buyer_name)
        .filter((name): name is string => name !== null && name.trim() !== '')
    );
    
    // Get unique suppliers (excluding null/empty values)
    const uniqueSuppliers = new Set(
      allMatchingRecords
        .map(record => record.supplier_name)
        .filter((name): name is string => name !== null && name.trim() !== '')
    );
    
    // Calculate total USD value (sum of all valid numeric values)
    const totalValueUSD = allMatchingRecords
      .map(record => record.total_value_usd)
      .filter((value): value is string => value !== null && !isNaN(parseFloat(value)))
      .reduce((sum, value) => sum + parseFloat(value), 0);

    // Get country statistics for filters
    const importCountryStats = new Map<string, number>();
    const exportCountryStats = new Map<string, number>();

    allMatchingRecords.forEach(record => {
      if (record.country_of_destination) {
        const count = importCountryStats.get(record.country_of_destination) || 0;
        importCountryStats.set(record.country_of_destination, count + 1);
      }
      if (record.country_of_origin) {
        const count = exportCountryStats.get(record.country_of_origin) || 0;
        exportCountryStats.set(record.country_of_origin, count + 1);
      }
    });

    const topImportCountries = Array.from(importCountryStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    const topExportCountries = Array.from(exportCountryStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    // Get supplier and buyer statistics for filters (with values)
    const supplierStats = new Map<string, { count: number; value: number }>();
    const buyerStats = new Map<string, { count: number; value: number }>();

    allMatchingRecords.forEach(record => {
      const value = parseFloat(record.total_value_usd || "0");
      
      if (record.supplier_name && record.supplier_name.trim() !== '') {
        const current = supplierStats.get(record.supplier_name) || { count: 0, value: 0 };
        supplierStats.set(record.supplier_name, {
          count: current.count + 1,
          value: current.value + value
        });
      }
      if (record.buyer_name && record.buyer_name.trim() !== '') {
        const current = buyerStats.get(record.buyer_name) || { count: 0, value: 0 };
        buyerStats.set(record.buyer_name, {
          count: current.count + 1,
          value: current.value + value
        });
      }
    });

    const topUniqueExporters = Array.from(supplierStats.entries())
      .sort((a, b) => b[1].value - a[1].value) // Sort by value for better analytics
      .slice(0, 5)
      .map(([exporter, data]) => ({ exporter, count: data.count, value: data.value }));

    const topUniqueImporters = Array.from(buyerStats.entries())
      .sort((a, b) => b[1].value - a[1].value) // Sort by value for better analytics
      .slice(0, 5)
      .map(([importer, data]) => ({ importer, count: data.count, value: data.value }));



    // Calculate comprehensive analytics from the complete dataset
    const monthlyStats = calculateMonthlyStats(allMatchingRecords);

    // Calculate price analysis from complete dataset
    const prices = allMatchingRecords
      .map(record => parseFloat(record.unit_rate_usd || "0"))
      .filter(p => !isNaN(p) && p > 0);
    
    const avgPrice = prices.length > 0 ? prices.reduce((sum, p) => sum + p, 0) / prices.length : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const priceVolatility = prices.length > 0 ? 
      (Math.sqrt(prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length) / avgPrice) * 100 : 0;

    // Calculate price distribution
    const priceRanges = [
      { min: 0, max: 10, label: '$0-$10' },
      { min: 10, max: 50, label: '$10-$50' },
      { min: 50, max: 100, label: '$50-$100' },
      { min: 100, max: 500, label: '$100-$500' },
      { min: 500, max: Infinity, label: '$500+' }
    ];

    const priceDistribution = priceRanges.map(range => {
      const count = prices.filter(p => p >= range.min && p < range.max).length;
      return {
        range: range.label,
        count,
        percentage: prices.length > 0 ? (count / prices.length) * 100 : 0
      };
    });

    // Calculate trade routes from complete dataset
    const routeMap = new Map<string, { count: number; value: number }>();
    allMatchingRecords.forEach(record => {
      const origin = record.country_of_origin || 'Unknown';
      const destination = record.country_of_destination || 'Unknown';
      const routeKey = `${origin} → ${destination}`;
      const value = parseFloat(record.total_value_usd || "0");
      
      const current = routeMap.get(routeKey) || { count: 0, value: 0 };
      routeMap.set(routeKey, {
        count: current.count + 1,
        value: current.value + value
      });
    });

    const tradeRoutes = Array.from(routeMap.entries())
      .sort(([, a], [, b]) => b.value - a.value)
      .slice(0, 8)
      .map(([route, data]) => {
        const [origin, destination] = route.split(' → ');
        return {
          origin,
          destination,
          count: data.count,
          value: data.value,
          frequency: data.count / totalRecords * 100
        };
      });

    // Calculate product categories from complete dataset
    const categoryMap = new Map<string, { count: number; value: number }>();
    allMatchingRecords.forEach(record => {
      const category = record.chapter || 'Unknown';
      const value = parseFloat(record.total_value_usd || "0");
      
      const current = categoryMap.get(category) || { count: 0, value: 0 };
      categoryMap.set(category, {
        count: current.count + 1,
        value: current.value + value
      });
    });

    const productCategories = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category: `Chapter ${category}`,
        count: data.count,
        value: data.value,
        percentage: (data.count / totalRecords) * 100
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate shipment modes from complete dataset
    const modeMap = new Map<string, { count: number; value: number }>();
    allMatchingRecords.forEach(record => {
      const mode = record.mode || 'Unknown';
      const value = parseFloat(record.total_value_usd || "0");
      
      const current = modeMap.get(mode) || { count: 0, value: 0 };
      modeMap.set(mode, {
        count: current.count + 1,
        value: current.value + value
      });
    });

    const shipmentModes = Array.from(modeMap.entries())
      .map(([mode, data]) => ({
        mode,
        count: data.count,
        value: data.value,
        percentage: (data.count / totalRecords) * 100
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate port analysis from complete dataset
    const portMap = new Map<string, { count: number; value: number; type: 'origin' | 'destination' }>();
    allMatchingRecords.forEach(record => {
      const originPort = record.port_of_origin || 'Unknown';
      const destPort = record.port_of_destination || 'Unknown';
      const value = parseFloat(record.total_value_usd || "0");
      
      // Origin ports
      const originData = portMap.get(originPort) || { count: 0, value: 0, type: 'origin' as const };
      portMap.set(originPort, {
        count: originData.count + 1,
        value: originData.value + value,
        type: 'origin'
      });
      
      // Destination ports
      const destData = portMap.get(destPort) || { count: 0, value: 0, type: 'destination' as const };
      portMap.set(destPort, {
        count: destData.count + 1,
        value: destData.value + value,
        type: 'destination'
      });
    });

    const portAnalysis = Array.from(portMap.entries())
      .sort(([, a], [, b]) => b.value - a.value)
      .slice(0, 6)
      .map(([port, data]) => ({
        port,
        count: data.count,
        value: data.value,
        type: data.type
      }));

    // Calculate market share by country from complete dataset
    const countryValueMap = new Map<string, number>();
    allMatchingRecords.forEach(record => {
      const country = record.country_of_destination || 'Unknown';
      const value = parseFloat(record.total_value_usd || "0");
      countryValueMap.set(country, (countryValueMap.get(country) || 0) + value);
    });

    const top5Countries = Array.from(countryValueMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, value]) => ({
        country,
        share: totalValueUSD > 0 ? (value / totalValueUSD) * 100 : 0
      }));

    // Calculate market growth from monthly stats
    const recentMonths = monthlyStats.slice(-6);
    const earlierMonths = monthlyStats.slice(-12, -6);
    const recentAvg = recentMonths.reduce((sum, m) => sum + m.count, 0) / recentMonths.length;
    const earlierAvg = earlierMonths.reduce((sum, m) => sum + m.count, 0) / earlierMonths.length;
    const marketGrowth = earlierAvg > 0 ? ((recentAvg - earlierAvg) / earlierAvg) * 100 : 0;

    // Calculate competitive analysis
    const competitiveAnalysis = {
      supplierDiversity: (uniqueSuppliers.size / totalRecords) * 100,
      buyerDiversity: (uniqueBuyers.size / totalRecords) * 100,
      marketConcentration: top5Countries.slice(0, 3).reduce((sum, c) => sum + c.share, 0),
      priceCompetitiveness: priceVolatility < 20 ? 85 : priceVolatility < 40 ? 70 : 50
    };

    // Calculate market intelligence
    const marketIntelligence = {
      marketSize: totalValueUSD,
      marketGrowth: marketGrowth,
      marketMaturity: totalRecords > 1000 ? 'Mature' : totalRecords > 500 ? 'Growing' : 'Emerging',
      entryBarriers: uniqueSuppliers.size > 100 ? 'Low' : uniqueSuppliers.size > 50 ? 'Medium' : 'High',
      competitiveIntensity: (uniqueSuppliers.size / totalRecords) * 100,
      profitPotential: priceVolatility < 20 ? 85 : priceVolatility < 40 ? 70 : 50
    };

    // Calculate risk assessment
    const riskAssessment = {
      supplyChainRisk: uniqueSuppliers.size < 10 ? 80 : uniqueSuppliers.size < 50 ? 50 : 20,
      regulatoryRisk: 30, // Mock value based on data availability
      marketRisk: priceVolatility > 50 ? 80 : priceVolatility > 30 ? 60 : 40,
      currencyRisk: 30, // Mock value
      overallRisk: (() => {
        const avgRisk = (uniqueSuppliers.size < 10 ? 80 : uniqueSuppliers.size < 50 ? 50 : 20) + 
                       30 + 
                       (priceVolatility > 50 ? 80 : priceVolatility > 30 ? 60 : 40) + 30;
        const risk = avgRisk / 4;
        return risk > 70 ? 'High' : risk > 40 ? 'Medium' : 'Low';
      })()
    };

    // Calculate business opportunities
    const opportunities = [
      {
        type: 'Market Expansion',
        description: 'High growth potential in emerging markets',
        potential: marketGrowth > 10 ? 85 : 60,
        confidence: 80
      },
      {
        type: 'Supplier Diversification',
        description: 'Opportunity to reduce dependency on major suppliers',
        potential: uniqueSuppliers.size < 20 ? 90 : 50,
        confidence: 75
      },
      {
        type: 'Price Optimization',
        description: 'Potential for price optimization based on market analysis',
        potential: priceVolatility > 30 ? 80 : 60,
        confidence: 70
      },
      {
        type: 'New Product Categories',
        description: 'Opportunity to expand into new product categories',
        potential: categoryMap.size < 5 ? 85 : 60,
        confidence: 65
      }
    ];

    const response = {
      results,
      aggregates: {
        totalRecords,
        uniqueBuyers: uniqueBuyers.size,
        uniqueSuppliers: uniqueSuppliers.size,
        totalValueUSD,
      },
      countryStats: {
        topImportCountries,
        topExportCountries,
        topUniqueExporters,
        topUniqueImporters,
      },
      monthlyStats,
      // Comprehensive analytics from complete dataset
      analytics: {
        priceAnalysis: {
          avgPrice,
          minPrice,
          maxPrice,
          priceVolatility,
          priceDistribution
        },
        tradeRoutes,
        productCategories,
        shipmentModes,
        portAnalysis,
        marketShare: { top5Countries },
        competitiveAnalysis,
        marketIntelligence,
        riskAssessment,
        opportunities
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
