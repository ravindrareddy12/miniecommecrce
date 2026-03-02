import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface TrendingProductsProps {
  products: Product[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
