import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/api';
import { ProductDetail } from '@/components/product/ProductDetail';
import { SimilarProducts } from '@/components/product/SimilarProducts';

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductById(Number(params.id));
    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: [{ url: product.thumbnail }],
      },
    };
  } catch {
    return {
      title: 'Product Not Found',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    notFound();
  }

  try {
    const [product, allProducts] = await Promise.all([
      getProductById(productId),
      getProducts(20, 0),
    ]);

    // Get similar products from the same category
    const similarProducts = allProducts.products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 8);

    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-8">
          <ProductDetail product={product} />

          {similarProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-8 text-2xl font-bold text-gray-900">
                You May Also Like
              </h2>
              <SimilarProducts products={similarProducts} />
            </section>
          )}
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
