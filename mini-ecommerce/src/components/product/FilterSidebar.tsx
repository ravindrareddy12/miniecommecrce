'use client';

import { useState, useCallback, memo } from 'react';
import { X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { cn } from '@/utils';
import { useFilters } from '@/hooks/useFilters';
import { RATING_OPTIONS, DEFAULT_PRICE_RANGE } from '@/lib/constants';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  className?: string;
}

export const FilterSidebar = memo(function FilterSidebar({
  categories,
  brands,
  className,
}: FilterSidebarProps) {
  const {
    selectedCategories,
    selectedBrands,
    priceRange,
    rating,
    hasActiveFilters,
    toggleCategoryFilter,
    toggleBrandFilter,
    updatePriceRange,
    updateRating,
    clearAllFilters,
  } = useFilters();

  return (
    <aside className={cn('space-y-6', className)}>
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </button>
      )}

      {/* Categories Filter */}
      <FilterSection title="Categories">
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategoryFilter(category)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {category.replace(/-/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <FilterSection title="Brands">
          <div className="max-h-48 space-y-2 overflow-y-auto custom-scrollbar">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrandFilter(brand)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price Range Filter */}
      <FilterSection title="Price Range">
        <PriceRangeFilter
          value={priceRange}
          onChange={updatePriceRange}
        />
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Rating">
        <div className="space-y-2">
          {RATING_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="rating"
                checked={rating === option.value}
                onChange={() => updateRating(option.value)}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="flex items-center gap-1 text-sm text-gray-700">
                {option.label}
              </span>
            </label>
          ))}
          {rating !== null && (
            <button
              onClick={() => updateRating(null)}
              className="text-xs text-primary-600 hover:underline"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </FilterSection>
    </aside>
  );
});

// Filter Section Component
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-900"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="pt-2">{children}</div>}
    </div>
  );
}

// Price Range Filter Component
interface PriceRangeFilterProps {
  value: { min: number; max: number };
  onChange: (min: number, max: number) => void;
}

function PriceRangeFilter({ value, onChange }: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(value.min.toString());
  const [localMax, setLocalMax] = useState(value.max.toString());

  const handleApply = () => {
    const min = Math.max(0, parseInt(localMin) || 0);
    const max = parseInt(localMax) || DEFAULT_PRICE_RANGE.max;
    onChange(min, max);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="sr-only">Min price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <span className="text-gray-400">—</span>
        <div className="flex-1">
          <label className="sr-only">Max price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              placeholder="2000"
              className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleApply}
        className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        Apply
      </button>
    </div>
  );
}
