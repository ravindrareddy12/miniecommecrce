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
      <article className="card overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg animate-bounce-in">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}

          {/* Quick Actions */}
          <div className="absolute right-2 top-2 flex flex-col gap-2 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'rounded-full bg-white/90 backdrop-blur-sm p-2.5 shadow-lg transition-all duration-200 hover:scale-110',
                inWishlist
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-600 hover:bg-white hover:text-red-500'
              )}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn('h-4 w-4 transition-transform', inWishlist && 'fill-current animate-heartbeat')}
              />
            </button>
            <button
              onClick={handleAddToCart}
              className={cn(
                'rounded-full bg-white/90 backdrop-blur-sm p-2.5 shadow-lg transition-all duration-200 hover:scale-110',
                inCart
                  ? 'text-primary-600 hover:bg-primary-50'
                  : 'text-gray-600 hover:bg-white hover:text-primary-600'
              )}
              aria-label={inCart ? 'Already in cart' : 'Add to cart'}
            >
              <ShoppingCart
                className={cn('h-4 w-4 transition-transform', inCart && 'fill-current')}
              />
            </button>
          </div>

          {/* Add to cart overlay button */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className={cn(
                'w-full rounded-lg py-2 text-sm font-semibold transition-all',
                inCart
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-primary-600 hover:text-white'
              )}
            >
              {inCart ? '✓ In Cart' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors duration-200 group-hover:text-primary-600">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-800">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              {product.stock} in stock
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
});
