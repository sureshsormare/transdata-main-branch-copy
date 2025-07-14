import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ExecutiveSummarySection from "./sections/ExecutiveSummarySection"
import { ExportData, formatLargeNumber } from "./SearchResultsClient"

interface SearchResultsSummarySectionProps {
  q: string
  selectedImportCountry: string
  selectedExportCountry: string
  selectedExporter: string
  selectedImporter: string
  formatCurrency: (value: string | number | null | undefined) => string
}

export default function SearchResultsSummarySection({
  q,
  selectedImportCountry,
  selectedExportCountry,
  selectedExporter,
  selectedImporter,
  formatCurrency
}: SearchResultsSummarySectionProps) {
  const [results, setResults] = useState<ExportData[]>([])
  const [aggregates, setAggregates] = useState({
    totalRecords: 0,
    uniqueBuyers: 0,
    uniqueSuppliers: 0,
    totalValueUSD: 0,
  })
  const [countryStats, setCountryStats] = useState({
    topImportCountries: [] as Array<{ country: string; count: number }>,
    topExportCountries: [] as Array<{ country: string; count: number }>,
    topUniqueExporters: [] as Array<{ exporter: string; count: number; value: number }>,
    topUniqueImporters: [] as Array<{ importer: string; count: number; value: number }>,
  })
  const [monthlyStats, setMonthlyStats] = useState<Array<{ month: string; value: number; count: number }>>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    const params = new URLSearchParams()
    params.append('q', q)
    if (selectedImportCountry) params.append('importCountry', selectedImportCountry)
    if (selectedExportCountry) params.append('exportCountry', selectedExportCountry)
    if (selectedExporter) params.append('exporter', selectedExporter)
    if (selectedImporter) params.append('importer', selectedImporter)
    
    fetch(`/api/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.results && Array.isArray(data.results)) {
          // Sort by year descending (most recent first)
          const resultsArray = data.results.sort((a: ExportData, b: ExportData) => {
            const yearA = Number(a.year) || 0;
            const yearB = Number(b.year) || 0;
            return yearB - yearA;
          });
          setResults(resultsArray);
        } else {
          setResults([]);
        }
        
        setAggregates(data.aggregates || {
          totalRecords: 0,
          uniqueBuyers: 0,
          uniqueSuppliers: 0,
          totalValueUSD: 0,
        })
        setCountryStats(data.countryStats || {
          topImportCountries: [],
          topExportCountries: [],
          topUniqueExporters: [],
          topUniqueImporters: [],
        })
        setMonthlyStats(data.monthlyStats || [])
        setAnalytics(data.analytics || null)
      })
      .catch(error => {
        console.error('Error fetching results:', error);
      })
      .finally(() => setLoading(false))
  }, [q, selectedImportCountry, selectedExportCountry, selectedExporter, selectedImporter])

  // Generate dynamic summary based on API analytics data
  const generateSummary = (): {
    totalRecords: number;
    recentYear: string;
    oldestYear: string;
    yearSpan: number;
    totalValue: number;
    avgValue: number;
    topImportCountry: { country: string; count: number } | undefined;
    topExportCountry: { country: string; count: number } | undefined;
    uniqueProducts: number;
    searchTerm: string;
    dateRange: string;
    supplierConcentration: number;
    buyerConcentration: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    priceVolatility: number;
    marketGrowth: number;
    topSuppliers: Array<{ name: string; count: number; value: number }>;
    topBuyers: Array<{ name: string; count: number; value: number }>;
    priceDistribution: Array<{ range: string; count: number; percentage: number }>;
    monthlyTrends: Array<{ month: string; count: number; value: number; trend: 'up' | 'down' | 'stable' }>;
    marketShare: { top5Countries: Array<{ country: string; share: number }> };
    competitiveAnalysis: {
      supplierDiversity: number;
      buyerDiversity: number;
      marketConcentration: number;
      priceCompetitiveness: number;
    };
    tradeRoutes: Array<{ origin: string; destination: string; count: number; value: number; frequency: number }>;
    productCategories: Array<{ category: string; count: number; value: number; percentage: number }>;
    shipmentModes: Array<{ mode: string; count: number; value: number; percentage: number }>;
    portAnalysis: Array<{ port: string; count: number; value: number; type: 'origin' | 'destination' }>;
    marketIntelligence: {
      marketSize: number;
      marketGrowth: number;
      marketMaturity: string;
      entryBarriers: string;
      competitiveIntensity: number;
      profitPotential: number;
    };
    riskAssessment: {
      supplyChainRisk: number;
      regulatoryRisk: number;
      marketRisk: number;
      currencyRisk: number;
      overallRisk: string;
    };
    opportunities: Array<{ type: string; description: string; potential: number; confidence: number }>;
  } | null => {
    if (!aggregates.totalRecords) return null;

    const totalValue = aggregates.totalValueUSD;
    const avgValue = aggregates.totalRecords > 0 ? totalValue / aggregates.totalRecords : 0;

    const topImportCountry = countryStats.topImportCountries[0];
    const topExportCountry = countryStats.topExportCountries[0];

    const supplierConcentration = (aggregates.uniqueSuppliers / aggregates.totalRecords) * 100;
    const buyerConcentration = (aggregates.uniqueBuyers / aggregates.totalRecords) * 100;

    const avgPrice = analytics?.priceAnalysis?.avgPrice || 0;
    const minPrice = analytics?.priceAnalysis?.minPrice || 0;
    const maxPrice = analytics?.priceAnalysis?.maxPrice || 0;
    const priceVolatility = analytics?.priceAnalysis?.priceVolatility || 0;
    const priceDistribution = analytics?.priceAnalysis?.priceDistribution || [];

    const marketGrowth = analytics?.marketIntelligence?.marketGrowth || 0;

    const topSuppliers = countryStats.topUniqueExporters.map(item => ({
      name: item.exporter,
      count: item.count,
      value: item.value || 0
    }));

    const topBuyers = countryStats.topUniqueImporters.map(item => ({
      name: item.importer,
      count: item.count,
      value: item.value || 0
    }));

    const productTypes = results.map(r => r.product_description).filter(p => p && p !== "N/A");
    const uniqueProducts = [...new Set(productTypes)];

    const years = results.map(r => r.year).filter(y => y && y !== "N/A");
    const uniqueYears = [...new Set(years)].sort((a, b) => Number(b) - Number(a));
    const recentYear = uniqueYears[0] || '';
    const oldestYear = uniqueYears[uniqueYears.length - 1] || '';
    
    const formatDateRange = () => {
      return `${oldestYear} to ${recentYear}`;
    };

    const monthlyTrends = monthlyStats.map((monthData, index, array) => {
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (index > 0) {
        const prevData = array[index - 1];
        if (monthData.count > prevData.count) trend = 'up';
        else if (monthData.count < prevData.count) trend = 'down';
      }
      
      return {
        month: monthData.month,
        count: monthData.count,
        value: monthData.value,
        trend
      };
    });

    const top5Countries = analytics?.marketShare?.top5Countries || [];
    const competitiveAnalysis = analytics?.competitiveAnalysis || {
      supplierDiversity: 0,
      buyerDiversity: 0,
      marketConcentration: 0,
      priceCompetitiveness: 0
    };
    const tradeRoutes = analytics?.tradeRoutes || [];
    const productCategories = analytics?.productCategories || [];
    const shipmentModes = analytics?.shipmentModes || [];
    const portAnalysis = analytics?.portAnalysis || [];
    const marketIntelligence = analytics?.marketIntelligence || {
      marketSize: totalValue,
      marketGrowth: 0,
      marketMaturity: 'Growing',
      entryBarriers: 'Medium',
      competitiveIntensity: 50,
      profitPotential: 60
    };
    const riskAssessment = analytics?.riskAssessment || {
      supplyChainRisk: 30,
      regulatoryRisk: 25,
      marketRisk: 35,
      currencyRisk: 20,
      overallRisk: 'Medium'
    };
    const opportunities = analytics?.opportunities || [
      {
        type: 'Market Entry',
        description: 'Opportunity to enter growing market segment',
        potential: 75,
        confidence: 80
      },
      {
        type: 'Supplier Diversification',
        description: 'Expand supplier base for better pricing',
        potential: 65,
        confidence: 70
      }
    ];

    return {
      totalRecords: aggregates.totalRecords,
      recentYear,
      oldestYear,
      yearSpan: uniqueYears.length,
      totalValue,
      avgValue,
      topImportCountry,
      topExportCountry,
      uniqueProducts: uniqueProducts.length,
      searchTerm: q,
      dateRange: formatDateRange(),
      supplierConcentration,
      buyerConcentration,
      avgPrice,
      minPrice,
      maxPrice,
      priceVolatility,
      marketGrowth,
      topSuppliers,
      topBuyers,
      priceDistribution,
      monthlyTrends,
      marketShare: { top5Countries },
      competitiveAnalysis,
      tradeRoutes,
      productCategories,
      shipmentModes,
      portAnalysis,
      marketIntelligence,
      riskAssessment,
      opportunities
    };
  };

  const summary = generateSummary();

  return (
    <div>
      <ExecutiveSummarySection
        summary={summary}
        aggregates={aggregates}
        countryStats={countryStats}
        monthlyStats={monthlyStats}
        q={q}
        formatCurrency={formatCurrency}
        isVisible={!loading && results.length > 0}
      />
    </div>
  )
} 