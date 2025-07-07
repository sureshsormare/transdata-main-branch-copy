"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, User, Mail, Phone, Building, MessageSquare, CheckCircle } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    message: "",
    newsletter: false,
    agreeToTerms: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          inquiryType: "general"
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          jobTitle: "",
          message: "",
          newsletter: false,
          agreeToTerms: false
        })
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You!
        </h3>
        <p className="text-gray-600 mb-6">
          Your message has been sent successfully. We'll get back to you within 24 hours.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Send Another Message
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            First Name *
          </Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            Last Name *
          </Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="your.email@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company Name
          </Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Your company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            Job Title
          </Label>
          <Input
            id="jobTitle"
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Procurement Manager"
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Message *
        </Label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 resize-none"
          placeholder="Tell us about your needs, questions, or how we can help you..."
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="newsletter"
            checked={formData.newsletter}
            onCheckedChange={(checked) => handleInputChange("newsletter", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="newsletter" className="text-sm text-gray-600 leading-relaxed">
            I would like to receive updates about new features, market insights, and industry news from TransDataNexus.
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
            className="mt-1"
            required
          />
          <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
            I agree to the{" "}
            <a href="/terms-and-conditions" className="text-blue-600 hover:underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            . *
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Sending Message...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </Button>

      {/* Response Time Promise */}
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Quick Response Promise:</strong> We typically respond within 2-4 hours during business hours.
        </p>
      </div>
    </motion.form>
  )
} 