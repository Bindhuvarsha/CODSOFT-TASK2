'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Calendar, 
  ChefHat, 
  LayoutDashboard, 
  Clock, 
  Menu, 
  X,
  Compass,
  Flame
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { formatPrice } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();
  const { activeOrderCount } = useRestaurant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/menu', label: 'Digital Menu', icon: UtensilsCrossed },
    { href: '/reservations', label: 'Reserve Table', icon: Calendar },
    { href: '/orders', label: 'Track Order', icon: Compass },
    { 
      href: '/kitchen', 
      label: 'Kitchen KDS', 
      icon: ChefHat, 
      badge: activeOrderCount > 0 ? activeOrderCount : undefined,
      badgeColor: 'bg-amber-500'
    },
    { href: '/admin', label: 'Admin & Floor', icon: LayoutDashboard },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/10 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                  Dine<span className="text-brand-600">Desk</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 rounded">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Gourmet Dining & Operations
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'text-brand-600 bg-brand-50/80 dark:bg-brand-950/40 dark:text-brand-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-extrabold text-white rounded-full ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Cart Trigger & Quick CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 text-white font-semibold text-sm shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-5 h-5 bg-white text-brand-700 font-extrabold text-xs rounded-full flex items-center justify-center shadow">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Order Bag</span>
              {subtotal > 0 && (
                <span className="hidden lg:inline bg-white/20 px-2 py-0.5 rounded-lg text-xs font-bold">
                  {formatPrice(subtotal)}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 md:hidden"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold ${
                  active
                    ? 'text-brand-600 bg-brand-50 dark:bg-brand-950/40'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${link.badgeColor}`}>
                    {link.badge} active
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
