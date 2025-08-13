"use client"
import { motion } from "framer-motion";
import { 
  Database, 
  BarChart3, 
  Brain, 
  FileText, 
  Globe, 
  Shield, 
  Zap, 
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Search,
  BarChart,
  PieChart,
  LineChart,
  MapPin,
  Clock,
  Target,
  Lightbulb,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ProductPage() {
  const products = [
    {
      title: "SaaS Platform",
      subtitle: "Cloud-Based Trade Intelligence",
      description: "Access our comprehensive pharmaceutical trade intelligence platform from anywhere, anytime. Our SaaS solution provides real-time data access, advanced analytics, and collaborative features designed specifically for the pharmaceutical industry.",
      icon: Database,
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "Cloud-based accessibility",
        "Real-time data updates",
        "Multi-user collaboration",
        "Custom dashboards",
        "API integration",
        "Mobile responsive design"
      ],
      benefits: [
        "No installation required",
        "Automatic updates",
        "Scalable infrastructure",
        "99.9% uptime guarantee"
      ],
      stats: {
        users: "10,000+",
        uptime: "99.9%",
        countries: "180+",
        records: "50M+"
      }
    },
    {
      title: "Advanced Trade Data Analytics",
      subtitle: "Comprehensive Market Intelligence",
      description: "Transform raw trade data into actionable insights with our advanced analytics engine. Track market trends, analyze supplier networks, monitor pricing dynamics, and identify emerging opportunities across global pharmaceutical markets.",
      icon: BarChart3,
      gradient: "from-emerald-500 to-teal-500",
      features: [
        "Real-time market monitoring",
        "Supplier network analysis",
        "Pricing trend analysis",
        "Geographic market mapping",
        "Historical data comparison",
        "Custom metric tracking"
      ],
      benefits: [
        "Data-driven decisions",
        "Market opportunity identification",
        "Competitive intelligence",
        "Risk assessment tools"
      ],
      stats: {
        dataPoints: "50M+",
        markets: "180+",
        updates: "24/7",
        accuracy: "99.9%"
      }
    },
    {
      title: "AI Insights",
      subtitle: "Intelligent Market Predictions",
      description: "Leverage artificial intelligence to predict market trends, identify patterns, and generate intelligent recommendations. Our AI engine processes millions of data points to provide predictive analytics and automated insights.",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      features: [
        "Predictive market modeling",
        "Pattern recognition",
        "Automated insights generation",
        "Trend forecasting",
        "Anomaly detection",
        "Smart recommendations"
      ],
      benefits: [
        "Future market predictions",
        "Automated analysis",
        "Intelligent alerts",
        "Proactive insights"
      ],
      stats: {
        predictions: "95%",
        accuracy: "High",
        processing: "Real-time",
        insights: "AI-powered"
      }
    },
    {
      title: "Detailed Advanced Reports",
      subtitle: "Comprehensive Market Analysis",
      description: "Generate comprehensive, customizable reports that provide deep insights into pharmaceutical trade dynamics. From executive summaries to detailed technical analysis, our reporting system delivers the information you need.",
      icon: FileText,
      gradient: "from-orange-500 to-red-500",
      features: [
        "Custom report builder",
        "Executive dashboards",
        "Technical analysis reports",
        "Export capabilities",
        "Scheduled reporting",
        "Multi-format delivery"
      ],
      benefits: [
        "Comprehensive insights",
        "Customizable formats",
        "Automated delivery",
        "Professional presentation"
      ],
      stats: {
        reportTypes: "50+",
        formats: "10+",
        delivery: "Instant",
        customization: "100%"
      }
    }
  ];

  const platformFeatures = [
    {
      icon: Search,
      title: "Smart Search",
      description: "AI-powered search across 50M+ pharmaceutical trade records with intelligent filtering and suggestions."
    },
    {
      icon: BarChart,
      title: "Real-time Analytics",
      description: "Live dashboards with interactive charts, graphs, and visualizations for instant insights."
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Comprehensive data from 180+ countries with detailed regional and country-specific analysis."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance, encryption, and role-based access controls."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with sub-second query response times and real-time data processing."
    },
    {
      icon: Users,
      title: "Collaborative Tools",
      description: "Team collaboration features with shared workspaces, comments, and real-time updates."
    }
  ];

  const useCases = [
    {
      title: "Market Research",
      description: "Conduct comprehensive market research with access to global pharmaceutical trade data and trends.",
      icon: TrendingUp
    },
    {
      title: "Supplier Discovery",
      description: "Find and evaluate suppliers across global markets with detailed company profiles and performance metrics.",
      icon: Target
    },
    {
      title: "Competitive Analysis",
      description: "Monitor competitor activities, market share, and strategic movements in real-time.",
      icon: Lightbulb
    },
    {
      title: "Risk Assessment",
      description: "Identify and mitigate supply chain risks with predictive analytics and market intelligence.",
      icon: Cpu
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
              <span className="text-sm font-medium text-blue-700">Our Products</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent"
              >
                Comprehensive
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
              Discover our suite of powerful tools designed to transform pharmaceutical trade data into strategic advantage.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 max-w-7xl py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 border-0 bg-white/80 backdrop-blur-sm group-hover:scale-[1.02] group-hover:bg-white/95 relative overflow-hidden">
                <motion.div 
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                />
                <CardHeader className="pb-4 relative">
                  <motion.div 
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`w-12 h-12 bg-gradient-to-br ${product.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300`}
                  >
                    <product.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent text-slate-900">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-slate-600">
                    {product.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {product.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {product.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                      Benefits
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {product.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-xs text-slate-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                    {Object.entries(product.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-bold text-blue-600">{value}</div>
                        <div className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Platform Features */}
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
              Platform Features
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built for the pharmaceutical industry with enterprise-grade features and reliability
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="container mx-auto px-4 max-w-7xl py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-6 mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900">
            Use Cases
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover how our products can transform your pharmaceutical business operations
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="transition-all duration-300 hover:shadow-xl border-0 bg-white/80 backdrop-blur-sm h-full group-hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <useCase.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {useCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
            Discover how our comprehensive product suite can elevate your pharmaceutical business
            with advanced intelligence and insights.
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