import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import { ShoppingBag, Package, CheckCircle2, Home } from 'lucide-react';
import { supabase } from '../supabaseClient';

import { getSubdomain } from '../utils/domain';

export default function ThankYou() {
  const { slug: routeSlug } = useParams();
  const subdomain = getSubdomain();
  const slug = subdomain || routeSlug;
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [animationData, setAnimationData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch a nice success animation
    fetch('https://lottie.host/73466170-07fd-4d2c-87d4-e6593450e64c/R3K3X6xOa7.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Load Error:", err));

    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
                    *,
                    products (image_url)
                `)
        .eq('order_id', orderId);

      if (data) setOrderItems(data);
    } catch (err) {
      console.error("Error fetching order items:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="thank-you-container">
      <style>{`
        .thank-you-container {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .success-card {
          background: white;
          padding: 40px 32px;
          border-radius: 40px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.08);
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: cardPop 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        @keyframes cardPop {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .product-visuals {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
          position: relative;
          height: 140px;
          width: 100%;
        }

        .product-img-bubble {
          width: 120px;
          height: 120px;
          border-radius: 35px;
          border: 4px solid white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          object-fit: cover;
          position: absolute;
          background: #f1f5f9;
        }

        .lottie-wrap {
          width: 120px;
          height: 120px;
          margin: -10px 0;
        }

        .order-badge {
          background: #f0fdf4;
          color: #10b981;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #d1fae5;
        }

        .thank-title {
          font-size: 32px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.04em;
        }

        .thank-text {
          color: #64748b;
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 32px;
        }

        .summary-box {
            width: 100%;
            background: #f8fafc;
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 32px;
            text-align: left;
        }

        .summary-title {
            font-size: 12px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            margin-bottom: 12px;
            display: block;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 6px;
        }

        .btn-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .btn-main {
          background: #0f172a;
          color: white;
          padding: 18px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-main:hover {
          background: #3b82f6;
          transform: translateY(-2px);
        }

        .btn-ghost {
          background: transparent;
          color: #64748b;
          padding: 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          font-weight: 700;
          transition: all 0.2s;
        }

        .btn-ghost:hover {
          border-color: #0f172a;
          color: #0f172a;
        }
      `}</style>

      <div className="success-card">
        <div className="product-visuals">
          {orderItems.length > 0 ? (
            orderItems.slice(0, 3).map((item, idx) => (
              <img
                key={item.id}
                src={item.products?.image_url}
                className="product-img-bubble"
                style={{
                  transform: `translateX(${(idx - (Math.min(orderItems.length, 3) - 1) / 2) * 50}px) scale(${1 - idx * 0.1})`,
                  zIndex: 10 - idx,
                  opacity: 1 - idx * 0.2
                }}
                alt="item"
              />
            ))
          ) : (
            <div className="product-img-bubble" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={50} color="#cbd5e1" />
            </div>
          )}
        </div>

        <div className="order-badge">
          <CheckCircle2 size={18} />
          Order Confirmed
        </div>

        <div className="lottie-wrap">
          {animationData && (
            <Lottie animationData={animationData} loop={false} />
          )}
        </div>

        <h1 className="thank-title">Success!</h1>
        <p className="thank-text">
          Your order <b>#{orderId?.slice(-6).toUpperCase()}</b> is confirmed and being prepared.
        </p>

        <div className="summary-box">
          <span className="summary-title">Summary</span>
          {orderItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.quantity}x {item.product_name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="btn-stack">
          <button className="btn-main" onClick={() => {
            if (subdomain) navigate('/');
            else if (slug) navigate(`/store/${slug}`);
            else navigate('/');
          }}>
            <ShoppingBag size={20} />
            Order More
          </button>
          <button className="btn-ghost" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
