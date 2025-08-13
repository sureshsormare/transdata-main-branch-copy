"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, TrendingUp, Database } from 'lucide-react';
import { samplePharmaTradeData } from '../utils/dataProcessing';
import { getCountryColor, getRegionColor } from '../utils/mapHelpers';
import { PharmaTradeData, CountryData } from '../types/mapTypes';
import 'leaflet/dist/leaflet.css';

// Dynamic imports for React-Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

// Region center coordinates and data
const regionData = [
  {
    name: 'Asia Pacific',
    position: [35, 100],
    color: '#3b82f6',
    stats: { total: 45, withData: 42, coverage: 93.3 }
  },
  {
    name: 'Europe',
    position: [54, 10],
    color: '#8b5cf6',
    stats: { total: 44, withData: 41, coverage: 93.2 }
  },
  {
    name: 'North America',
    position: [45, -100],
    color: '#10b981',
    stats: { total: 23, withData: 22, coverage: 95.7 }
  },
  {
    name: 'South America',
    position: [-15, -60],
    color: '#f59e0b',
    stats: { total: 12, withData: 10, coverage: 83.3 }
  },
  {
    name: 'Africa',
    position: [0, 20],
    color: '#ef4444',
    stats: { total: 54, withData: 38, coverage: 70.4 }
  },
  {
    name: 'Middle East',
    position: [30, 50],
    color: '#06b6d4',
    stats: { total: 18, withData: 15, coverage: 83.3 }
  }
];

const PharmaTradeMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [icons, setIcons] = useState<Record<string, any>>({});
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  const pharmaTradeData = samplePharmaTradeData;

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setIsClient(true);
    
    // Create simple, tested pins - step by step approach
    const createIcons = async () => {
      try {
        console.log('Starting icon creation...');
        
        // First, let's try the simplest possible approach
        const { divIcon } = await import("leaflet");
        
        const iconConfigs = {
          'Asia Pacific': { color: '#ff0000' }, // Red for testing
          'Europe': { color: '#00ff00' }, // Green for testing
          'North America': { color: '#0000ff' }, // Blue for testing
          'South America': { color: '#ffff00' }, // Yellow for testing
          'Africa': { color: '#ff00ff' }, // Magenta for testing
          'Middle East': { color: '#00ffff' } // Cyan for testing
        };

        const newIcons: Record<string, any> = {};
        
        Object.entries(iconConfigs).forEach(([region, config]) => {
          console.log(`Creating icon for ${region} with color ${config.color}`);
          
          // Exact Google Maps pin shape using SVG
          const pinSVG = `
            <svg width="25" height="35" viewBox="0 0 25 35" xmlns="http://www.w3.org/2000/svg">
              <!-- Drop shadow -->
              <ellipse cx="12.5" cy="32" rx="3" ry="2" fill="rgba(0,0,0,0.2)"/>
              <!-- Pin body -->
              <path d="M12.5 1 C18.851 1 24 6.149 24 12.5 C24 18.851 12.5 33 12.5 33 S1 18.851 1 12.5 C1 6.149 6.149 1 12.5 1 Z" 
                    fill="${config.color}" 
                    stroke="white" 
                    stroke-width="1.5"/>
              <!-- Inner white circle -->
              <circle cx="12.5" cy="12.5" r="4" fill="white"/>
            </svg>
          `;
          
          newIcons[region] = divIcon({
            html: pinSVG,
            iconSize: [25, 35],
            iconAnchor: [12, 35],
            popupAnchor: [0, -35],
            className: 'svg-map-pin'
          });
        });
        
        console.log('Icons created:', newIcons);
        setIcons(newIcons);
      } catch (error) {
        console.error('Error creating icons:', error);
      }
    };
    
    createIcons();

    // Cleanup function
    return () => {
      try {
        if (mapRef.current && typeof mapRef.current.remove === 'function') {
          mapRef.current.remove();
        }
        // Clear the container
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = '';
        }
      } catch (error) {
        // Cleanup failed, but that's ok
      }
      hasInitialized.current = false;
    };
  }, []);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any existing map instances
      if (typeof window !== 'undefined') {
        const mapContainer = document.querySelector('.leaflet-container');
        if (mapContainer) {
          mapContainer.innerHTML = '';
        }
      }
    };
  }, []);

  // Force map re-render when component mounts
  useEffect(() => {
    // No longer needed with robust initialization
  }, [isClient]);

  // Calculate total statistics
  const totalCountries = Object.values(pharmaTradeData).reduce(
    (sum, region) => sum + region.totalCountries, 0
  );
  const totalWithData = Object.values(pharmaTradeData).reduce(
    (sum, region) => sum + region.countriesWithData, 0
  );
  const overallCoverage = ((totalWithData / totalCountries) * 100).toFixed(1);

  if (!isClient || !hasInitialized.current) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-50/60 section-responsive relative overflow-hidden">
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #60a5fa 0%, transparent 50%), 
                       radial-gradient(circle at 75% 75%, #34d399 0%, transparent 50%)`,
            }}
          ></div>
        </div>
        
        <div className="container-responsive space-y-8 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <motion.div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/60">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">
              Worldwide{" "}
              <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
                Data Coverage
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Loading pharmaceutical trade data...
            </p>
          </div>
          
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-400/20 rounded-full blur-xl"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-border">
                <div className="absolute inset-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-50/60 section-responsive relative overflow-hidden">
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #60a5fa 0%, transparent 50%), 
                     radial-gradient(circle at 75% 75%, #34d399 0%, transparent 50%)`,
          }}
        ></div>
      </div>
      
      <div className="container-responsive space-y-8 relative z-10">
      {/* Header Section */}
      <div className="text-center space-y-6 mb-16">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/60">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-5xl lg:text-6xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Worldwide{" "}
            <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
              Data Coverage
            </span>
          </motion.h2>
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Access comprehensive pharmaceutical trade data from <span className="font-semibold text-blue-600">{totalCountries}+</span>{" "}
          countries across all continents
        </motion.p>
      </div>

      {/* Regional Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
        {Object.entries(pharmaTradeData).map(([key, region], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="h-full group"
          >
            <div 
              className={`relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col group-hover:border-gray-200 ${
                selectedRegion === key ? 'ring-2 ring-blue-500/30 shadow-2xl border-blue-200/50' : ''
              }`}
              onClick={() => setSelectedRegion(selectedRegion === key ? null : key)}
            >

              
              <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                {region.region}
              </h3>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: getRegionColor(region.region) }}
                    >
                      {region.totalCountries}+
                    </div>
                    <div className="text-sm text-gray-600 font-medium">countries</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-700">{region.coverage}%</div>
                    <div className="text-xs text-gray-500">Coverage</div>
                  </div>
                </div>
                
                {/* Subtle Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        backgroundColor: getRegionColor(region.region),
                        opacity: 0.8,
                        width: `${region.coverage}%`
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${region.coverage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Map */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-400/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Global Data Coverage Map</h3>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <span className="text-sm font-semibold text-emerald-700">{overallCoverage}% Global Coverage</span>
              </div>
            </div>
          </div>
          <div className="p-0">
          <div className="h-[600px] w-full relative">
            <style jsx>{`
              .leaflet-control-attribution {
                display: none !important;
              }
              .leaflet-attribution-flag {
                display: none !important;
              }
              .svg-map-pin {
                background: transparent !important;
                border: none !important;
              }
              .region-tooltip {
                background: rgba(0, 0, 0, 0.8) !important;
                border: none !important;
                border-radius: 6px !important;
                color: white !important;
                font-size: 12px !important;
                padding: 4px 8px !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
              }
              .region-tooltip::before {
                border-top-color: rgba(0, 0, 0, 0.8) !important;
              }
            `}</style>
            {isClient && hasInitialized.current && Object.keys(icons).length > 0 ? (
              <MapContainer
                key={`pharma-map-${Date.now()}`}
                ref={mapRef}
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                whenReady={() => {
                  // Map is ready
                }}
                dragging={false}
                touchZoom={false}
                attributionControl={false}
              >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution=""
              />
              
              {/* Simple pins with auto-show tooltips */}
              {Object.keys(icons).length > 0 && regionData.map((region, index) => (
                <Marker 
                  key={region.name}
                  position={region.position as [number, number]}
                  icon={icons[region.name]}
                >
                  <Tooltip permanent={true} direction="top" offset={[0, -25]} className="region-tooltip">
                    <div className="text-center">
                      <span className="font-medium text-gray-900">{region.name}</span>
                    </div>
                  </Tooltip>
                </Marker>
              ))}

              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-600">
                Debug: isClient={isClient.toString()}, hasInitialized={hasInitialized.current.toString()}, icons={Object.keys(icons).length}
              </div>
            )}
          </div>
        </div>
      </div>
      </motion.div>

      {/* Coverage Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-400/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Coverage Statistics</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalCountries}</div>
              <div className="text-sm font-medium text-gray-700">Total Countries</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-emerald-600 mb-2">{totalWithData}</div>
              <div className="text-sm font-medium text-gray-700">Countries with Data</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">{overallCoverage}%</div>
              <div className="text-sm font-medium text-gray-700">Global Coverage</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200/50 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-sm font-medium text-gray-700">Regions Covered</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      </div>
    </div>
  );
};

export default PharmaTradeMap; 