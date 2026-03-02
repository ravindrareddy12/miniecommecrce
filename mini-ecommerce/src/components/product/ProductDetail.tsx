'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
} from 'lucide-react';
import type { Product } from '@/types';
import { ImageGallery } from './ImageGallery';
import { VariantSelector } from './VariantSelector';
import { QuantitySelector } from './QuantitySelector';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import {
  formatCurrency,
  calculateDiscountedPrice,
  getStockStatus,
  generateStarRating,
  cn,
} from '@/utils';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  const { addItem, isInCart } = useCart();
  const { toggle, isInWishlist } = useWishlist();

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );
  const stockStatus = getStockStatus(product.stock);
  const stars = generateStarRating(product.rating);
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = useCallback(() => {
    addItem(product, quantity, selectedColor, selectedSize);
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
  }, [addItem, product, quantity, selectedColor, selectedSize]);

  const handleToggleWishlist = useCallback(() => {
    toggle(product);
  }, [toggle, product]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Image Gallery */}
      <div>
        <ImageGallery images={product.images} alt={product.title} />
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-primary-600">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/products"
                className="text-gray-500 hover:text-primary-600"
              >
                Products
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/products?category=${product.category}`}
                className="text-gray-500 hover:text-primary-600 capitalize"
              >
                {product.category.replace(/-/g, ' ')}
              </Link>
            </li>
          </ol>
        </nav>

        {/* Brand */}
        {product.brand && (
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary-600">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
          {product.title}
        </h1>

        {/* Rating & Reviews */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-1">
            {stars.map((star, index) => (
              <Star
                key={index}
                className={cn(
                  'h-5 w-5',
                  star === 'full'
                    ? 'fill-yellow-400 text-yellow-400'
                    : star === 'half'
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'text-gray-300'
                )}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-700">
              {product.rating.toFixed(1)}
            </span>
          </div>
          {product.reviews && (
            <span className="text-sm text-gray-500">
              ({product.reviews.length} reviews)
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-sm font-semibold text-red-600">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Tax included. Shipping calculated at checkout.
          </p>
        </div>

        {/* Stock Status */}
        <div className="mb-6">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
              stockStatus.color === 'green' && 'bg-green-100 text-green-700',
              stockStatus.color === 'yellow' && 'bg-yellow-100 text-yellow-700',
              stockStatus.color === 'red' && 'bg-red-100 text-red-700'
            )}
          >
            {stockStatus.color === 'green' && <Check className="h-4 w-4" />}
            {stockStatus.label}
          </span>
        </div>

        {/* Description */}
        <p className="mb-6 text-gray-600">{product.description}</p>

        {/* Variant Selector */}
        <div className="mb-6">
          <VariantSelector
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
          />
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <span className="mb-3 block text-sm font-medium text-gray-900">
            Quantity
          </span>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.stock}
            onChange={setQuantity}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              'btn-primary flex-1 gap-2 py-3 text-base',
              product.stock === 0 && 'cursor-not-allowed opacity-50'
            )}
          >
            {showAddedNotification ? (
              <>
                <Check className="h-5 w-5" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                {inCart ? 'Add More' : 'Add to Cart'}
              </>
            )}
          </button>
          <button
            onClick={handleToggleWishlist}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg border transition-colors',
              inWishlist
                ? 'border-red-500 bg-red-50 text-red-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('h-5 w-5', inWishlist && 'fill-current')} />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <Truck className="h-6 w-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">
              Free Shipping
            </span>
            <span className="text-xs text-gray-500">On orders $50+</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Shield className="h-6 w-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">
              Secure Payment
            </span>
            <span className="text-xs text-gray-500">100% Protected</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <RotateCcw className="h-6 w-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">
              Easy Returns
            </span>
            <span className="text-xs text-gray-500">30 Day Policy</span>
          </div>
        </div>

        {/* Additional Info */}
        {(product.warrantyInformation || product.shippingInformation) && (
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            {product.warrantyInformation && (
              <p>
                <strong>Warranty:</strong> {product.warrantyInformation}
              </p>
            )}
            {product.shippingInformation && (
              <p>
                <strong>Shipping:</strong> {product.shippingInformation}
              </p>
            )}
            {product.returnPolicy && (
              <p>
                <strong>Returns:</strong> {product.returnPolicy}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
