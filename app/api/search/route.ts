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

    // Get supplier and buyer statistics for filters
    const supplierStats = new Map<string, number>();
    const buyerStats = new Map<string, number>();

    allMatchingRecords.forEach(record => {
      if (record.supplier_name && record.supplier_name.trim() !== '') {
        const count = supplierStats.get(record.supplier_name) || 0;
        supplierStats.set(record.supplier_name, count + 1);
      }
      if (record.buyer_name && record.buyer_name.trim() !== '') {
        const count = buyerStats.get(record.buyer_name) || 0;
        buyerStats.set(record.buyer_name, count + 1);
      }
    });

    const topUniqueExporters = Array.from(supplierStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([exporter, count]) => ({ exporter, count }));

    const topUniqueImporters = Array.from(buyerStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([importer, count]) => ({ importer, count }));



    // Calculate monthly statistics from the complete dataset
    const monthlyStats = calculateMonthlyStats(allMatchingRecords);

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
