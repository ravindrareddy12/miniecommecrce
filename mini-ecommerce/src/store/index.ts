import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/features/cartSlice';
import wishlistReducer from '@/features/wishlistSlice';
import filterReducer from '@/features/filterSlice';
import ordersReducer from '@/features/ordersSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    filter: filterReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable check for specific action types if needed
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
