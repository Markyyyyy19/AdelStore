'use client';
import { useEffect, useState } from 'react';
import { peso } from '@/lib/store';
import Receipt from '@/app/components/Receipt';
import GcashQR from '@/app/components/GcashQR';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState('cash');
  const [customer, setCustomer] = useState('');
  const [msg, setMsg] = useState('');
  const [lastOrder, setLastOrder] = useState(null);
  const [settings, setSettings] = useState(null);

  async function load() {
    const res = await fetch('/api/products?search=' + encodeURIComponent(search));
    const d = await res.json();
    setProducts(d.products || []);
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [search]);
  useEffect(() => { fetch('/api/settings').then((r) => r.json()).then(setSettings).catch(() => {}); }, []);

  function add(p) {
    setCart((c) => {
      const f = c.find((x) => x.id === p.id);
      if (f) return c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { id: p.id, name: p.name, price: p.price, emoji: p.emoji, qty: 1 }];
    });
  }

  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

  async function checkout() {
    setMsg('');
    if (!cart.length) return;
    if (payment === 'credit' && !customer.trim()) return setMsg('Please enter a customer name for credit sales.');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_name: customer || 'Walk-in POS', phone: '', payment, items: cart }),
    });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || 'Failed');
    setLastOrder({ order_id: d.order_id, total: d.total, payment, customer_name: customer || 'Walk-in POS', phone: '', items: cart });
    setMsg(`✅ Paid! Order #${d.order_id} — ${peso(d.total)} (${payment}). Thank you!`);
    setCart([]);
    setCustomer('');
    load();
  }

  return (
    <div className="container section">
      <h2>🧾 POS — Cashier Mode</h2>
      <div className="muted">Fast checkout for the store. Just click a product to add it.</div>
      <div className="admin-layout" style={{ marginTop: 12, gridTemplateColumns: '1fr 320px' }}>
        <div>
          <input placeholder="🔍 Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {products.map((p) => (
              <button key={p.id} onClick={() => add(p)} className="card" style={{ textAlign: 'left', cursor: 'pointer' }} disabled={p.stock <= 0}>
                <div style={{ fontSize: 30 }}>{p.emoji}</div>
                <b style={{ fontSize: 13 }}>{p.name}</b>
                <div className="price">{peso(p.price)}</div>
                <div className="stock">Stock: {p.stock}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gap: 12, height: 'fit-content', position: 'sticky', top: 70 }}>
          <div className="card">
            <h3>🧺 Current Sale</h3>
            {cart.map((i) => (
              <div key={i.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span>{i.emoji}</span>
                <span style={{ flex: 1, fontSize: 13 }}><b>{i.qty}x</b> {i.name}</span>
                <b>{peso(i.qty * i.price)}</b>
                <button className="btn btn-sm btn-dark" onClick={() => setCart((c) => c.filter((x) => x.id !== i.id))}>x</button>
              </div>
            ))}
            {cart.length === 0 && <div className="muted">No items yet. Click products on the left.</div>}
            <hr />
            <h2>Total: {peso(total)}</h2>
            <input placeholder="Customer name (required for credit)" value={customer} onChange={(e) => setCustomer(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
            <select value={payment} onChange={(e) => setPayment(e.target.value)} style={{ width: '100%', marginBottom: 8 }}>
              <option value="cash">💵 Cash</option>
              <option value="gcash">📱 GCash</option>
              <option value="credit">📒 Credit</option>
            </select>
            {payment === 'gcash' && total > 0 && <GcashQR settings={settings} amount={total} />}
            <button className="btn btn-green" style={{ width: '100%', marginTop: 8 }} onClick={checkout}>✅ Charge</button>
            <button className="btn btn-dark btn-sm" style={{ width: '100%', marginTop: 6 }} onClick={() => setCart([])}>Clear</button>
            {msg && <div className={msg.startsWith('✅') ? 'success' : 'alert'} style={{ marginTop: 8 }}>{msg}</div>}
          </div>
          {lastOrder && <Receipt order={lastOrder} settings={settings} />}
        </div>
      </div>
    </div>
  );
}
