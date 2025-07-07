"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Calendar, Clock, User, Share2, ArrowLeft, BookOpen, Tag, TrendingUp } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
  details: string;
  category: string;
  readTime: string;
  tags: string[];
  summary: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    title: "Pharma Import Trends: Q1 2025 Insights",
    date: "June 10, 2025",
    author: "Dr. Kavita Mehra",
    category: "Trade Analysis",
    readTime: "5 min read",
    tags: ["Imports", "Q1 2025", "Market Trends"],
    summary: "An overview of pharmaceutical imports into India during Q1 2025, including top-origin countries and growth metrics.",
    content:
      "India's pharmaceutical imports surged 15% in Q1 2025, driven by increased demand for specialty APIs and advanced formulations. The government's new trade policies and streamlined customs processes have played a significant role. Key import partners include Germany, Switzerland, and the US. Experts predict continued growth as domestic pharma companies expand their global reach.",
    details:
      "This quarter's growth is attributed to the rising need for high-quality raw materials and the expansion of domestic manufacturing capabilities. The government's focus on ease of doing business has resulted in faster customs clearance and reduced bottlenecks at major ports. Notably, the import of specialty APIs has seen a 20% year-on-year increase, reflecting the industry's shift towards complex formulations. Industry leaders are optimistic about the future, citing ongoing collaborations with European suppliers and the adoption of advanced supply chain technologies. The report also highlights the importance of regulatory compliance and the role of digital platforms in streamlining import documentation.",
  },
  {
    id: 2,
    title: "Export Compliance in Pharma: New Regulations",
    date: "June 5, 2025",
    author: "Suresh Patil",
    category: "Trade Compliance",
    readTime: "7 min read",
    tags: ["Compliance", "Regulations", "Exports"],
    summary: "A summary of updated export documentation requirements and their impact on Indian pharmaceutical companies.",
    content:
      "New documentation rules affect API exports significantly. Exporters must now provide detailed traceability reports and adhere to stricter packaging standards. The Directorate General of Foreign Trade (DGFT) has issued guidelines to ensure compliance, aiming to boost India's reputation as a reliable pharma exporter.",
    details:
      "The updated regulations require exporters to maintain comprehensive records of every batch, including source materials and distribution channels. Packaging standards have been revised to ensure product integrity during transit, with a focus on tamper-evident seals and eco-friendly materials. The DGFT's new digital portal simplifies the submission of compliance documents, reducing processing times. Exporters are encouraged to participate in training sessions organized by industry bodies to stay updated on best practices. These changes are expected to enhance transparency, minimize the risk of counterfeiting, and strengthen India's position in the global pharmaceutical market.",
  },
  {
    id: 3,
    title: "API Trade: India's Global Supply Chain Role",
    date: "May 28, 2025",
    author: "Anjali Rao",
    category: "API Trade",
    readTime: "6 min read",
    tags: ["API", "Supply Chain", "Global Trade"],
    summary: "How India's API manufacturing sector is strengthening global pharmaceutical supply chains.",
    content:
      "India's API manufacturing sector plays a crucial role in global pharmaceutical supply chains, supplying over 60% of the world's generic APIs. The sector's growth is driven by cost competitiveness, quality standards, and regulatory compliance.",
    details:
      "The API trade sector has expanded significantly with the establishment of specialized manufacturing facilities and technology platforms. Indian companies have successfully navigated complex regulatory requirements in developed markets, with over 500 DMFs approved by the US FDA. The sector is also witnessing increased investment in research and development of novel APIs and complex formulations. Government support through initiatives like the Production Linked Incentive (PLI) scheme has accelerated capacity expansion. International partnerships and licensing agreements are facilitating technology transfer and market access. Quality standards and regulatory compliance are being maintained at international levels, enabling exports to developed markets.",
  },
  {
    id: 4,
    title: "Pharma Supply Chain Digitalization",
    date: "May 20, 2025",
    author: "Rajesh Kumar",
    category: "Trade Technology",
    readTime: "8 min read",
    tags: ["Blockchain", "AI", "Supply Chain"],
    summary: "How blockchain and AI are revolutionizing pharmaceutical trade transparency and efficiency.",
    content:
      "The pharmaceutical trade industry is undergoing a digital revolution with blockchain and AI technologies transforming supply chain management. These innovations are enhancing transparency, reducing costs, and improving trade efficiency across the global pharmaceutical network.",
    details:
      "Blockchain technology is being implemented to create immutable records of pharmaceutical products from manufacturing to delivery. This ensures authenticity and prevents counterfeiting while providing real-time tracking capabilities. AI-powered analytics are optimizing inventory management, predicting demand patterns, and identifying potential supply chain disruptions before they occur. Major pharmaceutical companies are investing heavily in these technologies, with some reporting 30% reductions in supply chain costs and 50% improvements in delivery times. The integration of IoT devices with blockchain networks is further enhancing visibility and control over the entire supply chain ecosystem.",
  },
  {
    id: 5,
    title: "API Manufacturing: India's Competitive Edge",
    date: "May 15, 2025",
    author: "Dr. Priya Sharma",
    category: "API Trade",
    readTime: "6 min read",
    tags: ["API", "Manufacturing", "Global Trade"],
    summary: "Analysis of India's position in global API manufacturing and future growth opportunities.",
    content:
      "India continues to strengthen its position as a global leader in API manufacturing, with significant investments in infrastructure and technology. The country's competitive advantages in cost, quality, and regulatory compliance are driving growth in this critical trade sector.",
    details:
      "India's API manufacturing sector benefits from a combination of factors including skilled workforce, cost-effective production, and strong regulatory compliance. The government's Production Linked Incentive (PLI) scheme has attracted significant investments, with over 50 companies participating in the program. Quality standards have been elevated through the adoption of international guidelines and certifications. The sector is also witnessing increased collaboration between domestic manufacturers and global pharmaceutical companies, leading to technology transfers and capacity building. Future growth is expected to be driven by the development of complex APIs and the expansion of manufacturing facilities to meet growing global demand.",
  },
  {
    id: 6,
    title: "Pharma Trade Finance: New Opportunities",
    date: "May 10, 2025",
    author: "Meera Patel",
    category: "Trade Finance",
    readTime: "5 min read",
    tags: ["Trade Finance", "Exports", "Banking"],
    summary: "Innovative financing solutions for pharmaceutical trade and export operations.",
    content:
      "The pharmaceutical trade sector is witnessing innovative financing solutions that are facilitating export operations and reducing financial barriers. New trade finance instruments are enabling companies to expand their global reach.",
    details:
      "Trade finance solutions include pre-shipment and post-shipment credit facilities, factoring, and forfaiting services. Digital trade finance platforms are streamlining documentation and reducing processing times. Government-backed export credit insurance schemes are protecting exporters against payment risks. Fintech companies are developing specialized solutions for pharmaceutical trade, including blockchain-based trade finance. These innovations are helping small and medium enterprises access international markets. The sector is also witnessing increased collaboration between banks, insurance companies, and trade finance providers.",
  },
  {
    id: 7,
    title: "Vaccine Trade: India's Global Leadership",
    date: "May 5, 2025",
    author: "Dr. Amit Singh",
    category: "Trade Analysis",
    readTime: "7 min read",
    tags: ["Vaccines", "Trade", "Global Health"],
    summary: "How India became the world's largest vaccine manufacturer and its impact on global trade.",
    content:
      "India has emerged as the world's largest vaccine manufacturer, producing over 60% of global vaccine supply. This leadership position has been achieved through decades of investment in manufacturing infrastructure, regulatory compliance, and international trade partnerships.",
    details:
      "The country's vaccine manufacturing capabilities span across multiple technologies including inactivated vaccines, live attenuated vaccines, and recombinant DNA vaccines. Major manufacturers like Serum Institute of India and Bharat Biotech have established world-class facilities that meet international quality standards. The COVID-19 pandemic highlighted India's crucial role in global health security, with the country supplying vaccines to over 100 countries. Government support through initiatives like Mission COVID Suraksha has accelerated vaccine development and manufacturing capacity. The sector is now expanding into novel vaccine technologies including mRNA and viral vector platforms, positioning India for future pandemic preparedness.",
  },
  {
    id: 8,
    title: "Pharma FDI Trends: Investment Opportunities",
    date: "April 30, 2025",
    author: "Rahul Verma",
    category: "Trade Investment",
    readTime: "6 min read",
    tags: ["FDI", "Investment", "Trade"],
    summary: "Analysis of foreign direct investment patterns in India's pharmaceutical trade sector.",
    content:
      "Foreign direct investment in India's pharmaceutical trade sector has shown remarkable growth, with FDI inflows reaching $2.5 billion in 2024. The sector is attracting investments across manufacturing, R&D, and digital trade segments.",
    details:
      "The government's liberalized FDI policy allowing 100% foreign investment in pharmaceutical manufacturing has been a key driver of growth. Major investment areas include API manufacturing, contract research organizations, and digital trade platforms. International pharmaceutical companies are establishing manufacturing facilities in India to leverage cost advantages and access to skilled workforce. The Production Linked Incentive (PLI) scheme has further incentivized foreign investment in critical pharmaceutical manufacturing. Emerging opportunities exist in biosimilars, specialty drugs, and precision medicine. The sector is also witnessing increased investment in digital trade technologies and e-commerce platforms.",
  },
  {
    id: 9,
    title: "Trade Documentation: Streamlining Pharma Exports",
    date: "April 25, 2025",
    author: "Dr. Neha Gupta",
    category: "Trade Compliance",
    readTime: "8 min read",
    tags: ["Documentation", "Exports", "Compliance"],
    summary: "Recent changes in export documentation and their impact on pharmaceutical trade efficiency.",
    content:
      "India's pharmaceutical export documentation framework has undergone significant reforms to streamline processes while ensuring regulatory compliance. The new documentation requirements aim to position India as a preferred destination for global pharmaceutical trade.",
    details:
      "The Directorate General of Foreign Trade (DGFT) has implemented new guidelines that reduce documentation processing times from 6-8 days to 2-3 days for certain categories of exports. The introduction of digital documentation and e-certification has improved efficiency and reduced costs. The regulatory framework now includes provisions for blockchain-based documentation and real-time tracking. Export protection measures have been strengthened with mandatory insurance coverage and compensation mechanisms. The new regulations also facilitate international collaboration and data sharing while maintaining compliance with global standards. These changes are expected to increase India's pharmaceutical exports by 25% by 2027.",
  },
  {
    id: 10,
    title: "Cold Chain Trade: Pharma Distribution Networks",
    date: "April 20, 2025",
    author: "Vikram Malhotra",
    category: "Trade Logistics",
    readTime: "6 min read",
    tags: ["Cold Chain", "Logistics", "Distribution"],
    summary: "Innovative solutions for maintaining temperature-controlled pharmaceutical trade across borders.",
    content:
      "India's pharmaceutical cold chain trade sector is experiencing rapid transformation with the adoption of advanced technologies and infrastructure development. The sector is critical for ensuring the integrity of temperature-sensitive pharmaceutical products during international trade.",
    details:
      "The cold chain infrastructure in India has expanded significantly with the establishment of specialized warehouses and distribution centers. Advanced monitoring systems using IoT sensors and blockchain technology provide real-time temperature tracking and alert mechanisms. The government's National Cold Chain Development Program has supported the establishment of over 500 cold storage facilities across the country. Private sector investments in cold chain logistics have increased by 40% in the last two years. The sector is also witnessing the adoption of sustainable cooling technologies and renewable energy solutions. Future growth is expected to be driven by the expansion of biologics and specialty drug markets.",
  },
  {
    id: 11,
    title: "Generic Drugs: India's Export Dominance",
    date: "April 15, 2025",
    author: "Dr. Sanjay Joshi",
    category: "Trade Analysis",
    readTime: "7 min read",
    tags: ["Generics", "Exports", "Market Share"],
    summary: "How India maintains its position as the world's largest exporter of generic pharmaceuticals.",
    content:
      "India continues to dominate the global generic pharmaceutical market, accounting for over 20% of global generic drug exports. The country's success is built on a combination of manufacturing excellence, regulatory compliance, and cost competitiveness.",
    details:
      "India's generic pharmaceutical industry exports to over 200 countries, with the US, UK, and European Union being major markets. The sector has achieved this position through significant investments in manufacturing infrastructure and quality control systems. Indian companies have successfully navigated complex regulatory requirements in developed markets, with over 500 ANDAs approved by the US FDA. The industry has also expanded into complex generics and biosimilars, moving beyond simple generic formulations. Government support through initiatives like the Pharmaceutical Export Promotion Council has facilitated market access and trade agreements. The sector is now focusing on innovation and R&D to maintain its competitive edge in an evolving global market.",
  },
  {
    id: 12,
    title: "Trade Innovation: Pharma Startup Ecosystem",
    date: "April 10, 2025",
    author: "Priya Sharma",
    category: "Trade Innovation",
    readTime: "5 min read",
    tags: ["Startups", "Innovation", "Trade"],
    summary: "Emerging pharmaceutical startups and their role in driving trade innovation.",
    content:
      "India's pharmaceutical startup ecosystem is flourishing with over 500 active startups focusing on drug discovery, digital trade, and innovative healthcare solutions. These startups are driving innovation and transforming the traditional pharmaceutical trade landscape.",
    details:
      "The startup ecosystem is supported by government initiatives like Startup India and Atal Innovation Mission, which provide funding and mentorship opportunities. Major focus areas include AI-driven drug discovery, precision medicine, and digital therapeutics. Venture capital investment in pharmaceutical startups has increased by 60% in the last year, with total funding reaching $1.2 billion. Startups are collaborating with established pharmaceutical companies and research institutions to accelerate innovation. The ecosystem is also witnessing increased participation from international investors and pharmaceutical companies seeking innovative solutions. Success stories include startups developing novel drug delivery systems and digital trade platforms that are gaining global recognition.",
  },
  {
    id: 13,
    title: "Quality Standards: GMP in Pharma Trade",
    date: "April 5, 2025",
    author: "Dr. Rajesh Kumar",
    category: "Trade Quality",
    readTime: "8 min read",
    tags: ["GMP", "Quality", "Trade Standards"],
    summary: "Good Manufacturing Practice standards and their impact on pharmaceutical trade credibility.",
    content:
      "India's pharmaceutical trade industry has achieved global recognition for its adherence to Good Manufacturing Practice (GMP) standards. The implementation of rigorous quality control measures has been instrumental in establishing India as a reliable pharmaceutical trade hub.",
    details:
      "Indian pharmaceutical companies have invested heavily in upgrading manufacturing facilities to meet international GMP standards. Over 1,500 manufacturing facilities in India are WHO-GMP certified, while more than 800 facilities have US FDA approval. The implementation of digital quality management systems has enhanced traceability and compliance monitoring. Regular audits and inspections by international regulatory bodies have helped maintain high quality standards. The industry has also adopted advanced analytical techniques and quality control methodologies. Training programs and skill development initiatives ensure that the workforce is well-versed in GMP requirements. These efforts have resulted in increased trust from international markets and improved trade opportunities.",
  },
  {
    id: 14,
    title: "Pharma Exports to Africa: Growth Opportunities",
    date: "March 30, 2025",
    author: "Anita Desai",
    category: "Trade Analysis",
    readTime: "6 min read",
    tags: ["Africa", "Exports", "Emerging Markets"],
    summary: "Analysis of India's pharmaceutical exports to African markets and future growth potential.",
    content:
      "Africa represents one of the fastest-growing markets for Indian pharmaceutical exports, with annual growth rates exceeding 15%. The continent's expanding healthcare infrastructure and increasing demand for affordable medicines present significant trade opportunities.",
    details:
      "India exports pharmaceutical products to 54 African countries, with South Africa, Nigeria, and Kenya being the largest markets. The exports include finished formulations, APIs, and medical devices. Indian companies have established local manufacturing facilities and distribution networks in key African markets. The government's Focus Africa program has facilitated trade agreements and market access. Indian pharmaceutical companies are also involved in capacity building and technology transfer initiatives in African countries. The sector is expanding into specialized areas like oncology, diabetes, and cardiovascular medicines. Future growth is expected to be driven by increasing healthcare spending and the establishment of universal health coverage programs across African nations.",
  },
  {
    id: 15,
    title: "Digital Trade: E-commerce in Pharma",
    date: "March 25, 2025",
    author: "Dr. Arjun Reddy",
    category: "Trade Technology",
    readTime: "7 min read",
    tags: ["E-commerce", "Digital Trade", "Distribution"],
    summary: "How digital platforms are transforming pharmaceutical trade and distribution.",
    content:
      "The integration of digital trade technologies with pharmaceutical services is revolutionizing trade operations and distribution management. E-commerce platforms, digital marketplaces, and online trade portals are creating new opportunities for pharmaceutical companies.",
    details:
      "Digital trade platforms are enabling direct-to-buyer pharmaceutical services, improving trade efficiency and market access. E-commerce consultations have increased by 300% in the last two years, creating new distribution channels for pharmaceutical products. Digital trade systems are streamlining the ordering and fulfillment process, reducing errors and improving efficiency. Digital therapeutics and mobile health applications are complementing traditional pharmaceutical trade. Major pharmaceutical companies are investing in digital trade startups and developing their own digital platforms. The integration of AI and machine learning is enabling personalized trade and predictive market analysis. Regulatory frameworks are evolving to accommodate digital trade innovations while ensuring product safety and data privacy.",
  },
  {
    id: 16,
    title: "Biosimilars Trade: India's Next Frontier",
    date: "March 20, 2025",
    author: "Dr. Kavita Mehra",
    category: "API Trade",
    readTime: "8 min read",
    tags: ["Biosimilars", "Trade", "Manufacturing"],
    summary: "The rise of biosimilar manufacturing in India and its impact on global trade.",
    content:
      "India is emerging as a major player in the global biosimilars market, with several companies developing and commercializing biosimilar products. The sector represents a significant opportunity for growth and innovation in the pharmaceutical trade industry.",
    details:
      "Indian companies have successfully developed biosimilars for major therapeutic areas including oncology, diabetes, and autoimmune diseases. The biosimilar market in India is expected to reach $5 billion by 2027, growing at a CAGR of 25%. Companies are investing heavily in biomanufacturing facilities and technology platforms. Regulatory pathways for biosimilars have been streamlined, with the CDSCO approving over 50 biosimilar products. International partnerships and licensing agreements are facilitating technology transfer and market access. The sector is also witnessing increased investment in research and development of novel biologics. Quality standards and regulatory compliance are being maintained at international levels, enabling exports to developed markets.",
  },
  {
    id: 17,
    title: "Trade Warehousing: Smart Storage Solutions",
    date: "March 15, 2025",
    author: "Suresh Patil",
    category: "Trade Logistics",
    readTime: "6 min read",
    tags: ["Warehousing", "Logistics", "Technology"],
    summary: "Advanced warehousing technologies and their impact on pharmaceutical trade efficiency.",
    content:
      "The pharmaceutical trade warehousing sector is undergoing a technological revolution with the adoption of smart storage solutions, automation, and digital inventory management systems. These innovations are improving efficiency and reducing trade costs.",
    details:
      "Automated storage and retrieval systems (ASRS) are being implemented in major pharmaceutical warehouses, reducing manual handling and improving accuracy. IoT sensors and RFID technology provide real-time inventory tracking and environmental monitoring. Digital twin technology is being used to optimize warehouse layouts and operational efficiency. Cloud-based inventory management systems enable seamless integration across multiple locations. The adoption of robotics and automated guided vehicles (AGVs) is increasing productivity and reducing human error. Smart warehousing solutions also include advanced security systems and temperature-controlled storage facilities. These technologies are helping pharmaceutical companies meet regulatory requirements while improving operational efficiency.",
  },
  {
    id: 18,
    title: "Trade Agreements: Pharma IP Protection",
    date: "March 10, 2025",
    author: "Adv. Meera Patel",
    category: "Trade Compliance",
    readTime: "7 min read",
    tags: ["Trade Agreements", "IP", "Compliance"],
    summary: "Analysis of trade agreements and their implications for pharmaceutical intellectual property.",
    content:
      "Recent changes in India's trade agreements have significant implications for the pharmaceutical industry, balancing innovation protection with access to affordable medicines. The legal framework is evolving to address complex issues in pharmaceutical intellectual property trade.",
    details:
      "The Indian Patent Act provides for compulsory licensing and patent opposition mechanisms to ensure access to essential medicines. Recent amendments have strengthened patent protection while maintaining flexibilities for public health. The patent office has improved its examination process, reducing pendency and improving quality of patent grants. Pharmaceutical companies are increasingly filing patents for novel formulations and drug delivery systems. The legal framework also addresses issues related to evergreening and patent linkage. International trade agreements and TRIPS compliance requirements are being balanced with domestic public health needs. The sector is witnessing increased patent litigation and licensing agreements between Indian and international companies.",
  },
  {
    id: 19,
    title: "Trade Education: Skill Development for Pharma",
    date: "March 5, 2025",
    author: "Dr. Priya Sharma",
    category: "Trade Education",
    readTime: "5 min read",
    tags: ["Education", "Skill Development", "Trade"],
    summary: "Government and industry initiatives to develop skilled workforce for pharmaceutical trade.",
    content:
      "India's pharmaceutical trade sector is investing heavily in education and skill development to meet the growing demand for qualified trade professionals. Various initiatives are being implemented to bridge the skill gap and enhance workforce capabilities.",
    details:
      "The government's Skill India Mission includes specialized programs for pharmaceutical trade, quality control, and regulatory affairs. Industry-academia partnerships are being established to develop curriculum aligned with industry requirements. Training programs cover areas such as GMP, regulatory compliance, and emerging technologies like AI and biotechnology. Online learning platforms and certification programs are making education more accessible. The sector is also focusing on developing soft skills and leadership capabilities. International collaborations with pharmaceutical companies and educational institutions are facilitating knowledge transfer. These initiatives are helping create a pool of skilled professionals who can contribute to the sector's growth and innovation.",
  },
  {
    id: 20,
    title: "Medical Tourism: Pharma Trade Support",
    date: "February 28, 2025",
    author: "Rahul Verma",
    category: "Trade Analysis",
    readTime: "6 min read",
    tags: ["Medical Tourism", "Trade", "Healthcare"],
    summary: "How pharmaceutical manufacturing excellence is supporting India's medical tourism trade.",
    content:
      "India's pharmaceutical manufacturing capabilities are playing a crucial role in supporting the country's medical tourism trade. The availability of high-quality medicines and medical devices is attracting international patients and supporting trade growth.",
    details:
      "Medical tourists visiting India benefit from access to affordable, high-quality pharmaceutical products manufactured domestically. Hospitals and medical facilities are partnering with pharmaceutical companies to ensure reliable supply of medicines and medical devices. The government's Heal in India initiative promotes medical tourism by highlighting the country's pharmaceutical manufacturing capabilities. International patients are also seeking specialized treatments that require specific pharmaceutical products available in India. The sector is witnessing increased collaboration between pharmaceutical companies and healthcare providers. Quality standards and regulatory compliance ensure that medical tourists receive the same quality of medicines as domestic patients. This integration is contributing to India's position as a leading medical tourism destination.",
  },
  {
    id: 21,
    title: "Trade Analytics: Market Intelligence",
    date: "February 25, 2025",
    author: "Rajesh Kumar",
    category: "Trade Analytics",
    readTime: "7 min read",
    tags: ["Analytics", "Market Intelligence", "Trade Data"],
    summary: "How data analytics is revolutionizing pharmaceutical trade intelligence and decision-making.",
    content:
      "Data analytics and artificial intelligence are transforming trade intelligence in the pharmaceutical sector, enabling better decision-making and strategic planning. Advanced analytics tools are providing insights into trade trends, customer behavior, and competitive dynamics.",
    details:
      "Pharmaceutical companies are leveraging big data analytics to understand trade dynamics and customer preferences. AI-powered trade intelligence platforms are analyzing social media, medical literature, and regulatory databases to identify emerging trends. Predictive analytics is helping companies forecast trade demand and optimize product portfolios. Real-time data monitoring enables quick response to trade changes and competitive activities. The integration of multiple data sources provides comprehensive trade insights. Companies are also using analytics to optimize pricing strategies and identify new trade opportunities. The adoption of cloud-based analytics platforms is making these capabilities more accessible to smaller companies. These technologies are helping pharmaceutical companies make data-driven decisions and maintain competitive advantage.",
  },
  {
    id: 22,
    title: "Trade Security: Protecting Pharma Supply Chains",
    date: "February 20, 2025",
    author: "Vikram Malhotra",
    category: "Trade Security",
    readTime: "8 min read",
    tags: ["Cybersecurity", "Supply Chain", "Trade Security"],
    summary: "Cybersecurity challenges and solutions for pharmaceutical trade operations.",
    content:
      "As pharmaceutical companies digitize their trade operations, cybersecurity has become a critical concern. Protecting intellectual property, trade data, and manufacturing systems from cyber threats is essential for business continuity and regulatory compliance.",
    details:
      "Pharmaceutical companies face unique cybersecurity challenges due to the sensitive nature of their trade data and the critical importance of their operations. Cyber threats include intellectual property theft, ransomware attacks, and supply chain vulnerabilities. Companies are implementing comprehensive cybersecurity frameworks including network security, endpoint protection, and data encryption. The adoption of zero-trust security models and multi-factor authentication is increasing. Regular security audits and penetration testing help identify vulnerabilities. Employee training programs raise awareness about cybersecurity threats and best practices. The sector is also collaborating with government agencies and cybersecurity experts to develop industry-specific security standards. Compliance with regulations like GDPR and HIPAA requires robust data protection measures.",
  },
  {
    id: 23,
    title: "Trade Partnerships: Global Collaborations",
    date: "February 15, 2025",
    author: "Anjali Rao",
    category: "Trade Partnerships",
    readTime: "6 min read",
    tags: ["Partnerships", "Collaborations", "Global Trade"],
    summary: "Strategic partnerships between Indian and international pharmaceutical trade companies.",
    content:
      "Strategic partnerships between Indian and international pharmaceutical trade companies are driving innovation and market expansion. These collaborations leverage complementary strengths and create value for both partners and patients.",
    details:
      "Partnership models include joint ventures, licensing agreements, and research collaborations. Indian companies are partnering with international firms to access new technologies and markets. International companies are collaborating with Indian partners to leverage manufacturing capabilities and cost advantages. Research partnerships are accelerating drug discovery and development programs. Technology transfer agreements are facilitating the development of new manufacturing processes and formulations. Marketing partnerships are helping companies expand their geographic presence and market share. These collaborations are also contributing to knowledge transfer and skill development. The success of these partnerships depends on clear communication, aligned objectives, and effective governance structures.",
  },
  {
    id: 24,
    title: "Trade Innovation: R&D Investment Trends",
    date: "February 10, 2025",
    author: "Dr. Amit Singh",
    category: "Trade Innovation",
    readTime: "7 min read",
    tags: ["R&D", "Innovation", "Trade Investment"],
    summary: "Investment trends in pharmaceutical trade research and development.",
    content:
      "India's pharmaceutical trade sector is witnessing increased investment in research and development, driven by the need for innovation and the pursuit of new therapeutic solutions. R&D spending has grown significantly in recent years.",
    details:
      "Pharmaceutical companies are increasing their R&D budgets, with spending growing at an annual rate of 15%. The focus areas include novel drug discovery, drug delivery systems, and personalized medicine. Government support through initiatives like the National Biopharma Mission is encouraging R&D investment. Academic-industry partnerships are facilitating basic research and early-stage drug development. The establishment of research parks and innovation hubs is creating ecosystems for R&D activities. International collaborations are providing access to advanced technologies and expertise. The sector is also investing in digital technologies like AI and machine learning for drug discovery. These investments are expected to result in new drug approvals and improved therapeutic options for patients.",
  }
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = blogs.filter(b => b.id !== blog.id && b.category === blog.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 py-20 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm mb-6">
              <TrendingUp className="w-4 h-4" />
              {blog.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
              {blog.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {blog.summary}
            </p>
            
            {/* Author and Meta Info */}
            <div className="flex items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                  {getInitials(blog.author)}
                </div>
                <div>
                  <div className="font-medium">{blog.author}</div>
                  <div className="text-sm opacity-80">Author</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                {blog.content}
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-8 rounded-2xl mb-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  In-depth Analysis
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {blog.details}
                </p>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="border-t border-gray-200 pt-8 mt-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 font-medium">Share this article:</span>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Related Articles
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                          {getInitials(article.author)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{article.author}</div>
                          <div className="text-xs text-gray-500">{article.date}</div>
                        </div>
                      </div>
                      
                      <Link
                        href={`/blog/${article.id}`}
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group-hover:gap-3"
                      >
                        Read More
                        <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get More Insights Like This
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Subscribe to our newsletter for the latest pharmaceutical trade analysis and industry updates.
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
              Join 10,000+ professionals getting weekly insights
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
