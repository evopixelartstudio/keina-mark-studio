import {
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
  INITIAL_APPEARANCE_SETTINGS,
} from './initial-data';
import { Category, Collection, Product, StoreSettings, AppearanceSettings } from '@/types';
import { isSupabaseConfigured, createClient } from './supabase/client';

export const isDemoMode = (): boolean => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !isSupabaseConfigured();
};

export interface GetProductsOptions {
  status?: string;
  categorySlug?: string;
  collectionSlug?: string;
}

export type MergedStoreSettings = StoreSettings &
  AppearanceSettings & {
    hero_cta_text: string;
  };

export async function getCategories(): Promise<Category[]> {
  if (isDemoMode()) {
    return INITIAL_CATEGORIES.filter((c) => c.is_active);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('[Keina Mark Studio] Supabase categories unavailable; using demo catalog:', error?.message);
      return INITIAL_CATEGORIES.filter((c) => c.is_active);
    }

    return data as Category[];
  } catch (err) {
    console.warn('[Keina Mark Studio] Failed to fetch categories from Supabase; using demo catalog:', err);
    return INITIAL_CATEGORIES.filter((c) => c.is_active);
  }
}

export async function getCollections(): Promise<Collection[]> {
  if (isDemoMode()) {
    return INITIAL_COLLECTIONS.filter((c) => c.is_active);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('[Keina Mark Studio] Supabase collections unavailable; using demo catalog:', error?.message);
      return INITIAL_COLLECTIONS.filter((c) => c.is_active);
    }

    return data as Collection[];
  } catch (err) {
    console.warn('[Keina Mark Studio] Failed to fetch collections from Supabase; using demo catalog:', err);
    return INITIAL_COLLECTIONS.filter((c) => c.is_active);
  }
}

export async function getProducts(options?: GetProductsOptions): Promise<Product[]> {
  if (isDemoMode()) {
    let list = [...INITIAL_PRODUCTS];

    if (options?.status) {
      list = list.filter((p) => p.status === options.status);
    }

    if (options?.categorySlug) {
      const category = INITIAL_CATEGORIES.find((c) => c.slug === options.categorySlug);
      if (category) {
        list = list.filter((p) => p.category_id === category.id);
      }
    }

    return list;
  }

  try {
    const supabase = createClient();
    let query = supabase.from('products').select('*, images:product_images(*), variants:product_variants(*)');

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('[Keina Mark Studio] Supabase products unavailable; using demo catalog:', error?.message);
      return INITIAL_PRODUCTS.filter((p) => (options?.status ? p.status === options.status : true));
    }

    return data as Product[];
  } catch (err) {
    console.warn('[Keina Mark Studio] Failed to fetch products from Supabase; using demo catalog:', err);
    return INITIAL_PRODUCTS.filter((p) => (options?.status ? p.status === options.status : true));
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isDemoMode()) {
    const found = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    return found || null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, images:product_images(*), variants:product_variants(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const fallback = INITIAL_PRODUCTS.find((p) => p.slug === slug);
      return fallback || null;
    }

    return data as Product;
  } catch (err) {
    console.warn('[Keina Mark Studio] Failed to fetch product from Supabase; using demo catalog:', err);
    const fallback = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    return fallback || null;
  }
}

export async function getStoreSettings(): Promise<MergedStoreSettings> {
  return {
    ...INITIAL_STORE_SETTINGS,
    ...INITIAL_APPEARANCE_SETTINGS,
    hero_cta_text: INITIAL_APPEARANCE_SETTINGS.hero_cta || 'Explorar Coleção',
  };
}

export async function getAppearanceSettings(): Promise<AppearanceSettings> {
  return INITIAL_APPEARANCE_SETTINGS;
}
