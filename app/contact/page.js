'use client';
import { useEffect, useState } from 'react';
import GcashQR from '@/app/components/GcashQR';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  return (
    <div className="container section">
      <h2>📞 Contact / Order by Chat</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        <div className="card">
          <h3>🏪 Visit Us</h3>
          <div className="muted">{settings?.address || 'Purok 5, Barangay Center (near the chapel)'}<br />{settings?.hours || 'Open 6AM – 10PM daily'}</div>
        </div>
        <div className="card">
          <h3>📱 Text / Call / GCash</h3>
          <div className="muted">{settings?.gcash_number || '0951-XXX-XXXX'} (Smart)<br />GCash: {settings?.gcash_number || '0951-XXX-XXXX'} — {settings?.gcash_name || 'Adel S.'}<br />FB: Adel&apos;Store Official</div>
        </div>
        <div className="card">
          <h3>🛵 Delivery</h3>
          <div className="muted">Free delivery for ₱200+ orders within the neighborhood.<br />Just leave your address at cart checkout.</div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <GcashQR settings={settings} />
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>💬 Quick Order</h3>
        <div className="muted">Fastest way: go to the <a href="/products" style={{ fontWeight: 800, color: '#15803d' }}>Products page</a> → Add to Cart → Checkout. Automatically saved to inventory and sales reports.</div>
      </div>
    </div>
  );
}
