// app/types/trade-data.ts
// Shared types and utilities for trade data across the application

export interface TradeData {
  id: string;
  buyer_address?: string;
  buyer_city_state?: string;
  buyer_contact_no?: string;
  buyer_email_id?: string;
  buyer_name?: string;
  chapter?: string;
  country_of_destination?: string;
  country_of_origin?: string;
  currency?: string;
  cush?: string;
  drawback?: string;
  exchange_rate_usd?: string;
  exporter_pin?: string;
  hs_code?: string;
  iec?: string;
  incoterm?: string;
  incoterm_value?: string;
  invoice_no?: string;
  invoice_serial_number?: string;
  item_number?: string;
  item_rate?: string;
  mode?: string;
  month?: string;
  port_code?: string;
  port_of_destination?: string;
  port_of_origin?: string;
  product_description?: string;
  quantity?: string;
  shipping_bill_date?: string;
  shipping_bill_no?: string;
  state?: string;
  supplier_address?: string;
  supplier_city_state?: string;
  supplier_contact_no?: string;
  supplier_email_id?: string;
  supplier_name?: string;
  total_amount_fc?: string;
  total_value_usd?: string;
  unit_rate_usd?: string;
  unit_value_inr?: string;
  uqc?: string;
  year?: string;
  // New fields for dual-view analysis
  tradeDirection?: 'import' | 'export';  // Whether India is importing or exporting
  sourceCountry?: string;                 // Country where shipment originates
  destinationCountry?: string;            // Country where shipment is destined
  isIndiaInvolved?: boolean;              // Whether India is part of this trade
}

// Helper function to format large numbers
export function formatLargeNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "0";
  const num = parseFloat(value.toString() || "0");
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}Bn`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}Mn`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toLocaleString();
}