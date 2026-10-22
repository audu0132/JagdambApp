# Jagdamb Enterprises — Mobile E-Commerce App (Phase 1)

Modern, professional cross-platform mobile e-commerce application built for **Jagdamb Enterprises**, the leading dairy equipment and milking automation supplier based in Baramati, Maharashtra ([https://www.jagdambenterprises.co.in/](https://www.jagdambenterprises.co.in/)).

Built with **React Native**, **Expo SDK 58**, and **TypeScript**.

---

## 📱 Features Delivered in Phase 1

### 1. Shopping Home Screen
- **Brand Header**: Custom header featuring Jagdamb Enterprises identity, location badge (*Baramati • Dairy Solutions*), and live Wishlist & Cart counter badges.
- **Search Bar**: Live search with clear action, query status indicator, and match counter.
- **Promotional Carousel**: Highlighting automatic milking machines, 100% genuine replacement spare parts, and ultrasonic milk analyzers.
- **Category Filter**: Horizontal category pills with icons, item counts, and Marathi titles (*मिल्किंग मशीन, मिल्क अ‍ॅनालायझर, क्रीम सेपरेटर, स्पेअर पार्ट्स*).
- **Quick Filters**: One-tap filters for *All Products*, *🔥 Best Sellers*, *🏷️ 15%+ Off*, and *⭐ 4.8★ & Above*.
- **Pull-to-Refresh**: Seamless pull-to-refresh mechanism with animated loading state.

### 2. Product Catalog & Cards
- **Rich Product Information**: High-resolution imagery, brand tag, model numbers, Marathi product titles, rating stars, and review counts.
- **Pricing & Discounts**: Clear MRP strikethrough, discounted price in ₹ (INR), and discount percentage badges.
- **Stock Availability**: Live inventory indicator (*In Stock (count left)* vs *Out of Stock / Sold Out* overlay).
- **Interactive Actions**: Quick Add to Cart button, in-card stepper quantity controls if already in cart, and heart wishlist toggle.

### 3. Product Details Screen
- **Image Gallery**: Large hero product image with thumbnail gallery switcher and discount ribbon.
- **Specifications Table**: Detailed technical specifications (Motor power, bucket capacity, voltage, vacuum displacement, disc speed).
- **Key Features**: Bulleted breakdown of farmer-centric benefits and safety mechanisms.
- **Warranty & Assurance**: Jagdamb Enterprises authentic warranty card and Baramati store service support guarantee.
- **Sticky Bottom Action Bar**: Quantity selector, Add to Cart (with current cart quantity indicator), and Store Inquiry CTA.

### 4. Shopping Cart & Quantity Controls
- **Item Breakdown**: Thumbnail, product name, brand, per-unit price, and line-item total.
- **Quantity Controls**: Reusable `+` / `-` controls with trash icon on minimum limit and instant subtotal calculation.
- **Price Summary**: Accurate calculation of Subtotal, 18% GST (Machinery standard), Delivery fee (Free for orders > ₹5,000, else ₹250), and Total Savings.
- **Store Location & Order Confirmation Modal**: Phase 1 order summary modal previewing the quotation and order pickup without processing real payments yet.
- **Clear Cart**: Safe confirmation alert before clearing all items.

### 5. Wishlist
- **Persistent Local State**: Fast addition and removal of favorite machinery and spare parts.
- **One-Tap Move to Cart**: Instantly moves an in-stock product to the active cart.
- **Badge Counter**: Synchronized counter across the top header and bottom navigation tab.

### 6. Empty & Loading States
- **Empty Search State**: Informative prompt with one-tap reset.
- **Empty Cart State**: Graphic and CTA to explore the dairy catalog.
- **Empty Wishlist State**: Guided prompt to browse equipment.
- **Loading Skeleton**: Smooth indicator during catalog refreshes.

---

## 🛠️ Project Structure

```text
JagdambApp/
├── App.tsx                      # Root component with SafeAreaProvider & routing
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript strict configuration
└── src/
    ├── constants/
    │   └── theme.ts             # Colors, typography, spacing, and radius tokens
    ├── types/
    │   └── product.ts           # Product, Category, Cart, and Wishlist types
    ├── data/
    │   ├── categories.ts        # Category metadata with Marathi translations
    │   └── products.ts          # Realistic dairy equipment catalog
    ├── context/
    │   └── AppContext.tsx       # State management (Cart, Wishlist, Search, Tabs)
    ├── components/
    │   ├── Header.tsx           # Brand header with counters
    │   ├── SearchBar.tsx        # Search input with live results counter
    │   ├── BannerCarousel.tsx   # Promotional banner carousel
    │   ├── CategoryList.tsx     # Horizontal category selector
    │   ├── ProductCard.tsx      # Product card with badges & quantity controls
    │   ├── QuantityControl.tsx  # Reusable +/- stepper
    │   ├── EmptyState.tsx       # Reusable empty state view
    │   ├── LoadingSkeleton.tsx  # Loading state indicator
    │   ├── Toast.tsx            # Floating action notification
    │   └── BottomTabBar.tsx     # Mobile bottom tab navigation
    └── screens/
        ├── HomeScreen.tsx       # Home catalog screen
        ├── ProductDetailsScreen.tsx # Full product specification & details
        ├── CartScreen.tsx       # Cart & order breakdown
        └── WishlistScreen.tsx   # Saved products screen
```

---

## 🚀 Setup and Running Instructions

### Prerequisites
- Node.js (v18+)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Quality Checks
```bash
# Typecheck TypeScript (zero errors)
npx tsc --noEmit

# Run Expo configuration and dependency diagnosis (20/20 passed)
npx expo-doctor
```

### 3. Start Development Server
```bash
npx expo start
```

- Press `a` in the terminal to open on an Android emulator or connected device.
- Press `i` to open on an iOS simulator (macOS required).
- Scan the QR code using the **Expo Go** app on your physical device.

---

## 📋 Completed Features & Known Limitations (Phase 1)

### Completed in Phase 1:
- [x] Shared Android & iOS codebase with Expo SDK 58 & TypeScript.
- [x] Responsive layout with safe area handling for notches and dynamic islands.
- [x] Search, category chips, and filter toggles.
- [x] Rich realistic catalog tailored to Jagdamb Enterprises Baramati dairy business.
- [x] Interactive Product Details with specification table and image switcher.
- [x] Cart management with live quantity stepper, item removal, and auto-calculated tax & shipping.
- [x] Wishlist with "Move to Cart" functionality.
- [x] Accessible empty and loading states.
- [x] 100% TypeScript type check and 20/20 Expo Doctor checks passed.

### Known Limitations (Scheduled for Phase 2):
1. **Local State Only**: Cart and wishlist are maintained in memory; Phase 2 will introduce persistent storage (`AsyncStorage` / SQLite) and user authentication.
2. **Payments Not Integrated**: In compliance with Phase 1 instructions, payments are previewed as quotations / direct store orders; Phase 2 will add Razorpay / UPI gateway integration.
3. **Backend API**: The catalog currently uses realistic static data; Phase 2 will connect to a REST/GraphQL API for dynamic inventory synchronization.
