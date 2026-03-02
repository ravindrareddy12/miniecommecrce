import type { Metadata } from 'next';
import { ProductListingClient } from '@/components/product/ProductListingClient';
import { getProducts, getCategories } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our collection of amazing products at great prices.',
};

export default async function ProductsPage() {
  // Fetch initial data server-side for SEO
  const [productsData, categories] = await Promise.all([
    getProducts(100, 0),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductListingClient
        initialProducts={productsData.products}
        categories={categories}
        totalProducts={productsData.total}
      />
    </div>
  );
}
