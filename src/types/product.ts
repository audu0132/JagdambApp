export type ProductCategory =
  | 'all'
  | 'milking-machines'
  | 'milk-analysers'
  | 'cream-separators'
  | 'spares-accessories'
  | 'cans-testing';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  nameMarathi?: string;
  icon: string;
  itemCount: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  marathiName?: string;
  category: ProductCategory;
  modelNumber: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
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

export type TabScreen = 'home' | 'search' | 'wishlist' | 'cart';
