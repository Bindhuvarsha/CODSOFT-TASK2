import { MenuItem, RestaurantTable, Reservation, Order } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: 'm1',
    name: 'Truffle & Wild Mushroom Bruschetta',
    description: 'Toasted artisan sourdough rubbed with garlic, topped with sautéed porcini & cremini mushrooms, white truffle oil, and shaved aged parmesan.',
    price: 12.50,
    category: 'Starters',
    dietary: 'veg',
    spiceLevel: 0,
    calories: 380,
    prepTimeMinutes: 12,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 142,
    optionGroups: [
      {
        id: 'bread',
        name: 'Bread Selection',
        required: true,
        options: [
          { name: 'Rustic Sourdough', price: 0 },
          { name: 'Gluten-Free Herb Focaccia', price: 1.50 }
        ]
      },
      {
        id: 'extras',
        name: 'Extra Toppings',
        options: [
          { name: 'Extra White Truffle Drizzle', price: 2.00 },
          { name: 'Buffalo Mozzarella', price: 2.50 }
        ]
      }
    ]
  },
  {
    id: 'm2',
    name: 'Crispy Calamari Fritti',
    description: 'Tender squid rings lightly dusted with seasoned semolina, flash-fried crisp, served with charred lemon and smoked paprika aioli.',
    price: 14.00,
    category: 'Starters',
    dietary: 'non-veg',
    spiceLevel: 1,
    calories: 450,
    prepTimeMinutes: 10,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: false,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 98,
    optionGroups: [
      {
        id: 'dip',
        name: 'Choice of Dip',
        required: true,
        options: [
          { name: 'Smoked Paprika Aioli', price: 0 },
          { name: 'Spicy Marinara', price: 0 },
          { name: 'Tartar Sauce', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'm3',
    name: 'Smoked Jalapeño & Cheddar Croquettes',
    description: 'Golden fried panko croquettes oozing with sharp white cheddar, fire-roasted jalapeños, and sweet corn purée.',
    price: 10.50,
    category: 'Starters',
    dietary: 'veg',
    spiceLevel: 2,
    calories: 410,
    prepTimeMinutes: 10,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 64
  },

  // Artisan Pizzas
  {
    id: 'm4',
    name: 'Signature Burrata & Prosciutto Pizza',
    description: '48-hour slow fermented sourdough crust, San Marzano tomato sauce, fresh creamy burrata ball, 18-month Parma prosciutto, hot honey, and basil.',
    price: 21.00,
    category: 'Artisan Pizzas',
    dietary: 'non-veg',
    spiceLevel: 1,
    calories: 820,
    prepTimeMinutes: 18,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 230,
    optionGroups: [
      {
        id: 'crust',
        name: 'Crust Style',
        required: true,
        options: [
          { name: 'Napolitana Thin Crust', price: 0 },
          { name: 'Stuffed Garlic Crust', price: 3.00 },
          { name: 'Gluten-Free Cauliflower Crust', price: 3.50 }
        ]
      },
      {
        id: 'toppings',
        name: 'Extra Toppings',
        options: [
          { name: 'Hot Honey Drizzle', price: 1.50 },
          { name: 'Kalamata Olives', price: 1.50 },
          { name: 'Arugula Salad on Top', price: 1.50 }
        ]
      }
    ]
  },
  {
    id: 'm5',
    name: 'Quattro Formaggi & Fig Pizza',
    description: 'Bianca base with Fior di latte mozzarella, Gorgonzola Dolce, Fontina, aged Pecorino, caramelised mission figs, and fresh rosemary.',
    price: 19.50,
    category: 'Artisan Pizzas',
    dietary: 'veg',
    spiceLevel: 0,
    calories: 780,
    prepTimeMinutes: 16,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 112
  },
  {
    id: 'm6',
    name: 'Fiery Diavola & Nduja',
    description: 'Rich tomato base, spicy Calabrian nduja sausage, hot soppressata salami, chili-infused mozzarella, and pickled jalapeños.',
    price: 20.00,
    category: 'Artisan Pizzas',
    dietary: 'non-veg',
    spiceLevel: 3,
    calories: 850,
    prepTimeMinutes: 15,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 88
  },

  // Signature Mains
  {
    id: 'm7',
    name: 'Pan-Seared Chilean Sea Bass',
    description: 'Sustainably caught sea bass fillet with crispy golden skin, served over saffron cauliflower purée, blistered asparagus, and lemon-caper beurre blanc.',
    price: 32.00,
    category: 'Signature Mains',
    dietary: 'non-veg',
    spiceLevel: 0,
    calories: 590,
    prepTimeMinutes: 22,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 175,
    optionGroups: [
      {
        id: 'doneness',
        name: 'Prep Preference',
        required: true,
        options: [
          { name: 'Chef Recommended (Crispy Skin, Tender Flakes)', price: 0 },
          { name: 'Well Done', price: 0 }
        ]
      },
      {
        id: 'sides',
        name: 'Upgrade Side',
        options: [
          { name: 'Truffle Parmesan Fries', price: 3.50 },
          { name: 'Grilled King Oyster Mushrooms', price: 4.00 }
        ]
      }
    ]
  },
  {
    id: 'm8',
    name: 'Prime Black Angus Ribeye (300g)',
    description: '28-day dry-aged USDA Prime ribeye steak, char-grilled to order, accompanied by roasted bone marrow butter, confit garlic, and red wine demi-glace.',
    price: 36.50,
    category: 'Signature Mains',
    dietary: 'non-veg',
    spiceLevel: 0,
    calories: 940,
    prepTimeMinutes: 25,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    rating: 4.9,
    reviewsCount: 205,
    optionGroups: [
      {
        id: 'meat-temp',
        name: 'Steak Doneness',
        required: true,
        options: [
          { name: 'Rare (Cool red center)', price: 0 },
          { name: 'Medium-Rare (Warm red center - Recommended)', price: 0 },
          { name: 'Medium (Warm pink center)', price: 0 },
          { name: 'Medium-Well (Slight pink)', price: 0 },
          { name: 'Well Done (Thoroughly cooked)', price: 0 }
        ]
      },
      {
        id: 'sauce',
        name: 'Sauce Choice',
        required: true,
        options: [
          { name: 'Green Peppercorn Cognac Sauce', price: 0 },
          { name: 'Chimichurri Herb Sauce', price: 0 },
          { name: 'Classic Red Wine Demi-Glace', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'm9',
    name: 'Wild Forest Morel & Asparagus Risotto',
    description: 'Creamy Carnaroli rice simmered in slow-cooked vegetable velouté with braised morels, tender green asparagus tips, mascarpone, and fresh chives.',
    price: 22.00,
    category: 'Signature Mains',
    dietary: 'veg',
    spiceLevel: 0,
    calories: 620,
    prepTimeMinutes: 18,
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 94
  },

  // Burgers & Sandwiches
  {
    id: 'm10',
    name: 'The Wagyu Truffle Smash Burger',
    description: 'Double smash Australian Wagyu beef patties, melted sharp gouda, caramelized shallot jam, black truffle mayonnaise on a toasted brioche bun.',
    price: 18.50,
    category: 'Burgers & Sandwiches',
    dietary: 'non-veg',
    spiceLevel: 0,
    calories: 890,
    prepTimeMinutes: 14,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 310,
    optionGroups: [
      {
        id: 'sides',
        name: 'Accompaniment',
        required: true,
        options: [
          { name: 'Crispy Rosemary Fries', price: 0 },
          { name: 'Sweet Potato Fries with Garlic Dip', price: 2.00 },
          { name: 'House Caesar Side Salad', price: 2.00 }
        ]
      },
      {
        id: 'additions',
        name: 'Burger Upgrades',
        options: [
          { name: 'Extra Wagyu Patty', price: 5.00 },
          { name: 'Crispy Smoked Bacon', price: 2.50 },
          { name: 'Sunny-Side Up Egg', price: 1.50 }
        ]
      }
    ]
  },
  {
    id: 'm11',
    name: 'Smoked Pulled Jackfruit Burger (Vegan)',
    description: 'Hickory-smoked tender shredded jackfruit in craft chipotle BBQ glaze, crisp apple cider slaw, and vegan garlic aioli in a vegan pretzel bun.',
    price: 16.00,
    category: 'Burgers & Sandwiches',
    dietary: 'vegan',
    spiceLevel: 1,
    calories: 520,
    prepTimeMinutes: 12,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 78
  },

  // Pasta & Bowls
  {
    id: 'm12',
    name: 'Handcrafted Tagliolini al Tartufo',
    description: 'Fresh egg ribbon pasta rolled in house daily, tossed in cultured butter emulsion, cracked black pepper, 24-month Parmigiano-Reggiano, and freshly shaved black truffle.',
    price: 24.00,
    category: 'Pasta & Bowls',
    dietary: 'veg',
    spiceLevel: 0,
    calories: 680,
    prepTimeMinutes: 15,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    rating: 4.9,
    reviewsCount: 162
  },
  {
    id: 'm13',
    name: 'Spicy Tiger Prawn Rigatoni',
    description: 'Bronze-die rigatoni sautéed with jumbo wild tiger prawns, slow-cooked San Marzano arrabbiata sauce, roasted garlic, baby spinach, and fresh basil oil.',
    price: 23.50,
    category: 'Pasta & Bowls',
    dietary: 'non-veg',
    spiceLevel: 2,
    calories: 710,
    prepTimeMinutes: 16,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 119
  },

  // Desserts
  {
    id: 'm14',
    name: 'Deconstructed Tiramisù al Marsala',
    description: 'Espresso-soaked ladyfingers enveloped in whipped mascarpone sabayon, dusted with Valrhona 70% cocoa powder, and dark chocolate pearls.',
    price: 9.50,
    category: 'Desserts',
    dietary: 'veg',
    spiceLevel: 0,
    calories: 420,
    prepTimeMinutes: 8,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 220
  },
  {
    id: 'm15',
    name: 'Molten Belgian Chocolate Lava Cake',
    description: 'Warm dark chocolate souffle with a flowing ganache center, served alongside artisanal Madagascar vanilla bean gelato and raspberry coulis.',
    price: 11.00,
    category: 'Desserts',
    dietary: 'veg',
    spiceLevel: 0,
    calories: 550,
    prepTimeMinutes: 12,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isChefSpecial: true,
    rating: 5.0,
    reviewsCount: 280
  },

  // Beverages & Mocktails
  {
    id: 'm16',
    name: 'Smoked Rosemary Blackberry Fizz',
    description: 'Fresh organic muddled blackberries, fresh lime juice, agave nectar, topped with sparkling elderflower tonic and a torched fragrant rosemary sprig.',
    price: 7.50,
    category: 'Beverages & Mocktails',
    dietary: 'vegan',
    spiceLevel: 0,
    calories: 120,
    prepTimeMinutes: 5,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 85
  },
  {
    id: 'm17',
    name: 'Passionfruit Mango Chill & Mint',
    description: 'Tropical passionfruit puree, sweet Alphonso mango nectar, crushed mint leaves, lime zest, and mineral soda on shaved pebble ice.',
    price: 7.00,
    category: 'Beverages & Mocktails',
    dietary: 'vegan',
    spiceLevel: 0,
    calories: 140,
    prepTimeMinutes: 5,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 72
  }
];

export const INITIAL_TABLES: RestaurantTable[] = [
  { id: 't1', number: 'T-01', capacity: 2, area: 'Indoor Main', status: 'available' },
  { id: 't2', number: 'T-02', capacity: 2, area: 'Indoor Main', status: 'occupied', currentOrderId: 'ord-101', currentGuestName: 'Elena Rostova', occupiedSince: '2026-10-17T18:15:00Z' },
  { id: 't3', number: 'T-03', capacity: 4, area: 'Indoor Main', status: 'reserved', currentGuestName: 'Marcus Vance' },
  { id: 't4', number: 'T-04', capacity: 4, area: 'Indoor Main', status: 'available' },
  { id: 't5', number: 'T-05', capacity: 6, area: 'Indoor Main', status: 'occupied', currentOrderId: 'ord-102', currentGuestName: 'David Kim', occupiedSince: '2026-10-17T18:30:00Z' },
  { id: 't6', number: 'T-06', capacity: 6, area: 'Indoor Main', status: 'cleaning' },
  
  { id: 't7', number: 'R-01', capacity: 2, area: 'Rooftop Terrace', status: 'available' },
  { id: 't8', number: 'R-02', capacity: 4, area: 'Rooftop Terrace', status: 'occupied', currentOrderId: 'ord-103', currentGuestName: 'Sophia Lin', occupiedSince: '2026-10-17T18:05:00Z' },
  { id: 't9', number: 'R-03', capacity: 4, area: 'Rooftop Terrace', status: 'available' },
  { id: 't10', number: 'R-04', capacity: 6, area: 'Rooftop Terrace', status: 'reserved', currentGuestName: 'Dr. Robert Hayes' },
  
  { id: 't11', number: 'P-01', capacity: 4, area: 'Patio Garden', status: 'available' },
  { id: 't12', number: 'P-02', capacity: 4, area: 'Patio Garden', status: 'available' },
  { id: 't13', number: 'P-03', capacity: 8, area: 'Patio Garden', status: 'occupied', currentOrderId: 'ord-104', currentGuestName: 'Aarav Patel', occupiedSince: '2026-10-17T17:50:00Z' },
  
  { id: 't14', number: 'VIP-1', capacity: 8, area: 'Private VIP Lounge', status: 'reserved', currentGuestName: 'Catherine Zeta' },
  { id: 't15', number: 'VIP-2', capacity: 10, area: 'Private VIP Lounge', status: 'available' }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    bookingCode: 'DD-8491',
    customerName: 'Marcus Vance',
    customerPhone: '+1 (555) 234-8901',
    customerEmail: 'marcus.v@example.com',
    guestsCount: 4,
    date: '2026-10-17',
    timeSlot: '19:30',
    seatingArea: 'Indoor Main',
    occasion: 'Anniversary',
    specialRequests: 'Quiet corner table with candle setup if possible.',
    status: 'confirmed',
    assignedTable: 'T-03',
    createdAt: '2026-10-16T14:20:00Z'
  },
  {
    id: 'res-2',
    bookingCode: 'DD-9102',
    customerName: 'Dr. Robert Hayes',
    customerPhone: '+1 (555) 789-1234',
    customerEmail: 'robert.hayes@medcenter.org',
    guestsCount: 6,
    date: '2026-10-17',
    timeSlot: '20:00',
    seatingArea: 'Rooftop Terrace',
    occasion: 'Business Dinner',
    specialRequests: 'Wine pairing menu requested.',
    status: 'confirmed',
    assignedTable: 'R-04',
    createdAt: '2026-10-15T09:15:00Z'
  },
  {
    id: 'res-3',
    bookingCode: 'DD-6543',
    customerName: 'Catherine Zeta',
    customerPhone: '+1 (555) 456-7890',
    customerEmail: 'catherine.z@company.com',
    guestsCount: 8,
    date: '2026-10-17',
    timeSlot: '20:30',
    seatingArea: 'Private VIP Lounge',
    occasion: 'Birthday Celebration',
    specialRequests: 'Sparkling wine on arrival and custom birthday dessert.',
    status: 'confirmed',
    assignedTable: 'VIP-1',
    createdAt: '2026-10-14T11:00:00Z'
  },
  {
    id: 'res-4',
    bookingCode: 'DD-3321',
    customerName: 'Liam O’Connor',
    customerPhone: '+1 (555) 901-2345',
    customerEmail: 'liam.oc@example.com',
    guestsCount: 2,
    date: '2026-10-18',
    timeSlot: '19:00',
    seatingArea: 'Patio Garden',
    occasion: 'Date Night',
    specialRequests: 'Outdoor heaters on please if chilly.',
    status: 'confirmed',
    createdAt: '2026-10-17T11:45:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#DD-101',
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: 'dine-in',
    status: 'served',
    items: [
      {
        cartItemId: 'ci-1',
        menuItem: INITIAL_MENU_ITEMS[0],
        quantity: 1,
        selectedOptions: [{ groupName: 'Bread Selection', optionName: 'Rustic Sourdough', price: 0 }],
        itemTotalPrice: 12.50
      },
      {
        cartItemId: 'ci-2',
        menuItem: INITIAL_MENU_ITEMS[3],
        quantity: 1,
        selectedOptions: [{ groupName: 'Crust Style', optionName: 'Napolitana Thin Crust', price: 0 }],
        itemTotalPrice: 21.00
      },
      {
        cartItemId: 'ci-3',
        menuItem: INITIAL_MENU_ITEMS[15],
        quantity: 2,
        selectedOptions: [],
        itemTotalPrice: 15.00
      }
    ],
    customer: {
      name: 'Elena Rostova',
      phone: '+1 (555) 345-6789',
      tableNumber: 'T-02'
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    subtotal: 48.50,
    discount: 0,
    tax: 2.43,
    serviceCharge: 4.85,
    tip: 7.00,
    total: 62.78,
    estimatedPrepTimeMinutes: 18,
    readyAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-102',
    orderNumber: '#DD-102',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    type: 'dine-in',
    status: 'preparing',
    items: [
      {
        cartItemId: 'ci-4',
        menuItem: INITIAL_MENU_ITEMS[7], // Prime Ribeye
        quantity: 2,
        selectedOptions: [
          { groupName: 'Steak Doneness', optionName: 'Medium-Rare (Warm red center - Recommended)', price: 0 },
          { groupName: 'Sauce Choice', optionName: 'Classic Red Wine Demi-Glace', price: 0 }
        ],
        specialInstructions: 'No garlic on one of the steaks please.',
        itemTotalPrice: 73.00
      },
      {
        cartItemId: 'ci-5',
        menuItem: INITIAL_MENU_ITEMS[1], // Calamari
        quantity: 1,
        selectedOptions: [{ groupName: 'Choice of Dip', optionName: 'Smoked Paprika Aioli', price: 0 }],
        itemTotalPrice: 14.00
      }
    ],
    customer: {
      name: 'David Kim',
      phone: '+1 (555) 782-9011',
      tableNumber: 'T-05'
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    subtotal: 87.00,
    discount: 8.70,
    promoCode: 'DINE10',
    tax: 3.92,
    serviceCharge: 7.83,
    tip: 10.00,
    total: 100.05,
    estimatedPrepTimeMinutes: 25
  },
  {
    id: 'ord-103',
    orderNumber: '#DD-103',
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    type: 'dine-in',
    status: 'placed',
    items: [
      {
        cartItemId: 'ci-6',
        menuItem: INITIAL_MENU_ITEMS[9], // Wagyu Burger
        quantity: 2,
        selectedOptions: [
          { groupName: 'Accompaniment', optionName: 'Crispy Rosemary Fries', price: 0 },
          { groupName: 'Burger Upgrades', optionName: 'Crispy Smoked Bacon', price: 2.50 }
        ],
        itemTotalPrice: 42.00
      },
      {
        cartItemId: 'ci-7',
        menuItem: INITIAL_MENU_ITEMS[16], // Passionfruit Mango Chill
        quantity: 2,
        selectedOptions: [],
        itemTotalPrice: 14.00
      }
    ],
    customer: {
      name: 'Sophia Lin',
      phone: '+1 (555) 912-3456',
      tableNumber: 'R-02'
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    subtotal: 56.00,
    discount: 0,
    tax: 2.80,
    serviceCharge: 5.60,
    tip: 5.00,
    total: 69.40,
    estimatedPrepTimeMinutes: 15
  },
  {
    id: 'ord-104',
    orderNumber: '#DD-104',
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    type: 'delivery',
    status: 'ready',
    items: [
      {
        cartItemId: 'ci-8',
        menuItem: INITIAL_MENU_ITEMS[4], // Quattro Formaggi Pizza
        quantity: 1,
        selectedOptions: [],
        itemTotalPrice: 19.50
      },
      {
        cartItemId: 'ci-9',
        menuItem: INITIAL_MENU_ITEMS[11], // Tagliolini
        quantity: 1,
        selectedOptions: [],
        itemTotalPrice: 24.00
      },
      {
        cartItemId: 'ci-10',
        menuItem: INITIAL_MENU_ITEMS[14], // Molten Lava Cake
        quantity: 2,
        selectedOptions: [],
        itemTotalPrice: 22.00
      }
    ],
    customer: {
      name: 'Jonathan Miller',
      phone: '+1 (555) 678-4321',
      deliveryAddress: 'Apt 4B, 742 Evergreen Terrace, Downtown',
      notes: 'Please leave at front door, ring doorbell.'
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    subtotal: 65.50,
    discount: 13.10,
    promoCode: 'DINE20',
    tax: 2.62,
    serviceCharge: 0,
    tip: 8.00,
    total: 63.02,
    estimatedPrepTimeMinutes: 20,
    readyAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  }
];

export const PROMO_CODES: Record<string, { discountPercent: number; minSpend: number; description: string }> = {
  DINE10: { discountPercent: 10, minSpend: 30, description: '10% off on orders above $30' },
  DINE20: { discountPercent: 20, minSpend: 50, description: '20% off on orders above $50' },
  CHEFGIFT: { discountPercent: 15, minSpend: 40, description: 'Chef Special 15% discount' },
  WELCOME50: { discountPercent: 25, minSpend: 60, description: '25% grand welcome discount' }
};
