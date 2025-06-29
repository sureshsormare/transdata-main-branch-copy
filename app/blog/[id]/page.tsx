"use client";

import Image from "next/image";
import React from "react";

interface Blog {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
  details: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    title: "Pharma Import Trends: Q1 2025 Insights",
    date: "June 10, 2025",
    author: "Dr. Kavita Mehra",
    content:
      "India's pharmaceutical imports surged 15% in Q1 2025, driven by increased demand for specialty APIs and advanced formulations. The government’s new trade policies and streamlined customs processes have played a significant role. Key import partners include Germany, Switzerland, and the US. Experts predict continued growth as domestic pharma companies expand their global reach.",
    details:
      "This quarter's growth is attributed to the rising need for high-quality raw materials and the expansion of domestic manufacturing capabilities. The government’s focus on ease of doing business has resulted in faster customs clearance and reduced bottlenecks at major ports. Notably, the import of specialty APIs has seen a 20% year-on-year increase, reflecting the industry's shift towards complex formulations. Industry leaders are optimistic about the future, citing ongoing collaborations with European suppliers and the adoption of advanced supply chain technologies. The report also highlights the importance of regulatory compliance and the role of digital platforms in streamlining import documentation.",
  },
  {
    id: 2,
    title: "Export Compliance in Pharma: New Regulations",
    date: "June 5, 2025",
    author: "Suresh Patil",
    content:
      "New documentation rules affect API exports significantly. Exporters must now provide detailed traceability reports and adhere to stricter packaging standards. The Directorate General of Foreign Trade (DGFT) has issued guidelines to ensure compliance, aiming to boost India’s reputation as a reliable pharma exporter.",
    details:
      "The updated regulations require exporters to maintain comprehensive records of every batch, including source materials and distribution channels. Packaging standards have been revised to ensure product integrity during transit, with a focus on tamper-evident seals and eco-friendly materials. The DGFT’s new digital portal simplifies the submission of compliance documents, reducing processing times. Exporters are encouraged to participate in training sessions organized by industry bodies to stay updated on best practices. These changes are expected to enhance transparency, minimize the risk of counterfeiting, and strengthen India’s position in the global pharmaceutical market.",
  },
  {
    id: 3,
    title: "India's Biotech Exchange Boom",
    date: "May 28, 2025",
    author: "Anjali Rao",
    content:
      "Biotech trade programs have boosted Indian pharma exports, especially in the vaccine and biosimilar segments. Collaborative R&D initiatives and government incentives have attracted global investors. The sector is expected to see double-digit growth through 2026.",
    details:
      "The biotech sector’s rapid expansion is fueled by increased funding for research and the establishment of biotech parks across major cities. Government incentives, such as tax breaks and grants, have encouraged startups to innovate in vaccine development and biosimilar production. International partnerships have led to technology transfers and skill development, further enhancing India’s capabilities. The sector’s growth is also supported by a robust regulatory framework and a skilled workforce. Analysts predict that continued investment in R&D and infrastructure will position India as a global leader in biotech exports over the next few years.",
  },
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
    return <div className="p-8 text-center text-gray-500">Blog not found.</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-0 px-0">
      {/* Banner with image */}
      <div className="w-full h-56 md:h-64 relative flex items-end">
        <Image
          src="/bannerblog.jpg"
          alt="Blog Banner"
          fill
          className="object-cover object-center rounded-b-3xl"
          priority
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-700/30 to-transparent rounded-b-3xl" />
        {/* Floating author card */}
        <div className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 flex items-center gap-4 bg-white rounded-2xl shadow-lg px-10 py-2 border border-blue-100 z-10">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 shadow">
            {getInitials(blog.author)}
          </div>
          <div>
            <div className="font-semibold text-blue-900">{blog.author}</div>
            <div className="text-xs text-gray-500">{blog.date}</div>
          </div>
        </div>
      </div>
      {/* Blog Card */}
      <div className="max-w-6xl mx-auto pt-20 pb-12 px-4">
        <article className="bg-white rounded-3xl shadow-2xl p-10 border border-blue-100">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">
            {blog.title}
          </h1>
          <p className="text-gray-800 leading-relaxed mb-8 text-lg">
            {blog.content}
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded mb-8">
            <p className="text-blue-900 font-medium mb-2">In-depth Details:</p>
            <p className="text-gray-700">{blog.details}</p>
          </div>
          <div className="mt-8 flex justify-end">
            <a
              href="/blog"
              className="inline-block px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow hover:bg-blue-700 transition"
            >
              ← Back to Blog List
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}
