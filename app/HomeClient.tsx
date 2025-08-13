"use client";

import { motion } from "framer-motion";
import Image from "next/image";
// import { HoverEffect } from "../components/ui/card-hover-effect";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PlexusBackground from "@/components/PlexusBackground";
import HomepageDemoSection from "./components/HomepageDemoSection";
import PharmaTradeMap from "./components/PharmaTradeMap";
import { LoadingSpinner } from "@/components/ui/loading-states";

interface Section {
  title: string;
  description: string;
  link: string;
}

export default function HomeClient() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query?.trim() === "") return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      router.push(`/search-results?q=${encodeURIComponent(query?.trim())}`);
    }, 1000);
  };

  const exploreSection: Section[] = [
    {
      title: "About Us",
      description:
        "Learn about our mission, vision, and the team behind TransDataNexus.",
      link: "/about",
    },
    {
      title: "Our Services",
      description:
        "Discover our comprehensive range of trade data services and solutions.",
      link: "/services",
    },
    {
      title: "Pricing Plans",
      description:
        "Find the perfect plan to suit your business needs and budget.",
      link: "/pricing",
    },
    {
      title: "Contact Us",
      description:
        "Get in touch with our team for inquiries, support, or partnerships.",
      link: "/contact",
    },
    {
      title: "Privacy Policy",
      description:
        "Read about our commitment to protecting your privacy and data.",
      link: "/privacy-policy",
    },
    {
      title: "Terms and Conditions",
      description:
        "Understand the terms governing the use of our services and website.",
      link: "/terms-and-conditions",
    },
  ];

  // Actual client logos (use slug to assemble multiple fallbacks per brand)
  const clientLogos = [
    { name: "Amgen" },
    { name: "Johnson & Johnson" },
    { name: "Pfizer" },
    { name: "Bayer" },
    { name: "Sanofi" },
    { name: "Eli Lilly" },
    { name: "Merck" },
    { name: "AstraZeneca" },
    { name: "Roche" },
    { name: "Novartis" },
    { name: "AbbVie" },
    { name: "Bristol Myers Squibb" },
    { name: "Takeda" },
    // Additional top pharma players (logos added where available in public domain)
    { name: "Boehringer Ingelheim" },
    { name: "Vertex Pharmaceuticals" },
    { name: "Astellas Pharma" },
    { name: "Biogen" },
    { name: "Regeneron" }
  ] as const;

  function toSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  function getLogoSrcs(name: string) {
    const slug = toSlug(name)
    // Priority: custom overrides → curated svg → legacy png
    return [
      `/logos/custom/${slug}.svg`,
      `/logos/${slug}.svg`,
      `/logos/${slug}.png`
    ]
  }

  // const whyChooseSection: Section[] = [
  //   {
  //     title: "Extensive Pharmaceutical Data",
  //     description:
  //       "Access an extensive, up-to-date database of global pharmaceutical trade transactions. Our platform provides detailed reports on import and export activities for APIs, intermediates, and finished formulations, helping you identify trends, opportunities, and market shifts.",
  //     link: "/",
  //   },
  //   {
  //     title: "Supplier and Buyer Insights",
  //     description:
  //       "Easily connect with a global network of trusted pharmaceutical suppliers and buyers. Leverage valuable supplier profiles and buyer data to streamline your sourcing process and ensure you're getting the authentic deals.",
  //     link: "/",
  //   },
  //   {
  //     title: "Pricing and Market Insights",
  //     description:
  //       "Stay ahead of the curve with real-time pricing information, market trends, and historical pricing data. Make strategic decisions to ensure competitive pricing and cost optimization for your procurement activities.",
  //     link: "/",
  //   },
  // ];

  return (
    <div>
      {/* Hero Section with Plexus Background */}
      <div className='relative w-full min-h-screen overflow-hidden'>
        <PlexusBackground nodeCount={100} maxDistance={120}>
          <div className="relative z-10 h-full container-responsive flex flex-col justify-center items-center text-center pt-20 pb-12">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Global Pharma Trade{" "}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent"
                >
                  Intelligence
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeInOut", duration: 0.7, delay: 0.2 }}
                className="text-sm md:text-base lg:text-lg text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Advanced pharmaceutical trade analytics platform with real-time data from 180+ countries. 
                Comprehensive market intelligence, supplier networks, and pricing insights.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="w-full flex flex-col items-center gap-6 mt-12"
              >
                {/* Search Bar */}
                <div className="w-full flex justify-center max-w-4xl mx-auto">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl rounded-2xl bg-white/15 backdrop-blur-lg shadow-2xl border border-white/30 px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-3 sm:space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type='text'
                      placeholder='Enter product name, HSN code, or API...'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className='flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none text-sm sm:text-base font-medium min-w-0'
                      disabled={isSearching}
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2 btn-touch disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <>
                          <LoadingSpinner size="sm" color="blue" />
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                          <span>Search</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
                
                {/* Suggestions Bar */}
                <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6'>
                  <span className='text-xs sm:text-sm text-gray-300 font-medium'>Popular Searches:</span>
                  {[
                    "Paracetamol",
                    "Cisplatin", 
                    "Albumin",
                    "Metformin",
                    "Levofloxacin",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type='button'
                      className='px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-300 hover:text-white bg-white/15 hover:bg-white/25 backdrop-blur-lg rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 btn-touch'
                      onClick={() => {
                        setQuery(suggestion);
                        setIsSearching(true);
                        // Simulate search delay
                        setTimeout(() => {
                          setIsSearching(false);
                          router.push(`/search-results?q=${encodeURIComponent(suggestion)}`);
                        }, 1000);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Animated Stats Bar */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className='w-full flex flex-col sm:flex-row justify-center items-center gap-6 mt-10 max-w-4xl mx-auto'
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className='bg-white/15 backdrop-blur-md rounded-xl border border-white/20 px-6 py-4 text-center min-w-[140px] hover:bg-white/25 hover:border-blue-300/70 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group cursor-pointer'
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-1 group-hover:from-blue-200 group-hover:via-cyan-200 group-hover:to-blue-300 transition-all duration-300'
                    >
                      50M+
                    </motion.div>
                    <div className='text-xs sm:text-sm text-gray-300 font-medium group-hover:text-gray-200 transition-colors duration-300'>Trade Records</div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 1.5 }}
                      className="h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 mt-2 rounded-full"
                    />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className='bg-white/15 backdrop-blur-md rounded-xl border border-white/20 px-6 py-4 text-center min-w-[140px] hover:bg-white/25 hover:border-green-300/70 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group cursor-pointer'
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1.4 }}
                      className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent mb-1 group-hover:from-green-200 group-hover:via-emerald-200 group-hover:to-green-300 transition-all duration-300'
                    >
                      180+
                    </motion.div>
                    <div className='text-xs sm:text-sm text-gray-300 font-medium group-hover:text-gray-200 transition-colors duration-300'>Countries</div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 1.7 }}
                      className="h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 mt-2 rounded-full"
                    />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className='bg-white/15 backdrop-blur-md rounded-xl border border-white/20 px-6 py-4 text-center min-w-[140px] hover:bg-white/25 hover:border-purple-300/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group cursor-pointer'
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1.6 }}
                      className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-1 group-hover:from-purple-200 group-hover:via-pink-200 group-hover:to-purple-300 transition-all duration-300'
                    >
                      99.9%
                    </motion.div>
                    <div className='text-xs sm:text-sm text-gray-300 font-medium group-hover:text-gray-200 transition-colors duration-300'>Data Accuracy</div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 1.9 }}
                      className="h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mt-2 rounded-full"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </PlexusBackground>
      </div>

      {/* Interactive Demo Section */}
      <div id="demo-section">
        <HomepageDemoSection />
      </div>

      {/* Partners/Logos Section - Modern Design */}
      <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 section-responsive relative overflow-hidden'>
        
        <div className='container-responsive relative z-10'>
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='space-y-6'
            >
              <motion.div className='inline-block'>
                <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm'>
                  🤝 Trusted By
                </span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='text-5xl lg:text-6xl font-bold text-gray-900 mb-6'
              >
                Leading{" "}
                <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'>
                  Pharmaceutical Companies
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
              >
                Join <span className='font-semibold text-blue-600'>thousands of companies</span> worldwide who trust TransDataNexus for their trade intelligence needs
              </motion.p>
            </motion.div>
          </div>

          <div className='marquee'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className='marquee-track gap-6 lg:gap-8'
              style={{
                // Translate left by one third of the tripled content width
                // We approximate card width to avoid layout measurement on server
                // 180px min + padding; choose 220px average per card.
                // distance = totalWidth/3 = (N*220*3)/3 = N*220 px
                // Use CSS var that scales with number of logos.
                // @ts-ignore: CSS var string
                ['--marquee-distance' as any]: `${clientLogos.length * 220}px`,
                ['--marquee-duration' as any]: '28s'
              }}
            >
              {/* Tripled sequence for perfectly seamless loop */}
              {[...clientLogos, ...clientLogos, ...clientLogos].map((company, index) => {
                const isFirstCycle = index < clientLogos.length
                return (
                  <div
                    key={`logo-${company.name}-${index}`}
                    className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center flex-shrink-0 min-w-[180px] group'
                  >
                    <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-t-2xl'></div>
                    <Image
                      src={getLogoSrcs(company.name)[0]}
                      alt={`${company.name} logo`}
                      width={160}
                      height={48}
                      className='mx-auto mb-2 h-10 w-auto sm:h-12 object-contain'
                      data-src2={getLogoSrcs(company.name)[1]}
                      data-src3={getLogoSrcs(company.name)[2]}
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement
                        if (el.dataset.src2) {
                          el.src = el.dataset.src2
                          delete el.dataset.src2
                          return
                        }
                        if (el.dataset.src3) {
                          el.src = el.dataset.src3
                          delete el.dataset.src3
                          return
                        }
                        el.style.display = 'none'
                      }}
                      loading={isFirstCycle ? 'eager' : 'lazy'}
                      priority={isFirstCycle}
                      unoptimized
                    />
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Core Platform Features */}
      <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 section-responsive relative overflow-hidden'>

        <div className='container-responsive relative z-10'>
          {/* Modern section header */}
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='mb-6'
            >
              <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm'>
                ⚡ Core Platform Features
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='heading-responsive text-gray-900 mb-4'
            >
              Everything You Need for{" "}
              <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'>
                Smart Trading
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-body text-gray-600 max-w-2xl mx-auto'
            >
              Comprehensive pharmaceutical trade intelligence platform designed for modern businesses
            </motion.p>
          </div>

          {/* Modern feature grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
            {/* Feature 1: Data */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='group h-full'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[420px] flex flex-col h-full'>
                {/* Feature icon */}
                <div className='mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className='text-h5 mb-3 group-hover:text-blue-700 transition-colors duration-300'>
                  Extensive Pharmaceutical Data
                </h3>
                <p className='text-body-small text-gray-600 leading-relaxed mb-6 flex-grow'>
                  Access an extensive, up-to-date database of global pharmaceutical trade transactions. Our platform provides detailed reports on import and export activities for APIs, intermediates, and finished formulations.
                </p>
                
                {/* Feature highlights */}
                <div className='space-y-3 mt-auto'>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Real-time trade transactions
                  </div>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    180+ countries coverage
                  </div>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    APIs, intermediates & formulations
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Network */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='group h-full'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[420px] flex flex-col h-full'>
                {/* Feature icon */}
                <div className='mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className='text-h5 mb-3 group-hover:text-purple-700 transition-colors duration-300'>
                  Supplier and Buyer Insights
                </h3>
                <p className='text-body-small text-gray-600 leading-relaxed mb-6 flex-grow'>
                  Easily connect with a global network of trusted pharmaceutical suppliers and buyers. Leverage valuable supplier profiles and buyer data to streamline your sourcing process.
                </p>
                
                {/* Feature highlights */}
                <div className='space-y-3 mt-auto'>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Verified supplier profiles
                  </div>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Global buyer network
                  </div>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Authentic deal sourcing
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Insights */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='group h-full'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[420px] flex flex-col h-full'>
                {/* Feature icon */}
                <div className='mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                
                <h3 className='text-h5 mb-3 group-hover:text-emerald-700 transition-colors duration-300'>
                  Pricing and Market Insights
                </h3>
                <p className='text-body-small text-gray-600 leading-relaxed mb-6 flex-grow'>
                  Stay ahead of the curve with real-time pricing information, market trends, and historical pricing data. Make strategic decisions to ensure competitive pricing and cost optimization.
                </p>
                
                {/* Feature highlights */}
                <div className='space-y-3 mt-auto'>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Real-time pricing data
                  </div>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Historical trend analysis
                  </div>
                  <div className='flex items-center text-sm font-medium text-gray-700'>
                    <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3'>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Cost optimization insights
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

              {/* How It Works/Process Flow */}
        <div className='bg-white py-20 lg:py-32 relative overflow-hidden'>
          
          <div className='container-responsive relative z-10'>
            <div className='text-center mb-20'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='inline-block'
              >
                <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm'>
                  📋 How It Works
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6'
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Simple
                </motion.span>{" "}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className='bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent'
                >
                  3-Step Process
                </motion.span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
              >
                Get started with our platform in three simple steps and unlock powerful trade intelligence
              </motion.p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto'>
              {[
                {
                  step: "01",
                  title: "Search Products",
                  description: "Enter product names, HSN codes, or descriptions to find relevant trade data and market insights.",
                  icon: "🔍",
                  gradient: "from-blue-500 to-cyan-500",
                  color: "text-blue-600"
                },
                {
                  step: "02",
                  title: "Analyze Results",
                  description: "Review comprehensive analytics including supplier networks, pricing trends, and market opportunities.",
                  icon: "📊",
                  gradient: "from-green-500 to-emerald-500",
                  color: "text-green-600"
                },
                {
                  step: "03",
                  title: "Take Action",
                  description: "Connect with suppliers, track market trends, and make informed business decisions.",
                  icon: "🚀",
                  gradient: "from-purple-500 to-pink-500",
                  color: "text-purple-600"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  viewport={{ once: true }}
                  className='text-center relative group mb-16 md:mb-0'
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className='relative w-full mb-6'
                  >
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 z-10 relative`}>
                      <span className='text-xl sm:text-2xl'>{step.icon}</span>
                    </div>
                    {index < 2 && (
                      <div className='hidden lg:block absolute top-8 left-full w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transform translate-x-8 rounded-full z-0'></div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className='bg-white/95 backdrop-blur-lg rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-200/60 hover:shadow-2xl transition-all duration-300 relative z-20'
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${step.gradient} text-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-xs font-bold shadow-lg`}>
                      {step.step}
                    </div>
                    <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center'>{step.title}</h3>
                    <p className='text-sm sm:text-base text-gray-600 leading-relaxed text-center mb-4'>{step.description}</p>
                    
                    <div className='flex items-center justify-center text-xs text-gray-500'>
                      <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                      <span>Step {index + 1} of 3</span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      {/* Pharmaceutical Trade Map */}
      <PharmaTradeMap />

      {/* Features & Services */}
              <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 section-responsive relative overflow-hidden">

        <div className='container-responsive relative z-10'>
          <div className='text-center mb-12'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm'>
                🔧 Features & Services
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='heading-responsive text-gray-900 mb-6'
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Powerful Tools for
              </motion.span>{" "}
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className='bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent'
              >
                Smart Decisions
              </motion.span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-body-large text-gray-600 max-w-3xl mx-auto'
            >
              Unlock the full potential of pharmaceutical trade intelligence
              with our comprehensive suite of advanced features
            </motion.p>
          </div>

          {/* Features Grid - Modern Design */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            {/* Feature 1 - Real-Time Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='group'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full'>
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-t-2xl'></div>
                
                {/* Icon with gradient background */}
                <div className='mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <span className='text-2xl'>📊</span>
                  </div>
                </div>
                
                <h3 className='text-xl font-bold mb-4 group-hover:text-blue-700 transition-colors duration-300'>
                  <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'>
                    Real-Time Analytics
                  </span>
                </h3>
                
                <p className='text-gray-600 leading-relaxed'>
                  Access live market data, pricing trends, and trade volumes with our advanced analytics dashboard
                </p>
              </div>
            </motion.div>

            {/* Feature 2 - Worldwide Data Coverage */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='group'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full'>
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 rounded-t-2xl'></div>
                
                {/* Icon with gradient background */}
                <div className='mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <span className='text-2xl'>🌐</span>
                  </div>
                </div>
                
                <h3 className='text-xl font-bold mb-4 group-hover:text-purple-700 transition-colors duration-300'>
                  <span className='bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent'>
                    Worldwide Data Coverage
                  </span>
                </h3>
                
                <p className='text-gray-600 leading-relaxed'>
                  Access comprehensive pharmaceutical trade data from 180+ countries with real-time global market coverage
                </p>
              </div>
            </motion.div>

            {/* Feature 3 - AI-Powered Search */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='group'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full'>
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-t-2xl'></div>
                
                {/* Icon with gradient background */}
                <div className='mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <span className='text-2xl'>🔍</span>
                  </div>
                </div>
                
                <h3 className='text-xl font-bold mb-4 group-hover:text-cyan-700 transition-colors duration-300'>
                  <span className='bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    AI-Powered Search
                  </span>
                </h3>
                
                <p className='text-gray-600 leading-relaxed'>
                  Find exactly what you need with AI-powered intelligence across 50M+ pharmaceutical trade records
                </p>
              </div>
            </motion.div>

            {/* Feature 4 - Market Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='group'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full'>
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-t-2xl'></div>
                
                {/* Icon with gradient background */}
                <div className='mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <span className='text-2xl'>📈</span>
                  </div>
                </div>
                
                <h3 className='text-xl font-bold mb-4 group-hover:text-blue-700 transition-colors duration-300'>
                  <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'>
                    Market Intelligence
                  </span>
                </h3>
                
                <p className='text-gray-600 leading-relaxed'>
                  Get AI-driven market analysis, competitor intelligence, and predictive forecasting reports
                </p>
              </div>
            </motion.div>

            {/* Feature 5 - Secure Platform */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='group'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full'>
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 rounded-t-2xl'></div>
                
                {/* Icon with gradient background */}
                <div className='mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <span className='text-2xl'>🛡️</span>
                  </div>
                </div>
                
                <h3 className='text-xl font-bold mb-4 group-hover:text-purple-700 transition-colors duration-300'>
                  <span className='bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent'>
                    Secure Platform
                  </span>
                </h3>
                
                <p className='text-gray-600 leading-relaxed'>
                  Enterprise-grade security with 99.9% uptime and complete data protection
                </p>
              </div>
            </motion.div>

            {/* Feature 6 - Trade Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='group'
            >
              <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full'>
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-t-2xl'></div>
                
                {/* Icon with gradient background */}
                <div className='mb-6'>
                  <div className='w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300'>
                    <span className='text-2xl'>📱</span>
                  </div>
                </div>
                
                <h3 className='text-xl font-bold mb-4 group-hover:text-cyan-700 transition-colors duration-300'>
                  <span className='bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Trade Analytics
                  </span>
                </h3>
                
                <p className='text-gray-600 leading-relaxed'>
                  Gain deep visibility into market shifts, emerging trade routes, and competitive benchmarks
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      
      {/* Explore TransDataNexus - Modern Design */}
      <div className='bg-white section-responsive relative overflow-hidden'>
        
        <div className='container-responsive relative z-10'>
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='space-y-6'
            >
              <motion.div className='inline-block'>
                <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm'>
                  🗺️ Explore Our Platform
                </span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='text-5xl lg:text-6xl font-bold text-gray-900 mb-6'
              >
                Explore{" "}
                <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'>
                  TransDataNexus
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
              >
                Navigate through our comprehensive platform and discover all the tools and resources available to you
              </motion.p>
            </motion.div>
          </div>
          
          {/* Modern Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {exploreSection.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='group h-full'
              >
                <a href={section.link} className='block h-full'>
                  <div className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col'>
                    {/* Gradient accent line */}
                    <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${
                      index % 3 === 0 ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500' :
                      index % 3 === 1 ? 'bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600' :
                      'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600'
                    }`}></div>
                    
                    {/* Icon */}
                    <div className='mb-6'>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 ${
                        index % 3 === 0 ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                        index % 3 === 1 ? 'bg-gradient-to-br from-purple-500 to-cyan-600' :
                        'bg-gradient-to-br from-cyan-500 to-blue-600'
                      }`}>
                        <span className='text-2xl'>
                          {index === 0 ? '👥' : 
                           index === 1 ? '🔧' : 
                           index === 2 ? '💰' : 
                           index === 3 ? '📞' : 
                           index === 4 ? '🔒' : '📋'}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className='text-xl font-bold mb-4 group-hover:text-blue-700 transition-colors duration-300'>
                      <span className={`${
                        index % 3 === 0 ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500' :
                        index % 3 === 1 ? 'bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600' :
                        'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600'
                      } bg-clip-text text-transparent`}>
                        {section.title}
                      </span>
                    </h3>
                    
                    <p className='text-gray-600 leading-relaxed flex-grow'>
                      {section.description}
                    </p>
                    
                    {/* Hover arrow */}
                    <div className='mt-6 flex items-center text-blue-600 group-hover:text-purple-600 transition-colors duration-300'>
                      <span className='text-sm font-medium mr-2'>Learn More</span>
                      <svg className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                      </svg>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact/CTA Section - Modern Design */}
      <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 section-responsive relative overflow-hidden'>
        
        <div className='container-responsive text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block mb-6'
            >
              <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 backdrop-blur-sm'>
                🎯 Get Started Today
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6'
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Ready to Transform Your
              </motion.span>{" "}
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'
              >
                Trade Intelligence
              </motion.span>
              <motion.span
                initial={{ opacity: 0, rotate: -10 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                ?
              </motion.span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed'
            >
              Join thousands of pharmaceutical companies using our platform to make informed decisions 
              and discover new market opportunities. Start your free trial today.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='flex flex-col sm:flex-row gap-6 justify-center mb-16'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/trial')}
                className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 btn-touch'
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/request-demo')}
                className='bg-gradient-to-r from-white/95 via-blue-50/90 to-cyan-50/90 backdrop-blur-lg border-2 border-blue-200/70 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl hover:border-cyan-300 transition-all duration-300 btn-touch shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 relative overflow-hidden group'
              >
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-cyan-600 transition-all duration-300'
                >
                  Request Demo
                </motion.span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mt-12'
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group'
              >
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-t-2xl'></div>
                
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                  <span className='text-2xl'>🎯</span>
                </div>
                <h3 className='text-xl font-bold mb-3'>
                  <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent'>
                    Free Trial
                  </span>
                </h3>
                <p className='text-gray-600 text-sm sm:text-base'>7-day free trial with full access to all features</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group'
              >
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 rounded-t-2xl'></div>
                
                <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                  <span className='text-2xl'>📞</span>
                </div>
                <h3 className='text-xl font-bold mb-3'>
                  <span className='bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent'>
                    24/7 Support
                  </span>
                </h3>
                <p className='text-gray-600 text-sm sm:text-base'>Expert support team available round the clock</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className='relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group'
              >
                {/* Gradient accent line */}
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-t-2xl'></div>
                
                <div className='w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                  <span className='text-2xl'>🚀</span>
                </div>
                <h3 className='text-xl font-bold mb-3'>
                  <span className='bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Quick Setup
                  </span>
                </h3>
                <p className='text-gray-600 text-sm sm:text-base'>Get started in minutes with our intuitive platform</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 