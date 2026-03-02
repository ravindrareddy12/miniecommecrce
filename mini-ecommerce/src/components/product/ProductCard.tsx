'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { cn, formatCurrency, calculateDiscountedPrice } from '@/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = memo(function ProductCard({
  product,
  className,
}: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { toggle, isInWishlist } = useWishlist();

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem(product);
    },
    [addItem, product]
  );

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggle(product);
    },
    [toggle, product]
  );

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  return (
    <Link href={`/products/${product.id}`} className={cn('group block', className)}>
      <article className="card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}

          {/* Quick Actions */}
          <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'rounded-full bg-white p-2 shadow-md transition-colors',
                inWishlist
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn('h-4 w-4', inWishlist && 'fill-current')}
              />
            </button>
            <button
              onClick={handleAddToCart}
              className={cn(
                'rounded-full bg-white p-2 shadow-md transition-colors',
                inCart
                  ? 'text-primary-600 hover:bg-primary-50'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
              aria-label={inCart ? 'Already in cart' : 'Add to cart'}
            >
              <ShoppingCart
                className={cn('h-4 w-4', inCart && 'fill-current')}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary-600">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({product.stock} in stock)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
});
