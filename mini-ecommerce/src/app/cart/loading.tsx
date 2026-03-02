export default function CartLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8 h-8 w-48 skeleton" />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2">
            <div className="card divide-y">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4">
                  <div className="h-24 w-24 skeleton rounded-lg" />
                  <div className="flex-1">
                    <div className="mb-2 h-5 w-3/4 skeleton" />
                    <div className="mb-2 h-4 w-1/4 skeleton" />
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-24 skeleton rounded-lg" />
                      <div className="h-6 w-16 skeleton" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="mb-4 h-6 w-32 skeleton" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 skeleton" />
                    <div className="h-4 w-16 skeleton" />
                  </div>
                ))}
              </div>
              <div className="mt-6 h-12 w-full skeleton rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
