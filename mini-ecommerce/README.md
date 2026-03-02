# Mini E-Commerce Frontend

A production-quality mini e-commerce frontend built with Next.js 14+, TypeScript, Tailwind CSS, and Redux Toolkit.

🌐 **Live Demo:** [https://ecommerce.mypgmanager.com/](https://ecommerce.mypgmanager.com/)

![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.2-764ABC?style=flat-square&logo=redux)

## 🚀 Features

### Pages
- **Home Page** - Hero carousel, featured categories, trending products
- **Product Listing Page (PLP)** - Filterable, sortable product grid with pagination
- **Product Detail Page (PDP)** - Image gallery, variant selection, add to cart
- **Cart Page** - Full cart management with promo codes
- **Checkout Modal** - Form validation and success state

### Key Features
- ✅ Mobile-first responsive design
- ✅ Redux Toolkit state management
- ✅ LocalStorage persistence for cart & wishlist
- ✅ Product filtering (category, brand, price, rating)
- ✅ Product sorting (relevance, price, newest, rating)
- ✅ Debounced search functionality
- ✅ Image zoom on product detail
- ✅ Variant selection (color/size simulation)
- ✅ Promo code system (SAVE10, FLAT20, WELCOME15)
- ✅ Price breakdown with tax calculation
- ✅ Skeleton loaders for products
- ✅ Error boundaries and 404 pages
- ✅ SEO-friendly with metadata
- ✅ Accessibility considerations (ARIA labels, keyboard navigation)

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety and better DX |
| **Tailwind CSS** | Utility-first styling |
| **Redux Toolkit** | Global state management |
| **Lucide React** | Icon library |
| **clsx + tailwind-merge** | Conditional class handling |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── cart/              # Cart page
│   ├── products/          # Product listing & detail pages
│   │   └── [id]/          # Dynamic product page
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── error.tsx          # Error boundary
│   ├── loading.tsx        # Loading state
│   └── not-found.tsx      # 404 page
│
├── components/            # React components
│   ├── cart/              # Cart-related components
│   │   ├── CartItem.tsx
│   │   ├── CartPageClient.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── MobileCheckoutBar.tsx
│   │   ├── OrderSummary.tsx
│   │   └── PromoCodeInput.tsx
│   │
│   ├── home/              # Home page components
│   │   ├── FeaturedCategories.tsx
│   │   ├── HeroCarousel.tsx
│   │   └── TrendingProducts.tsx
│   │
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── product/           # Product components
│   │   ├── FilterDrawer.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── Pagination.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardSkeleton.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductListingClient.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── SimilarProducts.tsx
│   │   ├── SortDropdown.tsx
│   │   └── VariantSelector.tsx
│   │
│   └── ui/                # Reusable UI components
│       └── SearchBar.tsx
│
├── features/              # Redux slices
│   ├── cartSlice.ts       # Cart state management
│   ├── filterSlice.ts     # Filter state management
│   └── wishlistSlice.ts   # Wishlist state management
│
├── hooks/                 # Custom React hooks
│   ├── index.ts           # Utility hooks (useDebounce, useMediaQuery, etc.)
│   ├── useCart.ts         # Cart operations hook
│   ├── useFilters.ts      # Filter operations hook
│   └── useWishlist.ts     # Wishlist operations hook
│
├── lib/                   # Library code
│   ├── api.ts             # API functions
│   └── constants.ts       # App constants
│
├── store/                 # Redux store
│   ├── hooks.ts           # Typed Redux hooks
│   ├── index.ts           # Store configuration
│   └── provider.tsx       # Redux provider with hydration
│
├── types/                 # TypeScript types
│   └── index.ts           # All type definitions
│
└── utils/                 # Utility functions
    └── index.ts           # Helper functions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎯 State Management

### Architecture Decision

I chose **Redux Toolkit** for state management because:

1. **Predictable state updates** - Single source of truth for cart, wishlist, and filters
2. **DevTools integration** - Easy debugging with Redux DevTools
3. **Built-in best practices** - createSlice reduces boilerplate significantly
4. **TypeScript support** - First-class TypeScript integration
5. **Persistence** - Easy to sync with localStorage

### Store Structure

```typescript
{
  cart: {
    items: CartItem[],
    promoCode: string | null,
    promoDiscount: number,
    isPromoApplied: boolean,
    promoError: string | null
  },
  wishlist: {
    items: WishlistItem[]
  },
  filter: {
    categories: string[],
    brands: string[],
    priceRange: { min: number, max: number },
    rating: number | null,
    sortBy: SortOption,
    searchQuery: string
  }
}
```

### Persistence Strategy

Cart and wishlist state is persisted to localStorage:
- **Hydration**: On app load, state is hydrated from localStorage
- **Sync**: Every state change automatically syncs to localStorage
- **SSR Safe**: Hydration only occurs on client-side

## 🏗️ Architecture Reasoning

### Why Next.js App Router?
- Server Components for better performance
- Built-in routing with loading/error states
- SEO-friendly with metadata API
- Streaming and concurrent rendering

### Component Architecture
- **Smart/Container components** handle state and logic
- **Presentational components** are pure and reusable
- **Memoization** with `memo()` prevents unnecessary re-renders
- **Custom hooks** encapsulate complex logic

### Styling Approach
- **Tailwind CSS** for rapid development
- **Mobile-first** responsive design
- **Custom utilities** in globals.css for common patterns
- **cn()** utility for conditional classes

## 🧪 Promo Codes

Test the promo code functionality with these codes:

| Code | Type | Value | Min Purchase |
|------|------|-------|--------------|
| SAVE10 | Percentage | 10% | $50 |
| FLAT20 | Fixed | $20 | $100 |
| WELCOME15 | Percentage | 15% (max $50) | - |

## 🔮 Future Improvements

1. **Testing**
   - Unit tests with Jest
   - Integration tests with React Testing Library
   - E2E tests with Playwright

2. **Performance**
   - Image optimization with blur placeholders
   - Route prefetching
   - Bundle size optimization

3. **Features**
   - User authentication
   - Order history
   - Product reviews
   - Advanced search with Algolia
   - Real payment integration (Stripe)

4. **Infrastructure**
   - Error monitoring (Sentry)
   - Analytics (Google Analytics)
   - CI/CD pipeline
   - Docker containerization

## 📦 API Reference

This project uses [DummyJSON](https://dummyjson.com/) for product data:

- `GET /products` - List all products
- `GET /products/{id}` - Get single product
- `GET /products/categories` - List all categories
- `GET /products/search?q={query}` - Search products
- `GET /products/category/{category}` - Products by category

## 📄 License

This project is for demonstration purposes.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
