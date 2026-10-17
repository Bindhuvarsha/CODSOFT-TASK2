'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UtensilsCrossed, 
  Calendar, 
  ChefHat, 
  LayoutDashboard, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Clock, 
  Star, 
  Smartphone, 
  Users,
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useRestaurant } from '@/context/RestaurantContext';
import { formatPrice } from '@/lib/utils';
import MenuItemModal from '@/components/MenuItemModal';
import { MenuItem } from '@/lib/types';

export default function HomePage() {
  const { menu, orders, tables } = useRestaurant();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const chefSpecials = menu.filter((item) => item.isChefSpecial || item.isBestSeller).slice(0, 4);

  const activeTablesCount = tables.filter((t) => t.status === 'occupied').length;

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/60 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -z-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-850 shadow-xs">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Modern Gastronomy & Operational Excellence</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-950 dark:text-white leading-[1.1] tracking-tight">
                Where Culinary Art Meets <span className="bg-gradient-to-r from-brand-600 to-amber-500 bg-clip-text text-transparent">Digital Precision</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Welcome to <strong>DineDesk</strong> — a unified restaurant ordering and table management ecosystem connecting gourmet diners, expediting kitchen lines, and operational floor management in real time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 text-white font-bold text-base shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span>Explore Digital Menu</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/reservations"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-base border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Calendar className="w-5 h-5 text-brand-600" />
                  <span>Reserve Table</span>
                </Link>

                <Link
                  href="/kitchen"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-sm border border-amber-300/40 hover:bg-amber-500/20 transition-all"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Kitchen KDS</span>
                </Link>
              </div>

              {/* Micro Perks */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dine-In, Pickup & Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant Order Status Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PostgreSQL Powered</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                  alt="Fine Dining Atmosphere"
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Floating Live Card: Active Orders */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-white/40 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Live Kitchen Queue</p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {orders.length} Active Orders Today
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Online
                  </span>
                </div>

                {/* Top Badge: Rated 4.9 */}
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4.9 (1,240+ Verified Reviews)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Operational Metrics Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menu Dishes</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{menu.length} Items</p>
              <p className="text-[11px] text-emerald-600 font-semibold">100% In-Stock & Ready</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Table Floor</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{activeTablesCount} / {tables.length}</p>
              <p className="text-[11px] text-amber-600 font-semibold">Live Occupancy</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Prep Time</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">16 Mins</p>
              <p className="text-[11px] text-blue-600 font-semibold">KDS Optimized</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diner Rating</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">4.9 / 5.0</p>
              <p className="text-[11px] text-emerald-600 font-semibold">Michelin Recommended</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Portals Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800">
            Platform Roles & Architecture
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            A Complete 360° Restaurant Operating System
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Bridging the gap between fine-dining guests, active kitchen lines, and front-of-house restaurant managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Guest Ordering */}
          <Link
            href="/menu"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Digital Guest Menu
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse artisanal dishes with dietary tags, spice meters, dish customizers, live bill split calculator, and promo coupon discounts.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Reservations */}
          <Link
            href="/reservations"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Table Reservations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Select your preferred dining zone (Rooftop, Patio, Indoor, VIP), party size, and celebration requests with instant confirmation codes.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>Book Table</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Kitchen Display */}
          <Link
            href="/kitchen"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Kitchen Display (KDS)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dedicated line cook kanban display with audio alerts, live color-coded prep timers, item checklist strikes, and one-click ticket progression.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
              <span>Launch Kitchen</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Floor & Admin */}
          <Link
            href="/admin"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Admin & Floor Map
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time visual table layout across 4 dining zones, daily revenue analytics, menu CRUD manager, and order history reporting.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform">
              <span>Manager Console</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

        </div>
      </section>

      {/* Chef's Tasting Specials Carousel / Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Handcrafted Culinary Creations
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-1">
              Chef’s Tasting Highlights
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View Full Menu ({menu.length} dishes)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chefSpecials.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-card hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {item.isChefSpecial && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow">
                      ★ Chef's Pick
                    </span>
                  )}
                  {item.isBestSeller && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-600 text-white shadow">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-white font-extrabold text-sm">
                  {formatPrice(item.price)}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">⏱️ ~{item.prepTimeMinutes} mins</span>
                  <span className="font-bold text-brand-600 group-hover:underline">
                    Customize & Add +
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DineDesk Experience Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              Effortless Dining Experience
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
              Ready to experience modern culinary technology?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Scan from your table, customize each recipe to your taste preferences, track live kitchen prep in real time, or reserve the best patio seats in town.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/reservations"
                className="px-6 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-lg hover:bg-brand-500 transition"
              >
                Book a Table Now
              </Link>
              <Link
                href="/orders"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
              >
                Track An Active Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dish Customizer Modal */}
      <MenuItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

    </div>
  );
}
