import React from 'react';
import { Icons } from './icons/icons';

export const SuccessScreen = ({ user, mode, onContinue }) => {
  return (
    <div className="form-card">
      <div className="success-screen fade-up">
        <div className="success-icon">✓</div>
        <h2 className="success-title">
          {mode === 'login' ? `Welcome back, ${user.name}!` : `You're in, ${user.name}!`}
        </h2>
        <p className="success-sub">
          {mode === 'login'
            ? "You've successfully logged in. Your Japanese favourites are waiting."
            : "Your さくらShop account is ready. Start exploring authentic Japanese goods shipped worldwide."}
        </p>
        <button className="submit-btn" onClick={onContinue} style={{ maxWidth: 280, margin: '0 auto' }}>
          <div className="btn-ripple" />
          <span>Go to Shop</span>
          <Icons.Arrow />
        </button>
      </div>
    </div>
  );
}