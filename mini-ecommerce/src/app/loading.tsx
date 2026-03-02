export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="h-[400px] w-full skeleton md:h-[500px]" />

      {/* Categories Skeleton */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="mb-8 h-8 w-48 skeleton" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square skeleton rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container-custom">
          <div className="mb-8 h-8 w-48 skeleton" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-4">
                <div className="aspect-square skeleton mb-4 rounded-lg" />
                <div className="mb-2 h-4 w-3/4 skeleton" />
                <div className="h-4 w-1/2 skeleton" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
