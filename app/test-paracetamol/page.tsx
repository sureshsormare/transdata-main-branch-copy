'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Calendar, DollarSign, Package, Building2, User, Info } from 'lucide-react'

interface ParacetamolRecord {
  id: string
  supplier_name: string
  buyer_name: string
  product_description: string
  shipping_bill_date: string
  total_value_usd: string
  quantity: string
  hs_code: string
  country_of_destination: string
  port_of_destination: string
  invoice_no: string
  shipping_bill_no: string
}

interface ApiResponse {
  success: boolean
  message: string
  totalRecords: number
  records: ParacetamolRecord[]
  queryTime: number
  dateRange: string
  debugInfo?: {
    dateFormats: string[]
    sampleDates: string[]
    dateAnalysis: {
      totalSamples: number
      uniqueFormats: number
    }
  }
}

export default function TestParacetamolPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLatestParacetamol = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/quicksummary/latest-paracetamol?limit=20&year=2025&month=05')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError('Failed to fetch data')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestParacetamol()
  }, [])

  const formatCurrency = (value: string) => {
    const num = parseFloat(value || '0')
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return dateString
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Paracetamol Records Test
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Testing the optimized API for finding latest 20 paracetamol records from May 2025
          </p>
          
          <Button 
            onClick={fetchLatestParacetamol} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Refresh Data'
            )}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  API Response Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{data.totalRecords}</div>
                    <div className="text-sm text-gray-600">Total Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{data.queryTime}ms</div>
                    <div className="text-sm text-gray-600">Query Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{data.dateRange}</div>
                    <div className="text-sm text-gray-600">Date Range</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {data.success ? '✅' : '❌'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{data.message}</p>
              </CardContent>
            </Card>

            {/* Debug Information */}
            {data.debugInfo && (
              <Card className="bg-white shadow-lg border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <Info className="h-5 w-5" />
                    Debug Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Date Analysis</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Total Samples:</span> {data.debugInfo.dateAnalysis.totalSamples}</p>
                        <p><span className="font-medium">Unique Formats:</span> {data.debugInfo.dateAnalysis.uniqueFormats}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Sample Dates Found</h4>
                      <div className="space-y-1">
                        {data.debugInfo.sampleDates.slice(0, 5).map((date, index) => (
                          <div key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                            "{date}"
                          </div>
                        ))}
                        {data.debugInfo.sampleDates.length > 5 && (
                          <div className="text-sm text-gray-500">
                            ... and {data.debugInfo.sampleDates.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">May 2025 Date Formats Tried</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {data.debugInfo.dateFormats.map((format, index) => (
                        <div key={index} className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-800">
                          {format}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Records */}
            {data.records.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.records.map((record, index) => (
                  <Card key={record.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Record #{index + 1}</CardTitle>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {record.hs_code || 'N/A'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                            <Calendar className="h-4 w-4" />
                            Date
                          </div>
                          <p className="text-gray-900 font-mono text-sm">{formatDate(record.shipping_bill_date)}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                            <DollarSign className="h-4 w-4" />
                            Value
                          </div>
                          <p className="text-gray-900 font-semibold">{formatCurrency(record.total_value_usd)}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                          <Building2 className="h-4 w-4" />
                          Supplier
                        </div>
                        <p className="text-gray-900">{record.supplier_name || 'N/A'}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                          <User className="h-4 w-4" />
                          Buyer
                        </div>
                        <p className="text-gray-900">{record.buyer_name || 'N/A'}</p>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Product Description</div>
                        <p className="text-gray-900 text-sm">{record.product_description || 'N/A'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">Quantity</div>
                          <p className="text-gray-900">{record.quantity || 'N/A'}</p>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">Destination</div>
                          <p className="text-gray-900">{record.country_of_destination || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">Invoice No</div>
                          <p className="text-gray-900 text-sm">{record.invoice_no || 'N/A'}</p>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">Bill No</div>
                          <p className="text-gray-900 text-sm">{record.shipping_bill_no || 'N/A'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No paracetamol records found for the specified criteria.</p>
                    {data.debugInfo && (
                      <p className="text-sm text-gray-500 mt-2">
                        Check the debug information above to see what date formats exist in the database.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}