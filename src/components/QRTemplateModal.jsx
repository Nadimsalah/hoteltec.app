import React, { useState, useEffect } from 'react';

const QRTemplateModal = ({ store, onClose }) => {
    const [activeTemplate, setActiveTemplate] = useState(0);
    const [customText, setCustomText] = useState('');

    // Default messages for each template
    const defaultTemplates = [
        { name: 'Modern Banana', bg: '#fef08a', text: '#166534', accent: '#facc15', msg: 'Scan to Order In-Room Dining' },
        { name: 'Luxury Gold', bg: '#1c1917', text: '#e7e5e4', accent: '#d97706', msg: 'Experience Premium Service' },
        { name: 'Minimalist Dark', bg: '#0f172a', text: '#f8fafc', accent: '#3b82f6', msg: 'Digital Concierge & Orders' },
        { name: 'Tropical Resort', bg: '#f0fdf4', text: '#166534', accent: '#22c55e', msg: 'Refreshing Drinks & Food' },
        { name: 'Neon Night', bg: '#2e1065', text: '#f5f3ff', accent: '#d946ef', msg: 'Late Night Cravings?' }
    ];

    useEffect(() => {
        setCustomText(defaultTemplates[activeTemplate].msg);
    }, [activeTemplate]);

    const slug = store.slug || (store.name ? store.name.toLowerCase().replace(/\s+/g, '-') : 'store');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const url = isLocalhost ? `http://${window.location.host}/store/${slug}` : `https://${slug}.hoteltec.app`;
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000&margin=20`;

    const current = defaultTemplates[activeTemplate];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="modal-card" onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '32px', width: '100%', maxWidth: '1000px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>QR Stand Designer</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>Customize and print your physical QR stand</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 380px', gap: '32px', padding: '32px', overflowY: 'auto' }} className="qr-template-body">
                    {/* Preview Area */}
                    <div style={{ background: '#f1f5f9', borderRadius: '24px', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <div id="printable-qr-stand" style={{
                            width: '320px',
                            height: '480px',
                            background: current.bg,
                            borderRadius: '30px',
                            padding: '40px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            color: current.text,
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                            <div className="stand-header">
                                <div style={{ background: current.text, width: '40px', height: '4px', borderRadius: '2px', margin: '0 auto 20px', opacity: 0.2 }}></div>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', margin: 0 }}>{store.name}</h3>
                                <div style={{ height: '1px', width: '60px', background: current.accent, margin: '8px auto' }}></div>
                            </div>

                            <div className="stand-qr-wrap" style={{
                                background: '#fff',
                                padding: '15px',
                                borderRadius: '25px',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                                border: `4px solid ${current.accent}`
                            }}>
                                <img src={qrSrc} alt="QR Code" style={{ width: '180px', height: '180px', borderRadius: '15px', display: 'block' }} />
                            </div>

                            <div className="stand-footer">
                                <p style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.4', marginBottom: '12px', marginTop: 0, whiteSpace: 'pre-wrap' }}>{customText}</p>
                                <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Scan with Camera to begin</div>
                                <div style={{ marginTop: '24px', fontSize: '10px', fontWeight: '800', opacity: 0.4 }}>POWERED BY HOTELTEC</div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Area */}
                    <div className="template-controls" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Style Selector */}
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '12px', marginTop: 0, fontSize: '16px' }}>1. Select Theme</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {defaultTemplates.map((t, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTemplate(i)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            border: activeTemplate === i ? `2px solid #3b82f6` : '1px solid #e2e8f0',
                                            background: activeTemplate === i ? '#eff6ff' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: t.bg, border: '1px solid #e2e8f0', flexShrink: 0 }}></div>
                                        <span style={{ fontWeight: '600', fontSize: '12px', color: activeTemplate === i ? '#1e40af' : '#64748b' }}>{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Customizer */}
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '12px', marginTop: 0, fontSize: '16px' }}>2. Customize Text</h4>
                            <textarea
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                placeholder="Enter message for guests..."
                                style={{
                                    width: '100%',
                                    height: '100px',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'none',
                                    outline: 'none',
                                    focus: { border: '1px solid #3b82f6' }
                                }}
                            />
                            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Max 80 characters recommended for best fit.</p>
                        </div>

                        {/* Print Button */}
                        <div style={{ marginTop: 'auto' }}>
                            <button
                                onClick={handlePrint}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    background: '#0f172a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                Print / Save as PDF
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>🖨️ A5/A6 Size</p>
                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>📄 High Quality PDF</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @media print {
                    /* Reset everything */
                    body * { display: none !important; }
                    
                    /* Show only the QR stand and its requirements */
                    #printable-qr-stand, #printable-qr-stand * { 
                        display: flex !important; 
                        visibility: visible !important; 
                    }
                    
                    /* PDF / Print Optimization */
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    
                    #printable-qr-stand {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        max-width: none !important;
                        max-height: none !important;
                        margin: 0 !important;
                        padding: 80px !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        background: ${current.bg} !important;
                        justify-content: center !important;
                        align-items: center !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    #printable-qr-stand .stand-qr-wrap {
                        display: block !important;
                        background: white !important;
                        padding: 30px !important;
                        border: 6px solid ${current.accent} !important;
                        border-radius: 35px !important;
                    }

                    #printable-qr-stand img {
                        width: 250px !important;
                        height: 250px !important;
                    }

                    #printable-qr-stand h3 { font-size: 28px !important; }
                    #printable-qr-stand p { font-size: 32px !important; }
                }
                @media (max-width: 900px) {
                    .qr-template-body { grid-template-columns: 1fr !important; }
                    .template-controls { order: -1; }
                    .modal-card { width: 95% !important; height: auto !important; }
                }
            `}</style>
        </div>
    );
};

export default QRTemplateModal;
