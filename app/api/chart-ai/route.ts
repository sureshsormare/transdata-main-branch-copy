import { NextRequest, NextResponse } from "next/server";

interface ChartDataPoint {
  name?: string;
  value: number;
  count?: number;
  month?: string;
  category?: string;
}

interface ChartAnalysisRequest {
  chartType: 'bar' | 'line' | 'pie' | 'trend';
  data: ChartDataPoint[];
  title: string;
  query?: string;
}

interface ChartInsight {
  type: 'trend' | 'anomaly' | 'pattern' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  action?: string;
  dataPoints?: number[];
  metrics?: {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    total: number;
  };
}

interface ChartAnalysisResponse {
  insights: ChartInsight[];
  summary: string;
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
  nextSteps: string[];
  confidence: number;
}

// Statistical analysis functions
function calculateStatistics(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const median = sorted.length % 2 === 0 
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    mean,
    median,
    stdDev,
    min: Math.min(...values),
    max: Math.max(...values),
    total: values.reduce((sum, val) => sum + val, 0)
  };
}

function detectAnomalies(values: number[], threshold = 2): number[] {
  const stats = calculateStatistics(values);
  const anomalies: number[] = [];
  
  values.forEach((value, index) => {
    const zScore = Math.abs((value - stats.mean) / stats.stdDev);
    if (zScore > threshold) {
      anomalies.push(index);
    }
  });
  
  return anomalies;
}

function analyzeTrend(values: number[]): { direction: 'increasing' | 'decreasing' | 'stable'; strength: number } {
  if (values.length < 2) return { direction: 'stable', strength: 0 };
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (Math.abs(change) < 5) return { direction: 'stable', strength: Math.abs(change) };
  return {
    direction: change > 0 ? 'increasing' : 'decreasing',
    strength: Math.abs(change)
  };
}

function generateChartInsights(data: ChartDataPoint[], chartType: string, title: string): ChartInsight[] {
  const insights: ChartInsight[] = [];
  const values = data.map(d => d.value);
  
  if (values.length === 0) return insights;
  
  const stats = calculateStatistics(values);
  const anomalies = detectAnomalies(values);
  const trend = analyzeTrend(values);
  
  // Trend Analysis
  if (chartType === 'line' || chartType === 'trend') {
    insights.push({
      type: 'trend',
      title: `${trend.direction.charAt(0).toUpperCase() + trend.direction.slice(1)} Trend Detected`,
      description: `The data shows a ${trend.direction} trend with ${trend.strength.toFixed(1)}% change. Values range from ${stats.min.toLocaleString()} to ${stats.max.toLocaleString()}.`,
      confidence: Math.min(0.95, 0.7 + (trend.strength / 100)),
      impact: trend.direction === 'increasing' ? 'positive' : 'negative',
      metrics: stats
    });
  }
  
  // Anomaly Detection
  if (anomalies.length > 0) {
    insights.push({
      type: 'anomaly',
      title: `${anomalies.length} Anomaly(ies) Detected`,
      description: `Found ${anomalies.length} data point(s) significantly above/below the average of ${stats.mean.toLocaleString()}.`,
      confidence: 0.85,
      impact: 'neutral',
      action: 'Investigate these outliers for potential opportunities or data quality issues.',
      dataPoints: anomalies,
      metrics: stats
    });
  }
  
  // Pattern Recognition
  if (chartType === 'pie' || chartType === 'bar') {
    const topItem = data.reduce((max, item) => item.value > max.value ? item : max);
    const percentage = (topItem.value / stats.total) * 100;
    
    insights.push({
      type: 'pattern',
      title: 'Dominant Category Identified',
      description: `${topItem.name || topItem.category || 'Top category'} represents ${percentage.toFixed(1)}% of total value.`,
      confidence: 0.90,
      impact: 'neutral',
      action: 'Consider diversifying or focusing strategy based on this concentration.',
      metrics: stats
    });
  }
  
  // Value-based Recommendations
  if (stats.total > 1000000) {
    insights.push({
      type: 'recommendation',
      title: 'High-Value Opportunity',
      description: `Total value exceeds $1M, indicating significant market potential.`,
      confidence: 0.80,
      impact: 'positive',
      action: 'Consider expanding operations or increasing investment in this area.',
      metrics: stats
    });
  }
  
  // Volatility Analysis
  const coefficientOfVariation = stats.stdDev / stats.mean;
  if (coefficientOfVariation > 0.5) {
    insights.push({
      type: 'pattern',
      title: 'High Volatility Detected',
      description: `Data shows high variability (CV: ${(coefficientOfVariation * 100).toFixed(1)}%), indicating market instability.`,
      confidence: 0.75,
      impact: 'negative',
      action: 'Implement risk management strategies and monitor closely.',
      metrics: stats
    });
  }
  
  return insights;
}

function generateAIResponse(query: string, insights: ChartInsight[], chartType: string, title: string): string {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('trend') || queryLower.includes('pattern')) {
    const trendInsight = insights.find(i => i.type === 'trend');
    if (trendInsight) {
      return trendInsight.description;
    }
  }
  
  if (queryLower.includes('anomaly') || queryLower.includes('outlier')) {
    const anomalyInsight = insights.find(i => i.type === 'anomaly');
    if (anomalyInsight) {
      return anomalyInsight.description + ' ' + (anomalyInsight.action || '');
    }
  }
  
  if (queryLower.includes('recommend') || queryLower.includes('suggest')) {
    const recommendations = insights
      .filter(i => i.type === 'recommendation')
      .map(i => i.action)
      .filter(Boolean);
    
    if (recommendations.length > 0) {
      return `Based on the ${title} analysis: ${recommendations.join(' ')}`;
    }
  }
  
  // Default response
  return `I can help you analyze the ${title} chart. I've identified ${insights.length} key insights including trends, anomalies, and patterns. What specific aspect would you like me to focus on?`;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChartAnalysisRequest = await request.json();
    
    if (!body.data || !Array.isArray(body.data) || body.data.length === 0) {
      return NextResponse.json(
        { error: 'Invalid chart data provided' },
        { status: 400 }
      );
    }
    
    // Generate insights
    const insights = generateChartInsights(body.data, body.chartType, body.title);
    
    // Generate summary
    const summary = `Analysis of ${body.title} reveals ${insights.length} key insights with ${insights.filter(i => i.impact === 'positive').length} positive indicators.`;
    
    // Generate recommendations
    const recommendations = insights
      .filter(i => i.type === 'recommendation')
      .map(i => i.action)
      .filter((action): action is string => Boolean(action));
    
    // Identify risk factors
    const riskFactors = insights
      .filter(i => i.impact === 'negative')
      .map(i => i.description);
    
    // Identify opportunities
    const opportunities = insights
      .filter(i => i.impact === 'positive')
      .map(i => i.description);
    
    // Generate next steps
    const nextSteps = [
      'Monitor trends for strategic planning',
      'Investigate anomalies for opportunities',
      'Consider data distribution for resource allocation'
    ];
    
    // Calculate overall confidence
    const confidence = insights.length > 0 
      ? insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length
      : 0;
    
    const response: ChartAnalysisResponse = {
      insights,
      summary,
      recommendations,
      riskFactors,
      opportunities,
      nextSteps,
      confidence
    };
    
    // Handle specific queries
    if (body.query) {
      const aiResponse = generateAIResponse(body.query, insights, body.chartType, body.title);
      return NextResponse.json({
        ...response,
        aiResponse
      });
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Chart AI analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze chart data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Chart AI Analysis API',
      endpoints: {
        POST: 'Analyze chart data and generate insights',
        GET: 'API information'
      }
    }
  );
} 