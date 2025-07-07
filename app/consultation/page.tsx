import { Suspense } from "react"
import { Metadata } from "next"
import PlexusBackground from "@/components/PlexusBackground"
import { ConsultationForm } from "./ConsultationForm"
import { ConsultationInfo } from "./ConsultationInfo"

export const metadata: Metadata = {
  title: "Consult an Expert - TransDataNexus",
  description: "Schedule a consultation with our pharmaceutical trade intelligence experts. Get personalized advice on how TransDataNexus can transform your business operations.",
  keywords: ["consultation", "expert advice", "TransDataNexus", "pharmaceutical trade intelligence", "business consultation"],
}

export default function ConsultationPage() {
  return (
    <div className="min-h-screen w-full bg-cover bg-center">
      <PlexusBackground nodeCount={100} maxDistance={120}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-md max-w-5xl w-full px-6 pt-10 pb-12 my-12">
            <h1 className="text-4xl text-[#1b6cae] font-extrabold mb-8 text-center">
              Consult Our Experts
            </h1>
            
            <ConsultationInfo />
            
            <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
              <ConsultationForm />
            </Suspense>
          </div>
        </div>
      </PlexusBackground>
    </div>
  )
} 