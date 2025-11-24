import React, { useState, FormEvent } from 'react';

type Props = {
  onLogin?: (token: string) => void;
  onSwitchToSignup?: () => void;
};

export default function LoginForm({ onLogin, onSwitchToSignup }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.message || 'Login failed');
        setLoading(false);
        return;
      }

      const data = await res.json().catch(() => ({} as any));
      const token = data?.data?.token ??  '';
      if (!token) {
        console.warn('Login response missing token', data);
        setError('No token returned from server');
        setLoading(false);
        return;
      }

      try {
        localStorage.setItem('fc_token', token);
      } catch {
      }
      onLogin?.(token);
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      id="login-form"
      onSubmit={handleSubmit}
      className="w-full max-w-md p-6 bg-[color:var(--surface)] rounded shadow"
    >
      <h2 className="text-lg font-semibold mb-4">Sign in</h2>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <label className="block mb-3">
        <div className="text-sm muted mb-1">Email</div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="block mb-4">
        <div className="text-sm muted mb-1">Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="••••••••"
          required
        />
      </label>

      <div className="flex items-center justify-between mb-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail('demo@example.com');
            setPassword('password');
          }}
          className="text-sm text-[color:var(--accent)]"
        >
          Demo
        </button>
      </div>

      <div className="text-sm muted">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-[color:var(--accent)] hover:underline"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
