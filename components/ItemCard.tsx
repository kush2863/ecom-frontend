"use client";
import React from 'react';
import {Button} from './ui/button';
import { useRouter } from 'next/navigation';
import { CartContext } from '../context/CartContext';

export default function ItemCard({ item }: { item: any }){
  const router = useRouter();
  const { add } = React.useContext(CartContext);
  const priceNum = typeof item.price === 'number' ? item.price : Number(item.price || 0);
  const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceNum);

  return (
    <div className="bg-white border rounded-lg p-3 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      {item.image ? (
        <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">No image</div>
      )}

      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
        {item.description ? <p className="text-sm text-gray-600 mb-3">{item.description}</p> : null}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-slate-900">{priceStr}</div>
        <div className="flex gap-2">
          <button onClick={() => router.push(`/items/${item.id}`)} className="text-sm px-3 py-1 border rounded text-slate-700 hover:bg-slate-50">View</button>
          <button onClick={() => add(item.id)} className="text-sm px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600">Add</button>
        </div>
      </div>
    </div>
  );
}
