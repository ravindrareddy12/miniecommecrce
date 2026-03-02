// Product Types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  sku?: string;
  weight?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  promoCode?: string;
  promoDiscount?: number;
}

// Wishlist Types
export interface WishlistItem {
  product: Product;
  addedAt: string;
}

// Filter Types
export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number | null;
  sortBy: SortOption;
  searchQuery: string;
}

export type SortOption = 
  | 'relevance' 
  | 'price-low-high' 
  | 'price-high-low' 
  | 'newest' 
  | 'rating';

// Promo Code Types
export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt?: string;
}

// Checkout Types
export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CheckoutFormData;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
  promoCode?: string;
  trackingHistory?: TrackingEvent[];
}

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  message: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

// Category Types
export interface Category {
  slug: string;
  name: string;
  url: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// UI Types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
