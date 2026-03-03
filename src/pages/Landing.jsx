import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Wand2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

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
                    height: 28px;
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
                    .floating-ui-1 {
                        display: none;
                    }
                }
            `}</style>

            <header className="landing-header">
                <div className="landing-logo" onClick={() => navigate('/')}>
                    <img src="/hoteltec.png" alt="Hoteltec Logo" />
                </div>

                <nav className="nav-links">
                    <span className="nav-link">Product</span>
                    <span className="nav-link">Solutions</span>
                    <span className="nav-link">Resources</span>
                    <span className="nav-link">Pricing</span>
                </nav>

                <div className="header-actions">
                    <button className="btn-signin" onClick={() => navigate('/login')}>Sign in</button>
                </div>
            </header>

            <section className="hero-section">
                <div className="hero-left">
                    <div className="trust-badge">
                        <Star size={16} fill="#000" /> 4.9 on Capterra
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
        </div>
    );
};

export default Landing;
