import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_CATEGORIES } from '@/lib/constants';

export function FeaturedCategories() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {FEATURED_CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group relative overflow-hidden rounded-xl bg-gray-100 transition-all hover:shadow-lg"
        >
          <div className="aspect-square p-4">
            <div className="relative h-full w-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
            <h3 className="text-center text-sm font-semibold text-white">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
