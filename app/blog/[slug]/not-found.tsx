export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Post not found</h1>
        <p className="text-gray-600 mb-6">The blog post you are looking for does not exist.</p>
        <a href="/blog" className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Blog
        </a>
      </div>
    </div>
  )
}


