import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import {
  ShoppingBag,
  Search,
  Menu,
  ChevronLeft,
  Plus,
  Star,
  Clock,
  Heart,
  X,
  Minus
} from 'lucide-react';

// Hardcoded defaults removed. Data is now fetched from Supabase.

import { useNavigate, useParams } from 'react-router-dom';

export default function HotelStore({ presetSlug }) {
  const navigate = useNavigate();
  const { slug: routeSlug } = useParams();
  const slug = presetSlug || routeSlug;
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', room: '', payment: 'Cash' });
  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [flyingItems, setFlyingItems] = useState([]);
  const cartRef = useRef(null);

  // Story Viewer State
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  useEffect(() => {
    fetchStoreData();
  }, [slug]);

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      // 1. Fetch store by slug column directly (MUCH safer and faster)
      let { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      // 2. Fallback for older stores without slug column set but matching name
      if (!store) {
        const { data: allStores } = await supabase.from('stores').select('*');
        store = allStores?.find(s => {
          const sSlug = s.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
          return sSlug === slug;
        });
      }

      if (store) {
        setStoreData(store);

        // Parallel fetching for performance
        const [storiesRes, categoriesRes, productsRes] = await Promise.all([
          supabase.from('stories').select('*').eq('store_id', store.id),
          supabase.from('categories').select('*').eq('store_id', store.id).order('index', { ascending: true }),
          supabase.from('products').select('*').eq('store_id', store.id)
        ]);

        if (storiesRes.data) setStories(storiesRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (productsRes.data) setProducts(productsRes.data);
      } else {
        console.error('Store not found for slug:', slug);
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, event) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const cartRect = cartRef.current?.getBoundingClientRect();

      if (cartRect) {
        const newItem = {
          id: Date.now(),
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          tx: (cartRect.left + cartRect.width / 2) - (rect.left + rect.width / 2),
          ty: (cartRect.top + cartRect.height / 2) - (rect.top + rect.height / 2),
          image: product.image_url
        };

        setFlyingItems(prev => [...prev, newItem]);
        setTimeout(() => {
          setFlyingItems(prev => prev.filter(item => item.id !== newItem.id));
        }, 800);
      }
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsOrdering(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          store_id: storeData.id,
          customer_name: checkoutForm.name,
          customer_phone: checkoutForm.phone,
          room_number: checkoutForm.room,
          payment_method: checkoutForm.payment,
          total_amount: cartTotal
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        product_name: item.name
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      setCart([]);
      setIsCheckoutOpen(false);
      setCheckoutForm({ name: '', phone: '', room: '', payment: 'Cash' });
      navigate(presetSlug ? '/success' : `/store/${slug}/success`, { state: { orderId: order.id } });
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    } finally {
      setIsOrdering(false);
    }
  };

  const displayName = storeData ? storeData.name : (slug
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'The Grand Resort');

  const currencySymbol = (() => {
    try {
      const code = storeData?.currency || 'USD';
      return (0).toLocaleString('en', { style: 'currency', currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();
    } catch {
      return '$';
    }
  })();

  const filteredProducts = products.filter(p => {
    const categoryName = categories.find(c => c.id === p.category_id)?.name || 'Other';
    const matchesCategory = activeCategory === 'All' || categoryName === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#0f172a', fontStyle: 'Inter', fontWeight: '600', fontSize: '18px' }}>Hoteltec Loading...</div>;
  }

  // Story Navigation Functions
  const nextStory = () => {
    setStoryProgress(0);
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
    } else {
      setShowStoryViewer(false);
    }
  };

  const prevStory = () => {
    setStoryProgress(0);
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
    }
  };

  const openStory = (index) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
    setShowStoryViewer(true);
  };

  return (
    <div className="store-container">
      <style>{`
        .store-container {
          width: 100%;
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
          color: #0f172a;
          position: relative;
          z-index: 10;
        }

        /* Top Header */
        .store-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .header-icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.06);
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          position: relative;
        }

        .header-icon-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.06);
          border-color: rgba(0,0,0,0.1);
        }

        .header-title {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .cart-wrapper {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }

        /* Search Bar */
        .search-section {
          padding: 16px 24px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 20px;
          padding: 12px 20px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.02);
          transition: all 0.3s;
        }

        .search-bar:focus-within {
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.12);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .search-input {
          border: none;
          background: transparent;
          width: 100%;
          margin-left: 12px;
          font-size: 16px;
          outline: none;
          color: #1e293b;
          font-weight: 500;
        }

        .search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        /* Stories Section */
        .stories-section {
          padding: 16px 24px;
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .stories-section::-webkit-scrollbar {
          display: none;
        }

        .story-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          min-width: 80px;
        }

        .story-ring {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(45deg, #eab308, #ef4444, #ec4899);
          position: relative;
          transition: transform 0.2s;
        }

        .story-item:hover .story-ring {
          transform: scale(1.05);
        }

        .story-ring.inactive {
          background: #cbd5e1;
        }

        .story-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid #f8fafc;
          object-fit: cover;
        }

        .story-name {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        /* Categories */
        .categories-section {
          padding: 16px 24px;
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          position: sticky;
          top: 93px;
          background: rgba(248, 250, 252, 0.9);
          backdrop-filter: blur(12px);
          z-index: 40;
        }
        
        .categories-section::-webkit-scrollbar {
          display: none;
        }

        .category-pill {
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.3s;
          background: #ffffff;
          color: #64748b;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .category-pill.active {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.2);
          border-color: #0f172a;
        }

        /* Products Grid */
        .products-section {
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          padding-bottom: 100px;
        }

        .product-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          position: relative;
          overflow: hidden;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .product-image-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          margin-bottom: 16px;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.08);
        }

        .popular-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ea580c;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .like-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #94a3b8;
          transition: all 0.2s;
        }

        .like-btn:hover {
          color: #ef4444;
          transform: scale(1.1);
        }

        .product-info {
          padding: 0 8px;
        }

        .product-category {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px dashed rgba(0,0,0,0.1);
        }

        .product-price {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        .product-price span {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin-right: 2px;
        }

        .add-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #0f172a;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .add-btn:hover {
          transform: scale(1.05);
          background: #3b82f6;
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        /* Modal / Cart Drawer Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: flex-end;
            justify-content: center;
        }
        .modal-card {
            background: white;
            width: 100%;
            max-width: 500px;
            border-radius: 32px 32px 0 0;
            padding: 32px 24px;
            box-shadow: 0 -20px 40px rgba(0,0,0,0.1);
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .checkout-title { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
        .checkout-subtitle { color: #64748b; margin-bottom: 24px; font-size: 15px; }

        .cart-items { max-height: 300px; overflow-y: auto; margin-bottom: 24px; }
        .cart-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .cart-item-info h4 { font-weight: 700; font-size: 16px; margin: 0; }
        .cart-item-info p { color: #64748b; font-size: 14px; margin: 2px 0 0 0; }
        .item-qty-controls { display: flex; align-items: center; gap: 12px; }
        .qty-btn { width: 32px; height: 32px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .form-group label { font-weight: 700; font-size: 14px; color: #334155; }
        .form-input { padding: 14px; border-radius: 16px; border: 1px solid #e2e8f0; font-size: 16px; font-family: inherit; }
        .form-input:focus { border-color: #3b82f6; outline: none; }

        .payment-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .payment-option { 
            padding: 16px; 
            border-radius: 16px; 
            border: 2px solid #e2e8f0; 
            text-align: center; 
            font-weight: 700; 
            cursor: pointer; 
            transition: all 0.2s; 
        }
        .payment-option.active { border-color: #3b82f6; background: rgba(59,130,246,0.05); color: #3b82f6; }

        .checkout-footer { padding-top: 20px; border-top: 1px solid #f1f5f9; }
        .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .total-label { font-size: 16px; color: #64748b; font-weight: 600; }
        .total-val { font-size: 28px; font-weight: 800; color: #0f172a; }
        .pay-btn { 
            width: 100%; 
            padding: 18px; 
            background: #0f172a; 
            color: #fff; 
            border: none; 
            border-radius: 20px; 
            font-size: 18px; 
            font-weight: 700; 
            cursor: pointer; 
            transition: all 0.2s; 
        }
        .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pay-btn:hover:not(:disabled) { transform: translateY(-2px); background: #3b82f6; }

        .flying-item {
          position: fixed;
          z-index: 10000;
          pointer-events: none;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          font-size: 24px;
          border: 2px solid white;
          animation: flyToCart 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes flyToCart {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          40% { transform: translate(calc(var(--tx) * 1px * 0.4 - 50%), calc(var(--ty) * 1px * 0.4 - 100% - 50%)) scale(1.1); }
          100% { transform: translate(calc(var(--tx) * 1px - 50%), calc(var(--ty) * 1px - 50%)) scale(0.1); opacity: 0; }
        }

        .cart-bounce {
          animation: cartBounce 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cartBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @media (max-width: 768px) {
            .modal-card { padding: 24px 20px; }
            .form-grid { grid-template-columns: 1fr; }
        }

        /* Product Details Modal */
        .product-details-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .product-details-card {
          background: white;
          width: 100%;
          max-width: 600px;
          border-radius: 32px;
          overflow: hidden;
          position: relative;
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 40px 100px rgba(0,0,0,0.25);
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .details-image-wrap {
          width: 100%;
          height: 350px;
          position: relative;
        }

        .details-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .details-info {
          padding: 32px;
        }

        .details-cat {
          font-size: 13px;
          font-weight: 800;
          color: #3b82f6;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .details-name {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .details-desc {
          font-size: 16px;
          line-height: 1.6;
          color: #64748b;
          margin-bottom: 24px;
        }

        .details-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 32px;
        }

        .details-meta-item {
          background: #f8fafc;
          padding: 12px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        .details-price {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
        }

        .details-price span {
          font-size: 16px;
          font-weight: 600;
          color: #94a3b8;
        }

        .details-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .details-add-btn {
          background: #0f172a;
          color: white;
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .details-add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
        }

        @media (max-width: 768px) {
          .product-details-card {
            max-width: 100%;
            height: auto;
            border-radius: 40px 40px 0 0;
          }
          .product-details-overlay {
            align-items: flex-end;
            padding: 0;
          }
          .details-image-wrap {
            height: 300px;
          }
          .details-info {
            padding: 24px;
          }
        }

        /* Instagram Story Viewer */
        .story-viewer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Inter', sans-serif;
        }

        .story-container-main {
          width: 100%;
          max-width: 500px;
          height: 100%;
          position: relative;
          background: #111;
          display: flex;
          flex-direction: column;
        }

        .story-bars {
          position: absolute;
          top: 20px;
          left: 10px;
          right: 10px;
          display: flex;
          gap: 4px;
          z-index: 100;
        }

        .story-bar-bg {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        .story-bar-progress {
          height: 100%;
          background: white;
          transition: width 0.1s linear;
        }

        .story-top-info {
          position: absolute;
          top: 35px;
          left: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
        }

        .story-hotel-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .story-hotel-logo {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          object-fit: cover;
        }

        .story-title-main {
          font-weight: 700;
          font-size: 15px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .story-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
        }

        .story-content-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .story-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .story-nav-area {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          cursor: pointer;
          z-index: 10;
        }

        .left-nav { left: 0; }
        .right-nav { right: 0; }

        .story-footer-action {
          position: absolute;
          bottom: 40px;
          left: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 100;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: 40px 0 20px 0;
        }

        .story-swipe-up {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          animation: bounce 2s infinite;
        }

        .story-order-btn {
          background: white;
          color: black;
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 800;
          border: none;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        }

        .story-order-btn:hover {
          transform: scale(1.05);
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `}</style>

      {/* Header */}
      <header className="store-header">
        <button className="header-icon-btn" onClick={() => navigate('/dash')}>
          <ChevronLeft size={24} color="#0f172a" />
        </button>
        <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#0f172a',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            overflow: 'hidden'
          }}>
            {storeData?.logo_url ? (
              <img
                src={storeData.logo_url}
                alt="Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerText = displayName?.[0] || 'H';
                }}
              />
            ) : displayName?.[0] || 'H'}
          </div>
          {displayName}
        </div>
        <div className="cart-wrapper" ref={cartRef}>
          <button className={`header-icon-btn ${cart.length > 0 ? 'cart-bounce' : ''}`} key={cart.length} onClick={() => setIsCheckoutOpen(true)}>
            <ShoppingBag size={22} color="#0f172a" />
            {cart.length > 0 && <div className="cart-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</div>}
          </button>
        </div>
      </header>

      {/* Stories Section */}
      {stories.length > 0 && (
        <div className="stories-section">
          {stories.map((story, idx) => (
            <div className="story-item" key={story.id} onClick={() => openStory(idx)}>
              <div className="story-ring">
                {story.media_type === 'video' ? (
                  <video src={story.media_url} className="story-img" muted />
                ) : (
                  <img src={story.media_url} alt={story.title} className="story-img" />
                )}
              </div>
              <span className="story-name">{story.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search Bar */}
      {products.length > 0 && (
        <div className="search-section">
          <div className="search-bar">
            <Search size={22} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search for in-room dining, spa..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Categories */}
      {products.length > 0 && categories.length > 0 && (
        <div className="categories-section">
          <div
            className={`category-pill ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All
          </div>
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-pill ${activeCategory === category.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.name}
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="products-section">
        {filteredProducts.map(product => (
          <div className="product-card" key={product.id} onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
            <div className="product-image-wrap">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="img-placeholder" style={{
                width: '100%',
                height: '100%',
                background: '#f1f5f9',
                display: product.image_url ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>🥗</div>
              {product.popular && (
                <div className="popular-badge">
                  <Star size={12} fill="#ea580c" color="#ea580c" /> Popular
                </div>
              )}
              <div className="like-btn" onClick={(e) => { e.stopPropagation(); }}>
                <Heart size={18} />
              </div>
            </div>

            <div className="product-info">
              <div className="product-category">
                {categories.find(c => c.id === product.category_id)?.name || 'General'}
              </div>
              <div className="product-name">{product.name}</div>

              <div className="product-meta">
                <div className="meta-item">
                  <Star size={14} fill="#eab308" color="#eab308" />
                  {product.rating || '4.5'}
                </div>
                <div className="meta-item">
                  <Clock size={14} color="#64748b" />
                  {product.prep_time || '15-20 min'}
                </div>
              </div>

              <div className="product-bottom">
                <div className="product-price">
                  <span>{currencySymbol}</span>{product.price}
                </div>
                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, e);
                  }}
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: 'white', borderRadius: '32px', border: '2px dashed #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', marginTop: '12px' }}>
            <div style={{ width: '88px', height: '88px', borderRadius: '24px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '24px', boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.02)' }}>
              {products.length === 0 ? '🍽️' : '🔍'}
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.02em', textAlign: 'center' }}>
              {products.length === 0 ? 'Menu Coming Soon' : 'No matches found'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '340px', textAlign: 'center', lineHeight: '1.6' }}>
              {products.length === 0
                ? 'We are carefully preparing our digital menu. Our delicious offerings will be available here shortly!'
                : 'Try adjusting your search or category filters to find what you are looking for.'}
            </p>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 className="checkout-title">Checkout 🛎️</h2>
                <p className="checkout-subtitle">Fill in your details for express delivery.</p>
              </div>
              <button className="header-icon-btn" onClick={() => setIsCheckoutOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price} each</p>
                  </div>
                  <div className="item-qty-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                    <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Your cart is empty</div>}
            </div>

            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="form-input"
                  required
                  value={checkoutForm.name}
                  onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Room Number</label>
                  <input
                    className="form-input"
                    required
                    value={checkoutForm.room}
                    onChange={e => setCheckoutForm({ ...checkoutForm, room: e.target.value })}
                    placeholder="102"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    className="form-input"
                    required
                    value={checkoutForm.phone}
                    onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    placeholder="+1 234..."
                  />
                </div>
              </div>

              <label style={{ fontWeight: 700, fontSize: 14, display: 'block', marginBottom: 12 }}>Payment Method</label>
              <div className="payment-options">
                <div
                  className={`payment-option ${checkoutForm.payment === 'Cash' ? 'active' : ''}`}
                  onClick={() => setCheckoutForm({ ...checkoutForm, payment: 'Cash' })}
                >
                  Cash 💵
                </div>
                <div
                  className={`payment-option ${checkoutForm.payment === 'TPE' ? 'active' : ''}`}
                  onClick={() => setCheckoutForm({ ...checkoutForm, payment: 'TPE' })}
                >
                  TPE 💳
                </div>
              </div>

              <div className="checkout-footer">
                <div className="total-row">
                  <span className="total-label">Total Amount</span>
                  <span className="total-val">{currencySymbol}{cartTotal.toFixed(2)}</span>
                </div>
                <button className="pay-btn" type="submit" disabled={isOrdering || cart.length === 0}>
                  {isOrdering ? 'Processing...' : 'Place Order Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {showStoryViewer && stories[activeStoryIndex] && (
        <div className="story-viewer-overlay" onContextMenu={e => e.preventDefault()}>
          <div className="story-container-main">
            {/* Progress Bars */}
            <div className="story-bars">
              {stories.map((_, i) => (
                <div key={i} className="story-bar-bg">
                  <div
                    className="story-bar-progress"
                    style={{
                      width: i < activeStoryIndex ? '100%' : i === activeStoryIndex ? `${storyProgress}%` : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="story-top-info">
              <div className="story-hotel-profile">
                <img src={storeData?.logo_url || '/logo.png'} className="story-hotel-logo" alt="logo" />
                <div className="story-title-main">
                  {stories[activeStoryIndex].title}
                  <div style={{ fontSize: '11px', fontWeight: '400', opacity: 0.8 }}>Just now</div>
                </div>
              </div>
              <button className="story-close" onClick={() => setShowStoryViewer(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Media Content */}
            <div className="story-content-wrap">
              <div className="story-nav-area left-nav" onClick={prevStory} />
              <div className="story-nav-area right-nav" onClick={nextStory} />

              {stories[activeStoryIndex].media_type === 'video' ? (
                <video
                  key={stories[activeStoryIndex].id}
                  src={stories[activeStoryIndex].media_url}
                  className="story-media"
                  autoPlay
                  playsInline
                  muted
                  onEnded={nextStory}
                />
              ) : (
                <img
                  key={stories[activeStoryIndex].id}
                  src={stories[activeStoryIndex].media_url}
                  className="story-media"
                  alt="story"
                  onLoad={() => {
                    // Start timer for images
                    let progress = 0;
                    const interval = setInterval(() => {
                      progress += 2;
                      setStoryProgress(progress);
                      if (progress >= 100) {
                        clearInterval(interval);
                        nextStory();
                      }
                    }, 100);
                  }}
                />
              )}
            </div>

            {/* CTA Footer */}
            {stories[activeStoryIndex].linked_product_id && (
              <div className="story-footer-action">
                <div className="story-swipe-up">
                  <ChevronLeft size={24} style={{ transform: 'rotate(90deg)' }} />
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>Order Item</span>
                </div>
                <button
                  className="story-order-btn"
                  onClick={() => {
                    const product = products.find(p => p.id === stories[activeStoryIndex].linked_product_id);
                    if (product) {
                      addToCart(product);
                      setShowStoryViewer(false);
                      setIsCheckoutOpen(true);
                    }
                  }}
                >
                  Order {products.find(p => p.id === stories[activeStoryIndex].linked_product_id)?.name}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="product-details-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-details-card" onClick={e => e.stopPropagation()}>
            <div className="details-image-wrap">
              <button className="details-close" onClick={() => setSelectedProduct(null)}>
                <X size={24} color="#0f172a" />
              </button>
              {selectedProduct.image_url ? (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>🍽️</div>
              )}
            </div>
            <div className="details-info">
              <div className="details-cat">
                {categories.find(c => c.id === selectedProduct.category_id)?.name || 'General'}
              </div>
              <h2 className="details-name">{selectedProduct.name}</h2>
              <p className="details-desc">{selectedProduct.description || 'Experience our exquisite hospitality with this carefully prepared selection.'}</p>

              <div className="details-meta-grid">
                <div className="details-meta-item">
                  <Star size={18} fill="#eab308" color="#eab308" />
                  <span>4.8 Rating</span>
                </div>
                <div className="details-meta-item">
                  <Clock size={18} color="#64748b" />
                  <span>20-30 min</span>
                </div>
                <div className="details-meta-item">
                  <Heart size={18} color="#ef4444" />
                  <span>Premium</span>
                </div>
              </div>

              <div className="details-footer">
                <div className="details-price">
                  <span>{currencySymbol}</span>{selectedProduct.price}
                </div>
                <button
                  className="details-add-btn"
                  onClick={(e) => {
                    addToCart(selectedProduct, e);
                    setSelectedProduct(null);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
