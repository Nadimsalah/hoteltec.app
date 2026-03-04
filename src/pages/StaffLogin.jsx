import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UserCircle2, ArrowRight } from 'lucide-react';

const StaffLogin = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const { data, error } = await supabase
                    .from('stores')
                    .select('name, logo_url')
                    .eq('id', storeId)
                    .single();

                if (data) setStoreData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [storeId]);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (!username || !pin) {
            setError('Please enter both username and PIN');
            return;
        }

        const list = JSON.parse(localStorage.getItem(`hoteltec_staff_${storeId}`) || '[]');

        // Find matching staff member
        const staffMember = list.find(s =>
            s.name.toLowerCase() === username.toLowerCase() &&
            s.pin === pin
        );

        if (staffMember) {
            // Save active staff session locally
            localStorage.setItem(`hoteltec_active_${storeId}`, staffMember.id);
            localStorage.setItem('hoteltec_active_store', storeId);
            navigate('/dash');
        } else {
            setError('Invalid username or PIN code');
        }
    };

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>Loading Hotel Portal...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', width: '100%', maxWidth: '440px', padding: '48px 40px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        {storeData?.logo_url ? (
                            <img src={storeData.logo_url} alt="Store Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <UserCircle2 size={40} color="#3b82f6" />
                        )}
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', textAlign: 'center' }}>
                        {storeData?.name || 'Hotel'} Staff Portal
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: 0, textAlign: 'center' }}>
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. john_staff"
                            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>4-Digit PIN</label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            placeholder="••••"
                            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '20px', letterSpacing: '0.2em', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{ background: '#0f172a', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', transition: 'transform 0.1s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Sign In <ArrowRight size={18} />
                    </button>
                    <a href="/login" style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', textDecoration: 'none', fontWeight: '600', marginTop: '8px' }}>← Back to Admin Login</a>
                </form>
            </div>
        </div>
    );
};

export default StaffLogin;
