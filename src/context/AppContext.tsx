import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {
  fetchLiveProducts,
  saveQuotationEnquiry,
  loadLocalEnquiries,
  loadLocalCart,
  saveLocalCart,
} from '../lib/supabaseService';

interface AppContextType {
  // Navigation & View state
  activeTab: TabScreen;
  setActiveTab: (tab: TabScreen) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  quotationTargetProduct: Product | null;
  setQuotationTargetProduct: (product: Product | null) => void;
  getProductById: (id: string) => Product | undefined;

  // Catalog state
  products: Product[];
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
  submitEnquiry: (enquiry: Omit<QuotationEnquiry, 'id' | 'submittedAt'>) => Promise<void>;
  requestProductQuote: (product: Product) => void;

  // User Profile / Auth State
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

const WISHLIST_STORAGE_KEY = '@jagdamb_wishlist';
const USER_STORAGE_KEY = '@jagdamb_user_profile';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabScreen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quotationTargetProduct, setQuotationTargetProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [enquiries, setEnquiries] = useState<QuotationEnquiry[]>([]);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [savedCart, savedEnquiries, savedWishlist, savedUser, liveProducts] = await Promise.all([
          loadLocalCart(),
          loadLocalEnquiries(),
          AsyncStorage.getItem(WISHLIST_STORAGE_KEY),
          AsyncStorage.getItem(USER_STORAGE_KEY),
          fetchLiveProducts(),
        ]);

        if (!isMounted) return;

        if (savedCart && savedCart.length > 0) setCart(savedCart);
        if (savedEnquiries && savedEnquiries.length > 0) setEnquiries(savedEnquiries);
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedUser) setUser(JSON.parse(savedUser));
        if (liveProducts && liveProducts.length > 0) setProducts(liveProducts);
      } catch (e) {
        console.warn('Initialization error in AppProvider:', e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const live = await fetchLiveProducts();
      setProducts(live);
      showToast('Equipment catalog updated');
    } catch (err) {
      console.warn('Catalog refresh failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const getProductById = useCallback(
    (id: string): Product | undefined => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
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
  }, [products, selectedCategory, searchQuery]);

  // Request Product Quote Helper
  const requestProductQuote = useCallback((product: Product) => {
    setQuotationTargetProduct(product);
    setSelectedProduct(null);
    setActiveTab('quote');
  }, []);

  // Cart Handlers with persistent save
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
        let updated: CartItem[];
        if (existing) {
          const newQty = existing.quantity + quantity;
          showToast(`Updated quantity: ${product.name.slice(0, 22)}... (${newQty})`);
          updated = prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQty } : item
          );
        } else {
          showToast(`Added to Cart: ${product.name.slice(0, 22)}...`);
          updated = [...prev, { product, quantity, addedAt: Date.now() }];
        }
        saveLocalCart(updated);
        return updated;
      });
    },
    [showToast, requestProductQuote]
  );

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = prev.filter((item) => item.product.id !== productId);
      } else {
        updated = prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      }
      saveLocalCart(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      saveLocalCart(updated);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    saveLocalCart([]);
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
        let updated: WishlistItem[];
        if (exists) {
          showToast(`Removed from Wishlist`);
          updated = prev.filter((item) => item.productId !== product.id);
        } else {
          showToast(`Added to Wishlist ❤️`);
          updated = [...prev, { productId: product.id, product, addedAt: Date.now() }];
        }
        AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
        return updated;
      });
    },
    [showToast]
  );

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
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

  // Quotation Submission with Supabase + Local Sync
  const submitEnquiry = useCallback(
    async (enquiryData: Omit<QuotationEnquiry, 'id' | 'submittedAt'>) => {
      try {
        const saved = await saveQuotationEnquiry(enquiryData);
        setEnquiries((prev) => [saved, ...prev]);
        showToast(`Quotation Enquiry Submitted! Baramati team notified.`);
      } catch (err) {
        showToast(`Failed to record quotation.`);
      }
    },
    [showToast]
  );

  // User Profile
  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...profile };
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const logoutUser = useCallback(() => {
    setUser((prev) => {
      const updated = { ...prev, isLoggedIn: false };
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
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
        getProductById,
        products,
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
