-- SQL Script to set up Supabase tables for Hoteltec

-- 1. STORES table
-- This stores the basic hotel/store information
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#0f172a',
    currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own stores" ON stores 
    USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view stores" ON stores 
    FOR SELECT USING (true);

-- 2. CATEGORIES table
-- Product categories within a store
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage categories in their stores" ON categories 
    USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = categories.store_id AND stores.user_id = auth.uid()));
CREATE POLICY "Anyone can view categories" ON categories 
    FOR SELECT USING (true);

-- 3. PRODUCTS table
-- Items sold in the store
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage products in their stores" ON products 
    USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.user_id = auth.uid()));
CREATE POLICY "Anyone can view products" ON products 
    FOR SELECT USING (true);

-- 4. STORIES table
-- Social-media style stories for marketing
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
    linked_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for stories
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage stories in their stores" ON stories 
    USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = stories.store_id AND stores.user_id = auth.uid()));
CREATE POLICY "Anyone can view stories" ON stories 
    FOR SELECT USING (true);

-- 5. TEAM_MEMBERS table
-- Staff and administrators for a hotel
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT CHECK (role IN ('Administrator', 'Staff', 'Viewer')) DEFAULT 'Staff',
    phone TEXT,
    avatar_url TEXT,
    user_id UUID REFERENCES auth.users(id), -- Nullable until they sign up/accept
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage team" ON team_members 
    USING (EXISTS (SELECT 1 FROM team_members AS tm WHERE tm.store_id = team_members.store_id AND tm.user_id = auth.uid() AND tm.role = 'Administrator'));

-- 6. ANALYTICS table
-- Daily snapshots for reporting
CREATE TABLE IF NOT EXISTS daily_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    revenue DECIMAL(12,2) DEFAULT 0.00,
    orders_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    UNIQUE(store_id, date)
);

-- Enable RLS for analytics
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their analytics" ON daily_analytics 
    USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = daily_analytics.store_id AND stores.user_id = auth.uid()));

-- 7. ORDERS table
-- Stores customer orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    room_number TEXT NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('Cash', 'TPE')) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status TEXT CHECK (status IN ('Waiting', 'Completed', 'Canceled')) DEFAULT 'Waiting',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage orders in their stores" ON orders 
    USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()));
CREATE POLICY "Anyone can create orders" ON orders 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their own order" ON orders 
    FOR SELECT USING (true); -- Ideally this would be linked to a session or specific UUID

-- 8. ORDER_ITEMS table
-- Individual items within an order
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    product_name TEXT NOT NULL -- Snapshot of name at time of purchase
);

-- Enable RLS for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view order items in their stores" ON order_items 
    USING (EXISTS (
        SELECT 1 FROM orders 
        JOIN stores ON stores.id = orders.store_id 
        WHERE orders.id = order_items.order_id AND stores.user_id = auth.uid()
    ));
CREATE POLICY "Anyone can create order items" ON order_items 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order items" ON order_items 
    FOR SELECT USING (true);
