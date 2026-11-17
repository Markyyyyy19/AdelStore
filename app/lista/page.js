'use client';
import { useEffect, useState } from 'react';
import { peso } from '@/lib/store';

export default function ListaPage() {
  const [suki, setSuki] = useState([]);
  const [search, setSearch] = useState('');

  async function load() {
    const r = await fetch('/api/lista').then((x) => x.json());
    setSuki(r.suki || []);
  }
  useEffect(() => { load(); }, []);

  const filtered = suki.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const total = suki.reduce((sum, x) => sum + (x.balance || 0), 0);

  return (
    <div className="container section">
      <h2>📒 Customer Credit Ledger</h2>
      <div className="muted">Transparent credit tracker — pay at the store or via GCash.</div>
      <div className="kpi">
        <div className="card"><div className="muted">Total outstanding</div><div className="num" style={{ color: '#ea580c' }}>{peso(total)}</div></div>
        <div className="card"><div className="muted">Customers with balance</div><div className="num">{suki.filter((s) => s.balance > 0).length}</div></div>
      </div>
      <div className="toolbar">
        <input placeholder="🔍 Search customer..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <a className="btn btn-green btn-sm" href="/admin">Admin → Record payment</a>
      </div>
      <table>
        <thead><tr><th>Customer</th><th>Balance</th><th>Last update</th></tr></thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.name}>
              <td><b>{s.name}</b></td>
              <td style={{ fontWeight: 900, color: s.balance > 0 ? '#dc2626' : '#15803d' }}>{peso(s.balance)}</td>
              <td className="muted">{s.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <div className="success" style={{ marginTop: 10 }}>No outstanding credit — all clear! 🎉</div>}
    </div>
  );
}
