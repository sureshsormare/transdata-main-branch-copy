"use client"
import { Database, Users, LifeBuoy, LineChart, ArrowRight, CheckCircle, Zap, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Services() {
  const services = [
    {
      title: "Data Analytics Platform",
      description:
        "Our advanced analytics platform transforms complex pharmaceutical trade data into actionable insights. Access real-time monitoring of global shipments, analyze price trends, and map comprehensive supplier-buyer networks. Through intuitive dashboards, track market movements and generate custom reports tailored to your business objectives. The platform integrates powerful visualization tools that simplify data interpretation and strategic decision-making.",
      icon: LineChart,
      gradient: "from-blue-500 to-cyan-500",
      features: ["Real-time monitoring", "Custom dashboards", "Advanced visualizations", "Predictive analytics"],
    },
    {
      title: "Global Trade Repository",
      description:
        "Leverage our extensive database of over 50 million worldwide pharmaceutical shipment records. This comprehensive repository provides granular insights into transaction details, including origins, destinations, product specifications, and pricing. Track historical trade patterns, analyze market dynamics, and identify emerging trends across global markets. Our repository serves as your centralized source for authentic, validated trade intelligence.",
      icon: Database,
      gradient: "from-emerald-500 to-teal-500",
      features: ["50M+ records", "Global coverage", "Historical data", "Real-time updates"],
    },
    {
      title: "Analytics Solutions",
      description:
        "Transform raw data into strategic advantage through our sophisticated analytics tools. Identify untapped market opportunities, analyze competitive landscapes, and optimize supply chain decisions with AI-powered insights. Our platform enables you to assess market penetration strategies, track competitor movements, and forecast industry trends. Get customized analysis that aligns with your specific business goals and challenges.",
      icon: LifeBuoy,
      gradient: "from-purple-500 to-pink-500",
      features: ["AI-powered insights", "Market forecasting", "Competitive analysis", "Custom reports"],
    },
    {
      title: "Expert Support",
      description:
        "Access dedicated assistance from industry specialists who understand the nuances of pharmaceutical trade. Our experts provide guidance in data interpretation, helping you maximize the value of our platform. Receive strategic recommendations based on market analysis, ensuring you make informed decisions. Count on timely support for custom reports and specialized market insights tailored to your needs.",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
      features: ["24/7 support", "Industry experts", "Strategic guidance", "Custom solutions"],
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time data processing and instant insights delivery"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Comprehensive coverage across 150+ countries worldwide"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance and encryption"
    },
    {
      icon: CheckCircle,
      title: "Proven Accuracy",
      description: "99.9% data accuracy with continuous validation processes"
    }
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
              <span className="text-sm font-medium text-blue-700">Our Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
              Comprehensive
              <br />
              <span className="text-blue-600">Pharma Intelligence</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Empowering your business with comprehensive pharma trade data and
              expert insights for strategic decision-making.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 max-w-7xl py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="transition-all duration-300 hover:shadow-xl border-0 bg-white/80 backdrop-blur-sm h-full group-hover:scale-[1.02]">
                <CardHeader className="pb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CardDescription className="text-slate-600 leading-relaxed text-base">
                    {service.description}
                  </CardDescription>
                  
                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-16"
          >
            <h2 className="text-4xl font-bold text-white">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built for the pharmaceutical industry with enterprise-grade features and reliability
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
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
            Ready to Transform Your Trade Strategy?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover how TransDataNexus can elevate your pharmaceutical business
            with comprehensive trade intelligence and expert support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link href="/contact" className="flex items-center gap-2">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" className="border-2 border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 px-8 py-4 rounded-xl font-medium transition-all duration-300">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
