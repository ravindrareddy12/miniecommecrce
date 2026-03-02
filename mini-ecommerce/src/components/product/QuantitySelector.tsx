'use client';

import { memo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity?: number;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector = memo(function QuantitySelector({
  quantity,
  maxQuantity = 99,
  onChange,
  size = 'md',
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      onChange(value);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'h-7 w-7',
      icon: 'h-3 w-3',
      input: 'w-10 text-sm',
    },
    md: {
      button: 'h-10 w-10',
      icon: 'h-4 w-4',
      input: 'w-14 text-base',
    },
    lg: {
      button: 'h-12 w-12',
      icon: 'h-5 w-5',
      input: 'w-16 text-lg',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className={cn(
          'flex items-center justify-center rounded-lg border border-gray-300 transition-colors',
          classes.button,
          quantity <= 1
            ? 'cursor-not-allowed bg-gray-50 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={classes.icon} />
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={1}
        max={maxQuantity}
        className={cn(
          'rounded-lg border border-gray-300 text-center font-medium text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
          classes.input,
          size === 'sm' ? 'py-1' : size === 'md' ? 'py-2' : 'py-3'
        )}
        aria-label="Quantity"
      />
      
      <button
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        className={cn(
          'flex items-center justify-center rounded-lg border border-gray-300 transition-colors',
          classes.button,
          quantity >= maxQuantity
            ? 'cursor-not-allowed bg-gray-50 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        )}
        aria-label="Increase quantity"
      >
        <Plus className={classes.icon} />
      </button>
    </div>
  );
});
