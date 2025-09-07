"use client";
import React from 'react';
import api from '../lib/api';
import { AuthContext } from './AuthContext';
import { useToast } from '../components/ToastProvider';

type CartItem = { itemId: string; quantity: number; item?: any };

export const CartContext = React.createContext({
  items: [] as CartItem[],
  add: (itemId: string, qty?: number) => {},
  remove: (itemId: string) => {},
  clear: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = React.useContext(AuthContext);
  const toast = useToast();
  const [items, setItems] = React.useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // When token appears, sync with server
  React.useEffect(() => {
    if (!token) return;
    let mounted = true;
    api.getCart(token).then(server => {
      if (!mounted) return;
      if (server?.items) setItems(server.items.map((it: any) => ({ itemId: it.itemId, quantity: it.quantity, item: it.item })));
    }).catch(() => {});
    return () => { mounted = false; };
  }, [token]);

  // Ensure each cart entry has the full `item` object for UI (title/image). Fetch missing ones.
  React.useEffect(() => {
    let mounted = true;
    const missing = items.filter(it => !it.item).map(it => it.itemId);
    if (missing.length === 0) return;
    (async () => {
      try {
        const results = await Promise.all(missing.map(id => api.fetchItem(id).catch(() => null)));
        if (!mounted) return;
        setItems(prev => prev.map(p => {
          if (p.item) return p;
          const idx = missing.indexOf(p.itemId);
          if (idx === -1) return p;
          const fetched = results[idx];
          return fetched ? { ...p, item: fetched } : p;
        }));
      } catch (e) {
        // ignore fetch errors
      }
    })();
    return () => { mounted = false; };
  }, [items]);

  // `qty` is a delta (can be negative). Positive adds, negative subtracts.
  function add(itemId: string, qty = 1) {
    // compute expected new quantity (best-effort) so we can pick the right toast
    const existing = items.find(p => p.itemId === itemId);
    const expectedNewQty = existing ? existing.quantity + qty : qty;

    setItems(prev => {
      const i = prev.find(p => p.itemId === itemId);
      if (i) {
        const newQty = i.quantity + qty;
        if (newQty <= 0) {
          // remove the item when quantity drops to zero or below
          return prev.filter(p => p.itemId !== itemId);
        }
        return prev.map(p => p.itemId === itemId ? { ...p, quantity: newQty } : p);
      }
      if (qty <= 0) return prev; // nothing to do
      return [...prev, { itemId, quantity: qty }];
    });
    // optimistic UI: fetch item details so cart shows name/image immediately
    api.fetchItem(itemId).then(item => {
      setItems(prev => prev.map(p => p.itemId === itemId ? { ...p, item } : p));
    }).catch(() => {});
    if (token) api.addToCart(itemId, qty, token).catch((e) => {
      try { toast?.error({ title: 'Cart error', description: e.message || 'Failed to add to cart' }); } catch(_){ }
    });

    // Show an appropriate toast depending on whether we added or subtracted
    try {
      if (qty > 0) {
        toast?.success({ title: 'Added to cart', description: qty === 1 ? 'Product added' : `${qty} items added` });
      } else if (qty < 0) {
        if (expectedNewQty <= 0) {
          toast?.success({ title: 'Removed', description: 'Item removed from cart' });
        } else {
          toast?.info({ title: 'Quantity updated', description: 'Product quantity decreased' });
        }
      }
    } catch(_){}
  }

  function remove(itemId: string) {
    setItems(prev => prev.filter(p => p.itemId !== itemId));
    if (token) api.removeFromCart(itemId, token).catch((e) => {
      try { toast?.error({ title: 'Cart error', description: e.message || 'Failed to remove item' }); } catch(_){}
    });
    try { toast?.success({ title: 'Removed', description: 'Item removed from cart' }); } catch(_){}
  }

  function clear() { setItems([]); if (token) { /* ideally call server clear endpoint */ } }

  return (
    <CartContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}
