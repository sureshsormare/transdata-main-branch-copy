"use client"

import { useState } from "react"
import { z } from "zod"
import { BiRightArrow } from "react-icons/bi"
import { FaBuilding, FaEnvelope, FaPhone, FaUser, FaGlobe } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const trialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  organization: z.string().min(2, "Organization name is required"),
  contact: z.string().min(10, "Contact number is required"),
  industry: z.string().min(1, "Please select your industry"),
  useCase: z.string().min(10, "Please describe your intended use case"),
})

type TrialFormData = z.infer<typeof trialFormSchema>

interface FormErrors {
  [key: string]: string
}

export function TrialSignupForm() {
  const [formData, setFormData] = useState<TrialFormData>({
    name: "",
    email: "",
    organization: "",
    contact: "",
    industry: "",
    useCase: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFormData((prev: TrialFormData) => ({ ...prev, [name]: value }))
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev: FormErrors) => ({ ...prev, [name]: "" }))
    }
    
    // Clear general messages when user interacts with form
    if (successMessage || errorMessage) {
      setSuccessMessage(null)
      setErrorMessage(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      // Validate form data
      const validatedData = trialFormSchema.parse(formData)
      
      console.log("Sending trial signup:", validatedData)
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validatedData,
          message: `Trial Signup - ${validatedData.useCase}`,
          inquiryType: "trial"
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("API Error:", { status: response.status, result })
        throw new Error(result.error || `Failed to create trial account (Status: ${response.status})`)
      }

      if (result.success) {
        setSuccessMessage("🎉 Welcome to TransDataNexus! Your free trial account has been created successfully. Check your email for login credentials and start exploring our platform immediately.")
        setFormData({
          name: "",
          email: "",
          organization: "",
          contact: "",
          industry: "",
          useCase: "",
        })
      } else {
        throw new Error(result.error || "Something went wrong")
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}
        error.errors.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-2xl font-semibold text-[#1b6cae] mb-6 text-center">
        Create Your Free Trial Account
      </h2>
      
      <form
        className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg border border-blue-100 p-8"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Row 1 - Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#1b6cae]">
              Full Name *
            </Label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae] text-sm" />
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`pl-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="Enter your full name"
                required
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </div>
            {errors.name && (
              <p id="name-error" className="text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1b6cae]">
              Email *
            </Label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae] text-sm" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="Enter your email address"
                required
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Row 2 - Organization and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-[#1b6cae]">
              Organization Name *
            </Label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae] text-sm" />
              <Input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleInputChange}
                className={`pl-10 ${errors.organization ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="Enter your organization name"
                required
                aria-describedby={errors.organization ? "organization-error" : undefined}
              />
            </div>
            {errors.organization && (
              <p id="organization-error" className="text-sm text-red-600">
                {errors.organization}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact" className="text-[#1b6cae]">
              Contact Number *
            </Label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae] text-sm" />
              <Input
                id="contact"
                name="contact"
                type="tel"
                value={formData.contact}
                onChange={handleInputChange}
                className={`pl-10 ${errors.contact ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="Enter your contact number"
                required
                aria-describedby={errors.contact ? "contact-error" : undefined}
              />
            </div>
            {errors.contact && (
              <p id="contact-error" className="text-sm text-red-600">
                {errors.contact}
              </p>
            )}
          </div>
        </div>

        {/* Row 3 - Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-[#1b6cae]">
            Industry *
          </Label>
          <div className="relative">
            <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae] text-sm" />
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition ${
                errors.industry ? "border-red-500 focus:ring-red-500" : ""
              }`}
              required
              aria-describedby={errors.industry ? "industry-error" : undefined}
            >
              <option value="">Select your industry</option>
              <option value="Pharmaceutical Manufacturing">Pharmaceutical Manufacturing</option>
              <option value="API Manufacturing">API Manufacturing</option>
              <option value="Finished Formulations">Finished Formulations</option>
              <option value="Pharmaceutical Trading">Pharmaceutical Trading</option>
              <option value="Contract Manufacturing">Contract Manufacturing</option>
              <option value="Research & Development">Research & Development</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.industry && (
            <p id="industry-error" className="text-sm text-red-600">
              {errors.industry}
            </p>
          )}
        </div>

        {/* Row 4 - Use Case */}
        <div className="space-y-2">
          <Label htmlFor="useCase" className="text-[#1b6cae]">
            How do you plan to use TransDataNexus? *
          </Label>
          <div className="relative">
            <textarea
              id="useCase"
              name="useCase"
              rows={4}
              value={formData.useCase}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition resize-none ${
                errors.useCase ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="Tell us about your specific needs, challenges, or what you hope to achieve with our platform..."
              required
              aria-describedby={errors.useCase ? "useCase-error" : undefined}
            />
          </div>
          {errors.useCase && (
            <p id="useCase-error" className="text-sm text-red-600">
              {errors.useCase}
            </p>
          )}
        </div>

        {/* Trial Terms */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Trial Terms:</p>
              <ul className="space-y-1 text-xs">
                <li>• 7-day free trial with full platform access</li>
                <li>• No credit card required to start</li>
                <li>• Cancel anytime during the trial period</li>
                <li>• Full customer support included</li>
                <li>• Your data is secure and private</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              <>
                Start Free Trial <BiRightArrow />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 