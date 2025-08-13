"use client";

import { motion } from "framer-motion";
import {
  Star,
  Users,
  Check,
  Building2,
  Rocket,
  Building,
  UserRound,
  ArrowRight,
  Download,
  Globe,
  Shield,
  Clock,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Crown,
  Sparkles,
  Award,
  Headphones,
  FileText,
  Database,
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { MdAssistant } from "react-icons/md";
import { useState } from "react";

// FAQ Data
const faqData = [
  {
    question: "Can I upgrade my plan anytime?",
    answer: "Yes, you can upgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
  },
  {
    question: "What happens when I reach my search limit?",
    answer: "You'll receive a notification when you're close to your limit. You can either upgrade your plan or wait until your next billing cycle for a reset."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a 5-day free trial with 50 searches to help you evaluate our platform before committing to a paid plan."
  },
  {
    question: "Do you offer custom enterprise plans?",
    answer: "Absolutely! For large organizations with specific needs, we offer custom enterprise plans with dedicated support and tailored features."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
  }
];

// Testimonials Data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Supply Chain Manager",
    company: "PharmaCorp",
    content: "TransDataNexus has revolutionized our import/export tracking. The data accuracy and insights have saved us countless hours.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Operations Director",
    company: "Global Logistics Inc",
    content: "The platform's comprehensive coverage of 180+ countries and real-time updates have been game-changing for our operations.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Trade Analyst",
    company: "TradeFlow Solutions",
    content: "Excellent customer support and the most reliable trade data I've ever used. Highly recommended for any business in international trade.",
    rating: 5
  }
];

// Features Data
const features = [
  {
    name: "Number of Searches",
    trial: "50",
    startup: "5,000",
    sme: "20,000",
    corporate: "Unlimited",
    icon: SearchIcon
  },
  {
    name: "Validity Period",
    trial: "5 Days",
    startup: "1 Year",
    sme: "1 Year",
    corporate: "1 Year",
    icon: Calendar
  },
  {
    name: "Complete Shipment Details",
    trial: false,
    startup: true,
    sme: true,
    corporate: true,
    icon: FileText
  },
  {
    name: "Exporter View Access",
    trial: "10 records",
    startup: "Unlimited",
    sme: "Unlimited",
    corporate: "Unlimited",
    icon: Building2
  },
  {
    name: "Importer View Access",
    trial: "10 records",
    startup: "Unlimited",
    sme: "Unlimited",
    corporate: "Unlimited",
    icon: Building
  },
  {
    name: "Excel Downloads",
    trial: "500",
    startup: "400,000",
    sme: "1,600,000",
    corporate: "4,000,000",
    icon: Download
  },
  {
    name: "Number of Users",
    trial: "1",
    startup: "3",
    sme: "10",
    corporate: "15",
    icon: Users
  },
  {
    name: "Priority Support",
    trial: false,
    startup: false,
    sme: true,
    corporate: true,
    icon: Headphones
  },
  {
    name: "Advanced Analytics",
    trial: false,
    startup: false,
    sme: true,
    corporate: true,
    icon: BarChart3
  },
  {
    name: "API Access",
    trial: false,
    startup: false,
    sme: false,
    corporate: true,
    icon: Database
  }
];

function SearchIcon() {
  return <Search className="w-4 h-4" />;
}

export default function Pricing() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const pricingPlans = [
    {
      name: "Trial Account",
      price: 0,
      period: "Forever",
      icon: Users,
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      features: ["50 searches", "5 days validity", "Basic support", "1 user"]
    },
    {
      name: "Startup",
      price: 500,
      period: "/year",
      icon: Rocket,
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      features: ["5,000 searches", "1 year validity", "Email support", "3 users", "Excel downloads"]
    },
    {
      name: "SME",
      price: 1500,
      period: "/year",
      icon: Building2,
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      popular: true,
      features: ["20,000 searches", "1 year validity", "Priority support", "10 users", "Advanced analytics"]
    },
    {
      name: "Corporate",
      price: 4000,
      period: "/year",
      icon: Building,
      color: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      features: ["Unlimited searches", "1 year validity", "Dedicated support", "15 users", "API access"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="relative container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Trusted by 1000+ companies worldwide
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold leading-tight"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"
              >
                Simple, Transparent
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent"
              >
                Pricing
              </motion.span>
            </motion.h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your business. All plans include access to 180+ countries with usage-based pricing.
            </p>
            
            {/* Annual Pricing Badge */}
            <div className="flex items-center justify-center mt-8">
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                Annual Plans Only - Best Value
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="container mx-auto px-4 max-w-7xl -mt-10 mb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 font-bold text-lg">4.8</span>
            </div>
            <p className="text-gray-600 text-sm">Rated by 100+ satisfied customers</p>
          </Card>

          <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Headphones className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900">24/7 Dedicated Support</p>
            <p className="text-gray-600 text-sm">Personalized assistance whenever you need it</p>
          </Card>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 max-w-7xl mb-20">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-2 right-2 z-50">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    Popular
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center pb-4 ${plan.color} bg-gradient-to-br`}>
                <div className={`w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  size="lg"
                  asChild
                >
                  <Link href="/contact">
                    {plan.name === "Trial Account" ? "Start Free Trial" : "Get Started"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Comparison Table */}
      <div className="container mx-auto px-4 max-w-7xl mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See exactly what each plan includes. All plans provide access to our comprehensive database of 180+ countries.
          </p>
        </div>
        
        <Card className="overflow-hidden shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[300px] font-semibold text-gray-900">Features</TableHead>
                    <TableHead className="text-center font-semibold text-gray-900">Trial</TableHead>
                    <TableHead className="text-center font-semibold text-gray-900">Startup</TableHead>
                    <TableHead className="text-center font-semibold text-gray-900">SME</TableHead>
                    <TableHead className="text-center font-semibold text-gray-900">Corporate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-50/50' : ''}>
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <feature.icon className="w-4 h-4 text-blue-600" />
                          {feature.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {typeof feature.trial === 'boolean' ? (
                          feature.trial ? (
                            <Check className="w-5 h-5 mx-auto text-green-500" />
                          ) : (
                            <span className="text-red-500">✕</span>
                          )
                        ) : (
                          <span className="font-medium">{feature.trial}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {typeof feature.startup === 'boolean' ? (
                          feature.startup ? (
                            <Check className="w-5 h-5 mx-auto text-green-500" />
                          ) : (
                            <span className="text-red-500">✕</span>
                          )
                        ) : (
                          <span className="font-medium">{feature.startup}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {typeof feature.sme === 'boolean' ? (
                          feature.sme ? (
                            <Check className="w-5 h-5 mx-auto text-green-500" />
                          ) : (
                            <span className="text-red-500">✕</span>
                          )
                        ) : (
                          <span className="font-medium">{feature.sme}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {typeof feature.corporate === 'boolean' ? (
                          feature.corporate ? (
                            <Check className="w-5 h-5 mx-auto text-green-500" />
                          ) : (
                            <span className="text-red-500">✕</span>
                          )
                        ) : (
                          <span className="font-medium">{feature.corporate}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 max-w-7xl mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">Join thousands of satisfied customers worldwide</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 max-w-4xl mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">Everything you need to know about our pricing and plans</p>
        </div>
        
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 max-w-4xl mb-20">
        <Card className="text-center p-12 border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust TransDataNexus for their international trade data needs. 
            Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/contact">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/contact">Schedule a Demo</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="container mx-auto px-4 max-w-7xl pb-20">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            * Except certain premium countries and regions. All prices are in USD.
          </p>
          <p className="text-sm text-gray-500">
            Need a custom plan? <Link href="/contact" className="text-blue-600 hover:underline">Contact our sales team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
