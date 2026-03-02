import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Product, WishlistItem } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

// Helper function to persist wishlist to localStorage
const persistWishlist = (state: WishlistState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state));
  }
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Hydrate wishlist from localStorage
    hydrateWishlist: (state, action: PayloadAction<WishlistState>) => {
      return { ...state, ...action.payload };
    },

    // Add item to wishlist
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      
      // Check if item already exists
      const exists = state.items.some((item) => item.product.id === product.id);
      
      if (!exists) {
        state.items.push({
          product,
          addedAt: new Date().toISOString(),
        });
        persistWishlist(state);
      }
    },

    // Remove item from wishlist
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);
      persistWishlist(state);
    },

    // Toggle wishlist item (add/remove)
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        // Remove if exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add if doesn't exist
        state.items.push({
          product,
          addedAt: new Date().toISOString(),
        });
      }
      persistWishlist(state);
    },

    // Clear wishlist
    clearWishlist: (state) => {
      state.items = [];
      persistWishlist(state);
    },
  },
});

// Export actions
export const {
  hydrateWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;

export const selectWishlistCount = (state: RootState) => state.wishlist.items.length;

export const selectIsInWishlist = (productId: number) => (state: RootState) =>
  state.wishlist.items.some((item) => item.product.id === productId);

export const selectWishlistProducts = createSelector(
  [selectWishlistItems],
  (items) => items.map((item) => item.product)
);

export default wishlistSlice.reducer;
