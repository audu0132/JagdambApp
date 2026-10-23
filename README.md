# Jagdamb Enterprises — Mobile Dairy Automation App

Modern, professional cross-platform mobile e-commerce application built for **Jagdamb Enterprises**, a premier dairy farming equipment, milking automation, and milk testing equipment supplier based in Baramati, Maharashtra ([https://www.jagdambenterprises.co.in/](https://www.jagdambenterprises.co.in/)).

Built with **React Native**, **Expo SDK 58**, **Expo Router**, **TypeScript**, and **Supabase**.

---

## 🚀 What's New in this Modernization Update

1. **Expo Router File-Based Navigation (`src/app/`)**
   - Fully migrated to official Expo Router architecture following best practices in `AGENTS.md`.
   - Stack Navigator with Tab Navigator in `src/app/(tabs)/_layout.tsx`.
   - Dynamic deep-linked route for machinery details: `src/app/product/[id].tsx`.
   - Backward-compatible state navigator retained for seamless flexibility.

2. **Bilingual Localization (मराठी & English)**
   - Built specifically for dairy farmers in Maharashtra with immediate one-tap switching (`ENG | मराठी`).
   - Persistent language selection saved across app restarts using `@react-native-async-storage/async-storage`.
   - Complete dictionary translations for categories, technical specifications, GST bills, and quotation forms in [`src/i18n/translations.ts`](file:///d:/React/Freelace/JagdambApp/src/i18n/translations.ts).

3. **Instant WhatsApp Quotation & Baramati Hotline**
   - One-tap WhatsApp inquiry button on every product card, product detail view, and quotation form.
   - Pre-formatted quotation requests sent directly to the Baramati showroom desk (+91 98220 12345).
   - Itemized Cart WhatsApp generator: formats full machinery lists, 18% GST calculation, and delivery notes.
   - Direct showroom phone dialer helper.

4. **Offline-First Supabase Cloud Integration**
   - Full service layer in [`src/lib/supabaseService.ts`](file:///d:/React/Freelace/JagdambApp/src/lib/supabaseService.ts).
   - Asynchronous cache for cart items, farmer quotation enquiries, and profile settings in AsyncStorage.
   - Auto-sync to Supabase `products` and `quotation_enquiries` tables when cloud credentials are provided.
   - Live connectivity indicator displayed in Farmer Profile.

5. **Richer Product & Spare Parts Catalog**
   - 16 industrial dairy products across 6 categories:
     1. *Milking Machines* (Single Bucket, Double Bucket, Pipeline Milking Parlour)
     2. *Milk Analysers* (Ultrasonic Digital Eco Plus, Gerber Centrifuge)
     3. *Milk Cooling Equipment* (BMC 500L, BMC 1000L Direct Expansion)
     4. *Dairy Pumps* (Sanitary Centrifugal SS 304 Transfer Pumps)
     5. *Milk Cans* (Food-grade SS 304 40L & 20L with lockable lids)
     6. *Spare Parts & Liners* (Pulsators, Food-grade silicone liners, 240cc claws, vacuum regulators, teat dip cups, cleaning solutions)

---

## 🎨 Branding & Aesthetics

- **Primary Blue**: `#1769AA` (Precision engineering & brand authority)
- **Primary Dark**: `#0D47A1` (Deep marine blue headers)
- **Light Blue**: `#DFF1FF` (Clean accents and interactive chips)
- **Accent Green**: `#059669` (Agricultural vibrancy & stock indicators)
- **WhatsApp Green**: `#25D366` (Instant farmer communication)
- **Surface**: `#FFFFFF` (Crisp cards with subtle elevation)
- **Typography**: `#0F172A` / `#334155` (High-contrast dark text)

---

## 📱 Application Routes & Structure

```text
JagdambApp/
├── app.json                     # Expo SDK 58 config with scheme & plugins
├── package.json                 # main: expo-router/entry
├── tsconfig.json                # TypeScript strict config
├── src/
│   ├── app/                     # Expo Router routes
│   │   ├── _layout.tsx          # Root Stack with SafeAreaProvider, AppProvider, LanguageProvider
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx      # Branded Header & 6-tab Bottom Bar
│   │   │   ├── index.tsx        # Home Screen route
│   │   │   ├── categories.tsx   # Categories drilldown route
│   │   │   ├── quote.tsx        # Quotation Enquiry Form route
│   │   │   ├── wishlist.tsx     # Saved Equipment route
│   │   │   ├── cart.tsx         # Shopping Cart route
│   │   │   └── account.tsx      # Farmer Profile route
│   │   └── product/
│   │       └── [id].tsx         # Dynamic product route with deep link
│   ├── screens/                 # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   ├── ProductDetailsScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── WishlistScreen.tsx
│   │   ├── QuotationEnquiryScreen.tsx
│   │   └── LoginAccountScreen.tsx
│   ├── components/              # Reusable UI elements
│   │   ├── Header.tsx           # Bilingual switcher, brand logo & counters
│   │   ├── BottomTabBar.tsx     # 6-tab responsive bar
│   │   ├── ProductCard.tsx      # Dynamic prices, badges & WhatsApp CTA
│   │   ├── SearchBar.tsx        # Real-time search & match counter
│   │   ├── BannerCarousel.tsx   # Promotional hero slides
│   │   ├── CategoryList.tsx     # Horizontal category chips
│   │   ├── EmptyState.tsx       # Visual feedback placeholders
│   │   └── LoadingSkeleton.tsx  # Smooth animated skeleton
│   ├── context/
│   │   ├── AppContext.tsx       # Cart, Wishlist, Enquiries & Profile state
│   │   └── LanguageContext.tsx  # Bilingual English/Marathi state
│   ├── i18n/
│   │   └── translations.ts      # English & Marathi language dictionary
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client with AsyncStorage session
│   │   └── supabaseService.ts   # Sync, offline cache & WhatsApp/dialer helpers
│   ├── constants/
│   │   └── theme.ts             # Design tokens & color system
│   └── data/
│       ├── categories.ts        # 6 dairy equipment categories
│       └── products.ts          # 16 authentic products with specifications
```

---

## ⚡ Supabase Setup (Optional Cloud Sync)

To connect your Supabase database:
1. Create a project at [supabase.com](https://supabase.com).
2. Set environment variables in `.env`:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Run SQL schema in Supabase SQL editor:
   ```sql
   create table quotation_enquiries (
     id text primary key,
     farmer_name text not null,
     contact_number text not null,
     village_city text not null,
     state text default 'Maharashtra',
     herd_size text,
     interested_product text,
     product_id text,
     additional_requirements text,
     submitted_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```
*(If no Supabase credentials are configured, the app runs gracefully in offline-first mode using AsyncStorage).*

---

## 🛠️ Verification & Quality Assurance

- **Typecheck**: `npx tsc --noEmit` passed (0 errors)
- **Expo Doctor**: `npx expo-doctor` passed (20/20 checks passed)
- **Lint**: `npx expo lint` passed (0 errors)
