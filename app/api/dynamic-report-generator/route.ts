import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { 
  createDynamicReportConfig, 
  DynamicReportConfig, 
  DynamicReportResult,
  REPORT_TYPE_CONFIGS 
} from "@/app/lib/dynamic-report-schema";
import { AdvancedAIAnalytics } from "@/app/lib/advanced-ai-analytics";

interface DynamicReportRequest {
  searchTerm: string;
  reportType: 'comprehensive' | 'market-analysis' | 'competitive-intelligence' | 'trend-forecast' | 'custom';
  format: 'pdf' | 'ppt' | 'html';
  customSections?: string[];
  dataFilters?: {
    dateRange?: { start: string; end: string };
    countries?: string[];
    suppliers?: string[];
    buyers?: string[];
    priceRange?: { min: number; max: number };
    categories?: string[];
  };
  aiSettings?: {
    enableInsights: boolean;
    enablePredictions: boolean;
    enableAnomalyDetection: boolean;
    enableTrendAnalysis: boolean;
    confidenceThreshold: number;
    maxInsightsPerSection: number;
  };
  visualizationSettings?: {
    chartTypes: string[];
    colorScheme: string;
    includeInteractive: boolean;
    maxChartsPerSection: number;
  };
  exportSettings?: {
    includeRawData: boolean;
    includeMethodology: boolean;
    includeSources: boolean;
    maxPages?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: DynamicReportRequest = await request.json();
    const { searchTerm, reportType, format, customSections, dataFilters, aiSettings, visualizationSettings, exportSettings } = body;

    if (!searchTerm || !reportType || !format) {
      return NextResponse.json(
        { error: 'Search term, report type, and format are required' },
        { status: 400 }
      );
    }

    console.log(`Generating dynamic report for: ${searchTerm}, Type: ${reportType}, Format: ${format}`);

    // Convert customSections from string[] to DynamicReportSection[] if provided
    const convertedCustomSections = customSections?.map((sectionName, index) => ({
      id: `custom-${index}`,
      title: sectionName,
      type: 'custom' as const,
      priority: index + 1,
      isRequired: true,
      isExpandable: true,
      dataSource: 'custom',
      analytics: [],
      visualizations: [],
      aiInsights: true
    }));

    // Create dynamic report configuration
    const config = createDynamicReportConfig(searchTerm, reportType, convertedCustomSections);
    
    // Apply custom settings
    if (dataFilters) config.dataFilters = { ...config.dataFilters, ...dataFilters };
    if (aiSettings) config.aiSettings = { ...config.aiSettings, ...aiSettings };
    if (visualizationSettings) config.visualizationSettings = { ...config.visualizationSettings, ...visualizationSettings };
    if (exportSettings) config.exportSettings = { ...config.exportSettings, ...exportSettings };

    // Initialize AI analytics engine
    const analytics = new AdvancedAIAnalytics(searchTerm);
    await analytics.initialize();

    // Generate comprehensive analysis
    const analysisResult = await analytics.runComprehensiveAnalysis();

    // Generate dynamic report sections
    const sections = await generateDynamicSections(config, analysisResult, analytics);

    // Create report result
    const reportResult: DynamicReportResult = {
      reportId: config.reportId,
      config,
      sections,
      summary: {
        totalSections: sections.length,
        totalPages: calculateTotalPages(sections),
        totalDataPoints: analysisResult.metrics.totalValue || 0,
        aiInsightsCount: analysisResult.insights.length,
        visualizationsCount: analysisResult.visualizations.length,
        generationTime: Date.now()
      },
      metadata: {
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        version: '2.0.0',
        generatedBy: 'Dynamic AI Report Generator'
      }
    };

    // Generate file based on format
    let fileBuffer: Buffer;
    let fileName: string;

    if (format === 'pdf') {
      fileBuffer = await generateDynamicPDFReport(reportResult, searchTerm);
      fileName = `${searchTerm.replace(/[^a-zA-Z0-9]/g, '_')}_Dynamic_Report_${config.reportId}.pdf`;
    } else if (format === 'ppt') {
      fileBuffer = await generateDynamicPPTReport(reportResult, searchTerm);
      fileName = `${searchTerm.replace(/[^a-zA-Z0-9]/g, '_')}_Dynamic_Report_${config.reportId}.pptx`;
    } else {
      // HTML format - return JSON data for frontend rendering
      return NextResponse.json({
        success: true,
        report: reportResult,
        format: 'html',
        message: 'Report data generated successfully for HTML rendering'
      });
    }

    // Save report metadata
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const metadata = {
      reportId: config.reportId,
      searchTerm,
      format,
      fileName,
      report: reportResult,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const metadataPath = path.join(reportsDir, `${config.reportId}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Save file
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    console.log(`Dynamic report generated successfully: ${fileName}`);

    return NextResponse.json({
      success: true,
      reportId: config.reportId,
      fileName,
      downloadUrl: `/api/download-report/${config.reportId}`,
      viewUrl: `/api/view-report/${config.reportId}`,
      metadata: {
        searchTerm,
        reportType,
        format,
        totalSections: sections.length,
        totalPages: calculateTotalPages(sections),
        aiInsightsCount: analysisResult.insights.length,
        generationTime: Date.now()
      }
    });

  } catch (error) {
    console.error('Dynamic report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate dynamic report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateDynamicSections(
  config: DynamicReportConfig, 
  analysisResult: any, 
  analytics: AdvancedAIAnalytics
): Promise<any[]> {
  const sections = [];

  for (const sectionConfig of config.sections) {
    console.log(`Generating section: ${sectionConfig.title}`);

    const sectionData: any = {
      sectionId: sectionConfig.id,
      title: sectionConfig.title,
      content: {},
      analytics: [],
      visualizations: [],
      aiInsights: [],
      metadata: {
        dataPoints: 0,
        timeRange: '',
        confidence: 0,
        lastUpdated: new Date().toISOString()
      }
    };

    // Generate section-specific content based on type
    switch (sectionConfig.type) {
      case 'executive':
        sectionData.content = await generateExecutiveSummary(analysisResult, config);
        break;
      case 'market':
        sectionData.content = await generateMarketIntelligence(analysisResult, analytics);
        break;
      case 'competitive':
        sectionData.content = await generateCompetitiveAnalysis(analysisResult, analytics);
        break;
      case 'trend':
        sectionData.content = await generateTrendAnalysis(analysisResult, analytics);
        break;
      case 'regional':
        sectionData.content = await generateRegionalAnalysis(analysisResult, analytics);
        break;
      case 'regulatory':
        sectionData.content = await generateRegulatoryAnalysis(analysisResult);
        break;
      case 'supply-chain':
        sectionData.content = await generateSupplyChainAnalysis(analysisResult, analytics);
        break;
      case 'pricing':
        sectionData.content = await generatePricingAnalysis(analysisResult, analytics);
        break;
      case 'ai-insights':
        sectionData.content = await generateAIInsightsSection(analysisResult);
        break;
      case 'strategic':
        sectionData.content = await generateStrategicRecommendations(analysisResult, config);
        break;
      case 'appendix':
        sectionData.content = await generateAppendices(analysisResult, config);
        break;
      default:
        sectionData.content = await generateCustomSection(sectionConfig, analysisResult);
    }

    // Add analytics and visualizations
    sectionData.analytics = analysisResult.metrics;
    sectionData.visualizations = analysisResult.visualizations.slice(0, config.visualizationSettings.maxChartsPerSection);
    
    // Add AI insights if enabled
    if (sectionConfig.aiInsights && config.aiSettings.enableInsights) {
      sectionData.aiInsights = analysisResult.insights
        .filter((insight: any) => insight.confidence >= config.aiSettings.confidenceThreshold)
        .slice(0, config.aiSettings.maxInsightsPerSection);
    }

    // Update metadata
    sectionData.metadata.dataPoints = analysisResult.metrics.totalValue || 0;
    sectionData.metadata.confidence = sectionData.aiInsights.length > 0 
      ? sectionData.aiInsights.reduce((sum: number, insight: any) => sum + insight.confidence, 0) / sectionData.aiInsights.length 
      : 0;

    sections.push(sectionData);
  }

  return sections;
}

async function generateExecutiveSummary(analysisResult: any, config: DynamicReportConfig): Promise<any> {
  const metrics = analysisResult.metrics;
  const insights = analysisResult.insights;

  return {
    keyFindings: [
      `Market size: $${metrics.totalValue?.toLocaleString() || 'N/A'} USD`,
      `Growth rate: ${metrics.marketGrowth?.toFixed(1) || 'N/A'}% annually`,
      `Price volatility: ${(metrics.priceVolatility * 100)?.toFixed(1) || 'N/A'}%`,
      `Geographic diversity: ${(metrics.geographicDiversity * 100)?.toFixed(1) || 'N/A'}%`
    ],
    marketOverview: `The market for ${config.searchTerm} shows ${metrics.marketGrowth > 10 ? 'strong' : metrics.marketGrowth > 0 ? 'moderate' : 'declining'} growth with ${metrics.totalValue?.toLocaleString() || 'N/A'} USD in total value.`,
    strategicRecommendations: insights
      .filter((insight: any) => insight.impact === 'high')
      .slice(0, 3)
      .map((insight: any) => insight.recommendations[0]),
    riskAssessment: `Market concentration (HHI: ${metrics.hhi?.toFixed(0) || 'N/A'}) indicates ${metrics.hhi > 2500 ? 'high' : metrics.hhi > 1500 ? 'moderate' : 'low'} concentration risk.`
  };
}

async function generateMarketIntelligence(analysisResult: any, analytics: AdvancedAIAnalytics): Promise<any> {
  const marketMetrics = await analytics.analyzeMarketSize();
  const insights = analysisResult.insights.filter((insight: any) => insight.type === 'trend' || insight.type === 'opportunity');

  return {
    marketSize: marketMetrics.totalValue,
    growthRate: marketMetrics.marketGrowth,
    marketMaturity: marketMetrics.marketGrowth > 10 ? 'Growing' : marketMetrics.marketGrowth > 0 ? 'Stable' : 'Declining',
    keyDrivers: [
      'Increasing global demand for pharmaceutical products',
      'Expanding healthcare infrastructure in emerging markets',
      'Rising chronic disease prevalence',
      'Technological advancements in drug development'
    ],
    barriers: [
      'Stringent regulatory requirements',
      'High compliance costs',
      'Supply chain disruptions',
      'Intellectual property challenges'
    ],
    opportunities: insights
      .filter(insight => insight.type === 'opportunity')
      .map(insight => insight.description),
    yearData: marketMetrics.temporalTrends
  };
}

async function generateCompetitiveAnalysis(analysisResult: any, analytics: AdvancedAIAnalytics): Promise<any> {
  const competitiveMetrics = await analytics.analyzeCompetitiveLandscape();

  return {
    topSuppliers: competitiveMetrics.topSuppliers,
    topBuyers: competitiveMetrics.topBuyers,
    marketConcentration: competitiveMetrics.marketConcentration,
    competitiveIntensity: competitiveMetrics.competitiveIntensity,
    marketShare: competitiveMetrics.topSuppliers.map(supplier => ({
      name: supplier.name,
      share: supplier.marketShare,
      value: supplier.totalValue
    }))
  };
}

async function generateTrendAnalysis(analysisResult: any, analytics: AdvancedAIAnalytics): Promise<any> {
  const trendMetrics = await analytics.analyzeTrends();
  const forecastMetrics = await analytics.generateForecasts();

  return {
    historical: analysisResult.trends,
    current: trendMetrics.shortTerm,
    forecast: {
      shortTerm: trendMetrics.shortTerm,
      longTerm: trendMetrics.longTerm,
      predictions: forecastMetrics.predictions,
      scenarios: forecastMetrics.scenarios
    },
    seasonality: trendMetrics.seasonality,
    cyclicality: trendMetrics.cyclicality
  };
}

async function generateRegionalAnalysis(analysisResult: any, analytics: AdvancedAIAnalytics): Promise<any> {
  const marketMetrics = await analytics.analyzeMarketSize();
  
  return [
    {
      region: 'Global',
      marketShare: 100,
      growthRate: marketMetrics.marketGrowth,
      keyPlayers: analysisResult.metrics.topSuppliers?.slice(0, 5).map(s => s.name) || [],
      opportunities: ['Market expansion', 'Technology adoption', 'Regulatory harmonization'],
      challenges: ['Supply chain complexity', 'Regulatory variations', 'Currency fluctuations']
    }
  ];
}

async function generateRegulatoryAnalysis(analysisResult: any): Promise<any> {
  return {
    currentRegulations: [
      'Good Manufacturing Practice (GMP) requirements',
      'International Council for Harmonisation (ICH) guidelines',
      'FDA regulations for pharmaceutical imports',
      'EU pharmaceutical regulations'
    ],
    upcomingChanges: [
      'Digital transformation in regulatory submissions',
      'Enhanced pharmacovigilance requirements',
      'Supply chain transparency regulations'
    ],
    complianceRequirements: [
      'Documentation and record keeping',
      'Quality assurance systems',
      'Risk management procedures'
    ],
    impactAssessment: 'Regulatory changes may increase compliance costs by 15-20% over the next 3 years.'
  };
}

async function generateSupplyChainAnalysis(analysisResult: any, analytics: AdvancedAIAnalytics): Promise<any> {
  return {
    routes: [
      {
        origin: 'India',
        destination: 'Global',
        volume: analysisResult.metrics.totalValue || 0,
        efficiency: 0.85,
        risks: ['Port congestion', 'Weather disruptions', 'Regulatory delays']
      }
    ],
    bottlenecks: [
      'Port capacity limitations',
      'Customs clearance delays',
      'Transportation infrastructure gaps'
    ],
    optimizationOpportunities: [
      'Digital documentation systems',
      'Predictive analytics for demand forecasting',
      'Multi-modal transportation networks'
    ]
  };
}

async function generatePricingAnalysis(analysisResult: any, analytics: AdvancedAIAnalytics): Promise<any> {
  const marketMetrics = await analytics.analyzeMarketSize();

  return {
    priceTrends: analysisResult.trends,
    priceVolatility: marketMetrics.priceVolatility,
    competitivePricing: [
      {
        supplier: 'Top Supplier',
        price: marketMetrics.averagePrice,
        marketShare: 15
      }
    ],
    pricingStrategies: [
      'Value-based pricing',
      'Competitive pricing',
      'Dynamic pricing models'
    ]
  };
}

async function generateAIInsightsSection(analysisResult: any): Promise<any> {
  return {
    insights: analysisResult.insights,
    patterns: analysisResult.patterns,
    anomalies: analysisResult.anomalies,
    predictions: analysisResult.predictions,
    recommendations: analysisResult.insights
      .filter(insight => insight.impact === 'high')
      .map(insight => insight.recommendations)
      .flat()
      .slice(0, 10)
  };
}

async function generateStrategicRecommendations(analysisResult: any, config: DynamicReportConfig): Promise<any> {
  const insights = analysisResult.insights;
  const metrics = analysisResult.metrics;

  return {
    immediate: insights
      .filter(insight => insight.impact === 'high')
      .slice(0, 3)
      .map(insight => insight.recommendations[0]),
    shortTerm: [
      'Optimize supply chain efficiency',
      'Enhance quality assurance systems',
      'Develop strategic partnerships'
    ],
    longTerm: [
      'Invest in digital transformation',
      'Expand geographic presence',
      'Develop innovative product portfolio'
    ],
    implementation: [
      'Establish cross-functional teams',
      'Set up monitoring and evaluation systems',
      'Create risk mitigation strategies'
    ]
  };
}

async function generateAppendices(analysisResult: any, config: DynamicReportConfig): Promise<any> {
  return {
    methodology: 'This report uses advanced AI analytics and comprehensive data analysis to provide market insights.',
    dataSources: [
      'Pharmaceutical trade databases',
      'Regulatory databases',
      'Market research reports',
      'Industry publications'
    ],
    definitions: {
      'Market Size': 'Total value of transactions in USD',
      'Growth Rate': 'Annual percentage change in market value',
      'HHI': 'Herfindahl-Hirschman Index for market concentration',
      'Price Volatility': 'Standard deviation of prices relative to mean'
    },
    charts: analysisResult.visualizations
  };
}

async function generateCustomSection(sectionConfig: any, analysisResult: any): Promise<any> {
  return {
    title: sectionConfig.title,
    content: 'Custom section content based on configuration',
    data: analysisResult.metrics,
    insights: analysisResult.insights.slice(0, 5)
  };
}

function calculateTotalPages(sections: any[]): number {
  // Estimate pages based on content complexity
  return sections.reduce((total, section) => {
    const basePages = 2; // Base pages per section
    const insightPages = Math.ceil(section.aiInsights.length / 3); // 3 insights per page
    const chartPages = Math.ceil(section.visualizations.length / 2); // 2 charts per page
    return total + basePages + insightPages + chartPages;
  }, 0);
}

async function generateDynamicPDFReport(reportResult: DynamicReportResult, searchTerm: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();
  
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
      color: rgb(0.3, 0.3, 0.3)
    });
    yPosition -= 30;

    // Section content summary
    const contentFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const contentText = `Data Points: ${section.metadata.dataPoints.toLocaleString()}, Confidence: ${(section.metadata.confidence * 100).toFixed(1)}%, AI Insights: ${section.aiInsights.length}`;
    page.drawText(contentText, {
      x: 50,
      y: yPosition,
      size: 10,
      font: contentFont,
      color: rgb(0.5, 0.5, 0.5)
    });
    yPosition -= 50;
  }

  return Buffer.from(await pdfDoc.save());
}

async function generateDynamicPPTReport(reportResult: DynamicReportResult, searchTerm: string): Promise<Buffer> {
  const pptx = new pptxgen();
  
  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText(`Dynamic AI Report: ${searchTerm}`, {
    x: 1, y: 1, w: 8, h: 2,
    fontSize: 24,
    bold: true,
    color: '363636'
  });
  titleSlide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
    x: 1, y: 3, w: 8, h: 1,
    fontSize: 14,
    color: '666666'
  });

  // Summary slide
  const summarySlide = pptx.addSlide();
  summarySlide.addText('Report Summary', {
    x: 0.5, y: 0.5, w: 9, h: 0.5,
    fontSize: 18,
    bold: true
  });

  const summaryData = [
    ['Metric', 'Value'],
    ['Total Sections', reportResult.summary.totalSections.toString()],
    ['Total Pages', reportResult.summary.totalPages.toString()],
    ['AI Insights', reportResult.summary.aiInsightsCount.toString()],
    ['Visualizations', reportResult.summary.visualizationsCount.toString()]
  ];

  summarySlide.addTable(summaryData, {
    x: 0.5, y: 1.5, w: 9, h: 2,
    fontSize: 12
  });

  // Add section slides
  for (const section of reportResult.sections) {
    const sectionSlide = pptx.addSlide();
    sectionSlide.addText(section.title, {
      x: 0.5, y: 0.5, w: 9, h: 0.5,
      fontSize: 16,
      bold: true
    });

    const sectionInfo = [
      ['Data Points', section.metadata.dataPoints.toLocaleString()],
      ['Confidence', `${(section.metadata.confidence * 100).toFixed(1)}%`],
      ['AI Insights', section.aiInsights.length.toString()],
      ['Visualizations', section.visualizations.length.toString()]
    ];

    sectionSlide.addTable(sectionInfo, {
      x: 0.5, y: 1.5, w: 4, h: 1.5,
      fontSize: 12
    });
  }

  return Buffer.from(await pptx.write('nodebuffer'));
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Dynamic Report Generator API',
    version: '2.0.0',
    features: [
      'Unlimited sections',
      'AI-powered insights',
      'Dynamic data analysis',
      'Multiple export formats',
      'Real-time analytics'
    ],
    reportTypes: Object.keys(REPORT_TYPE_CONFIGS)
  });
} 