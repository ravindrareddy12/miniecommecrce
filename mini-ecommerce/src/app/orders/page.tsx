import type { Metadata } from 'next';
import { OrdersPageClient } from '@/components/orders/OrdersPageClient';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View and track your orders',
};

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <OrdersPageClient />
      </div>
    </main>
  );
}
