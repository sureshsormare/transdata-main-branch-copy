// pages/blog/index.tsx
import Link from "next/link";
import { Search, TrendingUp, Calendar, User, ArrowRight, Filter } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "Pharma Import Trends: Q1 2025 Insights",
    summary: "An overview of pharmaceutical imports into India during Q1 2025, including top-origin countries and growth metrics.",
    date: "June 10, 2025",
    author: "Dr. Kavita Mehra",
    category: "Trade Analysis",
    readTime: "5 min read",
    featured: true,
    tags: ["Imports", "Q1 2025", "Market Trends"]
  },
  {
    id: 2,
    title: "Export Compliance in Pharma: New Regulations",
    summary: "A summary of updated export documentation requirements and their impact on Indian pharmaceutical companies.",
    date: "June 5, 2025",
    author: "Suresh Patil",
    category: "Trade Compliance",
    readTime: "7 min read",
    featured: false,
    tags: ["Compliance", "Regulations", "Exports"]
  },
  {
    id: 3,
    title: "API Trade: India's Global Supply Chain Role",
    summary: "How India's API manufacturing sector is strengthening global pharmaceutical supply chains.",
    date: "May 28, 2025",
    author: "Anjali Rao",
    category: "API Trade",
    readTime: "6 min read",
    featured: false,
    tags: ["API", "Supply Chain", "Global Trade"]
  },
  {
    id: 4,
    title: "Pharma Supply Chain Digitalization",
    summary: "How blockchain and AI are revolutionizing pharmaceutical trade transparency and efficiency.",
    date: "May 20, 2025",
    author: "Rajesh Kumar",
    category: "Trade Technology",
    readTime: "8 min read",
    featured: false,
    tags: ["Blockchain", "AI", "Supply Chain"]
  },
  {
    id: 5,
    title: "API Manufacturing: India's Competitive Edge",
    summary: "Analysis of India's position in global API manufacturing and future growth opportunities.",
    date: "May 15, 2025",
    author: "Dr. Priya Sharma",
    category: "API Trade",
    readTime: "6 min read",
    featured: false,
    tags: ["API", "Manufacturing", "Global Trade"]
  },
  {
    id: 6,
    title: "Pharma Trade Finance: New Opportunities",
    summary: "Innovative financing solutions for pharmaceutical trade and export operations.",
    date: "May 10, 2025",
    author: "Meera Patel",
    category: "Trade Finance",
    readTime: "5 min read",
    featured: false,
    tags: ["Trade Finance", "Exports", "Banking"]
  },
  {
    id: 7,
    title: "Vaccine Trade: India's Global Leadership",
    summary: "How India became the world's largest vaccine manufacturer and its impact on global trade.",
    date: "May 5, 2025",
    author: "Dr. Amit Singh",
    category: "Trade Analysis",
    readTime: "7 min read",
    featured: false,
    tags: ["Vaccines", "Trade", "Global Health"]
  },
  {
    id: 8,
    title: "Pharma FDI Trends: Investment Opportunities",
    summary: "Analysis of foreign direct investment patterns in India's pharmaceutical trade sector.",
    date: "April 30, 2025",
    author: "Rahul Verma",
    category: "Trade Investment",
    readTime: "6 min read",
    featured: false,
    tags: ["FDI", "Investment", "Trade"]
  },
  {
    id: 9,
    title: "Trade Documentation: Streamlining Pharma Exports",
    summary: "Recent changes in export documentation and their impact on pharmaceutical trade efficiency.",
    date: "April 25, 2025",
    author: "Dr. Neha Gupta",
    category: "Trade Compliance",
    readTime: "8 min read",
    featured: false,
    tags: ["Documentation", "Exports", "Compliance"]
  },
  {
    id: 10,
    title: "Cold Chain Trade: Pharma Distribution Networks",
    summary: "Innovative solutions for maintaining temperature-controlled pharmaceutical trade across borders.",
    date: "April 20, 2025",
    author: "Vikram Malhotra",
    category: "Trade Logistics",
    readTime: "6 min read",
    featured: false,
    tags: ["Cold Chain", "Logistics", "Distribution"]
  },
  {
    id: 11,
    title: "Generic Drugs: India's Export Dominance",
    summary: "How India maintains its position as the world's largest exporter of generic pharmaceuticals.",
    date: "April 15, 2025",
    author: "Dr. Sanjay Joshi",
    category: "Trade Analysis",
    readTime: "7 min read",
    featured: false,
    tags: ["Generics", "Exports", "Market Share"]
  },
  {
    id: 12,
    title: "Trade Innovation: Pharma Startup Ecosystem",
    summary: "Emerging pharmaceutical startups and their role in driving trade innovation.",
    date: "April 10, 2025",
    author: "Priya Sharma",
    category: "Trade Innovation",
    readTime: "5 min read",
    featured: false,
    tags: ["Startups", "Innovation", "Trade"]
  },
  {
    id: 13,
    title: "Quality Standards: GMP in Pharma Trade",
    summary: "Good Manufacturing Practice standards and their impact on pharmaceutical trade credibility.",
    date: "April 5, 2025",
    author: "Dr. Rajesh Kumar",
    category: "Trade Quality",
    readTime: "8 min read",
    featured: false,
    tags: ["GMP", "Quality", "Trade Standards"]
  },
  {
    id: 14,
    title: "Pharma Exports to Africa: Growth Opportunities",
    summary: "Analysis of India's pharmaceutical exports to African markets and future growth potential.",
    date: "March 30, 2025",
    author: "Anita Desai",
    category: "Trade Analysis",
    readTime: "6 min read",
    featured: false,
    tags: ["Africa", "Exports", "Emerging Markets"]
  },
  {
    id: 15,
    title: "Digital Trade: E-commerce in Pharma",
    summary: "How digital platforms are transforming pharmaceutical trade and distribution.",
    date: "March 25, 2025",
    author: "Dr. Arjun Reddy",
    category: "Trade Technology",
    readTime: "7 min read",
    featured: false,
    tags: ["E-commerce", "Digital Trade", "Distribution"]
  },
  {
    id: 16,
    title: "Biosimilars Trade: India's Next Frontier",
    summary: "The rise of biosimilar manufacturing in India and its impact on global trade.",
    date: "March 20, 2025",
    author: "Dr. Kavita Mehra",
    category: "API Trade",
    readTime: "8 min read",
    featured: false,
    tags: ["Biosimilars", "Trade", "Manufacturing"]
  },
  {
    id: 17,
    title: "Trade Warehousing: Smart Storage Solutions",
    summary: "Advanced warehousing technologies and their impact on pharmaceutical trade efficiency.",
    date: "March 15, 2025",
    author: "Suresh Patil",
    category: "Trade Logistics",
    readTime: "6 min read",
    featured: false,
    tags: ["Warehousing", "Logistics", "Technology"]
  },
  {
    id: 18,
    title: "Trade Agreements: Pharma IP Protection",
    summary: "Analysis of trade agreements and their implications for pharmaceutical intellectual property.",
    date: "March 10, 2025",
    author: "Adv. Meera Patel",
    category: "Trade Compliance",
    readTime: "7 min read",
    featured: false,
    tags: ["Trade Agreements", "IP", "Compliance"]
  },
  {
    id: 19,
    title: "Trade Education: Skill Development for Pharma",
    summary: "Government and industry initiatives to develop skilled workforce for pharmaceutical trade.",
    date: "March 5, 2025",
    author: "Dr. Priya Sharma",
    category: "Trade Education",
    readTime: "5 min read",
    featured: false,
    tags: ["Education", "Skill Development", "Trade"]
  },
  {
    id: 20,
    title: "Medical Tourism: Pharma Trade Support",
    summary: "How pharmaceutical manufacturing excellence is supporting India's medical tourism trade.",
    date: "February 28, 2025",
    author: "Rahul Verma",
    category: "Trade Analysis",
    readTime: "6 min read",
    featured: false,
    tags: ["Medical Tourism", "Trade", "Healthcare"]
  },
  {
    id: 21,
    title: "Trade Analytics: Market Intelligence",
    summary: "How data analytics is revolutionizing pharmaceutical trade intelligence and decision-making.",
    date: "February 25, 2025",
    author: "Rajesh Kumar",
    category: "Trade Analytics",
    readTime: "7 min read",
    featured: false,
    tags: ["Analytics", "Market Intelligence", "Trade Data"]
  },
  {
    id: 22,
    title: "Trade Security: Protecting Pharma Supply Chains",
    summary: "Cybersecurity challenges and solutions for pharmaceutical trade operations.",
    date: "February 20, 2025",
    author: "Vikram Malhotra",
    category: "Trade Security",
    readTime: "8 min read",
    featured: false,
    tags: ["Cybersecurity", "Supply Chain", "Trade Security"]
  },
  {
    id: 23,
    title: "Trade Partnerships: Global Collaborations",
    summary: "Strategic partnerships between Indian and international pharmaceutical trade companies.",
    date: "February 15, 2025",
    author: "Anjali Rao",
    category: "Trade Partnerships",
    readTime: "6 min read",
    featured: false,
    tags: ["Partnerships", "Collaborations", "Global Trade"]
  },
  {
    id: 24,
    title: "Trade Innovation: R&D Investment Trends",
    summary: "Investment trends in pharmaceutical trade research and development.",
    date: "February 10, 2025",
    author: "Dr. Amit Singh",
    category: "Trade Innovation",
    readTime: "7 min read",
    featured: false,
    tags: ["R&D", "Innovation", "Trade Investment"]
  }
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Pharma Trade Insights
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Stay ahead with expert analysis, market trends, and regulatory updates from the pharmaceutical trade industry
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm rounded-2xl border-0 shadow-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Article</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>
          
          {blogs.filter(blog => blog.featured).map((blog) => (
            <div key={blog.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-cyan-600 p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <div className="text-sm font-medium opacity-90">FEATURED</div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {blog.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {blog.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(blog.author)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{blog.author}</div>
                        <div className="text-sm text-gray-500">{blog.date}</div>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Trade Insights</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.filter(blog => !blog.featured).map((blog) => (
              <article
                key={blog.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {blog.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {blog.summary}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                        {getInitials(blog.author)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{blog.author}</div>
                        <div className="text-xs text-gray-500">{blog.date}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${blog.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group-hover:gap-3"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated with Trade Insights
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Get the latest pharmaceutical trade analysis, regulatory updates, and market trends delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg">
                Subscribe
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Join 10,000+ trade professionals getting weekly insights
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Trade Articles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Trade Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Trade Experts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Trade Accuracy</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
