'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  Collection, 
  CartItem, 
  StoreSettings, 
  AppearanceSettings, 
  ShippingSettings, 
  CustomerAddress, 
  UserProfile,
  FreightCalculationResult,
  ProductStatus
} from '@/types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COLLECTIONS, 
  INITIAL_STORE_SETTINGS, 
  INITIAL_APPEARANCE_SETTINGS, 
  INITIAL_SHIPPING_SETTINGS,
  INITIAL_ADDRESSES,
  INITIAL_CUSTOMERS 
} from '@/lib/initial-data';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';

interface StoreContextType {
  // Catalog
  products: Product[];
  categories: Category[];
  collections: Collection[];
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  setProductStatus: (id: string, status: ProductStatus) => void;
  getProductBySlug: (slug: string) => Product | undefined;

  // Categories & Collections
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variantId?: string, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;

  // Auth & Profile
  currentUser: UserProfile | null;
  loginAsDemoAdmin: () => void;
  loginAsDemoCustomer: () => void;
  logout: () => void;
  registerCustomer: (data: { firstName: string; lastName: string; email: string }) => boolean;
  addresses: CustomerAddress[];
  addAddress: (address: Omit<CustomerAddress, 'id' | 'user_id'>) => void;
  setDefaultAddress: (id: string) => void;
  deleteAddress: (id: string) => void;

  // Settings
  storeSettings: StoreSettings;
  appearanceSettings: AppearanceSettings;
  shippingSettings: ShippingSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  updateAppearanceSettings: (settings: Partial<AppearanceSettings>) => void;
  updateShippingSettings: (settings: Partial<ShippingSettings>) => void;

  // Shipping Calculator
  calculateFreight: (cep: string, items?: CartItem[]) => Promise<FreightCalculationResult>;
  resetCatalogToDefault: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'kms_products_v1',
  CATEGORIES: 'kms_categories_v1',
  COLLECTIONS: 'kms_collections_v1',
  CART: 'kms_cart_v1',
  CURRENT_USER: 'kms_current_user_v1',
  ADDRESSES: 'kms_addresses_v1',
  STORE_SETTINGS: 'kms_store_settings_v1',
  APPEARANCE_SETTINGS: 'kms_appearance_settings_v1',
  SHIPPING_SETTINGS: 'kms_shipping_settings_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State Initialization
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_CUSTOMERS[0]); // Default to admin for review
  const [addresses, setAddresses] = useState<CustomerAddress[]>(INITIAL_ADDRESSES);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(INITIAL_APPEARANCE_SETTINGS);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(INITIAL_SHIPPING_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted local data
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (storedCategories) setCategories(JSON.parse(storedCategories));

      const storedCollections = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (storedCollections) setCollections(JSON.parse(storedCollections));

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) setCurrentUser(JSON.parse(storedUser));

      const storedAddresses = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      if (storedAddresses) setAddresses(JSON.parse(storedAddresses));

      const storedStoreSettings = localStorage.getItem(STORAGE_KEYS.STORE_SETTINGS);
      if (storedStoreSettings) setStoreSettings(JSON.parse(storedStoreSettings));

      const storedAppearance = localStorage.getItem(STORAGE_KEYS.APPEARANCE_SETTINGS);
      if (storedAppearance) setAppearanceSettings(JSON.parse(storedAppearance));

      const storedShipping = localStorage.getItem(STORAGE_KEYS.SHIPPING_SETTINGS);
      if (storedShipping) setShippingSettings(JSON.parse(storedShipping));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
      localStorage.setItem(STORAGE_KEYS.STORE_SETTINGS, JSON.stringify(storeSettings));
      localStorage.setItem(STORAGE_KEYS.APPEARANCE_SETTINGS, JSON.stringify(appearanceSettings));
      localStorage.setItem(STORAGE_KEYS.SHIPPING_SETTINGS, JSON.stringify(shippingSettings));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [products, categories, collections, cart, currentUser, addresses, storeSettings, appearanceSettings, shippingSettings, isLoaded]);

  // Product management actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...newProdData,
      id,
      created_at: now,
      updated_at: now,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const duplicateProduct = (id: string) => {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const now = new Date().toISOString();
    const duplicated: Product = {
      ...original,
      id: crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
      name: `${original.name} (Cópia)`,
      slug: `${original.slug}-copia-${Date.now().toString().slice(-4)}`,
      sku: original.sku ? `${original.sku}-CP` : undefined,
      status: 'draft',
      created_at: now,
      updated_at: now,
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const setProductStatus = (id: string, status: ProductStatus) => {
    updateProduct(id, { status });
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  // Category actions
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { ...categoryData, id }]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, variantId?: string, quantity: number = 1) => {
    // Check if price is missing or product is draft
    if (product.status !== 'published') {
      return { success: false, message: 'Este produto não está publicado.' };
    }
    if (product.price === null || product.price === undefined || product.is_price_on_request) {
      return { success: false, message: 'Preço sob consulta. Entre em contato para encomendar esta peça.' };
    }

    const cartItemId = `${product.id}_${variantId || 'standard'}`;
    const existingIndex = cart.findIndex((item) => item.id === cartItemId);
    const currentQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    const targetQty = currentQty + quantity;

    if (product.track_stock && targetQty > product.stock_quantity) {
      return { 
        success: false, 
        message: `Quantidade indisponível. Estoque máximo disponível: ${product.stock_quantity} unidades.` 
      };
    }

    const selectedVariant = product.variants?.find((v) => v.id === variantId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity = targetQty;
      setCart(updated);
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: cartItemId,
          product_id: product.id,
          product,
          variant_id: variantId,
          variant: selectedVariant,
          quantity,
        },
      ]);
    }

    return { success: true };
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          if (item.product.track_stock && quantity > item.product.stock_quantity) {
            return { ...item, quantity: item.product.stock_quantity };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.variant?.price ?? item.product.promotional_price ?? item.product.price ?? 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Authentication & Profile actions
  const loginAsDemoAdmin = () => {
    setCurrentUser(INITIAL_CUSTOMERS[0]);
  };

  const loginAsDemoCustomer = () => {
    setCurrentUser(INITIAL_CUSTOMERS[1]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerCustomer = (data: { firstName: string; lastName: string; email: string }) => {
    const newUser: UserProfile = {
      id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const addAddress = (addressData: Omit<CustomerAddress, 'id' | 'user_id'>) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `addr-${Date.now()}`;
    const newAddr: CustomerAddress = {
      ...addressData,
      id,
      user_id: currentUser?.id || 'guest',
    };
    if (newAddr.is_default) {
      setAddresses((prev) => prev.map((a) => ({ ...a, is_default: false })).concat(newAddr));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        is_default: addr.id === id,
      }))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  // Settings
  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...updates }));
  };

  const updateAppearanceSettings = (updates: Partial<AppearanceSettings>) => {
    setAppearanceSettings((prev) => ({ ...prev, ...updates }));
  };

  const updateShippingSettings = (updates: Partial<ShippingSettings>) => {
    setShippingSettings((prev) => ({ ...prev, ...updates }));
  };

  // Shipping & Freight Calculation (ViaCEP + Real Carrier Architecture)
  const calculateFreight = async (
    cep: string, 
    customItems?: CartItem[]
  ): Promise<FreightCalculationResult> => {
    const cleanCep = cep.replace(/\D/g, '');
    const itemsToCheck = customItems || cart;

    if (cleanCep.length !== 8) {
      return {
        destinationCep: cep,
        originCep: shippingSettings.origin_postal_code,
        hasBulkyItem: false,
        missingDataProducts: [],
        options: [],
        status: 'invalid_cep',
        notes: 'CEP inválido. Por favor, digite 8 dígitos numéricos.',
      };
    }

    try {
      // 1. Fetch real location from ViaCEP
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        return {
          destinationCep: cep,
          originCep: shippingSettings.origin_postal_code,
          hasBulkyItem: false,
          missingDataProducts: [],
          options: [],
          status: 'invalid_cep',
          notes: 'CEP não localizado pelos Correios.',
        };
      }

      // 2. Inspect items for bulky flags or missing dimensional data
      const hasBulky = itemsToCheck.some((i) => i.product.is_bulky);
      const missingDataProducts: string[] = [];

      itemsToCheck.forEach((i) => {
        if (!i.product.weight_kg || !i.product.height_cm || !i.product.width_cm || !i.product.length_cm) {
          missingDataProducts.push(i.product.name);
        }
      });

      // 3. Carrier integration verification
      if (!shippingSettings.api_key_configured) {
        return {
          destinationCep: cleanCep,
          city: data.localidade,
          state: data.uf,
          street: data.logradouro,
          neighborhood: data.bairro,
          originCep: shippingSettings.origin_postal_code,
          hasBulkyItem: hasBulky,
          missingDataProducts,
          options: [
            {
              service: 'SEDEX',
              name: 'Sedex Convencional',
              price: null,
              deliveryDays: null,
              isAvailable: false,
              message: 'Cotação online pendente de credenciais do provedor logístico.',
            },
            {
              service: 'PAC',
              name: 'PAC Econômico',
              price: null,
              deliveryDays: null,
              isAvailable: false,
              message: 'Cotação online pendente de credenciais do provedor logístico.',
            },
            ...(hasBulky
              ? [
                  {
                    service: 'TRANSPORTADORA',
                    name: 'Transportadora Especializada (Mobiliário / Peças Grandes)',
                    price: null,
                    deliveryDays: null,
                    isAvailable: false,
                    isBulkyNotice: true,
                    message: 'O pedido contém peças volumosas (cadeira/mobiliário) que necessitam de cotação sob medida.',
                  },
                ]
              : []),
          ],
          status: hasBulky ? 'special_shipping_required' : 'pending_credentials',
          notes: `Destino: ${data.localidade}/${data.uf} (${data.bairro || 'Centro'}). Origem: ${shippingSettings.origin_city}/${shippingSettings.origin_state} (${shippingSettings.origin_postal_code}).`,
        };
      }

      // If credentials were provided, real carrier call would run here
      return {
        destinationCep: cleanCep,
        city: data.localidade,
        state: data.uf,
        street: data.logradouro,
        neighborhood: data.bairro,
        originCep: shippingSettings.origin_postal_code,
        hasBulkyItem: hasBulky,
        missingDataProducts,
        options: [],
        status: 'quoted',
      };
    } catch (error) {
      return {
        destinationCep: cleanCep,
        originCep: shippingSettings.origin_postal_code,
        hasBulkyItem: false,
        missingDataProducts: [],
        options: [],
        status: 'invalid_cep',
        notes: 'Erro ao conectar ao serviço de busca de CEP.',
      };
    }
  };

  const resetCatalogToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setCollections(INITIAL_COLLECTIONS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    setAppearanceSettings(INITIAL_APPEARANCE_SETTINGS);
    setShippingSettings(INITIAL_SHIPPING_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
      localStorage.removeItem(STORAGE_KEYS.STORE_SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.APPEARANCE_SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.SHIPPING_SETTINGS);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        collections,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        setProductStatus,
        getProductBySlug,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        currentUser,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
        logout,
        registerCustomer,
        addresses,
        addAddress,
        setDefaultAddress,
        deleteAddress,
        storeSettings,
        appearanceSettings,
        shippingSettings,
        updateStoreSettings,
        updateAppearanceSettings,
        updateShippingSettings,
        calculateFreight,
        resetCatalogToDefault,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
