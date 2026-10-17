import fs from 'fs';
import path from 'path';
import { MenuItem, Order, RestaurantTable, Reservation, DailyAnalytics } from './types';
import { INITIAL_MENU_ITEMS, INITIAL_TABLES, INITIAL_RESERVATIONS, INITIAL_ORDERS } from './sampleData';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  menu: MenuItem[];
  orders: Order[];
  tables: RestaurantTable[];
  reservations: Reservation[];
}

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        menu: INITIAL_MENU_ITEMS,
        orders: INITIAL_ORDERS,
        tables: INITIAL_TABLES,
        reservations: INITIAL_RESERVATIONS,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB file, returning in-memory fallback:', error);
    return {
      menu: INITIAL_MENU_ITEMS,
      orders: INITIAL_ORDERS,
      tables: INITIAL_TABLES,
      reservations: INITIAL_RESERVATIONS,
    };
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving to DB file:', error);
  }
}

// Database Operations
export const db = {
  // Menu
  getMenuItems: (): MenuItem[] => {
    const data = ensureDbFile();
    return data.menu;
  },

  getMenuItemById: (id: string): MenuItem | undefined => {
    const data = ensureDbFile();
    return data.menu.find((item) => item.id === id);
  },

  createMenuItem: (item: Omit<MenuItem, 'id'>): MenuItem => {
    const data = ensureDbFile();
    const newItem: MenuItem = {
      ...item,
      id: `m-${Date.now()}`,
    };
    data.menu.push(newItem);
    saveDb(data);
    return newItem;
  },

  updateMenuItem: (id: string, updates: Partial<MenuItem>): MenuItem | null => {
    const data = ensureDbFile();
    const index = data.menu.findIndex((item) => item.id === id);
    if (index === -1) return null;
    data.menu[index] = { ...data.menu[index], ...updates };
    saveDb(data);
    return data.menu[index];
  },

  deleteMenuItem: (id: string): boolean => {
    const data = ensureDbFile();
    const initialLength = data.menu.length;
    data.menu = data.menu.filter((item) => item.id !== id);
    if (data.menu.length !== initialLength) {
      saveDb(data);
      return true;
    }
    return false;
  },

  // Orders
  getOrders: (): Order[] => {
    const data = ensureDbFile();
    return data.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getOrderById: (id: string): Order | undefined => {
    const data = ensureDbFile();
    return data.orders.find((order) => order.id === id || order.orderNumber === id);
  },

  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
    const data = ensureDbFile();
    const orderNum = Math.floor(100 + Math.random() * 900);
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber: `#DD-${orderNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.orders.unshift(newOrder);

    // If dine-in and table specified, update table status
    if (newOrder.type === 'dine-in' && newOrder.customer.tableNumber) {
      const table = data.tables.find((t) => t.number === newOrder.customer.tableNumber);
      if (table) {
        table.status = 'occupied';
        table.currentOrderId = newOrder.id;
        table.currentGuestName = newOrder.customer.name;
        table.occupiedSince = new Date().toISOString();
      }
    }

    saveDb(data);
    return newOrder;
  },

  updateOrderStatus: (id: string, status: Order['status']): Order | null => {
    const data = ensureDbFile();
    const order = data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'ready' && !order.readyAt) {
      order.readyAt = new Date().toISOString();
    }
    if ((status === 'completed' || status === 'served') && !order.completedAt) {
      order.completedAt = new Date().toISOString();
    }

    saveDb(data);
    return order;
  },

  // Tables
  getTables: (): RestaurantTable[] => {
    const data = ensureDbFile();
    return data.tables;
  },

  updateTableStatus: (tableId: string, status: RestaurantTable['status'], guestName?: string): RestaurantTable | null => {
    const data = ensureDbFile();
    const table = data.tables.find((t) => t.id === tableId || t.number === tableId);
    if (!table) return null;

    table.status = status;
    if (status === 'available' || status === 'cleaning') {
      table.currentOrderId = undefined;
      table.currentGuestName = undefined;
      table.occupiedSince = undefined;
    } else if (guestName) {
      table.currentGuestName = guestName;
      if (status === 'occupied') {
        table.occupiedSince = new Date().toISOString();
      }
    }

    saveDb(data);
    return table;
  },

  // Reservations
  getReservations: (): Reservation[] => {
    const data = ensureDbFile();
    return data.reservations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createReservation: (res: Omit<Reservation, 'id' | 'bookingCode' | 'createdAt' | 'status'>): Reservation => {
    const data = ensureDbFile();
    const code = `DD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      ...res,
      id: `res-${Date.now()}`,
      bookingCode: code,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    data.reservations.unshift(newReservation);
    saveDb(data);
    return newReservation;
  },

  updateReservationStatus: (id: string, status: Reservation['status']): Reservation | null => {
    const data = ensureDbFile();
    const res = data.reservations.find((r) => r.id === id || r.bookingCode === id);
    if (!res) return null;
    res.status = status;
    saveDb(data);
    return res;
  },

  // Analytics
  getAnalytics: (): DailyAnalytics => {
    const data = ensureDbFile();
    const totalRevenue = data.orders
      .filter((o) => o.paymentStatus === 'paid' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const activeOrders = data.orders.filter(
      (o) => o.status !== 'completed' && o.status !== 'cancelled'
    ).length;

    const occupiedTables = data.tables.filter((t) => t.status === 'occupied').length;
    const occupancyRate = (occupiedTables / data.tables.length) * 100;

    const validOrders = data.orders.filter((o) => o.status !== 'cancelled');
    const aov = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

    const pendingReservations = data.reservations.filter((r) => r.status === 'confirmed').length;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      todayOrdersCount: data.orders.length,
      averageOrderValue: Math.round(aov * 100) / 100,
      tableOccupancyRate: Math.round(occupancyRate),
      activeOrdersCount: activeOrders,
      pendingReservations,
    };
  },
};
