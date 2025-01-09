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
import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function About() {
  const values = [
    {
      title: "Data-Driven Insights",
      description:
        "We convert complex raw data into precise, actionable intelligence tailored to the pharmaceutical industry. Our insights empower businesses to anticipate market trends, optimize sourcing strategies, and make evidence-based decisions, ensuring sustained growth and a competitive edge in an evolving global market.",
      icon: Globe,
    },
    {
      title: "Reliability & Security",
      description:
        "We uphold the highest standards of accuracy and data integrity, delivering reliable information you can count on. With robust security measures, we ensure the confidentiality and protection of your data, building trust through every interaction.",
      icon: Users,
    },
    {
      title: "Global Data Access",
      description:
        "Tap into an expansive database of over 10 million worldwide shipment records, delivering unparalleled insights into pharmaceutical trade dynamics. Our platform provides real-time, actionable intelligence, enabling you to uncover emerging opportunities, monitor global trends, and outpace competitors with data-backed strategies that redefine market leadership.",
      icon: TrendingUp,
    },
    {
      title: "Team Excellence & Support",
      description:
        "Our dedicated team of industry experts combines deep pharmaceutical knowledge with data analytics expertise to deliver exceptional support. We provide personalized guidance and insights, ensuring you maximize the value of our platform for your strategic objectives.",
      icon: Shield,
    },
  ];

  const whyChoose = [
    {
      title: "Global Coverage",
      description:
        "Our comprehensive database captures every essential detail of the pharmaceutical trade, from APIs to finished products, worldwide.",
      link: "/about",
    },
    {
      title: "Actionable Insights",
      description:
        "Transform complex trade data into meaningful, actionable insights with our easy-to-use SaaS platform, built for the pharmaceutical industry.",
      link: "/about",
    },
    {
      title: "Dedicated Expertise",
      description:
        "Work with our industry experts who understand your unique challenges and help you unlock new market opportunities.",
      link: "/about",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-700 leading-tight">
            About TransDataNexus
          </h1>
          <p className="text-md lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering businesses with comprehensive intelligence on global
            pharmaceutical trade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              At TransData Nexus, we are committed to simplifying access to
              global pharmaceutical trade. Our mission is to provide actionable
              data and insights that help businesses make smarter decisions,
              reduce risks, and find best deals in the market. Learn more about
              our team and our vision for transforming your pharmaceutical
              growth.
            </p>
            <p className="text-gray-600 mb-6">
              We strive to empower our clients with actionable insights,
              enabling them to uncover new opportunities, manage risks
              effectively, and maintain a competitive edge in the dynamic
              pharmaceutical industry.
            </p>
            <Button className="bg-violet-500 hover:bg-violet-600 rounded-xl py-6 text-white">
              <Link href="/services">Learn More About Our Services</Link>
            </Button>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/team-img.svg"
              alt="TransDataNexus Team"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-violet-700">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center space-y-6 mb-20">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Choose TransDataNexus?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Elevate your pharmaceutical business with our powerful intelligence
            platform. Gain access to over 10 million global shipment records,
            enhanced by real-time updates and advanced analytics, to drive
            smarter, strategic decisions.
          </p>
          <HoverEffect items={whyChoose} />

          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Ready to Redefine Your Global Trade Strategy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the leaders in the pharmaceutical industry who trust
              TransDataNexus to stay ahead of the curve.
            </p>
            <Link href={"/contact"}>
              <Button
                size="lg"
                className="bg-violet-500 hover:bg-violet-600 rounded-xl text-white"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
