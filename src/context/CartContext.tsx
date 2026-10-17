'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, SelectedOption, OrderType } from '@/lib/types';
import { PROMO_CODES } from '@/lib/sampleData';

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  promoCode: string;
  discount: number;
  promoError: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  tipPercent: number;
  setTipPercent: (percent: number) => void;
  addItem: (menuItem: MenuItem, quantity: number, options: SelectedOption[], instructions?: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  tip: number;
  total: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('T-01');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('dinedesk_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedOrderType = localStorage.getItem('dinedesk_orderType') as OrderType;
      if (savedOrderType) {
        setOrderType(savedOrderType);
      }
      const savedTable = localStorage.getItem('dinedesk_table');
      if (savedTable) {
        setTableNumber(savedTable);
      }
    } catch (e) {
      console.error('Could not load cart from local storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dinedesk_cart', JSON.stringify(items));
      localStorage.setItem('dinedesk_orderType', orderType);
      localStorage.setItem('dinedesk_table', tableNumber);
    }
  }, [items, orderType, tableNumber, isLoaded]);

  const addItem = (
    menuItem: MenuItem,
    quantity: number,
    options: SelectedOption[],
    instructions?: string
  ) => {
    // Generate unique ID based on item ID and selected options
    const optionsKey = options
      .map((o) => `${o.groupName}:${o.optionName}`)
      .sort()
      .join('|');
    const cartItemId = `${menuItem.id}-${optionsKey}-${instructions || ''}`;

    const optionsAdditionalPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const unitPrice = menuItem.price + optionsAdditionalPrice;

    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? {
                ...i,
                quantity: i.quantity + quantity,
                itemTotalPrice: (i.quantity + quantity) * unitPrice,
              }
            : i
        );
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem,
            quantity,
            selectedOptions: options,
            specialInstructions: instructions,
            itemTotalPrice: quantity * unitPrice,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const optionsAdditionalPrice = item.selectedOptions.reduce(
            (sum, opt) => sum + opt.price,
            0
          );
          const unitPrice = item.menuItem.price + optionsAdditionalPrice;
          return {
            ...item,
            quantity,
            itemTotalPrice: quantity * unitPrice,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setPromoError('');
    localStorage.removeItem('dinedesk_cart');
  };

  const subtotal = items.reduce((sum, item) => sum + item.itemTotalPrice, 0);

  // Promo Code Validation
  let discount = 0;
  if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
    const promo = PROMO_CODES[promoCode.toUpperCase()];
    if (subtotal >= promo.minSpend) {
      discount = (subtotal * promo.discountPercent) / 100;
    }
  }

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    const promo = PROMO_CODES[cleanCode];
    if (!promo) {
      setPromoError('Invalid coupon code. Try DINE10, DINE20, or WELCOME50.');
      return false;
    }

    if (subtotal < promo.minSpend) {
      setPromoError(`Minimum spend of $${promo.minSpend} required for this coupon.`);
      return false;
    }

    setPromoCode(cleanCode);
    setPromoError('');
    return true;
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoError('');
  };

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = Number((discountedSubtotal * 0.05).toFixed(2)); // 5% tax
  const serviceCharge = orderType === 'dine-in' ? Number((discountedSubtotal * 0.10).toFixed(2)) : 0; // 10% dine-in service
  const tip = Number(((discountedSubtotal * tipPercent) / 100).toFixed(2));
  const total = Number((discountedSubtotal + tax + serviceCharge + tip).toFixed(2));
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
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
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        tax,
        serviceCharge,
        tip,
        total,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
