'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Compass, 
  ArrowRight, 
  Utensils, 
  Clock, 
  ChefHat, 
  Calendar,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { useRestaurant } from '@/context/RestaurantContext';
import { formatPrice, formatDateTime } from '@/lib/utils';
import OrderStatusBadge from '@/components/OrderStatusBadge';

export default function OrdersListPage() {
  const { orders } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'active') {
      if (order.status === 'completed' || order.status === 'cancelled') return false;
    } else if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customer.name.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      const matchTable = order.customer.tableNumber?.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchTable) return false;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600 mb-1">
            <Compass className="w-4 h-4" />
            <span>Real-time Operations</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Order Tracking & History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track active live kitchen tickets or view past dining orders.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-500 transition self-start sm:self-auto"
        >
          <Utensils className="w-4 h-4" />
          <span>New Order</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order #, Guest Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-sm"
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

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: '🔥 Active (Kitchen)' },
            { id: 'placed', label: 'Placed' },
            { id: 'preparing', label: 'Cooking' },
            { id: 'ready', label: 'Ready' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Orders List Grid */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
            No orders match your filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the filter status.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                      {order.orderNumber}
                    </h3>
                    <p className="text-[11px] text-slate-500 capitalize">
                      {order.type} {order.customer.tableNumber ? `• Table ${order.customer.tableNumber}` : ''}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Customer & Timestamp */}
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    👤 {order.customer.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    🕒 {formatDateTime(order.createdAt)}
                  </p>
                </div>

                {/* Items Summary */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Items ({order.items.length})
                  </p>
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5 line-clamp-3">
                    {order.items.map((i) => (
                      <div key={i.cartItemId} className="truncate">
                        • {i.quantity}x {i.menuItem.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</p>
                  <p className="text-base font-black text-brand-600 dark:text-brand-400">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold hover:bg-brand-600 dark:hover:bg-brand-500 dark:hover:text-white transition"
                >
                  <span>Track Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
