import { Suspense } from "react"
import { Metadata } from "next"
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
            <h1 className="text-4xl text-[#1b6cae] font-extrabold mb-8 text-center">
              Start Your Free 7-Day Trial
            </h1>
            
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