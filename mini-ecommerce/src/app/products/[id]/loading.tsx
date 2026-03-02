export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery Skeleton */}
          <div>
            <div className="aspect-square skeleton mb-4 rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 w-20 skeleton rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div>
            <div className="mb-2 h-4 w-24 skeleton" />
            <div className="mb-4 h-8 w-3/4 skeleton" />
            <div className="mb-6 flex items-center gap-2">
              <div className="h-6 w-24 skeleton" />
              <div className="h-4 w-16 skeleton" />
            </div>
            <div className="mb-6 h-10 w-1/3 skeleton" />
            <div className="mb-4 space-y-2">
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-2/3 skeleton" />
            </div>

            {/* Variant Selectors Skeleton */}
            <div className="mb-6">
              <div className="mb-2 h-5 w-16 skeleton" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-10 skeleton rounded-full" />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 h-5 w-16 skeleton" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 w-12 skeleton rounded-lg" />
                ))}
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-4">
              <div className="h-12 flex-1 skeleton rounded-lg" />
              <div className="h-12 w-12 skeleton rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
