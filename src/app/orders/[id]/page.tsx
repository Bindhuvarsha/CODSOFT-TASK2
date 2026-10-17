'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Utensils, 
  Bike, 
  ShoppingBag, 
  ArrowLeft, 
  Printer, 
  Share2, 
  Phone, 
  MapPin, 
  Sparkles,
  AlertTriangle,
  Play
} from 'lucide-react';
import { useRestaurant } from '@/context/RestaurantContext';
import { formatPrice, formatDateTime } from '@/lib/utils';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Order, OrderStatus } from '@/lib/types';

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const { orders, updateOrderStatus } = useRestaurant();
  const [order, setOrder] = useState<Order | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number>(18);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  // Find order by ID or orderNumber
  useEffect(() => {
    const found = orders.find((o) => o.id === params.id || o.orderNumber.replace('#', '') === params.id);
    if (found) {
      setOrder(found);
      if (found.status === 'placed') setEtaMinutes(20);
      else if (found.status === 'preparing') setEtaMinutes(12);
      else if (found.status === 'ready') setEtaMinutes(3);
      else setEtaMinutes(0);
    }
  }, [orders, params.id]);

  // Simulate ETA decrementing countdown
  useEffect(() => {
    if (etaMinutes > 1) {
      const timer = setInterval(() => {
        setEtaMinutes((prev) => Math.max(1, prev - 1));
      }, 60000); // every minute
      return () => clearInterval(timer);
    }
  }, [etaMinutes]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
          Order Not Found
        </h2>
        <p className="text-sm text-slate-500">
          We couldn't locate an order with reference "{params.id}".
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Received & routed to kitchen' },
    { key: 'preparing', label: 'Chef Cooking', desc: 'Plating in kitchen' },
    { key: 'ready', label: 'Ready', desc: order.type === 'dine-in' ? 'Ready to serve' : 'Ready for pickup / courier' },
    { key: order.type === 'dine-in' ? 'served' : 'completed', label: order.type === 'dine-in' ? 'Served' : 'Delivered', desc: 'Enjoy your meal!' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'served':
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  // Quick staff simulation to test workflow
  const handleAdvanceStatus = async () => {
    setIsAdvancing(true);
    let nextStatus: OrderStatus = 'preparing';
    if (order.status === 'placed') nextStatus = 'preparing';
    else if (order.status === 'preparing') nextStatus = 'ready';
    else if (order.status === 'ready') nextStatus = order.type === 'dine-in' ? 'served' : 'completed';
    else if (order.status === 'served') nextStatus = 'completed';

    await updateOrderStatus(order.id, nextStatus);
    setIsAdvancing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/orders" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> All Orders
            </Link>
            <span>/</span>
            <span>Live Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Order {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Placed on {formatDateTime(order.createdAt)} • {order.type.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulation Helper */}
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <button
              onClick={handleAdvanceStatus}
              disabled={isAdvancing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 transition shadow-sm"
              title="Demo feature: advance kitchen stage"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Next Stage</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Real-time Visual Timeline Progress Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-8">
        
        {/* Status Callout Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-brand-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/60 border border-brand-200/60 dark:border-slate-700">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-600/30">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                {order.status === 'placed' && 'Order Received & Dispatched to Chef'}
                {order.status === 'preparing' && 'The Kitchen is Cooking & Plating Your Food'}
                {order.status === 'ready' && 'Your Order is Plated & Ready!'}
                {order.status === 'served' && 'Served! Enjoy Your Dining Experience'}
                {order.status === 'completed' && 'Order Successfully Completed'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {order.type === 'dine-in'
                  ? `Delivering directly to Table ${order.customer.tableNumber}`
                  : order.type === 'takeaway'
                  ? 'Ready for pickup at the front counter'
                  : `Courier delivering to: ${order.customer.deliveryAddress}`}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          {order.status !== 'completed' && order.status !== 'served' && (
            <div className="text-center sm:text-right shrink-0 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-brand-200 dark:border-slate-700 shadow-sm">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimated Time</p>
              <p className="text-2xl font-black text-brand-600 dark:text-brand-400">
                ~{etaMinutes} Mins
              </p>
            </div>
          )}
        </div>

        {/* 4-Step Visual Progress Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div
                key={step.key}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-brand-50/80 border-brand-500 dark:bg-brand-950/40 dark:border-brand-500 shadow-md ring-2 ring-brand-500/20'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-brand-600 text-white animate-bounce-slight'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </span>
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {step.label}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Order Details & Receipt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Items Placed */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Ordered Items ({order.items.length})
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="flex gap-3">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-700"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.quantity}x {item.menuItem.name}
                    </p>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.selectedOptions.map((o) => o.optionName).join(', ')}
                      </p>
                    )}
                    {item.specialInstructions && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                        "{item.specialInstructions}"
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatPrice(item.itemTotalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({order.promoCode}):</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            {order.serviceCharge > 0 && (
              <div className="flex justify-between">
                <span>Dine-In Service (10%):</span>
                <span>{formatPrice(order.serviceCharge)}</span>
              </div>
            )}
            {order.tip > 0 && (
              <div className="flex justify-between">
                <span>Tip:</span>
                <span>{formatPrice(order.tip)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Total Paid:</span>
              <span className="text-brand-600 dark:text-brand-400">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Right: Guest & Venue Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Dining Details
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <p className="font-semibold text-slate-500 uppercase text-[10px]">Guest Name</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{order.customer.name}</p>
              </div>

              <div>
                <p className="font-semibold text-slate-500 uppercase text-[10px]">Contact Phone</p>
                <p className="font-medium text-slate-900 dark:text-white mt-0.5">{order.customer.phone}</p>
              </div>

              {order.type === 'dine-in' && (
                <div>
                  <p className="font-semibold text-slate-500 uppercase text-[10px]">Table Assigned</p>
                  <p className="font-extrabold text-brand-600 text-sm mt-0.5">Table {order.customer.tableNumber}</p>
                </div>
              )}

              {order.customer.deliveryAddress && (
                <div>
                  <p className="font-semibold text-slate-500 uppercase text-[10px]">Delivery Address</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-0.5">{order.customer.deliveryAddress}</p>
                </div>
              )}

              <div>
                <p className="font-semibold text-slate-500 uppercase text-[10px]">Payment Method</p>
                <p className="font-medium text-slate-900 dark:text-white mt-0.5 uppercase">
                  {order.paymentMethod} • <span className="text-emerald-600 font-bold">{order.paymentStatus}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/menu"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition"
              >
                <span>Order More Dishes</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
