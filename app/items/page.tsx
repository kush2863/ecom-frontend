"use client";
import React from 'react';
import Layout from '../../components/Layout';
import api from '../../lib/api';
import ItemCard from '../../components/ItemCard';
import { useRouter } from 'next/navigation';

export default function ItemsPage(){
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  // Use client-only URL parsing instead of useSearchParams to avoid SSR bailout.
  const [q, setQ] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [addedAfter, setAddedAfter] = React.useState('');

  React.useEffect(() => {
    try {
      const sp = new URL(window.location.href).searchParams;
      setQ(sp.get('q') || '');
      setMinPrice(sp.get('minPrice') || '');
      setMaxPrice(sp.get('maxPrice') || '');
      setAddedAfter(sp.get('addedAfter') || '');
    } catch (e) {
      // ignore on server or invalid URL
    }
  }, []);

  React.useEffect(()=>{
    setLoading(true);
    const filters: Record<string,string> = {};
    if (q) filters.q = q;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (addedAfter) filters.addedAfter = addedAfter;

    api.fetchItems(Object.keys(filters).length ? filters : undefined).then(data => {
      setItems(data || []);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, [q, minPrice, maxPrice, addedAfter]);

  function applyFilters() {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (addedAfter) params.set('addedAfter', addedAfter);
    const str = params.toString();
    router.push(`/items${str ? `?${str}` : ''}`);
  }

  function clearFilters() {
    setMinPrice(''); setMaxPrice(''); setAddedAfter('');
    router.push('/items' + (q ? `?q=${encodeURIComponent(q)}` : ''));
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-3">Showing results for: <span className="font-medium">{q || 'all products'}</span></div>

          <div className="bg-white border rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min price (USD)</label>
                <input inputMode="numeric" pattern="[0-9]*" value={minPrice} onChange={e=>setMinPrice(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full border px-3 py-2 rounded" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max price (USD)</label>
                <input inputMode="numeric" pattern="[0-9]*" value={maxPrice} onChange={e=>setMaxPrice(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full border px-3 py-2 rounded" placeholder="Any" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Added after</label>
                <input type="date" value={addedAfter} onChange={e=>setAddedAfter(e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={applyFilters} className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">Apply</button>
              <button onClick={clearFilters} className="border px-4 py-2 rounded text-gray-700">Clear</button>
            </div>
          </div>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(it => <ItemCard key={it.id || it._id} item={it} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
