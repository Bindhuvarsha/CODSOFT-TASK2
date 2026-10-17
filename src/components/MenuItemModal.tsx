'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Flame, Sparkles, Check, Info } from 'lucide-react';
import { MenuItem, SelectedOption } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Initialize default options when item opens
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSpecialInstructions('');
      const defaults: SelectedOption[] = [];

      if (item.optionGroups) {
        item.optionGroups.forEach((group) => {
          if (group.required && group.options.length > 0) {
            defaults.push({
              groupName: group.name,
              optionName: group.options[0].name,
              price: group.options[0].price,
            });
          }
        });
      }
      setSelectedOptions(defaults);
    }
  }, [item]);

  if (!item) return null;

  const handleRadioOptionSelect = (groupName: string, optionName: string, price: number) => {
    setSelectedOptions((prev) => [
      ...prev.filter((o) => o.groupName !== groupName),
      { groupName, optionName, price },
    ]);
  };

  const handleCheckboxOptionToggle = (groupName: string, optionName: string, price: number) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o) => o.groupName === groupName && o.optionName === optionName);
      if (exists) {
        return prev.filter((o) => !(o.groupName === groupName && o.optionName === optionName));
      } else {
        return [...prev, { groupName, optionName, price }];
      }
    });
  };

  const optionsTotalPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const currentTotal = (item.price + optionsTotalPrice) * quantity;

  const handleAddToCart = () => {
    addItem(item, quantity, selectedOptions, specialInstructions.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" 
          onClick={onClose} 
        />

        {/* Modal Card */}
        <div className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200 dark:border-slate-800">
          
          {/* Header Image with Badges */}
          <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-800">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition shadow"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {item.isChefSpecial && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow">
                      <Sparkles className="w-3 h-3 fill-current" /> Chef's Special
                    </span>
                  )}
                  {item.dietary === 'veg' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow">
                      🌱 Vegetarian
                    </span>
                  )}
                  {item.dietary === 'vegan' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-700 text-white shadow">
                      🌿 100% Vegan
                    </span>
                  )}
                  {item.dietary === 'gluten-free' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-600 text-white shadow">
                      🌾 Gluten Free
                    </span>
                  )}
                  {item.dietary === 'non-veg' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow">
                      🍖 Non-Veg
                    </span>
                  )}
                  {item.spiceLevel > 0 && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow">
                      <Flame className="w-3 h-3 fill-current" />
                      {item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Medium' : 'Extra Hot'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold font-display text-white drop-shadow-sm">
                  {item.name}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-amber-400 drop-shadow">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto">
            
            {/* Description */}
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {item.calories && <span>🔥 {item.calories} kcal</span>}
                <span>⏱️ ~{item.prepTimeMinutes} mins prep</span>
                <span>⭐ {item.rating || 4.9} ({item.reviewsCount || 120} reviews)</span>
              </div>
            </div>

            {/* Option Groups (Radio or Checkbox) */}
            {item.optionGroups && item.optionGroups.map((group) => {
              const isRequired = group.required;
              return (
                <div key={group.id} className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {group.name}
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {isRequired ? 'Required' : 'Optional'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((opt) => {
                      const isSelected = selectedOptions.some(
                        (o) => o.groupName === group.name && o.optionName === opt.name
                      );
                      return (
                        <label
                          key={opt.name}
                          onClick={() => {
                            if (isRequired) {
                              handleRadioOptionSelect(group.name, opt.name, opt.price);
                            } else {
                              handleCheckboxOptionToggle(group.name, opt.name, opt.price);
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium cursor-pointer transition ${
                            isSelected
                              ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-200 font-semibold shadow-sm'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-${isRequired ? 'full' : 'md'} border flex items-center justify-center ${
                                isSelected
                                  ? 'bg-brand-600 border-brand-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{opt.name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            {opt.price > 0 ? `+${formatPrice(opt.price)}` : 'Free'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Special Kitchen Instructions / Allergies
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra dressing on the side, no peanuts, extra crispy..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
              />
            </div>

          </div>

          {/* Footer with Quantity & Add Button */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-extrabold text-sm text-slate-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add CTA */}
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-between px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <span>Add to Order Bag</span>
              <span>{formatPrice(currentTotal)}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
