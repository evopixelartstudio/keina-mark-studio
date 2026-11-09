export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku?: string;
  price?: number | null;
  stock_quantity: number;
  color?: string;
  size?: string;
  model?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  category_id?: string;
  category?: Category;
  price?: number | null;
  promotional_price?: number | null;
  is_price_on_request: boolean;
  short_description?: string;
  description?: string;
  material?: string;
  dimensions?: string;
  weight_kg?: number | null;
  height_cm?: number | null;
  width_cm?: number | null;
  length_cm?: number | null;
  is_bulky: boolean;
  stock_quantity: number;
  track_stock: boolean;
  is_made_to_order: boolean;
  production_days?: number | null;
  status: ProductStatus;
  is_featured: boolean;
  care_instructions?: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  banner_url?: string;
  display_order: number;
  is_active: boolean;
  products?: Product[];
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  variant_id?: string;
  variant?: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

export interface CustomerAddress {
  id: string;
  user_id: string;
  recipient_name: string;
  postal_code: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  is_default: boolean;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  cpf?: string;
  role: 'admin' | 'customer';
  created_at?: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  contact_email: string;
  instagram: string;
  payment_status: string;
  checkout_enabled: boolean;
}

export interface AppearanceSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  essence_title: string;
  essence_p1: string;
  essence_p2: string;
}

export interface ShippingSettings {
  origin_postal_code: string;
  origin_street: string;
  origin_number: string;
  origin_neighborhood: string;
  origin_city: string;
  origin_state: string;
  provider: 'correios' | 'melhor_envio' | 'frenet' | 'custom';
  api_key_configured: boolean;
  status_message: string;
}

export interface FreightOption {
  service: string;
  name: string;
  price: number | null;
  deliveryDays: number | null;
  isAvailable: boolean;
  message?: string;
  isBulkyNotice?: boolean;
}

export interface FreightCalculationResult {
  destinationCep: string;
  city?: string;
  state?: string;
  street?: string;
  neighborhood?: string;
  originCep: string;
  hasBulkyItem: boolean;
  missingDataProducts: string[];
  options: FreightOption[];
  status: 'quoted' | 'pending_credentials' | 'special_shipping_required' | 'invalid_cep';
  notes?: string;
}
