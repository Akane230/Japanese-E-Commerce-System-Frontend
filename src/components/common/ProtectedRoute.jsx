import React from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProtectedRoute component that checks authentication and redirects to auth page if needed
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Function} props.onNavigate - Navigation function from parent
 * @param {string} props.redirectTo - Page to redirect to after authentication (default: 'checkout')
 */
export function ProtectedRoute({ children, onNavigate, redirectTo = 'checkout' }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #f3f3f3', 
          borderTop: '3px solid #8b7355', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontSize: '14px' }}>Checking authentication...</p>
      </div>
    );
  }

  // If not authenticated, redirect to auth page with return URL
  if (!isAuthenticated) {
    // Store the intended destination for redirect after login
    localStorage.setItem('authRedirect', redirectTo);
    
    // Redirect to auth page
    onNavigate('auth');
    return null;
  }

  // If authenticated, render children
  return children;
}

// Add CSS for the spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
