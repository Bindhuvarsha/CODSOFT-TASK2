'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UtensilsCrossed, 
  Flame, 
  Sparkles, 
  Star, 
  Clock, 
  Plus, 
  Filter, 
  Check, 
  X,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { useRestaurant } from '@/context/RestaurantContext';
import { useCart } from '@/context/CartContext';
import { MenuItem, DietaryType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import MenuItemModal from '@/components/MenuItemModal';

const CATEGORIES = [
  'All',
  'Starters',
  'Artisan Pizzas',
  'Signature Mains',
  'Burgers & Sandwiches',
  'Pasta & Bowls',
  'Desserts',
  'Beverages & Mocktails',
];

export default function MenuPage() {
  const { menu, isLoading } = useRestaurant();
  const { orderType, setOrderType, tableNumber, setTableNumber, setIsCartOpen, totalItemsCount } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary match
      if (dietaryFilter === 'veg' && item.dietary !== 'veg' && item.dietary !== 'vegan') {
        return false;
      }
      if (dietaryFilter === 'vegan' && item.dietary !== 'vegan') {
        return false;
      }
      if (dietaryFilter === 'gluten-free' && item.dietary !== 'gluten-free') {
        return false;
      }
      if (dietaryFilter === 'chef' && !item.isChefSpecial) {
        return false;
      }
      if (dietaryFilter === 'bestseller' && !item.isBestSeller) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [menu, selectedCategory, dietaryFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Dining Mode Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600 mb-1">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Artisanal Seasonal Menu</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Digital Guest Menu
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Handcrafted with organic, locally sourced farm-to-table ingredients.
          </p>
        </div>

        {/* Dining Mode Selector Card */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              onClick={() => setOrderType('dine-in')}
              className={`px-3 py-1.5 rounded-lg transition ${
                orderType === 'dine-in'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🍽️ Dine-In ({tableNumber})
            </button>
            <button
              onClick={() => setOrderType('takeaway')}
              className={`px-3 py-1.5 rounded-lg transition ${
                orderType === 'takeaway'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🛍️ Takeaway
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={`px-3 py-1.5 rounded-lg transition ${
                orderType === 'delivery'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🛵 Delivery
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag ({totalItemsCount})</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        
        {/* Search Input */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search truffle, wagyu, seafood, pasta, cocktails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-xs ${
                selectedCategory === category
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dietary / Feature Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>

          {[
            { id: 'all', label: 'All Dishes' },
            { id: 'veg', label: '🌱 Vegetarian' },
            { id: 'vegan', label: '🌿 100% Vegan' },
            { id: 'gluten-free', label: '🌾 Gluten-Free' },
            { id: 'chef', label: '★ Chef Special' },
            { id: 'bestseller', label: '🔥 Best Sellers' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setDietaryFilter(chip.id)}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                dietaryFilter === chip.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

      </div>

      {/* Dishes Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{filteredItems.length}</strong> delicious dishes
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-brand-600 hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
            No matching dishes found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or clearing the dietary filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setDietaryFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-card hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.isChefSpecial && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow">
                        ★ Chef Pick
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-600 text-white shadow">
                        Best Seller
                      </span>
                    )}
                    {item.dietary === 'veg' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow">
                        🌱 Veg
                      </span>
                    )}
                    {item.dietary === 'vegan' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-700 text-white shadow">
                        🌿 Vegan
                      </span>
                    )}
                    {item.dietary === 'gluten-free' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white shadow">
                        🌾 Gluten-Free
                      </span>
                    )}
                    {item.spiceLevel > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow">
                        <Flame className="w-3 h-3 fill-current" />
                        {item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Med' : 'Hot'}
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-white font-black text-base shadow">
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{item.prepTimeMinutes} mins
                    </span>
                    {item.calories && (
                      <span>🔥 {item.calories} kcal</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {item.rating || 4.9}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {item.optionGroups && item.optionGroups.length > 0 ? 'Customizable' : 'Standard Recipe'}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-600/20 group-hover:bg-brand-500 group-hover:scale-105 transition"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add to Bag</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Dish Customizer Modal */}
      <MenuItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

    </div>
  );
}
