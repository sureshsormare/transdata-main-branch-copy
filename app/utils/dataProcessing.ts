import { CountryData, RegionData } from '../types/mapTypes';
import { getCountryCoordinates } from './mapHelpers';

export const processCountryData = (rawData: any[]): CountryData[] => {
  return rawData.map(country => ({
    ...country,
    coordinates: getCountryCoordinates(country.countryCode),
    lastUpdated: country.lastUpdated ? new Date(country.lastUpdated) : undefined
  }));
};

export const groupCountriesByRegion = (countries: CountryData[]): Record<string, CountryData[]> => {
  return countries.reduce((acc, country) => {
    const region = country.region;
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(country);
    return acc;
  }, {} as Record<string, CountryData[]>);
};

export const calculateRegionStats = (countries: CountryData[]): RegionData => {
  const totalCountries = countries.length;
  const countriesWithData = countries.filter(c => c.hasData).length;
  const coverage = totalCountries > 0 ? Number(((countriesWithData / totalCountries) * 100).toFixed(1)) : 0;
  
  return {
    region: countries[0]?.region || '',
    totalCountries,
    countriesWithData,
    coverage,
    countries
  };
};

// Sample pharmaceutical trade data with 6 regions
export const samplePharmaTradeData: Record<string, RegionData> = {
  'Asia Pacific': {
    region: 'Asia Pacific',
    totalCountries: 45,
    countriesWithData: 42,
    coverage: 93.3,
    countries: [
      { countryCode: 'CHN', countryName: 'China', region: 'Asia Pacific', hasData: true, dataQuality: 'high' },
      { countryCode: 'JPN', countryName: 'Japan', region: 'Asia Pacific', hasData: true, dataQuality: 'high' },
      { countryCode: 'IND', countryName: 'India', region: 'Asia Pacific', hasData: true, dataQuality: 'high' },
      { countryCode: 'KOR', countryName: 'South Korea', region: 'Asia Pacific', hasData: true, dataQuality: 'high' },
      { countryCode: 'AUS', countryName: 'Australia', region: 'Asia Pacific', hasData: true, dataQuality: 'high' },
      { countryCode: 'SGP', countryName: 'Singapore', region: 'Asia Pacific', hasData: true, dataQuality: 'medium' },
      { countryCode: 'THA', countryName: 'Thailand', region: 'Asia Pacific', hasData: true, dataQuality: 'medium' },
      { countryCode: 'MYS', countryName: 'Malaysia', region: 'Asia Pacific', hasData: true, dataQuality: 'medium' },
      { countryCode: 'IDN', countryName: 'Indonesia', region: 'Asia Pacific', hasData: true, dataQuality: 'low' },
      { countryCode: 'PHL', countryName: 'Philippines', region: 'Asia Pacific', hasData: false }
    ]
  },
  'Europe': {
    region: 'Europe',
    totalCountries: 44,
    countriesWithData: 41,
    coverage: 93.2,
    countries: [
      { countryCode: 'DEU', countryName: 'Germany', region: 'Europe', hasData: true, dataQuality: 'high' },
      { countryCode: 'FRA', countryName: 'France', region: 'Europe', hasData: true, dataQuality: 'high' },
      { countryCode: 'GBR', countryName: 'United Kingdom', region: 'Europe', hasData: true, dataQuality: 'high' },
      { countryCode: 'ITA', countryName: 'Italy', region: 'Europe', hasData: true, dataQuality: 'high' },
      { countryCode: 'ESP', countryName: 'Spain', region: 'Europe', hasData: true, dataQuality: 'high' },
      { countryCode: 'NLD', countryName: 'Netherlands', region: 'Europe', hasData: true, dataQuality: 'high' },
      { countryCode: 'CHE', countryName: 'Switzerland', region: 'Europe', hasData: true, dataQuality: 'high' },
      { countryCode: 'SWE', countryName: 'Sweden', region: 'Europe', hasData: true, dataQuality: 'medium' },
      { countryCode: 'NOR', countryName: 'Norway', region: 'Europe', hasData: true, dataQuality: 'medium' },
      { countryCode: 'POL', countryName: 'Poland', region: 'Europe', hasData: true, dataQuality: 'low' }
    ]
  },
  'North America': {
    region: 'North America',
    totalCountries: 23,
    countriesWithData: 22,
    coverage: 95.7,
    countries: [
      { countryCode: 'USA', countryName: 'United States', region: 'North America', hasData: true, dataQuality: 'high' },
      { countryCode: 'CAN', countryName: 'Canada', region: 'North America', hasData: true, dataQuality: 'high' },
      { countryCode: 'MEX', countryName: 'Mexico', region: 'North America', hasData: true, dataQuality: 'high' },
      { countryCode: 'GTM', countryName: 'Guatemala', region: 'North America', hasData: true, dataQuality: 'medium' },
      { countryCode: 'HND', countryName: 'Honduras', region: 'North America', hasData: true, dataQuality: 'medium' },
      { countryCode: 'SLV', countryName: 'El Salvador', region: 'North America', hasData: true, dataQuality: 'low' },
      { countryCode: 'NIC', countryName: 'Nicaragua', region: 'North America', hasData: false }
    ]
  },
  'South America': {
    region: 'South America',
    totalCountries: 12,
    countriesWithData: 10,
    coverage: 83.3,
    countries: [
      { countryCode: 'BRA', countryName: 'Brazil', region: 'South America', hasData: true, dataQuality: 'high' },
      { countryCode: 'ARG', countryName: 'Argentina', region: 'South America', hasData: true, dataQuality: 'high' },
      { countryCode: 'CHL', countryName: 'Chile', region: 'South America', hasData: true, dataQuality: 'medium' },
      { countryCode: 'COL', countryName: 'Colombia', region: 'South America', hasData: true, dataQuality: 'medium' },
      { countryCode: 'PER', countryName: 'Peru', region: 'South America', hasData: true, dataQuality: 'low' },
      { countryCode: 'VEN', countryName: 'Venezuela', region: 'South America', hasData: false },
      { countryCode: 'URY', countryName: 'Uruguay', region: 'South America', hasData: true, dataQuality: 'low' }
    ]
  },
  'Africa': {
    region: 'Africa',
    totalCountries: 54,
    countriesWithData: 38,
    coverage: 70.4,
    countries: [
      { countryCode: 'ZAF', countryName: 'South Africa', region: 'Africa', hasData: true, dataQuality: 'high' },
      { countryCode: 'NGA', countryName: 'Nigeria', region: 'Africa', hasData: true, dataQuality: 'medium' },
      { countryCode: 'EGY', countryName: 'Egypt', region: 'Africa', hasData: true, dataQuality: 'medium' },
      { countryCode: 'KEN', countryName: 'Kenya', region: 'Africa', hasData: true, dataQuality: 'medium' },
      { countryCode: 'GHA', countryName: 'Ghana', region: 'Africa', hasData: true, dataQuality: 'low' },
      { countryCode: 'ETH', countryName: 'Ethiopia', region: 'Africa', hasData: true, dataQuality: 'low' },
      { countryCode: 'TZA', countryName: 'Tanzania', region: 'Africa', hasData: true, dataQuality: 'low' },
      { countryCode: 'UGA', countryName: 'Uganda', region: 'Africa', hasData: false },
      { countryCode: 'MWI', countryName: 'Malawi', region: 'Africa', hasData: false },
      { countryCode: 'ZMB', countryName: 'Zambia', region: 'Africa', hasData: false }
    ]
  },
  'Middle East': {
    region: 'Middle East',
    totalCountries: 18,
    countriesWithData: 15,
    coverage: 83.3,
    countries: [
      { countryCode: 'TUR', countryName: 'Turkey', region: 'Middle East', hasData: true, dataQuality: 'high' },
      { countryCode: 'ISR', countryName: 'Israel', region: 'Middle East', hasData: true, dataQuality: 'high' },
      { countryCode: 'SAU', countryName: 'Saudi Arabia', region: 'Middle East', hasData: true, dataQuality: 'medium' },
      { countryCode: 'ARE', countryName: 'UAE', region: 'Middle East', hasData: true, dataQuality: 'medium' },
      { countryCode: 'IRN', countryName: 'Iran', region: 'Middle East', hasData: true, dataQuality: 'medium' },
      { countryCode: 'LBN', countryName: 'Lebanon', region: 'Middle East', hasData: true, dataQuality: 'low' },
      { countryCode: 'YEM', countryName: 'Yemen', region: 'Middle East', hasData: false },
      { countryCode: 'SYR', countryName: 'Syria', region: 'Middle East', hasData: false }
    ]
  }
}; 