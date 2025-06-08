"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HoverEffect } from "../components/ui/card-hover-effect";

const MotionImage = motion.create(Image);

interface Section {
  title: string;
  description: string;
  link: string;
}

export default function Home() {
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
      {/* Hero Section */}
      <div
        className="relative w-full h-screen bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: "url('/thumbnail.jpg')" }}
      >
        <div className="relative z-10 h-full md:top-20 top-12 container mx-auto flex flex-col md:flex-row md:justify-center text-center  w-full">
          <div className="lg:w-[60%] md:w-[70%] text-black">
            <div className="flex justify-center mb-4">
              <div className="relative w-fit py-1 px-4 rounded-2xl text-sm overflow-hidden shadow-md space-x-1 bg-gradient-to-r from-blue-200 via-white to-blue-400 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent before:animate-[shimmer_1.5s_linear_infinite]">
                <span className="relative text-blue-800  font-semibold z-10">
                  Introducing!
                </span>
                <span className="relative  z-10">
                  Pharma Supply Chain Analytics 🚀
                </span>
              </div>
            </div>

            <motion.h1 className="text-4xl md:text-6xl mb-6 overflow-hidden py-3 font-['poppins-b']">
              {[
                "Your ",
                "Gateway ",
                "to ",
                "Global ",
                "Pharma ",
                "Insights.",
              ].map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ y: "250%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.055 * idx,
                    ease: "easeInOut",
                  }}
                  className="inline-block px-1"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.7 }}
              className="md:w-[70%] mx-auto text-sm lg:text-md mb-6 text-center"
            >
              Empower your supply chain with accurate, real-time pharmaceutical
              trade insights—designed to optimize procurement and fuel global
              growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="w-full flex flex-row md:flex-row md:items-center md:justify-center gap-4 mt-6"
            >
              {/* Search Bar */}
              <div className="w-full md:w-auto flex-1 max-w-md rounded-full bg-white/90 backdrop-blur-sm shadow-lg ring-1 ring-gray-300 px-4 py-2 flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Search APIs, intermediates, buyers..."
                  className="flex-1 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm md:text-base"
                />
                <button className="px-4 py-1.5 text-sm font-medium bg-[#1b6cae] hover:bg-[#1d94d0] text-white rounded-full transition duration-200">
                  Search
                </button>
              </div>

              {/* Book Demo Button */}
              <div className="flex justify-center md:justify-start">
                <button className="px-7 py-3 text-sm font-medium bg-[#1b6cae] hover:bg-[#1d94d0] text-white rounded-full transition duration-200 whitespace-nowrap">
                  Start to Book Demo
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right: Image */}
          {/* <div className="md:w-1/2 mt-10 md:mt-0">
            <MotionImage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.7 }}
              src="/banner.png"
              alt="Trade Data Visualization"
              width={600}
              height={400}
              className="rounded-xl w-full max-w-[600px] h-auto"
            />
          </div> */}
        </div>
      </div>

      {/* Why Choose TransDataNexus */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Why Choose TransDataNexus?
          </h2>
          <HoverEffect items={whyChooseSection} />
        </div>
      </div>

      {/* Explore TransDataNexus */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Explore TransDataNexus
          </h2>
          <HoverEffect items={exploreSection} />
        </div>
      </div>
    </div>
  );
}
