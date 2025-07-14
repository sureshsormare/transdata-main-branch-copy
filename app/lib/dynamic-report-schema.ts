// Dynamic Extensible Report Schema for Advanced Pharma Trade Analytics
// Supports unlimited sections, data-driven content, and AI-powered insights

export interface DynamicReportSection {
  id: string;
  title: string;
  type: 'executive' | 'market' | 'competitive' | 'trend' | 'regional' | 'regulatory' | 'supply-chain' | 'pricing' | 'ai-insights' | 'strategic' | 'appendix' | 'custom';
  priority: number;
  isRequired: boolean;
  isExpandable: boolean;
  maxEntries?: number; // undefined = unlimited
  dataSource: string;
  analytics: string[];
  visualizations: string[];
  aiInsights: boolean;
  customFields?: Record<string, any>;
}

export interface DynamicReportConfig {
  reportId: string;
  searchTerm: string;
  reportType: keyof typeof REPORT_TYPE_CONFIGS | 'custom';
  format: 'pdf' | 'ppt' | 'html';
  sections: DynamicReportSection[];
  dataFilters: {
    dateRange?: { start: string; end: string };
    countries?: string[];
    suppliers?: string[];
    buyers?: string[];
    priceRange?: { min: number; max: number };
    categories?: string[];
  };
  aiSettings: {
    enableInsights: boolean;
    enablePredictions: boolean;
    enableAnomalyDetection: boolean;
    enableTrendAnalysis: boolean;
    confidenceThreshold: number;
    maxInsightsPerSection: number;
  };
  visualizationSettings: {
    chartTypes: string[];
    colorScheme: string;
    includeInteractive: boolean;
    maxChartsPerSection: number;
  };
  exportSettings: {
    includeRawData: boolean;
    includeMethodology: boolean;
    includeSources: boolean;
    maxPages?: number; // undefined = unlimited
  };
}

export interface DynamicReportData {
  sectionId: string;
  title: string;
  content: any;
  analytics: any[];
  visualizations: any[];
  aiInsights: any[];
  metadata: {
    dataPoints: number;
    timeRange: string;
    confidence: number;
    lastUpdated: string;
  };
}

export interface DynamicReportResult {
  reportId: string;
  config: DynamicReportConfig;
  sections: DynamicReportData[];
  summary: {
    totalSections: number;
    totalPages: number;
    totalDataPoints: number;
    aiInsightsCount: number;
    visualizationsCount: number;
    generationTime: number;
  };
  metadata: {
    createdAt: string;
    expiresAt: string;
    version: string;
    generatedBy: string;
  };
}

// Predefined section templates for different report types
export const SECTION_TEMPLATES = {
  executive: {
    id: 'executive-summary',
    title: 'Executive Summary',
    type: 'executive' as const,
    priority: 1,
    isRequired: true,
    isExpandable: false,
    dataSource: 'aggregated',
    analytics: ['market-size', 'growth-rate', 'key-findings'],
    visualizations: ['summary-chart', 'key-metrics'],
    aiInsights: true
  },
  marketIntelligence: {
    id: 'market-intelligence',
    title: 'Market Intelligence',
    type: 'market' as const,
    priority: 2,
    isRequired: true,
    isExpandable: true,
    dataSource: 'market-data',
    analytics: ['market-size', 'growth-rate', 'maturity', 'drivers', 'barriers'],
    visualizations: ['market-trends', 'growth-chart', 'drivers-analysis'],
    aiInsights: true
  },
  competitiveLandscape: {
    id: 'competitive-landscape',
    title: 'Competitive Landscape',
    type: 'competitive' as const,
    priority: 3,
    isRequired: true,
    isExpandable: true,
    dataSource: 'supplier-buyer-data',
    analytics: ['market-share', 'concentration', 'competitive-intensity'],
    visualizations: ['market-share-chart', 'competitive-map', 'hhi-analysis'],
    aiInsights: true
  },
  trendAnalysis: {
    id: 'trend-analysis',
    title: 'Trend Analysis & Forecasting',
    type: 'trend' as const,
    priority: 4,
    isRequired: true,
    isExpandable: true,
    dataSource: 'historical-data',
    analytics: ['trend-patterns', 'seasonality', 'forecasting'],
    visualizations: ['trend-charts', 'forecast-models', 'seasonal-analysis'],
    aiInsights: true
  },
  regionalAnalysis: {
    id: 'regional-analysis',
    title: 'Regional Market Analysis',
    type: 'regional' as const,
    priority: 5,
    isRequired: false,
    isExpandable: true,
    dataSource: 'geographic-data',
    analytics: ['regional-share', 'growth-by-region', 'opportunities'],
    visualizations: ['regional-map', 'regional-comparison'],
    aiInsights: true
  },
  regulatoryEnvironment: {
    id: 'regulatory-environment',
    title: 'Regulatory Environment',
    type: 'regulatory' as const,
    priority: 6,
    isRequired: false,
    isExpandable: true,
    dataSource: 'regulatory-data',
    analytics: ['compliance-requirements', 'regulatory-changes'],
    visualizations: ['regulatory-timeline', 'compliance-matrix'],
    aiInsights: true
  },
  supplyChainAnalysis: {
    id: 'supply-chain-analysis',
    title: 'Supply Chain Analysis',
    type: 'supply-chain' as const,
    priority: 7,
    isRequired: false,
    isExpandable: true,
    dataSource: 'logistics-data',
    analytics: ['route-efficiency', 'bottlenecks', 'optimization'],
    visualizations: ['supply-chain-map', 'efficiency-chart'],
    aiInsights: true
  },
  pricingAnalysis: {
    id: 'pricing-analysis',
    title: 'Pricing Analysis',
    type: 'pricing' as const,
    priority: 8,
    isRequired: false,
    isExpandable: true,
    dataSource: 'pricing-data',
    analytics: ['price-trends', 'volatility', 'competitive-pricing'],
    visualizations: ['price-charts', 'volatility-analysis'],
    aiInsights: true
  },
  aiInsights: {
    id: 'ai-insights',
    title: 'AI-Powered Insights',
    type: 'ai-insights' as const,
    priority: 9,
    isRequired: false,
    isExpandable: true,
    dataSource: 'ai-analysis',
    analytics: ['anomaly-detection', 'pattern-recognition', 'predictions'],
    visualizations: ['insight-charts', 'prediction-models'],
    aiInsights: true
  },
  strategicRecommendations: {
    id: 'strategic-recommendations',
    title: 'Strategic Recommendations',
    type: 'strategic' as const,
    priority: 10,
    isRequired: true,
    isExpandable: true,
    dataSource: 'strategic-analysis',
    analytics: ['opportunity-assessment', 'risk-analysis', 'implementation'],
    visualizations: ['recommendation-matrix', 'timeline'],
    aiInsights: true
  },
  appendices: {
    id: 'appendices',
    title: 'Appendices & Methodology',
    type: 'appendix' as const,
    priority: 11,
    isRequired: false,
    isExpandable: true,
    dataSource: 'methodology',
    analytics: ['data-sources', 'definitions', 'assumptions'],
    visualizations: ['methodology-flow', 'data-quality'],
    aiInsights: false
  }
};

// Report type configurations
export const REPORT_TYPE_CONFIGS = {
  comprehensive: {
    name: 'Comprehensive Global Report',
    description: 'Complete analysis covering all aspects of the market',
    sections: [
      SECTION_TEMPLATES.executive,
      SECTION_TEMPLATES.marketIntelligence,
      SECTION_TEMPLATES.competitiveLandscape,
      SECTION_TEMPLATES.trendAnalysis,
      SECTION_TEMPLATES.regionalAnalysis,
      SECTION_TEMPLATES.regulatoryEnvironment,
      SECTION_TEMPLATES.supplyChainAnalysis,
      SECTION_TEMPLATES.pricingAnalysis,
      SECTION_TEMPLATES.aiInsights,
      SECTION_TEMPLATES.strategicRecommendations,
      SECTION_TEMPLATES.appendices
    ],
    aiSettings: {
      enableInsights: true,
      enablePredictions: true,
      enableAnomalyDetection: true,
      enableTrendAnalysis: true,
      confidenceThreshold: 0.8,
      maxInsightsPerSection: 10
    }
  },
  'market-analysis': {
    name: 'Market Analysis Report',
    description: 'Focused market intelligence and analysis',
    sections: [
      SECTION_TEMPLATES.executive,
      SECTION_TEMPLATES.marketIntelligence,
      SECTION_TEMPLATES.trendAnalysis,
      SECTION_TEMPLATES.regionalAnalysis,
      SECTION_TEMPLATES.strategicRecommendations
    ],
    aiSettings: {
      enableInsights: true,
      enablePredictions: true,
      enableAnomalyDetection: false,
      enableTrendAnalysis: true,
      confidenceThreshold: 0.85,
      maxInsightsPerSection: 5
    }
  },
  'competitive-intelligence': {
    name: 'Competitive Intelligence Report',
    description: 'Deep dive into competitive landscape',
    sections: [
      SECTION_TEMPLATES.executive,
      SECTION_TEMPLATES.competitiveLandscape,
      SECTION_TEMPLATES.marketIntelligence,
      SECTION_TEMPLATES.aiInsights,
      SECTION_TEMPLATES.strategicRecommendations
    ],
    aiSettings: {
      enableInsights: true,
      enablePredictions: false,
      enableAnomalyDetection: true,
      enableTrendAnalysis: false,
      confidenceThreshold: 0.9,
      maxInsightsPerSection: 8
    }
  },
  'trend-forecast': {
    name: 'Trend Forecast Report',
    description: 'Future-focused trend analysis and predictions',
    sections: [
      SECTION_TEMPLATES.executive,
      SECTION_TEMPLATES.trendAnalysis,
      SECTION_TEMPLATES.aiInsights,
      SECTION_TEMPLATES.strategicRecommendations
    ],
    aiSettings: {
      enableInsights: true,
      enablePredictions: true,
      enableAnomalyDetection: true,
      enableTrendAnalysis: true,
      confidenceThreshold: 0.75,
      maxInsightsPerSection: 15
    }
  }
};

// Analytics function definitions
export const ANALYTICS_FUNCTIONS = {
  'market-size': {
    name: 'Market Size Analysis',
    description: 'Calculate total market value and volume',
    parameters: ['data', 'timeRange', 'currency'],
    returnType: 'MarketSizeMetrics'
  },
  'growth-rate': {
    name: 'Growth Rate Analysis',
    description: 'Calculate market growth rates and trends',
    parameters: ['data', 'timeRange', 'period'],
    returnType: 'GrowthMetrics'
  },
  'market-share': {
    name: 'Market Share Analysis',
    description: 'Calculate market share for suppliers and buyers',
    parameters: ['data', 'groupBy', 'metric'],
    returnType: 'MarketShareMetrics'
  },
  'trend-patterns': {
    name: 'Trend Pattern Analysis',
    description: 'Identify and analyze market trends',
    parameters: ['data', 'timeRange', 'sensitivity'],
    returnType: 'TrendMetrics'
  },
  'anomaly-detection': {
    name: 'Anomaly Detection',
    description: 'Detect unusual patterns and outliers',
    parameters: ['data', 'threshold', 'method'],
    returnType: 'AnomalyMetrics'
  },
  'forecasting': {
    name: 'Forecasting Analysis',
    description: 'Predict future market trends',
    parameters: ['data', 'horizon', 'model'],
    returnType: 'ForecastMetrics'
  }
};

// Visualization templates
export const VISUALIZATION_TEMPLATES = {
  'summary-chart': {
    name: 'Summary Chart',
    type: 'chart',
    chartType: 'bar',
    description: 'Key metrics summary visualization'
  },
  'market-trends': {
    name: 'Market Trends',
    type: 'chart',
    chartType: 'line',
    description: 'Market trends over time'
  },
  'market-share-chart': {
    name: 'Market Share',
    type: 'chart',
    chartType: 'pie',
    description: 'Market share distribution'
  },
  'competitive-map': {
    name: 'Competitive Map',
    type: 'chart',
    chartType: 'scatter',
    description: 'Competitive positioning map'
  },
  'trend-charts': {
    name: 'Trend Charts',
    type: 'chart',
    chartType: 'line',
    description: 'Trend analysis charts'
  },
  'regional-map': {
    name: 'Regional Map',
    type: 'map',
    chartType: 'choropleth',
    description: 'Geographic market distribution'
  }
};

export function createDynamicReportConfig(
  searchTerm: string,
  reportType: keyof typeof REPORT_TYPE_CONFIGS | 'custom',
  customSections?: DynamicReportSection[]
): DynamicReportConfig {
  if (reportType === 'custom') {
    return {
      reportId: generateReportId(),
      searchTerm,
      reportType,
      format: 'pdf',
      sections: customSections || [],
      dataFilters: {},
      aiSettings: {
        enableInsights: true,
        enablePredictions: true,
        enableAnomalyDetection: true,
        enableTrendAnalysis: true,
        confidenceThreshold: 0.8,
        maxInsightsPerSection: 10
      },
      visualizationSettings: {
        chartTypes: ['bar', 'line', 'pie', 'scatter', 'area'],
        colorScheme: 'pharma-blue',
        includeInteractive: true,
        maxChartsPerSection: 5
      },
      exportSettings: {
        includeRawData: true,
        includeMethodology: true,
        includeSources: true
      }
    };
  }
  
  const baseConfig = REPORT_TYPE_CONFIGS[reportType];
  
  return {
    reportId: generateReportId(),
    searchTerm,
    reportType,
    format: 'pdf',
    sections: customSections || baseConfig.sections,
    dataFilters: {},
    aiSettings: baseConfig.aiSettings,
    visualizationSettings: {
      chartTypes: ['bar', 'line', 'pie', 'scatter', 'area'],
      colorScheme: 'pharma-blue',
      includeInteractive: true,
      maxChartsPerSection: 5
    },
    exportSettings: {
      includeRawData: true,
      includeMethodology: true,
      includeSources: true
    }
  };
}

function generateReportId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
} 