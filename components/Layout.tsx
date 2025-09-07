"use client";
import React from 'react';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }){
  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <Header />
      <main className="max-w-6xl mx-auto mt-4">{children}</main>
    </div>
  );
}
