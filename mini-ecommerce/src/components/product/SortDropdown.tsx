'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils';
import { useFilters } from '@/hooks/useFilters';
import { SORT_OPTIONS } from '@/lib/constants';
import type { SortOption } from '@/types';

interface SortDropdownProps {
  className?: string;
}

export function SortDropdown({ className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { sortBy, updateSortBy } = useFilters();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = SORT_OPTIONS.find((option) => option.value === sortBy);

  const handleSelect = (value: SortOption) => {
    updateSortBy(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="hidden sm:inline">Sort by: </span>
        <span>{selectedOption?.label}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg"
          role="listbox"
        >
          <div className="py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value as SortOption)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-sm',
                  sortBy === option.value
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                role="option"
                aria-selected={sortBy === option.value}
              >
                {option.label}
                {sortBy === option.value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
