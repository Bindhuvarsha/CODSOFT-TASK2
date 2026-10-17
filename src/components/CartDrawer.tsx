'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Utensils, 
  Bike, 
  ShoppingBag as BagIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { formatPrice } from '@/lib/utils';
import { OrderType } from '@/lib/types';

export default function CartDrawer() {
  const {
    items,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    deliveryAddress,
    setDeliveryAddress,
    promoCode,
    discount,
    promoError,
    applyPromoCode,
    removePromoCode,
    tipPercent,
    setTipPercent,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    serviceCharge,
    tip,
    total,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const { tables } = useRestaurant();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyPromoCode(couponInput.trim());
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Your Order Bag</h3>
                <p className="text-xs text-slate-500">
                  {items.length === 0 ? 'Empty' : `${items.length} unique dish${items.length > 1 ? 'es' : ''}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dining Type Selector */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Dining Mode:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'dine-in' as OrderType, label: 'Dine-In', icon: Utensils },
                { type: 'takeaway' as OrderType, label: 'Takeaway', icon: BagIcon },
                { type: 'delivery' as OrderType, label: 'Delivery', icon: Bike },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = orderType === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setOrderType(opt.type)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-600/20'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dine-In Table Picker */}
            {orderType === 'dine-in' && (
              <div className="mt-3 flex items-center justify-between text-xs bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Table Number:</span>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-lg border border-brand-200 dark:border-brand-800 outline-none cursor-pointer"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.number}>
                      {t.number} ({t.area} - {t.capacity}p)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Delivery address notice */}
            {orderType === 'delivery' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter Delivery Address & Unit #"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Discover our chef’s artisanal appetizers, wood-fired pizzas, prime steaks, and house cocktails.
                </p>
                <Link
                  href="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow hover:bg-brand-700 transition"
                >
                  Explore Menu Now
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-brand-300 dark:hover:border-brand-800 transition shadow-sm space-y-2"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options & Notes */}
                      {item.selectedOptions.length > 0 && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 mt-0.5">
                          {item.selectedOptions.map((opt, i) => (
                            <span key={i} className="inline-block bg-slate-100 dark:bg-slate-700/60 rounded px-1.5 py-0.5 mr-1 mb-1">
                              {opt.optionName} {opt.price > 0 && `(+${formatPrice(opt.price)})`}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.specialInstructions && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                          Note: "{item.specialInstructions}"
                        </p>
                      )}

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/60 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {formatPrice(item.itemTotalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 space-y-3">
              
              {/* Promo Code Input */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Coupon {promoCode} Applied (-{formatPrice(discount)})</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-xs font-semibold hover:underline text-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Coupon: DINE10, DINE20"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none uppercase font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-900 transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {promoError}
                  </p>
                )}
              </div>

              {/* Tip Selection */}
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Gratuity / Tip:</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-1 rounded-lg text-xs font-bold transition ${
                        tipPercent === pct
                          ? 'bg-brand-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {pct === 0 ? 'None' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({promoCode}):</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax (5%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {serviceCharge > 0 && (
                  <div className="flex justify-between">
                    <span>Dine-In Service (10%):</span>
                    <span>{formatPrice(serviceCharge)}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div className="flex justify-between">
                    <span>Tip ({tipPercent}%):</span>
                    <span>{formatPrice(tip)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount:</span>
                  <span className="text-brand-600 dark:text-brand-400 text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 text-white font-bold text-sm shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
