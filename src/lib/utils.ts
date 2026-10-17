import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus, TableStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'placed':
      return {
        label: 'Order Placed',
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        dot: 'bg-blue-500 animate-pulse',
      };
    case 'confirmed':
      return {
        label: 'Confirmed',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
        dot: 'bg-indigo-500',
      };
    case 'preparing':
      return {
        label: 'Kitchen Cooking',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500 animate-ping',
      };
    case 'ready':
      return {
        label: 'Ready to Serve',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
      };
    case 'served':
      return {
        label: 'Served at Table',
        bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
        dot: 'bg-purple-500',
      };
    case 'completed':
      return {
        label: 'Completed',
        bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dot: 'bg-slate-400',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getTableStatusBadge(status: TableStatus) {
  switch (status) {
    case 'available':
      return {
        label: 'Available',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        indicator: 'bg-emerald-500',
      };
    case 'occupied':
      return {
        label: 'Occupied',
        color: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        indicator: 'bg-rose-500',
      };
    case 'reserved':
      return {
        label: 'Reserved',
        color: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        indicator: 'bg-blue-500',
      };
    case 'cleaning':
      return {
        label: 'Cleaning',
        color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        indicator: 'bg-amber-500',
      };
  }
}
