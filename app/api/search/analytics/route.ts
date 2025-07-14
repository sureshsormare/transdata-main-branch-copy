// app/api/search/analytics/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    // Add filters if provided
    if (importCountry && importCountry.trim() !== "") {
      whereClause.country_of_destination = importCountry;
    }
    if (exportCountry && exportCountry.trim() !== "") {
      whereClause.country_of_origin = exportCountry;
    }
    if (exporter && exporter.trim() !== "") {
      whereClause.supplier_name = exporter;
    }
    if (importer && importer.trim() !== "") {
      whereClause.buyer_name = importer;
    }

    // Get all matching records for analytics
    const allMatchingRecords = await prisma.exp_india.findMany({
      where: whereClause,
      select: {
        buyer_name: true,
        supplier_name: true,
        country_of_destination: true,
        country_of_origin: true,
        total_value_usd: true,
        shipping_bill_date: true,
        unit_rate_usd: true,
        port_of_origin: true,
        port_of_destination: true,
        mode: true,
        year: true,
        month: true,
      },
    });

    // Check what years are available in the database for this product
    const yearStats = await prisma.exp_india.groupBy({
      by: ['year'],
      where: whereClause,
      _count: {
        year: true
      },
      orderBy: {
        year: 'desc'
      }
    });

    console.log('Available years in database for this product:', yearStats);

    // Check for the most recent dates in the entire database
    const mostRecentRecords = await prisma.exp_india.findMany({
      where: {
        shipping_bill_date: {
          not: null
        }
      },
      select: {
        shipping_bill_date: true,
        product_description: true
      },
      orderBy: {
        shipping_bill_date: 'desc'
      },
      take: 10
    });

    console.log('Most recent records in exp_india database:', mostRecentRecords);

    // Check for the most recent dates in imp_india database
    const mostRecentImportRecords = await prisma.imp_india.findMany({
      where: {
        shipping_bill_date: {
          not: null
        }
      },
      select: {
        shipping_bill_date: true,
        product_description: true
      },
      orderBy: {
        shipping_bill_date: 'desc'
      },
      take: 10
    });

    console.log('Most recent records in imp_india database:', mostRecentImportRecords);

    // Check if Paracetamol exists in imp_india table
    const paracetamolInImports = await prisma.imp_india.findMany({
      where: {
        product_description: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        shipping_bill_date: true,
        product_description: true
      },
      orderBy: {
        shipping_bill_date: 'desc'
      },
      take: 5
    });

    console.log('Paracetamol records in imp_india table:', paracetamolInImports);

    // Debug: Log sample records to see date format
    if (allMatchingRecords.length > 0) {
      console.log('Sample records debug:', {
        totalRecords: allMatchingRecords.length,
        sampleShippingDates: allMatchingRecords.slice(0, 3).map(r => r.shipping_bill_date),
        sampleYears: allMatchingRecords.slice(0, 3).map(r => r.year),
        sampleMonths: allMatchingRecords.slice(0, 3).map(r => r.month)
      });
      
      // Check for 2025 data specifically
      const records2025 = allMatchingRecords.filter(r => {
        const dateStr = r.shipping_bill_date;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date.getFullYear() === 2025;
      });
      
      console.log('2025 data check:', {
        records2025Count: records2025.length,
        sample2025Dates: records2025.slice(0, 3).map(r => r.shipping_bill_date)
      });
    }

    // Calculate aggregates
    const totalRecords = allMatchingRecords.length;
    const uniqueBuyers = new Set(
      allMatchingRecords
        .map(record => record.buyer_name)
        .filter((name): name is string => name !== null && name.trim() !== '')
    );
    const uniqueSuppliers = new Set(
      allMatchingRecords
        .map(record => record.supplier_name)
        .filter((name): name is string => name !== null && name.trim() !== '')
    );
    const totalValueUSD = allMatchingRecords
      .map(record => record.total_value_usd)
      .filter((value): value is string => value !== null && !isNaN(parseFloat(value)))
      .reduce((sum, value) => sum + parseFloat(value), 0);

    // Calculate date range from shipping_bill_date with improved date parsing
    const validDates = allMatchingRecords
      .map(record => {
        const dateStr = record.shipping_bill_date;
        if (!dateStr || dateStr.trim() === '') return null;
        
        // Try different date parsing approaches
        let parsedDate = new Date(dateStr);
        
        // If the date is invalid, try parsing with different formats
        if (isNaN(parsedDate.getTime())) {
          // Try parsing as YYYY-MM-DD format
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            parsedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          }
        }
        
        return parsedDate;
      })
      .filter((date): date is Date => date !== null && !isNaN(date.getTime()));

    // Debug: Log the date range found
    console.log('Date processing debug:', {
      totalRecords: allMatchingRecords.length,
      validDatesCount: validDates.length,
      sampleDates: validDates.slice(0, 5).map(d => d.toISOString()),
      minDate: validDates.length > 0 ? new Date(Math.min(...validDates.map(d => d.getTime()))).toISOString() : 'none',
      maxDate: validDates.length > 0 ? new Date(Math.max(...validDates.map(d => d.getTime()))).toISOString() : 'none'
    });

    let dateRange = null;
    if (validDates.length > 0) {
      const minDate = new Date(Math.min(...validDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...validDates.map(d => d.getTime())));
      
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const formatDate = (date: Date) => {
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${year}`;
      };

      dateRange = {
        start: formatDate(minDate),
        end: formatDate(maxDate),
        startDate: minDate,
        endDate: maxDate
      };
    }

    // Calculate country statistics
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

    // Calculate country statistics with values
    const importCountryStatsWithValues = new Map<string, { count: number; value: number }>();
    const exportCountryStatsWithValues = new Map<string, { count: number; value: number }>();

    allMatchingRecords.forEach(record => {
      const value = parseFloat(record.total_value_usd || "0");
      
      if (record.country_of_destination) {
        const current = importCountryStatsWithValues.get(record.country_of_destination) || { count: 0, value: 0 };
        importCountryStatsWithValues.set(record.country_of_destination, {
          count: current.count + 1,
          value: current.value + value
        });
      }
      if (record.country_of_origin) {
        const current = exportCountryStatsWithValues.get(record.country_of_origin) || { count: 0, value: 0 };
        exportCountryStatsWithValues.set(record.country_of_origin, {
          count: current.count + 1,
          value: current.value + value
        });
      }
    });

    const topImportCountries = Array.from(importCountryStatsWithValues.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([country, stats]) => ({ country, count: stats.count, value: stats.value }));

    const topExportCountries = Array.from(exportCountryStatsWithValues.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([country, stats]) => ({ country, count: stats.count, value: stats.value }));

    // Calculate supplier and buyer statistics
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
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([exporter, stats]) => ({ exporter, count: stats.count, value: stats.value }));

    const topUniqueImporters = Array.from(buyerStats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([importer, stats]) => ({ importer, count: stats.count, value: stats.value }));

    // Calculate monthly statistics with improved date parsing
    const monthlyGroups = new Map<string, any[]>();
    
    allMatchingRecords.forEach(record => {
      const dateStr = record.shipping_bill_date;
      if (!dateStr || dateStr.trim() === '') return;
      
      // Try different date parsing approaches
      let recordDate = new Date(dateStr);
      
      // If the date is invalid, try parsing with different formats
      if (isNaN(recordDate.getTime())) {
        // Try parsing as YYYY-MM-DD format
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          recordDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
      }
      
      if (isNaN(recordDate.getTime())) return;
      
      const year = recordDate.getFullYear();
      const month = recordDate.getMonth();
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!monthlyGroups.has(key)) {
        monthlyGroups.set(key, []);
      }
      monthlyGroups.get(key)!.push(record);
    });

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const sortedKeys = Array.from(monthlyGroups.keys()).sort();
    // Use all available months instead of just the last 12
    const allKeys = sortedKeys;
    
    // Debug: Log the monthly keys found
    console.log('Monthly statistics debug:', {
      totalMonthlyGroups: monthlyGroups.size,
      sortedKeys: sortedKeys,
      allKeys: allKeys,
      sampleKeys: allKeys.slice(0, 5)
    });
    
    const monthlyStats = allKeys.map(key => {
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
        month: `${monthName} ${year}`,
        value: totalValue,
        count
      };
    });

    return NextResponse.json({
      aggregates: {
        totalRecords,
        uniqueBuyers: uniqueBuyers.size,
        uniqueSuppliers: uniqueSuppliers.size,
        totalValueUSD,
        dateRange,
      },
      countryStats: {
        topImportCountries,
        topExportCountries,
        topUniqueExporters,
        topUniqueImporters,
      },
      monthlyStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: "Failed to calculate analytics" },
      { status: 500 }
    );
  }
} 