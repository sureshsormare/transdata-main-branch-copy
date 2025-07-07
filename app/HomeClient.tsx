"use client";

import { motion } from "framer-motion";
import { HoverEffect } from "../components/ui/card-hover-effect";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PlexusBackground from "@/components/PlexusBackground"; // Adjust path as needed

interface Section {
  title: string;
  description: string;
  link: string;
}

export default function HomeClient() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query?.trim() === "") return;
    router.push(`/search-results?q=${encodeURIComponent(query?.trim())}`);
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

  const whyChooseSection: Section[] = [
    {
      title: "Extensive Pharmaceutical Data",
      description:
        "Access an extensive, up-to-date database of global pharmaceutical trade transactions. Our platform provides detailed reports on import and export activities for APIs, intermediates, and finished formulations, helping you identify trends, opportunities, and market shifts.",
      link: "/",
    },
    {
      title: "Supplier and Buyer Insights",
      description:
        "Easily connect with a global network of trusted pharmaceutical suppliers and buyers. Leverage valuable supplier profiles and buyer data to streamline your sourcing process and ensure you're getting the authentic deals.",
      link: "/",
    },
    {
      title: "Pricing and Market Insights",
      description:
        "Stay ahead of the curve with real-time pricing information, market trends, and historical pricing data. Make strategic decisions to ensure competitive pricing and cost optimization for your procurement activities.",
      link: "/",
    },
  ];

  return (
    <div>
      {/* Hero Section with Plexus Background */}
      <div className='relative w-full h-screen overflow-hidden'>
        <PlexusBackground nodeCount={100} maxDistance={120}>
          <div className="relative z-10 h-full md:top-20 top-12 container mx-auto flex flex-col md:flex-row md:justify-center text-center w-full ">
            <div className="lg:w-[60%] md:w-[70%] text-white">
  

              <motion.h1 className="w-full max-w-full p-2 text-2xl md:text-3xl lg:text-4xl mb-4 overflow-hidden font-['poppins-b'] whitespace-nowrap">
                <motion.span className="max-w-full">
                  Global Pharma Trade Intelligence
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeInOut", duration: 0.7 }}
                className="md:w-[80%] mx-auto text-sm md:text-base mb-8 text-center text-gray-200 leading-relaxed"
              >
                Advanced pharmaceutical trade analytics platform with real-time data from 180+ countries. 
                Comprehensive market intelligence, supplier networks, and pricing insights.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="w-full flex flex-col items-center gap-5 mt-16"
              >
                {/* Search and Demo Button Row */}
                <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center">
                  {/* Search Bar */}
                  <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-auto flex-1 max-w-3xl rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 px-6 py-4 flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type='text'
                      placeholder='Enter product name, HSN code, or API...'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className='flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none text-sm md:text-base font-medium'
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <span>Search</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </form>
                </div>
                {/* Suggestions Bar */}
                <div className='flex items-center justify-center gap-4 mt-6'>
                  <span className='text-xs text-gray-300 font-medium'>Popular Searches:</span>
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
                      className='text-xs text-blue-300 hover:text-white transition-colors duration-200 font-medium underline hover:no-underline'
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Stats Bar */}
                <div className='w-full flex flex-col sm:flex-row justify-center items-center gap-3 mt-8'>
                  <div className='flex-1 min-w-[140px] backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 flex flex-col items-center'>
                    <span className='text-2xl font-bold text-cyan-400 drop-shadow-md'>
                      50M+
                    </span>
                    <span className='text-xs font-medium text-gray-200 mt-1 tracking-wide'>
                      Trade Records
                    </span>
                  </div>
                  <div className='flex-1 min-w-[140px] backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 flex flex-col items-center'>
                    <span className='text-2xl font-bold text-cyan-400 drop-shadow-md'>
                      180+
                    </span>
                    <span className='text-xs font-medium text-gray-200 mt-1 tracking-wide'>
                      Countries
                    </span>
                  </div>
                  <div className='flex-1 min-w-[140px] backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 flex flex-col items-center'>
                    <span className='text-2xl font-bold text-cyan-400 drop-shadow-md'>
                      99.9%
                    </span>
                    <span className='text-xs font-medium text-gray-200 mt-1 tracking-wide'>
                      Data Accuracy
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </PlexusBackground>
      </div>

      {/* Why Choose TransDataNexus */}
      <div className='bg-gradient-to-br from-gray-50 via-blue-50 to-white py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4'>
                Why Choose Us
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'
            >
              Why Choose{" "}
              <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                TransDataNexus
              </span>
              ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-lg text-gray-600 max-w-2xl mx-auto'
            >
              Discover the advantages that make us the leading choice for
              pharmaceutical trade intelligence
            </motion.p>
          </div>
          <HoverEffect items={whyChooseSection} />
        </div>
      </div>

      {/* How It Works/Process Flow */}
      <div className='bg-white py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4'>
                How It Works
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'
            >
              Simple{" "}
              <span className='bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
                3-Step Process
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-lg text-gray-600 max-w-2xl mx-auto'
            >
              Get started with our platform in three simple steps and unlock powerful trade intelligence
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                step: "01",
                title: "Search Products",
                description: "Enter product names, HSN codes, or descriptions to find relevant trade data and market insights.",
                icon: "🔍"
              },
              {
                step: "02",
                title: "Analyze Results",
                description: "Review comprehensive analytics including supplier networks, pricing trends, and market opportunities.",
                icon: "📊"
              },
              {
                step: "03",
                title: "Take Action",
                description: "Connect with suppliers, track market trends, and make informed business decisions.",
                icon: "🚀"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className='text-center relative'
              >
                <div className='relative'>
                  <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
                    <span className='text-3xl'>{step.icon}</span>
                  </div>
                  {index < 2 && (
                    <div className='hidden md:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transform translate-x-4'></div>
                  )}
                </div>
                <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300'>
                  <div className='w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold'>
                    {step.step}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>{step.title}</h3>
                  <p className='text-gray-600 leading-relaxed'>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Coverage Map */}
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4'>
                Global Coverage
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'
            >
              Worldwide{" "}
              <span className='bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent'>
                Data Coverage
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-lg text-gray-600 max-w-2xl mx-auto'
            >
              Access comprehensive pharmaceutical trade data from 180+ countries across all continents
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              { region: "Asia Pacific", countries: 45, icon: "🌏" },
              { region: "Europe", countries: 44, icon: "🌍" },
              { region: "Americas", countries: 35, icon: "🌎" },
              { region: "Africa", countries: 54, icon: "🌍" }
            ].map((region, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-center'
              >
                <div className='text-4xl mb-4'>{region.icon}</div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>{region.region}</h3>
                <p className='text-3xl font-bold text-blue-600 mb-2'>{region.countries}+</p>
                <p className='text-sm text-gray-600'>Countries Covered</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className='text-center mt-12'
          >
            <div className='bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto'>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Real-time Data Updates</h3>
              <p className='text-gray-600 mb-6'>
                Our platform continuously monitors and updates trade data from customs authorities, 
                shipping manifests, and regulatory bodies worldwide to ensure you have the most current information.
              </p>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>24/7</div>
                  <div className='text-sm text-gray-600'>Data Monitoring</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>99.9%</div>
                  <div className='text-sm text-gray-600'>Accuracy Rate</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-600'>50M+</div>
                  <div className='text-sm text-gray-600'>Records Updated</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features & Services */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-20 relative overflow-hidden">
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

        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-bold mb-6 shadow-xl'>
                🚀 Features & Services
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'
            >
              Powerful Tools for{" "}
              <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                Smart Decisions
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-xl text-gray-600 max-w-3xl mx-auto'
            >
              Unlock the full potential of pharmaceutical trade intelligence
              with our comprehensive suite of advanced features
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group'
            >
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                📊
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Real-Time Analytics
              </h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Access live market data, pricing trends, and trade volumes with
                our advanced analytics dashboard
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group'
            >
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                🌐
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Global Network
              </h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Connect with verified suppliers and buyers across 180+ countries
                in our trusted network
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group'
            >
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                🔍
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Smart Search
              </h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Find exactly what you need with AI-powered search across 50M+
                pharmaceutical trade records
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group'
            >
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                📈
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Market Insights
              </h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Get detailed market analysis, competitor intelligence, and
                forecasting reports
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group'
            >
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                🛡️
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Secure Platform
              </h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Enterprise-grade security with 99.9% uptime and complete data
                protection
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group'
            >
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                📱
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Trade Analytics
              </h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Gain deep visibility into market shifts, emerging trade routes,
                and competitive benchmarks
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials/Case Studies */}
      <div className='bg-white py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4'>
                Success Stories
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'
            >
              What Our{" "}
              <span className='bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
                Clients Say
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-lg text-gray-600 max-w-2xl mx-auto'
            >
              Discover how leading pharmaceutical companies are transforming their trade operations
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Procurement Director",
                company: "PharmaCorp International",
                testimonial: "TransDataNexus has revolutionized our supplier sourcing process. We've identified 15 new reliable suppliers and reduced our procurement costs by 23%.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Supply Chain Manager",
                company: "GlobalMed Solutions",
                testimonial: "The real-time market insights have given us a competitive edge. We can now make data-driven decisions that directly impact our bottom line.",
                rating: 5
              },
              {
                name: "Dr. Emily Rodriguez",
                role: "Business Development",
                company: "BioTech Innovations",
                testimonial: "The comprehensive trade data helped us expand into 8 new markets within 6 months. The ROI has been exceptional.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300'
              >
                <div className='flex items-center mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className='text-yellow-400 text-lg'>⭐</span>
                  ))}
                </div>
                <p className='text-gray-700 mb-6 italic'>"{testimonial.testimonial}"</p>
                <div className='flex items-center'>
                  <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4'>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-900'>{testimonial.name}</h4>
                    <p className='text-sm text-gray-600'>{testimonial.role}</p>
                    <p className='text-sm text-orange-600 font-medium'>{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners/Logos Section */}
      <div className='bg-gray-50 py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold mb-4'>
                Trusted By
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'
            >
              Leading Pharmaceutical Companies
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-lg text-gray-600 max-w-2xl mx-auto'
            >
              Join thousands of companies worldwide who trust TransDataNexus for their trade intelligence needs
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center'
          >
            {[
              "Pfizer", "Novartis", "Roche", "Merck", "GSK", "AstraZeneca",
              "Johnson & Johnson", "Sanofi", "Bayer", "Eli Lilly", "Amgen", "AbbVie"
            ].map((company, index) => (
              <div
                key={index}
                className='bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 text-center'
              >
                <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2'>
                  <span className='text-white font-bold text-sm'>{company.split(' ')[0][0]}</span>
                </div>
                <p className='text-sm font-medium text-gray-700'>{company}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Explore TransDataNexus */}
      <div className='bg-gradient-to-br from-white via-gray-50 to-blue-50 py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='inline-block'
            >
              <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-semibold mb-4 shadow-lg'>
                Explore Our Platform
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'
            >
              Explore{" "}
              <span className='bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'>
                TransDataNexus
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-lg text-gray-600 max-w-2xl mx-auto'
            >
              Navigate through our comprehensive platform and discover all the
              tools and resources available to you
            </motion.p>
          </div>
          <HoverEffect items={exploreSection} />
        </div>
      </div>

      {/* Contact/CTA Section */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 py-20'>
        <div className='container mx-auto px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              Ready to Transform Your{" "}
              <span className='bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                Trade Intelligence
              </span>
              ?
            </h2>
            <p className='text-xl text-blue-100 mb-8 max-w-3xl mx-auto'>
              Join thousands of pharmaceutical companies using our platform to make informed decisions 
              and discover new market opportunities. Start your free trial today.
            </p>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
              <button
                onClick={() => router.push('/trial')}
                className='bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg hover:shadow-xl'
              >
                Start Free Trial
              </button>
              <button
                onClick={() => router.push('/request-demo')}
                className='border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg'
              >
                Request Demo
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20'>
                <div className='text-3xl mb-4'>🎯</div>
                <h3 className='text-xl font-semibold text-white mb-2'>Free Trial</h3>
                <p className='text-blue-100 text-sm'>7-day free trial with full access to all features</p>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20'>
                <div className='text-3xl mb-4'>📞</div>
                <h3 className='text-xl font-semibold text-white mb-2'>24/7 Support</h3>
                <p className='text-blue-100 text-sm'>Expert support team available round the clock</p>
              </div>
              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20'>
                <div className='text-3xl mb-4'>🚀</div>
                <h3 className='text-xl font-semibold text-white mb-2'>Quick Setup</h3>
                <p className='text-blue-100 text-sm'>Get started in minutes with our intuitive platform</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 