"use client";
import React from 'react';

type Toast = { id: string; title?: string; description?: string; type?: 'success'|'error'|'info' };

const ToastContext = React.createContext<{
  toast: (t: Omit<Toast, 'id'>) => void;
  success: (t: Omit<Toast, 'id'>) => void;
  error: (t: Omit<Toast, 'id'>) => void;
  info: (t: Omit<Toast, 'id'>) => void;
} | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }){
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const push = (t: Omit<Toast,'id'>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2,8);
    setToasts(prev => [...prev, { id, ...t }]);
    // auto dismiss
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3800);
  };

  const ctx = React.useMemo(() => ({
    toast: push,
    success: (t: Omit<Toast,'id'>) => push({ ...t, type: 'success' }),
    error: (t: Omit<Toast,'id'>) => push({ ...t, type: 'error' }),
    info: (t: Omit<Toast,'id'>) => push({ ...t, type: 'info' }),
  }), []);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={"w-80 p-3 rounded-lg shadow-md border "+
            (t.type === 'error' ? 'bg-red-50 border-red-200' : t.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200')}>
            {t.title ? <div className="font-semibold text-sm mb-1">{t.title}</div> : null}
            {t.description ? <div className="text-sm text-gray-700">{t.description}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
