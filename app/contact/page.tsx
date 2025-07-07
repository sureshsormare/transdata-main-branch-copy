import { Suspense } from "react"
import { Metadata } from "next"
import PlexusBackground from "@/components/PlexusBackground"
import { ContactForm } from "./ContactForm"
import { ContactInfo } from "./ContactInfo"

export const metadata: Metadata = {
  title: "Contact Us - TransDataNexus",
  description: "Get in touch with TransDataNexus. We're here to help with your data analytics and business intelligence needs. Contact us today for a consultation.",
  keywords: ["contact", "TransDataNexus", "data analytics", "business intelligence", "consultation"],
}

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full">
      <PlexusBackground nodeCount={80} maxDistance={100}>
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your pharmaceutical trade operations? Our expert team is here to help you 
              leverage the power of AI-driven market intelligence.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Left Column - Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Tell us about your needs and we'll get back to you within 24 hours.
                  </p>
                </div>
                
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading form...</span>
                  </div>
                }>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

            {/* Right Column - Contact Information & Quick Actions */}
            <div className="order-1 lg:order-2">
              <ContactInfo />
            </div>
          </div>

          {/* Additional Contact Options */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Other Ways to Connect
              </h2>
              <p className="text-lg text-blue-100">
                Choose the option that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Actions Cards */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Request Demo</h3>
                <p className="text-blue-100 mb-6">
                  See our platform in action with a personalized 30-minute demo
                </p>
                <a 
                  href="/request-demo"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                >
                  Schedule Demo
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Start Free Trial</h3>
                <p className="text-blue-100 mb-6">
                  Get instant access to our platform with a 7-day free trial
                </p>
                <a 
                  href="/trial"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                >
                  Start Trial
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Expert Consultation</h3>
                <p className="text-blue-100 mb-6">
                  Get personalized advice from our industry experts
                </p>
                <a 
                  href="/consultation"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Book Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </PlexusBackground>
    </div>
  )
}
