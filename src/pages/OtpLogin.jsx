import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import { supabase } from '../supabaseClient';

const OtpLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP
    const [otpValues, setOtpValues] = useState(['', '', '', '']); // Assuming 4 numbers
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const inputRefs = useRef([]);

    // Step 1: Request OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false // Adjust to true if you want to allow signing up via OTP
                }
            });

            if (otpError) throw otpError;

            setMessage('OTP sent to your email! Please check your inbox.');
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP Input Changes
    const handleOtpChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return; // Only allow numbers

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to focus previous input
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const token = otpValues.join('');

        if (token.length < 4) {
            setError('Please enter the full 4-digit code.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'magiclink' // using 'magiclink' handles OTP logins via signInWithOtp
            });

            if (verifyError) throw verifyError;

            if (data?.session) {
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
                    <span className="auth-badge">Secure Authentication</span>
                    <h1 className="auth-title">{step === 1 ? 'Login with OTP' : 'Enter Verification Code'}</h1>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '10px', marginBottom: '20px', color: '#b91c1c', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                {message && (
                    <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '10px', marginBottom: '20px', color: '#047857', fontSize: '14px' }}>
                        {message}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="name@hotel.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading || !email}
                            style={{ opacity: loading ? 0.7 : 1, marginTop: '10px' }}
                        >
                            {loading ? 'Sending Code...' : 'Send OTP Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group" style={{ textAlign: 'center' }}>
                            <label className="form-label" style={{ marginBottom: '16px' }}>4-Digit Code sent to {email}</label>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '20px 0' }}>
                                {otpValues.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        style={{
                                            width: '56px',
                                            height: '64px',
                                            fontSize: '24px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Use a different email
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
                    Prefer password? <button type="button" style={{ color: '#000', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit' }} onClick={() => navigate('/login')}>Login here</button>
                </div>
            </div>
        </div>
    );
}

export default OtpLogin;
