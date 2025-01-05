"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Here you would typically send the form data to your server
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
    setIsSubmitting(false);
    alert("Thank you for your interest! We will contact you soon.");
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-20'>
      <div className='container mx-auto px-4 max-w-7xl'>
        <div className='text-center space-y-4 mb-20'>
          <h1 className='text-4xl md:text-5xl font-bold text-violet-700 leading-tight'>
            Contact Us
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Get in touch with our team for inquiries, support, or to schedule a
            demo of our powerful trade data platform.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12 items-start mb-20'>
          <div>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>
              Get in Touch
            </h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' name='name' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Business Email</Label>
                <Input id='email' name='email' type='email' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone</Label>
                <Input id='phone' name='phone' type='tel' />
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='demo' name='demo' />
                <Label htmlFor='demo'>I am interested in a demo</Label>
              </div>
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
          <div className='space-y-8'>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl font-bold text-violet-700'>
                  Trade Insights
                </CardTitle>
                <CardDescription>
                  Latest global pharma trade statistics
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-lg font-semibold'>Did you know?</p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    The global pharmaceutical market was valued at $1.27
                    trillion in 2020.
                  </li>
                  <li>
                    North America accounts for 49% of the global pharma market.
                  </li>
                  <li>
                    The top 10 pharma companies control over 30% of the global
                    market share.
                  </li>
                  <li>
                    Oncology drugs represent the largest therapeutic class by
                    revenue.
                  </li>
                </ul>
                <p className='text-sm text-gray-600 italic'>
                  Source: TransDataNexus Analysis, 2023
                </p>
              </CardContent>
            </Card>
            <div className='space-y-4'>
              <h3 className='text-2xl font-bold text-gray-800'>Our Office</h3>
              <div className='flex items-start space-x-4'>
                <MapPin className='w-6 h-6 text-violet-600 flex-shrink-0 mt-1' />
                <p className='text-gray-600'>
                  Baner High Street Pune, 411045
                  <br />
                  Maharashtra, India
                </p>
              </div>
              <div className='flex items-center space-x-4'>
                <Phone className='w-6 h-6 text-violet-600' />
                <p className='text-gray-600'>+1 (020) 23142-4232</p>
              </div>
              <div className='flex items-center space-x-4'>
                <Mail className='w-6 h-6 text-violet-600' />
                <p className='text-gray-600'>info@transdatanexus.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center space-y-6'>
          <h2 className='text-3xl font-bold text-gray-800'>
            Ready to unlock the power of global pharma trade data?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Schedule a demo today and see how TransDataNexus can transform your
            business decisions.
          </p>
          <Button
            size='lg'
            className='bg-violet-500 hover:bg-violet-600 py-6 rounded-xl text-white'
          >
            Schedule a Demo <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}
