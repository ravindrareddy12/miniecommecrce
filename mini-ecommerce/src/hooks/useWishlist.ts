import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist,
  selectWishlistProducts,
} from '@/features/wishlistSlice';
import type { Product } from '@/types';

/**
 * Custom hook for managing wishlist operations
 * Provides all wishlist-related actions and selectors
 */
export function useWishlist() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);
  const products = useAppSelector(selectWishlistProducts);

  // Actions
  const add = useCallback(
    (product: Product) => {
      dispatch(addToWishlist(product));
    },
    [dispatch]
  );

  const remove = useCallback(
    (productId: number) => {
      dispatch(removeFromWishlist(productId));
    },
    [dispatch]
  );

  const toggle = useCallback(
    (product: Product) => {
      dispatch(toggleWishlist(product));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearWishlist());
  }, [dispatch]);

  const isInWishlist = useCallback(
    (productId: number) => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  return {
    // State
    items,
    count,
    products,
    isEmpty: items.length === 0,
    
    // Actions
    add,
    remove,
    toggle,
    clear,
    isInWishlist,
  };
}
