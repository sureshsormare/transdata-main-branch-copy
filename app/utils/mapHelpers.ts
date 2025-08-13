import { CountryData } from '../types/mapTypes';

export const getCountryColor = (country: CountryData): string => {
  if (!country.hasData) return '#e5e7eb'; // Gray for no data
  
  const colors = {
    high: '#059669',    // Green
    medium: '#d97706',  // Orange
    low: '#dc2626',     // Red
  };
  
  return colors[country.dataQuality || 'low'] || '#e5e7eb';
};

export const getRegionColor = (region: string): string => {
  const colors = {
    'Asia Pacific': '#3b82f6',  // Blue
    'Europe': '#8b5cf6',        // Purple
    'North America': '#10b981', // Emerald
    'South America': '#f59e0b', // Amber
    'Africa': '#ef4444',        // Red
    'Middle East': '#06b6d4'    // Cyan
  };
  return colors[region as keyof typeof colors] || '#6b7280';
};

export const calculateCoverage = (countries: CountryData[]): number => {
  const total = countries.length;
  const withData = countries.filter(c => c.hasData).length;
  return total > 0 ? Number(((withData / total) * 100).toFixed(1)) : 0;
};

export const getCountryCoordinates = (countryCode: string): [number, number] => {
  // Sample coordinates for major countries
  const coordinates: Record<string, [number, number]> = {
    'CHN': [104.1954, 35.8617], // China
    'IND': [78.9629, 20.5937],  // India
    'JPN': [138.2529, 36.2048], // Japan
    'DEU': [10.4515, 51.1657],  // Germany
    'FRA': [2.2137, 46.2276],   // France
    'GBR': [-0.1278, 51.5074],  // UK
    'USA': [-95.7129, 37.0902], // USA
    'CAN': [-106.3468, 56.1304], // Canada
    'BRA': [-51.9253, -14.2350], // Brazil
    'ZAF': [24.9916, -30.5595], // South Africa
    'NGA': [8.6753, 9.0820],    // Nigeria
    'EGY': [30.8025, 26.8206],  // Egypt
    'TUR': [35.2433, 38.9637],  // Turkey
    'ISR': [34.8516, 31.0461],  // Israel
    'SAU': [45.0792, 23.8859],  // Saudi Arabia
    'ARE': [53.8478, 23.4241],  // UAE
    'MEX': [-102.5528, 23.6345], // Mexico
    'ARG': [-63.6167, -38.4161], // Argentina
    'CHL': [-71.5430, -35.6751], // Chile
    'COL': [-74.2973, 4.5709],  // Colombia
    'PER': [-75.0152, -9.1900], // Peru
    'VEN': [-66.5897, 6.4238],  // Venezuela
    'URY': [-55.7658, -32.5228], // Uruguay
    'GTM': [-90.2308, 15.7835], // Guatemala
    'HND': [-86.2419, 15.1999], // Honduras
    'SLV': [-88.8965, 13.7942], // El Salvador
    'NIC': [-85.2072, 12.8654], // Nicaragua
    'IRN': [53.6880, 32.4279],  // Iran
    'LBN': [35.8623, 33.8547],  // Lebanon
    'YEM': [48.5164, 15.5527],  // Yemen
    'SYR': [38.9968, 34.8021],  // Syria
  };
  
  return coordinates[countryCode] || [0, 0];
}; 