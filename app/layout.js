import './globals.css';

export const metadata = {
  title: "Adel'Store — Sari-Sari Store SME",
  description: 'AdelStore sari-sari store: affordable, complete, neighbor-friendly. Online catalog + POS + Inventory.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ceb">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <a href="/" className="logo">
              🏪 Adel&apos;Store <span className="badge">SME • Sari-Sari</span>
            </a>
            <div className="links">
              <a href="/">Home</a>
              <a href="/products">Products</a>
              <a href="/lista">Credit</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/pos">POS</a>
              <a href="/admin">Admin</a>
              <a href="/cart" className="cart-btn">
                🛒 Cart <span id="cart-count" />
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <b>🏪 Adel&apos;Store</b> — Affordable, Complete, Neighbor-friendly.
            <div className="muted" style={{ marginTop: 6 }}>
              Open daily 6AM – 10PM • Cash / GCash / Credit (regulars) • Neighborhood delivery available
            </div>
          </div>
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `function u(){try{var c=JSON.parse(localStorage.getItem('adel_cart')||'[]');var n=c.reduce((s,i)=>s+i.qty,0);var el=document.getElementById('cart-count');if(el)el.textContent=n>0?'('+n+')':'';}catch(e){}};u();window.addEventListener('adel-cart-update',u);window.addEventListener('storage',u);`,
          }}
        />
      </body>
    </html>
  );
}
