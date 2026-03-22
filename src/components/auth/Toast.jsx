import React from 'react';

export function Toast({ message, type, leaving }) {
  const icons = { error: '✕', success: '✓', info: 'ℹ' };
  return (
    <div className={`toast ${type} ${leaving ? 'leaving' : ''}`}>
      <span>{icons[type] || 'ℹ'}</span>
      {message}
    </div>
  );
}