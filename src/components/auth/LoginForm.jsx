import React, { useState } from 'react';
import { Field } from './Field';
import { PasswordField } from './PasswordField';
import { Icons } from './icons/icons';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/api';

export const LoginForm = ({ onSwitch, onSuccess, showToast }) => {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [remember, setRemember] = useState(false);

  const validate = () => {
    const e = {};
    if (!email)                          e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!password)                        e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const data = await login({ email, password });
      const user = data?.user || { email, name: email.split('@')[0] };
      if (onSuccess) onSuccess(user);
      if (showToast) showToast('Logged in successfully.', 'success');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Invalid email or password.');
      if (showToast) showToast(msg, 'error');
      setErrors({ password: 'Incorrect credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key="login" className="form-card">
      <div className="tab-switcher fade-up">
        <button className="tab-btn" onClick={onSwitch}>Sign Up</button>
        <button className="tab-btn active">Login</button>
      </div>

      <div className="form-heading fade-up-1">
        <h1 className="form-title">Welcome back 👋</h1>
        <p className="form-subtitle">Login to your さくらShop account</p>
      </div>

      <div className="fade-up-2">
        <Field
          label="Email Address"
          icon={Icons.Mail}
          type="email"
          value={email}
          onChange={v => { setEmail(v); setErrors(p => ({ ...p, email: '' })); }}
          placeholder="you@example.com"
          error={errors.email}
        />
      </div>

      <div className="fade-up-3">
        <PasswordField
          label="Password"
          value={password}
          onChange={v => { setPassword(v); setErrors(p => ({ ...p, password: '' })); }}
          placeholder="Enter your password"
          error={errors.password}
        />
        <div className="forgot-row">
          <button className="forgot-link" type="button">Forgot password?</button>
        </div>
      </div>

      <div className="fade-up-3" style={{ marginBottom: 4 }}>
        <label className="checkbox-row" onClick={() => setRemember(!remember)}>
          <div className={`checkbox-box ${remember ? 'checked' : ''}`}>
            {remember && <Icons.Check />}
          </div>
          <span className="checkbox-text">Keep me signed in for 7 days</span>
        </label>
      </div>

      <div className="fade-up-4">
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          <div className="btn-ripple" />
          {loading ? <div className="spinner" /> : <><span>Login to Account</span><Icons.Arrow /></>}
        </button>
      </div>

      <div className="fade-up-5">
        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">or continue with</span>
          <div className="divider-line" />
        </div>
        <div className="social-row">
          <button className="social-btn" onClick={() => showToast('Google OAuth coming soon', 'info')}>
            <Icons.Google /> Google
          </button>
          <button className="social-btn" onClick={() => showToast('Facebook OAuth coming soon', 'info')}>
            <Icons.Facebook /> Facebook
          </button>
        </div>
        <p className="switch-text">
          Don't have an account?
          <button className="switch-link" onClick={onSwitch}>Sign up free</button>
        </p>
      </div>
    </div>
  );
}