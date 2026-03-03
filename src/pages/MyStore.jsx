import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import QRTemplateModal from '../components/QRTemplateModal';

// ─── Storage Helper ──────────────────────────────────────────────────────────
const uploadImage = async (file, bucket = 'store-assets') => {
    if (!file) return null;
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `logos/${fileName}`; // Organized folder

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


// ─── Store Preview Modal ─────────────────────────────────────────────────────
const PreviewModal = ({ store, categories, products, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="preview-phone" onClick={e => e.stopPropagation()}>
            <div className="preview-header">
                {store.logo_url
                    ? <img src={store.logo_url} alt="logo" className="preview-logo-img" />
                    : <div className="preview-logo-placeholder">{store.name ? store.name[0] : '?'}</div>}
                <div>
                    <div className="preview-store-name">{store.name}</div>
                    <div className="preview-store-phone">{store.phone}</div>
                </div>
            </div>
            <div className="preview-cats">
                {categories.map(c => (
                    <span key={c.id} className="preview-cat">{c.name}</span>
                ))}
            </div>
            <div className="preview-products">
                {products.length === 0
                    ? <div className="preview-empty">No products yet</div>
                    : products.map(p => (
                        <div key={p.id} className="preview-product-card">
                            {p.image
                                ? <img src={p.image} alt={p.name} className="preview-product-img" />
                                : <div className="preview-product-img-placeholder">🍽</div>}
                            <div className="preview-product-info">
                                <div className="preview-product-name">{p.name}</div>
                                <div className="preview-product-price">${p.price}</div>
                            </div>
                        </div>
                    ))}
            </div>
            <button className="modal-close preview-close-btn" onClick={onClose}>Close Preview</button>
        </div>
    </div>
);

// ─── Category Modal ──────────────────────────────────────────────────────────
const CategoryModal = ({ editing, onSave, onClose }) => {
    const [name, setName] = useState(editing ? editing.name : '');
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editing ? 'Edit Category' : 'New Category'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="modal-body">
                    <label className="form-label">Category Name</label>
                    <input
                        className="form-input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g., Drinks, Snacks, Main Dishes"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && name.trim() && onSave(name.trim())}
                    />
                    <button
                        className="action-btn complete"
                        style={{ marginTop: 16, width: '100%' }}
                        disabled={!name.trim()}
                        onClick={() => name.trim() && onSave(name.trim())}
                    >
                        {editing ? 'Save Changes' : 'Add Category'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Product Modal ───────────────────────────────────────────────────────────
const ProductModal = ({ editing, categories, onSave, onClose }) => {
    const [form, setForm] = useState(
        editing
            ? { name: editing.name, description: editing.description, price: editing.price, categoryId: editing.categoryId, image: editing.image }
            : { name: '', description: '', price: '', categoryId: categories[0]?.id || '', image: null }
    );
    const [preview, setPreview] = useState(editing?.image || null);
    const imgRef = useRef(null);

    const handleImage = e => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setForm(f => ({ ...f, image: url, imageFile: file }));
        }
    };

    const valid = form.name.trim() && form.price && form.categoryId;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card modal-wide" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="modal-body">
                    {/* Image Upload */}
                    <div className="product-img-upload" onClick={() => imgRef.current.click()}>
                        {preview
                            ? <img src={preview} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
                            : <>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M4 16l4-4a3 3 0 014 0l4 4m-4-4l2-2a3 3 0 014 0l2 2M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>Click to upload product image</span>
                            </>
                        }
                        <input type="file" accept="image/*" ref={imgRef} onChange={handleImage} style={{ display: 'none' }} />
                    </div>
                    <div className="form-row">
                        <div className="form-col">
                            <label className="form-label">Product Name *</label>
                            <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Caesar Salad" />
                        </div>
                        <div className="form-col">
                            <label className="form-label">Price (USD) *</label>
                            <input className="form-input" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="12.99" />
                        </div>
                    </div>
                    <label className="form-label">Category *</label>
                    <select className="form-input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <label className="form-label" style={{ marginTop: 12 }}>Description</label>
                    <textarea className="form-input" rows="3" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the product..." style={{ resize: 'none' }} />
                    <button
                        className="action-btn complete"
                        style={{ marginTop: 16, width: '100%' }}
                        disabled={!valid}
                        onClick={() => valid && onSave(form)}
                    >
                        {editing ? 'Save Changes' : 'Add Product'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main MyStore Component ──────────────────────────────────────────────────
const MyStore = ({ onSwitch }) => {
    // ── Wizard state ──────────────────────────────────────────────────────
    const [storeData, setStoreData] = useState(null);
    const [setupStep, setSetupStep] = useState(1);
    const [storeName, setStoreName] = useState('');
    const [storePhone, setStorePhone] = useState('');
    const [storeLogo, setStoreLogo] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const logoInputRef = useRef(null);

    const [loading, setLoading] = useState(true);

    // ── Management state ──────────────────────────────────────────────────
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCatFilter, setActiveCatFilter] = useState('all');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // ── Fetch Initial Data ────────────────────────────────────────────────
    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Get Store
            const { data: store, error: storeError } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (store) {
                setStoreData(store);
                setStoreName(store.name);
                setStorePhone(store.phone);
                setStoreLogo(store.logo_url);

                // 2. Get Categories
                const { data: cats } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('store_id', store.id)
                    .order('index', { ascending: true });

                if (cats) {
                    setCategories(cats);
                    if (cats.length > 0) setActiveCatFilter('all');
                }

                // 3. Get Products
                const { data: prods } = await supabase
                    .from('products')
                    .select('*')
                    .eq('store_id', store.id);

                if (prods) {
                    setProducts(prods.map(p => ({
                        ...p,
                        categoryId: p.category_id,
                        image: p.image_url
                    })));
                }
            }
        } catch (error) {
            console.error('Error fetching store:', error);
        } finally {
            setLoading(false);
        }
    };

    // ── Logo upload ───────────────────────────────────────────────────────
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setStoreLogo(URL.createObjectURL(file));
            setLogoFile(file);
        }
    };

    // ── Wizard submit ─────────────────────────────────────────────────────
    const handleStartSelling = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            let uploadedLogoUrl = storeLogo;
            if (logoFile) {
                const result = await uploadImage(logoFile);
                if (result) uploadedLogoUrl = result;
            }

            const { data: store, error } = await supabase
                .from('stores')
                .insert([{
                    user_id: user.id,
                    name: storeName,
                    phone: storePhone,
                    logo_url: uploadedLogoUrl
                }])
                .select()
                .single();

            if (error) throw error;
            setStoreData(store);
            setStoreLogo(store.logo_url); // Update local state with the permanent URL
            showToast('Store created successfully!');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // ── Category CRUD ─────────────────────────────────────────────────────
    const addCategory = async (name) => {
        try {
            const { data: newCat, error } = await supabase
                .from('categories')
                .insert([{
                    store_id: storeData.id,
                    name,
                    index: categories.length
                }])
                .select()
                .single();

            if (error) throw error;
            setCategories([...categories, newCat]);
            if (categories.length === 0) setActiveCatFilter(newCat.id);
            setShowCategoryModal(false);
            showToast('Category added!');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const saveCategory = async (name) => {
        try {
            const { error } = await supabase
                .from('categories')
                .update({ name })
                .eq('id', editingCategory.id);

            if (error) throw error;
            setCategories(categories.map(cat => cat.id === editingCategory.id ? { ...cat, name } : cat));
            setEditingCategory(null);
            showToast('Category updated!');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const deleteCategory = async (id) => {
        if (!confirm('Are you sure? This will also delete all products in this category.')) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            setCategories(categories.filter(cat => cat.id !== id));
            setProducts(products.filter(prod => prod.categoryId !== id));
            if (activeCatFilter === id) setActiveCatFilter('all');
            showToast('Category deleted', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    // ── Product CRUD ──────────────────────────────────────────────────────
    const addProduct = async (form) => {
        try {
            let uploadedImageUrl = form.image;
            if (form.imageFile) {
                uploadedImageUrl = await uploadImage(form.imageFile);
            }

            const { data: newProd, error } = await supabase
                .from('products')
                .insert([{
                    store_id: storeData.id,
                    category_id: form.categoryId,
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    image_url: uploadedImageUrl
                }])
                .select()
                .single();

            if (error) throw error;
            setProducts([...products, { ...newProd, categoryId: newProd.category_id, image: newProd.image_url }]);
            setShowProductModal(false);
            showToast('Product added!');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const saveProduct = async (form) => {
        try {
            let uploadedImageUrl = form.image;
            if (form.imageFile) {
                uploadedImageUrl = await uploadImage(form.imageFile);
            }

            const { error } = await supabase
                .from('products')
                .update({
                    category_id: form.categoryId,
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    image_url: uploadedImageUrl
                })
                .eq('id', editingProduct.id);

            if (error) throw error;
            setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...form } : p));
            setEditingProduct(null);
            showToast('Product updated!');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            setProducts(products.filter(prod => prod.id !== id));
            showToast('Product removed');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const filteredProducts = activeCatFilter === 'all'
        ? products
        : products.filter(p => p.categoryId === activeCatFilter);

    const currencySymbol = (() => {
        try {
            const code = storeData?.currency || 'USD';
            return (0).toLocaleString('en', { style: 'currency', currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim();
        } catch {
            return '$';
        }
    })();

    const toastUI = (
        <>
            <style>{`
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
                    z-index: 10000;
                    animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid rgba(255,255,255,0.1);
                    min-width: 300px;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 15px;
                }
                .toast-notification.error { background: #ef4444; }
                .toast-notification.success { background: #10b981; }
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
        </>
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
                {toastUI}
                <div className="wizard-icon">🏨</div>
                <div style={{ fontWeight: '600', color: '#64748b' }}>Loading your store...</div>
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // WIZARD VIEW
    // ────────────────────────────────────────────────────────────────────────
    if (!storeData) {
        return (
            <div className="wizard-container">
                {toastUI}
                <div className="wizard-card">
                    <div className="wizard-steps">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`wizard-step-dot ${s === setupStep ? 'active' : s < setupStep ? 'done' : ''}`} />
                        ))}
                    </div>

                    {setupStep === 1 && (
                        <div className="wizard-step-content">
                            <div className="wizard-icon">🏪</div>
                            <h1 className="wizard-title">Name Your Store</h1>
                            <p className="wizard-subtitle">This is how your customers will find you.</p>
                            <input
                                className="form-input wizard-input"
                                placeholder="e.g., The Rooftop Kitchen"
                                value={storeName}
                                onChange={e => setStoreName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && storeName.trim() && setSetupStep(2)}
                            />
                            <button
                                className="wizard-btn"
                                disabled={!storeName.trim()}
                                onClick={() => storeName.trim() && setSetupStep(2)}
                            >
                                Continue →
                            </button>
                        </div>
                    )}

                    {setupStep === 2 && (
                        <div className="wizard-step-content">
                            <div className="wizard-icon">🖼️</div>
                            <h1 className="wizard-title">Upload Your Logo</h1>
                            <p className="wizard-subtitle">Make your store stand out with a great logo.</p>
                            <div className="logo-upload-area" onClick={() => logoInputRef.current.click()}>
                                {storeLogo
                                    ? <img src={storeLogo} alt="logo" className="logo-preview" />
                                    : <>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M4 16l4-4a3 3 0 014 0l4 4m-4-4l2-2a3 3 0 014 0l2 2M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="upload-hint">Click to upload</span>
                                    </>
                                }
                                <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} style={{ display: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                <button className="wizard-btn-outline" onClick={() => setSetupStep(1)}>Back</button>
                                <button className="wizard-btn" onClick={() => setSetupStep(3)}>
                                    {storeLogo ? 'Continue →' : 'Skip →'}
                                </button>
                            </div>
                        </div>
                    )}

                    {setupStep === 3 && (
                        <div className="wizard-step-content">
                            <div className="wizard-icon">📞</div>
                            <h1 className="wizard-title">Contact Number</h1>
                            <p className="wizard-subtitle">So guests can reach you directly.</p>
                            <input
                                className="form-input wizard-input"
                                placeholder="+1 212 555 0100"
                                value={storePhone}
                                onChange={e => setStorePhone(e.target.value)}
                                type="tel"
                                onKeyDown={e => e.key === 'Enter' && setSetupStep(4)}
                            />
                            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                <button className="wizard-btn-outline" onClick={() => setSetupStep(2)}>Back</button>
                                <button className="wizard-btn start-selling-btn" onClick={handleStartSelling}>
                                    🚀 Start Selling
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ────────────────────────────────────────────────────────────────────────
    // STORE MANAGEMENT VIEW
    // ────────────────────────────────────────────────────────────────────────
    return (
        <div className="mystore-wrapper" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {toastUI}
            <div className="mystore-container">
                <style>{`
                /* Wizard Mobile Tweaks */
                @media (max-width: 768px) {
                    .wizard-container {
                        padding: 16px;
                    }
                    .wizard-card {
                        padding: 24px !important;
                        border-radius: 24px !important;
                        width: 100% !important;
                        max-width: none !important;
                    }
                    .wizard-title { font-size: 24px !important; }
                    .wizard-input { font-size: 16px !important; }

                    /* Store Management Mobile Refinements */
                    .mystore-container {
                        padding: 12px !important;
                        padding-bottom: 120px !important; /* Space for the floating dock */
                    }
                    .store-header-card {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 20px !important;
                        padding: 20px !important;
                        border-radius: 24px !important;
                    }
                    .store-header-actions {
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                        width: 100% !important;
                        gap: 8px !important;
                    }
                    .store-action-btn {
                        padding: 10px !important;
                        font-size: 12px !important;
                        justify-content: center !important;
                    }
                    .store-front-btn {
                        grid-column: span 2 !important;
                        padding: 14px !important;
                    }

                    .section-card {
                        padding: 20px !important;
                        border-radius: 24px !important;
                        margin-bottom: 16px !important;
                    }
                    .section-title { font-size: 18px !important; }
                    .add-btn {
                        padding: 8px 12px !important;
                        font-size: 12px !important;
                    }

                    /* Horizontal Categories */
                    .categories-grid {
                        display: flex !important;
                        overflow-x: auto !important;
                        padding-bottom: 4px;
                        gap: 8px !important;
                        scrollbar-width: none;
                    }
                    .categories-grid::-webkit-scrollbar { display: none; }
                    .category-chip {
                        flex: 0 0 auto !important;
                        padding: 10px 14px !important;
                    }

                    /* Category Filter Tabs Scrollable */
                    .cat-filter-tabs {
                        display: flex !important;
                        overflow-x: auto !important;
                        padding-bottom: 8px;
                        gap: 8px !important;
                        scrollbar-width: none;
                    }
                    .cat-filter-tabs::-webkit-scrollbar { display: none; }
                    .cat-tab {
                        white-space: nowrap !important;
                        padding: 8px 16px !important;
                        font-size: 13px !important;
                    }

                    /* Product Grid as List */
                    .products-grid {
                        grid-template-columns: 1fr !important;
                        gap: 12px !important;
                    }
                    .product-card {
                        display: flex !important;
                        flex-direction: row !important;
                        padding: 12px !important;
                        gap: 12px !important;
                    }
                    .product-image-box {
                        width: 80px !important;
                        height: 80px !important;
                        flex-shrink: 0 !important;
                    }
                    .product-card-body {
                        flex: 1 !important;
                        padding: 0 !important;
                    }
                    .product-card-name { font-size: 15px !important; margin-bottom: 2px !important; }
                    .product-card-desc { font-size: 12px !important; -webkit-line-clamp: 1 !important; }
                    .product-card-price { margin-top: 4px !important; font-size: 14px !important; }
                    
                    .product-card-actions {
                        flex-direction: column !important;
                        justify-content: center !important;
                        gap: 8px !important;
                    }

                    /* Modal Mobile Refinements */
                    .modal-overlay {
                        z-index: 20000 !important; /* Stay above iPhone dock */
                    }
                    .modal-card {
                        width: 95% !important;
                        padding: 0 !important;
                        border-radius: 28px !important;
                        max-height: 85vh !important;
                        overflow-y: auto !important;
                        margin-bottom: 80px !important; /* Push up so it's not behind dock if focused */
                    }
                    .modal-wide { width: 95% !important; }
                    .modal-header { padding: 20px !important; }
                    .modal-body { 
                        padding: 20px !important;
                        padding-bottom: 40px !important; /* Extra room for the save button */
                    }
                    .form-row { grid-template-columns: 1fr !important; gap: 0 !important; }
                    
                    .product-img-upload {
                        height: 220px !important;
                        margin-bottom: 24px !important;
                        background: #f8fafc !important;
                    }
                    .wizard-input, .form-input {
                        font-size: 16px !important; /* Prevents iOS zoom-on-focus */
                        padding: 14px 16px !important;
                    }
                    .action-btn.complete {
                        padding: 16px !important;
                        font-size: 16px !important;
                    }
                }
            `}</style>
                {/* Store Header */}
                <div className="store-header-card">
                    <div className="store-identity">
                        {storeData.logo_url
                            ? <img src={storeData.logo_url} alt="logo" className="store-logo-img" />
                            : <div className="store-logo-placeholder">{storeData.name ? storeData.name[0] : '?'}</div>}
                        <div>
                            <h1 className="store-name-title">{storeData.name}</h1>
                            <div className="store-phone-label">{storeData.phone || 'No phone set'}</div>
                        </div>
                    </div>
                    <div className="store-header-actions">
                        <button className="store-action-btn qr-btn" onClick={() => setShowQR(true)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3m4-3h.01M14 21h7M21 14v3" /></svg>
                            QR Code
                        </button>
                        <button
                            className="store-action-btn preview-btn"
                            onClick={() => {
                                const slug = storeData.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                                window.open(`/store/${slug}`, '_blank');
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            Preview Store
                        </button>
                        <button
                            className="store-action-btn store-front-btn"
                            onClick={() => setShowQR(true)}
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                borderColor: 'transparent'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            Print QR Stand
                        </button>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="section-card">
                    <div className="section-title-row">
                        <h2 className="section-title">Categories</h2>
                        <button className="add-btn" onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Category
                        </button>
                    </div>
                    {categories.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🗂️</div>
                            <div className="empty-text">No categories yet. Add one to get started!</div>
                        </div>
                    ) : (
                        <div className="categories-grid">
                            {categories.map(cat => (
                                <div key={cat.id} className="category-chip">
                                    <span className="category-chip-name">{cat.name}</span>
                                    <div className="category-chip-actions">
                                        <button className="chip-action edit" onClick={() => { setEditingCategory(cat); }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button className="chip-action delete" onClick={() => deleteCategory(cat.id)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6m4-6v6" /><path d="M9 6V4h6v2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Products Section */}
                <div className="section-card">
                    <div className="section-title-row">
                        <h2 className="section-title">Products</h2>
                        <button
                            className="add-btn"
                            disabled={categories.length === 0}
                            onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                            title={categories.length === 0 ? 'Add a category first' : ''}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Product
                        </button>
                    </div>

                    {/* Category Filter Tabs */}
                    {categories.length > 0 && (
                        <div className="cat-filter-tabs">
                            <button
                                className={`cat-tab ${activeCatFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCatFilter('all')}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`cat-tab ${activeCatFilter === cat.id ? 'active' : ''}`}
                                    onClick={() => setActiveCatFilter(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredProducts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🍽️</div>
                            <div className="empty-text">
                                {categories.length === 0
                                    ? 'Add a category first, then you can add products.'
                                    : 'No products in this category yet.'}
                            </div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image-box">
                                        {product.image
                                            ? <img src={product.image} alt={product.name} className="product-grid-img" />
                                            : <div className="product-img-placeholder">🍽️</div>}
                                    </div>
                                    <div className="product-card-body">
                                        <div className="product-card-name">{product.name}</div>
                                        <div className="product-card-cat">
                                            {categories.find(c => c.id === product.categoryId)?.name}
                                        </div>
                                        {product.description && <div className="product-card-desc">{product.description}</div>}
                                        <div className="product-card-price">{currencySymbol}{parseFloat(product.price).toFixed(2)}</div>
                                    </div>
                                    <div className="product-card-actions">
                                        <button className="chip-action edit" onClick={() => setEditingProduct(product)}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button className="chip-action delete" onClick={() => deleteProduct(product.id)}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6m4-6v6" /><path d="M9 6V4h6v2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modals */}
                {
                    (showCategoryModal || editingCategory) && (
                        <CategoryModal
                            editing={editingCategory}
                            onSave={editingCategory ? saveCategory : addCategory}
                            onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                        />
                    )
                }
                {
                    (showProductModal || editingProduct) && (
                        <ProductModal
                            editing={editingProduct}
                            categories={categories}
                            onSave={editingProduct ? saveProduct : addProduct}
                            onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
                        />
                    )
                }
                {showQR && <QRTemplateModal store={storeData} onClose={() => setShowQR(false)} />}
                {
                    showPreview && (
                        <PreviewModal
                            store={storeData}
                            categories={categories}
                            products={products}
                            onClose={() => setShowPreview(false)}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default MyStore;
