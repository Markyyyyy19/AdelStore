'use client';
import { useEffect, useState } from 'react';
import { getCart, saveCart, cartTotal, clearCart, peso } from '@/lib/store';
import Receipt from '@/app/components/Receipt';
import GcashQR from '@/app/components/GcashQR';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('cash');
  const [msg, setMsg] = useState('');
  const [lastOrder, setLastOrder] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    setCart(getCart());
    const h = () => setCart(getCart());
    window.addEventListener('adel-cart-update', h);
    fetch('/api/settings').then((r) => r.json()).then(setSettings).catch(() => {});
    return () => window.removeEventListener('adel-cart-update', h);
  }, []);

  function updateQty(id, qty) {
    let c = getCart();
    if (qty <= 0) c = c.filter((i) => i.id !== id);
    else c = c.map((i) => (i.id === id ? { ...i, qty } : i));
    saveCart(c);
    setCart(c);
  }

  async function checkout(e) {
    e.preventDefault();
    setMsg('');
    if (cart.length === 0) return setMsg('Your cart is still empty.');
    if (payment === 'credit' && !name.trim()) return setMsg('Please enter a name for credit orders.');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_name: name || 'Walk-in', phone, payment, items: cart.map((c) => ({ id: c.id, qty: c.qty })) }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || 'Checkout failed');
    setLastOrder({ order_id: data.order_id, total: data.total, payment, customer_name: name || 'Walk-in', phone, items: cart });
    clearCart();
    setCart([]);
    setMsg(`✅ Order #${data.order_id} received! Total ${peso(data.total)}. Thanks for shopping at Adel'Store!`);
  }

  return (
    <div className="container section">
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 && !lastOrder && <div className="muted">Nothing here yet. <a href="/products" style={{ color: '#15803d', fontWeight: 800 }}>Shop here →</a></div>}
      {cart.map((i) => (
        <div key={i.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div className="emoji" style={{ fontSize: 28, width: 48, height: 48 }}>{i.emoji}</div>
          <div style={{ flex: 1 }}>
            <b>{i.name}</b>
            <div className="muted">{peso(i.price)} /{i.unit}</div>
          </div>
          <input type="number" min="0" value={i.qty} onChange={(e) => updateQty(i.id, Number(e.target.value))} style={{ width: 70 }} />
          <b>{peso(i.qty * i.price)}</b>
        </div>
      ))}
      {cart.length > 0 && (
        <form onSubmit={checkout} className="card" style={{ marginTop: 16 }}>
          <h3>Checkout — Total: {peso(cartTotal())}</h3>
          <div className="form-grid">
            <input placeholder="Name (e.g. Juan Dela Cruz)" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Phone / GCash number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option value="cash">💵 Cash</option>
              <option value="gcash">📱 GCash</option>
              <option value="credit">📒 Credit (regulars)</option>
            </select>
            {payment === 'gcash' && <GcashQR settings={settings} amount={cartTotal()} />}
            <button className="btn btn-green">✅ Place Order</button>
          </div>
          {msg && <div className={msg.startsWith('✅') ? 'success' : 'alert'} style={{ marginTop: 10 }}>{msg}</div>}
        </form>
      )}
      {msg && cart.length === 0 && <div className="success" style={{ marginTop: 12 }}>{msg}</div>}
      {lastOrder && (
        <div style={{ marginTop: 16 }}>
          <h3>🧾 Receipt</h3>
          <Receipt order={lastOrder} settings={settings} />
        </div>
      )}
    </div>
  );
}
