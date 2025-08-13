"use client"
import Image from "next/image";
import { Globe, Users, TrendingUp, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function About() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const values = [
    {
      title: "Data-Driven Insights",
      description:
        "We convert complex raw data into precise, actionable intelligence tailored to the pharmaceutical industry. Our insights empower businesses to anticipate market trends, optimize sourcing strategies, and make evidence-based decisions, ensuring sustained growth and a competitive edge in an evolving global market.",
      icon: Globe,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Reliability & Security",
      description:
        "We uphold the highest standards of accuracy and data integrity, delivering reliable information you can count on. With robust security measures, we ensure the confidentiality and protection of your data, building trust through every interaction.",
      icon: Shield,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Global Data Access",
      description:
        "Tap into an expansive database of over 10 million worldwide shipment records, delivering unparalleled insights into pharmaceutical trade dynamics. Our platform provides real-time, actionable intelligence, enabling you to uncover emerging opportunities, monitor global trends, and outpace competitors with data-backed strategies that redefine market leadership.",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Team Excellence & Support",
      description:
        "Our dedicated team of industry experts combines deep pharmaceutical knowledge with data analytics expertise to deliver exceptional support. We provide personalized guidance and insights, ensuring you maximize the value of our platform for your strategic objectives.",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const whyChoose = [
    {
      title: "Global Coverage",
      description:
        "Our comprehensive database captures every essential detail of the pharmaceutical trade, from APIs to finished products, worldwide.",
      link: "/about",
    },
    {
      title: "Actionable Insights",
      description:
        "Transform complex trade data into meaningful, actionable insights with our easy-to-use SaaS platform, built for the pharmaceutical industry.",
      link: "/about",
    },
    {
      title: "Dedicated Expertise",
      description:
        "Work with our industry experts who understand your unique challenges and help you unlock new market opportunities.",
      link: "/about",
    },
  ];

  const stats = [
    { number: "10M+", label: "Global Records" },
    { number: "150+", label: "Countries Covered" },
    { number: "24/7", label: "Expert Support" },
    { number: "99.9%", label: "Data Accuracy" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 mb-6">
              <span className="text-sm font-medium text-blue-700">About TransDataNexus</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent"
              >
                Empowering Global
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"
              >
                Pharma Intelligence
              </motion.span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive intelligence on global pharmaceutical trade, 
              transforming data into strategic advantage.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 max-w-7xl py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">
                Our Mission
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
            </div>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                At TransData Nexus, we are committed to simplifying access to
                global pharmaceutical trade. Our mission is to provide actionable
                data and insights that help businesses make smarter decisions,
                reduce risks, and find best deals in the market.
              </p>
              <p>
                We strive to empower our clients with actionable insights,
                enabling them to uncover new opportunities, manage risks
                effectively, and maintain a competitive edge in the dynamic
                pharmaceutical industry.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                <Link href="/services" className="flex items-center gap-2">
                  Explore Our Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-2 border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 px-8 py-3 rounded-xl font-medium transition-all duration-300">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/image-ebip-2.png"
                alt="TransDataNexus Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-slate-900">Trusted by Industry Leaders</p>
                  <p className="text-sm text-slate-600">Global pharmaceutical companies</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="container mx-auto px-4 max-w-7xl py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-6 mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900">
            Our Core Values
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The principles that drive our innovation and commitment to excellence
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <Card className="relative z-10 transition-all duration-300 hover:shadow-xl border-0 bg-white/80 backdrop-blur-sm h-full group-hover:scale-105">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8 mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900">
              Why Choose TransDataNexus?
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Elevate your pharmaceutical business with our powerful intelligence
              platform. Gain access to over 10 million global shipment records,
              enhanced by real-time updates and advanced analytics.
            </p>
          </motion.div>
          
          <HoverEffect items={whyChoose} />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 max-w-7xl py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <h2 className="text-4xl font-bold text-slate-900">
            Ready to Redefine Your Global Trade Strategy?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join the leaders in the pharmaceutical industry who trust
            TransDataNexus to stay ahead of the curve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link href="/contact" className="flex items-center gap-2">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" className="border-2 border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 px-8 py-4 rounded-xl font-medium transition-all duration-300">
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
