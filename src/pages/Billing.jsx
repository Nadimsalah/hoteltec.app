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
    AlertCircle,
    X
} from 'lucide-react';
import { WhopCheckoutEmbed } from '@whop/checkout/react';

const Billing = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    const whopPlanId = import.meta.env.VITE_WHOP_PLAN_ID || '';
    const whopAppId = import.meta.env.VITE_WHOP_APP_ID || 'app_zwc7TRUawFGS22';

    const handleWhopCheckout = () => {
        if (!whopPlanId) {
            // Show config modal if no plan ID
            setShowCheckout(true);
            return;
        }
        setShowCheckout(true);
    };

    const ultimatePlan = {
        name: 'Hoteltec Enterprise',
        price: '599',
        description: 'The all-in-one operating system designed exclusively for modern luxury hotels and visionary resorts.',
        features: [
            { icon: <Activity size={20} />, title: 'Unlimited Rooms & Orders', desc: 'Scale infinitely with no caps on capacity.' },
            { icon: <Smartphone size={20} />, title: 'Smart QR & Mobile Ordering', desc: 'Frictionless room service via instant scans.' },
            { icon: <Video size={20} />, title: 'Interactive Video Stories', desc: 'Engage guests with dynamic, Instagram-style content.' },
            { icon: <LayoutDashboard size={20} />, title: 'Real-time Analytics', desc: 'Actionable business insights and live revenue tracking.' },
            { icon: <Globe size={20} />, title: 'Custom Branded Store', desc: 'A gorgeous frontend tailored to your aesthetics.' },
            { icon: <HeartHandshake size={20} />, title: '24/7 VIP Support', desc: 'Direct, priority assistance and dedicated management.' }
        ]
    };

    const invoices = [
        { id: 'INV-001', date: 'Mar 01, 2026', amount: '$599.00', status: 'Paid', method: '•••• 4242' },
        { id: 'INV-002', date: 'Feb 01, 2026', amount: '$599.00', status: 'Paid', method: '•••• 4242' },
    ];

    return (
        <div className="billing-container">
            <style>{`
                .billing-container {
                    padding: 40px;
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                    animation: fadeIn 0.4s ease-out;
                }
                
                @keyframes fadeIn { 
                    from { opacity: 0; transform: translateY(10px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }

                .billing-header {
                    margin-bottom: 48px;
                    text-align: center;
                }
                
                .billing-header h1 {
                    font-size: 36px;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    color: #0f172a;
                    margin: 0;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .billing-header p {
                    color: #64748b;
                    font-size: 18px;
                    margin: 12px 0 0 0;
                    font-weight: 500;
                }

                /* Showcased Pricing Card */
                .pricing-showcase {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 60px;
                }

                .premium-plan-card {
                    background: #020617;
                    border-radius: 32px;
                    padding: 48px;
                    width: 100%;
                    max-width: 1000px;
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 60px;
                    box-shadow: 0 40px 100px -20px rgba(2, 6, 23, 0.5);
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                /* Decorative Gradients inside Card */
                .premium-plan-card::before {
                    content: '';
                    position: absolute;
                    top: -40%;
                    right: -20%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .premium-plan-card::after {
                    content: '';
                    position: absolute;
                    bottom: -30%;
                    left: -10%;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 60%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .plan-left {
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    z-index: 2;
                }
                
                .plan-badge {
                    background: linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.2) 100%);
                    border: 1px solid rgba(59,130,246,0.3);
                    padding: 8px 16px;
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
                    color: #60a5fa;
                    box-shadow: 0 0 20px rgba(59,130,246,0.2);
                }
                
                .plan-price-large {
                    font-size: 80px;
                    font-weight: 800;
                    line-height: 1;
                    margin-bottom: 24px;
                    letter-spacing: -0.04em;
                    display: flex;
                    align-items: flex-start;
                    background: linear-gradient(to right, #ffffff, #cbd5e1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .plan-price-large span.currency {
                    font-size: 36px;
                    margin-right: 4px;
                    margin-top: 8px;
                    -webkit-text-fill-color: #94a3b8;
                }
                .plan-price-large span.period {
                    font-size: 18px;
                    font-weight: 600;
                    margin-left: 8px;
                    margin-top: auto;
                    margin-bottom: 12px;
                    -webkit-text-fill-color: #64748b;
                    letter-spacing: 0;
                }
                
                .plan-desc-large {
                    font-size: 16px;
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 48px;
                }
                
                .whop-checkout-btn {
                    background: linear-gradient(135deg, #FF6243 0%, #FF3D14 100%);
                    color: white;
                    padding: 20px 32px;
                    border-radius: 16px;
                    font-size: 18px;
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 10px 30px -10px rgba(255, 98, 67, 0.6);
                    position: relative;
                    overflow: hidden;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .whop-checkout-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%; width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: all 0.5s ease;
                }
                .whop-checkout-btn:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px -10px rgba(255, 98, 67, 0.8);
                }
                .whop-checkout-btn:hover::before {
                    left: 200%;
                }

                .plan-right {
                    position: relative;
                    z-index: 2;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    padding: 32px;
                    border: 1px solid rgba(255,255,255,0.05);
                    backdrop-filter: blur(10px);
                }
                
                .features-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                }
                
                .feature-block {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                    transition: transform 0.2s;
                }
                .feature-block:hover {
                    transform: translateX(4px);
                }
                
                .feature-icon-wrap {
                    background: rgba(59, 130, 246, 0.1);
                    color: #60a5fa;
                    padding: 10px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }
                
                .feature-text h4 {
                    color: #f8fafc;
                    margin: 0 0 6px 0;
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                }
                
                .feature-text p {
                    color: #94a3b8;
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.5;
                }

                /* Subscribed View */
                .subscription-overview {
                    background: white;
                    border-radius: 24px;
                    padding: 32px;
                    margin-bottom: 32px;
                    border: 1px solid rgba(0,0,0,0.05);
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 32px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.02);
                }
                .overview-item h4 { font-size: 13px; color: #64748b; text-transform: uppercase; margin: 0 0 12px 0; letter-spacing: 0.05em; font-weight: 700; }
                .overview-item p { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;}
                .overview-item .status-active { color: #10b981; }

                .history-card {
                    background: white;
                    border-radius: 24px;
                    border: 1px solid rgba(0,0,0,0.05);
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.02);
                }
                .history-header { padding: 24px 32px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .history-table { width: 100%; border-collapse: collapse; }
                .history-table th { background: #f8fafc; padding: 16px 32px; text-align: left; font-size: 13px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
                .history-table td { padding: 20px 32px; border-bottom: 1px solid #f8fafc; font-size: 15px; color: #1e293b; }
                .download-invoice-btn {
                    background: transparent;
                    border: 1px solid #e2e8f0;
                    padding: 8px 16px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    color: #475569;
                    transition: all 0.2s;
                }
                .download-invoice-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }

                .demo-toggle {
                    position: fixed;
                    bottom: 32px;
                    right: 32px;
                    background: white;
                    color: #0f172a;
                    padding: 12px 24px;
                    border-radius: 100px;
                    border: 1px solid #e2e8f0;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                .demo-toggle:hover {
                    background: #f8fafc;
                    transform: translateY(-2px);
                    box-shadow: 0 14px 30px rgba(0,0,0,0.15);
                }

                /* Whop Modal Styles */
                .whop-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    animation: fadeIn 0.3s ease;
                }
                .whop-modal-content {
                    background: white;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 500px;
                    position: relative;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.3);
                    overflow: hidden;
                }
                .whop-modal-header {
                    padding: 24px 32px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .whop-modal-body {
                    padding: 32px;
                }
                
                .whop-config-alert {
                    background: #fffbeb;
                    border: 1px solid #fde68a;
                    padding: 24px;
                    border-radius: 16px;
                    color: #92400e;
                    margin-bottom: 24px;
                }
                .whop-config-title {
                    font-size: 16px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                .whop-code-block {
                    background: #1e293b;
                    color: #e2e8f0;
                    padding: 16px;
                    border-radius: 12px;
                    font-family: monospace;
                    font-size: 13px;
                    word-break: break-all;
                }
                .whop-embed-container {
                    min-height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @media (max-width: 1024px) {
                    .premium-plan-card {
                        grid-template-columns: 1fr;
                        padding: 40px;
                        gap: 40px;
                    }
                    .plan-right {
                        background: transparent;
                        padding: 0;
                        border: none;
                    }
                }

                @media (max-width: 768px) {
                    .billing-container { padding: 24px !important; padding-bottom: 120px !important; }
                    .premium-plan-card { padding: 32px 24px; border-radius: 28px; }
                    .plan-price-large { font-size: 64px; }
                    .whop-checkout-btn { width: 100%; padding: 18px; font-size: 16px; }
                    .subscription-overview { grid-template-columns: 1fr; gap: 20px; padding: 24px; }
                    .overview-item { padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
                    .overview-item:last-child { border-bottom: none; padding-bottom: 0; }
                    
                    /* History table overrides */
                    .history-header { flex-direction: column; align-items: stretch; gap: 16px; }
                    .history-table thead { display: none; }
                    .history-table, .history-table tbody, .history-table tr, .history-table td { display: block; width: 100%; }
                    .history-table tr { padding: 20px; border-bottom: 1px solid #f1f5f9; position: relative; }
                    .history-table td { padding: 4px 0 !important; border: none !important; }
                    
                    .demo-toggle {
                        bottom: 90px;
                        left: 50%;
                        transform: translateX(-50%);
                        right: auto;
                        width: max-content;
                    }
                }
            `}</style>

            <header className="billing-header">
                <h1>
                    <Crown size={36} color="#3b82f6" />
                    Billing & Subscription
                </h1>
                <p>Manage your Hoteltec plan and unlock the ultimate hotel experience.</p>
            </header>

            {!isSubscribed ? (
                <div className="pricing-showcase">
                    <div className="premium-plan-card">
                        <div className="plan-left">
                            <div className="plan-badge">
                                <Sparkles size={16} />
                                Enterprise Suite
                            </div>

                            <div className="plan-price-large">
                                <span className="currency">$</span>
                                {ultimatePlan.price}
                                <span className="period">/ month</span>
                            </div>

                            <p className="plan-desc-large">{ultimatePlan.description}</p>

                            <button className="whop-checkout-btn" onClick={handleWhopCheckout}>
                                Checkout securely
                                <ArrowRight size={20} />
                            </button>

                            <p style={{ marginTop: '20px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ShieldCheck size={16} /> Cancel anytime. Secure payments.
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
            ) : (
                <div className="management-section" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="subscription-overview">
                        <div className="overview-item">
                            <h4>Current Plan</h4>
                            <p className="status-active"><ShieldCheck size={24} /> {ultimatePlan.name}</p>
                        </div>
                        <div className="overview-item">
                            <h4>Next Billing Date</h4>
                            <p>April 01, 2026</p>
                        </div>
                        <div className="overview-item">
                            <h4>Status</h4>
                            <p style={{ color: '#10b981' }}>Active & Healthy</p>
                        </div>
                        <div className="overview-item">
                            <h4>Payment Method</h4>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CreditCard size={20} color="#64748b" /> Visa •••• 4242
                            </p>
                        </div>
                    </div>

                    <div className="history-card">
                        <div className="history-header">
                            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Payment History</h2>
                            <button className="download-invoice-btn">
                                <Download size={18} /> Download All
                            </button>
                        </div>
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td style={{ fontWeight: '800' }}>{inv.id}</td>
                                        <td style={{ color: '#64748b', fontWeight: '500' }}>{inv.date}</td>
                                        <td style={{ fontWeight: '800' }}>{inv.amount}</td>
                                        <td>
                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: '800' }}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="download-invoice-btn" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                                <Download size={14} /> PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button className="demo-toggle" onClick={() => setIsSubscribed(false)}>
                        <ArrowRight size={16} /> View Pricing Screen (Demo)
                    </button>
                </div>
            )}

            {showCheckout && (
                <div className="whop-modal-overlay" onClick={() => setShowCheckout(false)}>
                    <div className="whop-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="whop-modal-header">
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img src="https://whop.com/favicon-32x32.png" alt="whop" width={24} />
                                Secure Checkout
                            </h3>
                            <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="whop-modal-body">
                            {!whopPlanId ? (
                                <div className="whop-config-alert">
                                    <div className="whop-config-title">
                                        <AlertCircle size={20} />
                                        Checkout Requires a Plan ID
                                    </div>
                                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.5' }}>
                                        I have successfully added your <strong>Client ID ({whopAppId})</strong> and <strong>Client Secret</strong> to your environment variables!
                                        <br /><br />
                                        However, to render a checkout page to a customer, Whop requires a specific <strong>Plan ID</strong> (the product the customer is buying). Please add this to your <code>.env.local</code> file:
                                    </p>
                                    <div className="whop-code-block">
                                        VITE_WHOP_PLAN_ID=plan_XXXXXXXXXX
                                    </div>
                                    <p style={{ margin: '16px 0 0 0', fontSize: '13px', color: '#b45309' }}>
                                        You can generate a Plan ID in your Whop seller dashboard under Pricing Options.
                                    </p>

                                    <button
                                        onClick={() => { setShowCheckout(false); setIsSubscribed(true); }}
                                        style={{ marginTop: '24px', width: '100%', padding: '12px', background: '#0f172a', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                                    >
                                        Bypass & Preview active dashboard
                                    </button>
                                </div>
                            ) : (
                                <div className="whop-embed-container">
                                    <WhopCheckoutEmbed
                                        planId={whopPlanId}
                                        theme="light"
                                        onComplete={() => {
                                            setShowCheckout(false);
                                            setIsSubscribed(true);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
