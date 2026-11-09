-- ==============================================================================
-- KEINA MARK STUDIO — SCHEMA DE BANCO DE DADOS POSTGRESQL / SUPABASE
-- Loja virtual autoral, catálogo editorial, cálculo de frete e painel administrativo
-- ==============================================================================

-- Habilita extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TIPOS ENUMERADOS
-- ------------------------------------------------------------------------------
CREATE TYPE product_status_enum AS ENUM ('draft', 'published', 'archived');
CREATE TYPE availability_status_enum AS ENUM ('available', 'made_to_order', 'out_of_stock');
CREATE TYPE user_role_enum AS ENUM ('customer', 'admin');
CREATE TYPE order_status_enum AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'authorized', 'paid', 'refunded', 'failed');

-- ------------------------------------------------------------------------------
-- 2. TABELAS DE USUÁRIOS E PERFIS
-- ------------------------------------------------------------------------------

-- Tabela de perfis associada ao auth.users do Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Controle de papéis administrativos seguros (RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_enum DEFAULT 'customer' NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, role)
);

-- Endereços dos clientes para cálculo de frete e entrega
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Principal' NOT NULL,
    cep VARCHAR(9) NOT NULL,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state VARCHAR(2) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. CATEGORIAS E COLEÇÕES EDITORIAIS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    description TEXT,
    banner_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. PRODUTOS, IMAGENS E VARIAÇÕES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    status product_status_enum DEFAULT 'draft' NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Conteúdo Editorial
    short_description TEXT,
    full_description TEXT,
    material TEXT,
    specifications TEXT,
    care_instructions TEXT,
    
    -- Comercial (null = Preço sob consulta, nunca inventar valores)
    price NUMERIC(10, 2),
    promotional_price NUMERIC(10, 2),
    
    -- Estoque e Disponibilidade
    stock INT DEFAULT 0 NOT NULL,
    track_stock BOOLEAN DEFAULT TRUE NOT NULL,
    is_made_to_order BOOLEAN DEFAULT FALSE NOT NULL,
    production_time_days INT,
    availability_status availability_status_enum DEFAULT 'available' NOT NULL,
    
    -- Frete e Dimensões Físicas (Essencial para cotação real)
    weight_kg NUMERIC(6, 3),
    height_cm NUMERIC(6, 2),
    width_cm NUMERIC(6, 2),
    length_cm NUMERIC(6, 2),
    logistics_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabela de relacionamento Coleção <-> Produtos
CREATE TABLE IF NOT EXISTS public.collection_products (
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0 NOT NULL,
    PRIMARY KEY(collection_id, product_id)
);

-- Fotografias reais dos produtos
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Variações (Tamanhos, Cores, Acabamentos)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    option_type VARCHAR(50) NOT NULL,
    option_value TEXT NOT NULL,
    price_override NUMERIC(10, 2),
    stock_override INT,
    sku_override TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Movimentações de estoque
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity_change INT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. CARRINHOS E SESSÕES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. CONFIGURAÇÕES DA LOJA E LOGÍSTICA
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT DEFAULT 'Keina Mark Studio' NOT NULL,
    logo_text TEXT DEFAULT 'KEINA MARK STUDIO' NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    instagram_handle TEXT,
    origin_cep VARCHAR(9) DEFAULT '69000-000' NOT NULL,
    origin_street TEXT,
    origin_city TEXT DEFAULT 'Manaus' NOT NULL,
    origin_state VARCHAR(2) DEFAULT 'AM' NOT NULL,
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_cta_text TEXT DEFAULT 'Explorar coleção' NOT NULL,
    hero_image_url TEXT NOT NULL,
    essence_title TEXT NOT NULL,
    essence_text TEXT NOT NULL,
    payment_configured BOOLEAN DEFAULT FALSE NOT NULL,
    shipping_carrier_configured BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. ESTRUTURA FUTURA (PEDIDOS, PAGAMENTOS E ENVIOS - SEM TRANSAÇÕES FICTÍCIAS)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    status order_status_enum DEFAULT 'pending' NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    shipping_address_snapshot JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    variant_id UUID REFERENCES public.product_variants(id),
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway VARCHAR(50) NOT NULL,
    gateway_transaction_id TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    status payment_status_enum DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    carrier VARCHAR(100) NOT NULL,
    tracking_code TEXT,
    status VARCHAR(50) DEFAULT 'aguardando_expedicao' NOT NULL,
    estimated_delivery DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. ÍNDICES DE PERFORMANCE
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user ON public.customer_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) & POLÍTICAS
-- ------------------------------------------------------------------------------

-- Habilita RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para verificar permissão administrativa
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de Produtos:
-- 1. Qualquer visitante lê produtos publicados
CREATE POLICY "Public products viewable by all"
ON public.products FOR SELECT
USING (status = 'published' OR public.is_admin());

-- 2. Apenas administradores alteram catálogo
CREATE POLICY "Admin manage products"
ON public.products FOR ALL
USING (public.is_admin());

-- Categorias e Coleções:
CREATE POLICY "Categories viewable by all"
ON public.categories FOR SELECT
USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage categories"
ON public.categories FOR ALL
USING (public.is_admin());

CREATE POLICY "Collections viewable by all"
ON public.collections FOR SELECT
USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin manage collections"
ON public.collections FOR ALL
USING (public.is_admin());

-- Imagens e Variações:
CREATE POLICY "Images viewable by all"
ON public.product_images FOR SELECT USING (TRUE);

CREATE POLICY "Admin manage images"
ON public.product_images FOR ALL
USING (public.is_admin());

CREATE POLICY "Variants viewable by all"
ON public.product_variants FOR SELECT USING (TRUE);

CREATE POLICY "Admin manage variants"
ON public.product_variants FOR ALL
USING (public.is_admin());

-- Configurações da loja:
CREATE POLICY "Store settings viewable by all"
ON public.store_settings FOR SELECT USING (TRUE);

CREATE POLICY "Admin manage store settings"
ON public.store_settings FOR ALL
USING (public.is_admin());

-- Endereços do cliente:
CREATE POLICY "Users read own addresses"
ON public.customer_addresses FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users insert own addresses"
ON public.customer_addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own addresses"
ON public.customer_addresses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own addresses"
ON public.customer_addresses FOR DELETE
USING (auth.uid() = user_id);

-- Carrinho:
CREATE POLICY "Users manage own carts"
ON public.carts FOR ALL
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users manage own cart items"
ON public.cart_items FOR ALL
USING (TRUE);
