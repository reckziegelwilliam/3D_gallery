'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/admin/editor');
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-white tracking-wider mb-2">
            Gallery Admin
          </h1>
          <p className="text-gray-500 text-sm">
            Enter password to access the layout editor
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 px-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Authenticating...' : 'Enter Admin'}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a
            href="/gallery"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Back to Gallery
          </a>
        </div>
      </div>
    </div>
  );
}

