# Jagdamb Enterprises — Mobile E-Commerce App (Phase 1)

Modern, professional cross-platform mobile e-commerce application built for **Jagdamb Enterprises**, a leading dairy farming, milking automation, and milk testing equipment supplier based in Baramati, Maharashtra ([https://www.jagdambenterprises.co.in/](https://www.jagdambenterprises.co.in/)).

Built with **React Native**, **Expo SDK 58**, and **TypeScript**.

---

## 🎨 Branding & Aesthetics
- **Primary Blue**: `#1769AA` (Equipment authority & precision engineering)
- **Light Blue**: `#DFF1FF` (Clean accents and interactive chips)
- **Surface**: `#FFFFFF` (Crisp white cards)
- **Typography**: `#0F172A` / `#334155` (High-contrast, readable dark text)
- **Style**: Industrial and agricultural equipment aesthetic designed for dairy farmers and cooperative managers.

---

## 📱 7 Screens Delivered in Phase 1

1. **Home Screen** ([HomeScreen.tsx](file:///d:/React/Freelace/JagdambApp/src/screens/HomeScreen.tsx))
   - Brand header with Baramati location badge, Wishlist, Cart, and Account buttons.
   - Live search bar with instant query matching and count indicator.
   - Promotional carousel highlighting Milking Automation, 100% Genuine Spare Parts, and Ultrasonic Testers.
   - Quick category chips and filter toggles (*All Equipment*, *🔥 Popular*, *🏷️ 15%+ Off*, *⭐ 4.8★ & Above*).
   - Pull-to-refresh with smooth loading skeleton.

2. **Categories Screen** ([CategoriesScreen.tsx](file:///d:/React/Freelace/JagdambApp/src/screens/CategoriesScreen.tsx))
   - Dedicated drill-down view for the 6 provisional categories:
     1. *Milking Machines*
     2. *Milk Analysers*
     3. *Milk Cooling Equipment*
     4. *Dairy Pumps*
     5. *Milk Cans*
     6. *Spare Parts*
   - Each category displays its title, Marathi translation (*मिल्किंग मशीन, मिल्क कुलिंग, इ.*), icon, and item count.

3. **Product Details Screen** ([ProductDetailsScreen.tsx](file:///d:/React/Freelace/JagdambApp/src/screens/ProductDetailsScreen.tsx))
   - Image gallery viewer with thumbnail switcher and zoomable view.
   - Comprehensive technical specifications table (Motor power, bucket capacity, vacuum flow, voltage).
   - Key farmer benefits bullet points.
   - Authenticated warranty & Baramati technician service assurance.
   - **Contextual Actions**:
     - *Fixed-price items*: Quantity stepper (`+` / `-`) and *Add to Cart*.
     - *Heavy machinery marked Price on Request*: Prominent *Request Official Quotation* CTA routing directly into the inquiry form.

4. **Shopping Cart Screen** ([CartScreen.tsx](file:///d:/React/Freelace/JagdambApp/src/screens/CartScreen.tsx))
   - Item breakdown with thumbnails, unit price, quantity controls, and removal.
   - Accurate calculation of Subtotal, 18% GST (Machinery standard), Delivery fee (Free for orders > ₹5,000), and Total Savings.
   - Direct store pickup option notice in Kasba, Baramati.
   - Phase 1 quotation preview modal (no fake payments implemented).

5. **Wishlist Screen** ([WishlistScreen.tsx](file:///d:/React/Freelace/JagdambApp/src/screens/WishlistScreen.tsx))
   - Persistent local wishlist state with live badge counter.
   - One-tap *Move to Cart* for fixed-price items and *Request Quote* for on-request machinery.
   - Empty state with direct return to catalog.

6. **Login & Account Screen** ([LoginAccountScreen.tsx](file:///d:/React/Freelace/JagdambApp/src/screens/LoginAccountScreen.tsx))
   - Farmer profile card with farm name, herd size (cattle count), contact number, and shed address.
   - Editable farm profile saved locally.
   - Supabase connection readiness status badge.
   - Quick links to quotation requests and showroom support.

7. **Quotation Enquiry Form Screen** ([QuotationEnquiryScreen.tsx](file:///d:/React/Freelace/JagdambApp/src/screens/QuotationEnquiryScreen.tsx))
   - Dedicated form for dairy farmers requiring custom quotes on machinery (e.g. Bulk Milk Coolers, pipeline parlours, transfer pumps).
   - Form fields: Farmer/Enterprise Name, WhatsApp/Mobile, Village/Taluka/District, Herd Size, Equipment of Interest, and Shed/Power requirements.
   - Form validation, immediate submission confirmation, and inquiry history list.

---

## ⚡ Supabase Integration (Prepared for Phase 2)
- Supabase client initialized in [`src/lib/supabase.ts`](file:///d:/React/Freelace/JagdambApp/src/lib/supabase.ts) using `@supabase/supabase-js`.
- Environment variables template created in [`.env.example`](file:///d:/React/Freelace/JagdambApp/.env.example):
  ```bash
  EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
  ```
- No privileged secret keys are exposed. Safe fallback ensures zero runtime crashes during Phase 1 local development.

---

## 🛠️ Project Structure

```text
JagdambApp/
├── App.tsx                      # Root component with SafeAreaProvider & 7-screen routing
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript strict configuration
├── .env.example                 # Supabase environment variables template
└── src/
    ├── constants/
    │   └── theme.ts             # Brand colors (#1769AA, #DFF1FF), spacing & typography
    ├── types/
    │   └── product.ts           # Product, Category, Cart, Quotation & Profile types
    ├── lib/
    │   └── supabase.ts          # Supabase client setup & configuration helper
    ├── data/
    │   ├── categories.ts        # 6 provisional categories with Marathi names
    │   └── products.ts          # Fixed price & on-request dairy equipment catalogue
    ├── context/
    │   └── AppContext.tsx       # State management for Cart, Wishlist, Quotes & User
    ├── components/
    │   ├── Header.tsx           # Brand header with Account, Wishlist & Cart badges
    │   ├── SearchBar.tsx        # Search input with live results counter
    │   ├── BannerCarousel.tsx   # Promotional hero carousel
    │   ├── CategoryList.tsx     # Horizontal category selector
    │   ├── ProductCard.tsx      # Dual-mode card (Fixed price vs. Quote Required)
    │   ├── QuantityControl.tsx  # Reusable +/- stepper
    │   ├── EmptyState.tsx       # Reusable empty state view
    │   ├── LoadingSkeleton.tsx  # Loading state indicator
    │   ├── Toast.tsx            # Floating action notification
    │   └── BottomTabBar.tsx     # 5-tab mobile bottom navigation
    └── screens/
        ├── HomeScreen.tsx       # Home catalog screen
        ├── CategoriesScreen.tsx # Dedicated 6 categories drill-down
        ├── ProductDetailsScreen.tsx # Technical specs & contextual CTA
        ├── CartScreen.tsx       # Cart management & order summary
        ├── WishlistScreen.tsx   # Saved products screen
        ├── LoginAccountScreen.tsx # Farmer account & Supabase readiness
        └── QuotationEnquiryScreen.tsx # Dairy equipment quotation form
```

---

## 💻 Commands to Run and Test

```bash
# 1. Type-check with TypeScript (0 errors)
npx tsc --noEmit

# 2. Run Expo Doctor diagnostic suite (20/20 checks passed)
npx expo-doctor

# 3. Start Development Server
npx expo start
```
- Open in Web Browser: [`http://localhost:8081`](http://localhost:8081)
- Open on Physical Device: Launch **Expo Go**, tap **Enter URL manually**, and enter `exp://10.0.1.192:8081`.
