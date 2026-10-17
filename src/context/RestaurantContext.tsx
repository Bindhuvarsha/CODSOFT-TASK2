'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, Order, RestaurantTable, Reservation, DailyAnalytics, OrderStatus, TableStatus, ReservationStatus } from '@/lib/types';
import { INITIAL_MENU_ITEMS, INITIAL_TABLES, INITIAL_RESERVATIONS, INITIAL_ORDERS } from '@/lib/sampleData';

interface RestaurantContextType {
  menu: MenuItem[];
  orders: Order[];
  tables: RestaurantTable[];
  reservations: Reservation[];
  analytics: DailyAnalytics | null;
  isLoading: boolean;
  activeOrderCount: number;
  refreshData: () => Promise<void>;
  placeOrder: (orderData: any) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  updateTableStatus: (tableId: string, status: TableStatus, guestName?: string) => Promise<boolean>;
  createReservation: (resData: any) => Promise<Reservation | null>;
  updateReservationStatus: (resId: string, status: ReservationStatus) => Promise<boolean>;
  createMenuItem: (item: Partial<MenuItem>) => Promise<MenuItem | null>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<boolean>;
  deleteMenuItem: (id: string) => Promise<boolean>;
  playNotificationSound: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Web Audio API chime synthesizer
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.8);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (e) {
    // Audio context may require user interaction first
  }
}

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [analytics, setAnalytics] = useState<DailyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.data) setMenu(data.data);
      }
    } catch (e) {
      console.warn('API menu fallback to initial data');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setOrders((prev) => {
            // Check if there is a new order to chime
            if (prev.length > 0 && data.data.length > prev.length) {
              playChime();
            }
            return data.data;
          });
        }
      }
    } catch (e) {
      console.warn('API orders fallback');
    }
  };

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/tables');
      if (res.ok) {
        const data = await res.json();
        if (data.data) setTables(data.data);
      }
    } catch (e) {
      console.warn('API tables fallback');
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        if (data.data) setReservations(data.data);
      }
    } catch (e) {
      console.warn('API reservations fallback');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        if (data.data) setAnalytics(data.data);
      }
    } catch (e) {
      console.warn('API analytics fallback');
    }
  };

  const refreshData = useCallback(async () => {
    await Promise.allSettled([
      fetchMenu(),
      fetchOrders(),
      fetchTables(),
      fetchReservations(),
      fetchAnalytics(),
    ]);
  }, []);

  useEffect(() => {
    refreshData().finally(() => setIsLoading(false));

    // Polling interval for live sync between customer, kitchen, admin
    const interval = setInterval(() => {
      fetchOrders();
      fetchTables();
      fetchReservations();
    }, 4000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const placeOrder = async (orderData: any): Promise<Order | null> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setOrders((prev) => [data.data, ...prev]);
          playChime();
          refreshData();
          return data.data;
        }
      }
    } catch (e) {
      console.error('Error placing order:', e);
    }
    return null;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o))
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        refreshData();
        return true;
      }
    } catch (e) {
      console.error('Error updating order status:', e);
    }
    return false;
  };

  const updateTableStatus = async (
    tableId: string,
    status: TableStatus,
    guestName?: string
  ): Promise<boolean> => {
    // Optimistic update
    setTables((prev) =>
      prev.map((t) => (t.id === tableId || t.number === tableId ? { ...t, status, currentGuestName: guestName } : t))
    );

    try {
      const res = await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, status, guestName }),
      });
      if (res.ok) {
        refreshData();
        return true;
      }
    } catch (e) {
      console.error('Error updating table:', e);
    }
    return false;
  };

  const createReservation = async (resData: any): Promise<Reservation | null> => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setReservations((prev) => [data.data, ...prev]);
          refreshData();
          return data.data;
        }
      }
    } catch (e) {
      console.error('Error creating reservation:', e);
    }
    return null;
  };

  const updateReservationStatus = async (
    resId: string,
    status: ReservationStatus
  ): Promise<boolean> => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId || r.bookingCode === resId ? { ...r, status } : r))
    );

    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resId, status }),
      });
      if (res.ok) {
        refreshData();
        return true;
      }
    } catch (e) {
      console.error('Error updating reservation:', e);
    }
    return false;
  };

  const createMenuItem = async (item: Partial<MenuItem>): Promise<MenuItem | null> => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setMenu((prev) => [...prev, data.data]);
          refreshData();
          return data.data;
        }
      }
    } catch (e) {
      console.error('Error creating menu item:', e);
    }
    return null;
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<boolean> => {
    setMenu((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        refreshData();
        return true;
      }
    } catch (e) {
      console.error('Error updating menu item:', e);
    }
    return false;
  };

  const deleteMenuItem = async (id: string): Promise<boolean> => {
    setMenu((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        refreshData();
        return true;
      }
    } catch (e) {
      console.error('Error deleting menu item:', e);
    }
    return false;
  };

  const activeOrderCount = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  return (
    <RestaurantContext.Provider
      value={{
        menu,
        orders,
        tables,
        reservations,
        analytics,
        isLoading,
        activeOrderCount,
        refreshData,
        placeOrder,
        updateOrderStatus,
        updateTableStatus,
        createReservation,
        updateReservationStatus,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
        playNotificationSound: playChime,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
