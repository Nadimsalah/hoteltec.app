import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { UserPlus, Shield, CheckCircle2, MoreVertical, X, Settings2, ShieldCheck, KeyRound } from 'lucide-react';

const StaffManagement = ({ storeId }) => {
    const [staffList, setStaffList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Form State
    const [editingStaffId, setEditingStaffId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        pin: '',
        pages: ['Orders'],
        categories: []
    });

    const [newCategoryName, setNewCategoryName] = useState('');
    const AVAILABLE_PAGES = ['Orders', 'My Store', 'Stories', 'Analytics', 'Billing', 'Settings', 'Team'];

    useEffect(() => {
        const fetchStaff = async () => {
            const { data, error } = await supabase
                .from('staff_profiles')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: true });

            if (data) setStaffList(data);
        };
        fetchStaff();

        // Fetch store categories exactly as they exist in Supabase
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .eq('store_id', storeId)
                .order('index', { ascending: true });

            if (data) setCategories(data);
        };
        fetchCategories();
    }, [storeId]);

    const handleSaveStaff = async () => {
        if (!formData.name || !formData.pin) return;

        let res;
        if (editingStaffId) {
            // Update
            res = await supabase
                .from('staff_profiles')
                .update({
                    name: formData.name,
                    pin: formData.pin,
                    pages: formData.pages,
                    categories: formData.categories
                })
                .eq('id', editingStaffId)
                .select();
        } else {
            // Insert
            res = await supabase
                .from('staff_profiles')
                .insert([{
                    store_id: storeId,
                    name: formData.name,
                    pin: formData.pin,
                    pages: formData.pages,
                    categories: formData.categories
                }])
                .select();
        }

        if (res.data) {
            if (editingStaffId) {
                setStaffList(staffList.map(s => s.id === editingStaffId ? res.data[0] : s));
            } else {
                setStaffList([...staffList, res.data[0]]);
            }
        }

        setShowModal(false);
        setEditingStaffId(null);
        setFormData({ name: '', pin: '', pages: ['Orders'], categories: [] });
    };

    const deleteStaff = async (id) => {
        const { error } = await supabase.from('staff_profiles').delete().eq('id', id);
        if (!error) {
            setStaffList(staffList.filter(s => s.id !== id));
        }
    };

    const openEdit = (staff) => {
        setEditingStaffId(staff.id);
        setFormData(staff);
        setShowModal(true);
    };

    const togglePage = (page) => {
        setFormData(prev => ({
            ...prev,
            pages: prev.pages.includes(page)
                ? prev.pages.filter(p => p !== page)
                : [...prev.pages, page]
        }));
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        const { data, error } = await supabase
            .from('categories')
            .insert([{ store_id: storeId, name: newCategoryName.trim(), index: categories.length }])
            .select('*')
            .single();

        if (data && !error) {
            setCategories([...categories, data]);
            setNewCategoryName('');
            toggleCategory(data.id);
        }
    };

    const toggleCategory = (catId) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(catId)
                ? prev.categories.filter(c => c !== catId)
                : [...prev.categories, catId]
        }));
    };

    return (
        <div className="staff-management" style={{ animation: 'fadeIn 0.3s ease' }}>
            <style>{`
                .staff-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }
                .staff-header h2 {
                    font-size: 32px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0;
                    letter-spacing: -0.02em;
                }
                .staff-header p {
                    color: #64748b;
                    margin: 8px 0 0 0;
                    font-size: 16px;
                }
                .add-staff-btn {
                    background: #0f172a;
                    color: white;
                    padding: 14px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.2s, background 0.2s;
                }
                .add-staff-btn:hover {
                    transform: translateY(-2px);
                    background: #1e293b;
                }

                .staff-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 24px;
                }
                .staff-card {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    position: relative;
                }
                .staff-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: 700;
                    color: #3b82f6;
                    margin-bottom: 16px;
                }
                .staff-name {
                    font-size: 18px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 4px;
                }
                .staff-role {
                    font-size: 14px;
                    color: #64748b;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-bottom: 20px;
                }
                .staff-permissions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .perm-badge {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 6px 12px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #475569;
                }

                /* Modal UI */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                    position: relative;
                }
                .modal-header {
                    padding: 24px 32px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 10;
                }
                .modal-header h3 { font-size: 20px; font-weight: 800; margin: 0; }
                .modal-body { padding: 32px; }
                
                .form-group { margin-bottom: 24px; }
                .form-group label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 8px;
                }
                .form-input {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 15px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .form-input:focus { border-color: #3b82f6; }

                .permission-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .checkbox-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    user-select: none;
                }
                .checkbox-card.active {
                    background: #f0fdf4;
                    border-color: #10b981;
                }
                .checkbox-indicator {
                    width: 20px;
                    height: 20px;
                    border-radius: 6px;
                    border: 2px solid #cbd5e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .checkbox-card.active .checkbox-indicator {
                    background: #10b981;
                    border-color: #10b981;
                }

                .modal-actions {
                    padding: 24px 32px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    position: sticky;
                    bottom: 0;
                    background: white;
                }
                .btn-cancel {
                    padding: 12px 24px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-save {
                    padding: 12px 32px;
                    border-radius: 12px;
                    border: none;
                    background: #3b82f6;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
                
                @media (max-width: 768px) {
                    .staff-header { flex-direction: column; align-items: stretch; gap: 16px; margin-bottom: 24px; }
                    .staff-header h2 { font-size: 24px; }
                    .staff-header > div:last-child { flex-direction: column; width: 100%; }
                    .add-staff-btn { width: 100%; justify-content: center; }
                    
                    .staff-grid { grid-template-columns: 1fr; gap: 16px; }
                    
                    .modal-content { 
                        position: fixed; 
                        bottom: 0; 
                        left: 0; 
                        right: 0; 
                        border-radius: 24px 24px 0 0; 
                        max-height: 90vh; 
                        padding-bottom: env(safe-area-inset-bottom);
                    }
                    .permission-grid { grid-template-columns: 1fr; }
                    .modal-body { padding: 24px; }
                    .modal-header { padding: 20px 24px; }
                    .modal-actions { padding: 16px 24px calc(16px + env(safe-area-inset-bottom)) 24px; }
                }
            `}</style>

            <div className="staff-header">
                <div>
                    <h2>Staff & Team Management</h2>
                    <p>Create profiles for your team to limit their dashboard access strictly to what they need.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="add-staff-btn"
                        style={{ background: 'white', color: '#0f172a', border: '1px solid #e2e8f0' }}
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/staff/${storeId}`);
                            setCopySuccess(true);
                            setTimeout(() => setCopySuccess(false), 2000);
                        }}
                    >
                        {copySuccess ? (
                            <><CheckCircle2 size={20} color="#10b981" /> Copied!</>
                        ) : (
                            <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Login URL</>
                        )}
                    </button>
                    <button className="add-staff-btn" onClick={() => {
                        setFormData({ name: '', pin: '', pages: ['Orders'], categories: [] });
                        setEditingStaffId(null);
                        setShowModal(true);
                    }}>
                        <UserPlus size={20} /> Add Staff Member
                    </button>
                </div>
            </div>

            <div className="staff-grid">
                {/* Always show Administrator / Owner */}
                <div className="staff-card" style={{ border: '2px solid #3b82f6' }}>
                    <div className="staff-avatar" style={{ background: '#eff6ff' }}>👑</div>
                    <div className="staff-name">Store Admin (You)</div>
                    <div className="staff-role" style={{ color: '#3b82f6' }}>
                        <ShieldCheck size={16} /> Full System Access
                    </div>
                </div>

                {staffList.map(staff => (
                    <div className="staff-card" key={staff.id}>
                        <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 8 }}>
                            <button onClick={() => openEdit(staff)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><Settings2 size={18} /></button>
                            <button onClick={() => deleteStaff(staff.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={18} /></button>
                        </div>
                        <div className="staff-avatar">{staff.name.charAt(0).toUpperCase()}</div>
                        <div className="staff-name">{staff.name}</div>
                        <div className="staff-role">
                            <KeyRound size={16} /> PIN code: ••••
                        </div>

                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', marginTop: '20px' }}>PERMISSIONS</div>
                        <div className="staff-permissions">
                            {staff.pages.map(p => <span key={p} className="perm-badge">{p}</span>)}
                            {staff.categories.length > 0 && <span className="perm-badge" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#ef4444' }}>{staff.categories.length} Categories Only</span>}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingStaffId ? 'Edit Staff Profile' : 'New Staff Profile'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                <X size={24} color="#64748b" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Account Username</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. john_staff"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>PIN Login</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="e.g. 1234"
                                    maxLength={4}
                                    value={formData.pin}
                                    onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '32px' }}>
                                <label style={{ fontSize: '18px', color: '#0f172a' }}>Category Reception (Orders)</label>
                                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Select which category orders this staff member is responsible for. If none are selected, they will receive ALL orders.</p>

                                {categories.length === 0 ? (
                                    <div style={{ padding: '16px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                                        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 12px 0' }}>No categories exist for your store yet.</p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={e => setNewCategoryName(e.target.value)}
                                                placeholder="e.g. Room Service, Spa, Bar"
                                                className="form-input"
                                                style={{ padding: '8px 12px' }}
                                            />
                                            <button
                                                onClick={handleCreateCategory}
                                                style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', padding: '0 16px', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="permission-grid">
                                            {categories.map(cat => (
                                                <div
                                                    key={cat.id}
                                                    className={`checkbox-card ${formData.categories.includes(cat.id) ? 'active' : ''}`}
                                                    onClick={() => toggleCategory(cat.id)}
                                                >
                                                    <div className="checkbox-indicator">
                                                        {formData.categories.includes(cat.id) && <CheckCircle2 size={14} color="white" />}
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{cat.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={e => setNewCategoryName(e.target.value)}
                                                placeholder="New category..."
                                                className="form-input"
                                                style={{ padding: '8px 12px', flex: 1 }}
                                            />
                                            <button
                                                onClick={handleCreateCategory}
                                                style={{ background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '12px', padding: '0 16px', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="form-group" style={{ marginTop: '32px' }}>
                                <label style={{ fontSize: '18px', color: '#0f172a' }}>Visible Dashboard Tabs</label>
                                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Select which pages this staff member can see in the sidebar.</p>
                                <div className="permission-grid">
                                    {AVAILABLE_PAGES.map(page => (
                                        <div
                                            key={page}
                                            className={`checkbox-card ${formData.pages.includes(page) ? 'active' : ''}`}
                                            onClick={() => togglePage(page)}
                                        >
                                            <div className="checkbox-indicator">
                                                {formData.pages.includes(page) && <CheckCircle2 size={14} color="white" />}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{page}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-save" disabled={!formData.name || formData.pin.length < 4} onClick={handleSaveStaff}>
                                Save Staff Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;
