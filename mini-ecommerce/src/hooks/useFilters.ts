import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSearchQuery,
  toggleCategory,
  setCategories,
  toggleBrand,
  setBrands,
  setPriceRange,
  setRating,
  setSortBy,
  clearFilters,
  clearCategoryFilters,
  clearBrandFilters,
  clearPriceFilter,
  clearRatingFilter,
  selectFilters,
  selectSearchQuery,
  selectSelectedCategories,
  selectSelectedBrands,
  selectPriceRange,
  selectRating,
  selectSortBy,
  selectActiveFiltersCount,
  filterProducts,
} from '@/features/filterSlice';
import type { SortOption, Product } from '@/types';

/**
 * Custom hook for managing product filters
 * Provides all filter-related actions and selectors
 */
export function useFilters() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const filters = useAppSelector(selectFilters);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategories = useAppSelector(selectSelectedCategories);
  const selectedBrands = useAppSelector(selectSelectedBrands);
  const priceRange = useAppSelector(selectPriceRange);
  const rating = useAppSelector(selectRating);
  const sortBy = useAppSelector(selectSortBy);
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount);

  // Search actions
  const updateSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  // Category actions
  const toggleCategoryFilter = useCallback(
    (category: string) => {
      dispatch(toggleCategory(category));
    },
    [dispatch]
  );

  const setCategoryFilters = useCallback(
    (categories: string[]) => {
      dispatch(setCategories(categories));
    },
    [dispatch]
  );

  // Brand actions
  const toggleBrandFilter = useCallback(
    (brand: string) => {
      dispatch(toggleBrand(brand));
    },
    [dispatch]
  );

  const setBrandFilters = useCallback(
    (brands: string[]) => {
      dispatch(setBrands(brands));
    },
    [dispatch]
  );

  // Price range actions
  const updatePriceRange = useCallback(
    (min: number, max: number) => {
      dispatch(setPriceRange({ min, max }));
    },
    [dispatch]
  );

  // Rating actions
  const updateRating = useCallback(
    (rating: number | null) => {
      dispatch(setRating(rating));
    },
    [dispatch]
  );

  // Sort actions
  const updateSortBy = useCallback(
    (sort: SortOption) => {
      dispatch(setSortBy(sort));
    },
    [dispatch]
  );

  // Clear actions
  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const clearCategories = useCallback(() => {
    dispatch(clearCategoryFilters());
  }, [dispatch]);

  const clearBrands = useCallback(() => {
    dispatch(clearBrandFilters());
  }, [dispatch]);

  const clearPrice = useCallback(() => {
    dispatch(clearPriceFilter());
  }, [dispatch]);

  const clearRating = useCallback(() => {
    dispatch(clearRatingFilter());
  }, [dispatch]);

  // Filter products utility
  const applyFilters = useCallback(
    (products: Product[]) => {
      return filterProducts(products, filters);
    },
    [filters]
  );

  return {
    // State
    filters,
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    rating,
    sortBy,
    activeFiltersCount,
    hasActiveFilters: activeFiltersCount > 0,
    
    // Actions
    updateSearchQuery,
    toggleCategoryFilter,
    setCategoryFilters,
    toggleBrandFilter,
    setBrandFilters,
    updatePriceRange,
    updateRating,
    updateSortBy,
    clearAllFilters,
    clearCategories,
    clearBrands,
    clearPrice,
    clearRating,
    
    // Utilities
    applyFilters,
  };
}
