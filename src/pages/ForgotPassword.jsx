import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import { supabase } from '../supabaseClient';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset

    // OTP Input State
    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const inputRefs = useRef([]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        // Generate a random 4-digit code
        const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

        try {
            // 1. Check if user exists in our DB (optional but good practice)
            // 2. Store OTP in our custom table
            const { error: otpError } = await supabase.from('otp_codes').upsert({
                email,
                code: generatedCode,
                expires_at: new Date(Date.now() + 10 * 60000).toISOString(), // 10 minutes
            });
            if (otpError) throw otpError;

            // 3. Send email via Supabase RPC
            const { error: rpcError } = await supabase.rpc('send_otp_email', {
                email_to: email,
                otp_code: generatedCode
            });
            if (rpcError) throw rpcError;

            setMessage('Verification code sent to ' + email);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const userInput = otpValues.join('');

        if (userInput.length < 4) {
            setError('Please enter the full 4-digit code.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Check custom otp_codes table
            const { data: otpData, error: otpError } = await supabase
                .from('otp_codes')
                .select('*')
                .eq('email', email)
                .single();

            if (otpError || !otpData || otpData.code !== userInput) {
                throw new Error('Invalid or expired verification code.');
            }

            // 2. Manually Update the password in Supabase via RPC
            const { error: resetError } = await supabase.rpc('reset_user_password', {
                user_email: email,
                new_password: newPassword
            });
            if (resetError) throw new Error('Password reset failed: ' + resetError.message);

            // 3. Success - Clean up and notify
            await supabase.from('otp_codes').delete().eq('email', email);
            setMessage('Password updated successfully! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP Input Changes
    const handleOtpChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
        if (value && index < 3) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="auth-wrapper">
            <Background />
            <div className="auth-card">
                <div className="auth-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="/hoteltec.png" alt="Hoteltec Logo" style={{ height: '48px', objectFit: 'contain', marginBottom: '16px' }} />
                    <span className="auth-badge">Security</span>
                    <h1 className="auth-title">Reset password</h1>
                    <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '14px', lineHeight: '1.5', textAlign: 'center' }}>
                        {step === 1 ? "Enter your email and we'll send you a 4-digit code to reset your password." : "Enter the code and your new password."}
                    </p>
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
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '12px' }} disabled={loading}>
                            {loading ? 'Sending code...' : 'Send Reset Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group" style={{ textAlign: 'center' }}>
                            <label className="form-label">Verification Code</label>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '16px 0' }}>
                                {otpValues.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        style={{ width: '45px', height: '55px', fontSize: '20px', textAlign: 'center', fontWeight: 'bold', borderRadius: '8px', border: '2px solid #e2e8f0', outline: 'none' }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '12px' }} disabled={loading}>
                            {loading ? 'Resetting...' : 'Update Password'}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
                    Remember your password? <button type="button" style={{ color: '#000', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit' }} onClick={() => navigate('/login')}>Back to login</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
