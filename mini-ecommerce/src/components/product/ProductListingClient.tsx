'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import type { Product, Category } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductCardSkeleton';
import { FilterSidebar } from './FilterSidebar';
import { FilterDrawer } from './FilterDrawer';
import { SortDropdown } from './SortDropdown';
import { Pagination } from './Pagination';
import { useFilters } from '@/hooks/useFilters';
import { useDebounce } from '@/hooks';
import { extractBrands, extractCategories } from '@/lib/api';
import { PRODUCTS_PER_PAGE } from '@/lib/constants';
import { cn } from '@/utils';

interface ProductListingClientProps {
  initialProducts: Product[];
  categories: Category[];
  totalProducts: number;
}

export function ProductListingClient({
  initialProducts,
  categories,
  totalProducts,
}: ProductListingClientProps) {
  const searchParams = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  
  const {
    searchQuery,
    selectedCategories,
    updateSearchQuery,
    applyFilters,
    setCategoryFilters,
    hasActiveFilters,
    activeFiltersCount,
  } = useFilters();

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  // Extract unique brands and categories from products
  const availableBrands = useMemo(
    () => extractBrands(initialProducts),
    [initialProducts]
  );
  
  const availableCategories = useMemo(
    () => categories.map((c) => c.slug),
    [categories]
  );

  // Handle URL params for initial category filter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam && !selectedCategories.includes(categoryParam)) {
      setCategoryFilters([categoryParam]);
    }
    
    if (searchParam) {
      setSearchInput(searchParam);
      updateSearchQuery(searchParam);
    }
  }, [searchParams, selectedCategories, setCategoryFilters, updateSearchQuery]);

  // Update search query when debounced value changes
  useEffect(() => {
    updateSearchQuery(debouncedSearch);
    setCurrentPage(1);
  }, [debouncedSearch, updateSearchQuery]);

  // Filter and paginate products
  const filteredProducts = useMemo(() => {
    return applyFilters(initialProducts);
  }, [initialProducts, applyFilters]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateSearchQuery('');
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {filteredProducts.length} of {totalProducts} products
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64 md:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Button (Mobile) */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium lg:hidden',
              hasActiveFilters
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <SortDropdown />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Filter Sidebar (Desktop) */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="card p-4">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Filters
              </h2>
              <FilterSidebar
                categories={availableCategories}
                brands={availableBrands}
              />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        categories={availableCategories}
        brands={availableBrands}
      />
    </div>
  );
}
