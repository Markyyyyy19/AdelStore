'use client';
import { useEffect, useState } from 'react';
import { peso } from '@/lib/store';

function gate() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('adel_auth') === '1';
}

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suki, setSuki] = useState([]);
  const [settings, setSettings] = useState({ store_name: '', gcash_name: '', gcash_number: '', address: '', hours: '' });
  const [tab, setTab] = useState('dashboard');
  const [form, setForm] = useState({ name: '', category: 'General', price: '', cost: '', stock: '', unit: 'pcs', emoji: '🛒', description: '' });
  const [editing, setEditing] = useState(null);
  const [payAmt, setPayAmt] = useState({});

  async function loadAll() {
    const [s, p, o, l, st] = await Promise.all([
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/lista').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ]);
    setStats(s);
    setProducts(p.products || []);
    setOrders(o.orders || []);
    setSuki(l.suki || []);
    setSettings(st);
  }

  useEffect(() => {
    if (!gate()) { window.location.href = '/login'; return; }
    loadAll();
  }, []);

  async function saveProduct(e) {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing } : form;
    await fetch('/api/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setForm({ name: '', category: 'General', price: '', cost: '', stock: '', unit: 'pcs', emoji: '🛒', description: '' });
    setEditing(null);
    loadAll();
  }

  async function del(id) {
    if (!confirm('Delete this product?')) return;
    await fetch('/api/products?id=' + id, { method: 'DELETE' });
    loadAll();
  }

  async function saveSettings(e) {
    e.preventDefault();
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    alert('Settings saved! GCash QR updated.');
    loadAll();
  }

  async function bayad(name) {
    const amt = Number(payAmt[name] || 0);
    if (!amt || amt <= 0) return alert('Please enter an amount.');
    const res = await fetch('/api/lista', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, amount: amt }) });
    const d = await res.json();
    if (!res.ok) return alert(d.error || 'Failed');
    setPayAmt({ ...payAmt, [name]: '' });
    loadAll();
  }

  if (typeof window !== 'undefined' && !gate()) return <div className="container section">Redirecting to login...</div>;

  const maxDay = Math.max(1, ...(stats?.salesByDay || []).map((d) => d.total));

  return (
    <div className="container section">
      <h2>🔧 Admin Dashboard — Adel&apos;Store</h2>
      <div className="toolbar">
        {['dashboard', 'inventory', 'orders', 'lista', 'settings', 'add'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`btn btn-sm ${tab === t ? 'btn-green' : 'btn-dark'}`}>{t.toUpperCase()}</button>
        ))}
        <button className="btn btn-sm btn-yellow" onClick={() => { localStorage.removeItem('adel_auth'); window.location.href = '/'; }}>Logout</button>
      </div>

      {tab === 'dashboard' && stats && (
        <>
          <div className="kpi">
            <div className="card"><div className="muted">Products</div><div className="num">{stats.totalProducts}</div></div>
            <div className="card"><div className="muted">Today&apos;s Sales</div><div className="num" style={{ color: '#15803d' }}>{peso(stats.todaySales)}</div></div>
            <div className="card"><div className="muted">Total Sales</div><div className="num">{peso(stats.totalSales)}</div></div>
            <div className="card"><div className="muted">Orders</div><div className="num">{stats.totalOrders}</div></div>
            <div className="card"><div className="muted">Low Stock ⚠️</div><div className="num" style={{ color: '#dc2626' }}>{stats.lowStock}</div></div>
            <div className="card"><div className="muted">Credit Outstanding 📒</div><div className="num" style={{ color: '#ea580c' }}>{peso(stats.listaTotal)}</div><div className="muted" style={{ fontSize: 12 }}>{stats.sukiCount} customers with balance</div></div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
            <div className="card">
              <h3>📊 Sales — Last 7 Days</h3>
              <div className="chart">
                {(stats.salesByDay || []).map((d) => (
                  <div key={d.date} className="bar-wrap">
                    <div className="bar-val">{d.total > 0 ? `₱${Math.round(d.total)}` : ''}</div>
                    <div className="bar" style={{ height: `${Math.max(4, (d.total / maxDay) * 110)}px` }} />
                    <div className="bar-label">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>🏆 Top Sellers (by qty)</h3>
              {(stats.topProducts || []).length === 0 && <div className="muted">No sales yet — head to the POS!</div>}
              {(stats.topProducts || []).map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f4' }}>
                  <span>{i + 1}. {t.name}</span>
                  <b>{t.qty} sold</b>
                </div>
              ))}
            </div>
          </div>

          {stats.lowItems?.length > 0 && (
            <div className="alert" style={{ marginTop: 12 }}>⚠️ Running low: {stats.lowItems.map((i) => `${i.emoji} ${i.name} (${i.stock})`).join(' • ')}</div>
          )}
          <h3>Recent orders</h3>
          <table>
            <thead><tr><th>#</th><th>Customer</th><th>Payment</th><th>Total</th><th>Date</th></tr></thead>
            <tbody>
              {stats.recent?.map((o) => (
                <tr key={o.id}><td>#{o.id}</td><td>{o.customer_name}</td><td>{o.payment}</td><td>{peso(o.total)}</td><td>{o.created_at}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'inventory' && (
        <table>
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Cost</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.emoji} {p.name}</td>
                <td>{p.category}</td>
                <td>{peso(p.price)}</td>
                <td>{peso(p.cost)}</td>
                <td style={{ color: p.stock <= 10 ? 'red' : 'inherit', fontWeight: 700 }}>{p.stock} {p.unit}</td>
                <td>
                  <button className="btn btn-sm btn-yellow" onClick={() => { setEditing(p.id); setForm({ ...p, price: String(p.price), cost: String(p.cost), stock: String(p.stock) }); setTab('add'); }}>Edit</button>{' '}
                  <button className="btn btn-sm btn-dark" onClick={() => del(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'orders' && (
        <table>
          <thead><tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customer_name}<br /><span className="muted">{o.phone}</span></td>
                <td>{o.items?.map((i) => `${i.qty}x ${i.product_name}`).join(', ')}</td>
                <td><b>{peso(o.total)}</b></td>
                <td>{o.payment}</td>
                <td className="muted">{o.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'lista' && (
        <>
          <div className="kpi">
            <div className="card"><div className="muted">Total Outstanding</div><div className="num" style={{ color: '#ea580c' }}>{peso(suki.reduce((s, x) => s + (x.balance || 0), 0))}</div></div>
            <div className="card"><div className="muted">Customers with balance</div><div className="num">{suki.filter((s) => s.balance > 0).length}</div></div>
          </div>
          <table>
            <thead><tr><th>Customer</th><th>Phone</th><th>Balance</th><th>Last update</th><th>Payment</th></tr></thead>
            <tbody>
              {suki.map((s) => (
                <tr key={s.name}>
                  <td><b>{s.name}</b></td>
                  <td className="muted">{s.phone}</td>
                  <td style={{ color: s.balance > 0 ? '#dc2626' : '#15803d', fontWeight: 900 }}>{peso(s.balance)}</td>
                  <td className="muted">{s.updated_at}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input type="number" placeholder="₱ amount" value={payAmt[s.name] || ''} onChange={(e) => setPayAmt({ ...payAmt, [s.name]: e.target.value })} style={{ width: 110 }} />
                      <button className="btn btn-sm btn-green" onClick={() => bayad(s.name)}>Pay</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {suki.length === 0 && <div className="success" style={{ marginTop: 10 }}>No outstanding credit — all clear! 🎉</div>}
        </>
      )}

      {tab === 'settings' && (
        <form onSubmit={saveSettings} className="card">
          <h3>⚙️ Store + GCash Settings</h3>
          <div className="form-grid">
            <input placeholder="Store name" value={settings.store_name || ''} onChange={(e) => setSettings({ ...settings, store_name: e.target.value })} />
            <input placeholder="GCash name" value={settings.gcash_name || ''} onChange={(e) => setSettings({ ...settings, gcash_name: e.target.value })} />
            <input placeholder="GCash number" value={settings.gcash_number || ''} onChange={(e) => setSettings({ ...settings, gcash_number: e.target.value })} />
            <input placeholder="Address" value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            <input placeholder="Hours" value={settings.hours || ''} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} />
            <button className="btn btn-green">💾 Save Settings</button>
          </div>
          <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>These appear on the GCash QR (Cart + POS) and receipts.</div>
        </form>
      )}

      {tab === 'add' && (
        <form onSubmit={saveProduct} className="card">
          <h3>{editing ? `Edit #${editing}` : '➕ New Product'}</h3>
          <div className="form-grid">
            <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['General', 'Rice & Essentials', 'Canned Goods', 'Noodles', 'Snacks', 'Drinks', 'Milk & Coffee', 'Household'].map((c) => <option key={c}>{c}</option>)}
              </select>
              <input placeholder="Emoji" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} style={{ width: 80 }} />
              <input placeholder="Unit (pcs/can...)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={{ width: 120 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input type="number" step="0.01" placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
              <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn btn-green">{editing ? 'Save changes' : 'Add product'}</button>
          </div>
        </form>
      )}
    </div>
  );
}
