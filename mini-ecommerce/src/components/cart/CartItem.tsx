'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency, calculateDiscountedPrice, cn } from '@/utils';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = memo(function CartItem({ item }: CartItemProps) {
  const { product, quantity, selectedColor, selectedSize } = item;
  const { removeItem, updateItemQuantity } = useCart();
  const { toggle, isInWishlist } = useWishlist();

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const itemTotal = discountedPrice * quantity;
  const inWishlist = isInWishlist(product.id);

  const handleRemove = () => {
    removeItem(product.id, selectedColor, selectedSize);
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateItemQuantity(product.id, newQuantity, selectedColor, selectedSize);
  };

  const handleMoveToWishlist = () => {
    toggle(product);
    if (!inWishlist) {
      removeItem(product.id, selectedColor, selectedSize);
    }
  };

  return (
    <div className="flex gap-4 py-4">
      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-32 sm:w-32"
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover"
          sizes="128px"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs font-medium uppercase text-gray-500">
                {product.brand}
              </p>
            )}
            
            {/* Title */}
            <Link
              href={`/products/${product.id}`}
              className="line-clamp-2 font-medium text-gray-900 hover:text-primary-600"
            >
              {product.title}
            </Link>

            {/* Variants */}
            <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
              {selectedColor && (
                <span className="rounded bg-gray-100 px-2 py-0.5">
                  Color: {selectedColor}
                </span>
              )}
              {selectedSize && (
                <span className="rounded bg-gray-100 px-2 py-0.5">
                  Size: {selectedSize}
                </span>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="h-fit rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Remove item"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Price & Quantity */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex items-center gap-3">
            <QuantitySelector
              quantity={quantity}
              maxQuantity={product.stock}
              onChange={handleQuantityChange}
              size="sm"
            />
            
            {/* Move to Wishlist */}
            <button
              onClick={handleMoveToWishlist}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors',
                inWishlist
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-primary-600'
              )}
              aria-label={inWishlist ? 'In wishlist' : 'Move to wishlist'}
            >
              <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
              <span className="hidden sm:inline">
                {inWishlist ? 'In Wishlist' : 'Save'}
              </span>
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatCurrency(itemTotal)}
            </p>
            {product.discountPercentage > 0 && (
              <p className="text-xs text-gray-500">
                <span className="line-through">
                  {formatCurrency(product.price * quantity)}
                </span>
                <span className="ml-1 text-red-500">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
