"use client"

import { useState } from "react"
import { z } from "zod"
import { BiRightArrow } from "react-icons/bi"
import { FaBuilding, FaEnvelope, FaPhone, FaUser, FaCalendar, FaClock } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const demoFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  organization: z.string().min(2, "Organization name is required"),
  contact: z.string().min(10, "Contact number is required"),
  companySize: z.string().min(1, "Please select company size"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  useCase: z.string().min(10, "Please describe your use case"),
})

type DemoFormData = z.infer<typeof demoFormSchema>

interface FormErrors {
  [key: string]: string
}

export function DemoRequestForm() {
  const [formData, setFormData] = useState<DemoFormData>({
    name: "",
    email: "",
    organization: "",
    contact: "",
    companySize: "",
    preferredDate: "",
    preferredTime: "",
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
    setFormData((prev: DemoFormData) => ({ ...prev, [name]: value }))
    
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
      const validatedData = demoFormSchema.parse(formData)
      
      console.log("Sending demo request:", validatedData)
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validatedData,
          message: `Demo Request - ${validatedData.useCase}`,
          inquiryType: "demo"
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("API Error:", { status: response.status, result })
        throw new Error(result.error || `Failed to send demo request (Status: ${response.status})`)
      }

      if (result.success) {
        setSuccessMessage("Thank you! Your demo request has been submitted successfully. Our team will contact you within 24 hours to schedule your personalized demo.")
        setFormData({
          name: "",
          email: "",
          organization: "",
          contact: "",
          companySize: "",
          preferredDate: "",
          preferredTime: "",
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

  // Generate next 7 days for date selection
  const getNextDays = () => {
    const days = []
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-2xl font-semibold text-[#1b6cae] mb-6 text-center">
        Schedule Your Personalized Demo
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

        {/* Row 3 - Company Size and Preferred Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companySize" className="text-[#1b6cae]">
              Company Size *
            </Label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae] text-sm" />
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition ${
                  errors.companySize ? "border-red-500 focus:ring-red-500" : ""
                }`}
                required
                aria-describedby={errors.companySize ? "companySize-error" : undefined}
              >
                <option value="">Select company size</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
            {errors.companySize && (
              <p id="companySize-error" className="text-sm text-red-600">
                {errors.companySize}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredDate" className="text-[#1b6cae]">
              Preferred Date *
            </Label>
            <div className="relative">
              <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae] text-sm" />
              <select
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition ${
                  errors.preferredDate ? "border-red-500 focus:ring-red-500" : ""
                }`}
                required
                aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined}
              >
                <option value="">Select preferred date</option>
                {getNextDays().map((date) => {
                  const day = new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })
                  return (
                    <option key={date} value={date}>
                      {day}
                    </option>
                  )
                })}
              </select>
            </div>
            {errors.preferredDate && (
              <p id="preferredDate-error" className="text-sm text-red-600">
                {errors.preferredDate}
              </p>
            )}
          </div>
        </div>

        {/* Row 4 - Preferred Time */}
        <div className="space-y-2">
          <Label htmlFor="preferredTime" className="text-[#1b6cae]">
            Preferred Time *
          </Label>
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae] text-sm" />
            <select
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition ${
                errors.preferredTime ? "border-red-500 focus:ring-red-500" : ""
              }`}
              required
              aria-describedby={errors.preferredTime ? "preferredTime-error" : undefined}
            >
              <option value="">Select preferred time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>
          {errors.preferredTime && (
            <p id="preferredTime-error" className="text-sm text-red-600">
              {errors.preferredTime}
            </p>
          )}
        </div>

        {/* Row 5 - Use Case */}
        <div className="space-y-2">
          <Label htmlFor="useCase" className="text-[#1b6cae]">
            Tell us about your use case *
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
              placeholder="Describe your specific needs, challenges, or what you hope to achieve with TransDataNexus..."
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
            className="bg-[#1b6cae] hover:bg-[#155a8a] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scheduling Demo...
              </div>
            ) : (
              <>
                Schedule Demo <BiRightArrow />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 