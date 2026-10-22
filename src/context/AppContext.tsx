import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  Product,
  ProductCategory,
  CartItem,
  WishlistItem,
  TabScreen,
  QuotationEnquiry,
  UserProfile,
} from '../types/product';
import { PRODUCTS } from '../data/products';

interface AppContextType {
  // Navigation & View state
  activeTab: TabScreen;
  setActiveTab: (tab: TabScreen) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  quotationTargetProduct: Product | null;
  setQuotationTargetProduct: (product: Product | null) => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (category: ProductCategory) => void;
  filteredProducts: Product[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;

  // Cart operations
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => {
    subtotal: number;
    gst: number;
    delivery: number;
    total: number;
    savings: number;
  };
  getCartCount: () => number;
  getCartItemQuantity: (productId: string) => number;

  // Wishlist operations
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;

  // Quotation Enquiries
  enquiries: QuotationEnquiry[];
  submitEnquiry: (enquiry: Omit<QuotationEnquiry, 'id' | 'submittedAt'>) => void;
  requestProductQuote: (product: Product) => void;

  // User Profile / Auth State (Phase 1 local, prepared for Supabase)
  user: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  logoutUser: () => void;

  // Feedback Notification
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'guest-1',
  fullName: 'Dattatray Shinde',
  phoneNumber: '+91 98220 12345',
  email: 'dattatray.farmer@example.com',
  farmName: 'Shinde Dairy Farm',
  herdSize: '18 Cows (HF & Jersey)',
  location: 'Jamdar Nagar, Kasba, Baramati - 413102',
  isLoggedIn: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabScreen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quotationTargetProduct, setQuotationTargetProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [enquiries, setEnquiries] = useState<QuotationEnquiry[]>([]);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  }, []);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        (item.marathiName && item.marathiName.toLowerCase().includes(q)) ||
        item.modelNumber.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Request Product Quote Helper
  const requestProductQuote = useCallback(
    (product: Product) => {
      setQuotationTargetProduct(product);
      setSelectedProduct(null);
      setActiveTab('quote');
    },
    []
  );

  // Cart Handlers
  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      if (!product.inStock) {
        showToast('Sorry, this equipment is currently out of stock');
        return;
      }

      if (product.priceType === 'on-request') {
        requestProductQuote(product);
        return;
      }

      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          const newQty = existing.quantity + quantity;
          showToast(`Updated quantity: ${product.name.slice(0, 22)}... (${newQty})`);
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQty } : item
          );
        } else {
          showToast(`Added to Cart: ${product.name.slice(0, 22)}...`);
          return [...prev, { product, quantity, addedAt: Date.now() }];
        }
      });
    },
    [showToast, requestProductQuote]
  );

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getCartItemQuantity = useCallback(
    (productId: string) => {
      const item = cart.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  const getCartTotal = useCallback(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + (item.product.price || 0) * item.quantity,
      0
    );
    const originalTotal = cart.reduce(
      (acc, item) => acc + (item.product.originalPrice || item.product.price || 0) * item.quantity,
      0
    );
    const savings = Math.max(0, originalTotal - subtotal);
    const gst = Math.round(subtotal * 0.18);
    const delivery = subtotal > 5000 || subtotal === 0 ? 0 : 250;
    const total = subtotal + gst + delivery;

    return { subtotal, gst, delivery, total, savings };
  }, [cart]);

  // Wishlist Handlers
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.productId === productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.productId === product.id);
        if (exists) {
          showToast(`Removed from Wishlist`);
          return prev.filter((item) => item.productId !== product.id);
        } else {
          showToast(`Added to Wishlist ❤️`);
          return [...prev, { productId: product.id, product, addedAt: Date.now() }];
        }
      });
    },
    [showToast]
  );

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const moveToCartFromWishlist = useCallback(
    (product: Product) => {
      if (!product.inStock) {
        showToast('Product is currently out of stock');
        return;
      }
      if (product.priceType === 'on-request') {
        requestProductQuote(product);
        return;
      }
      addToCart(product, 1);
      removeFromWishlist(product.id);
    },
    [addToCart, removeFromWishlist, requestProductQuote, showToast]
  );

  // Quotation Submission
  const submitEnquiry = useCallback(
    (enquiryData: Omit<QuotationEnquiry, 'id' | 'submittedAt'>) => {
      const newEnquiry: QuotationEnquiry = {
        ...enquiryData,
        id: `ENQ-${Date.now().toString().slice(-6)}`,
        submittedAt: Date.now(),
      };
      setEnquiries((prev) => [newEnquiry, ...prev]);
      showToast(`Quotation Enquiry ${newEnquiry.id} Submitted!`);
    },
    [showToast]
  );

  // User Profile
  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  }, []);

  const logoutUser = useCallback(() => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        quotationTargetProduct,
        setQuotationTargetProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        isLoading,
        refreshProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartItemQuantity,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        removeFromWishlist,
        enquiries,
        submitEnquiry,
        requestProductQuote,
        user,
        updateUserProfile,
        logoutUser,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
