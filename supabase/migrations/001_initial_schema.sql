-- ==============================================================================
-- KEINA MARK STUDIO — SUPABASE SCHEMA & SECURITY CONFIGURATION
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-- ------------------------------------------------------------------------------
create type user_role_type as enum ('admin', 'staff', 'customer');
create type product_status_type as enum ('draft', 'published', 'archived');
create type order_status_type as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type inventory_movement_type as enum ('in', 'out', 'adjustment');

-- ------------------------------------------------------------------------------
-- 2. USER PROFILES & ROLES
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  cpf text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role user_role_type default 'customer'::user_role_type not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, role)
);

-- Helper function to check if the current requesting user has admin role
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_roles.user_id = $1
      and user_roles.role = 'admin'
  );
$$;

-- ------------------------------------------------------------------------------
-- 3. CUSTOMER ADDRESSES
-- ------------------------------------------------------------------------------
create table if not exists public.customer_addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text not null,
  postal_code text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  is_default boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. CATEGORIES & COLLECTIONS
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  display_order integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  banner_url text,
  display_order integer default 0 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS & VARIANTS
-- ------------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sku text unique,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10, 2),
  promotional_price numeric(10, 2),
  is_price_on_request boolean default true not null,
  short_description text,
  description text,
  material text,
  dimensions text,
  weight_kg numeric(8, 3),
  height_cm numeric(8, 2),
  width_cm numeric(8, 2),
  length_cm numeric(8, 2),
  is_bulky boolean default false not null,
  stock_quantity integer default 0 not null,
  track_stock boolean default false not null,
  is_made_to_order boolean default false not null,
  production_days integer,
  status product_status_type default 'draft'::product_status_type not null,
  is_featured boolean default false not null,
  care_instructions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  display_order integer default 0 not null,
  is_primary boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text,
  price numeric(10, 2),
  stock_quantity integer default 0 not null,
  color text,
  size text,
  model text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.collection_products (
  id uuid primary key default uuid_generate_v4(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  display_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (collection_id, product_id)
);

create table if not exists public.inventory_movements (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  type inventory_movement_type not null,
  quantity integer not null,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 6. CARTS
-- ------------------------------------------------------------------------------
create table if not exists public.carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (cart_id, product_id, variant_id)
);

-- ------------------------------------------------------------------------------
-- 7. STORE SETTINGS & HOMEPAGE SECTIONS
-- ------------------------------------------------------------------------------
create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.homepage_sections (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  title text not null,
  subtitle text,
  content jsonb default '{}'::jsonb not null,
  is_active boolean default true not null,
  display_order integer default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.shipping_settings (
  id uuid primary key default uuid_generate_v4(),
  origin_postal_code text not null,
  origin_street text,
  origin_number text,
  origin_complement text,
  origin_neighborhood text,
  origin_city text not null,
  origin_state text not null,
  provider text default 'custom' not null,
  api_key_configured boolean default false not null,
  status_message text default 'Aguardando credenciais do provedor logístico',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 8. FUTURE ORDER STRUCTURE (FOR EXTENSIBILITY WITHOUT ACTIVE PAYMENT)
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  customer_phone text,
  status order_status_type default 'pending'::order_status_type not null,
  subtotal numeric(10, 2) not null,
  shipping_total numeric(10, 2) default 0 not null,
  discount_total numeric(10, 2) default 0 not null,
  grand_total numeric(10, 2) not null,
  shipping_address jsonb not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null,
  total_price numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.collection_products enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.store_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.shipping_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles: users read/update their own; admins manage all
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can insert profiles" on public.profiles
  for insert with check (auth.uid() = id or public.is_admin(auth.uid()));

-- User roles: only admins can view and manage
create policy "Admins can view and manage user roles" on public.user_roles
  for all using (public.is_admin(auth.uid()));

-- Customer addresses: user manages their own; admins can view
create policy "Users can view own addresses" on public.customer_addresses
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Users can modify own addresses" on public.customer_addresses
  for all using (auth.uid() = user_id);

-- Categories: public can view active; admins full control
create policy "Public can view active categories" on public.categories
  for select using (is_active = true or public.is_admin(auth.uid()));

create policy "Admins have full control over categories" on public.categories
  for all using (public.is_admin(auth.uid()));

-- Collections: public can view active; admins full control
create policy "Public can view active collections" on public.collections
  for select using (is_active = true or public.is_admin(auth.uid()));

create policy "Admins have full control over collections" on public.collections
  for all using (public.is_admin(auth.uid()));

-- Products: public can view published; admins manage all
create policy "Public can view published products" on public.products
  for select using (status = 'published' or public.is_admin(auth.uid()));

create policy "Admins have full control over products" on public.products
  for all using (public.is_admin(auth.uid()));

-- Product images: public can view images of published products; admins manage all
create policy "Public can view published product images" on public.product_images
  for select using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
        and (products.status = 'published' or public.is_admin(auth.uid()))
    )
  );

create policy "Admins have full control over product images" on public.product_images
  for all using (public.is_admin(auth.uid()));

-- Product variants: viewable with published products
create policy "Public can view product variants" on public.product_variants
  for select using (
    exists (
      select 1 from public.products
      where products.id = product_variants.product_id
        and (products.status = 'published' or public.is_admin(auth.uid()))
    )
  );

create policy "Admins have full control over product variants" on public.product_variants
  for all using (public.is_admin(auth.uid()));

-- Collection products: public can view; admins manage
create policy "Public can view collection products" on public.collection_products
  for select using (true);

create policy "Admins manage collection products" on public.collection_products
  for all using (public.is_admin(auth.uid()));

-- Carts: user accesses own cart by user_id or session
create policy "Users can view own cart" on public.carts
  for select using (auth.uid() = user_id or user_id is null);

create policy "Users can update own cart" on public.carts
  for all using (auth.uid() = user_id or user_id is null);

create policy "Cart items manageable by cart owner" on public.cart_items
  for all using (
    exists (
      select 1 from public.carts
      where carts.id = cart_items.cart_id
        and (carts.user_id = auth.uid() or carts.user_id is null)
    )
  );

-- Store settings & homepage sections: public can read; admins edit
create policy "Public can read store settings" on public.store_settings
  for select using (true);

create policy "Admins can manage store settings" on public.store_settings
  for all using (public.is_admin(auth.uid()));

create policy "Public can read active homepage sections" on public.homepage_sections
  for select using (is_active = true or public.is_admin(auth.uid()));

create policy "Admins can manage homepage sections" on public.homepage_sections
  for all using (public.is_admin(auth.uid()));

-- Shipping settings: public can read origin info for calculation; admins edit
create policy "Public can read shipping settings" on public.shipping_settings
  for select using (true);

create policy "Admins can manage shipping settings" on public.shipping_settings
  for all using (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- 10. AUTH TRIGGER TO CREATE PROFILE ON USER SIGNUP
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', 'Cliente'),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'customer');

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
