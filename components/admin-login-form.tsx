'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not sign in.');
      router.replace('/admin');
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="space-y-4">
    <label className="block text-sm text-gray-300" htmlFor="admin-password">Admin password</label>
    <input id="admin-password" type="password" autoComplete="current-password" required value={password}
      onChange={event => setPassword(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-[#0a0e14] px-4 py-3 text-white outline-none focus:border-[#00e6e6]" />
    {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    <button disabled={busy} className="w-full rounded-lg bg-[#00e6e6] px-4 py-3 font-bold text-[#0a0e14] transition hover:bg-[#00c2c2] disabled:opacity-50">
      {busy ? 'Signing in…' : 'Sign in'}
    </button>
  </form>;
}
