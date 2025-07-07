import DynamicReportGenerator from "../components/DynamicReportGenerator";

export const metadata = {
  title: "Dynamic AI Report Generator | TransData Nexus",
  description: "Generate comprehensive, AI-powered pharmaceutical trade reports with unlimited sections, advanced analytics, and real-time insights. No fixed limits on data or content.",
  keywords: "AI report generator, pharmaceutical analytics, dynamic reports, market intelligence, competitive analysis, trend forecasting"
};

export default function DynamicReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dynamic AI Report Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate comprehensive, AI-powered pharmaceutical trade reports with unlimited sections, 
            advanced analytics, and real-time insights. No fixed limits on data or content.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Unlimited Sections</h3>
            <p className="text-gray-600">
              Generate reports with unlimited sections and data points. No artificial limits on content depth or breadth.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Advanced AI analytics provide intelligent insights, anomaly detection, trend predictions, and strategic recommendations.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-purple-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Analytics</h3>
            <p className="text-gray-600">
              Dynamic data analysis with real-time processing, interactive visualizations, and comprehensive market intelligence.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600 mb-2">Comprehensive Global Report</h3>
              <p className="text-sm text-gray-600 mb-3">Complete analysis covering all aspects of the market</p>
              <div className="text-xs text-gray-500">
                <div>• 11 sections</div>
                <div>• 50-100 pages</div>
                <div>• Full AI insights</div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-green-600 mb-2">Market Analysis Report</h3>
              <p className="text-sm text-gray-600 mb-3">Focused market intelligence and analysis</p>
              <div className="text-xs text-gray-500">
                <div>• 5 sections</div>
                <div>• 25-40 pages</div>
                <div>• Market insights</div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-purple-600 mb-2">Competitive Intelligence</h3>
              <p className="text-sm text-gray-600 mb-3">Deep dive into competitive landscape</p>
              <div className="text-xs text-gray-500">
                <div>• 5 sections</div>
                <div>• 30-50 pages</div>
                <div>• Competitive analysis</div>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-orange-600 mb-2">Trend Forecast Report</h3>
              <p className="text-sm text-gray-600 mb-3">Future-focused trend analysis and predictions</p>
              <div className="text-xs text-gray-500">
                <div>• 4 sections</div>
                <div>• 20-35 pages</div>
                <div>• Predictive analytics</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-4">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">AI Analytics Engine</h3>
              <ul className="text-sm space-y-1">
                <li>• Market size analysis</li>
                <li>• Growth rate calculations</li>
                <li>• Competitive landscape mapping</li>
                <li>• Anomaly detection</li>
                <li>• Trend forecasting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dynamic Content</h3>
              <ul className="text-sm space-y-1">
                <li>• Unlimited sections</li>
                <li>• Real-time data processing</li>
                <li>• Interactive visualizations</li>
                <li>• Custom configurations</li>
                <li>• Multiple export formats</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Export Options</h3>
              <ul className="text-sm space-y-1">
                <li>• PDF documents</li>
                <li>• PowerPoint presentations</li>
                <li>• HTML browser view</li>
                <li>• Raw data inclusion</li>
                <li>• Methodology documentation</li>
              </ul>
            </div>
          </div>
        </div>

        <DynamicReportGenerator />
      </div>
    </div>
  );
} 