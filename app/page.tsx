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

export default function Home() {
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
      <div className="relative w-full h-screen overflow-hidden">
        <PlexusBackground nodeCount={100} maxDistance={120}>
          <div className="relative z-10 h-full md:top-20 top-12 container mx-auto flex flex-col md:flex-row md:justify-center text-center w-full ">
            <div className="lg:w-[60%] md:w-[70%] text-white">
  

              <motion.h1 className="w-full max-w-full p-2  text-4xl md:text-5xl mb-6 overflow-hidden  font-['poppins-b']">
                <motion.span className=" max-w-full ">
                  Global Pharma Trade Intelligence
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeInOut", duration: 0.7 }}
                className="md:w-[70%] mx-auto text-base lg:text-md mb-6 text-center"
              >
                Search and analyze pharmaceutical trade data across 180+
                countries with real-time insights and comprehensive market
                intelligence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="w-full flex flex-col items-center gap-5 mt-16"
              >
                {/* Search and Demo Button Row */}
                <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center ">
                  {/* Search Bar */}
                  <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-auto flex-1 max-w-2xl rounded-xl bg-blue-200/5 backdrop-blur-sm shadow-lg ring-1 ring-gray-300 px-12 py-4 flex items-center space-x-3"
                  >
                    <input
                      type="text"
                      placeholder="Search by Product name or HSN Code..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm md:text-base"
                    />
                    <button
                      type="submit"
                      className="px-6 mr-0 py-3 text-sm font-medium bg-[#1b6cae] hover:bg-[#1d94d0] text-white rounded-xl transition duration-200"
                    >
                      Search
                    </button>
                  </form>
                </div>
                {/* Suggestions Bar */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {[
                    "Paracetamol",
                    "Cisplatin",
                    "Albumin",
                    "Metformin",
                    "Levofloxacin",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="px-6 py-2 rounded-full border border-blue-200 backdrop-blur-sm text-blue-200 hover:bg-blue-200/10 transition text-sm font-medium"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {/* Stats Bar */}
                <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                  <div className="flex-1 min-w-[180px]  backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-cyan-400 drop-shadow-md">
                      50M+
                    </span>
                    <span className="text-sm font-semibold text-gray-200 mt-1 tracking-wide">
                      Trade Records
                    </span>
                  </div>
                  <div className="flex-1 min-w-[180px]  backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-cyan-400 drop-shadow-md">
                      180+
                    </span>
                    <span className="text-sm font-semibold text-gray-200 mt-1 tracking-wide">
                      Countries
                    </span>
                  </div>
                  <div className="flex-1 min-w-[180px]  backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-cyan-400 drop-shadow-md">
                      99.9%
                    </span>
                    <span className="text-sm font-semibold text-gray-200 mt-1 tracking-wide">
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
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Why Choose Us
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                TransDataNexus
              </span>
              ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Discover the advantages that make us the leading choice for
              pharmaceutical trade intelligence
            </motion.p>
          </div>
          <HoverEffect items={whyChooseSection} />
        </div>
      </div>

      {/* Features & Services */}
      <div className="bg-gradient-to-br  py-20 relative overflow-hidden"
          style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          // transform: isHidden ? "translateY(-100%)" : "translateY(0)",
        }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #60a5fa 0%, transparent 50%), 
                       radial-gradient(circle at 75% 75%, #34d399 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-900 rounded-full text-sm font-bold mb-6 shadow-xl">
                🚀 Features & Services
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Powerful Tools for{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Smart Decisions
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Unlock the full potential of pharmaceutical trade intelligence
              with our comprehensive suite of advanced features
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Real-Time Analytics
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Access live market data, pricing trends, and trade volumes with
                our advanced analytics dashboard
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🌐
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Global Network
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Connect with verified suppliers and buyers across 180+ countries
                in our trusted network
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🔍
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Smart Search
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Find exactly what you need with AI-powered search across 50M+
                pharmaceutical trade records
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📈
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Market Insights
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Get detailed market analysis, competitor intelligence, and
                forecasting reports
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Secure Platform
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Enterprise-grade security with 99.9% uptime and complete data
                protection
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📱
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                API Integration
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Seamlessly integrate our data into your existing systems with
                our robust API
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Explore TransDataNexus */}
      <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
                Explore Our Platform
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Explore{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                TransDataNexus
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Navigate through our comprehensive platform and discover all the
              tools and resources available to you
            </motion.p>
          </div>
          <HoverEffect items={exploreSection} />
        </div>
      </div>
    </div>
  );
}
