import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Background from '../components/Background';
import QRTemplateModal from '../components/QRTemplateModal';
import MyStore from './MyStore';
import Stories from './Stories';
import Analytics from './Analytics';
import Billing from './Billing';
import Settings from './Settings';
import StaffManagement from './StaffManagement';
import { ShieldCheck, UserCircle2, KeyRound } from 'lucide-react';

const getActiveTabFromPath = (path) => {
    switch (path) {
        case '/dash/mystore': return 'My Store';
        case '/dash/stories': return 'Stories';
        case '/dash/analytics': return 'Analytics';
        case '/dash/billing': return 'Billing';
        case '/dash/settings': return 'Settings';
        case '/dash/team': return 'Team';
        default: return 'Orders';
    }
};

const Dashboard = ({ activeTab: initialTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(initialTab || 'Orders');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showQR, setShowQR] = useState(false);
    const [storeData, setStoreData] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [storeId, setStoreId] = useState(null);
    const [allStores, setAllStores] = useState([]);

    // Staff state
    const [activeStaff, setActiveStaff] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [staffPin, setStaffPin] = useState('');
    const [staffError, setStaffError] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Get user's store
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch if user is staff of any stores
            const { data: teamAssignments } = await supabase
                .from('team_members')
                .select('store_id')
                .eq('user_id', user.id);

            let storesQuery = supabase.from('stores').select('*');
            if (teamAssignments && teamAssignments.length > 0) {
                const storeIds = teamAssignments.map(t => t.store_id);
                if (storeIds.length) {
                    storesQuery = storesQuery.or(`user_id.eq.${user.id},id.in.(${storeIds.join(',')})`);
                } else {
                    storesQuery = storesQuery.eq('user_id', user.id);
                }
            } else {
                storesQuery = storesQuery.eq('user_id', user.id);
            }

            const { data: stores } = await storesQuery.order('created_at', { ascending: true });

            if (stores && stores.length > 0) {
                setAllStores(stores);
                const savedId = localStorage.getItem('hoteltec_active_store');
                const store = savedId ? (stores.find(s => s.id === savedId) || stores[0]) : stores[0];

                setStoreId(store.id);
                setStoreData(store);

                // Fetch staff presets & check active staff
                const listRaw = localStorage.getItem(`hoteltec_staff_${store.id}`);
                if (listRaw) {
                    const list = JSON.parse(listRaw);
                    const activeId = localStorage.getItem(`hoteltec_active_${store.id}`);
                    if (activeId) {
                        const s = list.find(x => x.id === activeId);
                        if (s) setActiveStaff(s);
                    }
                }

                fetchOrders(store.id);
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async (id) => {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products ( image_url, category_id )
                )
            `)
            .eq('store_id', id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            // Transform data to match UI expectations
            const transformed = data.map(o => {
                const firstItem = o.order_items?.[0];
                const productImage = firstItem?.products?.image_url;

                return {
                    id: o.id,
                    room: o.room_number,
                    status: o.status,
                    time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    name: firstItem?.product_name || 'Order',
                    image: productImage || 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80&w=800',
                    client: { name: o.customer_name, email: '', phone: o.customer_phone },
                    items: o.order_items.map(i => `${i.quantity}x ${i.product_name}`),
                    total: o.total_amount,
                    categories: o.order_items.map(i => i.products?.category_id).filter(Boolean)
                };
            });
            setOrders(transformed);
        }
    };

    // Update activeTab when route changes
    useEffect(() => {
        setActiveTab(getActiveTabFromPath(location.pathname));
    }, [location.pathname]);

    const stats = {
        total: orders.length,
        completed: orders.filter(o => o.status === 'Completed').length,
        waiting: orders.filter(o => o.status === 'Waiting').length,
        canceled: orders.filter(o => o.status === 'Canceled').length
    };

    const allTabs = [
        { name: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', path: '/dash' },
        { name: 'My Store', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', path: '/dash/mystore' },
        { name: 'Stories', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', path: '/dash/stories' },
        { name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', path: '/dash/analytics' },
        { name: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', path: '/dash/billing' },
        { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', path: '/dash/settings' },
        { name: 'Team', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', path: '/dash/team' }
    ];

    const tabs = activeStaff
        ? allTabs.filter(t => {
            const allowed = activeStaff.pages || ['Orders'];
            // Always allow Orders if somehow their permissions are totally empty
            if (t.name === 'Orders' && allowed.length === 0) return true;
            return allowed.includes(t.name);
        })
        : allTabs;

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.room.includes(searchQuery) ||
            order.client.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

        // Strict category isolation for staff
        const matchesCategories = (activeStaff && activeStaff.categories && activeStaff.categories.length > 0)
            ? order.categories.some(cid => activeStaff.categories.includes(cid))
            : true;

        return matchesSearch && matchesStatus && matchesCategories;
    });

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setOrders(orders.map(order =>
                order.id === id ? { ...order, status: newStatus } : order
            ));
            showToast(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Failed to update status', 'error');
        }
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        showToast(`Order #${id} marked as ${newStatus}`);
    };

    const handleStaffLogin = () => {
        if (!loginPin) return;
        const list = JSON.parse(localStorage.getItem(`hoteltec_staff_${storeId}`) || '[]');
        const p = list.find(x => x.pin === loginPin);
        if (p) {
            setActiveStaff(p);
            localStorage.setItem(`hoteltec_active_${storeId}`, p.id);
            setShowLoginModal(false);
            setLoginPin('');
            setStaffError('');

            // Redirect them to their first assigned page if they don't have access to the current one
            if (!p.pages.includes(activeTab)) {
                const initialTab = allTabs.find(t => p.pages.includes(t.name));
                if (initialTab) {
                    navigate(initialTab.path);
                    setActiveTab(initialTab.name);
                } else {
                    setActiveTab('NoAccess');
                }
            }
        } else {
            setStaffError('Invalid PIN code');
        }
    };

    return (
        <div className={`dashboard-layout ${isCollapsed ? 'collapsed' : ''}`}>
            <style>{`
                .dashboard-layout { display: flex; min-height: 100vh; background: #f8fafc; }
                .sidebar { width: 280px; background: #fff; border-right: 1px solid #e2e8f0; padding: 24px; display: flex; flex-direction: column; transition: all 0.3s; }
                .sidebar.collapsed { width: 80px; padding: 24px 12px; }
                .sidebar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
                .sidebar-logo { font-size: 24px; font-weight: 800; color: #0f172a; }
                .sidebar.collapsed .sidebar-logo { display: none; }
                .sidebar-nav { display: flex; flex-direction: column; gap: 8px; }
                .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; border: none; background: transparent; cursor: pointer; color: #64748b; font-weight: 600; text-align: left; transition: all 0.2s; }
                .nav-item:hover { background: #f1f5f9; color: #0f172a; }
                .nav-item.active { background: #0f172a; color: #fff; }
                .sidebar.collapsed .nav-text { display: none; }
                
                .main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
                .top-bar { padding: 20px 40px; display: flex; align-items: center; justify-content: flex-end; background: #fff; border-bottom: 1px solid #e2e8f0; }
                .dashboard-body { padding: 40px; flex: 1; }

                .stats-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 40px; }
                .stat-card { background: #fff; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .stat-label { color: #64748b; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
                .stat-value { font-size: 32px; font-weight: 800; color: #0f172a; }

                .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
                .order-card { background: #fff; padding: 0; border-radius: 24px; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; display: flex; flex-direction: column; }
                .order-card-inner { padding: 24px; display: flex; flex-direction: column; flex: 1; }
                .order-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-color: #3b82f6; }
                .badge-new { position: absolute; top: 16px; right: 16px; background: #3b82f6; color: #fff; font-size: 10px; font-weight: 800; padding: 6px 12px; border-radius: 100px; z-index: 10; boxShadow: 0 4px 12px rgba(59,130,246,0.3); }
                
                .order-card-image { width: 100%; height: 160px; object-fit: cover; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; }
                .card-room { font-size: 14px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
                .card-status { font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; display: inline-block; padding: 4px 8px; border-radius: 6px; }
                .waiting .card-status { background: #fffbeb; color: #f59e0b; }
                .opened .card-status { background: #ecfdf5; color: #10b981; }
                .canceled .card-status { background: #fef2f2; color: #ef4444; }
                .card-order-name { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
                .card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; border-top: 1px dashed #e2e8f0; color: #94a3b8; }
                .card-time { font-size: 13px; font-weight: 500; }

                /* Details View */
                .order-details-container { animation: fadeIn 0.4s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .back-btn { display: flex; align-items: center; gap: 8px; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; margin-bottom: 32px; transition: color 0.2s; }
                .back-btn:hover { color: #0f172a; }
                .details-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
                .details-main-card { background: #fff; border-radius: 32px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
                .details-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
                .details-title { font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
                .status-pill { padding: 8px 16px; border-radius: 100px; font-size: 14px; font-weight: 700; text-transform: uppercase; }
                .status-pill.waiting { background: #fffbeb; color: #f59e0b; }
                .status-pill.completed { background: #ecfdf5; color: #10b981; }
                .status-pill.canceled { background: #fef2f2; color: #ef4444; }
                .order-image-container { width: 100%; height: 300px; border-radius: 24px; overflow: hidden; margin-bottom: 32px; background: #f1f5f9; }
                .order-large-image { width: 100%; height: 100%; object-fit: cover; }
                .order-items-section h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
                .item-row { padding: 16px; background: #f8fafc; border-radius: 12px; margin-bottom: 8px; font-weight: 600; color: #334155; }
                .status-actions { display: flex; gap: 12px; margin-top: 40px; }
                .action-btn { flex: 1; padding: 16px; border-radius: 16px; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .action-btn.complete { background: #10b981; color: #fff; }
                .action-btn.cancel { background: #f1f5f9; color: #ef4444; }
                .action-btn.wait { background: #f1f5f9; color: #64748b; }
                .action-btn:hover { transform: translateY(-2px); filter: brightness(0.95); }

                .details-side-cards { display: flex; flex-direction: column; gap: 24px; }
                .client-card, .time-card { background: #fff; padding: 24px; border-radius: 24px; border: 1px solid #e2e8f0; }
                .client-card h3, .time-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
                .client-name { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
                .client-detail { font-size: 14px; color: #64748b; margin-bottom: 4px; }
                .timeline-item { display: flex; gap: 16px; }
                .time-marker { width: 12px; height: 12px; border-radius: 50%; background: #3b82f6; margin-top: 4px; }

                /* Mobile App-like Refinements */
                @media (max-width: 768px) {
                    .dashboard-layout { display: flex; flex-direction: column; }
                    .sidebar { position: fixed !important; bottom: 20px !important; top: auto !important; left: 20px !important; right: 20px !important; width: calc(100% - 40px) !important; height: 72px !important; background: rgba(255, 255, 255, 0.4) !important; backdrop-filter: blur(25px) saturate(200%) !important; -webkit-backdrop-filter: blur(25px) saturate(200%) !important; border: 1px solid rgba(255, 255, 255, 0.4) !important; border-radius: 35px !important; z-index: 9999 !important; padding: 0 !important; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255,255,255,0.4) !important; display: flex !important; align-items: center !important; justify-content: center !important; }
                    .sidebar-header, .sidebar-logo, .toggle-btn { display: none !important; }
                    .sidebar-nav { display: flex !important; flex-direction: row !important; justify-content: space-evenly !important; align-items: center !important; width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 10px !important; list-style: none !important; }
                    .nav-item { flex: 1 !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; gap: 2px !important; background: transparent !important; border: none !important; padding: 0 !important; height: 100% !important; color: #64748b !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
                    .nav-item svg { width: 22px !important; height: 22px !important; stroke-width: 2.2px !important; transition: all 0.3s ease !important; }
                    .nav-item.active { color: #0f172a !important; }
                    .nav-item.active svg { color: #3b82f6 !important; transform: scale(1.1) translateY(-2px); }
                    .nav-text { display: block !important; font-size: 10px !important; font-weight: 800 !important; margin: 1px 0 0 0 !important; letter-spacing: -0.01em; }
                    .main-content { padding-bottom: 90px !important; margin-left: 0 !important; width: 100% !important; }
                    .dashboard-body { padding: 16px !important; overflow-x: hidden; }
                    .details-main-card { padding: 20px !important; }
                    .details-title { font-size: 24px !important; }
                    .order-image-container { height: 200px !important; margin-bottom: 20px !important; }
                    .top-bar { padding: 10px 16px !important; justify-content: space-between !important; }
                    .stats-container { display: flex !important; overflow-x: auto; padding-bottom: 8px; gap: 12px !important; scroll-snap-type: x mandatory; -ms-overflow-style: none; scrollbar-width: none; }
                    .stats-container::-webkit-scrollbar { display: none; }
                    .stat-card { min-width: 140px; scroll-snap-align: start; padding: 16px !important; }
                    .orders-controls { flex-direction: column !important; align-items: stretch !important; gap: 16px !important; }
                    .orders-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
                    .order-card { padding: 0 !important; border-radius: 16px !important; }
                    .order-card-inner { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important;}
                    .order-card-image { display: none; /* Hide image on mobile list view for compactness, or can tweak later */ }
                    .order-card .badge-new { position: static !important; margin-bottom: 4px; width: fit-content; border-radius: 8px !important; padding: 4px 8px !important; box-shadow: none !important; }
                    .card-room { font-size: 12px !important; margin-bottom: 2px !important; }
                    .card-order-name { font-size: 15px !important; margin: 4px 0 !important; }
                    .card-footer { display: flex !important; flex-direction: column !important; align-items: flex-end !important; gap: 4px; border-top: none !important; padding-top: 0 !important; }
                    .details-grid { grid-template-columns: 1fr; }
                }

                /* Toast UI */
                .toast-notification { position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(0); background: #0f172a; color: white; padding: 12px 24px; border-radius: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); z-index: 10000; animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid rgba(255,255,255,0.1); min-width: 300px; justify-content: center; font-weight: 600; font-size: 15px; }
                .toast-notification.error { background: #ef4444; }
                .toast-notification.success { background: #10b981; }
                @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
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
            <Background />

            <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'not-collapsed'}`}>
                <div className="sidebar-header">
                    <img src="/hoteltec.png" alt="Hoteltec Logo" className="sidebar-logo" style={{ height: '36px', objectFit: 'contain', display: isCollapsed ? 'none' : 'block' }} />
                    <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                        {isCollapsed ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="13 17 18 12 13 7"></polyline>
                                <polyline points="6 17 11 12 6 7"></polyline>
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="11 17 6 12 11 7"></polyline>
                                <polyline points="18 17 13 12 18 7"></polyline>
                            </svg>
                        )}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            className={`nav-item ${activeTab === tab.name ? 'active' : ''}`}
                            onClick={() => {
                                navigate(tab.path);
                                setSelectedOrder(null);
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d={tab.icon}></path>
                            </svg>
                            <span className="nav-text">{tab.name}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <div className="main-content">
                <header className="top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {!activeStaff && allStores.length > 1 && (
                            <select
                                value={storeId || ''}
                                onChange={(e) => {
                                    localStorage.setItem('hoteltec_active_store', e.target.value);
                                    window.location.reload();
                                }}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f8fafc',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#0f172a',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {allStores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        )}

                        {!activeStaff && (
                            <button
                                onClick={() => setShowQR(true)}
                                style={{
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                                    transition: 'transform 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                Print QR Stand
                            </button>
                        )}

                        {activeStaff ? (
                            <button
                                onClick={() => {
                                    localStorage.removeItem(`hoteltec_active_${storeId}`);
                                    window.location.href = `/staff/${storeId}`;
                                }}
                                style={{
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                Staff Logout
                            </button>
                        ) : (
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    navigate('/login');
                                }}
                                style={{
                                    background: 'none',
                                    border: '1px solid #e2e8f0',
                                    color: '#64748b',
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Admin Logout
                            </button>
                        )}

                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', overflow: 'hidden' }}>
                            {storeData?.logo_url ? (
                                <img src={storeData.logo_url} alt="Store Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ margin: 'auto' }}>{activeStaff ? activeStaff.name.charAt(0).toUpperCase() : 'JD'}</span>
                            )}
                        </div>
                    </div>
                </header>

                <main className="dashboard-body">
                    {selectedOrder ? (
                        <div className="order-details-container">
                            <button className="back-btn" onClick={(e) => { e.stopPropagation(); setSelectedOrder(null); setActiveTab('Orders'); }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                Back to All Orders
                            </button>

                            <div className="details-grid">
                                <div className="details-main-card">
                                    <div className="details-header">
                                        <div>
                                            <h1 className="details-title">{selectedOrder.name}</h1>
                                            <div className="details-room">Room {selectedOrder.room}</div>
                                        </div>
                                        <div className={`status-pill ${selectedOrder.status.toLowerCase()}`}>
                                            {selectedOrder.status}
                                        </div>
                                    </div>

                                    <div className="order-image-container">
                                        <img
                                            src={selectedOrder.image}
                                            alt={selectedOrder.name}
                                            className="order-large-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80&w=800';
                                            }}
                                        />
                                    </div>

                                    <div className="order-items-section">
                                        <h3>Order Summary</h3>
                                        <div className="items-list">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="item-row">{item}</div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="status-actions">
                                        <button className="action-btn complete" onClick={() => updateStatus(selectedOrder.id, 'Completed')}>Mark as Completed</button>
                                        <button className="action-btn cancel" onClick={() => updateStatus(selectedOrder.id, 'Canceled')}>Cancel Order</button>
                                        <button className="action-btn wait" onClick={() => updateStatus(selectedOrder.id, 'Waiting')}>Reset to Waiting</button>
                                    </div>
                                </div>

                                <div className="details-side-cards">
                                    <div className="client-card">
                                        <h3>Client Information</h3>
                                        <div className="client-info">
                                            <div className="client-name">{selectedOrder.client.name}</div>
                                            <div className="client-detail">Email: {selectedOrder.client.email}</div>
                                            <div className="client-detail">Phone: {selectedOrder.client.phone}</div>
                                        </div>
                                    </div>
                                    <div className="time-card">
                                        <h3>Timeline</h3>
                                        <div className="timeline-item">
                                            <div className="time-marker"></div>
                                            <div>
                                                <div className="time-label">Order Received</div>
                                                <div className="time-stamp">{selectedOrder.time}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        activeTab === 'Orders' ? (
                            <>
                                <section className="stats-container">
                                    <div className="stat-card" onClick={() => setFilterStatus('All')} style={{ cursor: 'pointer', border: filterStatus === 'All' ? '2px solid #000' : 'none' }}>
                                        <div className="stat-label">Total Orders</div>
                                        <div className="stat-value">{stats.total}</div>
                                    </div>
                                    <div className="stat-card" onClick={() => setFilterStatus('Completed')} style={{ cursor: 'pointer', border: filterStatus === 'Completed' ? '2px solid #10b981' : 'none' }}>
                                        <div className="stat-label">Completed</div>
                                        <div className="stat-value" style={{ color: '#10b981' }}>{stats.completed}</div>
                                    </div>
                                    <div className="stat-card" onClick={() => setFilterStatus('Waiting')} style={{ cursor: 'pointer', border: filterStatus === 'Waiting' ? '2px solid #f59e0b' : 'none' }}>
                                        <div className="stat-label">Waiting</div>
                                        <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.waiting}</div>
                                    </div>
                                    <div className="stat-card" onClick={() => setFilterStatus('Canceled')} style={{ cursor: 'pointer', border: filterStatus === 'Canceled' ? '2px solid #ef4444' : 'none' }}>
                                        <div className="stat-label">Canceled</div>
                                        <div className="stat-value" style={{ color: '#ef4444' }}>{stats.canceled}</div>
                                    </div>
                                </section>

                                <div className="orders-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '20px' }}>
                                    <div className="search-box" style={{ flex: 1, position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Search by room, client, or item..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' }}
                                        />
                                        <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>

                                    <div className="view-switcher" style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: viewMode === 'grid' ? 'white' : 'transparent', color: viewMode === 'grid' ? '#000' : '#64748b', fontWeight: '600', cursor: 'pointer', boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                                        >
                                            Grid
                                        </button>
                                        <button
                                            onClick={() => setViewMode('table')}
                                            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: viewMode === 'table' ? 'white' : 'transparent', color: viewMode === 'table' ? '#000' : '#64748b', fontWeight: '600', cursor: 'pointer', boxShadow: viewMode === 'table' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                                        >
                                            Table
                                        </button>
                                    </div>
                                </div>

                                {viewMode === 'grid' ? (
                                    <div className="orders-grid">
                                        {filteredOrders.map(order => (
                                            <div
                                                key={order.id}
                                                className={`order-card ${order.status === 'Completed' ? 'opened' : order.status === 'Canceled' ? 'canceled' : 'waiting'}`}
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                {order.status === 'Waiting' && <span className="badge-new">NEW ORDER</span>}
                                                <img
                                                    src={order.image}
                                                    alt={order.name}
                                                    className="order-card-image"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80&w=300';
                                                    }}
                                                />

                                                <div className="order-card-inner">
                                                    <div>
                                                        <div className="card-room">Room {order.room}</div>
                                                        <div className="card-status">{order.status}</div>
                                                        <div className="card-order-name">{order.name}</div>
                                                    </div>

                                                    <div className="card-footer" style={{ marginTop: 'auto' }}>
                                                        <div className="card-time">{order.time}</div>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="orders-table-container" style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                            <thead>
                                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                                    <th style={{ padding: '20px', fontWeight: '700', color: '#64748b' }}>Room</th>
                                                    <th style={{ padding: '20px', fontWeight: '700', color: '#64748b' }}>Client</th>
                                                    <th style={{ padding: '20px', fontWeight: '700', color: '#64748b' }}>Order</th>
                                                    <th style={{ padding: '20px', fontWeight: '700', color: '#64748b' }}>Time</th>
                                                    <th style={{ padding: '20px', fontWeight: '700', color: '#64748b' }}>Status</th>
                                                    <th style={{ padding: '20px', fontWeight: '700', color: '#64748b' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.map(order => (
                                                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                                                        <td style={{ padding: '20px', fontWeight: '800' }}>{order.room}</td>
                                                        <td style={{ padding: '20px' }}>
                                                            <div style={{ fontWeight: '700' }}>{order.client.name}</div>
                                                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{order.client.phone}</div>
                                                        </td>
                                                        <td style={{ padding: '20px', fontWeight: '600' }}>{order.name}</td>
                                                        <td style={{ padding: '20px', color: '#64748b' }}>{order.time}</td>
                                                        <td style={{ padding: '20px' }}>
                                                            <span style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '100px',
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                background: order.status === 'Completed' ? '#ecfdf5' : order.status === 'Waiting' ? '#fffbeb' : '#fef2f2',
                                                                color: order.status === 'Completed' ? '#10b981' : order.status === 'Waiting' ? '#f59e0b' : '#ef4444'
                                                            }}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '20px' }}>
                                                            <button
                                                                style={{ padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white' }}
                                                                onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                                            >
                                                                Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {filteredOrders.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
                                        No orders found matching your criteria.
                                    </div>
                                )}
                            </>
                        ) : activeStaff && !(activeStaff.pages || ['Orders']).includes(activeTab) ? (
                            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#6b7280' }}>
                                <ShieldCheck size={64} color="#ef4444" style={{ marginBottom: '16px' }} />
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#000', marginBottom: '12px' }}>Access Restricted</h1>
                                <p style={{ fontSize: '16px' }}>Your staff profile does not have permission to view this module.</p>
                            </div>
                        ) : activeTab === 'My Store' ? (
                            <MyStore onSwitch={() => navigate('/store')} />
                        ) : activeTab === 'Stories' ? (
                            <Stories />
                        ) : activeTab === 'Analytics' ? (
                            <Analytics />
                        ) : activeTab === 'Billing' ? (
                            <Billing />
                        ) : activeTab === 'Settings' ? (
                            <Settings />
                        ) : activeTab === 'Team' ? (
                            <StaffManagement storeId={storeId} />
                        ) : activeTab === 'NoAccess' ? (
                            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#6b7280' }}>
                                <ShieldCheck size={64} color="#ef4444" style={{ marginBottom: '16px' }} />
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#000', marginBottom: '12px' }}>Access Restricted</h1>
                                <p style={{ fontSize: '16px' }}>Your staff profile does not have permission to view this module.</p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#6b7280' }}>
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#000', marginBottom: '12px', letterSpacing: '-0.02em' }}>{activeTab}</h1>
                                <p style={{ fontSize: '16px' }}>This module is currently being optimized for your experience.</p>
                            </div>
                        )
                    )}
                </main>
            </div>
            {showQR && storeData && <QRTemplateModal store={storeData} onClose={() => setShowQR(false)} />}

            {showLoginModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', overflow: 'hidden' }}>
                            {storeData?.logo_url ? (
                                <img src={storeData.logo_url} alt="Store Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <UserCircle2 size={32} color="#3b82f6" />
                            )}
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', color: '#0f172a' }}>Staff Access</h2>
                        <p style={{ color: '#64748b', marginBottom: '32px' }}>Enter your 4-digit PIN to switch profiles.</p>

                        <input
                            type="password"
                            value={loginPin}
                            onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            placeholder="••••"
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '24px', textAlign: 'center', letterSpacing: '0.4em', marginBottom: '16px', outline: 'none' }}
                            autoFocus
                        />
                        {staffError && <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>{staffError}</p>}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button onClick={() => { setShowLoginModal(false); setLoginPin(''); setStaffError(''); }} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleStaffLogin} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#0f172a', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Login</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
