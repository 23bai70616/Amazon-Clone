import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reusing some base styles but will customize components
import { useNotification } from '../context/NotificationContext';

const Register = () => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginUser } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`;
      const res = await axios.post(url, { name, identifier, password });

      if (res.data.token) {
        loginUser(res.data.user, res.data.token);
        showNotification('Account created successfully!', 'success');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        <h1>Create Account</h1>

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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your name</label>
            <input
              type="text"
              placeholder="First and last name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile number or email</label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              minLength="6"
            />
            <div className="password-hint">
              <i className="fas fa-info-circle"></i> Passwords must be at least 6 characters.
            </div>
          </div>

          <button type="submit" className="login-signin-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Verify mobile number'}
          </button>
        </form>

        <div className="login-terms">
          By creating an account, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
        </div>

        <div className="login-divider-reg"></div>

        <div className="login-already-account">
          Already have an account? <Link to="/login" className="login-link">Sign in <i className="fas fa-caret-right"></i></Link>
        </div>

        <div className="login-business-account">
          Buying for work? <a href="#">Create a free business account</a>
        </div>
      </div>

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

export default Register;
