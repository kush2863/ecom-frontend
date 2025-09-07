'use client'
import React from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(()=>{
    setLoading(true);
    api.fetchItems().then(setItems).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(i => <ItemCard key={i.id} item={i} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
