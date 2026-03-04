import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import {
    X,
    Printer,
    Palette,
    Layout as LayoutIcon,
    Wifi,
    Coffee,
    Bed,
    Waves,
    Utensils,
    Wind,
    Bell,
    CheckCircle2,
    Sparkles,
    MousePointer2,
    Image as ImageIcon
} from 'lucide-react';

const QRTemplateModal = ({ store, onClose }) => {
    const [activeTemplate, setActiveTemplate] = useState(0);
    const [customText, setCustomText] = useState('');
    const [activeTab, setActiveTab] = useState('styles');
    const [selectedIcons, setSelectedIcons] = useState(['Wifi', 'Coffee', 'Bed', 'Bell']);
    const [scale, setScale] = useState(0.85);
    const [customAccent, setCustomAccent] = useState('#3b82f6');
    const [textSize, setTextSize] = useState(24);
    const [customBg, setCustomBg] = useState('#ffffff');
    const [customTextColor, setCustomTextColor] = useState('#0f172a');
    const [logoSize, setLogoSize] = useState(32);
    const [qrSize, setQrSize] = useState(180);
    const [qrColor, setQrColor] = useState('#000000');
    const [roundness, setRoundness] = useState(32);

    const templates = [
        {
            id: 'concierge',
            name: '01. The Executive Concierge',
            philosophy: 'High-end information rich layout.',
            bg: '#ffffff',
            text: '#0f172a',
            accent: '#3b82f6',
            msg: 'Digital Guest Services',
            isDark: false,
            layout: 'concierge'
        },
        {
            id: 'royal',
            name: '02. Royal Palace Heritage',
            philosophy: 'Champagne & Gold, serif elegance.',
            bg: '#fdfcf0',
            text: '#44403c',
            accent: '#b4832c',
            msg: 'Experience Luxury Heritage',
            isDark: false,
            layout: 'luxury',
            font: "'Playfair Display', serif"
        },
        {
            id: 'nordic',
            name: '03. Nordic Terrace',
            philosophy: 'Minimalist wood & slate tones.',
            bg: '#f1f5f9',
            text: '#334155',
            accent: '#64748b',
            msg: 'Clean Minimal Living',
            isDark: false,
            layout: 'concierge'
        },
        {
            id: 'botanical',
            name: '04. Botanical Oasis',
            philosophy: 'Refined natural soft greens.',
            bg: '#f0fdf4',
            text: '#166534',
            accent: '#22c55e',
            msg: 'Stay In Nature',
            isDark: false,
            layout: 'abstract'
        },
        {
            id: 'sunset',
            name: '05. Sunset Terrace',
            philosophy: 'Warm orange & pink aesthetics.',
            bg: '#fff7ed',
            text: '#9a3412',
            accent: '#f97316',
            msg: 'Enjoy the Sunset View',
            isDark: false,
            layout: 'abstract'
        },
        {
            id: 'bistro',
            name: '06. Urban Loft Bistro',
            philosophy: 'Industrial minimalist dining.',
            bg: '#fafafa',
            text: '#171717',
            accent: '#000000',
            msg: 'Scan to Order',
            isDark: false,
            layout: 'luxury'
        },
        {
            id: 'zen',
            name: '07. Zen Serenity Spa',
            philosophy: 'Stone & teal, relaxation focus.',
            bg: '#f0fdfa',
            text: '#0f766e',
            accent: '#14b8a6',
            msg: 'Find Your Inner Zen',
            isDark: false,
            layout: 'concierge'
        }
    ];

    const iconLibrary = [
        { id: 'Wifi', icon: Wifi },
        { id: 'Coffee', icon: Coffee },
        { id: 'Bed', icon: Bed },
        { id: 'Waves', icon: Waves },
        { id: 'Utensils', icon: Utensils },
        { id: 'Wind', icon: Wind },
        { id: 'Bell', icon: Bell },
        { id: 'CheckCircle2', icon: CheckCircle2 }
    ];

    useEffect(() => {
        setCustomText(templates[activeTemplate].msg);
        setCustomAccent(templates[activeTemplate].accent);
        setCustomBg(templates[activeTemplate].bg);
        setCustomTextColor(templates[activeTemplate].text);

        // Mobile-friendly initial scale
        if (window.innerWidth < 768) {
            setScale(0.5);
        } else {
            setScale(0.85);
        }
    }, [activeTemplate]);

    const slug = store.slug || (store.name ? store.name.toLowerCase().replace(/\s+/g, '-') : 'store');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isLocalhost ? `http://${window.location.host}/store/${slug}` : `https://${slug}.hoteltec.app`;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=${qrColor.replace('#', '')}&margin=20`;

    const current = templates[activeTemplate];

    const toggleIcon = (id) => {
        if (selectedIcons.includes(id)) {
            setSelectedIcons(selectedIcons.filter(icon => icon !== id));
        } else if (selectedIcons.length < 4) {
            setSelectedIcons([...selectedIcons, id]);
        }
    };

    const handleExportPNG = async () => {
        const element = document.getElementById('v3-printable-stand');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: customBg,
                scale: 3,
                useCORS: true,
                logging: false
            });

            const link = document.createElement('a');
            link.download = `${store.name.replace(/\s+/g, '_')}_QR_Stand.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    return (
        <div className="v3-builder-overlay" style={{
            zIndex: 10000,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header V3.0 - Modern Light */}
            <header style={{
                height: '72px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                background: '#ffffff',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div className="v3-badge" style={{
                        background: '#0f172a',
                        color: 'white',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: '900',
                        letterSpacing: '0.5px',
                        flexShrink: 0
                    }}>
                        V3.0
                    </div>
                    {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name} style={{ height: '28px', maxWidth: '140px', objectFit: 'contain' }} />
                    ) : (
                        <h1 style={{ color: '#0f172a', fontSize: '16px', fontWeight: '900', margin: 0 }}>{store.name}</h1>
                    )}
                </div>

                <button onClick={onClose} style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    padding: '8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <X size={18} />
                </button>
            </header>

            <main className="builder-container" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Responsive Canvas UI */}
                <div className="builder-canvas" style={{
                    flex: 1,
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                    position: 'relative',
                    padding: '40px'
                }}>
                    {/* Zoom Interface */}
                    <div style={{ position: 'absolute', bottom: '24px', display: 'flex', gap: '8px', zIndex: 10, background: 'white', padding: '8px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        <button onClick={() => setScale(s => Math.min(s + 0.1, 1.2))} style={canvasBtnStyle}>+</button>
                        <button onClick={() => setScale(0.85)} style={canvasBtnStyle}><MousePointer2 size={14} /></button>
                        <button onClick={() => setScale(s => Math.max(s - 0.1, 0.4))} style={canvasBtnStyle}>-</button>
                    </div>

                    <div style={{
                        transform: `scale(${scale})`,
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)'
                    }}>
                        {/* THE TEMPLATE PREVIEW */}
                        <div id="v3-printable-stand" style={{
                            width: '360px',
                            height: '560px',
                            background: customBg,
                            borderRadius: `${roundness}px`,
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid rgba(0,0,0,0.05)',
                            transition: 'all 0.5s ease'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1, flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', color: customTextColor }}>

                                {current.layout === 'concierge' && (
                                    <>
                                        <div style={{ textAlign: 'center' }}>
                                            {store.logo_url && <img src={store.logo_url} style={{ height: `${logoSize}px`, marginBottom: '8px' }} />}
                                            <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6 }}>{store.name}</h3>
                                        </div>
                                        <div style={{ padding: '24px', background: 'white', borderRadius: `${roundness}px`, boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                                            <img src={qrSrc} style={{ width: `${qrSize}px`, height: `${qrSize}px`, display: 'block' }} />
                                        </div>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ fontSize: `${textSize}px`, fontWeight: '900', marginBottom: '24px', lineHeight: '1.1' }}>{customText}</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                                {selectedIcons.map(id => {
                                                    const IconComp = iconLibrary.find(i => i.id === id)?.icon;
                                                    return IconComp ? (
                                                        <div key={id} style={{ padding: '10px', background: 'white', borderRadius: '12px', color: customAccent, border: `1px solid ${customAccent}22`, display: 'flex', justifyContent: 'center' }}>
                                                            <IconComp size={18} />
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {current.layout === 'luxury' && (
                                    <>
                                        <div style={{ textAlign: 'center' }}>
                                            {store.logo_url && <img src={store.logo_url} style={{ height: `${logoSize}px`, marginBottom: '8px' }} />}
                                            <div style={{ letterSpacing: '8px', fontSize: '10px', opacity: 0.8, fontWeight: '700', textTransform: 'uppercase' }}>{store.name}</div>
                                        </div>
                                        <h2 style={{ fontFamily: current.font, fontSize: `${textSize + 6}px`, fontStyle: 'italic', color: customAccent, textAlign: 'center', margin: '20px 0' }}>{customText}</h2>
                                        <div style={{ padding: '20px', background: 'white', borderRadius: '4px', border: `3px solid ${customAccent}` }}>
                                            <img src={qrSrc} style={{ width: `${qrSize}px`, height: `${qrSize}px`, display: 'block' }} />
                                        </div>
                                        <div style={{ paddingBottom: '20px', fontSize: '10px', letterSpacing: '4px', color: customAccent, fontWeight: '800' }}>EST. {new Date().getFullYear()}</div>
                                    </>
                                )}

                                {current.layout === 'abstract' && (
                                    <>
                                        <div style={{ alignSelf: 'flex-start', background: customAccent, width: '40px', height: '40px', borderRadius: '50%' }}></div>
                                        <h1 style={{ fontSize: `${textSize + 24}px`, fontWeight: '1000', textAlign: 'left', lineHeight: '0.8', width: '100%' }}>{customText}</h1>
                                        <div style={{ padding: '12px', background: 'white', borderRadius: `0 ${roundness}px ${roundness}px ${roundness}px`, boxShadow: `12px 12px 0 ${customTextColor}` }}>
                                            <img src={qrSrc} style={{ width: `${qrSize - 20}px`, height: `${qrSize - 20}px`, display: 'block' }} />
                                        </div>
                                        <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {store.logo_url && <img src={store.logo_url} style={{ height: `${logoSize * 0.6}px` }} />}
                                            <div style={{ fontSize: '11px', fontWeight: '900', color: customTextColor }}>{store.name}</div>
                                        </div>
                                    </>
                                )}

                                {current.layout === 'monolith' && (
                                    <>
                                        <div style={{ opacity: 0.2 }}>•••</div>
                                        <div style={{ padding: '24px', background: 'white', borderRadius: `${roundness * 1.5}px`, border: '10px solid rgba(255,255,255,0.05)' }}>
                                            <img src={qrSrc} style={{ width: `${qrSize + 40}px`, height: `${qrSize + 40}px`, display: 'block' }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.4 }}>
                                            {store.logo_url && <img src={store.logo_url} style={{ height: `${logoSize * 0.75}px` }} />}
                                            <span style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '3px' }}>{store.name}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Customizer */}
                <aside style={{ width: '380px', background: 'white', borderLeft: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', color: '#0f172a' }}>
                    <div style={{ display: 'flex', padding: '12px', gap: '4px', borderBottom: '1px solid #f8fafc' }}>
                        <TabBtn active={activeTab === 'styles'} onClick={() => setActiveTab('styles')} icon={<LayoutIcon size={14} />} label="Library" />
                        <TabBtn active={activeTab === 'branding'} onClick={() => setActiveTab('branding')} icon={<Palette size={14} />} label="Styling" />
                        <TabBtn active={activeTab === 'icons'} onClick={() => setActiveTab('icons')} icon={<Sparkles size={14} />} label="Icons" />
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                        {activeTab === 'styles' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <SectionLabel>SELECT YOUR EXPERIENCE</SectionLabel>
                                {templates.map((t, i) => (
                                    <button key={t.id} onClick={() => setActiveTemplate(i)}
                                        style={{
                                            padding: '12px 16px',
                                            background: activeTemplate === i ? '#f8fafc' : '#ffffff',
                                            border: activeTemplate === i ? '1px solid #0f172a' : '1px solid #f1f5f9',
                                            borderRadius: '16px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: t.bg, border: '1px solid #e2e8f0' }}></div>
                                        <div>
                                            <div style={{ color: '#0f172a', fontWeight: '800', fontSize: '13px' }}>{t.name}</div>
                                            <div style={{ color: '#64748b', fontSize: '10px' }}>{t.philosophy}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTab === 'branding' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <SectionLabel>CUSTOMIZE MESSAGE</SectionLabel>
                                <textarea value={customText} onChange={(e) => setCustomText(e.target.value)} style={{ ...inputStyle, marginBottom: '8px' }} />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <SectionLabel>TEXT SIZE</SectionLabel>
                                        <input type="range" min="16" max="72" value={textSize} onChange={(e) => setTextSize(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#0f172a' }} />
                                    </div>
                                    <div>
                                        <SectionLabel>LOGO SIZE</SectionLabel>
                                        <input type="range" min="12" max="100" value={logoSize} onChange={(e) => setLogoSize(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#0f172a' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <SectionLabel>QR SIZE</SectionLabel>
                                        <input type="range" min="120" max="280" value={qrSize} onChange={(e) => setQrSize(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#0f172a' }} />
                                    </div>
                                    <div>
                                        <SectionLabel>ROUNDNESS</SectionLabel>
                                        <input type="range" min="0" max="64" value={roundness} onChange={(e) => setRoundness(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#0f172a' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                    <div>
                                        <SectionLabel>BACKGROUND</SectionLabel>
                                        <input type="color" value={customBg} onChange={(e) => setCustomBg(e.target.value)} style={colorInputStyle} />
                                    </div>
                                    <div>
                                        <SectionLabel>TEXT COLOR</SectionLabel>
                                        <input type="color" value={customTextColor} onChange={(e) => setCustomTextColor(e.target.value)} style={colorInputStyle} />
                                    </div>
                                    <div>
                                        <SectionLabel>ACCENT COLOR</SectionLabel>
                                        <input type="color" value={customAccent} onChange={(e) => setCustomAccent(e.target.value)} style={colorInputStyle} />
                                    </div>
                                    <div>
                                        <SectionLabel>QR COLOR</SectionLabel>
                                        <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} style={colorInputStyle} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'icons' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <SectionLabel>SELECT FEATURED AMENITIES</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                    {iconLibrary.map((item) => (
                                        <button key={item.id} onClick={() => toggleIcon(item.id)}
                                            style={{
                                                padding: '16px',
                                                background: selectedIcons.includes(item.id) ? '#0f172a' : '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '16px',
                                                color: selectedIcons.includes(item.id) ? '#fff' : '#64748b',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <item.icon size={20} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                        <button onClick={handleExportPNG} style={{ width: '100%', padding: '18px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                            <ImageIcon size={20} /> Export High-Res PNG
                        </button>
                    </div>
                </aside>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;700;900&display=swap');
                @media (max-width: 900px) {
                    .builder-container { 
                        flex-direction: column !important; 
                        overflow-y: auto !important;
                    }
                    aside { 
                        width: 100% !important; 
                        height: auto !important; 
                        flex-shrink: 0 !important;
                        border-left: none !important;
                        border-top: 1px solid #f1f5f9 !important;
                    }
                    .builder-canvas { 
                        height: 50vh !important; 
                        min-height: 400px !important;
                        flex-shrink: 0 !important;
                        padding: 20px !important;
                    }
                    .canvas-zoom-controls {
                        bottom: 12px !important;
                        transform: scale(0.9);
                    }
                }
                @media print {
                    @page { margin: 0; size: A5 portrait; }
                    body * { visibility: hidden !important; }
                    .v3-builder-overlay, .builder-canvas, #v3-printable-stand, #v3-printable-stand * { 
                        visibility: visible !important; display: flex !important;
                    }
                    header, aside, .infinite-canvas-controls, .canvas-zoom-controls { display: none !important; }
                    .builder-canvas { position: fixed !important; inset: 0 !important; background: white !important; }
                    #v3-printable-stand { width: 440px !important; height: 640px !important; transform: none !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
};

const TabBtn = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} style={{ flex: 1, padding: '12px', background: active ? '#f1f5f9' : 'transparent', border: active ? '1px solid #e2e8f0' : 'none', borderRadius: '12px', color: active ? '#0f172a' : '#64748b', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {icon} {label}
    </button>
);

const SectionLabel = ({ children }) => (
    <div style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase' }}>{children}</div>
);

const canvasBtnStyle = { padding: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', color: '#0f172a', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const inputStyle = { width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', color: '#0f172a', fontSize: '14px', fontFamily: 'inherit', marginBottom: '16px', outline: 'none' };

const colorInputStyle = { height: '36px', width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '2px', background: 'white', cursor: 'pointer' };

export default QRTemplateModal;
