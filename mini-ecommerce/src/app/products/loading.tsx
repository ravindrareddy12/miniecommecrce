export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header Skeleton */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="h-8 w-48 skeleton" />
          <div className="flex gap-4">
            <div className="h-10 w-32 skeleton rounded-lg" />
            <div className="h-10 w-48 skeleton rounded-lg" />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar Skeleton (Desktop) */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="card p-4">
              <div className="mb-4 h-6 w-24 skeleton" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-3 h-5 w-full skeleton" />
              ))}
              <div className="mt-6 mb-4 h-6 w-24 skeleton" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-3 h-5 w-full skeleton" />
              ))}
            </div>
          </aside>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="aspect-square skeleton mb-4 rounded-lg" />
                  <div className="mb-2 h-4 w-3/4 skeleton" />
                  <div className="mb-2 h-4 w-full skeleton" />
                  <div className="h-6 w-1/3 skeleton" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
