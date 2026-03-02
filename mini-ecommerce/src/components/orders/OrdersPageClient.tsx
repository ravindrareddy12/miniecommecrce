'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ChevronRight,
  ShoppingBag,
  Filter
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectAllOrders } from '@/features/ordersSlice';
import { formatCurrency, cn } from '@/utils';
import type { Order, OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Confirmed' },
  processing: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Cancelled' },
};

const filterOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

function OrderCard({ order }: { order: Order }) {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;
  const firstItem = order.items[0];
  const remainingCount = order.items.length - 1;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md sm:p-6"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-mono text-sm font-medium text-gray-900">{order.id}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className={cn('flex items-center gap-1.5 rounded-full px-3 py-1', config.bgColor)}>
          <StatusIcon className={cn('h-4 w-4', config.color)} />
          <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {firstItem && (
            <Image
              src={firstItem.product.thumbnail}
              alt={firstItem.product.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {firstItem?.product.title}
          </p>
          <p className="text-sm text-gray-500">
            Qty: {firstItem?.quantity}
            {remainingCount > 0 && ` • +${remainingCount} more item${remainingCount > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
        </div>
        <div className="flex items-center text-sm font-medium text-primary-600">
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export function OrdersPageClient() {
  const orders = useAppSelector(selectAllOrders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">No orders yet</h2>
        <p className="mb-6 text-gray-600">
          When you place an order, it will appear here.
        </p>
        <Link href="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Orders</h1>
          <p className="mt-1 text-gray-600">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">No orders match the selected filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
