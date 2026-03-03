import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
// ─── Storage Helper ──────────────────────────────────────────────────────────
const uploadImage = async (file, bucket = 'store-assets') => {
    if (!file) return null;
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Upload error details:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }
};

import {
    Settings as SettingsIcon,
    Bell,
    Lock,
    Globe,
    Smartphone,
    Shield,
    Palette,
    Users,
    Clock,
    Save,
    ChevronRight,
    Camera,
    X
} from 'lucide-react';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [storeId, setStoreId] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const logoInputRef = useRef(null);
    const [activeSection, setActiveSection] = useState('General');
    const [generalSettings, setGeneralSettings] = useState({
        name: 'The Grand Resort',
        address: '',
        currency: 'USD',
        timezone: 'UTC',
        logo_url: ''
    });
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Batuhan Kara', email: 'batuhan@example.com', role: 'Administrator', avatar: 'BK' },
        { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Staff', avatar: 'JD' }
    ]);
    const [notifications, setNotifications] = useState({
        newOrder: true,
        serviceRequest: true,
        newReview: false
    });
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Staff' });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Fetch Store
            const { data: store } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (store) {
                setStoreId(store.id);
                setGeneralSettings({
                    name: store.name || 'My Hotel',
                    address: store.address || '',
                    currency: store.currency || 'USD',
                    timezone: store.timezone || 'UTC',
                    logo_url: store.logo_url || ''
                });

                // 2. Fetch Team
                const { data: team } = await supabase
                    .from('team_members')
                    .select('*')
                    .eq('store_id', store.id);

                if (team) {
                    setTeamMembers(team.map(m => ({
                        ...m,
                        avatar: m.name ? m.name.split(' ').map(n => n[0]).join('') : 'U'
                    })));
                }
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        if (!storeId) return;
        setLoading(true);
        try {
            let uploadedLogoUrl = generalSettings.logo_url;
            if (logoFile) {
                const result = await uploadImage(logoFile);
                if (result) uploadedLogoUrl = result;
            }

            const { error } = await supabase
                .from('stores')
                .update({
                    name: generalSettings.name,
                    address: generalSettings.address,
                    currency: generalSettings.currency,
                    timezone: generalSettings.timezone,
                    logo_url: uploadedLogoUrl
                })
                .eq('id', storeId);

            if (error) throw error;

            // Sync local state with the final permanent URL
            setGeneralSettings(prev => ({ ...prev, logo_url: uploadedLogoUrl }));
            setLogoFile(null);
            showToast('Settings saved successfully!');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setGeneralSettings(prev => ({ ...prev, logo_url: url }));
            setLogoFile(file);
        }
    };

    const inviteMember = async () => {
        if (!storeId) return;
        try {
            const { data, error } = await supabase
                .from('team_members')
                .insert([{
                    store_id: storeId,
                    email: newMember.email,
                    name: newMember.name,
                    role: newMember.role
                }])
                .select()
                .single();

            if (error) throw error;
            setTeamMembers([...teamMembers, { ...data, avatar: data.name ? data.name.split(' ').map(n => n[0]).join('') : 'U' }]);
            setIsInviteModalOpen(false);
            setNewMember({ name: '', email: '', role: 'Staff' });
            showToast('Team member invited!');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const detectTimezone = () => {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setGeneralSettings(prev => ({ ...prev, timezone: detected }));
    };

    // Generate Currencies using Intl API
    const currencies = Intl.supportedValuesOf('currency').map(code => {
        try {
            const name = new Intl.DisplayNames(['en'], { type: 'currency' }).of(code);
            const symbol = (0).toLocaleString('en', { style: 'currency', currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();
            return { code, name, symbol };
        } catch (e) {
            return { code, name: code, symbol: '' };
        }
    }).sort((a, b) => a.name.localeCompare(b.name));

    // Generate Timezones using Intl API
    const timezones = Intl.supportedValuesOf('timeZone').sort();

    const sections = [
        { id: 'General', icon: <SettingsIcon size={20} />, label: 'General' },
        { id: 'Display', icon: <Palette size={20} />, label: 'Branding & UI' },
        { id: 'Notifications', icon: <Bell size={20} />, label: 'Notifications' },
        { id: 'Security', icon: <Lock size={20} />, label: 'Security' },
        { id: 'Team', icon: <Users size={20} />, label: 'Staff & Team' },
    ];

    return (
        <div className="settings-container">
            <style>{`
                .settings-container {
                    padding: 24px;
                    background: #f8fafc;
                    min-height: 100vh;
                }
                .settings-header {
                    margin-bottom: 32px;
                }
                .settings-header h1 {
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #0f172a;
                    margin: 0;
                }

                .settings-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 32px;
                    background: white;
                    border-radius: 32px;
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04);
                    overflow: hidden;
                    min-height: 700px;
                }

                /* Sidebar */
                .settings-sidebar {
                    background: #f8fafc;
                    padding: 32px 16px;
                    border-right: 1px solid #f1f5f9;
                }
                .section-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 14px;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 4px;
                }
                .section-btn:hover {
                    background: #f1f5f9;
                    color: #1e293b;
                }
                .section-btn.active {
                    background: white;
                    color: #0f172a;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }

                /* Content Area */
                .settings-content {
                    padding: 40px;
                }
                .settings-content h2 {
                    font-size: 20px;
                    font-weight: 800;
                    margin-bottom: 32px;
                    color: #0f172a;
                }

                .form-section {
                    margin-bottom: 40px;
                    max-width: 600px;
                }
                .form-section h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .form-input-group {
                    margin-bottom: 24px;
                }
                .form-input-group label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 8px;
                }
                .form-input-group input, .form-input-group select, .form-input-group textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                    font-size: 15px;
                    outline: none;
                    transition: all 0.2s;
                }
                .form-input-group input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }

                /* Toggle Switch */
                .toggle-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 0;
                    border-bottom: 1px solid #f1f5f9;
                }
                .toggle-info h4 { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 4px 0; }
                .toggle-info p { font-size: 13px; color: #64748b; margin: 0; }
                
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #e2e8f0;
                    transition: .4s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px; width: 18px;
                    left: 3px; bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider { background-color: #10b981; }
                input:checked + .slider:before { transform: translateX(20px); }

                /* Action Footer */
                .settings-footer {
                    margin-top: 40px;
                    padding-top: 32px;
                    border-top: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px;
                }
                .save-btn {
                    background: #0f172a;
                    color: white;
                    padding: 12px 32px;
                    border-radius: 12px;
                    border: none;
                    font-weight: 700;
                    font-size: 15px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .save-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                
                .cancel-btn {
                    background: white;
                    color: #64748b;
                    padding: 12px 24px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    font-weight: 600;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .settings-container {
                        padding: 16px !important;
                        padding-bottom: 120px !important;
                    }
                    .settings-header {
                        margin-bottom: 24px !important;
                    }
                    .settings-header h1 { font-size: 24px !important; }
                    
                    .settings-layout {
                        display: flex !important;
                        flex-direction: column !important;
                        background: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                        gap: 16px !important;
                    }
                    
                    .settings-sidebar {
                        display: flex !important;
                        overflow-x: auto !important;
                        padding: 12px 16px !important;
                        background: white !important;
                        border-radius: 20px !important;
                        border: 1px solid rgba(0,0,0,0.05) !important;
                        gap: 8px !important;
                        border-right: none !important;
                        scrollbar-width: none; /* Hide scrollbar Firefox */
                    }
                    .settings-sidebar::-webkit-scrollbar { display: none; } /* Hide scrollbar Chrome/Safari */
                    
                    .section-btn {
                        width: auto !important;
                        white-space: nowrap !important;
                        margin-bottom: 0 !important;
                        padding: 10px 16px !important;
                        font-size: 14px !important;
                    }
                    .section-btn.active {
                        background: #0f172a !important;
                        color: white !important;
                    }

                    .settings-content {
                        padding: 24px !important;
                        background: white !important;
                        border-radius: 28px !important;
                        border: 1px solid rgba(0,0,0,0.05) !important;
                    }
                    .settings-content h2 { font-size: 18px !important; margin-bottom: 24px !important; }
                    
                    .form-section { max-width: 100% !important; margin-bottom: 32px !important; }
                    .form-input-group input, .form-input-group select, .form-input-group textarea {
                        font-size: 16px !important; /* Fixes zoom on tap */
                        padding: 14px !important;
                    }

                    .toggle-row { padding: 20px 0 !important; }
                    .toggle-info h4 { font-size: 14px !important; }
                    .toggle-info p { font-size: 12px !important; }

                    .settings-footer {
                        flex-direction: column-reverse !important;
                        gap: 12px !important;
                        margin-top: 24px !important;
                        padding-top: 24px !important;
                    }
                    .save-btn, .cancel-btn {
                        width: 100% !important;
                        justify-content: center !important;
                        padding: 14px !important;
                    }

                    /* Section specific mobile fixes */
                    .section-view > div:first-of-type {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 12px !important;
                        margin-bottom: 24px !important;
                    }
                    .section-view h2 { margin-bottom: 8px !important; }
                }

                /* Toast UI */
                .toast-notification {
                    position: fixed;
                    top: 24px;
                    left: 50%;
                    transform: translateX(-50%) translateY(0);
                    background: #0f172a;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
                    z-index: 9999;
                    animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid rgba(255,255,255,0.1);
                    min-width: 300px;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 15px;
                }
                .toast-notification.error {
                    background: #ef4444;
                }
                .toast-notification.success {
                    background: #10b981;
                }
                @keyframes toastIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>

            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    {toast.type === 'success' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    )}
                    {toast.message}
                </div>
            )}

            <header className="settings-header">
                <div>
                    <h1>Settings</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Control your hotel properties and store configurations</p>
                </div>
            </header>

            <div className="settings-layout">
                <aside className="settings-sidebar">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.icon}
                            {section.label}
                        </button>
                    ))}
                </aside>

                <main className="settings-content">
                    {activeSection === 'General' && (
                        <div className="section-view">
                            <h2>General Store Settings</h2>
                            <div className="form-section">
                                <div className="form-input-group">
                                    <label>Store Display Name</label>
                                    <input
                                        type="text"
                                        value={generalSettings.name}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-input-group">
                                    <label>Hotel Location / Address</label>
                                    <textarea
                                        rows="3"
                                        value={generalSettings.address}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="form-input-group">
                                    <label>Primary Currency</label>
                                    <select
                                        value={generalSettings.currency}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                                    >
                                        {currencies.map(c => (
                                            <option key={c.code} value={c.code}>
                                                {c.name} ({c.symbol || c.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-input-group">
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Timezone
                                        <button
                                            onClick={detectTimezone}
                                            style={{
                                                fontSize: '11px',
                                                color: '#3b82f6',
                                                background: '#eff6ff',
                                                border: '1px solid #dbeafe',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Detect Automatically
                                        </button>
                                    </label>
                                    <select
                                        value={generalSettings.timezone}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                                    >
                                        {timezones.map(tz => (
                                            <option key={tz} value={tz}>
                                                {tz.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Display' && (
                        <div className="section-view">
                            <h2>Branding & UI Control</h2>
                            <div className="form-section">
                                <div className="form-input-group">
                                    <label>Primary Theme Color</label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input type="color" defaultValue="#0f172a" style={{ width: '60px', padding: '4px', height: '44px' }} />
                                        <input type="text" defaultValue="#0F172A" style={{ flex: 1 }} />
                                    </div>
                                </div>
                                <div className="form-input-group">
                                    <label>Store Logo</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {generalSettings.logo_url ? (
                                                <img src={generalSettings.logo_url} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <Camera size={24} color="#94a3b8" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={logoInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleLogoChange}
                                        />
                                        <button
                                            className="cancel-btn"
                                            style={{ fontSize: '13px' }}
                                            onClick={() => logoInputRef.current.click()}
                                        >
                                            Change Logo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Notifications' && (
                        <div className="section-view">
                            <h2>Notification Preferences</h2>
                            <div className="form-section">
                                <div className="toggle-row">
                                    <div className="toggle-info">
                                        <h4>New Orders</h4>
                                        <p>Get notified immediately when a guest places an order.</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={notifications.newOrder} onChange={() => setNotifications({ ...notifications, newOrder: !notifications.newOrder })} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="toggle-row">
                                    <div className="toggle-info">
                                        <h4>Service Requests</h4>
                                        <p>Notifications for laundry, towels, or other service calls.</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={notifications.serviceRequest} onChange={() => setNotifications({ ...notifications, serviceRequest: !notifications.serviceRequest })} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="toggle-row">
                                    <div className="toggle-info">
                                        <h4>Performance Reports</h4>
                                        <p>Receive weekly analytics summary via email.</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={notifications.newReview} onChange={() => setNotifications({ ...notifications, newReview: !notifications.newReview })} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Security' && (
                        <div className="section-view">
                            <h2>Security & Protection</h2>
                            <div className="form-section">
                                <h3><Lock size={18} /> Change Password</h3>
                                <div className="form-input-group">
                                    <label>Current Password</label>
                                    <input type="password" placeholder="••••••••" />
                                </div>
                                <div className="form-input-group">
                                    <label>New Password</label>
                                    <input type="password" placeholder="••••••••" />
                                </div>
                                <div className="form-input-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" placeholder="••••••••" />
                                </div>
                            </div>


                            <div className="form-section">
                                <h3><Smartphone size={18} /> Active Sessions</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                                        { device: 'Windows PC • Chrome', location: 'London, UK', current: true },
                                        { device: 'iPhone 15 Pro • Safari', location: 'Paris, France', current: false }
                                    ].map((session, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>
                                                    {session.device} {session.current && <span style={{ color: '#10b981', fontSize: '12px', marginLeft: '8px' }}>• Active Now</span>}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>{session.location}</div>
                                            </div>
                                            {!session.current && <button className="cancel-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>Logout</button>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'Team' && (
                        <div className="section-view">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h2 style={{ margin: 0 }}>Staff & Team Management</h2>
                                <button className="save-btn" onClick={() => setIsInviteModalOpen(true)} style={{ padding: '10px 20px', fontSize: '14px' }}>
                                    <Users size={18} />
                                    Invite Member
                                </button>
                            </div>

                            <div className="form-section">
                                <h3><Shield size={18} /> Active Team Members</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {teamMembers.map((member, i) => (
                                        <div
                                            key={i}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #f1f5f9', cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setIsDetailModalOpen(true);
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' }}>
                                                    {member.avatar}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{member.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{member.email}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    background: member.role === 'Administrator' ? '#eff6ff' : '#f1f5f9',
                                                    color: member.role === 'Administrator' ? '#3b82f6' : '#64748b'
                                                }}>
                                                    {member.role}
                                                </span>
                                                <ChevronRight size={14} color="#94a3b8" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <h3><Clock size={18} /> Pending Invitations</h3>
                                <div style={{ padding: '24px', borderRadius: '14px', background: '#fffbeb', border: '1px solid #fef3c7', textAlign: 'center' }}>
                                    <p style={{ fontSize: '13px', color: '#b45309', margin: 0, fontWeight: '600' }}>
                                        No pending invitations. New team members will appear here once invited.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer for all sections */}
                    <div className="settings-footer">
                        <button className="cancel-btn" onClick={fetchSettings}>Discard Changes</button>
                        <button className="save-btn" onClick={handleSaveSettings}>
                            <Save size={18} />
                            Save Settings
                        </button>
                    </div>
                </main>
            </div>
            {isInviteModalOpen && (
                <div className="modal-overlay" onClick={() => setIsInviteModalOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Invite Team Member</h2>
                            <button onClick={() => setIsInviteModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                        </div>

                        <div className="form-input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Robert Fox"
                                value={newMember.name}
                                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                            />
                        </div>

                        <div className="form-input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="robert@hotel.com"
                                value={newMember.email}
                                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                            />
                        </div>

                        <div className="form-input-group">
                            <label>Role</label>
                            <select
                                value={newMember.role}
                                onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                            >
                                <option value="Administrator">Administrator</option>
                                <option value="Staff">Staff</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>

                        <button
                            className="save-btn"
                            style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
                            onClick={() => {
                                if (newMember.name && newMember.email) {
                                    const initials = newMember.name.split(' ').map(n => n[0]).join('').toUpperCase();
                                    setTeamMembers([...teamMembers, { ...newMember, avatar: initials }]);
                                    setIsInviteModalOpen(false);
                                    setNewMember({ name: '', email: '', role: 'Staff' });
                                }
                            }}
                        >
                            Send Invitation
                        </button>
                    </div>
                </div>
            )}

            {/* Member Detail Modal */}
            {isDetailModalOpen && selectedMember && (
                <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ background: '#0f172a', padding: '40px 32px', textAlign: 'center', position: 'relative' }}>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={18} />
                            </button>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'white', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '28px', margin: '0 auto 16px' }}>
                                {selectedMember.avatar}
                            </div>
                            <h2 style={{ color: 'white', margin: '0 0 4px 0', fontSize: '22px' }}>{selectedMember.name}</h2>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '600' }}>{selectedMember.role}</span>
                        </div>

                        <div style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>Email</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{selectedMember.email}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>Phone</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{selectedMember.phone || 'Not provided'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>Joined Date</div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{selectedMember.joinDate || 'Jan 1, 2024'}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '32px' }}>
                                <button className="cancel-btn" style={{ fontSize: '14px' }}>Suspend</button>
                                <button className="save-btn" style={{ fontSize: '14px', background: '#ef4444', justifyContent: 'center' }}>Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
