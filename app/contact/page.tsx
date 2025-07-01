"use client";

import PlexusBackground from "@/components/PlexusBackground";
import React, { useState } from "react";
import { BiRightArrow } from "react-icons/bi";
import { FaBuilding, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { MdAddIcCall } from "react-icons/md";
import { RiMailAddFill } from "react-icons/ri";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    contact: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Basic validation
      if (!form.name || !form.email) {
        setError("Name and Email are required.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setSuccess("Thank you! Your message has been sent.");
          setForm({
            name: "",
            email: "",
            organization: "",
            contact: "",
            message: "",
          });
        } else {
          setError(data.error || "Something went wrong.");
        }
      } catch {
        setError("Something went wrong.");
      }
      setLoading(false);
    };

    return (
      <div className="min-h-screen w-full bg-cover bg-center">
        <PlexusBackground nodeCount={100} maxDistance={120}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-md max-w-5xl w-full px-6 pt-10 pb-12 my-12">
              <h1 className="text-4xl text-[#1b6cae] font-extrabold mb-8 text-center">
                Let&apos;s Get In Touch!
              </h1>
              {/* Contact Info Card */}
              <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 gap-y-8 bg-white rounded-2xl shadow-md border border-blue-100 p-8 mb-12">
                {/* Phone */}
                <div className="flex flex-col items-start gap-4 flex-1">
                  <span className="inline-flex items-center justify-center border p-3 rounded bg-blue-50">
                    <MdAddIcCall className="text-[#1b6cae] text-2xl" />
                  </span>
                  <div className="flex flex-col items-start gap-2">
                    <a
                      href="tel:+919595078788"
                      className="font-semibold text-blue-900 hover:underline"
                    >
                      +91 95950 78788
                    </a>
                    <a
                      href="tel:+917977394846"
                      className="font-semibold text-blue-900 hover:underline"
                    >
                      +91 79773 94846
                    </a>
                  </div>
                </div>
                {/* Email */}
                <div className="flex flex-col items-start gap-4 flex-1">
                  <span className="inline-flex items-center justify-center border p-3 rounded bg-blue-50">
                    <RiMailAddFill className="text-[#1b6cae] text-2xl" />
                  </span>
                  <div className="flex flex-col items-start gap-2">
                    <a
                      href="mailto:info@transdatanexus.com"
                      className="font-semibold text-blue-900 hover:underline"
                    >
                      info@transdatanexus.com
                    </a>
                    <a
                      href="mailto:komal@transdatanexus.com"
                      className="font-semibold text-blue-900 hover:underline"
                    >
                      komal@transdatanexus.com
                    </a>
                  </div>
                </div>
                {/* Address */}
                <div className="flex flex-col items-start gap-4 flex-1">
                  <span className="inline-flex items-center justify-center border p-3 rounded bg-blue-50">
                    <IoLocationSharp className="text-[#1b6cae] text-2xl" />
                  </span>
                  <a
                    href="https://maps.app.goo.gl/usBhVAq7UDta2fGF6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start gap-2 text-blue-900 font-semibold leading-tight hover:underline"
                  >
                    <span className="whitespace-nowrap">Kolivery Village,</span>
                    <span className="whitespace-nowrap">
                      Mathuradas Colony,
                    </span>
                    <span className="whitespace-nowrap">
                      Kalina, Vakola, Santacruz East,
                    </span>
                    <span className="whitespace-nowrap">
                      Mumbai, Maharashtra 400098
                    </span>
                  </a>
                </div>
              </div>
              {/* Contact Form */}
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-semibold text-[#1b6cae] mb-6 text-center">
                  Or fill out the form below
                </h2>
                <form
                  className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg border border-blue-100 p-8"
                  onSubmit={handleSubmit}
                >
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#1b6cae] block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae]" />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[#1b6cae] block text-sm font-medium mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae]" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#1b6cae] block text-sm font-medium mb-1">
                        Organization Name
                      </label>
                      <div className="relative">
                        <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae]" />
                        <input
                          type="text"
                          name="organization"
                          value={form.organization}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[#1b6cae] block text-sm font-medium mb-1">
                        Contact Number
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1b6cae]" />
                        <input
                          type="tel"
                          name="contact"
                          value={form.contact}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Row 3 - Full width Textarea */}
                  <div>
                    <label className="text-[#1b6cae] block text-sm font-medium mb-1">
                      Inquiry Purpose
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-3 text-[#1b6cae]" />
                      <textarea
                        rows={4}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-blue-200 outline-none transition"
                      ></textarea>
                    </div>
                  </div>
                  {error && <div className="text-red-600">{error}</div>}
                  {success && <div className="text-green-600">{success}</div>}
                  {/* Submit Button */}
                  <div className="text-right flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-x-3 px-10 py-3 text-base bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition"
                      disabled={loading}
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          Submit Form <BiRightArrow />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </PlexusBackground>
      </div>
    );
  };
export default Contact;
