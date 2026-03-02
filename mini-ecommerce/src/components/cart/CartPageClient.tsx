'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartItem } from './CartItem';
import { OrderSummary } from './OrderSummary';
import { MobileCheckoutBar } from './MobileCheckoutBar';
import { CheckoutModal } from './CheckoutModal';

export function CartPageClient() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { items, isEmpty, clear } = useCart();

  if (isEmpty) {
    return (
      <div className="min-h-[60vh] bg-gray-50">
        <div className="container-custom py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full bg-gray-100 p-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h1>
            <p className="mb-8 text-gray-600">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products" className="btn-primary gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your
              cart
            </p>
          </div>
          <button
            onClick={clear}
            className="text-sm text-red-600 hover:text-red-700 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card divide-y divide-gray-200 px-4">
              {items.map((item) => (
                <CartItem
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                  item={item}
                />
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary onCheckout={() => setIsCheckoutOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Checkout Bar */}
      <MobileCheckoutBar onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
