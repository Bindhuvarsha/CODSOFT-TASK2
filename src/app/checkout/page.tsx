'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CreditCard, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  Utensils, 
  Bike, 
  ShoppingBag as BagIcon, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Sparkles,
  Lock,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { formatPrice } from '@/lib/utils';
import { PaymentMethod } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    orderType,
    tableNumber,
    deliveryAddress,
    setDeliveryAddress,
    promoCode,
    discount,
    tipPercent,
    subtotal,
    tax,
    serviceCharge,
    tip,
    total,
    clearCart,
  } = useCart();

  const { placeOrder, tables } = useRestaurant();

  // Customer Contact State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Split Bill Calculator State
  const [splitCount, setSplitCount] = useState<number>(1);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <BagIcon className="w-8 h-8" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
          Your order bag is empty
        </h2>
        <p className="text-sm text-slate-500">
          Please add dishes from our digital menu before proceeding to checkout.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow hover:bg-brand-500 transition"
        >
          <Utensils className="w-4 h-4" />
          <span>Browse Digital Menu</span>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Please enter your contact phone number.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide a complete delivery address.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway network request (1.5s)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const orderPayload = {
        type: orderType,
        items,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
          tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
          deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
          notes: orderNotes.trim() || undefined,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        subtotal,
        discount,
        promoCode: promoCode || undefined,
        tax,
        serviceCharge,
        tip,
        total,
        estimatedPrepTimeMinutes: 20,
      };

      const createdOrder = await placeOrder(orderPayload);

      if (createdOrder) {
        // Fire confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        clearCart();
        router.push(`/orders/${createdOrder.id}`);
      } else {
        setErrorMessage('Failed to place order. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  const splitPerPerson = total / splitCount;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Details & Payment */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Dining Mode Header Banner */}
            <div className="p-5 rounded-3xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200/80 dark:border-brand-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold">
                  {orderType === 'dine-in' ? <Utensils className="w-5 h-5" /> : orderType === 'takeaway' ? <BagIcon className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base capitalize">
                    {orderType} Order
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {orderType === 'dine-in'
                      ? `Serving directly at Table ${tableNumber}`
                      : orderType === 'takeaway'
                      ? 'Ready for curbside pickup in ~20 mins'
                      : 'Delivering direct to your address'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-600 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl shadow-xs">
                {items.length} Dishes
              </span>
            </div>

            {/* Customer Contact Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>1. Guest Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number (for SMS Tracking) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 345-6789"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address (Receipt & Digital Invoice)
                </label>
                <input
                  type="email"
                  placeholder="e.g. elena@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>

              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Delivery Address & Apartment / Landmark *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Apt 4B, 742 Evergreen Terrace, Downtown"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Kitchen / Delivery Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please bring glasses with ice, extra napkins..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  2. Select Payment Method
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Gateway
                </span>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition ${
                    paymentMethod === 'card'
                      ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-200 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <span>Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition ${
                    paymentMethod === 'upi'
                      ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-200 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-brand-600" />
                  <span>UPI / QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition ${
                    paymentMethod === 'cash'
                      ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-200 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-brand-600" />
                  <span>{orderType === 'dine-in' ? 'Pay at Table' : 'Cash'}</span>
                </button>
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Card Number (Simulated)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI QR Display */}
              {paymentMethod === 'upi' && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                  <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=dinedesk@bistro&pn=DineDesk&am=10.00"
                      alt="UPI Dynamic QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-white">
                      Scan with Google Pay, PhonePe, Paytm, or any UPI App
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Amount: <strong>{formatPrice(total)}</strong> • Instant Verification
                    </p>
                  </div>
                </div>
              )}

              {/* Cash notice */}
              {paymentMethod === 'cash' && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-bold">💵 Cash / Card on Delivery / At Table:</p>
                  <p className="mt-1">
                    Your order ticket will be dispatched straight to the kitchen. You can settle the bill via cash or portable POS card terminal when served.
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Pay Now Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment & Dispatching to Kitchen...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Confirm & Pay {formatPrice(total)}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Sidebar: Summary & Bill Split Calculator */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Order Summary Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Order Breakdown
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="pr-3">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {item.quantity}x {item.menuItem.name}
                    </p>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-[11px] text-slate-500">
                        {item.selectedOptions.map((o) => o.optionName).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                    {formatPrice(item.itemTotalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount ({promoCode}):</span>
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
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Grand Total:</span>
                <span className="text-brand-600 dark:text-brand-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Split Bill Calculator Tool */}
          <div className="p-6 rounded-3xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Split The Bill Calculator
                </h4>
              </div>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">
                Dine-In Perk
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Number of Diners:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{splitCount} Guests</span>
              </div>

              <div className="grid grid-cols-6 gap-1">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSplitCount(num)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition ${
                      splitCount === num
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {num}p
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500">Each person pays:</p>
                <p className="text-lg font-black text-brand-600 dark:text-brand-400">
                  {formatPrice(splitPerPerson)}
                </p>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                (Total: {formatPrice(total)})
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
