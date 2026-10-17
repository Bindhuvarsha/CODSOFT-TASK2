'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Search,
  Wine,
  HeartHandshake,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRestaurant } from '@/context/RestaurantContext';
import { Reservation } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

const SEATING_AREAS = [
  {
    id: 'Indoor Main',
    name: 'Indoor Main Hall',
    desc: 'Classic elegance with acoustic warmth and comfortable velvet booth seating.',
    icon: '🏛️',
  },
  {
    id: 'Rooftop Terrace',
    name: 'Rooftop Terrace',
    desc: 'Panoramic skyline city views, ambient fairy lights, and starlit dining.',
    icon: '🌆',
  },
  {
    id: 'Patio Garden',
    name: 'Patio Garden',
    desc: 'Lush outdoor botanical greenery with radiant heaters for cool evenings.',
    icon: '🌿',
  },
  {
    id: 'Private VIP Lounge',
    name: 'Private VIP Lounge',
    desc: 'Intimate exclusive dining suite dedicated to milestones, VIPs, & wine tastings.',
    icon: '👑',
  },
];

const TIME_SLOTS = [
  { period: 'Lunch', times: ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'] },
  { period: 'Dinner', times: ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'] },
];

export default function ReservationsPage() {
  const { reservations, createReservation } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'book' | 'lookup'>('book');

  // Booking Form State
  const [partySize, setPartySize] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('7:30 PM');
  const [selectedArea, setSelectedArea] = useState<any>('Indoor Main');
  const [occasion, setOccasion] = useState<string>('Casual Dining');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  
  // Guest Details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Lookup State
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<Reservation | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !selectedDate || !selectedTime) {
      setErrorMessage('Please fill in all required guest and time details.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const result = await createReservation({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        guestsCount: partySize,
        date: selectedDate,
        timeSlot: selectedTime,
        seatingArea: selectedArea,
        occasion,
        specialRequests: specialRequests.trim() || undefined,
      });

      if (result) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}

        setConfirmedReservation(result);
        // Reset form
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setSpecialRequests('');
      } else {
        setErrorMessage('Failed to reserve table. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const q = lookupQuery.trim().toLowerCase();
    const found = reservations.find(
      (r) =>
        r.bookingCode.toLowerCase().includes(q) ||
        r.customerPhone.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q)
    );
    setLookupResult(found || null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Wine className="w-3.5 h-3.5" />
          <span>Table Reservations</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Reserve Your Dining Experience
        </h1>
        <p className="text-sm text-slate-500">
          Join us for a gastronomic journey. Select your preferred atmosphere, party size, and dining time slot.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold pt-2">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === 'book'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Book a Table
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-5 py-2 rounded-xl transition ${
              activeTab === 'lookup'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Find My Reservation
          </button>
        </div>
      </div>

      {activeTab === 'book' ? (
        <form onSubmit={handleBookingSubmit} className="space-y-8">
          
          {/* Step 1: Party Size & Date */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center">1</span>
              <span>Party Size & Date</span>
            </h3>

            {/* Party Size Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Number of Diners
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPartySize(size)}
                    className={`py-3 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition ${
                      partySize === size
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>{size} {size === 1 ? 'Guest' : 'Guests'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Reservation Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Dining Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                >
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Date Night">Romantic Date Night</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business Dinner">Business Dinner</option>
                  <option value="Family Gathering">Family Gathering</option>
                </select>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Time Slot *
              </label>

              {TIME_SLOTS.map((slotGroup) => (
                <div key={slotGroup.period} className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400">{slotGroup.period} Sittings:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {slotGroup.times.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                          selectedTime === slot
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Step 2: Atmospheric Seating Area */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center">2</span>
              <span>Select Seating Atmosphere</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SEATING_AREAS.map((area) => {
                const isSelected = selectedArea === area.id;
                return (
                  <div
                    key={area.id}
                    onClick={() => setSelectedArea(area.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-50/70 border-brand-500 dark:bg-brand-950/40 dark:border-brand-500 shadow-md ring-2 ring-brand-500/20'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{area.icon}</span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {area.name}
                        </h4>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {area.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Contact & Special Requests */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center">3</span>
              <span>Guest Details & Confirmation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Phone Number (for SMS confirmation) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 234-8901"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. marcus@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Special Requests / Dietary Allergies / Seating Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Quiet corner table, high chair required, celebrating 10th anniversary..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white font-extrabold text-base shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Reserving Table & Generating Confirmation Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Table Reservation</span>
                </>
              )}
            </button>
          </div>

        </form>
      ) : (
        /* Lookup Tab */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Check Your Reservation Status
            </h3>
            <p className="text-xs text-slate-500">
              Enter your booking reference code (e.g. DD-8491) or the contact phone number.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Booking code (DD-XXXX) or Phone..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition shadow"
            >
              Lookup
            </button>
          </form>

          {hasSearched && (
            <div>
              {lookupResult ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
                      Code: {lookupResult.bookingCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white uppercase">
                      {lookupResult.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 pt-1">
                    <p><strong>Guest:</strong> {lookupResult.customerName}</p>
                    <p><strong>Date & Time:</strong> {lookupResult.date} at {lookupResult.timeSlot}</p>
                    <p><strong>Party Size:</strong> {lookupResult.guestsCount} Diners</p>
                    <p><strong>Atmosphere:</strong> {lookupResult.seatingArea}</p>
                    {lookupResult.assignedTable && (
                      <p><strong>Assigned Table:</strong> Table {lookupResult.assignedTable}</p>
                    )}
                    {lookupResult.specialRequests && (
                      <p className="italic text-slate-500">"{lookupResult.specialRequests}"</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-500">
                  No active booking found matching "{lookupQuery}". Please check your code or make a new reservation.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmedReservation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setConfirmedReservation(null)}
            />

            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-center">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                  Table Confirmed!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We look forward to hosting you at DineDesk.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Your Booking Reference
                </p>
                <p className="font-mono font-black text-2xl text-brand-600 dark:text-brand-400 mt-1">
                  {confirmedReservation.bookingCode}
                </p>
              </div>

              <div className="text-xs text-left text-slate-600 dark:text-slate-400 space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <p><strong>Guest:</strong> {confirmedReservation.customerName}</p>
                <p><strong>Date:</strong> {confirmedReservation.date} at {confirmedReservation.timeSlot}</p>
                <p><strong>Party:</strong> {confirmedReservation.guestsCount} Guests ({confirmedReservation.seatingArea})</p>
                {confirmedReservation.occasion && (
                  <p><strong>Occasion:</strong> {confirmedReservation.occasion}</p>
                )}
              </div>

              <button
                onClick={() => setConfirmedReservation(null)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
