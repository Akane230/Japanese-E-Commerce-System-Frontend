import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Icons } from '../common/Icons';

export function Navbar({ onNavigate }) {
  const { count, setIsOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: scrolled ? 'rgba(250,247,242,0.97)' : 'rgba(250,247,242,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${scrolled ? '#ddd3c4' : 'transparent'}`,
          transition: 'border-color 0.3s, background 0.3s',
          padding: '0 20px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 2px', flexShrink: 0 }}
          >
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #e8637a, #c9933a)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, boxShadow: '0 2px 8px rgba(232,99,122,0.4)',
            }}>🌸</div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontFamily: "'Noto Serif JP', serif", fontWeight: 700, fontSize: 17, color: '#1a1008', letterSpacing: '-0.01em' }}>さくら</div>
              <div style={{ fontSize: 9, color: '#b8aa98', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 1 }}>SHOP</div>
            </div>
          </button>

          {/* Thin divider */}
          <div style={{ width: 1, height: 24, background: '#e5ddd0', margin: '0 12px', flexShrink: 0 }} />

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 2, flex: 1 }}>
            {[
              ['Products', 'products'],
              ['Categories', 'categories'],
            ].map(([label, route]) => (
              <button
                key={route}
                onClick={() => onNavigate(route)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '7px 14px', borderRadius: 8,
                  fontSize: 13.5, fontWeight: 500, color: '#3d2415',
                  transition: 'background 0.15s, color 0.15s',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0ebe0'; e.currentTarget.style.color = '#1a1008'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#3d2415'; }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconBtn onClick={() => setShowSearch(!showSearch)} title="Search">
              <Icons.Search />
            </IconBtn>
            <IconBtn onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')} title="Account">
              <Icons.User />
            </IconBtn>
            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              style={{
                height: 38, padding: '0 16px',
                background: '#1a1008', border: 'none', borderRadius: 10,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                color: '#faf7f2', fontWeight: 700, fontSize: 13,
                position: 'relative', transition: 'background 0.2s, transform 0.15s',
                boxShadow: '0 2px 8px rgba(26,16,8,0.2)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3d2415'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1008'; e.currentTarget.style.transform = 'none'; }}
            >
              <Icons.Cart />
              <span style={{ fontSize: 13 }}>Cart</span>
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -7, right: -7,
                  width: 19, height: 19,
                  background: 'linear-gradient(135deg, #e8637a, #d44f67)',
                  borderRadius: '50%', fontSize: 10, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(232,99,122,0.5)',
                  animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          overflow: 'hidden',
          maxHeight: showSearch ? 56 : 0,
          opacity: showSearch ? 1 : 0,
          transition: 'max-height 0.25s ease, opacity 0.2s ease',
          paddingBottom: showSearch ? 12 : 0,
        }}>
          <input
            autoFocus={showSearch}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search Japanese products… 日本語も可"
            style={{
              width: '100%', padding: '10px 16px',
              border: '2px solid #e8637a', borderRadius: 12,
              fontSize: 14, outline: 'none',
              background: 'white', color: '#1a1008',
              fontFamily: 'inherit', boxSizing: 'border-box',
              boxShadow: '0 4px 16px rgba(232,99,122,0.12)',
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') { setShowSearch(false); onNavigate('products'); }
              if (e.key === 'Escape') setShowSearch(false);
            }}
          />
        </div>
      </nav>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.4); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

function IconBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 38, height: 38,
        background: 'transparent',
        border: '1.5px solid #e5ddd0',
        borderRadius: 10, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#3d2415', transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f0ebe0'; e.currentTarget.style.borderColor = '#c9b8a4'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e5ddd0'; e.currentTarget.style.transform = 'none'; }}
    >
      {children}
    </button>
  );
}