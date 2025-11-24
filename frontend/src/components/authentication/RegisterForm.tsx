import React, { useState, FormEvent } from 'react';

type Props = {
  onRegister?: (token: string) => void;
  onSwitchToLogin?: () => void;
};

export default function RegisterForm({ onRegister, onSwitchToLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.message || 'Registration failed');
        setLoading(false);
        return;
      }
      const data = await res.json().catch(() => ({} as any));
      const token = data?.data?.token ??  '';
      if (!token) {
        console.warn('Register response missing token', data);
        setError('No token returned from server');
        setLoading(false);
        return;
      }
      try {
        localStorage.setItem('fc_token', token);
      } catch {}
      onRegister?.(token);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-[color:var(--surface)] rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Create account</h2>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <label className="block mb-3">
        <div className="text-sm muted mb-1">Name</div>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
      </label>

      <label className="block mb-3">
        <div className="text-sm muted mb-1">Email</div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
      </label>

      <label className="block mb-4">
        <div className="text-sm muted mb-1">Password</div>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
      </label>

      <div className="flex items-center justify-between mb-3">
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-[color:var(--accent)] text-[color:var(--accent-foreground)]">
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <button type="button" onClick={onSwitchToLogin} className="text-sm text-[color:var(--accent)] hover:underline">
          Sign in
        </button>
      </div>
    </form>
  );
}
