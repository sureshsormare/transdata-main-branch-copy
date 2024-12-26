import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className='bg-gradient-to-br from-sky-500 to-sky-600 min-h-screen'>
        <div className='container mx-auto px-4 py-16'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='md:w-1/2 text-white'>
              <h1 className='text-4xl md:text-6xl font-bold mb-6'>
                Unlock Global Pharma Trade Insights
              </h1>
              <p className='text-xl mb-8'>
                Gain valuable insights into international trade data for
                pharmaceutical products. Make informed decisions and stay ahead
                of the competition.
              </p>
              {/* <Button className='bg-white text-violet-700 hover:bg-gray-100 text-lg px-8 py-3'>
                Get Started
              </Button> */}
            </div>
            <div className='md:w-1/2 mt-8 md:mt-0'>
              <Image
                src='/visual-img.png'
                alt='Trade Data Visualization'
                width={600}
                height={400}
                className='rounded-lg'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 text-gray-800'>
            Why Choose TradeDataNexus?
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-gray-100 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                Comprehensive Data
              </h3>
              <p className='text-gray-600'>
                Access a vast database of international pharma trade data,
                updated in real-time.
              </p>
            </div>
            <div className='bg-gray-100 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                Advanced Analytics
              </h3>
              <p className='text-gray-600'>
                Utilize powerful analytics tools to gain actionable insights
                from complex trade data.
              </p>
            </div>
            <div className='bg-gray-100 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                Expert Support
              </h3>
              <p className='text-gray-600'>
                Get personalized support from our team of trade data experts to
                help you make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-gray-100 py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 text-gray-800'>
            Explore TradeDataNexus
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Link
              href='/about'
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
            >
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                About Us
              </h3>
              <p className='text-gray-600'>
                Learn about our mission, vision, and the team behind
                TradeDataNexus.
              </p>
            </Link>
            <Link
              href='/services'
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
            >
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                Our Services
              </h3>
              <p className='text-gray-600'>
                Discover our comprehensive range of trade data services and
                solutions.
              </p>
            </Link>
            <Link
              href='/pricing'
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
            >
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                Pricing Plans
              </h3>
              <p className='text-gray-600'>
                Find the perfect plan to suit your business needs and budget.
              </p>
            </Link>
            <Link
              href='/contact'
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
            >
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                Contact Us
              </h3>
              <p className='text-gray-600'>
                Get in touch with our team for inquiries, support, or
                partnerships.
              </p>
            </Link>
            <Link
              href='/privacy-policy'
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
            >
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                Privacy Policy
              </h3>
              <p className='text-gray-600'>
                Read about our commitment to protecting your privacy and data.
              </p>
            </Link>
            <Link
              href='/terms-and-conditions'
              className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
            >
              <h3 className='text-xl font-semibold mb-4 text-violet-700'>
                Terms and Conditions
              </h3>
              <p className='text-gray-600'>
                Understand the terms governing the use of our services and
                website.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
