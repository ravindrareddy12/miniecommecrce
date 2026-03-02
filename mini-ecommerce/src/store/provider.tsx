'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect } from 'react';
import { hydrateCart } from '@/features/cartSlice';
import { hydrateWishlist } from '@/features/wishlistSlice';
import { hydrateOrders } from '@/features/ordersSlice';
import { STORAGE_KEYS } from '@/lib/constants';

function StoreHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate cart from localStorage
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        store.dispatch(hydrateCart(cartData));
      } catch (error) {
        console.error('Failed to hydrate cart:', error);
      }
    }

    // Hydrate wishlist from localStorage
    const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        store.dispatch(hydrateWishlist(wishlistData));
      } catch (error) {
        console.error('Failed to hydrate wishlist:', error);
      }
    }

    // Hydrate orders from localStorage
    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (savedOrders) {
      try {
        const ordersData = JSON.parse(savedOrders);
        store.dispatch(hydrateOrders(ordersData));
      } catch (error) {
        console.error('Failed to hydrate orders:', error);
      }
    }
  }, []);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreHydrator>{children}</StoreHydrator>
    </Provider>
  );
}
