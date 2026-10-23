import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';
import { Product, QuotationEnquiry, CartItem } from '../types/product';
import { PRODUCTS } from '../data/products';

const QUOTES_STORAGE_KEY = '@jagdamb_quotations';
const CART_STORAGE_KEY = '@jagdamb_cart';
export const BARAMATI_PHONE = '+919822012345';
export const BARAMATI_WHATSAPP = '919822012345';

/**
 * Fetch products: checks Supabase 'products' table first if configured,
 * otherwise returns rich built-in products catalog.
 */
export async function fetchLiveProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (e) {
      console.warn('Supabase products fetch failed, using local catalog fallback:', e);
    }
  }
  return PRODUCTS;
}

/**
 * Submit Quotation Enquiry:
 * Writes to Supabase 'quotation_enquiries' if configured,
 * and always guarantees local storage persistence in AsyncStorage.
 */
export async function saveQuotationEnquiry(
  enquiry: Omit<QuotationEnquiry, 'id' | 'submittedAt'>
): Promise<QuotationEnquiry> {
  const newEnquiry: QuotationEnquiry = {
    ...enquiry,
    id: `quote-${Date.now()}`,
    submittedAt: Date.now(),
  };

  // 1. Save to local storage first (reliable offline-first)
  try {
    const existing = await loadLocalEnquiries();
    const updated = [newEnquiry, ...existing];
    await AsyncStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving quotation locally:', err);
  }

  // 2. Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('quotation_enquiries').insert([
        {
          id: newEnquiry.id,
          farmer_name: newEnquiry.farmerName,
          contact_number: newEnquiry.contactNumber,
          village_city: newEnquiry.villageOrCity,
          state: newEnquiry.state,
          herd_size: newEnquiry.herdSize,
          interested_product: newEnquiry.interestedProduct,
          product_id: newEnquiry.productId,
          additional_requirements: newEnquiry.additionalRequirements,
          submitted_at: new Date(newEnquiry.submittedAt).toISOString(),
        },
      ]);
    } catch (supaErr) {
      console.warn('Supabase quotation sync failed (saved locally):', supaErr);
    }
  }

  return newEnquiry;
}

/**
 * Load farmer quotation enquiries from local storage
 */
export async function loadLocalEnquiries(): Promise<QuotationEnquiry[]> {
  try {
    const raw = await AsyncStorage.getItem(QUOTES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as QuotationEnquiry[];
    }
  } catch (e) {
    console.error('Error loading local enquiries:', e);
  }
  return [];
}

/**
 * Persist cart items in local storage
 */
export async function saveLocalCart(items: CartItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error persisting cart:', e);
  }
}

/**
 * Retrieve saved cart items
 */
export async function loadLocalCart(): Promise<CartItem[]> {
  try {
    const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as CartItem[];
    }
  } catch (e) {
    console.error('Error loading cart:', e);
  }
  return [];
}

/**
 * Direct WhatsApp chat with Baramati Showroom with prefilled equipment details
 */
export function openWhatsAppEnquiry(productName?: string, modelNumber?: string, customNote?: string) {
  let message = `Namaskar Jagdamb Enterprises Baramati, I am interested in your dairy equipment.`;
  if (productName) {
    message += `\n\n*Equipment:* ${productName}`;
    if (modelNumber) {
      message += ` (Model: ${modelNumber})`;
    }
  }
  if (customNote) {
    message += `\n*Note:* ${customNote}`;
  }
  message += `\nPlease share best price, technical brochure, and delivery availability.`;

  const url = `https://wa.me/${BARAMATI_WHATSAPP}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url).catch((err) => {
    console.warn('Failed to open WhatsApp:', err);
  });
}

/**
 * Direct Phone Call to Baramati Showroom Helpline
 */
export function callBaramatiShowroom() {
  const telUrl = `tel:${BARAMATI_PHONE}`;
  Linking.openURL(telUrl).catch((err) => {
    console.warn('Failed to dial showroom:', err);
  });
}
