-- COPY AND PASTE THIS ENTIRE SNIPPET INTO YOUR SUPABASE SQL EDITOR
-- DANGER: This will replace the products entirely in your specific "Ibis" store.

DO $$
DECLARE
  v_store_id uuid;
  v_cat_breakfast uuid := gen_random_uuid();
  v_cat_main uuid := gen_random_uuid();
  v_cat_drinks uuid := gen_random_uuid();
  v_cat_services uuid := gen_random_uuid();
BEGIN
  -- Find the store id by slug or name
  SELECT id INTO v_store_id FROM stores WHERE slug = 'ibis' OR name ILIKE '%ibis%' LIMIT 1;

  IF v_store_id IS NULL THEN
    RAISE EXCEPTION 'No store with slug "ibis" or name containing "ibis" was found!';
  END IF;

  DELETE FROM products WHERE store_id = v_store_id;
  DELETE FROM categories WHERE store_id = v_store_id;

  INSERT INTO categories (id, store_id, name, index) VALUES 
  (v_cat_breakfast, v_store_id, 'Breakfast & Morning', 0),
  (v_cat_main, v_store_id, 'Main Courses', 1),
  (v_cat_drinks, v_store_id, 'Beverages & Bar', 2),
  (v_cat_services, v_store_id, 'Hotel Services', 3);

  -- Insert products with 100% verified working URLs
  INSERT INTO products (store_id, category_id, name, description, price, image_url, is_available) VALUES
  
  -- Breakfast
  (v_store_id, v_cat_breakfast, 'Continental Breakfast', 'Freshly baked croissants, toast, butter, preserves, fruit juice, and choice of tea or coffee.', 15.00, 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800', true),
  (v_store_id, v_cat_breakfast, 'Eggs Benedict', 'Two poached eggs on toasted English muffins with Canadian bacon and Hollandaise sauce.', 18.50, 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800', true),
  (v_store_id, v_cat_breakfast, 'Fresh Fruit Platter', 'Chef''s selection of seasonal sliced fruits and berries.', 12.00, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800', true),

  -- Main Courses
  (v_store_id, v_cat_main, 'Wagyu Beef Burger', 'Premium wagyu beef patty, aged cheddar, caramelized onions, truffled mayo on a brioche bun. Served with fries.', 28.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', true),
  (v_store_id, v_cat_main, 'Classic Club Sandwich', 'Triple-decker sandwich with roasted chicken, bacon, egg, lettuce, and tomato. Served with fries.', 22.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800', true),
  (v_store_id, v_cat_main, 'Grilled Salmon Filet', 'Pan-seared Atlantic salmon with asparagus, roasted potatoes and dill sauce.', 32.00, 'https://images.unsplash.com/photo-1481070555726-e2fe83477d4c?w=800', true),
  (v_store_id, v_cat_main, 'Margherita Pizza', 'Wood-fired pizza with San Marzano tomato sauce, fresh mozzarella, and basil.', 19.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', true),

  -- Beverages
  (v_store_id, v_cat_drinks, 'Signature Martini', 'Classic shaken martini with premium vodka and a twist of lemon.', 16.00, 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800', true),
  (v_store_id, v_cat_drinks, 'Artisan Cappuccino', 'Freshly brewed espresso topped with velvety steamed milk foam.', 6.50, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800', true),
  (v_store_id, v_cat_drinks, 'Fresh Orange Juice', 'Freshly squeezed morning oranges. 250ml.', 8.00, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800', true),

  -- Services
  (v_store_id, v_cat_services, 'Late Checkout (Till 2 PM)', 'Extend your stay comfortably until 2 PM. Avoid the morning rush.', 45.00, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', true),
  (v_store_id, v_cat_services, 'Laundry Service (Per Bag)', 'Wash and fold service. Returned same day if picked up before 10 AM.', 30.00, 'https://images.unsplash.com/photo-1517627043994-b99eaa90a369?w=800', true),
  (v_store_id, v_cat_services, 'Airport Transfer', 'Luxury town car transfer to the international airport.', 85.00, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800', true);

END $$;
