"use client";
import React from 'react';
import Layout from '../../../components/Layout';
import api from '../../../lib/api';
import { useParams } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { CartContext } from '../../../context/CartContext';

export default function ItemPage(){
  const { id } = useParams() as { id: string };
  const [item, setItem] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [qty, setQty] = React.useState(1);
  const { add } = React.useContext(CartContext);

  React.useEffect(()=>{
    let mounted = true;
    if (!id) return;
    setLoading(true);
    api.fetchItem(id).then(data => { if (!mounted) return; setItem(data); }).catch(()=>{}).finally(()=>{ if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <Layout><div className="min-h-[60vh] flex items-center justify-center">Loading product...</div></Layout>;
  if (!item) return <Layout><div className="min-h-[60vh] flex items-center justify-center">Product not found</div></Layout>;

  const price = typeof item.price === 'number' ? item.price : Number(item.price || 0);
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const productId = item.id ?? item._id ?? id;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
        <div className="bg-white rounded shadow p-4 flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-[420px] object-contain" />
          ) : (
            <div className="w-full h-[420px] bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
          )}
        </div>

        <div className="bg-white rounded shadow p-6">
          <h1 className="text-2xl font-semibold mb-2">{item.title}</h1>
          {item.subtitle ? <div className="text-sm text-gray-600 mb-3">{item.subtitle}</div> : null}
          <div className="text-2xl font-bold text-slate-900 mb-4">{formatted}</div>
          {item.description ? <p className="text-sm text-gray-700 mb-6">{item.description}</p> : null}

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border rounded">
              <button aria-label="decrease" onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2">-</button>
              <div className="px-4">{qty}</div>
              <button aria-label="increase" onClick={() => setQty(q => q + 1)} className="px-3 py-2">+</button>
            </div>
            <Button onClick={() => add(productId, qty)} className="bg-sky-600">Add to cart</Button>
          </div>

          <div className="text-sm text-gray-500">SKU: <span className="font-medium">{productId}</span></div>
        </div>
      </div>
    </Layout>
  );
}
