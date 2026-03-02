'use client';

import { useState, useCallback, memo } from 'react';
import { Tag, X, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/utils';

interface PromoCodeInputProps {
  className?: string;
}

export const PromoCodeInput = memo(function PromoCodeInput({
  className,
}: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    promoCode,
    isPromoApplied,
    promoError,
    promoDiscount,
    applyPromo,
    removePromo,
  } = useCart();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (code.trim()) {
        applyPromo(code.trim());
      }
    },
    [code, applyPromo]
  );

  const handleRemovePromo = useCallback(() => {
    removePromo();
    setCode('');
    setIsExpanded(false);
  }, [removePromo]);

  // If promo is applied, show the applied state
  if (isPromoApplied && promoCode) {
    return (
      <div
        className={cn(
          'flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Promo code applied
            </p>
            <p className="text-xs text-green-600">{promoCode}</p>
          </div>
        </div>
        <button
          onClick={handleRemovePromo}
          className="rounded-full p-1 text-green-600 hover:bg-green-100"
          aria-label="Remove promo code"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600"
        >
          <Tag className="h-4 w-4" />
          Have a promo code?
        </button>
      ) : (
        <div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className={cn(
                  'w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm uppercase focus:outline-none focus:ring-2',
                  promoError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                )}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!code.trim()}
              className="btn-primary px-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setCode('');
              }}
              className="btn-ghost"
            >
              Cancel
            </button>
          </form>
          
          {/* Error Message */}
          {promoError && (
            <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {promoError}
            </p>
          )}

          {/* Hint */}
          <p className="mt-2 text-xs text-gray-500">
            Try: SAVE10, FLAT20, or WELCOME15
          </p>
        </div>
      )}
    </div>
  );
});
