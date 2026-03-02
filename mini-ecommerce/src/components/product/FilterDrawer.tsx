'use client';

import { useRef, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';
import { useScrollLock, useEscapeKey } from '@/hooks';
import { cn } from '@/utils';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  brands: string[];
}

export function FilterDrawer({
  isOpen,
  onClose,
  categories,
  brands,
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock scroll when drawer is open
  useScrollLock(isOpen);

  // Close on escape key
  useEscapeKey(onClose);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="overlay" aria-hidden="true" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="h-[calc(100vh-65px)] overflow-y-auto p-4">
          <FilterSidebar categories={categories} brands={brands} />
        </div>
      </div>
    </div>
  );
}
