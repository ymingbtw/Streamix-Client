export default function MovieInfoSkeleton() {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-black aspect-video relative overflow-hidden h-[75%] rounded-2xl w-[90%] max-w-[750px]">
          {/* Simulated backdrop image */}
          <div className="absolute inset-0 bg-gray-800"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent"></div>

          {/* Info skeleton */}
          <div className="p-8 absolute bottom-0 z-10 w-full animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="grid gap-4 grid-cols-[65%_35%]">
              <div className="space-y-2">
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-20 mb-1"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
