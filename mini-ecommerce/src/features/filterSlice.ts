import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { FilterState, SortOption, Product } from '@/types';
import { DEFAULT_PRICE_RANGE } from '@/lib/constants';

const initialState: FilterState = {
  categories: [],
  brands: [],
  priceRange: DEFAULT_PRICE_RANGE,
  rating: null,
  sortBy: 'relevance',
  searchQuery: '',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // Set search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Toggle category filter
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.categories.indexOf(category);
      
      if (index >= 0) {
        state.categories.splice(index, 1);
      } else {
        state.categories.push(category);
      }
    },

    // Set categories (multiple)
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },

    // Toggle brand filter
    toggleBrand: (state, action: PayloadAction<string>) => {
      const brand = action.payload;
      const index = state.brands.indexOf(brand);
      
      if (index >= 0) {
        state.brands.splice(index, 1);
      } else {
        state.brands.push(brand);
      }
    },

    // Set brands (multiple)
    setBrands: (state, action: PayloadAction<string[]>) => {
      state.brands = action.payload;
    },

    // Set price range
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>
    ) => {
      state.priceRange = action.payload;
    },

    // Set minimum rating filter
    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload;
    },

    // Set sort option
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },

    // Clear all filters
    clearFilters: (state) => {
      state.categories = [];
      state.brands = [];
      state.priceRange = DEFAULT_PRICE_RANGE;
      state.rating = null;
      state.sortBy = 'relevance';
      state.searchQuery = '';
    },

    // Clear specific filter type
    clearCategoryFilters: (state) => {
      state.categories = [];
    },

    clearBrandFilters: (state) => {
      state.brands = [];
    },

    clearPriceFilter: (state) => {
      state.priceRange = DEFAULT_PRICE_RANGE;
    },

    clearRatingFilter: (state) => {
      state.rating = null;
    },
  },
});

// Export actions
export const {
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
} = filterSlice.actions;

// Selectors
export const selectFilters = (state: RootState) => state.filter;

export const selectSearchQuery = (state: RootState) => state.filter.searchQuery;

export const selectSelectedCategories = (state: RootState) =>
  state.filter.categories;

export const selectSelectedBrands = (state: RootState) => state.filter.brands;

export const selectPriceRange = (state: RootState) => state.filter.priceRange;

export const selectRating = (state: RootState) => state.filter.rating;

export const selectSortBy = (state: RootState) => state.filter.sortBy;

export const selectActiveFiltersCount = (state: RootState) => {
  let count = 0;
  if (state.filter.categories.length > 0) count++;
  if (state.filter.brands.length > 0) count++;
  if (
    state.filter.priceRange.min !== DEFAULT_PRICE_RANGE.min ||
    state.filter.priceRange.max !== DEFAULT_PRICE_RANGE.max
  )
    count++;
  if (state.filter.rating !== null) count++;
  return count;
};

// Helper function to filter products based on current filter state
export const filterProducts = (
  products: Product[],
  filters: FilterState
): Product[] => {
  let filtered = [...products];

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  // Filter by categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter((product) =>
      filters.categories.includes(product.category)
    );
  }

  // Filter by brands
  if (filters.brands.length > 0) {
    filtered = filtered.filter(
      (product) => product.brand && filters.brands.includes(product.brand)
    );
  }

  // Filter by price range
  filtered = filtered.filter(
    (product) =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
  );

  // Filter by rating
  if (filters.rating !== null) {
    filtered = filtered.filter((product) => product.rating >= filters.rating!);
  }

  // Sort products
  switch (filters.sortBy) {
    case 'price-low-high':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high-low':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // Assuming higher ID means newer (for demo purposes)
      filtered.sort((a, b) => b.id - a.id);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'relevance':
    default:
      // Keep original order for relevance
      break;
  }

  return filtered;
};

export default filterSlice.reducer;
