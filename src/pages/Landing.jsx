import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Star, Heart, Wand2, ArrowUpRight, CheckCircle2,
    Crown, ShieldCheck, ArrowRight, Sparkles, Activity,
    Smartphone, Video, LayoutDashboard, Globe, HeartHandshake, CreditCard,
    Building2
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

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
        <div className="landing-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .landing-wrapper {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background: #ffffff;
                    min-height: 100vh;
                    color: #000000;
                    overflow-x: hidden;
                    display: flex;
                    flex-direction: column;
                }

                /* Header */
                .landing-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 64px;
                    background: transparent;
                    width: 100%;
                    max-width: 1440px;
                    margin: 0 auto;
                }

                .landing-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 700;
                    font-size: 20px;
                    color: #000;
                    cursor: pointer;
                }

                .landing-logo img {
                    height: 42px;
                    object-fit: contain;
                }

                .nav-links {
                    display: flex;
                    gap: 32px;
                    align-items: center;
                }

                .nav-link {
                    color: #666;
                    text-decoration: none;
                    font-size: 15px;
                    font-weight: 500;
                    transition: color 0.2s;
                    cursor: pointer;
                }

                .nav-link:hover {
                    color: #000;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                }

                .btn-signin {
                    background: #f3f4f6;
                    color: #000;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 100px;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .btn-signin:hover {
                    background: #e5e7eb;
                }

                /* Hero Section */
                .hero-section {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    max-width: 1440px;
                    margin: 20px auto 0;
                    padding: 0 64px 80px;
                    gap: 60px;
                    flex: 1;
                }

                .hero-left {
                    flex: 1;
                    max-width: 540px;
                }

                .trust-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #000;
                    margin-bottom: 32px;
                }

                .hero-title {
                    font-size: 72px;
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -0.04em;
                    color: #000;
                    margin-bottom: 32px;
                }

                .hero-subtitle {
                    font-size: 18px;
                    color: #4b5563;
                    line-height: 1.6;
                    margin-bottom: 48px;
                    max-width: 460px;
                }

                .hero-actions {
                    display: flex;
                    gap: 16px;
                }

                .btn-primary-dark {
                    background: #000;
                    color: #fff;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 100px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-primary-dark:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }

                .btn-secondary-light {
                    background: #f3f4f6;
                    color: #000;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 100px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-secondary-light:hover {
                    background: #e5e7eb;
                }

                .hero-right {
                    flex: 1.2;
                    width: 100%;
                    position: relative;
                    height: 640px;
                    border-radius: 32px;
                    overflow: hidden;
                    background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
                }

                /* Floating UI Elements */
                .floating-ui-1 {
                    position: absolute;
                    top: 40px;
                    right: 40px;
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    width: 250px;
                    animation: float1 6s ease-in-out infinite;
                }

                .ui-1-header {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                }

                .ui-1-stats {
                    display: flex;
                    gap: 16px;
                }

                .stat-col {
                    flex: 1;
                }

                .stat-title {
                    font-size: 10px;
                    color: #666;
                    margin-bottom: 8px;
                }

                .stat-bar-1 {
                    background: #ff7be5;
                    color: black;
                    padding: 12px;
                    font-weight: bold;
                    border-radius: 4px;
                    height: 100px;
                    display: flex;
                    align-items: flex-start;
                    font-size: 12px;
                }

                .stat-bar-2 {
                    background: #f1f5f9;
                    margin-bottom: 8px;
                    color: black;
                    padding: 8px;
                    font-weight: bold;
                    border-radius: 4px;
                    font-size: 11px;
                }

                .stat-bar-3 {
                    background: #5eead4;
                    color: black;
                    padding: 8px;
                    font-weight: bold;
                    border-radius: 4px;
                    height: 60px;
                    font-size: 11px;
                }

                .floating-ui-2 {
                    position: absolute;
                    bottom: 120px;
                    left: 40px;
                    background: white;
                    border-radius: 100px;
                    padding: 12px 24px 12px 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: float2 5s ease-in-out infinite;
                }

                .ui-2-icon {
                    color: #3b82f6;
                }

                .ui-2-text {
                    font-size: 14px;
                    font-weight: 500;
                    color: #000;
                }

                .floating-ui-3 {
                    position: absolute;
                    bottom: 40px;
                    left: 40px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                    font-size: 15px;
                    background: rgba(0,0,0,0.4);
                    padding: 10px 20px;
                    border-radius: 100px;
                    backdrop-filter: blur(8px);
                }

                @keyframes float1 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes float2 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(8px); }
                }

                /* Partners Section */
                .partners-section {
                    border-top: 1px solid #eaeaea;
                    padding: 40px 64px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1440px;
                    margin: 0 auto;
                    width: 100%;
                }

                .partner-logo {
                    font-size: 20px;
                    font-weight: 800;
                    color: #000;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    opacity: 0.8;
                    letter-spacing: -0.02em;
                }
                
                .partner-logo:hover {
                    opacity: 1;
                }

                @media (max-width: 1024px) {
                    .hero-section {
                        flex-direction: column;
                        padding: 0 40px 40px;
                        gap: 40px;
                    }
                    .hero-left {
                        max-width: 100%;
                        text-align: center;
                    }
                    .hero-subtitle {
                        margin: 0 auto 40px;
                    }
                    .hero-actions {
                        justify-content: center;
                    }
                    .hero-right {
                        width: 100%;
                        height: 500px;
                    }
                    .landing-header {
                        padding: 24px 40px;
                    }
                    .nav-links {
                        display: none;
                    }
                    .partners-section {
                        padding: 40px;
                        flex-wrap: wrap;
                        gap: 24px;
                        justify-content: center;
                    }
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 48px;
                    }
                    .hero-right {
                        height: 400px;
                    }
                    .floating-ui-1 {
                        top: 16px;
                        right: 16px;
                        width: 170px;
                        padding: 12px;
                    }
                    .ui-1-header { font-size: 10px; margin-bottom: 8px; }
                    .ui-1-header span { font-size: 10px; }
                    .stat-title { font-size: 8px; margin-bottom: 4px; }
                    .stat-bar-1 { height: 60px; padding: 6px; font-size: 10px; }
                    .stat-bar-2 { padding: 4px; margin-bottom: 4px; font-size: 9px; }
                    .stat-bar-3 { height: 35px; padding: 4px; font-size: 9px; }

                    .floating-ui-2 {
                        bottom: 65px;
                        left: 16px;
                        padding: 8px 14px;
                        gap: 8px;
                    }
                    .ui-2-text { font-size: 10px; }
                    .ui-2-icon { width: 14px; height: 14px; }

                    .floating-ui-3 {
                        bottom: 16px;
                        left: 16px;
                        font-size: 10px;
                        padding: 6px 14px;
                        gap: 6px;
                    }
                    .floating-ui-3 svg { width: 12px; height: 12px; }
                }
                /* Pricing Section */
                .pricing-section {
                    padding: 100px 64px;
                    background: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    overflow: visible;
                }
                
                .pricing-header {
                    text-align: center;
                    margin-bottom: 60px;
                    z-index: 10;
                }
                
                .pricing-header h2 {
                    font-size: 42px;
                    font-weight: 800;
                    letter-spacing: -0.04em;
                    color: #0f172a;
                    margin: 0;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .pricing-header p {
                    color: #64748b;
                    font-size: 20px;
                    margin: 16px 0 0 0;
                    font-weight: 500;
                }

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

                .pricing-showcase {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                    position: relative;
                    z-index: 10;
                    width: 100%;
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

                .btn-join-plan {
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

                .btn-join-plan:hover {
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
                
                .payment-methods {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 24px;
                    margin-top: 40px;
                    z-index: 10;
                    color: #64748b;
                    font-weight: 500;
                }
                
                .payment-cards-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .payment-card-box {
                    width: 64px;
                    height: 40px;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .visa-box {
                    background: #fff;
                    border: 1px solid #e5e7eb;
                }
                .visa-box-top {
                    position: absolute; top: 0; left: 0; right: 0; height: 22%; background: #1434CB;
                }
                .visa-box-bottom {
                    position: absolute; bottom: 0; left: 0; right: 0; height: 22%; background: #F5A623;
                }
                .visa-box svg { z-index: 1; height: 12px; margin-top: -1px; }

                .mc-box {
                    background: #111;
                }
                .mc-box svg { height: 28px; }

                .apple-box {
                    background: #fff;
                    border: 1.5px solid #111;
                    box-sizing: border-box;
                }
                .apple-box svg { height: 16px; }

                @media (max-width: 1024px) {
                    .pricing-section {
                        padding: 60px 40px;
                    }
                    .premium-glass-card {
                        grid-template-columns: 1fr;
                        padding: 32px;
                    }
                }

                @media (max-width: 768px) {
                    .pricing-section {
                        padding: 60px 24px;
                    }
                    .pricing-header h2 {
                        font-size: 32px;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .pricing-header p {
                        font-size: 16px;
                    }
                    .premium-glass-card {
                        padding: 24px;
                        gap: 32px;
                        border-radius: 24px;
                    }
                    .plan-price-large {
                        font-size: 56px;
                    }
                    .old-price-promo {
                        font-size: 20px;
                        top: -24px;
                    }
                    .plan-price-large span.currency {
                        font-size: 32px;
                    }
                    .plan-desc-large {
                        font-size: 14px;
                        margin-bottom: 24px;
                    }
                    .btn-join-plan {
                        padding: 16px 32px;
                        font-size: 16px;
                    }
                    .feature-block {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        gap: 12px;
                    }
                    .feature-text h4 {
                        font-size: 15px;
                    }
                    .feature-text p {
                        font-size: 13px;
                    }
                    .payment-methods {
                        flex-direction: column;
                        gap: 16px;
                    }
                    .hero-right {
                        display: block !important;
                        min-height: 400px;
                        width: 100% !important;
                        background-size: cover !important;
                        background-position: center !important;
                    }
                }

                /* Solutions Section */
                .solutions-section {
                    padding: 100px 64px;
                background: #ffffff;
                display: flex;
                flex-direction: column;
                align-items: center;
                max-width: 1440px;
                margin: 0 auto;
                width: 100%;
                }

                .solutions-header {
                    text - align: center;
                margin-bottom: 60px;
                }

                .solutions-header h2 {
                    font - size: 42px;
                font-weight: 800;
                letter-spacing: -0.04em;
                color: #0f172a;
                margin: 0 0 16px 0;
                }

                .solutions-header p {
                    color: #64748b;
                font-size: 20px;
                font-weight: 500;
                max-width: 600px;
                margin: 0 auto;
                }

                .solutions-grid {
                    display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 32px;
                width: 100%;
                }

                .solution-card {
                    background: #f8fafc;
                border: 1px solid #f1f5f9;
                border-radius: 24px;
                padding: 40px 32px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                }

                .solution-card:hover {
                    background: #ffffff;
                transform: translateY(-8px);
                box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
                border-color: #e2e8f0;
                }

                .solution-icon-wrapper {
                    width: 56px;
                height: 56px;
                border-radius: 16px;
                background: #eff6ff;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 24px;
                color: #3b82f6;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .solution-card:hover .solution-icon-wrapper {
                    background: #3b82f6;
                color: #ffffff;
                transform: scale(1.1) rotate(5deg);
                }

                .solution-card h3 {
                    font - size: 22px;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 12px;
                line-height: 1.3;
                }

                .solution-card p {
                    font - size: 15px;
                color: #64748b;
                line-height: 1.6;
                margin: 0;
                }

                @media (max-width: 1024px) {
                    .solutions - grid {grid - template - columns: repeat(2, 1fr); }
                }

                @media (max-width: 768px) {
                    .solutions - section {padding: 60px 24px; }
                .solutions-header h2 {font - size: 32px; }
                .solutions-header p {font - size: 16px; }
                .solutions-grid {grid - template - columns: 1fr; }
                .solution-card {padding: 32px 24px; }
                }
            `}</style>

            <header className="landing-header">
                <div className="landing-logo" onClick={() => navigate('/')}>
                    <img src="/hoteltec.png" alt="Hoteltec Logo" />
                </div>

                <nav className="nav-links">
                    <span className="nav-link" onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}>Solutions</span>
                    <span className="nav-link" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Pricing</span>
                </nav>

                <div className="header-actions">
                    <button className="btn-signin" onClick={() => navigate('/login')}>Sign in</button>
                </div>
            </header>

            <section className="hero-section">
                <div className="hero-left">
                    <div className="trust-badge">
                        <Star size={16} fill="#000" /> 4.9 on Hoteltec.app
                    </div>

                    <h1 className="hero-title">
                        Digital Room Service<br />That Finds Revenue
                    </h1>

                    <p className="hero-subtitle">
                        The first hospitality tool that pulls live orders directly to your dashboard—giving you accurate, reliable service to get more 5-star reviews.
                    </p>

                    <div className="hero-actions">
                        <button className="btn-primary-dark" onClick={() => navigate('/signup')}>
                            Try App For Free
                        </button>
                        <button className="btn-secondary-light" onClick={() => navigate('/signup')}>
                            Book A Demo
                        </button>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="floating-ui-1">
                        <div className="ui-1-header">
                            <span style={{ color: '#000', fontWeight: 'bold' }}>In-Room Upsells</span>
                            <span>↑ 32.4%</span>
                        </div>
                        <div className="ui-1-stats">
                            <div className="stat-col">
                                <div className="stat-title">Conversion</div>
                                <div className="stat-bar-1">82.45%</div>
                            </div>
                            <div className="stat-col">
                                <div className="stat-title">Added to cart</div>
                                <div className="stat-bar-2">23.4%</div>
                                <div className="stat-bar-3">76.6%</div>
                            </div>
                        </div>
                    </div>

                    <div className="floating-ui-2">
                        <Heart size={20} fill="#3b82f6" className="ui-2-icon" />
                        <span className="ui-2-text">Love it! Going to try it out</span>
                    </div>

                    <div className="floating-ui-3">
                        <Wand2 size={16} /> Unlock New Revenue with QR
                    </div>
                </div>
            </section>

            <section className="partners-section">
                <div className="partner-logo">
                    <span style={{ fontFamily: 'serif' }}>MARRIOTT</span>
                </div>
                <div className="partner-logo">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '16px', background: '#000', transform: 'rotate(45deg)' }}></div>
                        HILTON
                    </span>
                </div>
                <div className="partner-logo">
                    <span style={{ fontWeight: '300' }}>Kintura</span>
                </div>
                <div className="partner-logo">
                    <span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>LeafSpring</span>
                </div>
                <div className="partner-logo">
                    <span style={{ textTransform: 'uppercase' }}>Trilogy</span>
                </div>
            </section>

            <section className="solutions-section" id="solutions">
                <div className="solutions-header">
                    <h2>How Hoteltec Works</h2>
                    <p>Designed for speed and simplicity. Transform your property into a seamless digital experience in minutes.</p>
                </div>

                <div className="solutions-grid">
                    <div className="solution-card">
                        <div className="solution-icon-wrapper"><Building2 size={24} /></div>
                        <h3>1. Create Your Account</h3>
                        <p>Sign up in seconds and add your property. Operating a chain? Manage multiple hotels effortlessly under one master dashboard.</p>
                    </div>
                    <div className="solution-card">
                        <div className="solution-icon-wrapper"><LayoutDashboard size={24} /></div>
                        <h3>2. Add Digital Services</h3>
                        <p>Build a stunning digital menu. Add room service items, spa bookings, late checkouts, and premium upsells with custom images.</p>
                    </div>
                    <div className="solution-card">
                        <div className="solution-icon-wrapper"><Wand2 size={24} /></div>
                        <h3>3. Generate QR Codes</h3>
                        <p>Instantly generate unique room-specific QR codes. Print and place them in rooms, lobbies, or cabanas for frictionless access.</p>
                    </div>
                    <div className="solution-card">
                        <div className="solution-icon-wrapper"><Smartphone size={24} /></div>
                        <h3>4. Guests Scan & Order</h3>
                        <p>No app downloads required. Guests scan your QR code to instantly view your custom-branded digital store on their own smartphones.</p>
                    </div>
                    <div className="solution-card">
                        <div className="solution-icon-wrapper"><Activity size={24} /></div>
                        <h3>5. Receive Live Orders</h3>
                        <p>Watch orders stream onto your dashboard with real-time audio alerts. Never miss an opportunity to fulfill a guest's request rapidly.</p>
                    </div>
                    <div className="solution-card">
                        <div className="solution-icon-wrapper"><HeartHandshake size={24} /></div>
                        <h3>6. Manage Staff & Delight</h3>
                        <p>Assign tasks to specific staff members and track fulfillment times. Improve your operations and watch your 5-star reviews multiply.</p>
                    </div>
                </div>
            </section>

            <section className="pricing-section" id="pricing">
                <div className="liquid-blob-1"></div>
                <div className="liquid-blob-2"></div>

                <div className="pricing-header">
                    <h2><Crown size={40} color="#3b82f6" /> Transform Your Hotel's Revenue</h2>
                    <p>Stop leaving money on the table. Digitizing your room service can boost order volume by 32% in the first month. Scale your operations today.</p>
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

                            <button className="btn-join-plan" onClick={() => navigate('/signup')}>
                                Get Started Now
                                <ArrowRight size={20} />
                            </button>

                            <p style={{ marginTop: '20px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                                <ShieldCheck size={16} /> Cancel anytime. Full setup included.
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

                <div className="payment-methods">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}><CreditCard size={20} /> Secure Payments</span>

                    <div className="payment-cards-container">
                        <img src="/payment_methods.png" alt="Accepted Payment Methods" style={{ height: '36px', objectFit: 'contain' }} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
