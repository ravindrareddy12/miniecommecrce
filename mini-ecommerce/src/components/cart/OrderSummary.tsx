'use client';

import { memo } from 'react';
import { ShoppingBag, Tag, TrendingUp, Percent } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency, cn } from '@/utils';
import { PromoCodeInput } from './PromoCodeInput';

interface OrderSummaryProps {
  onCheckout: () => void;
  className?: string;
}

export const OrderSummary = memo(function OrderSummary({
  onCheckout,
  className,
}: OrderSummaryProps) {
  const {
    itemsCount,
    subtotal,
    discount,
    subtotalAfterDiscount,
    promoDiscount,
    tax,
    total,
    isEmpty,
  } = useCart();

  const savings = discount + promoDiscount;

  return (
    <div className={cn('card p-6', className)}>
      <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <ShoppingBag className="h-5 w-5" />
        Order Summary
      </h2>

      {/* Price Breakdown */}
      <div className="space-y-3">
        {/* Subtotal (MRP) */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Product Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              Product Discount
            </span>
            <span className="font-medium text-green-600">
              -{formatCurrency(discount)}
            </span>
          </div>
        )}

        {/* Promo Discount */}
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <Tag className="h-4 w-4" />
              Promo Discount
            </span>
            <span className="font-medium text-green-600">
              -{formatCurrency(promoDiscount)}
            </span>
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated Tax (8%)</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(tax)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">
            {subtotalAfterDiscount >= 50 ? 'Free' : formatCurrency(5.99)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3">
          {/* Total */}
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(total + (subtotalAfterDiscount < 50 ? 5.99 : 0))}
            </span>
          </div>
        </div>

        {/* Savings Banner */}
        {savings > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
            <Percent className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              You're saving {formatCurrency(savings)} on this order!
            </span>
          </div>
        )}
      </div>

      {/* Promo Code Input */}
      <div className="mt-6">
        <PromoCodeInput />
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isEmpty}
        className="btn-primary mt-6 w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proceed to Checkout
      </button>

      {/* Free Shipping Progress */}
      {subtotalAfterDiscount < 50 && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-gray-600">
            Add {formatCurrency(50 - subtotalAfterDiscount)} more for free
            shipping
          </p>
          <div className="h-2 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-primary-500 transition-all"
              style={{
                width: `${Math.min((subtotalAfterDiscount / 50) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Security Badge */}
      <p className="mt-4 text-center text-xs text-gray-500">
        🔒 Secure checkout powered by Stripe
      </p>
    </div>
  );
});
