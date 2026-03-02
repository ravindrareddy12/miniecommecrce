'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  Search,
  User,
  Package,
  ChevronDown,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectCartItemsCount } from '@/features/cartSlice';
import { selectWishlistCount } from '@/features/wishlistSlice';
import { selectOrdersCount } from '@/features/ordersSlice';
import { cn } from '@/utils';
import { NAV_LINKS } from '@/lib/constants';
import { SearchBar } from '@/components/ui/SearchBar';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const ordersCount = useAppSelector(selectOrdersCount);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-gray-200 bg-white shadow-sm'
          : 'bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80'
      )}
    >
      <div className="container-custom">
        <div className="flex h-14 items-center justify-between gap-4 sm:h-16">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-primary-600 sm:text-xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 sm:h-9 sm:w-9">
              <ShoppingCart className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <span className="hidden xs:inline sm:inline">MiniShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100',
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden flex-1 justify-center px-4 lg:flex lg:max-w-md xl:max-w-lg">
            <SearchBar className="w-full" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden',
                isSearchOpen
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                pathname === '/wishlist'
                  ? 'bg-red-50 text-red-500'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-red-500'
              )}
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className={cn('h-5 w-5', pathname === '/wishlist' && 'fill-current')} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                pathname === '/cart'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
              )}
              aria-label={`Cart (${cartItemsCount} items)`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </Link>

            {/* Orders */}
            <Link
              href="/orders"
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                pathname.startsWith('/orders')
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
              )}
              aria-label={`Orders (${ordersCount} orders)`}
            >
              <Package className="h-5 w-5" />
              {ordersCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {ordersCount > 9 ? '9+' : ordersCount}
                </span>
              )}
            </Link>

            {/* User - Hidden on smallest screens */}
            <button
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 sm:flex"
              aria-label="User account"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search - Expandable */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 lg:hidden',
            isSearchOpen ? 'max-h-20 border-t border-gray-100 py-3' : 'max-h-0'
          )}
        >
          <SearchBar onSearch={() => setIsSearchOpen(false)} />
        </div>
      </div>

      {/* Mobile Navigation - Slide Down */}
      <div
        className={cn(
          'absolute left-0 right-0 top-full overflow-hidden bg-white shadow-lg transition-all duration-300 md:hidden',
          isMobileMenuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
        )}
      >
        <nav className="container-custom py-2">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                )}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile-only: User Account Link */}
            <Link
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 sm:hidden"
            >
              <User className="h-4 w-4" />
              My Account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
