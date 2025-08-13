"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

// Dynamic import for React-Leaflet components
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

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

const regions = [
  { 
    name: "Asia Pacific", 
    countries: 45, 
    icon: "🌏",
    position: [35, 100],
    description: "45+ countries including China, India, Japan, and Australia"
  },
  { 
    name: "Europe", 
    countries: 44, 
    icon: "🌍",
    position: [54, 10],
    description: "44+ countries including Germany, France, UK, and Italy"
  },
  { 
    name: "Americas", 
    countries: 35, 
    icon: "🌎",
    position: [40, -100],
    description: "35+ countries including USA, Canada, Brazil, and Mexico"
  },
  { 
    name: "Africa", 
    countries: 54, 
    icon: "🌍",
    position: [0, 20],
    description: "54+ countries including South Africa, Nigeria, and Egypt"
  }
];

export default function InteractiveWorldMap() {
  const [isClient, setIsClient] = useState(false);
  const [icon, setIcon] = useState<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setIsClient(true);
    
    // Create icon instance on client side
    const createIcon = async () => {
      try {
        const { Icon } = await import("leaflet");
        const iconInstance = new Icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        });
        setIcon(iconInstance);
      } catch (error) {
        console.warn('Failed to load Leaflet icon:', error);
      }
    };
    
    createIcon();

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

  if (!isClient || !hasInitialized.current) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Worldwide{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Data Coverage
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Access comprehensive pharmaceutical trade data from 180+ countries across all continents
            </motion.p>
          </div>
          
          {/* Loading placeholder */}
          <div className="relative max-w-6xl mx-auto mb-12">
            <div className="relative w-full aspect-[2/1] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading interactive map...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Worldwide{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Data Coverage
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Access comprehensive pharmaceutical trade data from 180+ countries across all continents
          </motion.p>
        </div>

        {/* Interactive World Map */}
        <div className="relative max-w-6xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-[2/1] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl"
            ref={mapContainerRef}
          >
            {icon && (
              <MapContainer
                key={`interactive-map-${Date.now()}`}
                ref={mapRef}
                center={[20, 0]}
                zoom={2}
                className="w-full h-full"
                style={{ height: "100%", width: "100%" }}
                whenReady={() => {
                  // Map is ready
                }}
                zoomControl={false}
                attributionControl={false}
              >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Region Markers */}
              {icon && regions.map((region, index) => (
                <div key={region.name}>
                  <Marker 
                    position={region.position as [number, number]} 
                    icon={icon}
                  >
                    <Popup>
                      <div className="text-center">
                        <div className="text-2xl mb-2">{region.icon}</div>
                        <h3 className="font-bold text-gray-900 mb-1">{region.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{region.description}</p>
                        <div className="text-lg font-bold text-blue-600">{region.countries}+ countries</div>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* Coverage Circle */}
                  <Circle
                    center={region.position as [number, number]}
                    radius={2000000}
                    pathOptions={{
                      color: "#3B82F6",
                      fillColor: "#3B82F6",
                      fillOpacity: 0.1,
                      weight: 2
                    }}
                  />
                </div>
              ))}
              </MapContainer>
            )}

            {/* Central Stats Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-blue-200 text-center z-10">
              <div className="text-2xl font-bold text-blue-600 mb-1">180+</div>
              <div className="text-xs text-gray-600">Countries</div>
            </div>
          </motion.div>
        </div>

        {/* Region List */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {regions.map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col justify-center"
                onClick={() => {
                  // You can add click handlers here to focus on specific regions
                  console.log(`Clicked on ${region.name}`);
                }}
              >
                <div className="text-3xl mb-2">{region.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">{region.name}</div>
                <div className="text-lg font-bold text-blue-600">{region.countries}+ countries</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 h-full flex flex-col justify-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50M+</div>
              <div className="text-gray-600">Trade Records</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 h-full flex flex-col justify-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Data Accuracy</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 h-full flex flex-col justify-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Real-time Updates</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 