import { Suspense } from "react"
import { Metadata } from "next"
import { motion } from "framer-motion"
import PlexusBackground from "@/components/PlexusBackground"
import { TrialSignupForm } from "./TrialSignupForm"
import { TrialInfo } from "./TrialInfo"

export const metadata: Metadata = {
  title: "Start Free 7-Day Trial - TransDataNexus",
  description: "Start your free 7-day trial of TransDataNexus pharmaceutical trade intelligence platform. No credit card required. Get instant access to 50M+ trade records.",
  keywords: ["free trial", "TransDataNexus", "pharmaceutical trade intelligence", "7-day trial", "no credit card"],
}

export default function TrialPage() {
  return (
    <div className="min-h-screen w-full bg-cover bg-center">
      <PlexusBackground nodeCount={100} maxDistance={120}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-md max-w-5xl w-full px-6 pt-10 pb-12 my-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-extrabold mb-8 text-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"
              >
                Start Your Free
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent"
              >
                7-Day Trial
              </motion.span>
            </motion.h1>
            
            <TrialInfo />
            
            <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
              <TrialSignupForm />
            </Suspense>
          </div>
        </div>
      </PlexusBackground>
    </div>
  )
} 