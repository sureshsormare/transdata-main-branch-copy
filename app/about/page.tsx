import Image from "next/image";
import { Globe, Users, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function About() {
  const values = [
    {
      title: "Global Perspective",
      description:
        "We provide insights into international trade data from over 75 countries, giving you a truly global view of the pharma market.",
      icon: Globe,
    },
    {
      title: "Customer-Centric",
      description:
        "Our team is dedicated to supporting your business needs with personalized consultation and extensive support.",
      icon: Users,
    },
    {
      title: "Data-Driven Insights",
      description:
        "We transform raw data into actionable insights, helping you make informed decisions and stay ahead of market trends.",
      icon: TrendingUp,
    },
    {
      title: "Reliability & Security",
      description:
        "We prioritize the accuracy of our data and the security of your information, ensuring you can trust our services completely.",
      icon: Shield,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-20'>
      <div className='container mx-auto px-4 max-w-7xl'>
        <div className='text-center space-y-4 mb-20'>
          <h1 className='text-4xl md:text-5xl font-bold text-violet-700 leading-tight'>
            About TransDataNexus
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Empowering businesses with comprehensive insights into global pharma
            trade data
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12 items-center mb-20'>
          <div>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>
              Our Mission
            </h2>
            <p className='text-gray-600 mb-6'>
              At TransDataNexus, our mission is to provide businesses in the
              pharmaceutical industry with unparalleled access to international
              trade data. We believe that accurate, timely, and comprehensive
              data is the key to making informed decisions in todays global
              market.
            </p>
            <p className='text-gray-600 mb-6'>
              We strive to empower our clients with actionable insights,
              enabling them to identify new opportunities, mitigate risks, and
              stay ahead of the competition in the ever-evolving pharma
              landscape.
            </p>
            <Button className='bg-violet-500 hover:bg-violet-600 rounded-xl py-6 text-white'>
              <Link href='/services'>Learn More About Our Services</Link>
            </Button>
          </div>
          <div className='relative h-[400px] rounded-lg overflow-hidden shadow-xl'>
            <Image
              src='/team-img.svg'
              alt='TransDataNexus Team'
              layout='fill'
              objectFit='cover'
              className='rounded-lg'
            />
          </div>
        </div>

        <div className='mb-20'>
          <h2 className='text-3xl font-bold text-gray-800 mb-10 text-center'>
            Our Core Values
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {values.map((value, index) => (
              <Card
                key={index}
                className='transition-all duration-300 hover:shadow-lg'
              >
                <CardHeader>
                  <div className='w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-4'>
                    <value.icon className='w-6 h-6 text-violet-600' />
                  </div>
                  <CardTitle className='text-xl font-bold text-violet-700'>
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-gray-600'>
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className='text-center space-y-6 mb-20'>
          <h2 className='text-3xl font-bold text-gray-800'>
            Why Choose TransDataNexus?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            We offer a unique combination of comprehensive data, expert
            analysis, and dedicated support. Our platform provides access to
            trade data from over 75 countries, updated regularly to ensure you
            always have the most current information at your fingertips.
          </p>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            With TransDataNexus, youre not just getting data – youre gaining a
            partner committed to your success in the global pharmaceutical
            market.
          </p>
        </div>

        <div className='text-center space-y-6'>
          <h2 className='text-3xl font-bold text-gray-800'>
            Ready to unlock the power of global pharma trade data?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Join the growing number of businesses that trust TransDataNexus for
            their international trade insights.
          </p>
          <Button
            size='lg'
            className='bg-violet-500 hover:bg-violet-600 rounded-xl text-white'
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}
