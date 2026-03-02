import type { Metadata } from 'next';
import { OrderTrackingClient } from '@/components/orders/OrderTrackingClient';

interface OrderTrackingPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: OrderTrackingPageProps): Promise<Metadata> {
  return {
    title: `Order ${params.id}`,
    description: `Track your order ${params.id}`,
  };
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <OrderTrackingClient orderId={params.id} />
      </div>
    </main>
  );
}
