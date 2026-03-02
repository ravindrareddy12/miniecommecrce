import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_CATEGORIES } from '@/lib/constants';

export function FeaturedCategories() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {FEATURED_CATEGORIES.map((category, index) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="aspect-square p-4">
            <div className="relative h-full w-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-10 transition-all duration-300 group-hover:from-primary-900/90">
            <h3 className="text-center text-sm font-bold text-white drop-shadow-lg">
              {category.name}
            </h3>
          </div>
          {/* Hover ring effect */}
          <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary-500/50" />
        </Link>
      ))}
    </div>
  );
}
