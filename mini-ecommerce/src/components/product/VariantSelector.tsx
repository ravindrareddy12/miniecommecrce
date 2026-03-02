'use client';

import { memo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils';
import { AVAILABLE_COLORS, AVAILABLE_SIZES } from '@/lib/constants';

interface VariantSelectorProps {
  selectedColor: string | undefined;
  selectedSize: string | undefined;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
}

export const VariantSelector = memo(function VariantSelector({
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Color Selector */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Color</span>
          {selectedColor && (
            <span className="text-sm text-gray-600">{selectedColor}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color.name)}
              className={cn(
                'relative h-10 w-10 rounded-full border-2 transition-all',
                selectedColor === color.name
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-gray-300 hover:border-gray-400'
              )}
              style={{ backgroundColor: color.value }}
              aria-label={`Select ${color.name} color`}
              aria-pressed={selectedColor === color.name}
            >
              {selectedColor === color.name && (
                <Check
                  className={cn(
                    'absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2',
                    color.value === '#FFFFFF' ? 'text-gray-900' : 'text-white'
                  )}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Size</span>
          <button className="text-sm text-primary-600 hover:underline">
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={cn(
                'min-w-[48px] rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                selectedSize === size
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              )}
              aria-label={`Select size ${size}`}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
