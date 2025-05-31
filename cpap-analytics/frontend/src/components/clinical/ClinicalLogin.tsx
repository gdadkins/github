import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { api } from '../../services/api';
import './ClinicalLogin.css';

const ClinicalLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        // Register logic would go here
        setError('Registration coming soon');
      } else {
        const response = await api.login(formData.username, formData.password);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          setUser(response.user);
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clinical-login-container">
      <div className="login-background">
        <div className="medical-pattern"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">⚕️</div>
              <h1 className="logo-text">CPAP Analytics</h1>
            </div>
            <p className="tagline">Professional Sleep Therapy Management</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="form-title">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </h2>

            {isRegistering && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  required
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">{isRegistering ? 'Username' : 'Username'}</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="testuser"
                required
                className="form-input"
              />
            </div>

            {isRegistering && (
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doctor@clinic.com"
                  required
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="form-input"
              />
            </div>

            {isRegistering && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>
            )}

            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                isRegistering ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="switch-mode">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="link-button"
              >
                {isRegistering ? 'Sign In' : 'Create Account'}
              </button>
            </p>
            
            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials</p>
              <div className="demo-info">
                <span>Username: testuser</span>
                <span>Password: password123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h3>Trusted by Healthcare Professionals</h3>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">📊</div>
              <h4>Clinical Analytics</h4>
              <p>Evidence-based insights for optimal therapy outcomes</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h4>HIPAA Compliant</h4>
              <p>Enterprise-grade security for patient data protection</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📋</div>
              <h4>Insurance Ready</h4>
              <p>Automated compliance reports for all major insurers</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🤖</div>
              <h4>AI-Powered</h4>
              <p>Machine learning algorithms for predictive therapy adjustments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalLogin;