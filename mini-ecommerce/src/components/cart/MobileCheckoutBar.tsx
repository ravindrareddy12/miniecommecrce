'use client';

import { memo } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency, cn } from '@/utils';

interface MobileCheckoutBarProps {
  onCheckout: () => void;
  className?: string;
}

export const MobileCheckoutBar = memo(function MobileCheckoutBar({
  onCheckout,
  className,
}: MobileCheckoutBarProps) {
  const { itemsCount, total, isEmpty } = useCart();

  if (isEmpty) return null;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-4 shadow-lg safe-bottom lg:hidden',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600">
            {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
          </p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(total)}
          </p>
        </div>
        <button
          onClick={onCheckout}
          className="btn-primary flex-1 gap-2 py-3"
        >
          <ShoppingBag className="h-5 w-5" />
          Checkout
        </button>
      </div>
    </div>
  );
});
