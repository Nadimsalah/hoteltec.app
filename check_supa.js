import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            id,
            order_items (
                product_name,
                products ( image_url )
            )
        `)
        .limit(5);

    console.log(JSON.stringify(data, null, 2));
}

check();
