// pages/blog/index.tsx
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "Pharma Import Trends: Q1 2025 Insights",
    summary:
      "An overview of pharmaceutical imports into India during Q1 2025, including top-origin countries and growth metrics.",
    date: "June 10, 2025",
    author: "Dr. Kavita Mehra",
  },
  {
    id: 2,
    title: "Export Compliance in Pharma: New Regulations",
    summary:
      "A summary of updated export documentation requirements and their impact on Indian pharmaceutical companies.",
    date: "June 5, 2025",
    author: "Suresh Patil",
  },
  {
    id: 3,
    title: "India's Biotech Exchange Boom",
    summary:
      "How India's biotech sector is attracting investors through global trade programs.",
    date: "May 28, 2025",
    author: "Anjali Rao",
  },
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
    <main className="min-h-screen bg-gradient-to-br from-blue-700 to-white py-12 px-4">
      <h1 className="text-4xl text-white font-extrabold mb-12 text-center  drop-shadow">
        Pharmaceutical Blog & Trade Insights
      </h1>
      <div className="max-w-5xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border border-blue-100 p-7 flex flex-col"
          >
            {/* Author Avatar and Date */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 shadow text-xl font-bold text-blue-700">
                {getInitials(blog.author)}
              </div>
              <div>
                <div className="font-medium text-blue-800">{blog.author}</div>
                <div className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full mt-1">
                  {blog.date}
                </div>
              </div>
            </div>
            {/* Title and Summary */}
            <h2 className="text-2xl font-semibold mb-2 text-blue-900 hover:text-blue-700 transition-colors">
              {blog.title}
            </h2>
            <p className="text-gray-700 mb-6">{blog.summary}</p>
            <div className="mt-auto">
              <Link
                href={`/blog/${blog.id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow hover:bg-blue-700 transition"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
        {/* Subscribe Card */}
        <div className=" flex justify-center">
          <div className=" bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-xl w-full">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Stay Updated!
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Subscribe for pharma trade insights, news, and updates. Want to
              connect? Reach out to us!
            </p>
            <Link
              href="/contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition"
            >
              Subscribe / Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
