# DineDesk — Restaurant Ordering & Table Management Platform

> **CodSoft Web Development Internship — Task 2**  
> A complete modern restaurant ordering and table management platform supporting online digital menus, table reservations, multi-channel payments, live order tracking, and expedited kitchen operations.

---

## 🌟 Executive Summary

Traditional restaurants often battle order discrepancies, manual ticket writing, fragmented phone reservations, and chaotic kitchen lines. **DineDesk** eliminates friction by uniting four key stakeholders onto a single reactive platform:

1. **Gourmet Diners (Customers)**: Scan QR at tables or order from home with dietary filters, custom dish options, promo coupons, live bill-splitting, and real-time prep tracking.
2. **Kitchen Line Cooks & Expediter (KDS)**: Dedicated high-contrast Kitchen Display System with prep timers, color alerts, item strike-through checklists, and order advance buttons.
3. **Waitstaff & Floor Hosts**: Visual interactive floor plan across 4 zones (*Indoor Main*, *Rooftop Terrace*, *Patio Garden*, *Private VIP Lounge*) with real-time table statuses.
4. **Restaurant Managers & Admins**: Executive KPI metrics, menu catalog CRUD manager, reservations concierge, and financial sales ledger.

---

## 🚀 Key Feature Matrix

| Module | Core Capabilities |
| :--- | :--- |
| **Digital Guest Menu** | Categorized artisanal dishes, dietary chips (🌱 Veg, 🌿 Vegan, 🌾 Gluten-Free, 🍖 Non-Veg), spice meter (🌶️ Mild/Med/Hot), dish customizer modal (crusts, steak doneness, toppings), search by ingredients. |
| **Order Modes** | 🍽️ **Dine-In** (Table # auto-assigned), 🛍️ **Takeaway** (curbside pickup), 🛵 **Delivery** (address & courier notes). |
| **Smart Cart & Billing** | Subtotal, coupon discounts (`DINE10`, `DINE20`, `CHEFGIFT`, `WELCOME50`), sales tax (5%), dine-in service charge (10%), custom tip options, and **Split-The-Bill Calculator** (1 to 6 diners). |
| **Payment Simulator** | 💳 **Card Gateway** (simulated 256-bit SSL authentication), 📱 **Dynamic UPI QR Code** (simulated app scan for GPay/PhonePe/Paytm), 💵 **Cash on Delivery / Pay at Table**. |
| **Live Order Tracking** | 5-stage real-time timeline (*Placed ➔ Confirmed ➔ Cooking ➔ Ready ➔ Served/Delivered*), live estimated time countdown, customer details, printable tax invoice. |
| **Table Reservations** | Party size picker (1-10+), date & time slot selection (Lunch & Dinner sittings), atmospheric zone selection, celebration notes, instant booking confirmation code generation, booking status lookup. |
| **Kitchen Display (KDS)** | 4-column kanban (*New Orders, In Preparation, Ready to Serve, Completed*), live elapsed cook timer (turns red if > 20m!), strikethrough checklist, Web Audio kitchen order chime. |
| **Visual Floor Plan** | Color-coded table layout across 4 dining areas (*Available, Occupied, Reserved, Cleaning*), quick occupancy status switcher, seated guest assignment. |
| **Menu Catalog CRUD** | Add new dish recipes, edit prices and descriptions, toggle 86'd / out of stock status, remove dishes. |
| **Admin Analytics** | Gross sales, table occupancy rate %, active orders count, orders transaction history. |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom culinary warm amber / dark charcoal theme
- **Icons**: [Lucide React](https://lucide.dev/)
- **Micro-Interactions**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio Feedback**: Synthesized HTML5 / Web Audio API kitchen ticket bell chime
- **Persistence**: Auto-initializing resilient JSON & memory store adapter (`src/lib/db.ts`) with live polling synchronization
- **Database Schema**: [Prisma ORM](https://www.prisma.io/) schema configured for **PostgreSQL** (`prisma/schema.prisma`)

---

## 📂 Project Structure

```text
CODSOFT-TASK2/
├── prisma/
│   └── schema.prisma             # PostgreSQL Prisma models (User, MenuItem, Order, Table, Reservation)
├── src/
│   ├── app/
│   │   ├── admin/page.tsx        # Manager Console: Floor Plan, Menu CRUD, Reservations, Analytics
│   │   ├── checkout/page.tsx     # Payment Gateway Simulator & Bill Splitter
│   │   ├── kitchen/page.tsx      # Kitchen Display System (KDS) Live Kanban
│   │   ├── menu/page.tsx         # Digital Guest Menu with Search & Customizer
│   │   ├── orders/
│   │   │   ├── page.tsx          # Order Lookup & History Directory
│   │   │   └── [id]/page.tsx     # Real-Time Visual Order Tracker & Receipt
│   │   ├── reservations/page.tsx # Table Booking Engine & Confirmation Desk
│   │   ├── api/
│   │   │   ├── analytics/route.ts# Financials & Occupancy API
│   │   │   ├── menu/route.ts     # Menu CRUD endpoints
│   │   │   ├── orders/route.ts   # Order placement & status updates
│   │   │   ├── reservations/route.ts # Table booking API
│   │   │   └── tables/route.ts   # Floor plan table status API
│   │   ├── globals.css           # Tailwind base styles and scrollbar rules
│   │   ├── layout.tsx            # Root layout with fonts & context providers
│   │   └── page.tsx              # High-impact Hero Landing Page
│   ├── components/
│   │   ├── CartDrawer.tsx        # Slide-over order bag & checkout preview
│   │   ├── Footer.tsx            # Restaurant footer with hours & links
│   │   ├── MenuItemModal.tsx     # Dish customization dialog
│   │   ├── Navbar.tsx            # Header navigation with order bag counter
│   │   ├── OrderStatusBadge.tsx  # Dynamic status pill with animated dot
│   │   └── TableLayoutGrid.tsx   # Interactive restaurant floor map
│   ├── context/
│   │   ├── CartContext.tsx       # Shopping cart, tips, discount codes
│   │   └── RestaurantContext.tsx # Live orders, tables, reservations, sound
│   └── lib/
│       ├── db.ts                 # Resilient database adapter
│       ├── sampleData.ts         # Pre-seeded gourmet recipes, tables, orders
│       ├── types.ts              # Full TypeScript models
│       └── utils.ts              # Currency & datetime formatters
├── .env.example                  # Environment configuration (PostgreSQL)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js 18+** installed:
```bash
node -v
npm -v
```

### 2. Installation
Install dependencies:
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ PostgreSQL Database Configuration (Optional)

DineDesk includes a complete production-grade Prisma schema configured for PostgreSQL.

1. Create a `.env` file from `.env.example`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dinedesk?schema=public"
```

2. Generate Prisma Client & apply schema migrations:
```bash
npx prisma db push
```

*Note: DineDesk automatically runs out of the box with zero external dependencies using the integrated persistent local storage adapter.*

---

## 🎟️ Promo Codes for Testing

Test coupon discounts during checkout:
- `DINE10` — 10% discount on orders above $30
- `DINE20` — 20% discount on orders above $50
- `CHEFGIFT` — 15% discount on orders above $40
- `WELCOME50` — 25% discount on orders above $60

---

## 👨‍🍳 User Roles Walkthrough

1. **Customer Flow**:
   - Visit `/menu` ➔ Filter by Vegetarian or Chef Special ➔ Click dish ➔ Choose options ➔ Add to Bag.
   - Click "Order Bag" ➔ Proceed to Checkout ➔ Select Table number or Delivery address ➔ Choose Card/UPI ➔ Click Pay.
   - Watch confetti explosion and get redirected to `/orders/[id]` live tracking timeline.
2. **Kitchen Staff Flow**:
   - Open `/kitchen` in another tab or side-by-side window.
   - Hear audio chime when the customer's order arrives in "New Orders".
   - Click "Accept & Start Cooking" ➔ Cook timer starts ticking.
   - Check off items as they finish ➔ Click "Plated & Ready to Expedite".
   - Notice the customer's order tracker page in the first tab updates in real-time!
3. **Table Booking Flow**:
   - Visit `/reservations` ➔ Choose party size, date, Rooftop Terrace ➔ Confirm.
   - Instant confirmation with code `DD-XXXX` appears.
4. **Floor Manager Flow**:
   - Visit `/admin` ➔ View visual floor layout ➔ Click occupied table ➔ Toggle to "Cleaning" or "Available".

---

## 📜 License
Developed as part of the **CodSoft Internship Program (Task 2: Restaurant Ordering Platform)**.
Open-source under the MIT License.
