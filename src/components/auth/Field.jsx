import React from 'react';

export const Field = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, error, success, children }) => {
  return (
    <div className="field-group">
      {label && <label className="field-label">{label}</label>}
      <div className="field-wrap">
        {Icon && <span className="field-icon"><Icon /></span>}
        <input
          className={`field-input${error ? ' error' : ''}${success ? ' success' : ''}`}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={!Icon ? { paddingLeft: 14 } : {}}
          autoComplete="off"
        />
        {children}
      </div>
      {error && <div className="field-error"><span>⚠</span> {error}</div>}
    </div>
  );
}