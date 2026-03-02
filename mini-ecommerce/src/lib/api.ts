import { API_BASE_URL } from './constants';
import { Product, ProductsResponse, Category } from '@/types';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all products with pagination
 */
export async function getProducts(
  limit: number = 30,
  skip: number = 0
): Promise<ProductsResponse> {
  return fetchApi<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: number): Promise<Product> {
  return fetchApi<Product>(`/products/${id}`);
}

/**
 * Search products by query
 */
export async function searchProducts(query: string): Promise<ProductsResponse> {
  return fetchApi<ProductsResponse>(`/products/search?q=${encodeURIComponent(query)}`);
}

/**
 * Fetch all product categories
 */
export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>('/products/categories');
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(
  category: string,
  limit: number = 30,
  skip: number = 0
): Promise<ProductsResponse> {
  return fetchApi<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  );
}

/**
 * Fetch products sorted by a field
 */
export async function getProductsSorted(
  sortBy: string = 'title',
  order: 'asc' | 'desc' = 'asc',
  limit: number = 30,
  skip: number = 0
): Promise<ProductsResponse> {
  return fetchApi<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`
  );
}

/**
 * Fetch all products (for client-side filtering)
 * Fetches in batches to get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  const firstBatch = await getProducts(100, 0);
  const allProducts = [...firstBatch.products];
  
  // If there are more products, fetch them
  if (firstBatch.total > 100) {
    const remainingBatches = Math.ceil((firstBatch.total - 100) / 100);
    for (let i = 1; i <= remainingBatches; i++) {
      const batch = await getProducts(100, i * 100);
      allProducts.push(...batch.products);
    }
  }
  
  return allProducts;
}

/**
 * Extract unique brands from products
 */
export function extractBrands(products: Product[]): string[] {
  const brands = new Set<string>();
  products.forEach((product) => {
    if (product.brand) {
      brands.add(product.brand);
    }
  });
  return Array.from(brands).sort();
}

/**
 * Extract unique categories from products
 */
export function extractCategories(products: Product[]): string[] {
  const categories = new Set<string>();
  products.forEach((product) => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Get price range from products
 */
export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 0, max: 1000 };
  }
  
  const prices = products.map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}
