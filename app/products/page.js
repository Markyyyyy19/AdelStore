'use client';
import { useEffect, useState } from 'react';
import { addToCart, peso } from '@/lib/store';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState(['All']);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  async function load() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (cat && cat !== 'All') params.set('category', cat);
    const res = await fetch('/api/products?' + params.toString());
    const data = await res.json();
    setProducts(data.products || []);
    if (data.categories) setCats(['All', ...data.categories]);
  }

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('cat')) setCat(sp.get('cat'));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, cat]);

  useEffect(() => { load(); }, []);

  return (
    <div className="container section">
      <h2>🛒 All Products</h2>
      <div className="muted">Search and filter by category — sari-sari prices, store convenience.</div>
      <div className="toolbar">
        <input placeholder="🔍 Search: sardines, noodles, shampoo..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid products">
        {products.map((p) => (
          <div key={p.id} className="card">
            <div className="emoji">{p.emoji}</div>
            <div className="cat">{p.category}</div>
            <b>{p.name}</b>
            <div className="muted" style={{ fontSize: 13 }}>{p.description}</div>
            <div className="price">{peso(p.price)} <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>/{p.unit}</span></div>
            <div className={`stock ${p.stock <= 10 ? 'low' : ''}`}>{p.stock <= 0 ? '❌ Out of stock' : p.stock <= 10 ? `⚠️ Low stock: ${p.stock}` : `Stock: ${p.stock}`}</div>
            <button disabled={p.stock <= 0} className="btn btn-green btn-sm" onClick={() => { addToCart(p); alert('Added to cart!'); }}>
              ➕ Add to Cart
            </button>
          </div>
        ))}
      </div>
      {products.length === 0 && <div className="alert" style={{ marginTop: 16 }}>No results found. Try a different search.</div>}
    </div>
  );
}
