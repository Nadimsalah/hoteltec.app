import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Link, Image as ImageIcon, X, LayoutGrid } from 'lucide-react';
import { supabase } from '../supabaseClient';

// ─── Storage Helper ──────────────────────────────────────────────────────────
const uploadImage = async (file, bucket = 'store-assets') => {
    if (!file) return null;
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `stories/${fileName}`;

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

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [storeId, setStoreId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStory, setNewStory] = useState({ name: '', url: '', type: 'image', productId: '' });
    const [mediaFile, setMediaFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState('image');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const fileInputRef = useRef(null);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: store } = await supabase
                .from('stores')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (store) {
                setStoreId(store.id);

                // Fetch Stories
                const { data: sData } = await supabase
                    .from('stories')
                    .select('*, products(name)')
                    .eq('store_id', store.id)
                    .order('created_at', { ascending: false });

                if (sData) {
                    setStories(sData.map(s => ({
                        id: s.id,
                        name: s.title,
                        url: s.media_url,
                        type: s.media_type,
                        product: s.products?.name || 'No product linked'
                    })));
                }

                // Fetch Products for picker
                const { data: pData } = await supabase
                    .from('products')
                    .select('id, name, image_url')
                    .eq('store_id', store.id);

                if (pData) setProducts(pData);
            }
        } catch (error) {
            console.error('Error fetching stories data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const type = file.type.startsWith('video') ? 'video' : 'image';
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setPreviewType(type);
            setMediaFile(file);
            setNewStory({ ...newStory, url: url, type: type });
        }
    };

    const handleCreateStory = async () => {
        if (!newStory.name || !mediaFile || !storeId) return;

        setLoading(true);
        try {
            const uploadedUrl = await uploadImage(mediaFile);

            const { data: story, error } = await supabase
                .from('stories')
                .insert([{
                    store_id: storeId,
                    title: newStory.name,
                    media_url: uploadedUrl,
                    media_type: newStory.type,
                    linked_product_id: newStory.productId || null
                }])
                .select('*, products(name)')
                .single();

            if (error) throw error;

            setStories([{
                id: story.id,
                name: story.title,
                url: story.media_url,
                type: story.media_type,
                product: story.products?.name || 'No product linked'
            }, ...stories]);

            setNewStory({ name: '', url: '', type: 'image', productId: '' });
            setMediaFile(null);
            setPreviewUrl(null);
            setIsModalOpen(false);
            showToast('Story published successfully!');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteStory = async (id) => {
        if (!confirm('Are you sure you want to delete this story?')) return;
        try {
            const { error } = await supabase
                .from('stories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setStories(stories.filter(s => s.id !== id));
            showToast('Story deleted');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    return (
        <div className="stories-management">
            <style>{`
                .stories-management {
                    padding: 24px;
                }
                .stories-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }
                .stories-header h1 {
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #0f172a;
                    margin: 0;
                }
                .add-story-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #0f172a;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .add-story-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    background: #1e293b;
                }
                .stories-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 24px;
                }
                .story-card-dash {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                    transition: all 0.3s;
                    position: relative;
                }
                .story-card-dash:hover {
                    box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                    transform: translateY(-4px);
                }
                .story-visual-dash {
                    width: 100%;
                    height: 320px;
                    object-fit: cover;
                }
                .story-info-dash {
                    padding: 16px;
                }
                .story-name-dash {
                    font-weight: 700;
                    font-size: 16px;
                    color: #1e293b;
                    margin-bottom: 8px;
                }
                .story-link-dash {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #64748b;
                    background: #f1f5f9;
                    padding: 4px 8px;
                    border-radius: 6px;
                }
                .delete-story-btn {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transition: all 0.2s;
                }
                .story-card-dash:hover .delete-story-btn {
                    opacity: 1;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    width: 100%;
                    max-width: 480px;
                    border-radius: 28px;
                    padding: 32px;
                    position: relative;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                }
                .modal-close {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    background: #f1f5f9;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #64748b;
                }
                .modal-content h2 {
                    font-size: 24px;
                    font-weight: 800;
                    margin-bottom: 24px;
                    letter-spacing: -0.01em;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #475569;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    font-size: 15px;
                    outline: none;
                }
                .visual-upload-preview {
                    width: 100%;
                    height: 180px;
                    border-radius: 16px;
                    border: 2px dashed #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                    background: #f8fafc;
                }
                .visual-upload-preview img, .visual-upload-preview video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 12px;
                    transition: transform 0.2s;
                }
                .submit-btn:hover {
                    transform: scale(1.02);
                }
                .submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                .product-picker {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    max-height: 200px;
                    overflow-y: auto;
                    padding: 4px;
                }
                .product-picker-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .product-picker-item:hover {
                    border-color: #cbd5e1;
                    background: #f8fafc;
                }
                .product-picker-item.selected {
                    border-color: #0f172a;
                    background: #f1f5f9;
                }
                .picker-img {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    object-fit: cover;
                }
                .picker-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #1e293b;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                @media (max-width: 768px) {
                    .stories-management {
                        padding: 16px !important;
                        padding-bottom: 120px !important;
                    }
                    .stories-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 16px !important;
                        margin-bottom: 24px !important;
                    }
                    .stories-header h1 { font-size: 24px !important; }
                    .add-story-btn {
                        width: 100% !important;
                        justify-content: center !important;
                        padding: 14px !important;
                    }
                    .stories-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 12px !important;
                    }
                    .story-card-dash {
                        border-radius: 24px !important;
                    }
                    .story-visual-dash {
                        height: 240px !important;
                    }
                    .delete-story-btn {
                        opacity: 1 !important;
                        top: 8px !important;
                        right: 8px !important;
                    }
                    .story-info-dash {
                        padding: 12px !important;
                    }
                    .story-name-dash { font-size: 14px !important; }
                    
                    /* Modal Mobile Refinements */
                    .modal-overlay {
                        z-index: 20000 !important;
                        padding: 16px !important;
                    }
                    .modal-content {
                        padding: 24px !important;
                        max-height: 90vh !important;
                        overflow-y: auto !important;
                        border-radius: 32px !important;
                        margin-bottom: 20px !important;
                    }
                    .modal-close {
                        top: 16px !important;
                        right: 16px !important;
                    }
                    .visual-upload-preview {
                        height: 220px !important;
                    }
                    .product-picker {
                        grid-template-columns: 1fr !important;
                    }
                    .submit-btn {
                        padding: 16px !important;
                        font-size: 16px !important;
                    }
                }
            `}</style>

            {toast.show && (
                <div className={`toast-notification ${toast.type}`} style={{
                    position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 20002, background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: '600',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}>
                    {toast.message}
                </div>
            )}

            {loading && !isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>Loading Stories...</div>
                </div>
            )}

            <div className="stories-header">
                <div>
                    <h1>Story Highlights</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Manage ephemeral stories (Image or Video) for your store front</p>
                </div>
                <button className="add-story-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Push New Story
                </button>
            </div>

            <div className="stories-grid">
                {stories.map(story => (
                    <div className="story-card-dash" key={story.id}>
                        {story.type === 'video' ? (
                            <video src={story.url} className="story-visual-dash" muted autoPlay loop />
                        ) : (
                            <img src={story.url} alt={story.name} className="story-visual-dash" />
                        )}
                        <button className="delete-story-btn" onClick={() => deleteStory(story.id)}>
                            <Trash2 size={16} />
                        </button>
                        <div className="story-info-dash">
                            <div className="story-name-dash">{story.name}</div>
                            <div className="story-link-dash">
                                <Link size={12} />
                                {story.product}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <h2>Create New Story</h2>

                        <div className="form-group">
                            <label>Story Visual (Image or Video)</label>
                            <div className="visual-upload-preview" onClick={() => fileInputRef.current.click()}>
                                {previewUrl ? (
                                    previewType === 'video' ? (
                                        <video src={previewUrl} muted autoPlay loop />
                                    ) : (
                                        <img src={previewUrl} alt="preview" />
                                    )
                                ) : (
                                    <>
                                        <ImageIcon size={32} color="#94a3b8" />
                                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Click to upload story media</p>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                            />
                        </div>

                        <div className="form-group">
                            <label>Story Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Summer Special Drinks"
                                value={newStory.name}
                                onChange={e => setNewStory({ ...newStory, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Link to Product</label>
                            <div className="product-picker">
                                {products.map(p => (
                                    <div
                                        key={p.id}
                                        className={`product-picker-item ${newStory.productId === p.id ? 'selected' : ''}`}
                                        onClick={() => setNewStory({ ...newStory, productId: p.id })}
                                    >
                                        <img src={p.image_url} alt={p.name} className="picker-img" />
                                        <span className="picker-name">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="submit-btn"
                            onClick={handleCreateStory}
                            disabled={!newStory.name || !newStory.url}
                        >
                            Publish Story
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Stories;
