"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  Brain, 
  BarChart3, 
  Globe, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

interface DynamicReportConfig {
  searchTerm: string;
  reportType: 'comprehensive' | 'market-analysis' | 'competitive-intelligence' | 'trend-forecast' | 'custom';
  format: 'pdf' | 'pptx' | 'html';
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

interface ReportResult {
  reportId: string;
  fileName: string;
  downloadUrl: string;
  viewUrl: string;
  metadata: {
    searchTerm: string;
    reportType: string;
    format: string;
    totalSections: number;
    totalPages: number;
    aiInsightsCount: number;
    generationTime: number;
  };
}

const REPORT_TYPES = {
  comprehensive: {
    name: 'Comprehensive Global Report',
    description: 'Complete analysis covering all aspects of the market',
    icon: Globe,
    sections: 11,
    estimatedPages: '50-100'
  },
  'market-analysis': {
    name: 'Market Analysis Report',
    description: 'Focused market intelligence and analysis',
    icon: BarChart3,
    sections: 5,
    estimatedPages: '25-40'
  },
  'competitive-intelligence': {
    name: 'Competitive Intelligence Report',
    description: 'Deep dive into competitive landscape',
    icon: TrendingUp,
    sections: 5,
    estimatedPages: '30-50'
  },
  'trend-forecast': {
    name: 'Trend Forecast Report',
    description: 'Future-focused trend analysis and predictions',
    icon: Brain,
    sections: 4,
    estimatedPages: '20-35'
  },
  'custom': {
    name: 'Custom Report',
    description: 'Build your own report with custom sections',
    icon: Settings,
    sections: 0,
    estimatedPages: 'Variable'
  }
};

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Charts' },
  { value: 'line', label: 'Line Charts' },
  { value: 'pie', label: 'Pie Charts' },
  { value: 'scatter', label: 'Scatter Plots' },
  { value: 'area', label: 'Area Charts' },
  { value: 'heatmap', label: 'Heatmaps' }
];

const COLOR_SCHEMES = [
  { value: 'pharma-blue', label: 'Pharma Blue' },
  { value: 'medical-green', label: 'Medical Green' },
  { value: 'corporate-gray', label: 'Corporate Gray' },
  { value: 'vibrant-multi', label: 'Vibrant Multi' }
];

export default function DynamicReportGenerator() {
  const [config, setConfig] = useState<DynamicReportConfig>({
    searchTerm: '',
    reportType: 'comprehensive',
    format: 'pdf',
    aiSettings: {
      enableInsights: true,
      enablePredictions: true,
      enableAnomalyDetection: true,
      enableTrendAnalysis: true,
      confidenceThreshold: 0.8,
      maxInsightsPerSection: 10
    },
    visualizationSettings: {
      chartTypes: ['bar', 'line', 'pie'],
      colorScheme: 'pharma-blue',
      includeInteractive: true,
      maxChartsPerSection: 5
    },
    exportSettings: {
      includeRawData: true,
      includeMethodology: true,
      includeSources: true
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const handleGenerateReport = async () => {
    if (!config.searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/advanced-report-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const data = await response.json();
      setResult(data);

      // Reset progress after a delay
      setTimeout(() => setProgress(0), 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download error:', err);
      setError(`Failed to download report: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleViewReport = (viewUrl: string) => {
    window.open(viewUrl, '_blank');
  };

  const handleEmailDelivery = async (fileId: string, fileName: string) => {
    try {
      const email = prompt('Enter your email address to receive the report:');
      if (!email) return;
      
      const response = await fetch('/api/send-report-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fileId,
          fileName
        })
      });
      
      if (response.ok) {
        alert('Report will be sent to your email shortly!');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err) {
      console.error('Email error:', err);
      setError('Failed to send report via email');
    }
  };

  const handleShareLink = async (fileId: string) => {
    try {
      const shareUrl = `${window.location.origin}/api/download-report/${fileId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Pharmaceutical Trade Report`,
          text: `Check out this comprehensive market analysis report`,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Report link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share error:', err);
      setError('Failed to share report');
    }
  };

  const updateConfig = (updates: Partial<DynamicReportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const selectedReportType = REPORT_TYPES[config.reportType];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Dynamic AI Report Generator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate comprehensive, AI-powered pharmaceutical trade reports with unlimited sections, 
          advanced analytics, and real-time insights. No fixed limits on data or content.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Visualization
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>
                Configure the basic settings for your dynamic report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchTerm">Search Term / Product</Label>
                <Input
                  id="searchTerm"
                  placeholder="e.g., Paracetamol, Cisplatin, Antibiotics"
                  value={config.searchTerm}
                  onChange={(e) => updateConfig({ searchTerm: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Report Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(REPORT_TYPES).map(([key, report]) => {
                    const Icon = report.icon;
                    return (
                      <Card
                        key={key}
                        className={`cursor-pointer transition-all ${
                          config.reportType === key
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => updateConfig({ reportType: key as any })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className="w-6 h-6 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{report.name}</h3>
                              <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {report.sections} sections
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {report.estimatedPages} pages
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={config.format} onValueChange={(value) => updateConfig({ format: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
                    <SelectItem value="html">HTML (Browser View)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Analytics Settings</CardTitle>
              <CardDescription>
                Configure AI-powered insights and analysis features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableInsights"
                      checked={config.aiSettings?.enableInsights}
                      onCheckedChange={(checked) =>
                        updateConfig({
                          aiSettings: { ...config.aiSettings!, enableInsights: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="enableInsights">Enable AI Insights</Label>
                  </div>
                  <p className="text-xs text-gray-600">Generate intelligent insights from data patterns</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enablePredictions"
                      checked={config.aiSettings?.enablePredictions}
                      onCheckedChange={(checked) =>
                        updateConfig({
                          aiSettings: { ...config.aiSettings!, enablePredictions: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="enablePredictions">Enable Predictions</Label>
                  </div>
                  <p className="text-xs text-gray-600">Generate future trend predictions</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableAnomalyDetection"
                      checked={config.aiSettings?.enableAnomalyDetection}
                      onCheckedChange={(checked) =>
                        updateConfig({
                          aiSettings: { ...config.aiSettings!, enableAnomalyDetection: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="enableAnomalyDetection">Anomaly Detection</Label>
                  </div>
                  <p className="text-xs text-gray-600">Detect unusual patterns and outliers</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableTrendAnalysis"
                      checked={config.aiSettings?.enableTrendAnalysis}
                      onCheckedChange={(checked) =>
                        updateConfig({
                          aiSettings: { ...config.aiSettings!, enableTrendAnalysis: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="enableTrendAnalysis">Trend Analysis</Label>
                  </div>
                  <p className="text-xs text-gray-600">Advanced trend pattern recognition</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidenceThreshold">
                  Confidence Threshold: {((config.aiSettings?.confidenceThreshold || 0.8) * 100).toFixed(0)}%
                </Label>
                <input
                  id="confidenceThreshold"
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={config.aiSettings?.confidenceThreshold || 0.8}
                  onChange={(e) =>
                    updateConfig({
                      aiSettings: { ...config.aiSettings!, confidenceThreshold: parseFloat(e.target.value) }
                    })
                  }
                  className="w-full"
                />
                <p className="text-xs text-gray-600">Minimum confidence level for AI insights</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxInsights">Max Insights per Section</Label>
                <Input
                  id="maxInsights"
                  type="number"
                  min="1"
                  max="50"
                  value={config.aiSettings?.maxInsightsPerSection || 10}
                  onChange={(e) =>
                    updateConfig({
                      aiSettings: { ...config.aiSettings!, maxInsightsPerSection: parseInt(e.target.value) }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualization Settings</CardTitle>
              <CardDescription>
                Configure charts, colors, and visual elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chart Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CHART_TYPES.map((chart) => (
                    <div key={chart.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={chart.value}
                        checked={config.visualizationSettings?.chartTypes.includes(chart.value)}
                        onCheckedChange={(checked) => {
                          const current = config.visualizationSettings?.chartTypes || [];
                          const updated = checked
                            ? [...current, chart.value]
                            : current.filter(c => c !== chart.value);
                          updateConfig({
                            visualizationSettings: { ...config.visualizationSettings!, chartTypes: updated }
                          });
                        }}
                      />
                      <Label htmlFor={chart.value} className="text-sm">{chart.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select 
                  value={config.visualizationSettings?.colorScheme} 
                  onValueChange={(value) =>
                    updateConfig({
                      visualizationSettings: { ...config.visualizationSettings!, colorScheme: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_SCHEMES.map((scheme) => (
                      <SelectItem key={scheme.value} value={scheme.value}>
                        {scheme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeInteractive"
                    checked={config.visualizationSettings?.includeInteractive}
                    onCheckedChange={(checked) =>
                      updateConfig({
                        visualizationSettings: { ...config.visualizationSettings!, includeInteractive: checked as boolean }
                      })
                    }
                  />
                  <Label htmlFor="includeInteractive">Include Interactive Charts</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCharts">Max Charts per Section</Label>
                <Input
                  id="maxCharts"
                  type="number"
                  min="1"
                  max="20"
                  value={config.visualizationSettings?.maxChartsPerSection || 5}
                  onChange={(e) =>
                    updateConfig({
                      visualizationSettings: { ...config.visualizationSettings!, maxChartsPerSection: parseInt(e.target.value) }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
              <CardDescription>
                Configure additional content and export options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeRawData"
                      checked={config.exportSettings?.includeRawData}
                      onCheckedChange={(checked) =>
                        updateConfig({
                          exportSettings: { ...config.exportSettings!, includeRawData: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="includeRawData">Include Raw Data</Label>
                  </div>
                  <p className="text-xs text-gray-600">Add raw data tables to appendices</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeMethodology"
                      checked={config.exportSettings?.includeMethodology}
                      onCheckedChange={(checked) =>
                        updateConfig({
                          exportSettings: { ...config.exportSettings!, includeMethodology: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="includeMethodology">Include Methodology</Label>
                  </div>
                  <p className="text-xs text-gray-600">Add detailed methodology section</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSources"
                      checked={config.exportSettings?.includeSources}
                      onCheckedChange={(checked) =>
                        updateConfig({
                          exportSettings: { ...config.exportSettings!, includeSources: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="includeSources">Include Data Sources</Label>
                  </div>
                  <p className="text-xs text-gray-600">List all data sources and references</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPages">Max Pages (Optional)</Label>
                <Input
                  id="maxPages"
                  type="number"
                  min="10"
                  max="1000"
                  placeholder="Leave empty for unlimited"
                  value={config.exportSettings?.maxPages || ''}
                  onChange={(e) =>
                    updateConfig({
                      exportSettings: { 
                        ...config.exportSettings!, 
                        maxPages: e.target.value ? parseInt(e.target.value) : undefined 
                      }
                    })
                  }
                />
                <p className="text-xs text-gray-600">Set maximum page limit (optional)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Summary */}
      {selectedReportType && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedReportType.name}
                </h3>
                <p className="text-gray-600 mt-1">{selectedReportType.description}</p>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{selectedReportType.sections} sections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">{selectedReportType.estimatedPages} pages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">AI-powered insights</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {config.format.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">Format</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating || !config.searchTerm.trim()}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <Zap className="w-5 h-5 mr-2 animate-pulse" />
              Generating Report...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Generate Dynamic Report
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generating Report...</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>This may take 30-60 seconds for comprehensive reports</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">Report Generated Successfully!</h3>
                <p className="text-green-700">Your dynamic AI report is ready for download and viewing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.metadata.totalSections}</div>
                <div className="text-sm text-gray-600">Sections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.metadata.totalPages}</div>
                <div className="text-sm text-gray-600">Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{result.metadata.aiInsightsCount}</div>
                <div className="text-sm text-gray-600">AI Insights</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{result.metadata.format.toUpperCase()}</div>
                <div className="text-sm text-gray-600">Format</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-green-900 mb-4 text-center">Choose Your Download Option</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => handleDownload(result.downloadUrl, result.fileName)}
                  className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg h-auto"
                >
                  <Download className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold text-lg">1. Download</div>
                    <div className="text-sm opacity-90">Direct browser download</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleViewReport(result.viewUrl)}
                  className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg h-auto"
                >
                  <Eye className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold text-lg">2. View</div>
                    <div className="text-sm opacity-90">Open in browser</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleEmailDelivery(result.reportId, result.fileName)}
                  className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg h-auto"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-center">
                    <div className="font-semibold text-lg">3. Email</div>
                    <div className="text-sm opacity-90">Send to your email</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleShareLink(result.reportId)}
                  className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg h-auto"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <div className="text-center">
                    <div className="font-semibold text-lg">4. Share Link</div>
                    <div className="text-sm opacity-90">Get shareable URL</div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Report Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-600">Search Term:</span> {result.metadata.searchTerm}</div>
                <div><span className="text-gray-600">Report Type:</span> {result.metadata.reportType}</div>
                <div><span className="text-gray-600">Generation Time:</span> {new Date(result.metadata.generationTime).toLocaleTimeString()}</div>
                <div><span className="text-gray-600">Report ID:</span> {result.reportId}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 