import { HeroCarousel } from '@/components/home/HeroCarousel';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { TrendingProducts } from '@/components/home/TrendingProducts';
import { getProducts } from '@/lib/api';

export default async function HomePage() {
  // Fetch trending products for the home page
  const productsData = await getProducts(8, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section aria-label="Hero banner">
        <HeroCarousel />
      </section>

      {/* Featured Categories */}
      <section aria-label="Featured categories" className="py-12 md:py-16">
        <div className="container-custom">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl animate-fade-in">
            Shop by Category
          </h2>
          <FeaturedCategories />
        </div>
      </section>

      {/* Trending Products */}
      <section
        aria-label="Trending products"
        className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16"
      >
        <div className="container-custom">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Trending Now
            </h2>
            <a
              href="/products"
              className="group flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All 
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
          <TrendingProducts products={productsData.products} />
        </div>
      </section>

      {/* Promo Banner */}
      <section aria-label="Promotional banner" className="py-12 md:py-16">
        <div className="container-custom">
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 px-8 py-12 text-white md:px-12 md:py-16 shadow-2xl transition-all duration-500 hover:shadow-primary-500/25">
            <div className="relative z-10 max-w-xl">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl drop-shadow-lg">
                Get 15% Off Your First Order
              </h2>
              <p className="mb-6 text-lg opacity-90">
                Use code <span className="rounded bg-white/20 px-2 py-1 font-bold">WELCOME15</span> at checkout
              </p>
              <a
                href="/products"
                className="inline-block rounded-xl bg-white px-8 py-3 font-bold text-primary-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50"
              >
                Start Shopping
              </a>
            </div>
            {/* Decorative circles with animation */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-150" />
            <div className="absolute -bottom-16 -right-8 h-48 w-48 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-125" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 animate-pulse-slow" />
          </div>
        </div>
      </section>
    </div>
  );
}
