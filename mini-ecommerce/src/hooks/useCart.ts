import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
  selectCartItems,
  selectCartItemsCount,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartSubtotalAfterDiscount,
  selectCartTax,
  selectCartTotal,
  selectPromoCode,
  selectPromoDiscount,
  selectIsPromoApplied,
  selectPromoError,
  selectIsInCart,
} from '@/features/cartSlice';
import type { Product } from '@/types';

/**
 * Custom hook for managing cart operations
 * Provides all cart-related actions and selectors
 */
export function useCart() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const items = useAppSelector(selectCartItems);
  const itemsCount = useAppSelector(selectCartItemsCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscount);
  const subtotalAfterDiscount = useAppSelector(selectCartSubtotalAfterDiscount);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const promoCode = useAppSelector(selectPromoCode);
  const promoDiscount = useAppSelector(selectPromoDiscount);
  const isPromoApplied = useAppSelector(selectIsPromoApplied);
  const promoError = useAppSelector(selectPromoError);

  // Actions
  const addItem = useCallback(
    (
      product: Product,
      quantity: number = 1,
      selectedColor?: string,
      selectedSize?: string
    ) => {
      dispatch(addToCart({ product, quantity, selectedColor, selectedSize }));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId: number, selectedColor?: string, selectedSize?: string) => {
      dispatch(removeFromCart({ productId, selectedColor, selectedSize }));
    },
    [dispatch]
  );

  const updateItemQuantity = useCallback(
    (
      productId: number,
      quantity: number,
      selectedColor?: string,
      selectedSize?: string
    ) => {
      dispatch(updateQuantity({ productId, quantity, selectedColor, selectedSize }));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const applyPromo = useCallback(
    (code: string) => {
      dispatch(applyPromoCode(code));
    },
    [dispatch]
  );

  const removePromo = useCallback(() => {
    dispatch(removePromoCode());
  }, [dispatch]);

  const isInCart = useCallback(
    (productId: number) => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  return {
    // State
    items,
    itemsCount,
    subtotal,
    discount,
    subtotalAfterDiscount,
    tax,
    total,
    promoCode,
    promoDiscount,
    isPromoApplied,
    promoError,
    isEmpty: items.length === 0,
    
    // Actions
    addItem,
    removeItem,
    updateItemQuantity,
    clear,
    applyPromo,
    removePromo,
    isInCart,
  };
}
