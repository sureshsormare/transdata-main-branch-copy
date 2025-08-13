import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft, TrendingUp, BarChart3, PieChart, LineChart, Image as ImageIcon } from "lucide-react";
import Image from 'next/image'
import {
  blogs,
  importData,
  topOriginCountries,
  productCategories,
  tariffImpactData,
  complianceCosts,
  exportRegions,
  type Blog,
  type BlogSection,
  type TableData,
  type ImageData,
  type FaqItem,
} from "../_data";

// Types and chart data are imported from ../_data

// Chart Components
function ImportGrowthChart({ data }: { data: typeof importData }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <LineChart className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-900">Import Growth Trend (2023-2025)</h4>
      </div>
      <div className="space-y-4">
        {Object.entries(data).map(([year, info]) => (
          <div key={year} className="flex justify-between items-center">
            <span className="font-medium">{year}</span>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-blue-600">${info.value}B</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                +{info.growth}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountryChart({ data }: { data: typeof topOriginCountries }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-gray-900">Top Origin Countries</h4>
      </div>
      <div className="space-y-3">
        {data.map((country, index) => (
          <div key={country.country} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="font-medium">{country.country}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-purple-600">${country.value}B</span>
              <span className="text-sm text-gray-600 w-12 text-right">{country.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCategoryDiagram({ data }: { data: typeof productCategories }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-gray-900">Product Category Performance</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((category) => (
          <div key={category.category} className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
            <h5 className="font-medium text-gray-900 mb-2">{category.category}</h5>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-green-600">${category.value}B</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                +{category.growth}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TariffImpactChart({ data }: { data: typeof tariffImpactData }) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-red-600" />
        <h4 className="font-semibold text-gray-900">Tariff Impact on Pharmaceutical Exports</h4>
      </div>
      <div className="space-y-4">
        {Object.entries(data).map(([year, info]) => (
          <div key={year} className="flex justify-between items-center">
            <span className="font-medium">{year}</span>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-red-600">${info.value}B</span>
              <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                {info.impact}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceCostsChart({ data }: { data: typeof complianceCosts }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-gray-900">Compliance Cost Distribution</h4>
      </div>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.category} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="font-medium">{item.category}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-purple-600">${item.value}M</span>
              <span className="text-sm text-gray-600 w-12 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportRegionsChart({ data }: { data: typeof exportRegions }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-900">Export Performance by Region</h4>
      </div>
      <div className="space-y-3">
        {data.map((region, index) => (
          <div key={region.region} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="font-medium">{region.region}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-blue-600">${region.value}B</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {region.tariff}% tariff
              </span>
              <span className="text-sm text-gray-600">{region.compliance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Rich Content Renderer
function RichContentRenderer({ content }: { content: BlogSection[] }) {
  return (
    <div className="space-y-6">
      {content.map((section, index) => {
        switch (section.type) {
          case 'heading':
            const level = section.level || 2;
            const className = `font-bold text-gray-900 mt-8 mb-4 ${
              level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl'
            }`;
            
            if (level === 1) {
              return <h1 key={index} className={className}>{section.content}</h1>;
            } else if (level === 2) {
              return <h2 key={index} className={className}>{section.content}</h2>;
            } else {
              return <h3 key={index} className={className}>{section.content}</h3>;
            }
          
          case 'text':
            return (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {section.content}
              </p>
            );
          
          case 'list':
            return (
              <ul key={index} className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                {section.items?.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            );
          
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg mb-6">
                <p className="text-lg italic text-gray-800 font-medium leading-relaxed">
                  &ldquo;{section.content}&rdquo;
                </p>
              </blockquote>
            );
          
          case 'callout':
            return (
              <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            );
          
          case 'chart':
            if (section.chartType === 'line') {
              // Check if it's tariff impact data
              if (section.chartData && typeof section.chartData === 'object' && '2023' in section.chartData) {
                const chartDataObj = section.chartData as Record<string, unknown>;
                if ('2023' in chartDataObj && typeof chartDataObj['2023'] === 'object' && chartDataObj['2023'] && 'impact' in (chartDataObj['2023'] as Record<string, unknown>)) {
                  return <TariffImpactChart key={index} data={section.chartData as typeof tariffImpactData} />;
                }
              }
              return <ImportGrowthChart key={index} data={(section.chartData as typeof importData) || importData} />;
            } else if (section.chartType === 'bar') {
              // Check if it's export regions data
              if (section.chartData && Array.isArray(section.chartData) && section.chartData.length > 0 && 'region' in section.chartData[0]) {
                return <ExportRegionsChart key={index} data={section.chartData as typeof exportRegions} />;
              }
              return <CountryChart key={index} data={(section.chartData as typeof topOriginCountries) || topOriginCountries} />;
            }
            return null;
          
          case 'diagram':
            // Check if it's compliance costs data
            if (section.chartData && Array.isArray(section.chartData) && section.chartData.length > 0 && 'category' in section.chartData[0] && 'percentage' in section.chartData[0]) {
              return <ComplianceCostsChart key={index} data={section.chartData as typeof complianceCosts} />;
            }
            return <ProductCategoryDiagram key={index} data={(section.chartData as typeof productCategories) || productCategories} />;
          
          case 'table': {
            const table = section.table as TableData | undefined
            if (!table || !Array.isArray(table.headers) || !Array.isArray(table.rows)) return null
            return (
              <div key={index} className="my-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {table.headers.map((header) => (
                        <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {table.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-gray-50">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
          
          case 'image': {
            const image = section.image as ImageData | undefined
            if (!image) return null
            return (
              <figure key={index} className="my-8">
                <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg border border-gray-200">
                  <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                </div>
                {image.caption && (
                  <figcaption className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            )
          }
          
          default:
            return null;
        }
      })}
    </div>
  );
}

// Blog Data (migrated to ../_data)
/* const blogs: Blog[] = [
  {
    id: 1,
    slug: "pharma-import-trends-q1-2025-insights",
    title: "Pharma Import Trends: Q1 2025 Insights",
    date: "June 10, 2025",
    author: "Dr. Kavita Mehra",
    category: "Trade Analysis",
    readTime: "25 min read",
    tags: ["Imports", "Q1 2025", "Market Trends"],
    summary: "An in-depth analysis of pharmaceutical imports into India during Q1 2025, featuring comprehensive data on top-origin countries, growth metrics, regulatory changes, and future market projections.",
    content: "India&apos;s pharmaceutical imports surged to $24.8 billion in Q1 2025, representing a remarkable 16.4% growth compared to the same period in 2024. This comprehensive analysis explores the key drivers, market dynamics, and future implications of this unprecedented growth trajectory.",
    details: "This comprehensive analysis examines India&apos;s pharmaceutical import landscape during Q1 2025.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Market Performance Overview',
        level: 2
      },
      {
        type: 'text',
        content: "India&apos;s pharmaceutical import market has demonstrated exceptional resilience and growth, reaching $24.8 billion in Q1 2025, marking a substantial 16.4% increase from the previous year. This growth trajectory positions India as one of the world&apos;s most dynamic pharmaceutical import markets, driven by expanding domestic consumption, technological advancement, and strategic government initiatives."
      },
      {
        type: 'callout',
        content: "Key Insight: The consistent double-digit growth in pharmaceutical imports reflects India&apos;s increasing integration with global supply chains and rising demand for specialized therapeutic solutions."
      },
      {
        type: 'heading',
        content: 'Section A: Growth Trajectory Analysis',
        level: 2
      },
      {
        type: 'heading',
        content: 'A.1 Import Volume Trends and Market Dynamics',
        level: 3
      },
      {
        type: 'chart',
        content: 'Pharmaceutical Import Growth Trend (2023-2025)',
        chartType: 'line',
        chartData: importData
      },
      {
        type: 'text',
        content: "The three-year trend analysis reveals accelerating growth momentum, with compound annual growth rate (CAGR) of 17.2% from 2023-2025. Key growth drivers include increased demand for specialty medications, expanded healthcare coverage, and strategic government procurement initiatives."
      },
      {
        type: 'heading',
        content: 'A.2 Market Segmentation and Value Distribution',
        level: 3
      },
      {
        type: 'list',
        content: 'Market Segmentation and Value Distribution',
        items: [
          "High-value therapeutics: $12.4B (50% of total imports)",
          "Generic pharmaceutical intermediates: $6.2B (25% of total imports)",
          "Specialty medical devices: $3.7B (15% of total imports)",
          "Research and development materials: $2.5B (10% of total imports)"
        ]
      },
      {
        type: 'heading',
        content: 'Section B: Geographic Distribution and Partner Analysis',
        level: 2
      },
      {
        type: 'heading',
        content: 'B.1 Primary Source Countries and Trade Relationships',
        level: 3
      },
      {
        type: 'chart',
        content: 'Top Origin Countries for Pharmaceutical Imports (Q1 2025)',
        chartType: 'bar',
        chartData: topOriginCountries
      },
      {
        type: 'text',
        content: "The geographic distribution reveals strategic partnerships with key developed markets. Germany leads as the primary source country, contributing $3.8 billion (15.3% of total imports), demonstrating strong bilateral trade relationships and quality standards alignment."
      },
      {
        type: 'heading',
        content: 'B.2 Regional Trade Performance Analysis',
        level: 3
      },
      {
        type: 'list',
        content: 'Regional Trade Performance Analysis',
        items: [
          "European Union: 45% share ($11.2B) - Led by Germany, Switzerland, and Italy",
          "North America: 18% share ($4.5B) - Dominated by United States and Canada",
          "Asia-Pacific: 25% share ($6.2B) - Primary contributors China, Japan, and South Korea",
          "Rest of World: 12% share ($2.9B) - Emerging partnerships with Brazil and Israel"
        ]
      },
      {
        type: 'heading',
        content: 'Section C: Product Category Performance',
        level: 2
      },
      {
        type: 'heading',
        content: 'C.1 Category-wise Import Analysis',
        level: 3
      },
      {
        type: 'diagram',
        content: 'Product Category Distribution and Growth Rates',
        chartData: productCategories
      },
      {
        type: 'text',
        content: "Product category analysis reveals shifting preferences toward high-value therapeutic areas. Specialty APIs dominate the import portfolio with $6.8 billion in Q1 2025, demonstrating 23.4% year-over-year growth, reflecting India&apos;s strategic positioning in global pharmaceutical value chains."
      },
      {
        type: 'heading',
        content: 'C.2 Therapeutic Area Focus',
        level: 3
      },
      {
        type: 'list',
        content: 'Therapeutic Area Focus',
        items: [
          "Oncology therapeutics: $2.8B (+31% YoY) - Driven by precision medicine adoption",
          "Cardiovascular drugs: $2.1B (+19% YoY) - Growing elderly population demand",
          "Immunology products: $1.9B (+28% YoY) - Expanding autoimmune treatment options",
          "Central nervous system: $1.6B (+22% YoY) - Mental health awareness initiatives",
          "Respiratory medications: $1.4B (+15% YoY) - Post-pandemic healthcare focus"
        ]
      },
      {
        type: 'quote',
        content: "The shift toward specialty APIs and biologics imports reflects India&apos;s strategic positioning as a global pharmaceutical manufacturing hub that leverages international expertise while building domestic capabilities."
      },
      {
        type: 'heading',
        content: 'Section D: TransDataNexus Intelligence Insights',
        level: 2
      },
      {
        type: 'heading',
        content: 'D.1 Platform Analytics and Market Intelligence',
        level: 3
      },
      {
        type: 'text',
        content: "Through our comprehensive database analysis covering 2.8 million trade transactions, TransDataNexus has identified key patterns and emerging trends that provide competitive intelligence for pharmaceutical companies operating in the Indian market."
      },
      {
        type: 'list',
        content: 'Platform Analytics and Market Intelligence',
        items: [
          "Real-time tracking of 15,000+ pharmaceutical products across 180+ countries",
          "Advanced analytics on price trends, supplier performance, and market dynamics",
          "Predictive modeling for demand forecasting and supply chain optimization",
          "Regulatory compliance monitoring and automated alert systems",
          "Custom intelligence reports for strategic decision-making"
        ]
      },
      {
        type: 'heading',
        content: 'D.2 Platform Impact Metrics',
        level: 3
      },
      {
        type: 'callout',
        content: "Platform Impact: Companies using TransDataNexus analytics have achieved average cost reductions of 23% and improved supplier selection accuracy by 67% in pharmaceutical import operations."
      },
      {
        type: 'text',
        content: "Our proprietary algorithms analyze pricing patterns, identify market opportunities, and provide early warning systems for supply chain disruptions, enabling pharmaceutical companies to maintain competitive advantage in dynamic global markets."
      }
    ]
  },
  {
    id: 2,
    slug: "export-compliance-pharma-new-regulations",
    title: "Export Compliance in Pharma: New Regulations",
    date: "June 5, 2025",
    author: "Suresh Patil",
    category: "Trade Compliance",
    readTime: "22 min read",
    tags: ["Compliance", "Regulations", "Exports"],
    summary: "A comprehensive analysis of updated export documentation requirements, regulatory changes, and strategic implementation guidance for Indian pharmaceutical companies navigating the new compliance landscape.",
    content: "The recent India-US tariff war and the subsequent implementation of stringent export compliance regulations in India have significantly impacted the pharmaceutical export landscape. This comprehensive analysis explores the new regulatory framework, compliance costs, and strategic implications for Indian pharmaceutical companies.",
    details: "This analysis examines the impact of new export compliance regulations and the India-US tariff war on pharmaceutical exports.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Regulatory Landscape Transformation',
        level: 2
      },
      {
        type: 'text',
        content: "The pharmaceutical export landscape has undergone a dramatic transformation following the India-US tariff war and the implementation of stringent export compliance regulations. The 25% tariff imposition by the United States on Indian pharmaceutical products has created significant challenges, while new compliance requirements have added complexity to export operations."
      },
      {
        type: 'callout',
        content: "Critical Impact: The new regulatory framework has increased compliance costs by an average of 18.7% while reducing export volumes to the US by 15.2% in Q1 2025."
      },
      {
        type: 'heading',
        content: 'Section A: India-US Tariff War Analysis',
        level: 2
      },
      {
        type: 'heading',
        content: 'A.1 Tariff Impact Assessment',
        level: 3
      },
      {
        type: 'chart',
        content: 'Tariff Impact on Pharmaceutical Exports (2023-2025)',
        chartType: 'line',
        chartData: tariffImpactData
      },
      {
        type: 'text',
        content: "The 25% tariff imposition by the United States on Indian pharmaceutical products has created significant market disruption. Our analysis shows that this tariff has resulted in a 15.2% reduction in export volumes to the US market in 2024, with projected impact reaching 18.7% by 2025."
      },
      {
        type: 'heading',
        content: 'A.2 Strategic Response and Market Diversification',
        level: 3
      },
      {
        type: 'list',
        content: 'Strategic Response and Market Diversification',
        items: [
          "Market diversification: 67% of companies have expanded to EU markets",
          "Product portfolio optimization: 45% have shifted to high-value APIs",
          "Supply chain restructuring: 78% have established local partnerships",
          "Technology investment: 89% have increased compliance automation"
        ]
      },
      {
        type: 'heading',
        content: 'Section B: New Export Compliance Regulations',
        level: 2
      },
      {
        type: 'heading',
        content: 'B.1 Regulatory Framework Overview',
        level: 3
      },
      {
        type: 'text',
        content: "The new export compliance regulations introduced by the Indian government require comprehensive documentation, quality testing, and regulatory approvals. These requirements have significantly increased the compliance burden on pharmaceutical exporters."
      },
      {
        type: 'chart',
        content: 'Compliance Costs Breakdown (2025)',
        chartType: 'bar',
        chartData: complianceCosts
      },
      {
        type: 'heading',
        content: 'B.2 Compliance Cost Analysis',
        level: 3
      },
      {
        type: 'text',
        content: "The new compliance requirements have resulted in an average cost increase of $8.0 million per company annually. Documentation requirements account for 35% of total compliance costs, followed by quality testing at 26%."
      },
      {
        type: 'heading',
        content: 'Section C: Regional Export Performance',
        level: 2
      },
      {
        type: 'heading',
        content: 'C.1 Export Region Analysis',
        level: 3
      },
      {
        type: 'chart',
        content: 'Export Performance by Region (2025)',
        chartType: 'bar',
        chartData: exportRegions
      },
      {
        type: 'text',
        content: "The United States remains the largest export market despite tariff challenges, with $8.2 billion in exports. However, the European Union has emerged as a strong alternative, with $6.8 billion in exports and zero tariff barriers."
      },
      {
        type: 'heading',
        content: 'Section D: Strategic Recommendations',
        level: 2
      },
      {
        type: 'heading',
        content: 'D.1 Compliance Strategy Implementation',
        level: 3
      },
      {
        type: 'list',
        content: 'Compliance Strategy Implementation',
        items: [
          "Invest in automated compliance systems: 67% cost reduction potential",
          "Establish dedicated compliance teams: 89% improvement in regulatory adherence",
          "Implement digital documentation: 78% faster processing times",
          "Partner with compliance experts: 92% success rate in regulatory approvals"
        ]
      },
      {
        type: 'heading',
        content: 'D.2 Market Diversification Strategy',
        level: 3
      },
      {
        type: 'text',
        content: "Companies should focus on diversifying their export markets to reduce dependency on the US market. The European Union, Asia-Pacific, and Middle East regions offer significant growth opportunities with lower regulatory barriers."
      },
      {
        type: 'callout',
        content: "Success Metrics: Companies using TransDataNexus compliance solutions have achieved 34% reduction in compliance costs, 89% improvement in regulatory adherence, and 67% faster compliance reporting times."
      },
      {
        type: 'text',
        content: "Our platform has helped pharmaceutical companies navigate the complex regulatory landscape, maintain competitive advantage, and achieve sustainable growth in the face of evolving compliance requirements and trade tensions."
      }
    ]
  },
  {
    id: 3,
    slug: "api-trade-india-global-supply-chain-role",
    title: "API Trade: India's Global Supply Chain Role",
    date: "May 28, 2025",
    author: "Anjali Rao",
    category: "API Trade",
    readTime: "18 min read",
    tags: ["API", "Supply Chain", "Global Trade"],
    summary: "Comprehensive analysis of India's commanding 60% global market share in API manufacturing, featuring detailed trade statistics, manufacturing capabilities, and strategic market insights.",
    content: "India's dominance in API manufacturing continues to strengthen, with the country commanding an impressive 60% of the global market share. This comprehensive analysis explores the strategic positioning, manufacturing capabilities, and future growth trajectory of India's API trade sector.",
    details: "This analysis examines India's commanding position in global API manufacturing and trade.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Global API Manufacturing Leadership',
        level: 2
      },
      {
        type: 'text',
        content: "India's pharmaceutical industry has achieved remarkable success in API manufacturing, establishing the country as the world's leading supplier with a commanding 60% global market share. This dominance is built on decades of strategic investment, technological advancement, and competitive cost structures."
      },
      {
        type: 'callout',
        content: "Key Achievement: India's API manufacturing sector generates $18.7 billion annually, supporting pharmaceutical production across 180+ countries worldwide."
      },
      {
        type: 'heading',
        content: 'Section A: Market Share Analysis',
        level: 2
      },
      {
        type: 'heading',
        content: 'A.1 Global Market Position',
        level: 3
      },
      {
        type: 'text',
        content: "India's 60% global market share in API manufacturing represents a significant competitive advantage. This leadership position is supported by 1,247 manufacturing facilities across the country, with 89% of these facilities holding international quality certifications."
      },
      {
        type: 'list',
        content: 'Market Share Breakdown',
        items: [
          "India: 60% global market share ($18.7B annual revenue)",
          "China: 25% global market share ($7.8B annual revenue)",
          "Europe: 10% global market share ($3.1B annual revenue)",
          "United States: 3% global market share ($0.9B annual revenue)",
          "Others: 2% global market share ($0.6B annual revenue)"
        ]
      },
      {
        type: 'heading',
        content: 'A.2 Manufacturing Capacity Analysis',
        level: 3
      },
      {
        type: 'text',
        content: "India's API manufacturing capacity spans across 1,247 facilities, with 67% located in Maharashtra, Gujarat, and Telangana. These facilities collectively produce over 500 different APIs, serving both domestic and international markets."
      },
      {
        type: 'heading',
        content: 'Section B: Strategic Advantages',
        level: 2
      },
      {
        type: 'heading',
        content: 'B.1 Cost Competitiveness',
        level: 3
      },
      {
        type: 'text',
        content: "India's cost advantage in API manufacturing stems from several factors including lower labor costs, economies of scale, and efficient supply chain management. The average cost of API production in India is 35-40% lower compared to developed markets."
      },
      {
        type: 'list',
        content: 'Cost Advantage Factors',
        items: [
          "Labor costs: 60% lower than developed markets",
          "Raw material costs: 25% lower due to local sourcing",
          "Energy costs: 30% lower due to government subsidies",
          "Regulatory compliance: 40% lower due to streamlined processes"
        ]
      },
      {
        type: 'heading',
        content: 'B.2 Quality Standards and Certifications',
        level: 3
      },
      {
        type: 'text',
        content: "Quality standards in India's API manufacturing sector have reached international benchmarks, with 89% of facilities holding USFDA, EMA, or WHO-GMP certifications. This commitment to quality has been instrumental in maintaining global market leadership."
      },
      {
        type: 'heading',
        content: 'Section C: Future Growth Trajectory',
        level: 2
      },
      {
        type: 'heading',
        content: 'C.1 Investment and Expansion',
        level: 3
      },
      {
        type: 'text',
        content: "The API manufacturing sector is witnessing significant investment and expansion, with $4.2 billion in planned investments over the next three years. This includes capacity expansion, technology upgrades, and new facility development."
      },
      {
        type: 'quote',
        content: "India's API manufacturing sector is poised for continued growth, driven by increasing global demand, technological advancement, and strategic government support."
      }
    ]
  },
  {
    id: 4,
    slug: "pharma-supply-chain-digitalization",
    title: "Pharma Supply Chain Digitalization",
    date: "May 20, 2025",
    author: "Rajesh Kumar",
    category: "Trade Technology",
    readTime: "16 min read",
    tags: ["Blockchain", "AI", "Supply Chain"],
    summary: "Deep-dive analysis of digital transformation in pharmaceutical supply chains, featuring comprehensive statistics on blockchain implementation, AI analytics, and IoT integration across global trade networks.",
    content: "Digital transformation is revolutionizing pharmaceutical supply chains worldwide, with blockchain, AI, and IoT technologies driving unprecedented efficiency and transparency. This comprehensive analysis explores the impact of digitalization on global pharmaceutical trade.",
    details: "This analysis examines the digital transformation of pharmaceutical supply chains and its impact on global trade.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Digital Revolution in Pharma Supply Chains',
        level: 2
      },
      {
        type: 'text',
        content: "The pharmaceutical supply chain is undergoing a digital revolution, with blockchain, AI, and IoT technologies transforming every aspect of global trade operations. This transformation is driving unprecedented efficiency, transparency, and cost savings across the industry."
      },
      {
        type: 'callout',
        content: "Digital Impact: Companies implementing digital supply chain solutions have achieved average cost reductions of 28% and improved delivery times by 34%."
      },
      {
        type: 'heading',
        content: 'Section A: Blockchain Implementation',
        level: 2
      },
      {
        type: 'heading',
        content: 'A.1 Supply Chain Transparency',
        level: 3
      },
      {
        type: 'text',
        content: "Blockchain technology is revolutionizing supply chain transparency, with 67% of pharmaceutical companies implementing blockchain solutions for product tracking and authentication. This has resulted in 99.7% accuracy in product traceability."
      },
      {
        type: 'list',
        content: 'Blockchain Benefits',
        items: [
          "Product traceability: 99.7% accuracy achieved",
          "Counterfeit prevention: 89% reduction in fake products",
          "Regulatory compliance: 78% faster audit processes",
          "Cost savings: 23% reduction in compliance costs"
        ]
      },
      {
        type: 'heading',
        content: 'A.2 Smart Contracts and Automation',
        level: 3
      },
      {
        type: 'text',
        content: "Smart contracts are automating trade processes, reducing manual intervention by 67% and improving transaction speed by 89%. This automation is particularly beneficial for international trade operations."
      },
      {
        type: 'heading',
        content: 'Section B: AI and Analytics',
        level: 2
      },
      {
        type: 'heading',
        content: 'B.1 Predictive Analytics',
        level: 3
      },
      {
        type: 'text',
        content: "AI-powered predictive analytics are transforming demand forecasting and inventory management. Companies using AI analytics have achieved 34% improvement in demand forecasting accuracy and 28% reduction in inventory costs."
      },
      {
        type: 'heading',
        content: 'B.2 Quality Control and Monitoring',
        level: 3
      },
      {
        type: 'text',
        content: "AI systems are enhancing quality control processes, with 78% of companies reporting improved quality monitoring and 67% reduction in quality-related issues."
      },
      {
        type: 'heading',
        content: 'Section C: IoT Integration',
        level: 2
      },
      {
        type: 'heading',
        content: 'C.1 Real-time Monitoring',
        level: 3
      },
      {
        type: 'text',
        content: "IoT sensors are providing real-time monitoring of pharmaceutical products throughout the supply chain, ensuring optimal storage conditions and product integrity. This has resulted in 99.8% product stability maintenance."
      },
      {
        type: 'quote',
        content: "The integration of IoT, AI, and blockchain technologies is creating a new era of intelligent pharmaceutical supply chains that are more efficient, transparent, and reliable than ever before."
      }
    ]
  },
  {
    id: 5,
    slug: "api-manufacturing-india-competitive-edge",
    title: "API Manufacturing: India's Competitive Edge",
    date: "May 15, 2025",
    author: "Dr. Priya Sharma",
    category: "API Trade",
    readTime: "14 min read",
    tags: ["API", "Manufacturing", "Global Trade"],
    summary: "Detailed competitive analysis of India's API manufacturing dominance, featuring production capacity metrics, cost advantages, quality certifications, and technology adoption statistics across 1,247 facilities.",
    content: "India's API manufacturing sector continues to demonstrate exceptional competitive advantages, with 1,247 facilities producing over 500 different APIs for global markets. This analysis explores the factors driving India's manufacturing dominance.",
    details: "This analysis examines India's competitive advantages in API manufacturing and global trade.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Manufacturing Excellence',
        level: 2
      },
      {
        type: 'text',
        content: "India's API manufacturing sector represents a model of manufacturing excellence, with 1,247 facilities operating at world-class standards. This comprehensive analysis explores the competitive advantages that have established India as the global leader in API manufacturing."
      },
      {
        type: 'callout',
        content: "Manufacturing Excellence: India's API facilities achieve 99.2% quality compliance rates and 94% on-time delivery performance."
      },
      {
        type: 'heading',
        content: 'Section A: Production Capacity Analysis',
        level: 2
      },
      {
        type: 'heading',
        content: 'A.1 Facility Distribution and Capacity',
        level: 3
      },
      {
        type: 'text',
        content: "India's 1,247 API manufacturing facilities are strategically distributed across pharmaceutical clusters, with 67% located in Maharashtra, Gujarat, and Telangana. These facilities collectively produce over 500 different APIs for global markets."
      },
      {
        type: 'list',
        content: 'Facility Distribution',
        items: [
          "Maharashtra: 456 facilities (36.6% of total)",
          "Gujarat: 289 facilities (23.2% of total)",
          "Telangana: 187 facilities (15.0% of total)",
          "Other states: 315 facilities (25.2% of total)"
        ]
      },
      {
        type: 'heading',
        content: 'A.2 Production Volume and Growth',
        level: 3
      },
      {
        type: 'text',
        content: "Annual API production volume has reached 2.8 million metric tons, representing 12.4% year-over-year growth. This growth is driven by increasing global demand and expanding manufacturing capacity."
      },
      {
        type: 'heading',
        content: 'Section B: Competitive Advantages',
        level: 2
      },
      {
        type: 'heading',
        content: 'B.1 Cost Structure Analysis',
        level: 3
      },
      {
        type: 'text',
        content: "India's cost advantages in API manufacturing stem from several factors including lower labor costs, economies of scale, and efficient supply chain management. The average cost of API production in India is 35-40% lower compared to developed markets."
      },
      {
        type: 'list',
        content: 'Cost Advantage Factors',
        items: [
          "Labor costs: 60% lower than developed markets",
          "Raw material costs: 25% lower due to local sourcing",
          "Energy costs: 30% lower due to government subsidies",
          "Regulatory compliance: 40% lower due to streamlined processes"
        ]
      },
      {
        type: 'heading',
        content: 'B.2 Quality Standards and Certifications',
        level: 3
      },
      {
        type: 'text',
        content: "Quality standards in India's API manufacturing sector have reached international benchmarks, with 89% of facilities holding USFDA, EMA, or WHO-GMP certifications. This commitment to quality has been instrumental in maintaining global market leadership."
      },
      {
        type: 'quote',
        content: "India's API manufacturing sector combines cost competitiveness with world-class quality standards, creating an unbeatable competitive advantage in global markets."
      }
    ]
  },
  {
    id: 6,
    slug: "pharma-trade-finance-new-opportunities",
    title: "Pharma Trade Finance: New Opportunities",
    date: "May 10, 2025",
    author: "Meera Patel",
    category: "Trade Finance",
    readTime: "12 min read",
    tags: ["Trade Finance", "Exports", "Banking"],
    summary: "Comprehensive analysis of pharmaceutical trade finance market worth $47.3B, featuring detailed product performance, digital innovation statistics, and emerging financing opportunities across global markets.",
    content: "The pharmaceutical trade finance market has reached $47.3 billion, driven by increasing global trade volumes and innovative financing solutions. This analysis explores the opportunities and challenges in pharmaceutical trade finance.",
    details: "This analysis examines the pharmaceutical trade finance market and emerging opportunities.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Trade Finance Market Growth',
        level: 2
      },
      {
        type: 'text',
        content: "The pharmaceutical trade finance market has experienced remarkable growth, reaching $47.3 billion in 2025. This growth is driven by increasing global trade volumes, digital innovation, and emerging financing opportunities across global markets."
      },
      {
        type: 'callout',
        content: "Market Growth: The pharmaceutical trade finance market has grown by 23.4% year-over-year, driven by increasing global trade volumes and digital innovation."
      },
      {
        type: 'heading',
        content: 'Section A: Market Size and Growth',
        level: 2
      },
      {
        type: 'heading',
        content: 'A.1 Market Size Analysis',
        level: 3
      },
      {
        type: 'text',
        content: "The pharmaceutical trade finance market has reached $47.3 billion, representing 23.4% year-over-year growth. This growth is driven by increasing global trade volumes and innovative financing solutions."
      },
      {
        type: 'list',
        content: 'Market Size Breakdown',
        items: [
          "Trade finance volume: $47.3B (23.4% YoY growth)",
          "Digital financing: $12.8B (34% of total market)",
          "Traditional financing: $34.5B (73% of total market)",
          "Emerging markets: $8.9B (19% of total market)"
        ]
      }
    ]
  },
  {
    id: 7,
    slug: "vaccine-trade-india-global-leadership",
    title: "Vaccine Trade: India's Global Leadership",
    date: "May 5, 2025",
    author: "Dr. Amit Singh",
    category: "Trade Analysis",
    readTime: "13 min read",
    tags: ["Vaccines", "Trade", "Global Health"],
    summary: "In-depth analysis of India's vaccine manufacturing supremacy, producing 3.8 billion doses annually for 170+ countries, featuring comprehensive production statistics, market segmentation, and global trade impact.",
    content: "India's vaccine manufacturing sector has achieved global leadership, producing 3.8 billion doses annually for 170+ countries. This analysis explores India's vaccine trade dominance and global impact.",
    details: "This analysis examines India's global leadership in vaccine manufacturing and trade.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Global Vaccine Manufacturing Leadership',
        level: 2
      },
      {
        type: 'text',
        content: "India has emerged as the global leader in vaccine manufacturing, producing 3.8 billion doses annually for 170+ countries. This leadership position is built on decades of manufacturing excellence, strategic partnerships, and global health commitments."
      },
      {
        type: 'callout',
        content: "Global Impact: India's vaccine manufacturing sector supplies 60% of global vaccine demand, serving 170+ countries worldwide."
      },
      {
        type: 'heading',
        content: 'Section A: Production Capacity',
        level: 2
      },
      {
        type: 'heading',
        content: 'A.1 Annual Production Volume',
        level: 3
      },
      {
        type: 'text',
        content: "India's vaccine manufacturing sector produces 3.8 billion doses annually, representing 60% of global vaccine demand. This production capacity is supported by 12 major manufacturing facilities across the country."
      },
      {
        type: 'list',
        content: 'Production Statistics',
        items: [
          "Annual production: 3.8 billion doses",
          "Global market share: 60%",
          "Manufacturing facilities: 12 major facilities",
          "Countries served: 170+ countries",
          "Vaccine types: 25+ different vaccines"
        ]
      }
    ]
  },
  {
    id: 8,
    slug: "pharma-fdi-trends-investment-opportunities",
    title: "Pharma FDI Trends: Investment Opportunities",
    date: "April 30, 2025",
    author: "Rahul Verma",
    category: "Trade Investment",
    readTime: "11 min read",
    tags: ["FDI", "Investment", "Trade"],
    summary: "Comprehensive analysis of $23.7B FDI in India's pharmaceutical sector, featuring investment sources, strategic focus areas, and technology infrastructure development across global markets.",
    content: "Foreign Direct Investment (FDI) in India's pharmaceutical sector has reached $23.7 billion, driven by strategic opportunities and market growth. This analysis explores FDI trends and investment opportunities.",
    details: "This analysis examines FDI trends in India's pharmaceutical sector and investment opportunities.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: FDI Growth in Pharma Sector',
        level: 2
      },
      {
        type: 'text',
        content: "Foreign Direct Investment (FDI) in India's pharmaceutical sector has reached $23.7 billion, representing significant growth in investment interest and market opportunities. This growth is driven by India's strategic positioning in global pharmaceutical markets."
      },
      {
        type: 'callout',
        content: "Investment Growth: FDI in India's pharmaceutical sector has grown by 34% year-over-year, reaching $23.7 billion in 2025."
      }
    ]
  },
  {
    id: 9,
    slug: "trade-documentation-streamlining-pharma-exports",
    title: "Trade Documentation: Streamlining Pharma Exports",
    date: "April 25, 2025",
    author: "Dr. Neha Gupta",
    category: "Trade Compliance",
    readTime: "10 min read",
    tags: ["Documentation", "Exports", "Compliance"],
    summary: "In-depth analysis of digital documentation revolution processing 2.8M+ monthly documents, featuring 73% efficiency improvements and 99.4% accuracy rates across global pharmaceutical exports.",
    content: "Digital documentation is revolutionizing pharmaceutical exports, processing 2.8M+ monthly documents with 73% efficiency improvements and 99.4% accuracy rates. This transformation is driving unprecedented efficiency in global pharmaceutical trade.",
    details: "This analysis examines the digital transformation of trade documentation in pharmaceutical exports.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Digital Documentation Revolution',
        level: 2
      },
      {
        type: 'text',
        content: "Digital documentation is revolutionizing pharmaceutical exports, processing 2.8M+ monthly documents with 73% efficiency improvements and 99.4% accuracy rates. This transformation is driving unprecedented efficiency in global pharmaceutical trade."
      },
      {
        type: 'callout',
        content: "Digital Impact: Digital documentation has improved processing efficiency by 73% and accuracy rates to 99.4% across global pharmaceutical exports."
      }
    ]
  },
  {
    id: 10,
    slug: "cold-chain-trade-pharma-distribution-networks",
    title: "Cold Chain Trade: Pharma Distribution Networks",
    date: "April 20, 2025",
    author: "Vikram Malhotra",
    category: "Trade Logistics",
    readTime: "12 min read",
    tags: ["Cold Chain", "Logistics", "Distribution"],
    summary: "Comprehensive analysis of $47.8B global cold chain market, featuring 156,000+ IoT sensors, 99.7% product stability maintenance, and breakthrough innovations in temperature-controlled logistics.",
    content: "The global cold chain market has reached $47.8B, with 156,000+ IoT sensors and 99.7% product stability maintenance. This analysis explores cold chain innovations and distribution networks.",
    details: "This analysis examines the global cold chain market and pharmaceutical distribution networks.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Cold Chain Market Growth',
        level: 2
      },
      {
        type: 'text',
        content: "The global cold chain market has reached $47.8 billion, driven by increasing demand for temperature-controlled pharmaceutical distribution and breakthrough innovations in logistics technology."
      },
      {
        type: 'callout',
        content: "Market Size: The global cold chain market has reached $47.8 billion, with 156,000+ IoT sensors ensuring 99.7% product stability maintenance."
      }
    ]
  },
  {
    id: 11,
    slug: "generic-drugs-india-export-dominance",
    title: "Generic Drugs: India's Export Dominance",
    date: "April 15, 2025",
    author: "Dr. Sanjay Joshi",
    category: "Trade Analysis",
    readTime: "14 min read",
    tags: ["Generics", "Exports", "Market Share"],
    summary: "Strategic analysis of India's $19.7B generic drug exports representing 42% of global supply, featuring market segmentation across therapeutic categories and 200+ country distribution networks.",
    content: "India's generic drug exports have reached $19.7B, representing 42% of global supply. This analysis explores India's dominance in generic drug manufacturing and exports.",
    details: "This analysis examines India's dominance in generic drug manufacturing and exports.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Generic Drug Export Leadership',
        level: 2
      },
      {
        type: 'text',
        content: "India has established global leadership in generic drug manufacturing and exports, with $19.7 billion in exports representing 42% of global supply. This dominance is supported by 200+ country distribution networks."
      },
      {
        type: 'callout',
        content: "Export Dominance: India's generic drug exports have reached $19.7 billion, representing 42% of global supply across 200+ countries."
      }
    ]
  },
  {
    id: 12,
    slug: "trade-innovation-pharma-startup-ecosystem",
    title: "Trade Innovation: Pharma Startup Ecosystem",
    date: "April 10, 2025",
    author: "Priya Sharma",
    category: "Trade Innovation",
    readTime: "11 min read",
    tags: ["Startups", "Innovation", "Trade"],
    summary: "Comprehensive ecosystem analysis of 847 pharmaceutical startups attracting $3.4B investment, featuring innovation categories, market contributions, and 34% trade efficiency improvements.",
    content: "India's pharmaceutical startup ecosystem includes 847 startups attracting $3.4B investment. This analysis explores innovation categories and market contributions.",
    details: "This analysis examines India's pharmaceutical startup ecosystem and innovation trends.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Startup Ecosystem Growth',
        level: 2
      },
      {
        type: 'text',
        content: "India's pharmaceutical startup ecosystem has grown to include 847 startups attracting $3.4 billion in investment. This ecosystem is driving innovation and 34% trade efficiency improvements."
      },
      {
        type: 'callout',
        content: "Ecosystem Growth: India's pharmaceutical startup ecosystem includes 847 startups attracting $3.4 billion in investment, driving 34% trade efficiency improvements."
      }
    ]
  },
  {
    id: 13,
    slug: "quality-standards-gmp-pharma-trade",
    title: "Quality Standards: GMP in Pharma Trade",
    date: "April 5, 2025",
    author: "Dr. Rajesh Kumar",
    category: "Trade Quality",
    readTime: "13 min read",
    tags: ["GMP", "Quality", "Trade Standards"],
    summary: "Detailed analysis of GMP standards across 180+ countries, featuring 12,400+ certified facilities worldwide, 99.1% batch acceptance rates, and 23% price premiums for certified manufacturers.",
    content: "GMP standards are implemented across 180+ countries with 12,400+ certified facilities worldwide. This analysis explores quality standards and their impact on pharmaceutical trade.",
    details: "This analysis examines GMP standards and their impact on pharmaceutical trade.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: GMP Standards Implementation',
        level: 2
      },
      {
        type: 'text',
        content: "Good Manufacturing Practice (GMP) standards are implemented across 180+ countries with 12,400+ certified facilities worldwide. These standards ensure 99.1% batch acceptance rates and 23% price premiums for certified manufacturers."
      },
      {
        type: 'callout',
        content: "Quality Standards: GMP standards are implemented across 180+ countries with 12,400+ certified facilities, ensuring 99.1% batch acceptance rates."
      }
    ]
  },
  {
    id: 14,
    slug: "pharma-exports-africa-growth-opportunities",
    title: "Pharma Exports to Africa: Growth Opportunities",
    date: "March 30, 2025",
    author: "Anita Desai",
    category: "Trade Analysis",
    readTime: "12 min read",
    tags: ["Africa", "Exports", "Emerging Markets"],
    summary: "Strategic market analysis of India's $2.8B pharmaceutical exports to 48 African countries, featuring 67% growth rates, regional performance metrics, and projected expansion to $4.8B by 2027.",
    content: "India's pharmaceutical exports to Africa have reached $2.8B across 48 countries. This analysis explores growth opportunities and regional performance metrics.",
    details: "This analysis examines India's pharmaceutical exports to Africa and growth opportunities.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: African Market Growth',
        level: 2
      },
      {
        type: 'text',
        content: "India's pharmaceutical exports to Africa have reached $2.8 billion across 48 countries, representing 67% growth rates and significant opportunities for market expansion."
      },
      {
        type: 'callout',
        content: "Market Growth: India's pharmaceutical exports to Africa have reached $2.8 billion across 48 countries, with 67% growth rates and projected expansion to $4.8 billion by 2027."
      }
    ]
  },
  {
    id: 15,
    slug: "digital-trade-ecommerce-pharma",
    title: "Digital Trade: E-commerce in Pharma",
    date: "March 25, 2025",
    author: "Dr. Arjun Reddy",
    category: "Trade Technology",
    readTime: "13 min read",
    tags: ["E-commerce", "Digital Trade", "Distribution"],
    summary: "Comprehensive analysis of $12.4B digital pharmaceutical commerce across 156 countries, featuring 187% growth rates, automated compliance systems, and 56% trade cycle time reductions.",
    content: "Digital pharmaceutical commerce has reached $12.4B across 156 countries. This analysis explores e-commerce growth and digital trade innovations.",
    details: "This analysis examines digital pharmaceutical commerce and e-commerce growth.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Digital Commerce Growth',
        level: 2
      },
      {
        type: 'text',
        content: "Digital pharmaceutical commerce has reached $12.4 billion across 156 countries, representing 187% growth rates and significant innovations in automated compliance systems."
      },
      {
        type: 'callout',
        content: "Digital Growth: Digital pharmaceutical commerce has reached $12.4 billion across 156 countries, with 187% growth rates and 56% trade cycle time reductions."
      }
    ]
  },
  {
    id: 16,
    slug: "biosimilars-trade-india-next-frontier",
    title: "Biosimilars Trade: India's Next Frontier",
    date: "March 20, 2025",
    author: "Dr. Kavita Mehra",
    category: "API Trade",
    readTime: "8 min read",
    tags: ["Biosimilars", "Trade", "Manufacturing"],
    summary: "The rise of biosimilar manufacturing in India and its impact on global trade.",
    content: "Biosimilars represent the next frontier in India's pharmaceutical manufacturing sector. This analysis explores the growth of biosimilar manufacturing and its impact on global trade.",
    details: "This analysis examines the rise of biosimilar manufacturing in India and its impact on global trade.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Biosimilars Market Growth',
        level: 2
      },
      {
        type: 'text',
        content: "Biosimilars represent the next frontier in India's pharmaceutical manufacturing sector, with significant growth potential and market opportunities."
      },
      {
        type: 'callout',
        content: "Market Opportunity: Biosimilars represent a $15 billion market opportunity for India's pharmaceutical sector."
      }
    ]
  },
  {
    id: 17,
    slug: "trade-warehousing-smart-storage-solutions",
    title: "Trade Warehousing: Smart Storage Solutions",
    date: "March 15, 2025",
    author: "Suresh Patil",
    category: "Trade Logistics",
    readTime: "6 min read",
    tags: ["Warehousing", "Logistics", "Technology"],
    summary: "Advanced warehousing technologies and their impact on pharmaceutical trade efficiency.",
    content: "Advanced warehousing technologies are transforming pharmaceutical trade efficiency. This analysis explores smart storage solutions and their impact on trade operations.",
    details: "This analysis examines advanced warehousing technologies and their impact on pharmaceutical trade efficiency.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Smart Warehousing Solutions',
        level: 2
      },
      {
        type: 'text',
        content: "Advanced warehousing technologies are transforming pharmaceutical trade efficiency through smart storage solutions and automated systems."
      },
      {
        type: 'callout',
        content: "Technology Impact: Smart warehousing solutions have improved storage efficiency by 45% and reduced operational costs by 28%."
      }
    ]
  },
  {
    id: 18,
    slug: "trade-agreements-pharma-ip-protection",
    title: "Trade Agreements: Pharma IP Protection",
    date: "March 10, 2025",
    author: "Adv. Meera Patel",
    category: "Trade Compliance",
    readTime: "7 min read",
    tags: ["Trade Agreements", "IP", "Compliance"],
    summary: "Analysis of trade agreements and their implications for pharmaceutical intellectual property.",
    content: "Trade agreements have significant implications for pharmaceutical intellectual property protection. This analysis explores the impact of trade agreements on IP protection.",
    details: "This analysis examines trade agreements and their implications for pharmaceutical intellectual property protection.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: IP Protection in Trade Agreements',
        level: 2
      },
      {
        type: 'text',
        content: "Trade agreements have significant implications for pharmaceutical intellectual property protection, influencing innovation and market access."
      },
      {
        type: 'callout',
        content: "IP Impact: Trade agreements have strengthened IP protection for 78% of pharmaceutical companies operating in international markets."
      }
    ]
  },
  {
    id: 19,
    slug: "trade-education-skill-development-pharma",
    title: "Trade Education: Skill Development for Pharma",
    date: "March 5, 2025",
    author: "Dr. Priya Sharma",
    category: "Trade Education",
    readTime: "5 min read",
    tags: ["Education", "Skill Development", "Trade"],
    summary: "Government and industry initiatives to develop skilled workforce for pharmaceutical trade.",
    content: "Government and industry initiatives are developing skilled workforce for pharmaceutical trade. This analysis explores skill development programs and their impact.",
    details: "This analysis examines government and industry initiatives to develop skilled workforce for pharmaceutical trade.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Skill Development Initiatives',
        level: 2
      },
      {
        type: 'text',
        content: "Government and industry initiatives are developing skilled workforce for pharmaceutical trade through comprehensive education and training programs."
      },
      {
        type: 'callout',
        content: "Skill Development: Government and industry initiatives have trained 45,000+ professionals for pharmaceutical trade operations."
      }
    ]
  },
  {
    id: 20,
    slug: "medical-tourism-pharma-trade-support",
    title: "Medical Tourism: Pharma Trade Support",
    date: "February 28, 2025",
    author: "Rahul Verma",
    category: "Trade Analysis",
    readTime: "6 min read",
    tags: ["Medical Tourism", "Trade", "Healthcare"],
    summary: "How pharmaceutical manufacturing excellence is supporting India's medical tourism trade.",
    content: "Pharmaceutical manufacturing excellence is supporting India's medical tourism trade. This analysis explores the relationship between pharmaceutical manufacturing and medical tourism.",
    details: "This analysis examines how pharmaceutical manufacturing excellence is supporting India's medical tourism trade.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Medical Tourism Support',
        level: 2
      },
      {
        type: 'text',
        content: "Pharmaceutical manufacturing excellence is supporting India's medical tourism trade through quality healthcare products and services."
      },
      {
        type: 'callout',
        content: "Tourism Support: Pharmaceutical manufacturing excellence has contributed to 34% growth in India's medical tourism sector."
      }
    ]
  },
  {
    id: 21,
    slug: "trade-analytics-market-intelligence",
    title: "Trade Analytics: Market Intelligence",
    date: "February 25, 2025",
    author: "Rajesh Kumar",
    category: "Trade Analytics",
    readTime: "7 min read",
    tags: ["Analytics", "Market Intelligence", "Trade Data"],
    summary: "How data analytics is revolutionizing pharmaceutical trade intelligence and decision-making.",
    content: "Data analytics is revolutionizing pharmaceutical trade intelligence and decision-making. This analysis explores the impact of analytics on trade operations.",
    details: "This analysis examines how data analytics is revolutionizing pharmaceutical trade intelligence and decision-making.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Analytics Revolution',
        level: 2
      },
      {
        type: 'text',
        content: "Data analytics is revolutionizing pharmaceutical trade intelligence and decision-making through advanced insights and predictive modeling."
      },
      {
        type: 'callout',
        content: "Analytics Impact: Data analytics has improved trade decision-making accuracy by 67% and reduced operational costs by 23%."
      }
    ]
  },
  {
    id: 22,
    slug: "trade-security-protecting-pharma-supply-chains",
    title: "Trade Security: Protecting Pharma Supply Chains",
    date: "February 20, 2025",
    author: "Vikram Malhotra",
    category: "Trade Security",
    readTime: "8 min read",
    tags: ["Cybersecurity", "Supply Chain", "Trade Security"],
    summary: "Cybersecurity challenges and solutions for pharmaceutical trade operations.",
    content: "Cybersecurity challenges and solutions are critical for pharmaceutical trade operations. This analysis explores security measures and their impact on trade operations.",
    details: "This analysis examines cybersecurity challenges and solutions for pharmaceutical trade operations.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Cybersecurity in Trade',
        level: 2
      },
      {
        type: 'text',
        content: "Cybersecurity challenges and solutions are critical for pharmaceutical trade operations, ensuring data protection and operational security."
      },
      {
        type: 'callout',
        content: "Security Impact: Cybersecurity measures have reduced trade-related security incidents by 78% and improved data protection by 89%."
      }
    ]
  },
  {
    id: 23,
    slug: "trade-partnerships-global-collaborations",
    title: "Trade Partnerships: Global Collaborations",
    date: "February 15, 2025",
    author: "Anjali Rao",
    category: "Trade Partnerships",
    readTime: "6 min read",
    tags: ["Partnerships", "Collaborations", "Global Trade"],
    summary: "Strategic partnerships between Indian and international pharmaceutical trade companies.",
    content: "Strategic partnerships between Indian and international pharmaceutical trade companies are driving global collaboration. This analysis explores partnership opportunities and their impact.",
    details: "This analysis examines strategic partnerships between Indian and international pharmaceutical trade companies.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: Global Partnerships',
        level: 2
      },
      {
        type: 'text',
        content: "Strategic partnerships between Indian and international pharmaceutical trade companies are driving global collaboration and market expansion."
      },
      {
        type: 'callout',
        content: "Partnership Impact: Strategic partnerships have increased market access by 45% and improved trade efficiency by 34%."
      }
    ]
  },
  {
    id: 24,
    slug: "trade-innovation-rd-investment-trends",
    title: "Trade Innovation: R&D Investment Trends",
    date: "February 10, 2025",
    author: "Dr. Amit Singh",
    category: "Trade Innovation",
    readTime: "7 min read",
    tags: ["R&D", "Innovation", "Trade Investment"],
    summary: "Investment trends in pharmaceutical trade research and development.",
    content: "Investment trends in pharmaceutical trade research and development are driving innovation. This analysis explores R&D investment patterns and their impact on trade.",
    details: "This analysis examines investment trends in pharmaceutical trade research and development.",
    richContent: [
      {
        type: 'heading',
        content: 'Executive Summary: R&D Investment Trends',
        level: 2
      },
      {
        type: 'text',
        content: "Investment trends in pharmaceutical trade research and development are driving innovation and market growth across global markets."
      },
      {
        type: 'callout',
        content: "R&D Impact: R&D investments have increased innovation output by 56% and improved market competitiveness by 34%."
      }
    ]
  }
]; */

// Main Component
export function generateStaticParams() {
  return blogs.map(b => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = blogs.find(b => b.slug === slug)
  if (!blog) return { title: 'Post not found' }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const url = `${baseUrl}/blog/${blog.slug}`
  const imageUrl = blog.image ? `${baseUrl}${blog.image}` : undefined
  return {
    title: blog.title,
    description: blog.summary,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: blog.title, description: blog.summary, images: imageUrl ? [imageUrl] : undefined },
    twitter: { card: 'summary_large_image', title: blog.title, description: blog.summary, images: imageUrl ? [imageUrl] : undefined },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = blogs.find(b => b.slug === slug)

  if (!blog) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const imageUrl = blog.image ? `${baseUrl}${blog.image}` : `${baseUrl}/og-image.jpg`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {blog.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blog.readTime}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {blog.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              {blog.title}
            </h1>
            
            { (blog.tldr || blog.summary) && (
              <div className="mt-4">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-r-md">
                  <p className="text-gray-800 text-base tldr">
                    <span className="font-semibold mr-2">TL;DR:</span>
                    {blog.tldr || blog.summary}
                  </p>
                </div>
              </div>
            ) }
            
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
              </div>
            </div>
                  </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Article',
                  headline: blog.title,
                  description: blog.summary,
                  image: [imageUrl],
                  author: [{ '@type': 'Person', name: blog.author }],
                  datePublished: new Date(blog.date).toISOString(),
                  dateModified: new Date(blog.date).toISOString(),
                  mainEntityOfPage: `${baseUrl}/blog/${blog.slug}`,
                  keywords: blog.tags?.join(', ') ?? '',
                  speakable: {
                    '@type': 'SpeakableSpecification',
                    cssSelector: ['.tldr']
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'TransData Nexus',
                    logo: {
                      '@type': 'ImageObject',
                      url: `${baseUrl}/logo.webp`
                    }
                  }
                }),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: `${baseUrl}/`
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Blog',
                      item: `${baseUrl}/blog`
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: blog.title,
                      item: `${baseUrl}/blog/${blog.slug}`
                    }
                  ]
                })
              }}
            />
            {blog.faq && blog.faq.length > 0 && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: blog.faq.map((f: FaqItem) => ({
                      '@type': 'Question',
                      name: f.question,
                      acceptedAnswer: { '@type': 'Answer', text: f.answer },
                    })),
                  }),
                }}
              />
            )}
            <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
              {blog.content}
            </p>
            {blog.richContent && <RichContentRenderer content={blog.richContent} />}
          </div>
        </article>
      </div>
    </div>
  );
}