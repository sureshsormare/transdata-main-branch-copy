export interface SupplierCustomerData {
  supplier: {
    name: string
    totalValue: number
    totalShipments: number
    marketShare: number
    totalCustomers: number
  }
  customers: Array<{
    name: string
    value: number
    shipments: number
    percentage: number
  }>
}

export interface GeographicData {
  country: {
    name: string
    totalValue: number
    totalShipments: number
    marketShare: number
    totalImporters: number
  }
  importers: Array<{
    name: string
    value: number
    shipments: number
    percentage: number
  }>
}

export interface QuickSummaryResponse {
  type: string
  dateRange: string
  topSuppliers?: SupplierCustomerData[]
  topCountries?: GeographicData[]
  summary: {
    totalValue: number
    totalShipments: number
    averageValue: number
    supplierCount?: number
    countryCount?: number
  }
} 