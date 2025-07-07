import PlexusBackground from "@/components/PlexusBackground"

export default function ContactLoading() {
  return (
    <div className="min-h-screen w-full bg-cover bg-center">
      <PlexusBackground nodeCount={100} maxDistance={120}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-md max-w-5xl w-full px-6 pt-10 pb-12 my-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg mb-8 w-3/4 mx-auto"></div>
              
              {/* Contact Info Card Skeleton */}
              <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 gap-y-8 bg-white rounded-2xl shadow-md border border-blue-100 p-8 mb-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Form Skeleton */}
              <div className="flex flex-col justify-center">
                <div className="h-8 bg-gray-200 rounded-lg mb-6 w-1/2 mx-auto"></div>
                <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-end">
                    <div className="h-12 bg-gray-200 rounded-full w-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PlexusBackground>
    </div>
  )
} 