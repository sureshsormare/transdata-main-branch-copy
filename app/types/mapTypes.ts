export interface CountryData {
  countryCode: string; // ISO 3166-1 alpha-3
  countryName: string;
  region: 'Asia Pacific' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Middle East';
  hasData: boolean;
  dataQuality?: 'high' | 'medium' | 'low';
  lastUpdated?: Date;
  coordinates?: [number, number]; // [longitude, latitude]
}

export interface RegionStats {
  region: string;
  totalCountries: number;
  countriesWithData: number;
  coverage: number; // percentage
}

export interface RegionData {
  region: string;
  totalCountries: number;
  countriesWithData: number;
  coverage: number;
  countries: CountryData[];
}

export interface PharmaTradeData {
  [key: string]: RegionData;
}

export interface MapProps {
  data: PharmaTradeData;
  onRegionSelect?: (regionKey: string | null) => void;
  onCountryHover?: (country: CountryData | null) => void;
} 