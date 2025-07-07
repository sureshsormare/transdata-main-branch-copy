import { Suspense } from "react"
import { Metadata } from "next"
import PlexusBackground from "@/components/PlexusBackground"
import { DemoRequestForm } from "./DemoRequestForm"
import { DemoInfo } from "./DemoInfo"

export const metadata: Metadata = {
  title: "Request Demo - TransDataNexus",
  description: "Schedule a personalized demo of TransDataNexus pharmaceutical trade intelligence platform. See how our AI-powered analytics can transform your business decisions.",
  keywords: ["demo", "TransDataNexus", "pharmaceutical trade intelligence", "AI analytics", "platform demo"],
}

export default function DemoRequestPage() {
  return (
    <div className="min-h-screen w-full bg-cover bg-center">
      <PlexusBackground nodeCount={100} maxDistance={120}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-md max-w-5xl w-full px-6 pt-10 pb-12 my-12">
            <h1 className="text-4xl text-[#1b6cae] font-extrabold mb-8 text-center">
              Request Your Personalized Demo
            </h1>
            
            <DemoInfo />
            
            <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
              <DemoRequestForm />
            </Suspense>
          </div>
        </div>
      </PlexusBackground>
    </div>
  )
} 