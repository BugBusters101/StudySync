import { useState, useContext } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setIsNewUser, setUserId, setUserName } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setIsNewUser(data.isNewUser);
        setUserId(data.user_id);
        setUserName(data.first_name || '');
        navigate(data.isNewUser ? '/preferences' : '/dashboard');
      } else {
        setError(data.error || data.message || 'Invalid credentials');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-background">
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="auth-card">
          <div className="auth-form-pane">
            <h1 className="auth-heading">Sign in</h1>
            <p className="auth-subtext">
              Don't have an account?{' '}
              <button className="auth-link border-0 bg-transparent p-0" onClick={() => navigate('/signup')}>
                Create one
              </button>
            </p>

            {error && <div className="auth-alert-error">{error}</div>}

            <Form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label className="auth-label">Email</label>
                <div className="input-wrapper password-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    className="custom-input"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="auth-label" style={{ margin: 0 }}>Password</label>
                  <span style={{ fontSize: '0.8rem', color: '#818cf8', cursor: 'pointer' }}>Forgot password?</span>
                </div>
                <div className="input-wrapper password-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    className="custom-input pe-5"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={isLoading}>
                {isLoading
                  ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Signing in...</>
                  : 'Sign in'
                }
              </button>

              <div className="auth-divider">or</div>

              {/* <div className="google-btn-wrapper">
                <GoogleLoginButton />
              </div> */}
            </Form>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Login;