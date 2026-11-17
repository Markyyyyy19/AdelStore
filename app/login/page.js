'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [msg, setMsg] = useState('');

  function login(e) {
    e.preventDefault();
    if ((u === 'admin' && p === 'adel123') || (u === 'cashier' && p === 'pos123')) {
      localStorage.setItem('adel_auth', '1');
      window.location.href = '/admin';
    } else {
      setMsg('Incorrect login. Try admin / adel123');
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 480 }}>
      <h2>🔐 Login — Staff Only</h2>
      <form onSubmit={login} className="card">
        <div className="form-grid">
          <input placeholder="Username" value={u} onChange={(e) => setU(e.target.value)} />
          <input type="password" placeholder="Password" value={p} onChange={(e) => setP(e.target.value)} />
          <button className="btn btn-green">Login</button>
        </div>
        {msg && <div className="alert" style={{ marginTop: 8 }}>{msg}</div>}
        <div className="muted" style={{ marginTop: 10, fontSize: 13 }}>
          Demo accounts:<br />• admin / adel123 (full access)<br />• cashier / pos123 (POS)
        </div>
      </form>
    </div>
  );
}
