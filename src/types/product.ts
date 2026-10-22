export type ProductCategory =
  | 'all'
  | 'milking-machines'
  | 'milk-analysers'
  | 'milk-cooling'
  | 'dairy-pumps'
  | 'milk-cans'
  | 'spare-parts';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  nameMarathi?: string;
  icon: string;
  description: string;
  itemCount: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export type PriceType = 'fixed' | 'on-request';

export interface Product {
  id: string;
  name: string;
  marathiName?: string;
  category: ProductCategory;
  modelNumber: string;
  brand: string;
  priceType: PriceType;
  price?: number;               // Present when priceType === 'fixed'
  originalPrice?: number;       // MRP when priceType === 'fixed'
  discountPercent?: number;     // Calculated discount %
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  additionalImages?: string[];
  description: string;
  features: string[];
  specifications: ProductSpec[];
  warranty: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: number;
}

export interface QuotationEnquiry {
  id: string;
  farmerName: string;
  contactNumber: string;
  villageOrCity: string;
  state: string;
  herdSize?: string;
  interestedProduct?: string;
  productId?: string;
  additionalRequirements: string;
  submittedAt: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  farmName?: string;
  herdSize?: string;
  location: string;
  isLoggedIn: boolean;
}

export type TabScreen =
  | 'home'
  | 'categories'
  | 'quote'
  | 'wishlist'
  | 'cart'
  | 'account';
