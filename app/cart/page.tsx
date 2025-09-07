"use client";
import React from 'react';
import Layout from '../../components/Layout';
import { CartContext } from '../../context/CartContext';
import api from '../../lib/api';
import { AuthContext } from '../../context/AuthContext';

export default function CartPage(){
  const { items, remove, add } = React.useContext(CartContext);
  const { token } = React.useContext(AuthContext);

  const subtotal = items.reduce((s, it) => s + ((it.item?.price ?? 0) * it.quantity), 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Your cart</h2>
          {items.length === 0 ? (
            <div className="p-6 bg-white rounded shadow text-center">Your cart is empty</div>
          ) : (
            <div className="space-y-4">
              {items.map(it => (
                <div key={it.itemId} className="flex gap-4 items-center bg-white p-4 rounded shadow-sm">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {it.item?.image ? <img src={it.item.image} alt={it.item?.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{it.item?.title || it.itemId}</div>
                    {it.item?.description ? <div className="text-sm text-gray-600">{it.item.description}</div> : null}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border rounded">
                        <button onClick={() => add(it.itemId, -1)} className="px-3 py-1">-</button>
                        <div className="px-4">{it.quantity}</div>
                        <button onClick={() => add(it.itemId, 1)} className="px-3 py-1">+</button>
                      </div>
                      <button onClick={() => remove(it.itemId)} className="text-sm text-red-600">Remove</button>
                    </div>
                  </div>

                  <div className="text-right w-28">
                    <div className="font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((it.item?.price ?? 0) * it.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium mb-4">Order summary</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <div>Items ({items.length})</div>
            <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}</div>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-bold text-lg">Total <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}</span></div>
            <button className="w-full mt-4 bg-sky-600 text-white py-2 rounded hover:bg-sky-700">Continue to checkout</button>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
