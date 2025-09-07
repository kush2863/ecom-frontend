"use client";
import React from 'react';
import Layout from '../../../components/Layout';
import {Input} from '../../../components/ui/input';
import {Button} from '../../../components/ui/button';
import api from '../../../lib/api';
import { loginSchema } from '../../../lib/validations';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import { useToast } from '../../../components/ToastProvider';

export default function LoginPage(){
  const router = useRouter();
  const { setAuth } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const toast = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // client-side validation
    try {
      loginSchema.parse({ email, password });
    } catch (err: any) {
      const first = err?.errors?.[0]?.message || 'Invalid input';
      setError(first);
      try { toast.error?.({ title: 'Validation error', description: first }); } catch(_){}
      setLoading(false);
      return;
    }
    try {
      const res = await api.login(email.trim(), password);
      setAuth(res.user, res.token);
      router.push('/items');
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      setError(msg);
      try { toast.error?.({ title: 'Login error', description: msg }); } catch(_){}
    } finally { setLoading(false); }
  }

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Sign in to your account</h2>
          <p className="text-sm text-gray-600 mb-4">Enter your email and password to continue.</p>
          {error ? <div className="mb-3 text-sm text-red-600">{error}</div> : null}
          <form onSubmit={submit} className="grid gap-3">
            <label className="text-sm">Email</label>
            <input className="border px-3 py-2 rounded" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <label className="text-sm">Password</label>
            <input className="border px-3 py-2 rounded" placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

            <button type="submit" className="w-full mt-2 bg-sky-600 text-white py-2 rounded hover:bg-sky-700">{loading ? 'Signing in...' : 'Sign in'}</button>
            <div className="text-sm text-center text-gray-600">Don't have an account? <a href="/auth/signup" className="text-sky-600">Create one</a></div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
