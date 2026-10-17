'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChefHat, 
  Clock, 
  Volume2, 
  VolumeX, 
  Flame, 
  Utensils, 
  Bike, 
  ShoppingBag, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Bell,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Order, OrderStatus } from '@/lib/types';
import { formatTime } from '@/lib/utils';

export default function KitchenPage() {
  const { orders, updateOrderStatus, playNotificationSound, refreshData } = useRestaurant();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState<number>(Date.now());

  // Tick clock every 10 seconds for prep timer calculation
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const toggleItemCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredOrders = orders.filter((o) => {
    if (filterType !== 'all' && o.type !== filterType) return false;
    return true;
  });

  const newOrders = filteredOrders.filter((o) => o.status === 'placed' || o.status === 'confirmed');
  const prepOrders = filteredOrders.filter((o) => o.status === 'preparing');
  const readyOrders = filteredOrders.filter((o) => o.status === 'ready');
  const doneOrders = filteredOrders.filter((o) => o.status === 'served' || o.status === 'completed').slice(0, 5);

  const getElapsedMinutes = (createdAt: string) => {
    const diffMs = now - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const handleStatusTransition = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
    if (soundEnabled && nextStatus === 'ready') {
      playNotificationSound();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* KDS Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Kitchen Display System (KDS)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                LIVE EXPEDITER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time order line ticket pipeline & chef timing tracker
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Order Type Filter */}
          <div className="flex rounded-xl bg-slate-800 p-1 text-xs font-bold">
            {['all', 'dine-in', 'takeaway', 'delivery'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  filterType === type
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playNotificationSound();
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-slate-800 border-amber-500/40 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="Toggle Kitchen Sound Chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={() => refreshData()}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Manual sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KDS Kanban 4-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        
        {/* Column 1: New Incoming Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-950/40 border border-blue-800/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
              <h3 className="font-extrabold text-sm text-blue-200">
                1. New Orders
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-500 text-white">
              {newOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {newOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-600 text-xs">
                No new incoming tickets
              </div>
            ) : (
              newOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.createdAt);
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-3xl bg-slate-900 border-2 border-blue-500/60 shadow-xl space-y-4 animate-pulse-subtle"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-lg text-white">
                            {order.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
                            {order.type}
                          </span>
                        </div>
                        {order.customer.tableNumber && (
                          <p className="text-xs font-bold text-amber-400 mt-0.5">
                            📍 Table {order.customer.tableNumber}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400">
                          Guest: {order.customer.name}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-300">
                          <Clock className="w-3 h-3 text-blue-400" />
                          {elapsed}m ago
                        </span>
                      </div>
                    </div>

                    {/* Dish Checklist */}
                    <div className="space-y-2 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                          <span className="font-black text-amber-400 shrink-0 text-sm">
                            {item.quantity}x
                          </span>
                          <div className="flex-1">
                            <p className="font-bold text-white text-sm">{item.menuItem.name}</p>
                            {item.selectedOptions.length > 0 && (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {item.selectedOptions.map((o) => o.optionName).join(', ')}
                              </p>
                            )}
                            {item.specialInstructions && (
                              <p className="text-[11px] text-rose-400 font-bold mt-1 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/50">
                                ⚠️ Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => handleStatusTransition(order.id, 'preparing')}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition"
                    >
                      <Flame className="w-4 h-4 fill-current text-amber-300" />
                      <span>Accept & Start Cooking</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-950/40 border border-amber-800/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <h3 className="font-extrabold text-sm text-amber-200">
                2. In Preparation
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950">
              {prepOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {prepOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-600 text-xs">
                No active cooking tickets
              </div>
            ) : (
              prepOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.createdAt);
                const isLate = elapsed > 20;
                const isWarning = elapsed > 12;

                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-3xl bg-slate-900 border-2 shadow-xl space-y-4 transition ${
                      isLate
                        ? 'border-rose-500 ring-2 ring-rose-500/30'
                        : isWarning
                        ? 'border-amber-500'
                        : 'border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-lg text-white">
                            {order.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                            {order.type}
                          </span>
                        </div>
                        {order.customer.tableNumber && (
                          <p className="text-xs font-bold text-amber-400 mt-0.5">
                            📍 Table {order.customer.tableNumber}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400">
                          {order.customer.name}
                        </p>
                      </div>

                      {/* Cook Timer Badge */}
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-black ${
                            isLate
                              ? 'bg-rose-500 text-white animate-pulse'
                              : isWarning
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {elapsed}m
                        </span>
                        {isLate && (
                          <p className="text-[10px] text-rose-400 font-bold mt-1">LATE TICKET</p>
                        )}
                      </div>
                    </div>

                    {/* Item Checklist with Strikethrough */}
                    <div className="space-y-2 text-xs">
                      {order.items.map((item, idx) => {
                        const checkKey = `${order.id}-${idx}`;
                        const isDone = Boolean(checkedItems[checkKey]);

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleItemCheck(checkKey)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition ${
                              isDone
                                ? 'bg-slate-950/40 border-slate-800 opacity-50 line-through text-slate-500'
                                : 'bg-slate-950 border-slate-800 text-white hover:border-amber-500/40'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                                isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-700 bg-slate-900'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-amber-400 mr-1.5 text-sm">
                                {item.quantity}x
                              </span>
                              <span className="font-bold text-sm">{item.menuItem.name}</span>
                              {item.selectedOptions.length > 0 && (
                                <p className="text-[11px] text-slate-400 mt-0.5 no-underline">
                                  {item.selectedOptions.map((o) => o.optionName).join(', ')}
                                </p>
                              )}
                              {item.specialInstructions && (
                                <p className="text-[11px] text-rose-400 font-bold mt-1 no-underline bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/50">
                                  ⚠️ {item.specialInstructions}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Advance to Ready */}
                    <button
                      onClick={() => handleStatusTransition(order.id, 'ready')}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Plated & Ready to Expedite</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Ready to Serve / Expedite */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="font-extrabold text-sm text-emerald-200">
                3. Ready to Serve
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-slate-950">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-600 text-xs">
                No orders waiting for pickup
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500/60 shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-white">
                          {order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                          {order.type}
                        </span>
                      </div>
                      {order.customer.tableNumber && (
                        <p className="text-xs font-bold text-emerald-400 mt-0.5">
                          📍 Serve Table {order.customer.tableNumber}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400">{order.customer.name}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                      Waiting Runner
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {i.quantity}x {i.menuItem.name}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      handleStatusTransition(order.id, order.type === 'dine-in' ? 'served' : 'completed')
                    }
                    className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{order.type === 'dine-in' ? 'Mark Served at Table' : 'Mark Dispatched / Picked Up'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Fulfilled / Completed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-500" />
              <h3 className="font-extrabold text-sm text-slate-300">
                4. Completed
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-slate-800 text-slate-400">
              {doneOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {doneOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-600 text-xs">
                Completed tickets will appear here
              </div>
            ) : (
              doneOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 opacity-75 hover:opacity-100 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-slate-300">
                      {order.orderNumber} ({order.customer.name})
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      ✓ Done
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {order.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
