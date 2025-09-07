"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Header(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = React.useContext(AuthContext);
  const { items } = React.useContext(CartContext);

  const initial = (searchParams?.get('q') || '');
  const [value, setValue] = React.useState(initial);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    // keep header input in sync when route params change
    setValue(searchParams?.get('q') || '');
  }, [searchParams]);

  function navigateWithQuery(q: string) {
    const url = q ? `/items?q=${encodeURIComponent(q)}` : '/items';
    router.push(url);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>){
    const v = e.target.value;
    setValue(v);
    if (timer.current) window.clearTimeout(timer.current);
    // debounce navigation by 400ms
    timer.current = window.setTimeout(() => navigateWithQuery(v), 400);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
    if (e.key === 'Enter') {
      if (timer.current) window.clearTimeout(timer.current);
      navigateWithQuery(value);
    }
  }

  return (
    <header className="w-full mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 p-4 bg-white/90 backdrop-blur-sm shadow-md rounded-lg">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 text-white flex items-center justify-center font-extrabold">E</span>
            <span className="text-lg font-semibold text-slate-800">Ecom</span>
          </Link>
          <nav className="hidden sm:flex gap-4 ml-4">
            <Link href="/items" className="text-sm text-gray-700 hover:text-sky-600">Items</Link>
            <Link href="/about" className="text-sm text-gray-700 hover:text-sky-600">About</Link>
          </nav>
        </div>

        <div className="flex-1 px-4">
          <div className="hidden md:block">
            <input
              type="search"
              placeholder="Search products..."
              className="w-full max-w-xl bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="text-sm text-gray-700 hover:text-sky-600">Cart ({items.length})</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-semibold">{(user.email || '').charAt(0).toUpperCase()}</div>
                <div className="text-sm text-slate-800">{user.email}</div>
              </div>
              <button onClick={logout} className="text-sm text-gray-700 hover:text-red-600">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-gray-700 hover:text-sky-600">Login</Link>
              <Link href="/signup" className="text-sm bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
