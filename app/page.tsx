"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HoverEffect } from "../components/ui/card-hover-effect";

const MotionImage = motion(Image);

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
      <div className="min-h-[100svh]">
        <div className="container mx-auto px-4 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between text-black">
            <div className="md:w-1/2">
              <motion.h1
                className="text-4xl md:text-6xl mb-6 overflow-hidden py-3 font-['poppins-b']"
              >
                {["Unlock ", "Global ", "Pharma ", "Trade ", "Insights"].map(
                  (word, idx) => (
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
                      {word}{" "}
                    </motion.span>
                  )
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeInOut", duration: 0.7 }}
                className="text-md lg:text-xl mb-8"
              >
                Unlock the comprehensive, real-time trade data insights and
                analytics to optimize your sourcing, procurement, and
                decision-making for growth in a global market. With TransData
                Nexus, gain instant access to critical information on APIs,
                intermediates, and finished pharmaceutical formulations.
              </motion.p>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <MotionImage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeInOut", duration: 0.7 }}
                src="/visual-img.png"
                alt="Trade Data Visualization"
                width={600}
                height={400}
                className="rounded-xl"
              />
            </div>
          </div>
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