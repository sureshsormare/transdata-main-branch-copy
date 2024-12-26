import { Database, Users, LifeBuoy, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Services() {
  const services = [
    {
      title: "Insightful Data",
      description:
        "Gain access to comprehensive and actionable insights derived from our extensive trade database. Our advanced analytics tools help you uncover trends, identify opportunities, and make data-driven decisions to stay ahead in the global pharma market.",
      icon: LineChart,
    },
    {
      title: "Expert Consultation",
      description:
        "Benefit from our team of industry experts who provide personalized guidance and strategic advice. Our consultants help you interpret complex trade data, navigate market challenges, and develop effective strategies to maximize your business potential.",
      icon: Users,
    },
    {
      title: "Extensive Support for Business Needs",
      description:
        "Receive dedicated support tailored to your specific business requirements. From data interpretation to custom report generation, our support team is committed to ensuring you get the most value from our services and can effectively apply insights to your operations.",
      icon: LifeBuoy,
    },
    {
      title: "Access to Vast Trade Database",
      description:
        "Explore our comprehensive database covering international pharma trade data from over 75 countries. Updated regularly, our database provides you with the most current and reliable information to inform your business decisions and strategies.",
      icon: Database,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-20'>
      <div className='container mx-auto px-4 max-w-7xl'>
        <div className='text-center space-y-4 mb-20'>
          <h1 className='text-4xl md:text-5xl font-bold text-violet-700 leading-tight'>
            Our Services
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Empowering your business with comprehensive pharma trade data and
            expert insights
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 mb-20'>
          {services.map((service, index) => (
            <Card
              key={index}
              className='transition-all duration-300 hover:shadow-lg'
            >
              <CardHeader>
                <div className='w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-4'>
                  <service.icon className='w-6 h-6 text-violet-600' />
                </div>
                <CardTitle className='text-2xl font-bold text-violet-700'>
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-gray-600'>
                  {service.description}
                </CardDescription>
              </CardContent>
              {/* <CardFooter>
                <Button variant='outline' className='w-full'>
                  Learn More
                </Button>
              </CardFooter> */}
            </Card>
          ))}
        </div>

        <div className='text-center space-y-6'>
          <h2 className='text-3xl font-bold text-gray-800'>
            Ready to elevate your business with our services?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Contact us today to discuss how TradeDataNexus can help you unlock
            the full potential of global pharma trade data.
          </p>
          <Button
            size='lg'
            className='bg-violet-500 hover:bg-violet-700 rounded-xl'
          >
            <Link href='/contact'>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
