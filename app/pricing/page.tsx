import {
  Star,
  StarHalf,
  Users,
  ArrowRight,
  Check,
  Building2,
  Rocket,
  Building,
  UserRound,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-700 leading-tight">
            One Subscription - Multiple Users
          </h1>
          <p className="text-xl text-gray-600">
            75+ Countries And More Added Every Month!
          </p>
          <p className="text-gray-500">
            Honest usage based pricing - irrespective of numbers of countries or
            users
          </p>
        </div>

        {/* Rating and Guarantee Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Rating */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 fill-violet-500 text-violet-500" />
                  <Star className="w-6 h-6 fill-violet-500 text-violet-500" />
                  <Star className="w-6 h-6 fill-violet-500 text-violet-500" />
                  <Star className="w-6 h-6 fill-violet-500 text-violet-500" />
                  <StarHalf className="w-6 h-6 fill-violet-500 text-violet-500" />
                  <span className="ml-2 font-bold text-xl">4.5/5</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex space-x-3">
                    {[1, 2, 3].map((i) => (
                      <UserRound key={i} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Rated by 20,000+ Satisfied Customers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guarantee */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-violet-100 rounded-full flex items-center justify-center">
                  <CircleDollarSign size={40} />
                </div>
                <p className="font-semibold text-gray-900">
                  100% Money Back Guarantee
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quote */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-lg font-medium text-gray-700 italic">
                  TransDataNexuss Solution gives you 100x return in Six Months!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {/* Free Tier */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-0">
              <div className="w-16 h-16 mx-auto bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trial Account</h3>
              <div className="text-4xl font-bold mb-1">$0</div>
              <p className="text-sm text-gray-500">Forever free plan</p>
            </CardHeader>
            <CardContent className="text-center pt-6">
              <Button className="w-full" variant="outline">
                Sign Up Free
              </Button>
            </CardContent>
          </Card>

          {/* Startup Tier */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-0">
              <div className="w-16 h-16 mx-auto bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Startup</h3>
              <div className="text-4xl font-bold mb-1">$500.00</div>
              <p className="text-sm text-gray-500">/Annually</p>
            </CardHeader>
            <CardContent className="text-center space-y-4 pt-6">
              <Button className="w-full">Sign Up</Button>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Or</p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  Refer and Claim it for Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* SME Tier */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-violet-500">
            <div className="absolute top-0 right-0">
              <div className="bg-green-500 text-white px-3 py-1 text-sm transform rotate-0 translate-x-2 -translate-y-1">
                Bestseller
              </div>
            </div>
            <CardHeader className="text-center pb-0">
              <div className="w-16 h-16 mx-auto bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">SME</h3>
              <div className="text-4xl font-bold mb-1">$1,500.00</div>
              <p className="text-sm text-gray-500">/Annually</p>
            </CardHeader>
            <CardContent className="text-center space-y-4 pt-6">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                Sign Up
              </Button>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Or</p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  Refer and Claim it for Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Corporate Tier */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-0">
              <div className="w-16 h-16 mx-auto bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <Building className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Corporate</h3>
              <div className="text-4xl font-bold mb-1">$4,000.00</div>
              <p className="text-sm text-gray-500">/Annually</p>
            </CardHeader>
            <CardContent className="text-center space-y-4 pt-6">
              <Button className="w-full">Sign Up</Button>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Or</p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                  Refer and Claim it for Free
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison Table */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Features</TableHead>
                  <TableHead className="text-center">Trial</TableHead>
                  <TableHead className="text-center">Startup</TableHead>
                  <TableHead className="text-center">Mid-level</TableHead>
                  <TableHead className="text-center">Corporate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Price</TableCell>
                  <TableCell className="text-center">$0</TableCell>
                  <TableCell className="text-center">$500.00</TableCell>
                  <TableCell className="text-center">$1,500.00</TableCell>
                  <TableCell className="text-center">$4,000.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Number of Searches
                  </TableCell>
                  <TableCell className="text-center">50</TableCell>
                  <TableCell className="text-center">5,000</TableCell>
                  <TableCell className="text-center">20,000</TableCell>
                  <TableCell className="text-center">Unlimited</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Validity Period</TableCell>
                  <TableCell className="text-center">5 Days</TableCell>
                  <TableCell className="text-center">1 Year</TableCell>
                  <TableCell className="text-center">1 Year</TableCell>
                  <TableCell className="text-center">1 Year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Complete Access of Shipment Details
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-red-500">✕</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Complete Exporter View
                  </TableCell>
                  <TableCell className="text-center">10</TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Complete Importer View
                  </TableCell>
                  <TableCell className="text-center">10</TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Number of Shipment Downloads in Excel
                  </TableCell>
                  <TableCell className="text-center">0</TableCell>
                  <TableCell className="text-center">400,000</TableCell>
                  <TableCell className="text-center">1,600,000</TableCell>
                  <TableCell className="text-center">4,000,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Number of Users</TableCell>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">10</TableCell>
                  <TableCell className="text-center">15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footnote */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            * Except certain premium countries and regions
          </p>
          <Button variant="outline" size="lg" className="mx-auto">
            <Link href={"/contact"}>Schedule a Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
