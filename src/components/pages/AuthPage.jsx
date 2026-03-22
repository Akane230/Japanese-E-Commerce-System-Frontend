import React, { useState, useRef } from "react";
import "../../styles/auth.css";
import { Petals } from "../auth/Petals";
import { Toast } from "../auth/Toast";
import { AuthPanel } from "../auth/AuthPanel";
import { LoginForm } from "../auth/LoginForm";
import { SignupForm } from "../auth/SignupForm";
import { SuccessScreen } from "../auth/SuccessScreen";

export default function AuthPage({ onNavigate }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [success, setSuccess] = useState(null); // { email, name } after auth
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Get the redirect destination from localStorage
  const getRedirectDestination = () => {
    const redirect = localStorage.getItem("authRedirect");
    localStorage.removeItem("authRedirect"); // Clean up after use
    return redirect || "home";
  };

  const showToast = (message, type = "info") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type, leaving: false });
    toastTimer.current = setTimeout(() => {
      setToast((t) => (t ? { ...t, leaving: true } : null));
      setTimeout(() => setToast(null), 300);
    }, 3000);
  };

  const handleSuccess = (user) => {
    setSuccess({ ...user, mode });
  };

  const handleSwitch = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
  };

  return (
    <>
      <Petals />

      <div className="auth-root">
        <AuthPanel mode={success ? "done" : mode} />

        <div className="auth-form-side">
          {success ? (
            <SuccessScreen
              user={success}
              mode={success.mode}
              onContinue={() => {
                const destination = getRedirectDestination();
                showToast(
                  `Redirecting to ${destination === "checkout" ? "checkout" : "shop"}…`,
                  "success",
                );
                if (onNavigate) onNavigate(destination);
              }}
            />
          ) : mode === "login" ? (
            <LoginForm
              key="login"
              onSwitch={handleSwitch}
              onSuccess={handleSuccess}
              showToast={showToast}
            />
          ) : (
            <SignupForm
              key="signup"
              onSwitch={handleSwitch}
              onSuccess={handleSuccess}
              showToast={showToast}
            />
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          leaving={toast.leaving}
        />
      )}
    </>
  );
}
