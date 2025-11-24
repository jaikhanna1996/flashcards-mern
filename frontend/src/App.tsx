import React, { useEffect, useState } from 'react';
import NavBar from './components/layout/NavBar';
import { getContrastColor } from './utils/color';
import LoginForm from './components/authentication/LoginForm';
import RegisterForm from './components/authentication/RegisterForm';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import './index.css';

export default function App() {
  const [status, setStatus] = useState<string>('loading');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('fc_token'));
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setStatus(`ok @ ${new Date(d.timestamp).toLocaleTimeString()}`))
      .catch(() => setStatus('failed'));
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fc_accent');
      if (saved) {
        document.documentElement.style.setProperty('--accent', saved);
        document.documentElement.style.setProperty('--accent-foreground', getContrastColor(saved));
      }
    } catch {
      console.log('failed to apply saved accent');
    }
  }, []);

  useEffect(() => {
    if (!authMode) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setAuthMode(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [authMode]);

  function handleLogin(token: string) {
    setIsAuthenticated(true);
    setAuthMode(null);
  }

  function handleRegister(token: string) {
    setIsAuthenticated(true);
    setAuthMode(null);
  }

  function handleLogout() {
    try {
      localStorage.removeItem('fc_token');
    } catch {}
    setIsAuthenticated(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--bg)] text-[color:var(--text)]">
      <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} onAuthOpen={(m) => setAuthMode(m)} />

      <main className="flex-1">
        {!isAuthenticated ? <Landing /> : <Dashboard />}
        {authMode && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={() => setAuthMode(null)}
            role="presentation"
          >
            <div className="w-full max-w-lg" onMouseDown={(e) => e.stopPropagation()}>
              {authMode === 'login' ? (
                <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setAuthMode('signup')} />
              ) : (
                <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
