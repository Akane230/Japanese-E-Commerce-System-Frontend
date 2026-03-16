import React from 'react';

export const AuthPanel = ({ mode }) => {
  return (
    <div className="auth-panel">
      <div className="panel-glow panel-glow-1" />
      <div className="panel-glow panel-glow-2" />

      <div className="panel-logo">
        <div className="panel-logo-icon">🌸</div>
        <div>
          <div className="panel-logo-text">さくらShop</div>
          <div className="panel-logo-sub">Japan to the World</div>
        </div>
      </div>

      <h2 className="panel-headline">
        {mode === 'login'
          ? <>Taste the Spirit<br />of <em>Japan</em></>
          : <>Join the Journey<br />to <em>Japan</em></>
        }
      </h2>

      <p className="panel-sub">
        {mode === 'login'
          ? 'Welcome back. Your favourite Japanese goods are waiting — from Uji matcha to Wagyu delicacies.'
          : 'Discover authentic Japanese artisan foods, teas, and seasonal delicacies — shipped worldwide to your door.'
        }
      </p>

      <div className="panel-stats">
        <div className="stat-item">
          <div className="stat-num">500+</div>
          <div className="stat-label">Products</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">50+</div>
          <div className="stat-label">Countries</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">12K+</div>
          <div className="stat-label">Customers</div>
        </div>
      </div>

      <div className="panel-dots">
        <div className={`panel-dot ${mode === 'login' ? 'active' : ''}`} />
        <div className={`panel-dot ${mode === 'signup' ? 'active' : ''}`} />
        <div className="panel-dot" />
      </div>
    </div>
  );
}