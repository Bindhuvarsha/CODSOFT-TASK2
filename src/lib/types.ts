export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'gluten-free';

export interface MenuItemOption {
  name: string;
  price: number;
}

export interface MenuItemOptionGroup {
  id: string;
  name: string;
  required?: boolean;
  min?: number;
  max?: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Starters' | 'Artisan Pizzas' | 'Signature Mains' | 'Burgers & Sandwiches' | 'Pasta & Bowls' | 'Desserts' | 'Beverages & Mocktails';
  dietary: DietaryType;
  spiceLevel: 0 | 1 | 2 | 3; // 0=None, 1=Mild, 2=Medium, 3=Hot
  calories?: number;
  prepTimeMinutes: number;
  image: string;
  isAvailable: boolean;
  isChefSpecial?: boolean;
  isBestSeller?: boolean;
  optionGroups?: MenuItemOptionGroup[];
  rating?: number;
  reviewsCount?: number;
}

export interface SelectedOption {
  groupName: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  itemTotalPrice: number;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'card' | 'upi' | 'cash';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  tableNumber?: string;
  deliveryAddress?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  type: OrderType;
  status: OrderStatus;
  items: CartItem[];
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discount: number;
  promoCode?: string;
  tax: number;
  serviceCharge: number;
  tip: number;
  total: number;
  estimatedPrepTimeMinutes: number;
  readyAt?: string;
  completedAt?: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  area: 'Indoor Main' | 'Rooftop Terrace' | 'Patio Garden' | 'Private VIP Lounge';
  status: TableStatus;
  currentOrderId?: string;
  currentGuestName?: string;
  occupiedSince?: string;
}

export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  guestsCount: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "19:30"
  seatingArea: 'Indoor Main' | 'Rooftop Terrace' | 'Patio Garden' | 'Private VIP Lounge';
  specialRequests?: string;
  occasion?: string;
  status: ReservationStatus;
  assignedTable?: string;
  createdAt: string;
}

export interface DailyAnalytics {
  totalRevenue: number;
  todayOrdersCount: number;
  averageOrderValue: number;
  tableOccupancyRate: number;
  activeOrdersCount: number;
  pendingReservations: number;
}
