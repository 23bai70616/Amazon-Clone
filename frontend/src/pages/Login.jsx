import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); // 1: Enter ID, 2: Enter Password/OTP
  const [useOtp, setUseOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginUser } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    if (!identifier) {
      setError('Enter your email or mobile phone number');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const base = import.meta.env.VITE_API_URL;
      const apiBase = base ? (base.endsWith('/api') ? base : `${base}/api`) : 'http://localhost:5000/api';
      const url = `${apiBase}/auth/request-otp`;
      const res = await axios.post(url, { identifier });
      setUseOtp(true);
      showNotification('OTP sent successfully (Simulated)', 'success');
      // For demo, we might auto-fill the OTP or show it in a real app check console
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const base = import.meta.env.VITE_API_URL;
      const baseUrl = base ? (base.endsWith('/api') ? base : `${base}/api`) : 'http://localhost:5000/api';
      const url = useOtp ? `${baseUrl}/auth/verify-otp` : `${baseUrl}/auth/login`;
      const payload = useOtp ? { identifier, code: otpCode } : { identifier, password };

      const res = await axios.post(url, payload);

      if (res.data.token) {
        loginUser(res.data.user, res.data.token);
        showNotification('Signed in successfully', 'success');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Link to="/" className="login-logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
        <span>.in</span>
      </Link>

      <div className="login-container">
        <h1>Sign in</h1>

        {error && (
          <div className="auth-error-box">
            <div className="auth-error-content">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <h4>There was a problem</h4>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleContinue}>
            <div className="form-group">
              <label>Email or mobile phone number</label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-signin-btn">
              Continue
            </button>

            <p className="login-terms">
              By continuing, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
            </p>

            <div className="login-help-link">
              <i className="fas fa-caret-right" style={{ fontSize: '10px', color: '#767676', marginRight: '5px' }}></i>
              <a href="#" className="login-link" style={{ fontSize: '13px' }}>Need help?</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="login-id-display">
              {identifier} <span onClick={() => { setStep(1); setUseOtp(false); }} className="login-link">Change</span>
            </div>

            {!useOtp ? (
              <>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Password</label>
                    <a href="#" className="login-link" style={{ fontSize: '12px' }}>Forgot Password?</a>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <div className="login-show-password" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input type="checkbox" id="showPass" checked={showPassword} onChange={() => setShowPassword(!showPassword)} style={{ width: 'auto', margin: 0 }} />
                    <label htmlFor="showPass" style={{ fontSize: '13px', cursor: 'pointer' }}>Show password</label>
                  </div>
                </div>

                <button type="submit" className="login-signin-btn" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="login-otp-toggle">
                  <button type="button" className="login-register-btn" onClick={handleSendOtp} style={{ marginTop: '10px', width: '100%' }}>
                    {loading ? 'Sending...' : 'Get an OTP on your phone'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Enter OTP</label>
                    <span onClick={handleSendOtp} className="login-link" style={{ fontSize: '12px', cursor: 'pointer' }}>Resend OTP</span>
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    required
                    placeholder="6-digit code"
                    maxLength={6}
                  />
                  <div className="password-hint">OTP sent to your {identifier.includes('@') ? 'email' : 'mobile'}.</div>
                </div>

                <button type="submit" className="login-signin-btn" disabled={loading}>
                  {loading ? 'Verifying...' : 'Sign in'}
                </button>

                <button type="button" className="login-link" onClick={() => setUseOtp(false)} style={{ background: 'none', border: 'none', padding: '10px 0', width: '100%', fontSize: '13px' }}>
                  Sign in with password
                </button>
              </>
            )}
          </form>
        )}
      </div>

      {step === 1 && (
        <>
          <div className="login-divider">
            <span className="divider-text">New to Amazon?</span>
          </div>

          <Link to="/register" style={{ width: '350px' }}>
            <button className="login-register-btn">
              Create your Amazon account
            </button>
          </Link>
        </>
      )}

      <div className="login-footer">
        <div className="login-footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <p>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
      </div>
    </div>
  );
};

export default Login;
