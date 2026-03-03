import React from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';

const ForgotPassword = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-wrapper">
            <Background />
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-badge">Security</span>
                    <h1 className="auth-title">Reset password</h1>
                    <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '14px', lineHeight: '1.5' }}>
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    // Handle password reset logic here
                }}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="name@company.com"
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
                        Send Reset Link
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
                    Remember your password? <button type="button" style={{ color: '#000', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit' }} onClick={() => navigate('/login')}>Back to login</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
