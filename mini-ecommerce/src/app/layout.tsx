import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/store/provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mini-ecommerce.vercel.app'),
  title: {
    default: 'Mini E-Commerce | Shop the Best Products Online',
    template: '%s | Mini E-Commerce',
  },
  description:
    'Discover amazing products at great prices. Shop electronics, fashion, home goods and more with fast shipping and easy returns.',
  keywords: ['ecommerce', 'shopping', 'online store', 'products', 'deals'],
  authors: [{ name: 'Mini E-Commerce' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Mini E-Commerce',
    title: 'Mini E-Commerce | Shop the Best Products Online',
    description: 'Discover amazing products at great prices.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini E-Commerce',
    description: 'Discover amazing products at great prices.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
