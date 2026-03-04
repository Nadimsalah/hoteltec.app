-- 1. ADD NEW COLUMNS TO TEAM_MEMBERS
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS assigned_pages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS assigned_categories JSONB DEFAULT '[]'::jsonb;

-- 2. CREATE A NEW RLS POLICY ON STORES SO STAFF CAN VIEW THEIR ASSIGNED STORE
DROP POLICY IF EXISTS "Team members can view their store" ON stores;
CREATE POLICY "Team members can view their store" ON stores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members 
            WHERE team_members.store_id = stores.id 
              AND team_members.user_id = auth.uid()
        )
    );

-- 3. CREATE A NEW RLS POLICY SO STAFF CAN VIEW AND UPDATE ORDERS FOR THEIR STORE
DROP POLICY IF EXISTS "Team members can view and update orders" ON orders;
CREATE POLICY "Team members can view and update orders" ON orders 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM team_members 
            WHERE team_members.store_id = orders.store_id 
              AND team_members.user_id = auth.uid()
        )
    );

-- 4. CREATE A NEW RLS POLICY SO STAFF CAN VIEW ORDER ITEMS FOR THEIR STORE
DROP POLICY IF EXISTS "Team members can view order items" ON order_items;
CREATE POLICY "Team members can view order items" ON order_items 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            JOIN team_members ON team_members.store_id = orders.store_id 
            WHERE orders.id = order_items.order_id 
              AND team_members.user_id = auth.uid()
        )
    );
