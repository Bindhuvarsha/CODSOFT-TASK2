import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { RestaurantProvider } from '@/context/RestaurantContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DineDesk | Restaurant Ordering & Table Management System',
  description:
    'A complete restaurant ordering and table management system supporting online orders, reservations, digital menus, payments, and kitchen operations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <RestaurantProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <CartDrawer />
            <Footer />
          </CartProvider>
        </RestaurantProvider>
      </body>
    </html>
  );
}
