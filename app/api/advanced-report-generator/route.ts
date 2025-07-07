import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import PptxGenJS from "pptxgenjs";
import { writeFileSync } from "fs";
import { join } from "path";
import { AdvancedAIAnalytics } from '@/app/lib/advanced-ai-analytics';
import { 
  createDynamicReportConfig, 
  DynamicReportResult,
  REPORT_TYPE_CONFIGS 
} from '@/app/lib/dynamic-report-schema';

// Advanced AI-powered analysis functions
async function generateMarketIntelligence(searchTerm: string): Promise<{
  totalValue: number;
  totalVolume: number;
  uniqueSuppliers: number;
  uniqueBuyers: number;
  topSuppliers: Array<{ name: string; value: number; share: number }>;
  topBuyers: Array<{ name: string; value: number; share: number }>;
  topCountries: Array<{ name: string; value: number; share: number }>;
  growthRate: number;
  priceTrend: Array<{ year: string; avgPrice: number; volume: number }>;
}> {
  // Fetch comprehensive data
  const data = await prisma.exp_india.findMany({
    where: {
      OR: [
        { product_description: { contains: searchTerm, mode: 'insensitive' } },
        { supplier_name: { contains: searchTerm, mode: 'insensitive' } },
        { buyer_name: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }
  });

  if (data.length === 0) {
    throw new Error('No data found for the specified search term');
  }

  // Calculate market metrics
  const totalValue = data.reduce((sum: number, item: { total_value_usd: string | null }) => {
    return sum + (parseFloat(item.total_value_usd || '0') || 0);
  }, 0);

  const totalVolume = data.reduce((sum: number, item: { quantity: string | null }) => {
    return sum + (parseFloat(item.quantity || '0') || 0);
  }, 0);

  // Supplier analysis
  const supplierData = data.reduce((acc: Record<string, number>, item: { supplier_name: string | null; total_value_usd: string | null }) => {
    if (item.supplier_name) {
      acc[item.supplier_name] = (acc[item.supplier_name] || 0) + (parseFloat(item.total_value_usd || '0') || 0);
    }
    return acc;
  }, {});

  const topSuppliers = (Object.entries(supplierData) as [string, number][])
    .map(([name, value]) => ({ name, value, share: (value / totalValue) * 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Buyer analysis
  const buyerData = data.reduce((acc: Record<string, number>, item: { buyer_name: string | null; total_value_usd: string | null }) => {
    if (item.buyer_name) {
      acc[item.buyer_name] = (acc[item.buyer_name] || 0) + (parseFloat(item.total_value_usd || '0') || 0);
    }
    return acc;
  }, {});

  const topBuyers = (Object.entries(buyerData) as [string, number][])
    .map(([name, value]) => ({ name, value, share: (value / totalValue) * 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Country analysis
  const countryData = data.reduce((acc: Record<string, number>, item: { country_of_origin: string | null; country_of_destination: string | null; total_value_usd: string | null }) => {
    if (item.country_of_origin) {
      acc[item.country_of_origin] = (acc[item.country_of_origin] || 0) + (parseFloat(item.total_value_usd || '0') || 0);
    }
    if (item.country_of_destination) {
      acc[item.country_of_destination] = (acc[item.country_of_destination] || 0) + (parseFloat(item.total_value_usd || '0') || 0);
    }
    return acc;
  }, {});

  const topCountries = (Object.entries(countryData) as [string, number][])
    .map(([name, value]) => ({ name, value, share: (value / totalValue) * 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Calculate growth rate
  const years = [...new Set(data.map((item: { year: string | null }) => item.year))].sort() as string[];
  const yearData = years.map((year: string) => {
    const yearRecords = data.filter((item: { year: string | null }) => item.year === year);
    const yearValue = yearRecords.reduce((sum: number, item: { total_value_usd: string | null }) => {
      return sum + (parseFloat(item.total_value_usd || '0') || 0);
    }, 0);
    const yearVolume = yearRecords.reduce((sum: number, item: { quantity: string | null }) => {
      return sum + (parseFloat(item.quantity || '0') || 0);
    }, 0);
    const avgPrice = yearVolume > 0 ? yearValue / yearVolume : 0;
    return { year, avgPrice, volume: yearVolume };
  });

  const growthRate = yearData.length > 1 
    ? ((yearData[yearData.length - 1].avgPrice - yearData[0].avgPrice) / yearData[0].avgPrice) * 100 
    : 0;

  return {
    totalValue,
    totalVolume,
    uniqueSuppliers: Object.keys(supplierData).length,
    uniqueBuyers: Object.keys(buyerData).length,
    topSuppliers,
    topBuyers,
    topCountries,
    growthRate,
    priceTrend: yearData
  };
}

async function generateCompetitiveAnalysis(searchTerm: string): Promise<{
  marketConcentration: number;
  topSuppliers: Array<{ name: string; value: number; share: number }>;
  topBuyers: Array<{ name: string; value: number; share: number }>;
  hhi: number;
  competitiveIntensity: string;
  marketStructure: string;
}> {
  const data = await prisma.exp_india.findMany({
    where: {
      OR: [
        { product_description: { contains: searchTerm, mode: 'insensitive' } },
        { supplier_name: { contains: searchTerm, mode: 'insensitive' } },
        { buyer_name: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }
  });

  if (data.length === 0) {
    throw new Error('No data found for competitive analysis');
  }

  // Supplier market share analysis
  const supplierData = data.reduce((acc: Record<string, number>, item: { supplier_name: string | null; total_value_usd: string | null }) => {
    if (item.supplier_name) {
      acc[item.supplier_name] = (acc[item.supplier_name] || 0) + (parseFloat(item.total_value_usd || '0') || 0);
    }
    return acc;
  }, {});

  const totalValue = (Object.values(supplierData) as number[]).reduce((sum: number, value: number) => sum + value, 0);
  
  const topSuppliers = (Object.entries(supplierData) as [string, number][])
    .map(([name, value]) => ({ name, value, share: (value / totalValue) * 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Buyer market share analysis
  const buyerData = data.reduce((acc: Record<string, number>, item: { buyer_name: string | null; total_value_usd: string | null }) => {
    if (item.buyer_name) {
      acc[item.buyer_name] = (acc[item.buyer_name] || 0) + (parseFloat(item.total_value_usd || '0') || 0);
    }
    return acc;
  }, {});

  const topBuyers = (Object.entries(buyerData) as [string, number][])
    .map(([name, value]) => ({ name, value, share: (value / totalValue) * 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Calculate HHI (Herfindahl-Hirschman Index)
  const hhi = (Object.values(supplierData) as number[]).reduce((sum: number, value: number) => {
    const marketShare = (value / totalValue) * 100;
    return sum + (marketShare * marketShare);
  }, 0);

  // Determine market structure
  let marketStructure = 'Fragmented';
  let competitiveIntensity = 'High';
  
  if (hhi > 2500) {
    marketStructure = 'Highly Concentrated';
    competitiveIntensity = 'Low';
  } else if (hhi > 1500) {
    marketStructure = 'Moderately Concentrated';
    competitiveIntensity = 'Medium';
  }

  const marketConcentration = (topSuppliers[0]?.share || 0) + (topSuppliers[1]?.share || 0) + (topSuppliers[2]?.share || 0);

  return {
    marketConcentration,
    topSuppliers,
    topBuyers,
    hhi,
    competitiveIntensity,
    marketStructure
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchTerm, reportType = 'comprehensive', format = 'pdf' } = body;

    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    // Generate comprehensive analysis
    const analytics = new AdvancedAIAnalytics(searchTerm);
    await analytics.initialize();
    
    // Run comprehensive analysis
    const analysisResult = await analytics.runComprehensiveAnalysis();
    
    // Create dynamic report configuration
    const config = createDynamicReportConfig(searchTerm, reportType as keyof typeof REPORT_TYPE_CONFIGS);

    // Create report result from analysis
    const reportResult: DynamicReportResult = {
      reportId: config.reportId,
      config,
      sections: [
        {
          sectionId: 'executive-summary',
          title: 'Executive Summary',
          content: `Comprehensive analysis of ${searchTerm} market with total value of $${analysisResult.metrics.totalValue?.toLocaleString() || 'N/A'} and ${analysisResult.metrics.totalVolume?.toLocaleString() || 'N/A'} units traded.`,
          analytics: [analysisResult.metrics],
          visualizations: analysisResult.visualizations,
          aiInsights: analysisResult.insights,
          metadata: {
            dataPoints: analysisResult.metrics.totalTransactions || 0,
            timeRange: 'Latest available data',
            confidence: 0.85,
            lastUpdated: new Date().toISOString()
          }
        },
        {
          sectionId: 'market-intelligence',
          title: 'Market Intelligence',
          content: `Market analysis reveals key trends and patterns in the ${searchTerm} sector.`,
          analytics: analysisResult.trends,
          visualizations: analysisResult.visualizations,
          aiInsights: analysisResult.insights,
          metadata: {
            dataPoints: analysisResult.metrics.totalTransactions || 0,
            timeRange: 'Latest available data',
            confidence: 0.80,
            lastUpdated: new Date().toISOString()
          }
        }
      ],
      summary: {
        totalSections: 2,
        totalPages: 1,
        totalDataPoints: analysisResult.metrics.totalTransactions || 0,
        aiInsightsCount: analysisResult.insights.length,
        visualizationsCount: analysisResult.visualizations.length,
        generationTime: Date.now()
      },
      metadata: {
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        version: '1.0.0',
        generatedBy: 'Advanced AI Analytics Engine'
      }
    };

    // Generate file based on format
    let fileBuffer: Buffer;
    let fileName: string;

    if (format === 'pdf') {
      fileBuffer = await generateDynamicPDFReport(reportResult, searchTerm);
      fileName = `Dynamic_Report_${searchTerm}_${Date.now()}.pdf`;
    } else if (format === 'pptx') {
      fileBuffer = await generateDynamicPPTReport(reportResult, searchTerm);
      fileName = `Dynamic_Report_${searchTerm}_${Date.now()}.pptx`;
    } else {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }



    // Generate file ID for tracking
    const fileId = Buffer.from(fileName).toString('base64').replace(/[^a-zA-Z0-9]/g, '');

    // Save metadata for download API
    const metadataPath = join(process.cwd(), 'reports', `${fileId}.json`);
    const metadata = {
      fileName,
      format,
      searchTerm,
      reportType,
      createdAt: new Date().toISOString(),
      fileId
    };
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Rename the file to use fileId for download API compatibility
    const newFilePath = join(process.cwd(), 'reports', `${fileId}.${format}`);
    writeFileSync(newFilePath, fileBuffer);

    return NextResponse.json({
      success: true,
      fileId,
      fileName,
      downloadUrl: `/api/download-report/${fileId}`,
      viewUrl: `/api/view-report/${fileId}`,
      message: `Dynamic ${format.toUpperCase()} report generated successfully`
    });

  } catch (error) {
    console.error('Error generating dynamic report:', error);
    return NextResponse.json(
      { error: 'Failed to generate dynamic report' },
      { status: 500 }
    );
  }
}

async function generateDynamicPDFReport(reportResult: DynamicReportResult, searchTerm: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { height } = page.getSize();
  
  // Add title
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const titleFontSize = 24;
  page.drawText(`Dynamic AI Report: ${searchTerm}`, {
    x: 50,
    y: height - 50,
    size: titleFontSize,
    font: titleFont,
    color: rgb(0.2, 0.2, 0.2)
  });

  // Add sections
  let yPosition = height - 100;
  for (const section of reportResult.sections) {
    if (yPosition < 100) {
      page = pdfDoc.addPage([595.28, 841.89]);
      yPosition = height - 50;
    }

    // Section title
    page.drawText(section.title, {
      x: 50,
      y: yPosition,
      size: 16,
      font: titleFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    yPosition -= 30;

    // Section content
    const contentFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const lines = section.content.split('\n');
    
    for (const line of lines) {
      if (yPosition < 50) {
        page = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - 50;
      }
      
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 12,
        font: contentFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      yPosition -= 20;
    }
    
    yPosition -= 20; // Extra spacing between sections
  }

  return Buffer.from(await pdfDoc.save());
}

async function generateDynamicPPTReport(reportResult: DynamicReportResult, searchTerm: string): Promise<Buffer> {
  try {
    const pptx = new PptxGenJS();
    
    // Simple title slide
    const slide = pptx.addSlide();
    slide.addText(`Dynamic AI Report: ${searchTerm}`, {
      x: 1, y: 2, w: 8, h: 1,
      fontSize: 24,
      bold: true,
      align: 'center'
    });
    
    slide.addText('Generated by TransData Analytics Platform', {
      x: 1, y: 3, w: 8, h: 0.5,
      fontSize: 14,
      align: 'center'
    });

    // Add content slide
    if (reportResult.sections.length > 0) {
      const contentSlide = pptx.addSlide();
      contentSlide.addText('Report Summary', {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 20,
        bold: true
      });
      
      const summaryText = reportResult.sections.map(s => s.title).join('\n');
      contentSlide.addText(summaryText, {
        x: 0.5, y: 1.5, w: 9, h: 5,
        fontSize: 12,
        align: 'left',
        valign: 'top'
      });
    }

    const buffer = await pptx.write();
    return Buffer.from(buffer as ArrayBuffer);
  } catch (error) {
    console.error('PPTX generation error:', error);
    throw new Error(`Failed to generate PPTX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Advanced Report Generator API',
    endpoints: {
      POST: 'Generate comprehensive reports in PDF or PPT format'
    }
  });
} 