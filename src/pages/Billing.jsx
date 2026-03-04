import React, { useState } from 'react';
import {
    Crown,
    CreditCard,
    Download,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Activity,
    Smartphone,
    Video,
    LayoutDashboard,
    Globe,
    HeartHandshake,
    Building2
} from 'lucide-react';

const Billing = () => {

    const whopPlanId = import.meta.env.VITE_WHOP_PLAN_ID || 'plan_cydWXdhPRcQVs';

    const handleWhopCheckout = () => {
        // Direct integration redirect to Whop Checkout for rock-solid stability
        window.open(`https://whop.com/checkout/${whopPlanId}`, '_blank');
    };

    const ultimatePlan = {
        name: 'Hoteltec Enterprise',
        price: '2000',
        oldPrice: '2500',
        description: 'The all-in-one operating system designed exclusively for modern luxury hotels and visionary resorts.',
        features: [
            { icon: <Activity size={20} />, title: 'Unlimited Rooms & Orders', desc: 'Scale infinitely with no caps on capacity.' },
            { icon: <Building2 size={20} />, title: 'Unlimited Hotel Stores', desc: 'Manage multiple hotel locations under one master account.' },
            { icon: <Smartphone size={20} />, title: 'Smart QR & Mobile Ordering', desc: 'Frictionless room service via instant scans.' },
            { icon: <Video size={20} />, title: 'Interactive Video Stories', desc: 'Engage guests with dynamic, Instagram-style content.' },
            { icon: <LayoutDashboard size={20} />, title: 'Real-time Analytics', desc: 'Actionable business insights and live revenue tracking.' },
            { icon: <Globe size={20} />, title: 'Custom Branded Store', desc: 'A gorgeous frontend tailored to your aesthetics.' },
            { icon: <HeartHandshake size={20} />, title: '24/7 VIP Support', desc: 'Direct, priority assistance and dedicated management.' }
        ]
    };

    return (
        <div className="billing-container">
            <style>{`
                .billing-container {
                    padding: 40px;
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                    animation: fadeIn 0.4s ease-out;
                    position: relative;
                }

                @keyframes fadeIn { 
                    from { opacity: 0; transform: translateY(10px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }

                .billing-header {
                    margin-bottom: 60px;
                    text-align: center;
                    position: relative;
                    z-index: 10;
                }
                
                .billing-header h1 {
                    font-size: 42px;
                    font-weight: 800;
                    letter-spacing: -0.04em;
                    color: #0f172a;
                    margin: 0;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .billing-header p {
                    color: #64748b;
                    font-size: 20px;
                    margin: 16px 0 0 0;
                    font-weight: 500;
                }

                /* Liquid Glass Background Effects */
                .liquid-blob-1 {
                    position: absolute;
                    top: 10%;
                    left: 20%;
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
                    filter: blur(80px);
                    opacity: 0.15;
                    animation: morph 8s ease-in-out infinite both alternate;
                    z-index: 0;
                }

                .liquid-blob-2 {
                    position: absolute;
                    top: 20%;
                    right: 20%;
                    width: 500px;
                    height: 500px;
                    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    filter: blur(80px);
                    opacity: 0.15;
                    animation: morph 10s ease-in-out infinite both alternate-reverse;
                    z-index: 0;
                }

                @keyframes morph {
                    0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: scale(1) translate(0, 0) rotate(0deg); }
                    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(1.1) translate(20px, 20px) rotate(10deg); }
                }

                /* Showcased Liquid Glass Plan Card */
                .pricing-showcase {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 60px;
                    position: relative;
                    z-index: 10;
                }

                .premium-glass-card {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    border-radius: 40px;
                    padding: 48px;
                    width: 100%;
                    max-width: 1000px;
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 60px;
                    box-shadow: 
                        0 20px 40px -10px rgba(0,0,0,0.05),
                        inset 0 0 0 1px rgba(255,255,255,0.6),
                        inset 0 2px 20px rgba(255,255,255,0.5);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.7);
                }

                .plan-left {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    z-index: 2;
                }
                
                .plan-badge {
                    background: rgba(255,255,255,0.8);
                    border: 1px solid rgba(255,255,255,1);
                    padding: 8px 20px;
                    border-radius: 100px;
                    font-size: 13px;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    width: fit-content;
                    margin-bottom: 32px;
                    color: #3b82f6;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                
                .plan-price-large {
                    font-size: 80px;
                    font-weight: 800;
                    line-height: 1;
                    margin-bottom: 24px;
                    letter-spacing: -0.04em;
                    display: flex;
                    align-items: flex-start;
                    color: #0f172a;
                    position: relative;
                }
                .old-price-promo {
                    position: absolute;
                    top: -30px;
                    left: 4px;
                    font-size: 28px;
                    color: #94a3b8;
                    text-decoration: line-through;
                    text-decoration-color: #ef4444;
                    text-decoration-thickness: 3px;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }
                .plan-price-large span.currency {
                    font-size: 36px;
                    margin-right: 4px;
                    margin-top: 8px;
                    color: #64748b;
                }
                .plan-price-large span.period {
                    font-size: 18px;
                    font-weight: 600;
                    margin-left: 8px;
                    margin-top: auto;
                    margin-bottom: 12px;
                    color: #64748b;
                    letter-spacing: 0;
                }
                
                .plan-desc-large {
                    font-size: 16px;
                    color: #475569;
                    line-height: 1.6;
                    margin-bottom: 48px;
                    font-weight: 500;
                }

                .whop-checkout-btn-glass {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    border: none;
                    padding: 20px 40px;
                    border-radius: 100px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    width: 100%;
                    box-shadow: 0 10px 20px -5px rgba(15,23,42,0.3);
                }

                .whop-checkout-btn-glass:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 20px 30px -10px rgba(15,23,42,0.4);
                }

                .plan-right {
                    position: relative;
                    z-index: 2;
                    background: rgba(255,255,255,0.6);
                    border-radius: 24px;
                    padding: 32px;
                    border: 1px solid rgba(255,255,255,0.8);
                }

                .features-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .feature-block {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }

                .feature-icon-wrap {
                    background: white;
                    color: #3b82f6;
                    width: 44px;
                    height: 44px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }

                .feature-text h4 {
                    margin: 0 0 6px 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                }

                .feature-text p {
                    margin: 0;
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.5;
                }

                @media (max-width: 1024px) {
                    .premium-glass-card {
                        grid-template-columns: 1fr;
                        padding: 32px;
                    }
                    .billing-container { padding: 20px; }
                }
            `}</style>

            <div className="liquid-blob-1"></div>
            <div className="liquid-blob-2"></div>

            <div className="billing-header">
                <h1><Crown size={40} color="#3b82f6" /> Upgrade to Enterprise</h1>
                <p>Unlock the full power of Hoteltec and scale your room service operations instantly.</p>
            </div>

            <div className="pricing-showcase">
                <div className="premium-glass-card">
                    <div className="plan-left">
                        <div className="plan-badge">
                            <Sparkles size={16} /> Elite Choice
                        </div>

                        <div className="plan-price-large">
                            <div className="old-price-promo">${ultimatePlan.oldPrice}</div>
                            <span className="currency">$</span>
                            {ultimatePlan.price}
                            <span className="period">/ year</span>
                        </div>

                        <p className="plan-desc-large">{ultimatePlan.description}</p>

                        <button className="whop-checkout-btn-glass" onClick={handleWhopCheckout}>
                            Checkout securely
                            <ArrowRight size={20} />
                        </button>

                        <p style={{ marginTop: '20px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                            <ShieldCheck size={16} /> Secure payments handled by Whop. Cancel anytime.
                        </p>
                    </div>

                    <div className="plan-right">
                        <div className="features-grid">
                            {ultimatePlan.features.map((feature, idx) => (
                                <div className="feature-block" key={idx}>
                                    <div className="feature-icon-wrap">
                                        {feature.icon}
                                    </div>
                                    <div className="feature-text">
                                        <h4>{feature.title}</h4>
                                        <p>{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
