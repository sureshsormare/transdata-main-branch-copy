"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReportViewer from "./ReportViewer";
import { 
  FileText, 
  Download, 
  Brain, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Eye,
  FileDown,
  Sparkles,
  Target,
  Zap,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Play,
  Pause,
  Square
} from "lucide-react";

interface ReportConfig {
  searchTerm: string;
  reportType: 'comprehensive' | 'market-analysis' | 'competitive-intelligence' | 'trend-forecast';
  format: 'pdf' | 'ppt';
  includeCharts: boolean;
  includeAIInsights: boolean;
  customSections: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

interface ReportPreview {
  fileId: string;
  fileName: string;
  format: string;
  size: number;
  sections: string[];
  insights: number;
  recommendations: number;
  downloadUrl: string;
  preview: {
    executiveSummary: {
      keyFindings: string[];
      marketOverview: string;
      strategicRecommendations: string[];
      riskAssessment: string;
    };
    keyMetrics: {
      marketSize: number;
      growthRate: number;
      suppliers: number;
      buyers: number;
    };
  };
}

interface AdvancedReportGeneratorProps {
  searchTerm?: string;
  className?: string;
}

export default function AdvancedReportGenerator({ searchTerm = '', className = '' }: AdvancedReportGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [reportPreview, setReportPreview] = useState<ReportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const [config, setConfig] = useState<ReportConfig>({
    searchTerm: searchTerm,
    reportType: 'comprehensive',
    format: 'pdf',
    includeCharts: true,
    includeAIInsights: true,
    customSections: []
  });

  // Update config when searchTerm prop changes
  React.useEffect(() => {
    setConfig(prev => ({ ...prev, searchTerm }));
  }, [searchTerm]);

  const reportTypes = [
    {
      id: 'comprehensive',
      title: 'Comprehensive Analysis',
      description: 'Complete market intelligence with all sections',
      icon: FileText,
      features: ['Market Analysis', 'Competitive Intelligence', 'AI Insights', 'Strategic Recommendations']
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Focused on market trends and opportunities',
      icon: TrendingUp,
      features: ['Market Size', 'Growth Trends', 'Regional Analysis', 'Market Drivers']
    },
    {
      id: 'competitive-intelligence',
      title: 'Competitive Intelligence',
      description: 'Deep dive into competitive landscape',
      icon: Users,
      features: ['Competitor Analysis', 'Market Share', 'SWOT Analysis', 'Competitive Strategies']
    },
    {
      id: 'trend-forecast',
      title: 'Trend Forecast',
      description: 'Future predictions and scenario analysis',
      icon: BarChart3,
      features: ['Trend Analysis', 'Forecasting', 'Scenario Planning', 'Risk Assessment']
    }
  ];

  const availableSections = [
    'Executive Summary',
    'Market Intelligence',
    'Competitive Analysis',
    'Regional Analysis',
    'Supply Chain Analysis',
    'Pricing Analysis',
    'Regulatory Environment',
    'AI Insights',
    'Strategic Recommendations',
    'Risk Assessment',
    'Financial Analysis',
    'Technology Trends'
  ];

  const generateReport = async () => {
    if (!config.searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setCurrentStep('Initializing report generation...');

    try {
      // Simulate generation steps
      const steps = [
        'Analyzing market data...',
        'Generating competitive intelligence...',
        'Creating AI insights...',
        'Building visualizations...',
        'Compiling strategic recommendations...',
        'Finalizing report...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setGenerationProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      }

      // Call the API
      const response = await fetch('/api/advanced-report-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate report');
      }

      setReportPreview(result.report);
      setCurrentStep('Report generated successfully!');

    } catch (err) {
      console.error('Report generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async () => {
    if (!reportPreview) return;

    try {
      const response = await fetch(reportPreview.downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = reportPreview.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download report');
    }
  };

  // Alternative download methods
  const downloadViaEmail = async () => {
    if (!reportPreview) return;
    
    try {
      const email = prompt('Enter your email address to receive the report:');
      if (!email) return;
      
      const response = await fetch('/api/send-report-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fileId: reportPreview.fileId,
          fileName: reportPreview.fileName
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

  const downloadViaCloud = async () => {
    if (!reportPreview) return;
    
    try {
      // This would integrate with cloud storage services like Google Drive, Dropbox, etc.
      const response = await fetch('/api/upload-to-cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: reportPreview.fileId,
          fileName: reportPreview.fileName
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Report uploaded to cloud storage. Link: ${result.cloudUrl}`);
      } else {
        throw new Error('Failed to upload to cloud');
      }
    } catch (err) {
      console.error('Cloud upload error:', err);
      setError('Failed to upload report to cloud storage');
    }
  };

  const shareReport = async () => {
    if (!reportPreview) return;
    
    try {
      const shareUrl = `${window.location.origin}/api/download-report/${reportPreview.fileId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Pharmaceutical Trade Report - ${config.searchTerm}`,
          text: `Check out this comprehensive market analysis report for ${config.searchTerm}`,
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

  const viewReport = () => {
    if (!reportPreview) return;
    setShowViewer(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Don't show the component if no search term is provided
  if (!searchTerm) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Advanced Report Generator</h2>
              <p className="text-blue-100 text-sm">Generate comprehensive PDF/PPT reports for "{searchTerm}"</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {/* Report Type Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setConfig(prev => ({ ...prev, reportType: type.id as any }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          config.reportType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className={`w-5 h-5 ${
                            config.reportType === type.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                          <h4 className="font-semibold text-gray-900">{type.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {type.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Format</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, format: 'pdf' }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                      config.format === 'pdf'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">PDF Report</div>
                      <div className="text-sm opacity-75">Professional document format</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, format: 'ppt' }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                      config.format === 'ppt'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">PowerPoint</div>
                      <div className="text-sm opacity-75">Presentation format</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="mb-6">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Advanced Options
                  {showAdvancedOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={config.includeCharts}
                              onChange={(e) => setConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                              className="rounded"
                            />
                            <span className="font-medium">Include Charts & Visualizations</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={config.includeAIInsights}
                              onChange={(e) => setConfig(prev => ({ ...prev, includeAIInsights: e.target.checked }))}
                              className="rounded"
                            />
                            <span className="font-medium">Include AI Insights</span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate {config.format.toUpperCase()} Report
                    </>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{currentStep}</span>
                    <span className="text-sm text-gray-500">{generationProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Error: {error}</span>
                  </div>
                </div>
              )}

              {/* Report Preview */}
              {reportPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">Report Generated Successfully!</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-900 mb-3">Report Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">File Name:</span>
                          <span className="font-medium">{reportPreview.fileName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">{reportPreview.format.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium">{formatFileSize(reportPreview.size)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sections:</span>
                          <span className="font-medium">{reportPreview.sections.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">AI Insights:</span>
                          <span className="font-medium">{reportPreview.insights}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recommendations:</span>
                          <span className="font-medium">{reportPreview.recommendations}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-900 mb-3">Key Metrics Preview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Market Size:</span>
                          <span className="font-medium">${reportPreview.preview.keyMetrics.marketSize.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth Rate:</span>
                          <span className="font-medium">{reportPreview.preview.keyMetrics.growthRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Suppliers:</span>
                          <span className="font-medium">{reportPreview.preview.keyMetrics.suppliers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Buyers:</span>
                          <span className="font-medium">{reportPreview.preview.keyMetrics.buyers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-green-900 mb-4 text-center">Choose Your Download Option</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={downloadReport}
                        className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Download className="w-8 h-8" />
                        <div className="text-center">
                          <div className="font-semibold text-lg">1. Download</div>
                          <div className="text-sm opacity-90">Direct browser download</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={viewReport}
                        className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Eye className="w-8 h-8" />
                        <div className="text-center">
                          <div className="font-semibold text-lg">2. View</div>
                          <div className="text-sm opacity-90">Open in browser</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={downloadViaEmail}
                        className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div className="text-center">
                          <div className="font-semibold text-lg">3. Email</div>
                          <div className="text-sm opacity-90">Send to your email</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={shareReport}
                        className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <div className="text-center">
                          <div className="font-semibold text-lg">4. Share Link</div>
                          <div className="text-sm opacity-90">Get shareable URL</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Viewer Modal */}
      <AnimatePresence>
        {showViewer && reportPreview && (
          <ReportViewer
            fileId={reportPreview.fileId}
            searchTerm={config.searchTerm}
            onClose={() => setShowViewer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 