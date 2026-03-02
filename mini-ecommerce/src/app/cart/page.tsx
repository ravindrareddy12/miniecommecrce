import type { Metadata } from 'next';
import { CartPageClient } from '@/components/cart/CartPageClient';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your shopping cart and proceed to checkout.',
};

export default function CartPage() {
  return <CartPageClient />;
}
