'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Coffee,
  X
} from 'lucide-react';
import { RestaurantTable, TableStatus } from '@/lib/types';
import { getTableStatusBadge } from '@/lib/utils';
import { useRestaurant } from '@/context/RestaurantContext';

export default function TableLayoutGrid() {
  const { tables, updateTableStatus } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [activeArea, setActiveArea] = useState<string>('All');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [guestNameInput, setGuestNameInput] = useState<string>('');

  const areas = ['All', 'Indoor Main', 'Rooftop Terrace', 'Patio Garden', 'Private VIP Lounge'];

  const filteredTables = activeArea === 'All'
    ? tables
    : tables.filter((t) => t.area === activeArea);

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
    cleaning: tables.filter((t) => t.status === 'cleaning').length,
  };

  const handleStatusChange = async (status: TableStatus) => {
    if (!selectedTable) return;
    setIsUpdating(true);
    await updateTableStatus(selectedTable.id, status, guestNameInput || selectedTable.currentGuestName);
    setIsUpdating(false);
    setSelectedTable(null);
    setGuestNameInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Stat Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Tables</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Available</p>
          <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-1">{stats.available}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 shadow-sm">
          <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold">Occupied</p>
          <p className="text-2xl font-black text-rose-800 dark:text-rose-200 mt-1">{stats.occupied}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 shadow-sm">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Reserved</p>
          <p className="text-2xl font-black text-blue-800 dark:text-blue-200 mt-1">{stats.reserved}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 shadow-sm">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">Cleaning</p>
          <p className="text-2xl font-black text-amber-800 dark:text-amber-200 mt-1">{stats.cleaning}</p>
        </div>
      </div>

      {/* Area Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {areas.map((area) => (
          <button
            key={area}
            onClick={() => setActiveArea(area)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeArea === area
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Interactive Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTables.map((table) => {
          const badge = getTableStatusBadge(table.status);
          return (
            <div
              key={table.id}
              onClick={() => {
                setSelectedTable(table);
                setGuestNameInput(table.currentGuestName || '');
              }}
              className={`group relative p-4 rounded-3xl border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                table.status === 'occupied'
                  ? 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40'
                  : table.status === 'reserved'
                  ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/40'
                  : table.status === 'cleaning'
                  ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40'
                  : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-brand-400'
              }`}
            >
              {/* Header: Table Number & Status Dot */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                    {table.number}
                  </span>
                  <p className="text-[11px] text-slate-500">{table.area}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.indicator}`} />
                  {badge.label}
                </span>
              </div>

              {/* Table Avatar Graphic */}
              <div className="my-4 flex items-center justify-center">
                <div
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shadow-inner ${
                    table.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : table.status === 'occupied'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : table.status === 'reserved'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  <Users className="w-5 h-5 mb-0.5" />
                  <span className="text-[11px]">{table.capacity} Seats</span>
                </div>
              </div>

              {/* Occupant / Details */}
              <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {table.currentGuestName ? (
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    👤 {table.currentGuestName}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">No party seated</p>
                )}
                {table.occupiedSince && (
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Seated {new Date(table.occupiedSince).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Detail / Action Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedTable(null)}
            />

            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                    Table {selectedTable.number}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedTable.area} • {selectedTable.capacity} Guests</p>
                </div>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Guest name entry for occupancy */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Guest / Party Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Vance (Walk-in)"
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Update Table State:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('available')}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Available
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('occupied')}
                    className="p-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-xs font-bold hover:bg-rose-100 transition flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Seat / Occupy
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('reserved')}
                    className="p-2.5 rounded-xl border border-blue-300 bg-blue-50 text-blue-800 text-xs font-bold hover:bg-blue-100 transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Reserve
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('cleaning')}
                    className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition flex items-center justify-center gap-1.5"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    Cleaning
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
