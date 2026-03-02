import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { CartItem, Product } from '@/types';
import { TAX_RATE, PROMO_CODES, STORAGE_KEYS } from '@/lib/constants';

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
  isPromoApplied: boolean;
  promoError: string | null;
}

const initialState: CartState = {
  items: [],
  promoCode: null,
  promoDiscount: 0,
  isPromoApplied: false,
  promoError: null,
};

// Helper function to persist cart to localStorage
const persistCart = (state: CartState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state));
  }
};

// Helper function to calculate item price with discount
const getItemPrice = (product: Product): number => {
  return product.price * (1 - product.discountPercentage / 100);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Hydrate cart from localStorage
    hydrateCart: (state, action: PayloadAction<CartState>) => {
      return { ...state, ...action.payload };
    },

    // Add item to cart
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        selectedColor?: string;
        selectedSize?: string;
      }>
    ) => {
      const { product, quantity = 1, selectedColor, selectedSize } = action.payload;
      
      // Check if item already exists in cart (same product + same variants)
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          product,
          quantity,
          selectedColor,
          selectedSize,
        });
      }

      // Reset promo if cart changes
      state.promoCode = null;
      state.promoDiscount = 0;
      state.isPromoApplied = false;
      state.promoError = null;

      persistCart(state);
    },

    // Remove item from cart
    removeFromCart: (
      state,
      action: PayloadAction<{
        productId: number;
        selectedColor?: string;
        selectedSize?: string;
      }>
    ) => {
      const { productId, selectedColor, selectedSize } = action.payload;
      
      state.items = state.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      );

      // Reset promo if cart changes
      state.promoCode = null;
      state.promoDiscount = 0;
      state.isPromoApplied = false;
      state.promoError = null;

      persistCart(state);
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: number;
        quantity: number;
        selectedColor?: string;
        selectedSize?: string;
      }>
    ) => {
      const { productId, quantity, selectedColor, selectedSize } = action.payload;
      
      const itemIndex = state.items.findIndex(
        (item) =>
          item.product.id === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
      }

      // Reset promo if cart changes
      state.promoCode = null;
      state.promoDiscount = 0;
      state.isPromoApplied = false;
      state.promoError = null;

      persistCart(state);
    },

    // Apply promo code
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.toUpperCase();
      const promo = PROMO_CODES[code as keyof typeof PROMO_CODES];

      if (!promo) {
        state.promoError = 'Invalid promo code';
        state.isPromoApplied = false;
        state.promoDiscount = 0;
        return;
      }

      // Calculate subtotal
      const subtotal = state.items.reduce(
        (total, item) => total + getItemPrice(item.product) * item.quantity,
        0
      );

      // Check minimum purchase requirement
      if (promo.minPurchase && subtotal < promo.minPurchase) {
        state.promoError = `Minimum purchase of $${promo.minPurchase} required`;
        state.isPromoApplied = false;
        state.promoDiscount = 0;
        return;
      }

      // Calculate discount
      let discount = 0;
      if (promo.discountType === 'percentage') {
        discount = subtotal * (promo.discountValue / 100);
        // Apply max discount cap if specified
        if ('maxDiscount' in promo && promo.maxDiscount) {
          discount = Math.min(discount, promo.maxDiscount);
        }
      } else {
        discount = promo.discountValue;
      }

      state.promoCode = code;
      state.promoDiscount = discount;
      state.isPromoApplied = true;
      state.promoError = null;

      persistCart(state);
    },

    // Remove promo code
    removePromoCode: (state) => {
      state.promoCode = null;
      state.promoDiscount = 0;
      state.isPromoApplied = false;
      state.promoError = null;

      persistCart(state);
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.promoDiscount = 0;
      state.isPromoApplied = false;
      state.promoError = null;

      persistCart(state);
    },
  },
});

// Export actions
export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyPromoCode,
  removePromoCode,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

export const selectCartDiscount = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) =>
      total +
      item.product.price *
        (item.product.discountPercentage / 100) *
        item.quantity,
    0
  );

export const selectCartSubtotalAfterDiscount = (state: RootState) => {
  const subtotal = selectCartSubtotal(state);
  const discount = selectCartDiscount(state);
  return subtotal - discount;
};

export const selectPromoDiscount = (state: RootState) => state.cart.promoDiscount;

export const selectCartTax = (state: RootState) => {
  const subtotalAfterDiscount = selectCartSubtotalAfterDiscount(state);
  const promoDiscount = selectPromoDiscount(state);
  return (subtotalAfterDiscount - promoDiscount) * TAX_RATE;
};

export const selectCartTotal = (state: RootState) => {
  const subtotalAfterDiscount = selectCartSubtotalAfterDiscount(state);
  const promoDiscount = selectPromoDiscount(state);
  const tax = selectCartTax(state);
  return subtotalAfterDiscount - promoDiscount + tax;
};

export const selectPromoCode = (state: RootState) => state.cart.promoCode;
export const selectIsPromoApplied = (state: RootState) => state.cart.isPromoApplied;
export const selectPromoError = (state: RootState) => state.cart.promoError;

export const selectIsInCart = (productId: number) => (state: RootState) =>
  state.cart.items.some((item) => item.product.id === productId);

export default cartSlice.reducer;
