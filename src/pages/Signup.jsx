import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import { supabase } from '../supabaseClient';

const Signup = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (signupError) throw signupError;

            if (data?.user) {
                // If the user is successfully created, navigate to dashboard
                // Note: If email confirmation is ON in Supabase, the user might stay in 'unconfirmed' state
                // but since the user asked for "without verification", we assume it's OFF in dashboard.
                navigate('/dash');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <Background />
            <div className="auth-card">
                <div className="auth-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="/hoteltec.png" alt="Hoteltec Logo" style={{ height: '48px', objectFit: 'contain', marginBottom: '16px' }} />
                    <span className="auth-badge">Join Hoteltec</span>
                    <h1 className="auth-title">Create your account</h1>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '10px', marginBottom: '20px', color: '#b91c1c', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="name@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ marginTop: '12px', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Get Started'}
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <button className="btn-social">
                    Continue with Google
                </button>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
                    Already have an account? <button type="button" style={{ color: '#000', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit' }} onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
