"use client";

import { motion } from "framer-motion";

const regions = [
  { name: "Asia Pacific", countries: 45, icon: "🌏" },
  { name: "Europe", countries: 44, icon: "🌍" },
  { name: "Americas", countries: 35, icon: "🌎" },
  { name: "Africa", countries: 54, icon: "🌍" }
];

export default function SimpleMapWithList() {
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

        {/* World Map */}
        <div className="relative max-w-5xl mx-auto mb-12">
          <div className="relative w-full aspect-[2/1] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
            
            {/* Clean World Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100">
              <svg viewBox="0 0 1000 500" className="w-full h-full">
                {/* Simplified World Map with better visibility */}
                <g fill="#3B82F6" stroke="#1E40AF" strokeWidth="2">
                  {/* North America */}
                  <path d="M 80 120 Q 120 100 180 120 Q 250 140 320 120 Q 380 100 450 120 L 450 180 Q 380 200 320 180 Q 250 160 180 180 Q 120 160 80 180 Z" />
                  
                  {/* South America */}
                  <path d="M 180 200 Q 220 180 280 200 Q 350 220 420 200 Q 480 180 550 200 L 550 300 Q 480 320 420 300 Q 350 280 280 300 Q 220 280 180 300 Z" />
                  
                  {/* Europe */}
                  <path d="M 420 90 Q 460 70 520 90 Q 580 110 640 90 Q 700 70 760 90 L 760 150 Q 700 170 640 150 Q 580 130 520 150 Q 460 130 420 150 Z" />
                  
                  {/* Africa */}
                  <path d="M 420 160 Q 460 140 520 160 Q 580 180 640 160 Q 700 140 760 160 L 760 260 Q 700 280 640 260 Q 580 240 520 260 Q 460 240 420 260 Z" />
                  
                  {/* Asia */}
                  <path d="M 650 110 Q 700 90 750 110 Q 800 130 850 110 Q 900 90 950 110 L 950 185 Q 900 205 850 185 Q 800 165 750 185 Q 700 165 650 185 Z" />
                  
                  {/* Australia */}
                  <path d="M 750 275 Q 800 255 850 275 Q 900 295 950 275 L 950 325 Q 900 345 850 325 Q 800 305 750 325 Z" />
                </g>
              </svg>
            </div>

            {/* Central Stats */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-blue-200 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">180+</div>
              <div className="text-xs text-gray-600">Countries</div>
            </div>
          </div>
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
                className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-center"
              >
                <div className="text-3xl mb-2">{region.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">{region.name}</div>
                <div className="text-lg font-bold text-blue-600">{region.countries}+ countries</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 