import { useState, useContext } from 'react';
import { Form, Spinner, ProgressBar } from 'react-bootstrap';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';
import './Auth.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setIsNewUser, setUserId, setUserName } = useContext(AuthContext);

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.match(/[A-Z]/)) score += 25;
    if (pass.match(/[0-9]/)) score += 25;
    if (pass.match(/[^A-Za-z0-9]/)) score += 25;
    return score;
  };
  const strength = calculateStrength(password);
  const getStrengthProps = () => {
    if (strength <= 25) return { variant: 'danger', label: 'Weak' };
    if (strength <= 50) return { variant: 'warning', label: 'Fair' };
    if (strength <= 75) return { variant: 'info', label: 'Good' };
    return { variant: 'success', label: 'Strong' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (strength < 75) return setError('Use 8+ chars, an uppercase letter, and a number.');
    setIsLoading(true);
    setError('');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname: firstName, lastname: lastName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setIsNewUser(true);
        setUserId(data.user_id);
        setUserName(data.first_name || '');
        setSuccess('Account created! Redirecting...');
        setTimeout(() => navigate('/preferences'), 1200);
      } else {
        setError(data.error || data.message || 'Signup failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-background">
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="auth-card">
          <div className="auth-form-pane">
            <h1 className="auth-heading">Create account</h1>
            <p className="auth-subtext">
              Already have an account?{' '}
              <button className="auth-link border-0 bg-transparent p-0" onClick={() => navigate('/login')}>
                Sign in
              </button>
            </p>

            {error && <div className="auth-alert-error">{error}</div>}
            {success && <div className="auth-alert-success">{success}</div>}

            <Form onSubmit={handleSubmit}>
              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                <div>
                  <label className="auth-label">First name</label>
                  <div className="input-wrapper password-wrapper">
                    <FiUser className="input-icon" />
                    <input className="custom-input" type="text" required placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="auth-label">Last name</label>
                  <input className="custom-input" style={{ paddingLeft: '16px' }} type="text" required placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label className="auth-label">Email</label>
                <div className="input-wrapper password-wrapper">
                  <FiMail className="input-icon" />
                  <input className="custom-input" type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1rem' }}>
                <label className="auth-label">Password</label>
                <div className="input-wrapper password-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    className="custom-input pe-5"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
                {password.length > 0 && (
                  <div style={{ marginTop: '6px' }}>
                    <ProgressBar now={strength} variant={getStrengthProps().variant} style={{ height: '4px', borderRadius: '2px', backgroundColor: '#1e2741' }} />
                    <small style={{ color: '#64748b', fontSize: '0.78rem' }}>{getStrengthProps().label}</small>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="auth-label">Confirm password</label>
                <div className="input-wrapper password-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    className="custom-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={isLoading || !!success}>
                {isLoading
                  ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Creating account...</>
                  : 'Create account'
                }
              </button>

              <div className="auth-divider">or</div>

              <div className="google-btn-wrapper">
                <GoogleLoginButton />
              </div>
            </Form>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
          By signing up, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Signup;