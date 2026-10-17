'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { useRestaurant } from '@/context/RestaurantContext';
import { formatPrice, formatDateTime } from '@/lib/utils';
import TableLayoutGrid from '@/components/TableLayoutGrid';
import { MenuItem, DietaryType, Reservation } from '@/lib/types';

export default function AdminPage() {
  const { 
    menu, 
    orders, 
    tables, 
    reservations, 
    analytics, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    updateReservationStatus 
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'tables' | 'menu' | 'reservations' | 'financials'>('tables');
  
  // Menu Management State
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [isAddDishOpen, setIsAddDishOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New Dish Form
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishPrice, setDishPrice] = useState('18.00');
  const [dishCategory, setDishCategory] = useState<any>('Signature Mains');
  const [dishDietary, setDishDietary] = useState<DietaryType>('veg');
  const [dishSpice, setDishSpice] = useState<number>(0);
  const [dishPrepTime, setDishPrepTime] = useState('15');
  const [dishImage, setDishImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
  const [dishIsChefSpecial, setDishIsChefSpecial] = useState(false);
  const [dishIsBestSeller, setDishIsBestSeller] = useState(false);

  // Filtered menu
  const filteredMenu = menu.filter((item) => {
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateOrUpdateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateMenuItem(editingItem.id, {
        name: dishName,
        description: dishDescription,
        price: Number(dishPrice),
        category: dishCategory,
        dietary: dishDietary,
        spiceLevel: dishSpice as any,
        prepTimeMinutes: Number(dishPrepTime),
        image: dishImage,
        isChefSpecial: dishIsChefSpecial,
        isBestSeller: dishIsBestSeller,
      });
      setEditingItem(null);
    } else {
      await createMenuItem({
        name: dishName,
        description: dishDescription,
        price: Number(dishPrice),
        category: dishCategory,
        dietary: dishDietary,
        spiceLevel: dishSpice as any,
        prepTimeMinutes: Number(dishPrepTime),
        image: dishImage,
        isAvailable: true,
        isChefSpecial: dishIsChefSpecial,
        isBestSeller: dishIsBestSeller,
      });
    }

    setIsAddDishOpen(false);
    // Reset form
    setDishName('');
    setDishDescription('');
    setDishPrice('18.00');
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setDishName(item.name);
    setDishDescription(item.description);
    setDishPrice(item.price.toString());
    setDishCategory(item.category);
    setDishDietary(item.dietary);
    setDishSpice(item.spiceLevel);
    setDishPrepTime(item.prepTimeMinutes.toString());
    setDishImage(item.image);
    setDishIsChefSpecial(Boolean(item.isChefSpecial));
    setDishIsBestSeller(Boolean(item.isBestSeller));
    setIsAddDishOpen(true);
  };

  const handleStockToggle = async (item: MenuItem) => {
    await updateMenuItem(item.id, { isAvailable: !item.isAvailable });
  };

  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const occupancyPct = Math.round((occupiedCount / tables.length) * 100);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Management & Operations Back-Office</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Restaurant Admin Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Floor tables, menu catalog, reservations desk, and sales intelligence.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex flex-wrap rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'tables'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🪑 Floor Plan
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'menu'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📋 Menu Catalog
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'reservations'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📅 Reservations ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'financials'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📊 Financials
          </button>
        </div>
      </div>

      {/* KPI Metric Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales</p>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">From {orders.length} orders</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Table Occupancy</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {occupancyPct}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{occupiedCount} of {tables.length} tables seated</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Bookings</p>
          <p className="text-2xl font-black text-amber-500 mt-1">
            {reservations.filter((r) => r.status === 'confirmed').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Upcoming reservations</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menu Dishes</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {menu.length} Items
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {menu.filter((m) => m.isAvailable).length} available
          </p>
        </div>
      </div>

      {/* Tab 1: Floor Plan & Tables */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Restaurant Floor Plan & Real-time Seating
              </h2>
              <p className="text-xs text-slate-500">
                Click any table to seat a party, change cleaning status, or view occupants.
              </p>
            </div>
          </div>

          <TableLayoutGrid />
        </div>
      )}

      {/* Tab 2: Menu Management (CRUD) */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog by dish or category..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setDishName('');
                setDishDescription('');
                setDishPrice('18.00');
                setIsAddDishOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Recipe Dish</span>
            </button>
          </div>

          {/* Dishes Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Dietary</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMenu.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 font-black text-brand-600 dark:text-brand-400">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                        {item.dietary}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStockToggle(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition ${
                          item.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {item.isAvailable ? '✓ In Stock' : '✕ 86’d (Sold Out)'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.name}"?`)) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 3: Reservations Desk */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Table Bookings & Guest Concierge
          </h2>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Booking Code</th>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Party</th>
                  <th className="py-3 px-4">Area / Occasion</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-brand-600">
                      {res.bookingCode}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{res.customerName}</p>
                      <p className="text-[11px] text-slate-400">{res.customerPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{res.date}</p>
                      <p className="text-[11px] text-slate-400">{res.timeSlot}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {res.guestsCount} Guests
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{res.seatingArea}</p>
                      {res.occasion && <p className="text-[11px] text-amber-500 font-medium">{res.occasion}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        res.status === 'confirmed'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : res.status === 'seated'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'seated')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 transition"
                          >
                            Seat Guest
                          </button>
                        )}
                        {res.status === 'seated' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-[11px] hover:bg-slate-700 transition"
                          >
                            Finish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Financials & Orders */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Orders Ledger & Transactions
          </h2>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-brand-600">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDateTime(o.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {o.customer.name}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {o.type} {o.customer.tableNumber ? `(T-${o.customer.tableNumber})` : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {o.items.length} items
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-600 dark:text-slate-400">
                      {o.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-black text-brand-600 dark:text-brand-400">
                      {formatPrice(o.total)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/orders/${o.id}`}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-600 font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsAddDishOpen(false)}
            />

            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
                </h3>
                <button
                  onClick={() => setIsAddDishOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdateDish} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Culinary Description
                  </label>
                  <textarea
                    rows={2}
                    value={dishDescription}
                    onChange={(e) => setDishDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={dishPrice}
                      onChange={(e) => setDishPrice(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={dishCategory}
                      onChange={(e) => setDishCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Artisan Pizzas">Artisan Pizzas</option>
                      <option value="Signature Mains">Signature Mains</option>
                      <option value="Burgers & Sandwiches">Burgers & Sandwiches</option>
                      <option value="Pasta & Bowls">Pasta & Bowls</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages & Mocktails">Beverages & Mocktails</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Dietary Type
                    </label>
                    <select
                      value={dishDietary}
                      onChange={(e) => setDishDietary(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="gluten-free">Gluten-Free</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Prep Time (Minutes)
                    </label>
                    <input
                      type="number"
                      value={dishPrepTime}
                      onChange={(e) => setDishPrepTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={dishImage}
                    onChange={(e) => setDishImage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsChefSpecial}
                      onChange={(e) => setDishIsChefSpecial(e.target.checked)}
                      className="rounded"
                    />
                    <span className="font-bold">★ Chef Special</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsBestSeller}
                      onChange={(e) => setDishIsBestSeller(e.target.checked)}
                      className="rounded"
                    />
                    <span className="font-bold">🔥 Best Seller</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDishOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-500 transition"
                  >
                    {editingItem ? 'Save Changes' : 'Create Dish'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
