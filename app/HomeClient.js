'use client';
import { addToCart, peso } from '@/lib/store';

export default function HomeClient({ products, categories }) {
  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="cat" style={{ background: '#fef9c3' }}>🏪 SME • Sari-Sari Store • Since 2020</div>
          <h1>
            Affordable, Complete,
            <br />
            Neighbor-Friendly.
          </h1>
          <p>
            Welcome to <b>Adel&apos;Store</b> — your trusted corner store. From rice and eggs to
            shampoo and soap, we have it all. Order online for pick-up or neighborhood delivery.
          </p>
          <div className="hero-cta">
            <a className="btn btn-yellow" href="/products">
              🛒 Shop Now
            </a>
            <a className="btn btn-outline" href="/about">
              Our Story
            </a>
            <a className="btn btn-white" href="/pos">
              🧾 POS Cashier
            </a>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }} className="muted">
            {(categories || []).map((c) => (
              <a key={c} href={`/products?cat=${encodeURIComponent(c)}`} style={{ background: 'rgba(255,255,255,.2)', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 13 }}>
                {c}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container section">
        <h2>🔥 Current Best-Sellers</h2>
        <div className="muted">Our regulars&apos; favorites — always fresh stocks.</div>
        <div className="grid products" style={{ marginTop: 14 }}>
          {products.map((p) => (
            <div key={p.id} className="card">
              <div className="emoji">{p.emoji}</div>
              <div className="cat">{p.category}</div>
              <b>{p.name}</b>
              <div className="muted" style={{ fontSize: 13 }}>{p.description}</div>
              <div className="price">{peso(p.price)} <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>/{p.unit}</span></div>
              <div className={`stock ${p.stock <= 10 ? 'low' : ''}`}>
                {p.stock <= 10 ? `⚠️ Low stock: ${p.stock}` : `Stock: ${p.stock}`}
              </div>
              <button className="btn btn-green btn-sm" onClick={() => { addToCart(p); alert(`${p.name} added to cart!`); }}>
                ➕ Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', marginTop: 28 }}>
          <div className="card">
            <h3>⏰ Open Daily 6AM – 10PM</h3>
            <div className="muted">Open every day including Sundays and holidays, for our neighbors.</div>
          </div>
          <div className="card">
            <h3>💸 Cash / GCash / Credit</h3>
            <div className="muted">Credit available for regulars, payable at month-end. Just ask!</div>
          </div>
          <div className="card">
            <h3>🛵 Free Nearby Delivery</h3>
            <div className="muted">Minimum ₱200 order within the neighborhood. Just message us on the contact page.</div>
          </div>
        </div>
      </div>
    </>
  );
}
