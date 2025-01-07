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
      title: "Data Analytics Platform",
      description:
        "Our advanced analytics platform transforms complex pharmaceutical trade data into actionable insights. Access real-time monitoring of global shipments, analyze price trends, and map comprehensive supplier-buyer networks. Through intuitive dashboards, track market movements and generate custom reports tailored to your business objectives. The platform integrates powerful visualization tools that simplify data interpretation and strategic decision-making.",
      icon: LineChart,
    },
    {
      title: "Global Trade Repository",
      description:
        "Leverage our extensive database of over 10 million worldwide pharmaceutical shipment records. This comprehensive repository provides granular insights into transaction details, including origins, destinations, product specifications, and pricing. Track historical trade patterns, analyze market dynamics, and identify emerging trends across global markets. Our repository serves as your centralized source for authentic, validated trade intelligence.",
      icon: Users,
    },
    {
      title: "Analytics Solutions",
      description:
        "Transform raw data into strategic advantage through our sophisticated analytics tools. Identify untapped market opportunities, analyze competitive landscapes, and optimize supply chain decisions with AI-powered insights. Our platform enables you to assess market penetration strategies, track competitor movements, and forecast industry trends. Get customized analysis that aligns with your specific business goals and challenges. ",
      icon: LifeBuoy,
    },
    {
      title: "Expert Support",
      description:
        "Access dedicated assistance from industry specialists who understand the nuances of pharmaceutical trade. Our experts provide guidance in data interpretation, helping you maximize the value of our platform. Receive strategic recommendations based on market analysis, ensuring you make informed decisions. Count on timely support for custom reports and specialized market insights tailored to your needs.",
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
          Ready to Transform Your Trade Strategy?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          Discover how TransDataNexus can elevate your pharmaceutical business with comprehensive trade intelligence. 
          </p>
          <Button
            size='lg'
            className='bg-violet-500 hover:bg-violet-700 rounded-xl text-white'
          >
            <Link href='/contact'>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
