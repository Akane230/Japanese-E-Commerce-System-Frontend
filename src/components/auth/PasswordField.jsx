import React, { useState } from 'react';
import { Icons } from './icons/icons';
import { getStrength } from '../../utils/passwordStrength';

export const PasswordField = ({ label, value, onChange, placeholder, error, showStrength }) => {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getStrength(value) : null;
  const filled = strength?.score || 0;
  const cls = strength?.cls || '';

  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className="field-wrap">
        <span className="field-icon"><Icons.Lock /></span>
        <input
          className={`field-input${error ? ' error' : ''}`}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingRight: 44 }}
          autoComplete="new-password"
        />
        <button className="field-eye" type="button" onClick={() => setShow(!show)}>
          {show ? <Icons.EyeOff /> : <Icons.Eye />}
        </button>
      </div>
      {error && <div className="field-error"><span>⚠</span> {error}</div>}
      {showStrength && value && (
        <div className="pw-strength">
          {[1, 2, 3].map(i => (
            <div key={i} className={`pw-bar ${i <= filled ? `filled-${cls}` : ''}`} />
          ))}
          <span className={`pw-label ${cls}`}>{strength.label}</span>
        </div>
      )}
    </div>
  );
}