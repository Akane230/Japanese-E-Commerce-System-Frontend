import React, { useState } from 'react';
import { Field } from './Field';
import { PasswordField } from './PasswordField';
import { Icons } from './icons/icons';
import { useAuth } from '../../hooks/useAuth';
import { getApiErrorMessage } from '../../utils/api';

export const SignupForm = ({ onSwitch, onSuccess, showToast }) => {
  const { register } = useAuth();
  const [fields, setFields] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirm: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed]   = useState(false);

  const set = (k, v) => {
    setFields(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!fields.firstName.trim())             e.firstName = 'First name required.';
    if (!fields.lastName.trim())              e.lastName  = 'Last name required.';
    if (!fields.email)                        e.email     = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = 'Enter a valid email.';
    if (!fields.password)                     e.password  = 'Password is required.';
    else if (fields.password.length < 8)      e.password  = 'Minimum 8 characters.';
    else if (!/[A-Z]/.test(fields.password))  e.password  = 'Include at least one uppercase letter.';
    else if (!/\d/.test(fields.password))     e.password  = 'Include at least one number.';
    if (fields.confirm !== fields.password)   e.confirm   = 'Passwords do not match.';
    if (!agreed)                              e.terms     = 'You must accept the terms.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const baseUsername = (fields.email.split("@")[0] || "user").replace(/[^a-zA-Z0-9_.-]/g, "");
      const payload = {
        username: baseUsername || "user",
        email: fields.email,
        password: fields.password,
        password_confirm: fields.confirm,
        first_name: fields.firstName,
        last_name: fields.lastName,
        phone_number: fields.phone || undefined,
      };
      const data = await register(payload);
      const user = data?.user || { email: fields.email, name: fields.firstName };
      if (onSuccess) onSuccess(user);
      if (showToast) showToast('Account created! You are now logged in.', 'success');
    } catch (err) {
      const msg = getApiErrorMessage(
        err,
        'Unable to create account. Please check your details.'
      );
      if (showToast) showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key="signup" className="form-card">
      <div className="tab-switcher fade-up">
        <button className="tab-btn active">Sign Up</button>
        <button className="tab-btn" onClick={onSwitch}>Login</button>
      </div>

      <div className="form-heading fade-up-1">
        <h1 className="form-title">Create account 🌸</h1>
        <p className="form-subtitle">Join thousands of Japanese food lovers worldwide</p>
      </div>

      <div className="fade-up-2">
        <div className="field-row">
          <Field
            label="First Name"
            icon={Icons.User}
            value={fields.firstName}
            onChange={v => set('firstName', v)}
            placeholder="Kenji"
            error={errors.firstName}
          />
          <Field
            label="Last Name"
            icon={Icons.User}
            value={fields.lastName}
            onChange={v => set('lastName', v)}
            placeholder="Tanaka"
            error={errors.lastName}
          />
        </div>
      </div>

      <div className="fade-up-3">
        <Field
          label="Email Address"
          icon={Icons.Mail}
          type="email"
          value={fields.email}
          onChange={v => set('email', v)}
          placeholder="you@example.com"
          error={errors.email}
        />
      </div>

      <div className="fade-up-3">
        <Field
          label="Phone Number (optional)"
          icon={Icons.Phone}
          value={fields.phone}
          onChange={v => set('phone', v)}
          placeholder="+63 912 345 6789"
        />
      </div>

      <div className="fade-up-4">
        <PasswordField
          label="Password"
          value={fields.password}
          onChange={v => set('password', v)}
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          error={errors.password}
          showStrength
        />
      </div>

      <div className="fade-up-4">
        <PasswordField
          label="Confirm Password"
          value={fields.confirm}
          onChange={v => set('confirm', v)}
          placeholder="Repeat your password"
          error={errors.confirm}
        />
      </div>

      <div className="fade-up-4">
        <label className="checkbox-row" onClick={() => { setAgreed(!agreed); setErrors(p => ({ ...p, terms: '' })); }}>
          <div className={`checkbox-box ${agreed ? 'checked' : ''}`}>
            {agreed && <Icons.Check />}
          </div>
          <span className="checkbox-text">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            {errors.terms && <span style={{ color: '#e05a5a', display: 'block', marginTop: 3 }}>{errors.terms}</span>}
          </span>
        </label>
      </div>

      <div className="fade-up-5">
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          <div className="btn-ripple" />
          {loading ? <div className="spinner" /> : <><span>Create My Account</span><Icons.Arrow /></>}
        </button>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">or sign up with</span>
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
          Already have an account?
          <button className="switch-link" onClick={onSwitch}>Login here</button>
        </p>
      </div>
    </div>
  );
}