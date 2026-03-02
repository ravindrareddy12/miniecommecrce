// API Configuration
export const API_BASE_URL = 'https://dummyjson.com';

// Pagination
export const PRODUCTS_PER_PAGE = 12;

// Price Range
export const DEFAULT_PRICE_RANGE = {
  min: 0,
  max: 2000,
};

// Available sizes for variant simulation
export const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

// Available colors for variant simulation
export const AVAILABLE_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Gray', value: '#6b7280' },
] as const;

// Tax rate
export const TAX_RATE = 0.08;

// Promo codes (mock data)
export const PROMO_CODES = {
  SAVE10: {
    code: 'SAVE10',
    discountType: 'percentage' as const,
    discountValue: 10,
    minPurchase: 50,
  },
  FLAT20: {
    code: 'FLAT20',
    discountType: 'fixed' as const,
    discountValue: 20,
    minPurchase: 100,
  },
  WELCOME15: {
    code: 'WELCOME15',
    discountType: 'percentage' as const,
    discountValue: 15,
    minPurchase: 0,
    maxDiscount: 50,
  },
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  CART: 'mini-ecommerce-cart',
  WISHLIST: 'mini-ecommerce-wishlist',
  ORDERS: 'mini-ecommerce-orders',
  RECENT_SEARCHES: 'mini-ecommerce-recent-searches',
} as const;

// Sort Options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

// Rating filter options
export const RATING_OPTIONS = [
  { value: 4, label: '4★ & above' },
  { value: 3, label: '3★ & above' },
  { value: 2, label: '2★ & above' },
  { value: 1, label: '1★ & above' },
] as const;

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
  { href: '/orders', label: 'Orders' },
] as const;

// Featured Categories (for home page)
export const FEATURED_CATEGORIES = [
  {
    name: 'Smartphones',
    slug: 'smartphones',
    image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%205s/1.png',
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png',
  },
  {
    name: 'Fragrances',
    slug: 'fragrances',
    image: 'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/1.png',
  },
  {
    name: 'Skincare',
    slug: 'skincare',
    image: 'https://cdn.dummyjson.com/products/images/skin-care/Essence%20Mascara%20Lash%20Princess/1.png',
  },
  {
    name: 'Groceries',
    slug: 'groceries',
    image: 'https://cdn.dummyjson.com/products/images/groceries/Apple/1.png',
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    image: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/1.png',
  },
] as const;

// Hero Slides
export const HERO_SLIDES = [
  {
    id: 1,
    title: 'Summer Collection 2026',
    subtitle: 'Up to 50% off on selected items',
    cta: 'Shop Now',
    href: '/products',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80',
    overlay: 'from-blue-900/70 to-purple-900/70',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Check out the latest trends',
    cta: 'Explore',
    href: '/products?sort=newest',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    overlay: 'from-pink-900/70 to-orange-900/70',
  },
  {
    id: 3,
    title: 'Tech Deals',
    subtitle: 'Best prices on electronics',
    cta: 'View Deals',
    href: '/products?category=smartphones',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920&q=80',
    overlay: 'from-green-900/70 to-teal-900/70',
  },
] as const;
