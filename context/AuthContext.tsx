"use client";
import React from 'react';
import api from '../lib/api';
import { useToast } from '../components/ToastProvider';

type User = { id: string; email: string } | null;

export const AuthContext = React.createContext({
  user: null as User,
  token: null as string | null,
  setAuth: (u: User, t?: string | null) => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  // Initialize to safe defaults during SSR. Hydrate from localStorage on the client.
  const [user, setUser] = React.useState<User>(null);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    try { const raw = localStorage.getItem('user'); if (raw) setUser(JSON.parse(raw)); } catch { /* ignore */ }
    try { const t = localStorage.getItem('token'); if (t) setToken(t); } catch { /* ignore */ }
  }, []);

  React.useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  React.useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  function setAuth(u: User, t?: string | null) { setUser(u); setToken(t || null); try { toast?.success({ title: 'Signed in', description: u?.email }); } catch(_){} }
  function logout() { setUser(null); setToken(null); try { toast?.success({ title: 'Logged out' }); } catch(_){} }

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
