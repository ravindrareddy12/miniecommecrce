'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  CreditCard,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectOrderById, cancelOrder } from '@/features/ordersSlice';
import { formatCurrency, cn } from '@/utils';
import type { OrderStatus, TrackingEvent } from '@/types';

interface OrderTrackingClientProps {
  orderId: string;
}

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; bgColor: string; borderColor: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-300', label: 'Confirmed' },
  processing: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-300', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-100', borderColor: 'border-indigo-300', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-300', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-300', label: 'Cancelled' },
};

const trackingSteps: { status: OrderStatus; label: string }[] = [
  { status: 'confirmed', label: 'Order Confirmed' },
  { status: 'processing', label: 'Processing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
];

function TrackingTimeline({ history, currentStatus }: { history: TrackingEvent[]; currentStatus: OrderStatus }) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-red-600" />
          <div>
            <p className="font-medium text-red-800">Order Cancelled</p>
            <p className="text-sm text-red-600">
              This order has been cancelled
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = trackingSteps.findIndex((step) => step.status === currentStatus);

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {trackingSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const config = statusConfig[step.status];
            const StepIcon = config.icon;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all sm:h-12 sm:w-12',
                    isCompleted
                      ? `${config.bgColor} ${config.borderColor}`
                      : 'border-gray-300 bg-gray-100'
                  )}
                >
                  <StepIcon
                    className={cn(
                      'h-5 w-5 sm:h-6 sm:w-6',
                      isCompleted ? config.color : 'text-gray-400'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium sm:text-sm',
                    isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress Line */}
        <div className="absolute left-0 top-5 -z-0 h-0.5 w-full bg-gray-200 sm:top-6">
          <div
            className="h-full bg-primary-600 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Timeline History */}
      {history && history.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
            Tracking History
          </h3>
          <div className="space-y-4">
            {history.map((event, index) => {
              const config = statusConfig[event.status];
              const EventIcon = config.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className={cn('rounded-full p-2', config.bgColor)}>
                    <EventIcon className={cn('h-4 w-4', config.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function OrderTrackingClient({ orderId }: OrderTrackingClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrderById(orderId));
  const [copied, setCopied] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
  };

  const handleCancelOrder = () => {
    dispatch(cancelOrder(orderId));
    setShowCancelConfirm(false);
  };

  if (!order) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <Package className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Order not found</h2>
        <p className="mb-6 text-gray-600">
          We couldn&apos;t find an order with ID: {orderId}
        </p>
        <Link href="/orders" className="btn-primary">
          View All Orders
        </Link>
      </div>
    );
  }

  const config = statusConfig[order.status];
  const canCancel = !['delivered', 'cancelled', 'shipped'].includes(order.status);

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/orders"
        className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Order {order.id}</h1>
              <button
                onClick={handleCopyOrderId}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Copy Order ID"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className={cn('flex items-center gap-2 rounded-full px-4 py-2', config.bgColor)}>
            <config.icon className={cn('h-5 w-5', config.color)} />
            <span className={cn('font-semibold', config.color)}>{config.label}</span>
          </div>
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700">
            <Truck className="h-5 w-5" />
            <span className="text-sm font-medium">
              Estimated Delivery:{' '}
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Tracking & Items */}
        <div className="space-y-8 lg:col-span-2">
          {/* Tracking Progress */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">Order Tracking</h2>
            <TrackingTimeline
              history={order.trackingHistory || []}
              currentStatus={order.status}
            />
          </div>

          {/* Order Items */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Items ({order.items.length})
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                      {item.selectedColor && item.selectedSize && ' • '}
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Customer Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Discount
                    {order.promoCode && (
                      <span className="ml-1 text-xs text-green-600">({order.promoCode})</span>
                    )}
                  </span>
                  <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(order.tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipping Address</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-0.5 text-gray-400" />
                <span className="text-gray-900">{order.customer.name}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                <div className="text-gray-600">
                  <p>{order.customer.address}</p>
                  <p>
                    {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                  </p>
                  <p>{order.customer.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{order.customer.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{order.customer.email}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/products"
              className="btn-primary w-full justify-center py-3"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            {canCancel && (
              <>
                {showCancelConfirm ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="mb-3 text-sm text-red-800">
                      Are you sure you want to cancel this order?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelOrder}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Yes, Cancel
                      </button>
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        No, Keep
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Cancel Order
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
