import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Order, CartItem, CheckoutFormData, OrderStatus } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface OrdersState {
  orders: Order[];
  currentOrderId: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrderId: null,
};

// Helper function to persist orders to localStorage
const persistOrders = (state: OrdersState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(state.orders));
  }
};

// Generate unique order ID
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomPart}`.toUpperCase();
};

// Simulate order tracking updates
const getEstimatedDelivery = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 5); // 5 days from now
  return date.toISOString();
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    hydrateOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    createOrder: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        customer: CheckoutFormData;
        subtotal: number;
        discount: number;
        tax: number;
        total: number;
        promoCode?: string;
      }>
    ) => {
      const orderId = generateOrderId();
      const newOrder: Order = {
        id: orderId,
        items: action.payload.items,
        customer: action.payload.customer,
        subtotal: action.payload.subtotal,
        discount: action.payload.discount,
        tax: action.payload.tax,
        total: action.payload.total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        estimatedDelivery: getEstimatedDelivery(),
        promoCode: action.payload.promoCode,
        trackingHistory: [
          {
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            message: 'Order confirmed and payment received',
          },
        ],
      };
      state.orders.unshift(newOrder);
      state.currentOrderId = orderId;
      persistOrders(state);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus; message?: string }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        order.trackingHistory = order.trackingHistory || [];
        order.trackingHistory.push({
          status: action.payload.status,
          timestamp: new Date().toISOString(),
          message: action.payload.message || `Order ${action.payload.status}`,
        });
        persistOrders(state);
      }
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order && order.status !== 'delivered') {
        order.status = 'cancelled';
        order.trackingHistory = order.trackingHistory || [];
        order.trackingHistory.push({
          status: 'cancelled',
          timestamp: new Date().toISOString(),
          message: 'Order cancelled by customer',
        });
        persistOrders(state);
      }
    },
    setCurrentOrderId: (state, action: PayloadAction<string | null>) => {
      state.currentOrderId = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrderId = null;
    },
  },
});

// Export actions
export const {
  hydrateOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  setCurrentOrderId,
  clearCurrentOrder,
} = ordersSlice.actions;

// Selectors
export const selectAllOrders = (state: RootState) => state.orders.orders;

export const selectCurrentOrderId = (state: RootState) => state.orders.currentOrderId;

export const selectOrderById = (orderId: string) => (state: RootState) =>
  state.orders.orders.find((order) => order.id === orderId);

export const selectCurrentOrder = createSelector(
  [selectAllOrders, selectCurrentOrderId],
  (orders, currentOrderId) => orders.find((order) => order.id === currentOrderId)
);

export const selectOrdersCount = (state: RootState) => state.orders.orders.length;

export const selectRecentOrders = createSelector(
  [selectAllOrders],
  (orders) => orders.slice(0, 5)
);

export const selectOrdersByStatus = (status: OrderStatus) =>
  createSelector(
    [selectAllOrders],
    (orders) => orders.filter((order) => order.status === status)
  );

export default ordersSlice.reducer;
